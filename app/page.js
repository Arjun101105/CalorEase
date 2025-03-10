"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center bg-[#1E1E1E] px-4">
      {/* Welcome Section */}
      <div className="bg-[#29292B] px-8 py-6 rounded-lg shadow-lg text-center">
        <h1 className="font-irish text-3xl sm:text-4xl md:text-5xl text-[#C9C7BA]">
          Welcome to
        </h1>
        <h1 className="font-irish text-4xl sm:text-5xl md:text-6xl text-[#E0DFD5]">
          CalorEase
        </h1>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8">
        <button
          className="font-irish bg-[#C9C7BA] text-[#29292B] px-6 py-3 rounded-md cursor-pointer hover:bg-[#E0DFD5] transition-colors duration-200"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
        <button
          className="font-irish bg-[#C9C7BA] text-[#29292B] px-6 py-3 rounded-md cursor-pointer hover:bg-[#E0DFD5] transition-colors duration-200"
          onClick={() => router.push("/signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
}
