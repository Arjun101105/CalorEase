import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb";  // Ensure DB connection
import Exercise from "../../../models/Exercise"; // ✅ Correct Schema import
import { verifyToken } from "../../lib/auth"; // Ensure user authentication

export async function POST(req) {
  try {
    await connectDB(); // ✅ Ensure database connection

    const { userId, duration, workout_type, calories_burned } = await req.json(); // ✅ Correct field names

    // **Ensure required fields exist**
    if (!userId || !duration || !workout_type || !calories_burned) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    const newWorkout = new Exercise({ // ✅ Use the correct model (`Exercise`)
      userId, 
      duration,
      workoutType: workout_type, // ✅ Map to correct schema field
      caloriesBurnt: calories_burned, // ✅ Map to correct schema field
    });

    await newWorkout.save();

    return NextResponse.json({ message: "Workout saved!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// **Fetch Workouts**
export async function GET(req) {
  try {
    await connectDB();

    const user = await verifyToken(req); // ✅ Await token verification
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const workouts = await Exercise.find({ userId: user.id }).sort({ createdAt: -1 });

    return NextResponse.json(workouts, { status: 200 });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
