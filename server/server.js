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

// Load Environment Variables
dotenv.config();

// Connect Database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path for serving static files (e.g., uploaded avatars)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/receipt", receiptRoutes);

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🧙 Welcome to Gringotts Wizarding Bank API",
    version: "1.0.0"
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log("🏦 Gringotts Wizarding Bank API");
  console.log(`🚀 Server Running : http://localhost:${PORT}`);
  console.log("======================================");
});