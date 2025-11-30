// pages/auth.js
import { useState } from "react";
import nodemailer from "nodemailer"
export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const handleSignup = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, email, password }),
    });
    const data = await res.json();
    console.log(data);
  };

  const handleSignin = async () => {
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);
  };

  const handleSignout = async () => {
    const res = await fetch("/api/signout", { method: "POST" });
    const data = await res.json();
    console.log(data);
  };

  return (
    <div>
      <h1>Auth Page</h1>

      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button onClick={handleSignup}>Signup</button>

      <h2>Signin</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
      <button onClick={handleSignin}>Signin</button>

      <h2>Signout</h2>
      <button onClick={handleSignout}>Signout</button>
    </div>
  );
}
