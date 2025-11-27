// server.js
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


app.use(express.json());
app.use(cookieParser());


const allowedOrigins = [
  "https://efronts.vercel.app",
  "https://expo-front-one.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow Postman / server-to-server
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS blocked"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight support
app.options("*", cors());

// ----------------------------------
// VALIDATORS
// ----------------------------------
const usersignupvalidator = [
  check("name").isLength({ min: 5 }).withMessage("Name must be at least 5 characters"),
  check("username").isLength({ min: 3, max: 10 }).withMessage("Username must be 3-10 characters"),
  check("email").isEmail().withMessage("Must be a valid email"),
  check("password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage("Weak password")
];

const usersigninvalidator = [check("email").isEmail().withMessage("Must be valid email")];

const forgotPasswordValidator = [check("email").isEmail().withMessage("Must be valid email")];

const resetPasswordValidator = [
  check("newPassword").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .withMessage("Weak password")
];

// ----------------------------------
// ROUTES
// ----------------------------------
app.post("/api/pre-signup", usersignupvalidator, runvalidation, preSignup);
app.post("/api/signup", signup);
app.post("/api/signin", usersigninvalidator, runvalidation, signin);
app.get("/api/signout", signout);
app.put("/api/forgot-password", forgotPasswordValidator, runvalidation, forgotPassword);
app.put("/api/reset-password", resetPasswordValidator, runvalidation, resetPassword);

// Health check
app.get("/", (req, res) => res.json({ message: "Backend running 🚀" }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.message || err);
  res.status(500).json({ error: err.message || "Internal server error" });
});


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✔");
    app.listen(PORT, () => console.log("Server running on PORT", PORT));
  } catch (err) {
    console.error(err);
  }
};

start();

export default app;
