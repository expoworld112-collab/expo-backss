// validators/auth.js
import { body } from "express-validator";
import validators from "./index.js"

import { runValidation } from "./index.js";

// Signup / Pre-signup validation
export const signupValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Signin validation
export const signinValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Forgot Password validation
export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

// Reset Password validation
export const resetPasswordValidator = [
  body("resetCode").notEmpty().withMessage("Reset code is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];
