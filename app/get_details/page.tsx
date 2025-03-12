"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function GetDetails() {
  const router = useRouter();

  function handleHome() {
    router.push("/");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("signupUsername");
    const storedPassword = sessionStorage.getItem("signupPassword");

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
    } else {
      router.push("/signup");
    }
  }, []);

  async function handleSignup() {
    if (!age || !height || !weight) {
      setError("All fields are required.");
      return;
    }
    setError("");

    const userData = { username, password, age, gender, height, weight };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        alert("Signup Successful!");
        router.push("/dashboard");
      } else {
        alert("Signup Failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }

  return (
    <div className="w-screen h-screen bg-[#141414] flex flex-col">
      {/* Header */}
      <div className="text-[#EAEAEA] p-5 cursor-pointer" onClick={handleHome}>
        <h1 className="font-irish text-4xl sm:text-5xl">CalorEase</h1>
      </div>

      {/* Signup Details Form */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full max-w-sm bg-[#1E1E1E] p-8 rounded-lg shadow-xl">
        <h1 className="font-irish text-3xl text-[#EAEAEA]">Complete Your Signup</h1>

        <input
          type="number"
          placeholder="Age"
          className="bg-[#292929] text-[#EAEAEA] placeholder-[#A0A0A0] rounded-md p-3 w-64 outline-none border border-[#3A3A3A] focus:ring-2 focus:ring-[#EAEAEA] focus:border-[#EAEAEA]"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="bg-[#292929] text-[#EAEAEA] rounded-md p-3 w-64 outline-none border border-[#3A3A3A] focus:ring-2 focus:ring-[#EAEAEA] focus:border-[#EAEAEA]"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="number"
          placeholder="Height (cm)"
          className="bg-[#292929] text-[#EAEAEA] placeholder-[#A0A0A0] rounded-md p-3 w-64 outline-none border border-[#3A3A3A] focus:ring-2 focus:ring-[#EAEAEA] focus:border-[#EAEAEA]"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          className="bg-[#292929] text-[#EAEAEA] placeholder-[#A0A0A0] rounded-md p-3 w-64 outline-none border border-[#3A3A3A] focus:ring-2 focus:ring-[#EAEAEA] focus:border-[#EAEAEA]"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className={`font-irish px-5 py-3 rounded-md mt-2 transition-all duration-200 w-64 ${
            age && height && weight
              ? "bg-[#EAEAEA] text-[#141414] hover:bg-[#F5F5F5]"
              : "bg-[#3A3A3A] text-[#A0A0A0] cursor-not-allowed"
          }`}
          onClick={handleSignup}
          disabled={!age || !height || !weight}
        >
          Complete Signup
        </button>
      </div>
    </div>
  );
}
