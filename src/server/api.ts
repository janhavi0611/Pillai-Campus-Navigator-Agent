import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./systemInstructions.ts";

const router = Router();

// Retrieve the Gemini API key from environment variables
const apiKey = process.env.GEMINI_API_KEY;

// Shared Gemini client instance (initialized lazily to avoid crashing on startup if the key is missing)
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Using offline mock navigation mode.");
      // Provide a friendly offline response if no API key is configured yet
      const lastMessage = messages[messages.length - 1]?.text || "";
      let offlineResponse = "👋 Hello! I am operating in offline demonstration mode since the GEMINI_API_KEY is not configured.\n\nTo navigate, please configure the API key in the Settings > Secrets panel.";
      
      if (lastMessage.toLowerCase().includes("canteen")) {
        offlineResponse = `📍 **Destination**: Canteen
📌 **Current Location**: Gate 1
🏢 **Floor**: Ground Floor
🧭 **Directions**:
1. Enter through Gate 1.
2. Walk straight past the Admission Enquiry desk.
3. Turn left at the Quad Area.
4. Continue past the Xerox shop; the Canteen is straight ahead.
⏱ **Estimated Walking Time**: 2 minutes
📍 **Nearby Landmarks**: Xerox Shop, Quad Area
💡 **Helpful Tip**: Try our famous local PCE special dishes at lunch hours!`;
      } else if (lastMessage.toLowerCase().includes("ai") || lastMessage.toLowerCase().includes("ml")) {
        offlineResponse = `📍 **Destination**: AI & ML Lab (P409)
📌 **Current Location**: Ground Floor Canteen
🏢 **Floor**: Fourth Floor
🧭 **Directions**:
1. Walk from the Canteen past the Library to the Central Lift.
2. Take the lift to the 4th Floor.
3. Turn right upon exiting the lift.
4. Walk down the corridor; the AI & ML Lab (P409) will be on your left next to the Robotic Lab.
⏱ **Estimated Walking Time**: 4 minutes
📍 **Nearby Landmarks**: Central Lift, Robotics Lab
💡 **Helpful Tip**: The AI & ML Lab is fully air-conditioned and open during college lab hours.`;
      } else if (lastMessage.toLowerCase().includes("placement")) {
        offlineResponse = `📍 **Destination**: Placement Cell (S004)
📌 **Current Location**: Gate 2
🏢 **Floor**: Ground Floor
🧭 **Directions**:
1. Enter through Gate 2.
2. Walk straight past the Quad Area.
3. The Placement Cell (S004) is on your right, next to the Principal's Office.
⏱ **Estimated Walking Time**: 1 minute
📍 **Nearby Landmarks**: Principal's Office, Fees Counter, Admission Enquiry
💡 **Helpful Tip**: Dress formally if visiting for placement support or interviews!`;
      } else if (lastMessage.toLowerCase().includes("washroom")) {
        offlineResponse = `📍 **Destination**: General Washroom
📌 **Current Location**: Unknown
🏢 **Floor**: Ground Floor
🧭 **Directions**:
1. If you are near the Quad Area, walk towards the Engineering Office.
2. Turn left at the corridor.
3. The general washrooms for males and females are located behind the staircase.
⏱ **Estimated Walking Time**: 1 minute
📍 **Nearby Landmarks**: Engineering Office, Ground Floor Staircase
💡 **Helpful Tip**: Washrooms are available on all floors near the central lifts and staircases.`;
      } else if (lastMessage.toLowerCase().includes("library")) {
        offlineResponse = `📍 **Destination**: Library
📌 **Current Location**: Gate 1
🏢 **Floor**: Ground Floor
🧭 **Directions**:
1. Enter through Gate 1.
2. Walk straight towards the central green Quad Area.
3. The Ground Floor Library entrance is located directly on your left with large glass doors.
⏱ **Estimated Walking Time**: 1.5 minutes
📍 **Nearby Landmarks**: Quad Area, Xerox Shop
💡 **Helpful Tip**: Silence is strictly observed. Keep your physical college ID card ready for scan entry.`;
      } else if (lastMessage.toLowerCase().includes("lost")) {
        offlineResponse = `No worries! I'll help you find your way. Could you tell me what you see nearby? 
Examples:
- Quad Area
- Library
- Lift
- Washroom
- Gate 1, 2, or 3
- Canteen
- Football Ground`;
      }

      return res.json({ text: offlineResponse });
    }

    // Map conversation messages to Gemini contents format
    const contents = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Initialize the client
    const ai = getAiClient();

    // Request response from Gemini model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // low temperature for precise navigation details
      },
    });

    const replyText = response.text || "I'm sorry, I couldn't generate a navigation route. Could you please specify your destination?";
    return res.json({ text: replyText });
  } catch (error: any) {
    console.error("Error in Gemini chat API route:", error);
    return res.status(500).json({
      error: "Failed to communicate with Pillai Navigator AI engine",
      details: error.message || error,
    });
  }
});

export default router;
