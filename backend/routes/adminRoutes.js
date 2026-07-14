import express from "express";
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import TestProgress from "../models/TestProgress.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { getUserSubmissions } from "../controllers/submissionController.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Dashboard stats: real counts and a recent-activity feed
router.get("/stats", protect, isAdmin, async (req, res) => {
  try {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalStudents, testsTaken, activeSubmitters, activeInProgress, recent] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Submission.countDocuments(),
      Submission.distinct("userId", { submittedAt: { $gte: dayAgo } }),
      TestProgress.distinct("userId", { lastUpdated: { $gte: dayAgo } }),
      Submission.find()
        .sort({ submittedAt: -1 })
        .limit(6)
        .select("userId testName percentage score totalQuestions submittedAt"),
    ]);

    const activeToday = new Set([...activeSubmitters, ...activeInProgress]).size;

    // Submissions store Clerk IDs; map them to display names
    const clerkIds = [...new Set(recent.map((s) => s.userId))];
    const recentUsers = await User.find({ clerkId: { $in: clerkIds } }).select("clerkId name email");
    const nameByClerkId = Object.fromEntries(recentUsers.map((u) => [u.clerkId, u.name || u.email]));

    res.json({
      totalStudents,
      testsTaken,
      activeToday,
      recentActivity: recent.map((s) => ({
        id: s._id,
        name: nameByClerkId[s.userId] || "Student",
        testName: s.testName,
        percentage: s.percentage,
        score: s.score,
        totalQuestions: s.totalQuestions,
        submittedAt: s.submittedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// Get all users
router.get("/users", protect, isAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Delete a user
router.delete("/users/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete from Clerk if clerkId exists
    if (user.clerkId) {
      try {
        await clerkClient.users.deleteUser(user.clerkId);
      } catch (clerkError) {
        console.error("Error deleting user from Clerk:", clerkError);
        // Continue with MongoDB deletion even if Clerk deletion fails
      }
    }

    // Delete from MongoDB
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Update user role
router.put("/users/:id", protect, isAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update role in MongoDB
    user.role = role;
    await user.save();

    // Update role in Clerk's publicMetadata if clerkId exists
    if (user.clerkId) {
      try {
        await clerkClient.users.updateUserMetadata(user.clerkId, {
          publicMetadata: { role: role }
        });
      } catch (clerkError) {
        console.error("Error updating user role in Clerk:", clerkError);
        // Continue even if Clerk update fails
      }
    }

    res.json(user);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

// Admin: Get all submissions for a user
router.get("/submissions/:userId", protect, isAdmin, getUserSubmissions);

export default router;
