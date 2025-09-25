import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  user: mongoose.Schema.Types.ObjectId;
  dueDate?: string; // optional due date
  priority?: "High" | "Medium" | "Low"; // optional priority
  category?: string; // optional category
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: String }, // optional due date
  priority: { type: String, enum: ["High", "Medium", "Low"] }, // optional
  category: { type: String }, // optional
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);
