import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthForm = ({ mode = "login" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated and redirect
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
      localStorage.removeItem("username");
    }
    if (token && userRole) {
      // User is already logged in, redirect to appropriate dashboard
      if (userRole === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
      return;
    }

    // Check for OAuth errors in URL params
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    
    if (error) {
      const errorMessages = {
        oauth_error: "Google authentication failed. Please try again.",
        no_user: "Google authentication did not return user information.",
        token_error: "Failed to generate authentication token.",
        google: "Google authentication was cancelled or failed."
      };
      
      setMessage(errorMessages[error] || "Authentication error occurred.");
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const endpoint =
        mode === "signup" ? "/api/v1/auth/signup" : "/api/v1/auth/login";
      const body =
        mode === "signup"
          ? { name, email, password, role }
          : { email, password };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("username", data.user.name || "");
        setMessage("Success! Redirecting...");

        // ✅ Redirect based on role
        if (data.user.role === "admin") {
          window.location.href = "/admin/test-list";
        } else {
          window.location.href = "/student/dashboard";
        }
      } else {
        setMessage(data.message || "Error");
      }
    } catch (err) {
      setMessage("Network error", err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/v1/auth/google";
  };

  // Show username if logged in
  const username = localStorage.getItem("username");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {username && (
        <div className="mb-2 text-green-700 text-center font-semibold">
          Welcome, {username}!
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4">
        {mode === "signup" ? "Sign Up" : "Login"}
      </h2>
      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <select
              className="w-full border rounded px-3 py-2 mb-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </>
        )}
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-black text-white rounded mb-2"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : mode === "signup"
            ? "Sign Up"
            : "Login"}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="w-full px-4 py-2 bg-red-500 text-white rounded"
      >
        Continue with Google
      </button>
      
      {message && (
        <div className="mt-4 text-center text-red-600">{message}</div>
      )}
    </div>
  );
};

export default AuthForm;
