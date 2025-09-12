import { createClerkClient } from '@clerk/backend';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import User from "../models/User.js";

// Initialize Clerk client
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Helper function to send JSON response
const sendJsonResponse = (res, status, message, data = {}) => {
  return res.status(status).json({ 
    success: status >= 200 && status < 300, 
    message, 
    ...data 
  });
};

export const protect = async (req, res, next) => {
  // Set Content-Type to JSON for all responses
  res.setHeader('Content-Type', 'application/json');
  
  // Check if CLERK_SECRET_KEY is set
  if (!process.env.CLERK_SECRET_KEY) {
    console.error("CLERK_SECRET_KEY environment variable is not set");
    return sendJsonResponse(res, 500, "Server configuration error");
  }

  // Use Clerk's built-in middleware for token verification
  ClerkExpressRequireAuth()(req, res, async (err) => {
    if (err) {
      console.error("Clerk auth error:", err);
      return sendJsonResponse(res, 401, "Authentication failed");
    }

    try {
      const userId = req.auth.userId;
      if (!userId) {
        return sendJsonResponse(res, 401, "No user ID found in token");
      }
      
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
      
      console.log("Auth middleware - User authenticated:", {
        id: userId,
        role: role,
        email: clerkUser.emailAddresses[0]?.emailAddress
      });
      
      // Continue to next middleware
      next();
    } catch (error) {
      console.error("Error in user sync:", error);
      return sendJsonResponse(res, 500, "Error processing user information");
    }
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return sendJsonResponse(res, 403, "Access denied - Admin role required");
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user?.role !== "student") {
    return sendJsonResponse(res, 403, "Access denied - Student role required");
  }
  next();
};
