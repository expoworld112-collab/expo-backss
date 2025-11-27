// validators/password.js
import { body } from "express-validator";
// Forgot Password validation
export const forgotPasswordValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
];

// Reset Password validation
export const resetPasswordValidator = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
  body("resetToken").notEmpty().withMessage("Reset token is required"),
];
