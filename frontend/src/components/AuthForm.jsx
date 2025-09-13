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
      const response = await fetch("http://localhost:5000/api/v1/auth/set-role", {
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
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Select Your Role</h2>
        <p className="mb-4 text-gray-600">
          Welcome {user.firstName}! Please select your role to continue:
        </p>
        
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          {/* <option value="admin">Admin</option> */}
        </select>
        
        <button
          onClick={handleRoleSelection}
          className="w-full px-4 py-2 bg-black text-white rounded"
          disabled={loading}
        >
          {loading ? "Setting Role..." : "Continue"}
        </button>
        
        {message && (
          <div className="mt-4 text-center text-red-600">{message}</div>
        )}
      </div>
    );
  }

  // Show Clerk's built-in authentication components
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
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
  );
};

export default AuthForm;
