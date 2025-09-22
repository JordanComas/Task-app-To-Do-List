import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import cors from "cors";

dotenv.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
