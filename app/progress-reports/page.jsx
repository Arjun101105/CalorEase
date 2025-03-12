"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ProgressReports() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({
    userId: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch("/api/dashboard", { credentials: "include" });

      if (res.status === 401) {
        router.push("/login");
      } else {
        const data = await res.json();
        setUser(data.username);
        setUserData({
          userId: data.userId || "",
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

  const fetchProgressData = async () => {
    if (!userData.userId) return;
    try {
      const res = await fetch(`/api/progress-reports?userId=${userData.userId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched Progress Data:", data);
        setWeeklyData(data.weekly || []);
        setMonthlyData(data.monthly || []);
      } else {
        console.error("Error fetching progress data:", res.statusText);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userData.userId) {
      fetchProgressData();
    }
  }, [userData.userId]);

  const weeklyChartData = {
    labels: weeklyData.map((data) => data.date),
    datasets: [
      {
        label: "Calories Burnt",
        data: weeklyData.map((data) => data.calories),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const monthlyChartData = {
    labels: monthlyData.map((data) => data.date),
    datasets: [
      {
        label: "Calories Burnt",
        data: monthlyData.map((data) => data.calories),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#141414] to-[#141414] text-gray-100">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-[#EAEAEA]">Loading your progress...</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141414] to-[#141414] text-gray-100 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 md:p-5 bg-[#1E1E1E] rounded-xl shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold text-[#EAEAEA]">CalorEase</h1>
        {user && <p className="text-lg mt-2 sm:mt-0">Welcome, <span className="font-semibold">{user.toUpperCase()}</span>!</p>}
        <button 
          onClick={() => router.push("/dashboard")} 
          className="mt-3 sm:mt-0 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition duration-300"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-[#1E1E1E] p-5 md:p-6 rounded-xl mt-6 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#EAEAEA] mb-4">Weekly Calorie Burn Trend</h2>
        <div className="relative h-96 w-full">
          {weeklyData.length > 0 ? <Line data={weeklyChartData} options={chartOptions} /> : <p className="text-center">No weekly data available</p>}
        </div>
      </div>

      <div className="bg-[#1E1E1E] p-5 md:p-6 rounded-xl mt-6 shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#EAEAEA] mb-4">Monthly Calorie Burn Trend</h2>
        <div className="relative h-96 w-full">
          {monthlyData.length > 0 ? <Line data={monthlyChartData} options={chartOptions} /> : <p className="text-center">No monthly data available</p>}
        </div>
      </div>
    </div>
  );
}
