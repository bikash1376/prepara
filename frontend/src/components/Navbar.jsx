import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CircleUserRound } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const dropdownRef = useRef(null); // desktop
  const mobileDropdownRef = useRef(null); // mobile

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        (mobileDropdownRef.current && mobileDropdownRef.current.contains(event.target))
      ) {
        return;
      }
      setShowDropdown(false);
      setShowMobileDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!token) return null; // Don't show navbar if not logged in

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">SATest</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Common Links */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "bg-black" : "hover:bg-black"
              }`}
            >
              🏠 Home
            </Link>

            {/* Student Links */}
            {role === "student" && (
              <>
                {/* <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/student/dashboard") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/test-list"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/test-list") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📚 Tests
                </Link> */}
                <Link
                  to="/submission-history"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/submission-history") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📋 Attempts
                </Link>
              </>
            )}

            {/* Admin Links */}
            {role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/dashboard") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  🎛️ Dashboard
                </Link>
                <Link
                  to="/admin/test-list"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/test-list") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📝 Manage Tests
                </Link>
                <Link
                  to="/admin/add-test"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/add-test") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  ➕ Add Test
                </Link>
              </>
            )}

            {/* User Dropdown */}
            <div className="relative ml-6" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <CircleUserRound size={20} />
                <span>{role === "admin" ? "Admin" : "Student"}</span>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{role === "admin" ? "Admin" : "Student"}</div>
                    <div className="text-xs text-gray-500">{localStorage.getItem("username") || "User"}</div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile User Dropdown */}
          <div className="md:hidden relative" ref={mobileDropdownRef}>
            <button
              onClick={() => setShowMobileDropdown(!showMobileDropdown)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <CircleUserRound size={20} />
            </button>
            
            {showMobileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{role === "admin" ? "Admin" : "Student"}</div>
                  <div className="text-xs text-gray-500">{localStorage.getItem("username") || "User"}</div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMobileDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "bg-black" : "hover:bg-black"
              }`}
            >
              🏠 Home
            </Link>

            {role === "student" && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/student/dashboard") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/test-list"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/test-list") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📚 Tests
                </Link>
                <Link
                  to="/submission-history"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/submission-history") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📋 History
                </Link>
              </>
            )}

            {role === "admin" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/dashboard") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  🎛️ Dashboard
                </Link>
                <Link
                  to="/admin/test-list"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/test-list") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  📝 Manage Tests
                </Link>
                <Link
                  to="/admin/add-test"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/add-test") ? "bg-black" : "hover:bg-black"
                  }`}
                >
                  ➕ Add Test
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
