import express from "express";
import User from "../models/User.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { getUserSubmissions } from "../controllers/submissionController.js";

const router = express.Router();

// Get all users
router.get("/users", protect, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Delete a user
router.delete("/users/:id", protect, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// Update user role
router.put("/users/:id", protect, isAdmin, async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = role;
  await user.save();
  res.json(user);
});

// Admin: Get all submissions for a user
router.get("/submissions/:userId", protect, isAdmin, getUserSubmissions);

export default router;
