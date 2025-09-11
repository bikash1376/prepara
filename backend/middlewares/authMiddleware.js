import { createClerkClient } from '@clerk/backend';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from "../models/User.js";

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export const protect = async (req, res, next) => {
  try {
    // Use Clerk's built-in middleware for token verification
    ClerkExpressRequireAuth()(req, res, async (err) => {
      if (err) {
        console.error("Clerk auth error:", err);
        return res.status(401).json({ message: "Authentication failed" });
      }

      try {
        const userId = req.auth.userId;
        
        // Get user from Clerk
        const clerkUser = await clerkClient.users.getUser(userId);
        const role = clerkUser.publicMetadata?.role || 'student';

        // Sync user to MongoDB if not exists
        await User.findOneAndUpdate(
          { clerkId: userId },
          {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
            role: role
          },
          { upsert: true, new: true }
        );

        // Attach user info to request
        req.user = {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          role: role
        };
        
        // console.log("Auth middleware - User authenticated:", {
        //   id: userId,
        //   role: role,
        //   email: clerkUser.emailAddresses[0]?.emailAddress
        // });

        next();
      } catch (userError) {
        console.error("User processing error:", userError);
        res.status(500).json({ message: "Failed to process user data" });
      }
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied - Admin role required" });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user?.role !== "student") {
    return res.status(403).json({ message: "Access denied - Student role required" });
  }
  next();
};
