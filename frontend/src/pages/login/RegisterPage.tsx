import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Helmet } from "react-helmet-async";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
  });
  const location = useLocation();
  const canonicalUrl = `https://www.catholicmentalprayer.com${location.pathname}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

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
      <Helmet>
        <title>Register | Spiritual Formation Project</title>
        <meta
          name="description"
          content="Create a free account to begin your Catholic mental prayer journey and track your progress daily."
        />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Register | Spiritual Formation Project" />
        <meta
          property="og:description"
          content="Join our community and start a personalized Ignatian meditation journey tailored to your spiritual growth."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.catholicmentalprayer.com/images/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login | Spiritual Formation Project" />
        <meta name="twitter:description" content="Sign in to continue your spiritual journey with daily guided Ignatian meditations." />
        <meta name="twitter:image" content="https://www.catholicmentalprayer.com/images/og-default.jpg" />
      </Helmet>

      <h1 className="text-3xl font-display font-semibold mb-4">Create Account</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input
          name="first_name"
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          className="input-style"
        />
        <input
          name="last_name"
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          className="input-style"
        />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-style" />
        <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} className="input-style" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="input-style"
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          value={form.confirm_password}
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
