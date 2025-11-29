import connectDB from "../../helpers/dbConnect";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

connectDB();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password)
    return res.status(422).json({ error: "All fields are required" });

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "Email already registered" });

  const token = jwt.sign(
    { name, username, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "Activate your account",
    html: `<p>Activate: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/activate/${token}</p>`,
  });

  res.status(200).json({ message: `Activation email sent to ${email}` });
}
