import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";
import Exercise from "../../../models/Exercise";
import { verifyToken } from "../../lib/auth";
import moment from "moment";

export async function GET(req) {
  try {
    await connectDB();

    const user = await verifyToken(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = user.id;

    const workouts = await Exercise.find({ userId }).sort({ createdAt: -1 });

    const weeklyData = [];
    const monthlyData = [];

    const weeklyMap = new Map();
    const monthlyMap = new Map();

    workouts.forEach((workout) => {
      const day = moment(workout.createdAt).format('YYYY-MM-DD'); // Daily format
      const monthDay = moment(workout.createdAt).format('YYYY-MM-DD'); // Fix: Grouping by day in the month

      if (!weeklyMap.has(day)) {
        weeklyMap.set(day, 0);
      }
      if (!monthlyMap.has(monthDay)) {
        monthlyMap.set(monthDay, 0);
      }

      weeklyMap.set(day, weeklyMap.get(day) + workout.caloriesBurnt);
      monthlyMap.set(monthDay, monthlyMap.get(monthDay) + workout.caloriesBurnt);
    });

    weeklyMap.forEach((calories, date) => {
      weeklyData.push({ date, calories });
    });

    monthlyMap.forEach((calories, date) => {
      monthlyData.push({ date, calories });
    });

    return NextResponse.json({ weekly: weeklyData, monthly: monthlyData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
