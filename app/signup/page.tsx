"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const router = useRouter();

  function handleHome() {
    router.push("/");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleNext() {
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }
    setError("");

    // Store username and password in session storage
    sessionStorage.setItem("signupUsername", username);
    sessionStorage.setItem("signupPassword", password);

    // Redirect to get_details page
    router.push("/get_details");
  }

  return (
    <div className="w-screen h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="text-[#EAEAEA] p-5 cursor-pointer" onClick={handleHome}>
        <h1 className="font-irish text-4xl sm:text-5xl">CalorEase</h1>
      </div>

      {/* Signup Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full max-w-sm bg-[#1E1E1E] p-8 rounded-lg shadow-xl">
        <h1 className="font-irish text-3xl text-[#EAEAEA]">Sign Up</h1>

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

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className={`font-irish px-5 py-3 rounded-md mt-2 transition-all duration-200 w-64 ${
            username && password
              ? "bg-[#EAEAEA] text-[#141414] hover:bg-[#F5F5F5]"
              : "bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed"
          }`}
          onClick={handleNext}
          disabled={!username || !password}
        >
          Next
        </button>
      </div>
    </div>
  );
}
