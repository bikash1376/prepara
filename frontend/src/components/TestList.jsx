import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileTextIcon } from "@radix-ui/react-icons";
import {FiBookOpen} from "react-icons/fi";

const GuideSVG = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2l-2.83 2.83 2.83-2.83z" />
    <path d="M12 2v20" />
    <path d="M16 16.5l4-2.5-4-2.5" />
    <path d="M8 7.5l-4 2.5 4 2.5" />
  </svg>
);

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // Hardcoded score for demonstration
  const lastScore = "85/100";
  const userName = user?.firstName || "Student";

  useEffect(() => {
    fetchTestsWithStatus();
  }, []);

  const fetchTestsWithStatus = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No authentication token available");
        setTests([]);
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/v1/test/with-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTests(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch tests:", data.message || "Unknown error");
        setTests([]);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeTest = (testId, isCompleted) => {
    if (isCompleted) {
      alert("You have already completed this test!");
      return;
    }
    navigate(`/test-submission/${testId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome Section */}
      <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1>
      {/* <p className="text-gray-500 text-lg mb-6">Your test dashboard.</p> */}
      <p className="text-gray-500 text-lg mb-6">Last Test Score : {lastScore}</p>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* <div className="text-2xl font-extrabold text-blue-600"> Last Test Score : {lastScore}</div> */}
        {/* Last Test Score Card */}
        {/* <Card className="text-center">
          <CardHeader>
            <CardTitle>Last Test Score</CardTitle>
            <CardDescription className="text-sm">Based on your most recent attempt.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-blue-600">{lastScore}</div>
          </CardContent>
        </Card> */}

        {/* Guides Card with Dialog */}
        <Card className="flex flex-col text-center">
  <CardHeader className="flex flex-col items-center space-y-2">
    <div className="flex flex-col items-center">
      <GuideSVG className="w-12 h-12 text-blue-500 mb-2" />
      <div>
        <CardTitle className="text-lg font-semibold">Test Taking Guide</CardTitle>
        <CardDescription>
          Tips and tricks to help you prepare.
        </CardDescription>
      </div>
    </div>
  </CardHeader>

  <CardFooter className="mt-auto flex flex-col items-center">
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit" variant="default">Read Guide</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Test Taking Guide</DialogTitle>
          <DialogDescription>
            Essential steps for a successful test experience.
          </DialogDescription>
        </DialogHeader>
        <div className="prose dark:prose-invert max-w-none text-left">
          <h3 className="text-xl font-bold mt-4">1. Preparation</h3>
          <p>
            Ensure you are in a quiet environment. Check your internet
            connection and close any unnecessary applications to avoid
            distractions.
          </p>
          <h3 className="text-xl font-bold mt-4">2. Time Management</h3>
          <p>
            Keep an eye on the clock. Allocate a specific amount of time
            for each question and stick to it. If you're stuck, move on
            and come back later.
          </p>
          <h3 className="text-xl font-bold mt-4">3. Read Carefully</h3>
          <p>
            Read each question and all its options thoroughly before
            selecting your answer. Misreading a single word can change the
            entire meaning of a question.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  </CardFooter>
</Card>

      </div>

      <hr className="my-8" />

      {/* Available Tests Section */}
      <h2 className="text-2xl font-bold mb-6">Available Tests</h2>
      
      {tests.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No tests available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map(test => (
            <Card key={test._id} className="flex flex-col">
              <CardHeader className="flex-grow">
                <FileTextIcon className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>{test.testname}</CardTitle>
                <CardDescription>Click below to take the test.</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button
                  className="w-full"
                  onClick={() => handleTakeTest(test._id, test.isCompleted)}
                  disabled={test.isCompleted}
                >
                  {test.isCompleted ? (
                    <span className="flex items-center">
                      {/* <BookOpenIcon className="mr-2" /> */}
                      <FiBookOpen className="mr-2" />
                       Completed
                    </span>
                  ) : (
                    "Take Test"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestList;