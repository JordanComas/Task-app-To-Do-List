// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  theme?: {
    primaryBg: string;
    primaryText: string;
    secondaryBg: string;
    buttonBg: string;
    buttonText: string;
    buttonHoverBg: string;
    buttonHoverText: string;
  };
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    theme: {
      primaryBg: { type: String, default: "#f3f3f4" },
      primaryText: { type: String, default: "#34312d" },
      secondaryBg: { type: String, default: "#d9c5b2" },
      buttonBg: { type: String, default: "#34312d" },
      buttonText: { type: String, default: "#f3f3f4" },
      buttonHoverBg: { type: String, default: "#7e7f83" },
      buttonHoverText: { type: String, default: "#14110f" },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
