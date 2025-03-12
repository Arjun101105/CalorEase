"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    userId: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
  });

  const [duration, setDuration] = useState("");
  const [workout_type, setWorkout_type] = useState("No Workout");
  const [calories, setCalories] = useState(null);
  const [note, setNote] = useState(""); // Add note state
  const [loading, setLoading] = useState(false);
  const [workouts, setWorkouts] = useState([]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/dashboard", { credentials: "include" });

      if (res.status === 401) {
        router.push("/login");
      } else {
        const data = await res.json();
        setUser(data.username);
        setUserData({
          userId: data.userId,
          age: data.age?.toString() || "",
          height: data.height?.toString() || "",
          weight: data.bodyWeight?.toString() || "",
          gender: data.gender || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchWorkouts = async () => {
    if (!userData.userId) return;
    try {
      const res = await fetch(`/api/workouts?userId=${userData.userId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userData.userId) {
      fetchWorkouts();
    }
  }, [userData.userId]);

  const calculateCalories = async () => {
    setLoading(true);
    setCalories(null);

    try {
      const res = await fetch("https://calorease-api.onrender.com/calculate-calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          duration,
          workout_type,
          age: userData.age,
          height: userData.height,
          weight: userData.weight,
          gender: userData.gender,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setCalories(Number(parseFloat(data.calories_burned).toFixed(2)));
      } else {
        alert("Error calculating calories.");
      }
    } catch (error) {
      setLoading(false);
      alert("Server error. Try again later.");
    }
  };

  const addWorkout = async () => {
    if (!userData.userId) {
      alert("User ID is missing!");
      return;
    }

    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId: userData.userId,
        duration,
        workout_type,
        calories_burned: calories,
        note, // Include note in the request
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Workout added successfully!");
      fetchWorkouts();
    } else {
      alert("Error adding workout: " + data.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#EAEAEA] p-4 md:p-6">
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-5 bg-[#1E1E1E] rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-[#EAEAEA]">CalorEase</h1>
        {user && <p className="text-lg mt-2 sm:mt-0">Welcome, <span className="font-semibold">{user.toUpperCase()}</span>!</p>}
        <button 
          onClick={handleLogout} 
          className="mt-3 sm:mt-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Calories Calculator */}
      <div className="bg-[#1E1E1E] p-5 md:p-6 rounded-xl mt-6 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#EAEAEA] mb-4">Calculate Calories Burnt</h2>
        <div className="flex flex-col gap-3">
          <input 
            type="number" 
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-gray-400"
          />
          <select 
            value={workout_type} 
            onChange={(e) => setWorkout_type(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          >
            <option value="Cardio">Cardio</option>
            <option value="Endurance">Endurance</option>
            <option value="Strength">Strength</option>
            <option value="No Workout">No Workout</option>
          </select>
          <textarea
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-gray-400"
          />
          <button 
            onClick={calculateCalories}
            disabled={loading}
            className="bg-[#EAEAEA] text-black font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
          >
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </div>

        {loading ? (
          <ClipLoader color="#EAEAEA" size={35} className="mt-4" />
        ) : calories !== null && (
          <>
            <p className="text-lg mt-4">🔥 Estimated Calories Burnt: <span className="font-bold">{calories} kcal</span></p>
            <button 
              onClick={addWorkout}
              className="mt-4 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Add Workout
            </button>
          </>
        )}
      </div>

      {/* Workout History */}
      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#EAEAEA]">Workout History</h2>
        <button 
          onClick={() => router.push("/progress-reports")}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Progress Reports
        </button>
      </div>
      {workouts.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {workouts.map((workout, index) => (
            <div key={index} className="bg-[#1E1E1E] p-4 rounded-lg shadow-md">
              <p><strong>Workout:</strong> {workout.workoutType}</p>
              <p><strong>Duration:</strong> {workout.duration} min</p>
              <p><strong>Calories Burnt:</strong> {workout.caloriesBurnt} kcal</p>
              {workout.note && <p><strong>Note:</strong> {workout.note}</p>} {/* Display note if available */}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-gray-400">No workouts recorded yet.</p>
      )}
    </div>
  );
}
