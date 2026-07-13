import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import apiRouter from "./src/server/api.js";

// Load environment variables
const result = dotenv.config();

console.log(result.parsed);
console.log("process.env.GEMINI_API_KEY =", process.env.GEMINI_API_KEY);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON request bodies
  app.use(express.json());

  // API routes FIRST
  app.use("/api", apiRouter);

  // Vite middleware for development, static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve("dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pillai Navigator AI server running on port ${PORT}`);
  });
}

startServer();
