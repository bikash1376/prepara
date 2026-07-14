import React from "react";
import { SignedIn, RedirectToSignIn, SignedOut, useAuth, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import TestList from "./TestList";

const StudentDashboard = () => {
  const { isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded } = useUser();

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
        <TestList />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default StudentDashboard;
