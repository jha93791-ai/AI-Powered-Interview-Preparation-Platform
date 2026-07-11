import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import interviewRouter from "./routes/interview.route.js";
import paymentRouter from "./routes/payment.route.js";

const app = express();

// ======================
// Middlewares
// ======================
app.use(
  cors({
    origin: "https://ai-interview-agent-frontend-okzz.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "InterviewIQ API is running",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      interview: "/api/interview",
      payment: "/api/payment",
    },
  });
});

// ======================
// Routes
// ======================
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/interview", interviewRouter);
app.use("/api/payment", paymentRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 8000;

const connectWithFallback = async () => {
  const configuredUri = process.env.MONGODB_URL || process.env.MONGO_URL;
  const fallbackUri = process.env.LOCAL_MONGODB_URL || "mongodb://127.0.0.1:27017/interviewiq";
  const candidateUris = [configuredUri, fallbackUri].filter(Boolean);

  let lastError = null;

  for (const uri of candidateUris) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 30000,
        retryWrites: true,
        w: "majority",
      });

      console.log(`✅ MongoDB Connected Successfully using ${uri === configuredUri ? "configured URI" : "local fallback URI"}.`);
      return uri;
    } catch (error) {
      lastError = error;
      console.warn(`⚠️ MongoDB connection attempt failed for ${uri}:`, error.message);
    }
  }

  throw lastError;
};

// ======================
// MongoDB + Server Start
// ======================
const startServer = async () => {
  try {
    console.log("=================================");
    console.log("Connecting to MongoDB...");
    console.log("Node Version:", process.version);
    console.log("Mongo URL:", process.env.MONGODB_URL || process.env.MONGO_URL ? "(loaded)" : "undefined");
    console.log("=================================");

    await connectWithFallback();
  } catch (error) {
    console.log("=================================");
    console.error("❌ FULL MONGODB ERROR:");
    console.error(error);
    console.log("⚠️ Continuing without MongoDB. Some features will fail until the database is reachable.");
    console.log("=================================");
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
