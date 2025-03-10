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

  function handleNext() {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Store username and password in session storage
    sessionStorage.setItem("signupUsername", username);
    sessionStorage.setItem("signupPassword", password);

    // Redirect to get_details page
    router.push("/get_details");
  }

  return (
    <div className="w-screen h-screen bg-[#1E1E1E] flex flex-col">
      {/* Header */}
      <div className="text-[#C9C7BA] p-5 cursor-pointer" onClick={handleHome}>
        <h1 className="font-irish text-4xl sm:text-5xl">CalorEase</h1>
      </div>

      {/* Signup Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full max-w-sm bg-[#29292B] p-6 rounded-lg shadow-lg">
        <h1 className="font-irish text-3xl text-[#C9C7BA]">Signup</h1>

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

        <button
          className="font-irish bg-[#C9C7BA] text-[#29292B] px-5 py-3 rounded-md mt-2 hover:bg-[#E0DFD5] transition-colors duration-200"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
