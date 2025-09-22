import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  completed: boolean;
  user: mongoose.Schema.Types.ObjectId; // tie to user
  dueDate?: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date },
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);
