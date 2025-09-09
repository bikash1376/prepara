import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isSignedIn, user, isLoaded } = useUser();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has a role assigned
  const userRole = user?.publicMetadata?.role;
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user's actual role
    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/student/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
