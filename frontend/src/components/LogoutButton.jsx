import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login"; // redirect back to login page
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
// ✅ Signup with email/password and role selection