import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import apiRouter from "./server/routes/index";

dotenv.config();

// Load .env.local if present
const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked request from origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "careerco-pilot-backend" });
});

// Mount all API routes
app.use("/api", apiRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CareerCo-pilot Backend Server running on http://localhost:${PORT}`);
});
