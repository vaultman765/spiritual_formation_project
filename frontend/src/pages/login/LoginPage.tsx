import React, { useState } from "react";
import { useAuth } from "@/context/authContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const location = useLocation();
  const canonicalUrl = `https://www.catholicmentalprayer.com${location.pathname}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.username, form.password);
      navigate("/my-journey");
    } catch (err: any) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-white">
      <Helmet>
        <title>Login | Spiritual Formation Project</title>
        <meta name="description" content="Log in to access your Catholic mental prayer journey and daily meditations." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Login | Spiritual Formation Project" />
        <meta property="og:description" content="Sign in to continue your spiritual journey with daily guided Ignatian meditations." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.catholicmentalprayer.com/images/og-default.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login | Spiritual Formation Project" />
        <meta name="twitter:description" content="Sign in to continue your spiritual journey with daily guided Ignatian meditations." />
        <meta name="twitter:image" content="https://www.catholicmentalprayer.com/images/og-default.jpg" />
      </Helmet>
      <h1 className="text-3xl font-display font-semibold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} className="input-style" />
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
          Login
        </button>
      </form>
      <p className="text-sm mt-4 text-white/80 text-center">
        Don’t have an account?{" "}
        <Link to="/auth/register" className="underline hover:text-white text-yellow-400">
          Register here
        </Link>
      </p>
    </main>
  );
}
