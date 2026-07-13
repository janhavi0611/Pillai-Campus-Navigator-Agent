import express from "express";
import apiRouter from "../src/server/api.js";

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Mount the API router
app.use("/api", apiRouter);

// Export the Express API
export default app;
