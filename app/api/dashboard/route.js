import { verifyToken } from "../../lib/auth";
import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb"; // Ensure DB connection
import User from "../../../models/User"; // Import User model

export async function GET(req) {
  try {
    await connectDB(); // Ensure database connection

    const user = await verifyToken(); // ✅ Await token verification

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user details from MongoDB
    const userData = await User.findById(user.id).select("-password"); // Exclude password field

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json(
      {
        userId: userData._id.toString(), // ✅ Include user ID
        username: userData.username,
        age: userData.age,
        height: userData.height,
        bodyWeight: userData.bodyWeight,
        gender: userData.gender,
      },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
