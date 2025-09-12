import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import TestList from "./TestList";
import { SignedIn, RedirectToSignIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

const StudentDashboard = () => {
  const { isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded } = useUser();

  // Show loading state while Clerk is initializing
  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
    <SignedIn>
    <TestList/>
    </SignedIn>
    <SignedOut>
    <RedirectToSignIn />
    </SignedOut>
    {/* <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🎓 Student Dashboard</h2>

      <div className="flex flex-col w-fit gap-4">
        <Link
          to="/test-list"
          className="px-4 py-2 bg-black text-white rounded"
        >
          📚 View Available Tests
        </Link> */}

        {/* <Link
          to="/test-viewer/123" // example test id, in real use map available tests
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          ▶️ Take a Test
        </Link> */}

        {/* <Link
          to="/profile"
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          👤 My Profile
        </Link> */}

        <div>
          {/* <LogoutButton /> */}
        {/* </div> */}
      {/* </div> */}
    // </div>
    </>
  );
};

export default StudentDashboard;
