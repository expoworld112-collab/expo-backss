import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import { check } from "express-validator";
import { runvalidation } from "./validators/index.js";
import {
  preSignup,
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
} from "./controllers/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// ---------------- Middleware ----------------
app.use(express.json());
app.use(cookieParser());

// ---------------- CORS ----------------
const allowedOrigins = [
  "https://efronts.vercel.app",
  "https://expo-front-one.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// ---------------- Validators ----------------
const usersignupvalidator = [
  check("name").isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
  check("username").isLength({ min: 3, max: 10 }).withMessage("Username must be 3-10 characters"),
  check("email").isEmail().withMessage("Must be a valid email"),
  check(
    "password",
    "Password must have 1 lowercase, 1 uppercase, 1 number, 1 special char and min 8 chars"
  ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
];

const usersigninvalidator = [check("email").isEmail().withMessage("Must be a valid email")];
const forgotPasswordValidator = [check("email").isEmail().withMessage("Must be a valid email")];
const resetPasswordValidator = [
  check(
    "newPassword",
    "Password must have 1 lowercase, 1 uppercase, 1 number, 1 special char and min 8 chars"
  ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
];

// ---------------- Routes ----------------
app.post("/api/pre-signup", usersignupvalidator, runvalidation, preSignup);
app.post("/api/signup", signup);
app.post("/api/signin", usersigninvalidator, runvalidation, signin);
app.get("/api/signout", signout);
app.put("/api/forgot-password", forgotPasswordValidator, runvalidation, forgotPassword);
app.put("/api/reset-password", resetPasswordValidator, runvalidation, resetPassword);
app.use("/api/auth", require("./routes/auth"));

// Health check
app.get("/", (req, res) => res.json({ message: "Backend running ✅" }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message || err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ---------------- MongoDB ----------------
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
// Wrong (do NOT do this in frontend!)
// import { preSignup } from "../../../Backend-Coding4u-main/controllers/auth.js";

// Correct: call the backend API
const handleSignup = async (userData) => {
  const res = await fetch("https://your-backend-domain.com/api/pre-signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  return data;
};


startServer();
