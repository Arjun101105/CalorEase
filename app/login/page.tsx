"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Login failed. Try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="w-screen h-screen bg-[#1E1E1E] flex flex-col">
      {/* Header */}
      <div className="text-[#C9C7BA] p-5 cursor-pointer" onClick={() => router.push("/")}>
        <h1 className="font-irish text-4xl sm:text-5xl">CalorEase</h1>
      </div>

      {/* Login Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full max-w-sm bg-[#29292B] p-6 rounded-lg shadow-lg">
        <h1 className="font-irish text-3xl text-[#C9C7BA]">Login</h1>

        <input
          type="text"
          placeholder="Username"
          className="bg-[#3A3A3C] text-[#C9C7BA] placeholder-gray-400 rounded-md p-3 w-64 outline-none focus:ring-2 focus:ring-[#C9C7BA]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-[#3A3A3C] text-[#C9C7BA] placeholder-gray-400 rounded-md p-3 w-64 outline-none focus:ring-2 focus:ring-[#C9C7BA]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="font-irish bg-[#C9C7BA] text-[#29292B] px-5 py-3 rounded-md mt-2 hover:bg-[#E0DFD5] transition-colors duration-200"
          onClick={handleLogin}
        >
          Login
        </button>

        <p className="text-[#C9C7BA] text-sm sm:text-base">
          Don't have an account?{" "}
          <u
            className="cursor-pointer hover:text-[#E0DFD5] transition"
            onClick={() => router.push("/signup")}
          >
            Signup
          </u>{" "}
          here.
        </p>
      </div>
    </div>
  );
}
