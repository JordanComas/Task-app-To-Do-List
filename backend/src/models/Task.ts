import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  user: mongoose.Schema.Types.ObjectId;
  dueDate?: string; // optional due date
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: String }, // optional due date
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);
