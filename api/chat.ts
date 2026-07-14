import OpenAI from "openai";
import { SYSTEM_INSTRUCTION } from "../src/server/systemInstructions.js";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "https://pillai-campus-navigator.vercel.app",
    "X-Title": "Pillai Campus Navigator",
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: "Invalid messages payload",
      });
    }

    // Offline mode
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn(
        "OPENROUTER_API_KEY is not defined. Using offline mode."
      );

      const lastMessage =
        messages[messages.length - 1]?.text?.toLowerCase() || "";

      let offline =
        "⚠️ AI service is unavailable.\n\nUsing offline campus navigation.";

      if (lastMessage.includes("canteen")) {
        offline = `📍 Destination: Canteen

1. Walk straight from Gate 1.
2. Pass the Admission Office.
3. Turn left near the Quad.
4. The canteen is ahead.

Estimated time: 2 minutes.`;
      }

      return res.json({
        text: offline,
      });
    }

    const chatMessages = [
      {
        role: "system",
        content: SYSTEM_INSTRUCTION,
      },
      ...messages.map((m: any) => ({
        role: m.sender === "user" ? "user" : "assistant",
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
        response.choices[0]?.message?.content ??
        "Sorry, I couldn't generate a response.",
    });
  } catch (err: any) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}