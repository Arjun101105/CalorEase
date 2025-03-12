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
    <div className="w-screen h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="text-[#EAEAEA] p-5 cursor-pointer" onClick={() => router.push("/")}>
        <h1 className="font-irish text-4xl sm:text-5xl">CalorEase</h1>
      </div>

      {/* Login Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full max-w-sm bg-[#1E1E1E] p-8 rounded-lg shadow-xl">
        <h1 className="font-irish text-3xl text-[#EAEAEA]">Login</h1>

        <input
          type="text"
          placeholder="Username"
          className="bg-[#292929] text-[#EAEAEA] placeholder-[#A0A0A0] rounded-md p-3 w-64 outline-none border border-[#3A3A3A] focus:ring-2 focus:ring-[#EAEAEA] focus:border-[#EAEAEA]"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-[#292929] text-[#EAEAEA] placeholder-[#A0A0A0] rounded-md p-3 w-64 outline-none border border-[#3A3A3A] focus:ring-2 focus:ring-[#EAEAEA] focus:border-[#EAEAEA]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className={`font-irish px-5 py-3 rounded-md mt-2 transition-all duration-200 w-64 ${
            username && password
              ? "bg-[#EAEAEA] text-[#141414] hover:bg-[#F5F5F5]"
              : "bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed"
          }`}
          onClick={handleLogin}
          disabled={!username || !password}
        >
          Login
        </button>

        <p className="text-[#A0A0A0] text-sm">
          Don't have an account?{" "}
          <u
            className="cursor-pointer text-[#EAEAEA] hover:text-[#F5F5F5] transition"
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
