import express from "express";
import { Task } from "../models/Task";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// all routes need auth
router.use(authMiddleware);

// Get tasks for logged-in user
router.get("/", async (req: any, res) => {
  try {
    const tasks = await Task.find({ user: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a task (with optional dueDate)
router.post("/", async (req: any, res) => {
  const { title, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  try {
    const task = new Task({ title, user: req.userId, dueDate });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle completed
router.patch("/:id/toggle", async (req: any, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete task
router.delete("/:id", async (req: any, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
