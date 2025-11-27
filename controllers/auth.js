import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// EMAIL TRANSPORTER
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/* ------------------------------
   PRE SIGNUP → Send Activation Email
-------------------------------- */
export const preSignup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    // Check if email exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ error: "Email already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { name, username, email, password: hashedPassword },
      process.env.JWT_ACCOUNT_ACTIVATION,
      { expiresIn: "10m" }
    );

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Activate Your Account",
      html: `
        <p>Click below to activate your account:</p>
        <a href="${process.env.FRONTEND_URL}/auth/account/activate/${token}">
          Activate Account
        </a>
      `,
    });

    return res.json({ message: `Activation email sent to ${email}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/* ------------------------------
   ACTIVATE ACCOUNT
-------------------------------- */
export const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);

    const { name, username, email, password } = decoded;

    const user = new User({
      name,
      username,
      email,
      password,
      verified: true,
    });

    await user.save();

    return res.json({ message: "Account activated successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};


/* ------------------------------
   SIGN IN
-------------------------------- */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
