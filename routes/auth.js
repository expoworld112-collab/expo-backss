import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import nodemailer from "nodemailer";

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ====================================
   PRE-SIGNUP → Send Activation Email
==================================== */
export const preSignup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { name, username, email, password: hashedPassword },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    const activationLink = `${process.env.FRONTEND}/auth/account/activate/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Activate your Expo account",
      html: `
        <h3>Activate your account</h3>
        <p>Click below to verify:</p>
        <a href="${activationLink}">Activate Account</a>
      `,
    });

    return res.json({ message: `Activation email sent to ${email}` });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error" });
  }
};

/* ====================================
   SIGNUP → Create account after token
==================================== */
export const signup = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    const { name, username, email, password } = decoded;

    const user = new User({ name, username, email, password });
    await user.save();

    return res.json({ message: "Signup success" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ error: "Expired or invalid token" });
  }
};

/* ====================================
   SIGNIN → Login
==================================== */
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Incorrect password" });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({
      token,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};

/* ====================================
   SIGNOUT
==================================== */
export const signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signed out successfully" });
};

/* ====================================
   FORGOT PASSWORD
==================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "User does not exist" });

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: "10m" }
    );

    user.resetPasswordLink = token;
    await user.save();

    const resetLink = `${process.env.FRONTEND}/auth/password/reset/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset your password",
      html: `
        <p>Click to reset:</p>
        <a href="${resetLink}">Reset Password</a>
      `,
    });

    res.json({ message: `Password reset email sent to ${email}` });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
};

/* ====================================
   RESET PASSWORD
==================================== */
export const resetPassword = async (req, res) => {
  try {
    const { newPassword, resetPasswordLink } = req.body;

    const decoded = jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);

    const user = await User.findOne({ resetPasswordLink });
    if (!user)
      return res.status(400).json({ error: "Invalid token" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordLink = "";
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (e) {
    return res.status(400).json({ error: "Expired or invalid token" });
  }
};
