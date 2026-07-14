import OpenAI from "openai";
import { SYSTEM_INSTRUCTION } from "../src/server/systemInstructions.js";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer":
      process.env.APP_URL ||
      "https://pillai-campus-navigator-agent.vercel.app",
    "X-Title": "Pillai Campus Navigator",
  },
});

function getOfflineResponse(lastMessage: string): string {
  let offlineResponse =
    "👋 Hello! I am operating in offline demonstration mode because the AI service is currently unavailable.\n\nYou can still ask me for campus navigation assistance.";

  if (lastMessage.includes("canteen")) {
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
    lastMessage.includes("ai") ||
    lastMessage.includes("ml")
  ) {
    offlineResponse = `📍 Destination: AI & ML Lab (P409)

🏢 Floor: Fourth Floor

🧭 Directions:
1. Walk to the Central Lift.
2. Go to the 4th Floor.
3. Turn right.
4. AI & ML Lab is beside the Robotics Lab.`;
  } else if (lastMessage.includes("placement")) {
    offlineResponse = `📍 Destination: Placement Cell (S004)

🏢 Ground Floor

🧭 Directions:
1. Enter through Gate 2.
2. Walk straight.
3. Placement Cell is beside the Principal's Office.`;
  } else if (lastMessage.includes("library")) {
    offlineResponse = `📍 Destination: Library

🏢 Ground Floor

🧭 Directions:
1. Enter through Gate 1.
2. Walk towards the Quad.
3. Library entrance is on the left.`;
  } else if (lastMessage.includes("washroom")) {
    offlineResponse =
      "🚻 Washrooms are available on every floor near the staircases and central lift.";
  } else if (lastMessage.includes("lost")) {
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

  return offlineResponse;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages payload",
      });
    }

    const lastMessage =
      messages[messages.length - 1]?.text?.toLowerCase() || "";

    // Offline mode if API key is missing
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn(
        "OPENROUTER_API_KEY is not defined. Using offline navigation mode."
      );

      return res.json({
        text: getOfflineResponse(lastMessage),
      });
    }

    const chatMessages = [
      {
        role: "system" as const,
        content: SYSTEM_INSTRUCTION,
      },
      ...messages.map((m: any) => ({
        role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
    ];

    const response = await client.chat.completions.create({
      model: "openrouter/free",
      messages: chatMessages,
      temperature: 0.2,
    });

    return res.json({
      text:
        response.choices[0]?.message?.content ||
        "I'm sorry, I couldn't generate a response.",
    });
  } catch (error: any) {
    console.error("OpenRouter Error:", error);

    const lastMessage =
      req.body?.messages?.[req.body.messages.length - 1]?.text?.toLowerCase() ||
      "";

    return res.json({
      text: getOfflineResponse(lastMessage),
    });
  }
}