// /controllers/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Make sure this path is correct

export const signUpUser = async ({ name, username, email, password }) => {
  if (!name || !username || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    username,
    email,
    password: hashedPassword,
    verified: true, // skip email verification for simplicity
  });

  await user.save();
  return { message: "User created successfully" };
};

export const signInUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user: { name: user.name, username: user.username, email: user.email } };
};

export const signOutUser = (res) => {
  // Example: clear token cookie
  res.setHeader("Set-Cookie", "token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax");
  return { message: "Signed out successfully" };
};
