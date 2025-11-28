import { validationResult } from "express-validator";

export function runvalidation (req,res,next){   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }
    next();
}
import { check, validationResult } from "express-validator";

// Middleware to handle validation results
export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// Signup validation
export const signupValidator = [
  check("name", "Name is required").notEmpty(),
  check("email", "Email must be valid").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
];

// Signin validation
export const signinValidator = [
  check("email", "Email must be valid").isEmail(),
  check("password", "Password is required").notEmpty(),
];

// Forgot password validation
export const forgotPasswordValidator = [
  check("email", "Email must be valid").isEmail(),
];

// Reset password validation
export const resetPasswordValidator = [
  check("resetPassword", "Password must be at least 6 characters").isLength({ min: 6 }),
];

export default {
  runValidation,
  signupValidator,
  signinValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
};
