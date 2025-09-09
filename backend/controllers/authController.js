import { createClerkClient } from '@clerk/backend';
import User from '../models/User.js';

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Set user role in Clerk metadata
export const setUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    // Validate role
    const validRoles = ["student", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'student' or 'admin'" });
    }

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role
      }
    });

    // Also update in your MongoDB if you want to keep local records
    await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        role: role,
        clerkId: userId
      },
      { upsert: true, new: true }
    );

    res.json({ message: "Role updated successfully", role });
  } catch (err) {
    console.error("Set role error:", err);
    res.status(500).json({ message: "Failed to set user role" });
  }
};

// Get user profile with role
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.auth;
    
    // Get user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    
    // Get role from metadata, default to 'student'
    const role = clerkUser.publicMetadata?.role || 'student';
    
    // Update/create user in MongoDB
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { 
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName + ' ' + clerkUser.lastName,
        role: role
      },
      { upsert: true, new: true }
    );

    res.json({ 
      user: {
        id: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: clerkUser.firstName + ' ' + clerkUser.lastName,
        role: role
      }
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to get user profile" });
  }
};

// Sync user data from Clerk webhook
export const syncUser = async (req, res) => {
  try {
    const { data, type } = req.body;
    
    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, public_metadata } = data;
      
      const role = public_metadata?.role || 'student';
      
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          email: email_addresses[0]?.email_address,
          name: `${first_name || ''} ${last_name || ''}`.trim(),
          role: role
        },
        { upsert: true, new: true }
      );
    }
    
    res.json({ message: "User synced successfully" });
  } catch (err) {
    console.error("Sync user error:", err);
    res.status(500).json({ message: "Failed to sync user" });
  }
};
