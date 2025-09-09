import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useTheme } from "./theme-provider";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const dropdownRef = useRef(null); // desktop
  const mobileDropdownRef = useRef(null); // mobile

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

  if (!isSignedIn || !user) return null; // Don't show navbar if not logged in

  const role = user?.publicMetadata?.role;
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white text-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold"><img src="https://10xlearningacademy.com/assets/images/logo-learn2.png" alt="" width={150}/></span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Common Links */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "bg-black text-white" : "hover:bg-black hover:text-white"
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
                    isActive("/admin/dashboard") ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  }`}
                >
                  🎛️ Dashboard
                </Link>
                <Link
                  to="/admin/test-list"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/test-list") ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  }`}
                >
                  📝 Manage Tests
                </Link>
                <Link
                  to="/admin/add-test"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive("/admin/add-test") ? "bg-black text-white" : "hover:bg-black hover:text-white"
                  }`}
                >
                  ➕ Add Test
                </Link>
              </>
            )}

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => {
                  const newTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
                  setTheme(newTheme);
                }}
                className="p-2 rounded-md hover:bg-gray-700 transition-colors"
                title={`Current theme: ${theme}`}
              >
                {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
              </button>
            </div>

            {/* User Button */}
            <div className="relative ml-6">
              <UserButton 
                afterSignOutUrl="/login"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-white border shadow-lg",
                    userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-100"
                  }
                }}
              />
            </div>
          </div>

          {/* Mobile Theme Toggle and User Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => {
                const newTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
                setTheme(newTheme);
              }}
              className="p-2 rounded-md hover:bg-gray-700 transition-colors"
              title={`Current theme: ${theme}`}
            >
              {theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "🖥️"}
            </button>
            <UserButton 
              afterSignOutUrl="/login"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "bg-white border shadow-lg",
                  userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-100"
                }
              }}
            />
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
