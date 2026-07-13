import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../src/server/systemInstructions.js";

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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    // Offline mode if no API key
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not defined. Using offline mock navigation mode.");

      const lastMessage = messages[messages.length - 1]?.text || "";
      let offlineResponse =
        "👋 Hello! I am operating in offline demonstration mode since the GEMINI_API_KEY is not configured.\n\nPlease configure your Gemini API key in the Vercel Environment Variables.";

      if (lastMessage.toLowerCase().includes("canteen")) {
        offlineResponse = `📍 Destination: Canteen\n\n📌 Current Location: Gate 1\n\n🏢 Floor: Ground Floor\n\n🧭 Directions:\n1. Enter through Gate 1.\n2. Walk straight past the Admission Enquiry desk.\n3. Turn left at the Quad Area.\n4. Continue past the Xerox shop.\n5. The Canteen will be straight ahead.\n\n⏱ Estimated Walking Time: 2 minutes.`;
      } else if (lastMessage.toLowerCase().includes("ai") || lastMessage.toLowerCase().includes("ml")) {
        offlineResponse = `📍 Destination: AI & ML Lab (P409)\n\n🏢 Floor: Fourth Floor\n\n🧭 Directions:\n1. Walk to the Central Lift.\n2. Go to the 4th Floor.\n3. Turn right.\n4. AI & ML Lab is beside the Robotics Lab.`;
      } else if (lastMessage.toLowerCase().includes("placement")) {
        offlineResponse = `📍 Destination: Placement Cell (S004)\n\n🏢 Ground Floor\n\n🧭 Directions:\n1. Enter through Gate 2.\n2. Walk straight.\n3. Placement Cell is beside the Principal's Office.`;
      } else if (lastMessage.toLowerCase().includes("library")) {
        offlineResponse = `📍 Destination: Library\n\n🏢 Ground Floor\n\n🧭 Directions:\n1. Enter through Gate 1.\n2. Walk towards the Quad.\n3. Library entrance is on the left.`;
      } else if (lastMessage.toLowerCase().includes("washroom")) {
        offlineResponse = `🚻 Washrooms are available on every floor near the staircases and central lift.`;
      } else if (lastMessage.toLowerCase().includes("lost")) {
        offlineResponse = `No worries 😊\n\nTell me what you can see nearby.\n\nExamples:\n• Gate 1\n• Gate 2\n• Library\n• Lift\n• Quad Area\n• Canteen\n• Football Ground`;
      }

      return res.json({ text: offlineResponse });
    }

    // Convert messages to Gemini format
    const contents = messages.map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    const ai = getAiClient();

    const response = await ai.models.generateContent({
     model: "gemini-3.1-pro",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
      },
    });

    return res.json({
      text: response.text || "I'm sorry, I couldn't generate a navigation route.",
    });
  } catch (error: any) {
  console.error("Gemini Error:", error);

  const lastMessage =
    req.body?.messages?.[req.body.messages.length - 1]?.text?.toLowerCase() || "";

  let offlineResponse =
    "⚠️ AI service is temporarily unavailable.\n\nUsing offline campus navigation.\n\nTell me where you want to go.";

  if (lastMessage.includes("canteen")) {
    offlineResponse = `📍 Destination: Canteen

1. Walk straight from Gate 1.
2. Pass the Admission Office.
3. Turn left near the Quad.
4. The canteen is ahead.

Estimated time: 2 minutes.`;
  }

  if (lastMessage.includes("ai") || lastMessage.includes("ml")) {
    offlineResponse = `📍 AI & ML Lab (P409)

• Go to the Central Lift.
• Take the lift to the 4th Floor.
• Turn right.
• The AI & ML Lab is beside the Robotics Lab.`;
  }

  if (lastMessage.includes("placement")) {
    offlineResponse = `📍 Placement Cell

Ground Floor

Beside the Principal's Office.`;
  }

  return res.json({
    text: offlineResponse,
  });
}
}
