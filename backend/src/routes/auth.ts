import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = express.Router();

// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User exists" });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create and save user
    const user = new User({ name, email, password: hashed });
    await user.save();

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ UPDATE PROFILE ------------------
router.put("/update-profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { name, email, theme } = req.body;

    const updates: any = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (theme) updates.theme = theme;

    const user = await User.findByIdAndUpdate(
      req.userId!,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// ------------------ UPDATE PASSWORD ------------------
router.put(
  "/update-password",
  authMiddleware,
  async (req: AuthRequest, res) => {
    try {
      const { password } = req.body;
      if (!password || password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.findByIdAndUpdate(req.userId!, { password: hashedPassword });

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update password" });
    }
  }
);

export default router;
