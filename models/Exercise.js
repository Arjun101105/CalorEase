import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutType: { type: String, required: true },
  duration: { type: Number, required: true },
  caloriesBurnt: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
