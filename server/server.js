import dotenv from "dotenv";
// Load Environment Variables
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import receiptRoutes from "./routes/receiptRoutes.js";

// Connect Database
connectDB();

// Initialize Express
const app = express();
app.set("trust proxy", 1);

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_URL) {
  process.env.CLIENT_URL.split(",").forEach((url) => {
    const trimmed = url.trim().replace(/\/+$/, "");
    if (trimmed) allowedOrigins.push(trimmed);
  });
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/+$/, "");
      const isAllowed = allowedOrigins.some(
        (allowed) => allowed.replace(/\/+$/, "") === normalizedOrigin
      );

      if (isAllowed || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import mongoose from "mongoose";

// Path for serving static files (e.g., uploaded avatars)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// DB Connection Check Middleware for API routes
app.use("/api", async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {}
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection in progress or unreachable. Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0.",
    });
  }

  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/receipt", receiptRoutes);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Gringotts Wizarding Bank API is running",
  });
});

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🧙 Welcome to Gringotts Wizarding Bank API",
    version: "1.0.0",
  });
});

// 404 Route
app.use((req, res) => {
  console.warn(`[404 NOT FOUND] ${req.method} ${req.originalUrl || req.url}`);
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log("🏦 Gringotts Wizarding Bank API");
  console.log(`🚀 Server Running on port ${PORT}`);
  console.log("======================================");
});