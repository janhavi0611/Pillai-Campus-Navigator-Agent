import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "./systemInstructions.js";

const router = Router();

// Shared Gemini client instance
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
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

    // Offline mode if no API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "GEMINI_API_KEY is not defined. Using offline mock navigation mode."
      );

      const lastMessage = messages[messages.length - 1]?.text || "";

      let offlineResponse =
        "👋 Hello! I am operating in offline demonstration mode since the GEMINI_API_KEY is not configured.\n\nPlease configure your Gemini API key in the .env file.";

      if (lastMessage.toLowerCase().includes("canteen")) {
        offlineResponse = `📍 Destination: Canteen

📌 Current Location: Gate 1

🏢 Floor: Ground Floor

🧭 Directions:
1. Enter through Gate 1.
2. Walk straight past the Admission Enquiry desk.
3. Turn left at the Quad Area.
4. Continue past the Xerox shop.
5. The Canteen will be straight ahead.

⏱ Estimated Walking Time: 2 minutes.`;
      } else if (
        lastMessage.toLowerCase().includes("ai") ||
        lastMessage.toLowerCase().includes("ml")
      ) {
        offlineResponse = `📍 Destination: AI & ML Lab (P409)

🏢 Floor: Fourth Floor

🧭 Directions:
1. Walk to the Central Lift.
2. Go to the 4th Floor.
3. Turn right.
4. AI & ML Lab is beside the Robotics Lab.`;
      } else if (lastMessage.toLowerCase().includes("placement")) {
        offlineResponse = `📍 Destination: Placement Cell (S004)

🏢 Ground Floor

🧭 Directions:
1. Enter through Gate 2.
2. Walk straight.
3. Placement Cell is beside the Principal's Office.`;
      } else if (lastMessage.toLowerCase().includes("library")) {
        offlineResponse = `📍 Destination: Library

🏢 Ground Floor

🧭 Directions:
1. Enter through Gate 1.
2. Walk towards the Quad.
3. Library entrance is on the left.`;
      } else if (lastMessage.toLowerCase().includes("washroom")) {
        offlineResponse = `🚻 Washrooms are available on every floor near the staircases and central lift.`;
      } else if (lastMessage.toLowerCase().includes("lost")) {
        offlineResponse = `No worries 😊

Tell me what you can see nearby.

Examples:
• Gate 1
• Gate 2
• Library
• Lift
• Quad Area
• Canteen
• Football Ground`;
      }

      return res.json({ text: offlineResponse });
    }

    // Convert messages to Gemini format
    const contents = messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    return res.json({
      text:
        response.text ||
        "I'm sorry, I couldn't generate a navigation route.",
    });
  } catch (error: any) {
    console.error("Error in Gemini chat API route:", error);

    return res.status(500).json({
      error: "Failed to communicate with Pillai Navigator AI engine",
      details: error.message || String(error),
    });
  }
});

export default router;