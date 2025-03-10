import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    height: { type: Number, required: true },
    bodyWeight: { type: Number, required: true } 
});

export default mongoose.model("User", UserSchema);
