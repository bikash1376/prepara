import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import {jwtDecode} from "jwt-decode";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        console.log("AuthSuccess: Token received:", token ? "Yes" : "No");

        if (!token) {
          console.log("AuthSuccess: No token found, redirecting to login");
          setError("No authentication token received");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        // Validate token format
        if (token.split('.').length !== 3) {
          console.log("AuthSuccess: Invalid token format");
          setError("Invalid token format");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        localStorage.setItem("token", token);

        // Decode token to extract role
        const decoded = jwtDecode(token);
        console.log("AuthSuccess: Decoded token:", decoded);
        
        if (!decoded.role) {
          console.log("AuthSuccess: No role in token");
          setError("Invalid token - no role found");
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        localStorage.setItem("role", decoded.role);

        console.log("AuthSuccess: Redirecting to dashboard for role:", decoded.role);

        // Small delay to ensure localStorage is fully updated before navigation
        setTimeout(() => {
          if (decoded.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/student/dashboard", { replace: true });
          }
        }, 100);
      } catch (err) {
        console.error("AuthSuccess: Error processing authentication:", err);
        setError("Authentication processing failed");
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    handleAuth();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-600 mb-4">Authentication Error: {error}</p>
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg mb-4">Processing authentication...</p>
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
};

export default AuthSuccess;
