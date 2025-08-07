import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/user/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Registration failed");
      }

      // Automatically log them in
      await login(form.username, form.password);
      navigate("/my-journey");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="text-3xl font-display font-semibold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} className="input-style" />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-style" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input-style"
        />
        {error && <p className="text-red-400">{error}</p>}
        <button type="submit" className="bg-[var(--brand-primary)] text-black px-4 py-2 rounded">
          Register
        </button>
      </form>
    </main>
  );
}
