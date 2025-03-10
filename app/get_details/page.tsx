"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function GetDetails() {
  const router = useRouter();

  function handleHome(){
    router.push("/");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male"); // Default to male
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    // Retrieve stored username & password from session storage
    const storedUsername = sessionStorage.getItem("signupUsername");
    const storedPassword = sessionStorage.getItem("signupPassword");

    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
    } else {
      // If missing, redirect back to signup
      router.push("/signup");
    }
  }, []);

  async function handleSignup() {
    if (!age || !height || !weight) {
      alert("Please fill in all fields");
      return;
    }

    const userData = { username, password, age, gender, height, weight };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (res.ok) {
        alert("Signup Successful!");
        router.push("/dashboard"); // Redirect to user dashboard
      } else {
        alert("Signup Failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  }
  // justify-center items-center gap-4
  return (
    <div className="w-screen h-screen bg-[#29292B] flex flex-col">

      <div className="text-[#C9C7BA] p-5" onClick={handleHome}>
        <h1 className="font-irish text-4xl sm:text-5xl">CalorEase</h1>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center gap-3 w-full max-w-sm">

      
      <h1 className="font-irish text-3xl text-[#C9C7BA]">Complete Your Signup</h1>

      <input
        type="number"
        placeholder="Age"
        className="bg-[#C9C7BA] rounded-md p-2 w-60"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <select
        className="bg-[#C9C7BA] rounded-md p-2 w-60"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <input
        type="number"
        placeholder="Height (cm)"
        className="bg-[#C9C7BA] rounded-md p-2 w-60"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />

      <input
        type="number"
        placeholder="Weight (kg)"
        className="bg-[#C9C7BA] rounded-md p-2 w-60"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />

      <button
        className="font-irish bg-[#C9C7BA] text-[#29292B] px-4 py-2 rounded-md mt-2"
        onClick={handleSignup}
      >
        Complete Signup
      </button>
      </div>
    </div>
  );
}
