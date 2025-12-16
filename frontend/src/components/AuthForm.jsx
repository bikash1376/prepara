import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignIn, SignUp, useUser, useAuth } from "@clerk/clerk-react";

const AuthForm = ({ mode = "login" }) => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isSignedIn && user) {
      const userRole = user.publicMetadata?.role;
      if (userRole) {
        // User already has a role, redirect to appropriate dashboard
        if (userRole === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      }
    }
  }, [isSignedIn, user, navigate]);

  const handleRoleSelection = async () => {
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/set-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          role: role
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Force refresh user data to get updated metadata
        await user.reload();

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        setMessage(data.message || "Failed to set role");
      }
    } catch (err) {
      console.error("Role selection error:", err);
      setMessage("Failed to set role. Please try again.");
    }

    setLoading(false);
  };

  // If user is signed in but doesn't have a role, show role selection
  if (isSignedIn && user && !user.publicMetadata?.role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Your Role</h2>
              <p className="text-muted-foreground text-sm">
                Welcome {user.firstName || user.username}! Please select your role to continue:
              </p>
            </div>

            <select
              className="w-full border border-input rounded-lg px-4 py-3 mb-6 text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              {/* <option value="admin">Admin</option> */}
            </select>

            <button
              onClick={handleRoleSelection}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Setting Role..." : "Continue"}
            </button>

            {message && (
              <div className="mt-4 text-center text-destructive text-sm">{message}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show Clerk's built-in authentication components centered
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md mx-auto px-4">
        {mode === "signup" ? (
          <SignUp
            routing="path"
            path="/signup"
            signInUrl="/login"
            afterSignUpUrl="/"
            fallbackRedirectUrl="/"
          />
        ) : (
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/signup"
            afterSignInUrl="/"
            fallbackRedirectUrl="/"
          />
        )}
      </div>
    </div>
  );
};

export default AuthForm;
