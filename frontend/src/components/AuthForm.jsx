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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left side - Image (70-80% width) */}
            <div className="hidden lg:block lg:col-span-3 xl:col-span-4">
              <img
                src="/auth-illustration.jpg"
                alt="Authentication"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  // Fallback to SVG if JPEG doesn't exist
                  e.target.src = '/auth-illustration.svg';
                }}
              />
            </div>

            {/* Right side - Role Selection Form (20-30% width) */}
            <div className="lg:col-span-2 xl:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto lg:mx-0 w-full">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Select Your Role</h2>
                  <p className="text-gray-600 text-sm">
                    Welcome {user.firstName || user.username}! Please select your role to continue:
                  </p>
                </div>

                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  {/* <option value="admin">Admin</option> */}
                </select>

                <button
                  onClick={handleRoleSelection}
                  className="w-full px-6 py-3 bg-[#7A6AD8] text-white rounded-lg hover:bg-[#6B5BC7] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Setting Role..." : "Continue"}
                </button>

                {message && (
                  <div className="mt-4 text-center text-red-600 text-sm">{message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show Clerk's built-in authentication components with side-by-side layout
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Left side - Image (70-80% width) */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
            <img
              src="image.png"
              alt="Authentication"
              className="w-full h-auto object-contain"
              onError={(e) => {
                // Fallback to SVG if JPEG doesn't exist
                e.target.src = '/auth-illustration.svg';
              }}
            />
          </div>

          {/* Right side - Auth Forms (20-30% width) */}
          <div className="lg:col-span-2 xl:col-span-1">
            {/* <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto lg:mx-0 w-full"> */}
              {/* <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {mode === "signup" ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {mode === "signup"
                    ? "Sign up to start your SAT practice journey"
                    : "Sign in to continue your practice"
                  }
                </p>
              </div> */}

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
        </div>
      </div>
    // </div>
  );
};

export default AuthForm;
