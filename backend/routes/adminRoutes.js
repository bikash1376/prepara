import express from "express";
import User from "../models/User.js";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import { getUserSubmissions } from "../controllers/submissionController.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

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
