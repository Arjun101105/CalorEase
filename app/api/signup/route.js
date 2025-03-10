import connectDb from "../../lib/mongodb";
import User from "../../../models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDb();
    
    const { username, password, age, gender, height, weight } = await req.json();


    if (!username || !password || !age || !gender || !height || !weight) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    
    if (!["male", "female"].includes(gender.toLowerCase())) {
      return NextResponse.json({ error: "Invalid gender value" }, { status: 400 });
    }


    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword, 
      age,
      gender,
      height,
      bodyWeight: weight, 
    });

    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
