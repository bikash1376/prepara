import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileTextIcon } from "@radix-ui/react-icons";
import { FiBookOpen, FiRefreshCw, FiCheckSquare, FiClock, FiAlertCircle } from "react-icons/fi";
import { Loader2 } from "lucide-react";

const GuideSVG = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l-2.83 2.83 2.83-2.83z" /><path d="M12 2v20" /><path d="M16 16.5l4-2.5-4-2.5" /><path d="M8 7.5l-4 2.5 4 2.5" />
  </svg>
);

const TestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const navigate = useNavigate();

  const userName = user?.firstName || "Student";
  const lastScore = "85/100"; // Hardcoded for demonstration

  const fetchTestsWithStatus = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      if (!authLoaded || !userLoaded || !user) {
        // Wait for auth to be ready
        return;
      }
      const token = await getToken();
      if (!token) throw new Error("Authentication token not available.");
      
      const response = await fetch("http://localhost:5000/api/v1/test/with-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError(err.message || 'Failed to fetch tests');
    } finally {
      setLoading(false);
    }
  }, [authLoaded, userLoaded, user, getToken]);

  useEffect(() => {
    if (authLoaded && userLoaded && user) {
      fetchTestsWithStatus(true);
    }
  }, [authLoaded, userLoaded, user, fetchTestsWithStatus]);

  const handleTakeTest = (testId) => {
    navigate(`/test-submission/${testId}`);
  };

  if (loading && tests.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const availableTests = tests.filter(test => !test.isCompleted);
  const completedTests = tests.filter(test => test.isCompleted);

  return (
    <div className="container mx-auto py-8 px-4">
      {/* <h1 className="text-3xl font-bold mb-2">Welcome, {userName}!</h1> */}
      {/* <p className="text-muted-foreground text-lg mb-6">Last Test Score: {lastScore}</p> */}
      
      {/* <div className="mb-8">
        <Card className="flex flex-col text-center w-full max-w-sm mx-auto md:mx-0">
          <CardHeader className="flex flex-col items-center">
            <GuideSVG className="w-12 h-12 text-blue-500 mb-2" />
            <CardTitle className="text-lg font-semibold">Test Taking Guide</CardTitle>
            <CardDescription>Tips and tricks to help you prepare.</CardDescription>
          </CardHeader>
          <CardFooter className="mt-auto flex justify-center">
            <Dialog>
              <DialogTrigger asChild><Button>Read Guide</Button></DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Test Taking Guide</DialogTitle>
                  <DialogDescription>Essential steps for a successful test experience.</DialogDescription>
                </DialogHeader>
                <div className="prose prose-sm dark:prose-invert max-w-none text-left py-4 space-y-4">
                  <div>
                    <h3 className="font-semibold">1. Preparation</h3>
                    <p>Ensure you are in a quiet environment. Check your internet connection and close any unnecessary applications.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">2. Time Management</h3>
                    <p>Keep an eye on the clock. Allocate a specific amount of time for each question. If you're stuck, move on and come back later.</p>
                  </div>
                   <div>
                    <h3 className="font-semibold">3. Read Carefully</h3>
                    <p>Read each question and all options thoroughly before selecting your answer. Misreading a single word can change the meaning.</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div> */}

      {/* <Separator className="my-8" /> */}
      
      {/* --- Available Tests Section --- */}
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Tests</h2>
        <Button onClick={() => fetchTestsWithStatus(true)} variant="outline" size="sm" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FiRefreshCw className="w-4 h-4 mr-2" />}
            Refresh
        </Button>
      </div> */}

      {error && (
        <Card className="text-center py-8 mb-6 border-destructive bg-destructive/10">
          <CardContent className="flex flex-col items-center gap-4">
            <FiAlertCircle className="w-10 h-10 text-destructive" />
            <div>
              <p className="font-medium text-destructive">Failed to load tests</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && availableTests.length === 0 && (
        <Card className="text-center py-10">
          <CardContent>
            <p className="text-muted-foreground">No new tests are available at the moment.</p>
          </CardContent>
        </Card>
      )}

      {!error && availableTests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableTests.map(test => (
            <Card key={test._id} className="flex flex-col">
              <CardHeader>
                <FileTextIcon className="w-8 h-8 text-primary mb-2" />
                <CardTitle>{test.testname}</CardTitle>
                <CardDescription>Click below to begin the test.</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Take Test</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{test.testname}</DialogTitle>
                      <DialogDescription>Review the instructions before you begin.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex items-start space-x-3">
                        <FiClock className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                          <h4 className="font-semibold">Time Limit</h4>
                          <p className="text-sm text-muted-foreground">This is a timed test. Ensure you complete it in one sitting.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FiCheckSquare className="h-5 w-5 mt-1 flex-shrink-0 text-primary" />
                        <div>
                          <h4 className="font-semibold">Submission</h4>
                          <p className="text-sm text-muted-foreground">Answers are submitted automatically when the time is up or when you finish.</p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                      <Button onClick={() => handleTakeTest(test._id)}>Start Test</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- Completed Tests Section --- */}
      {completedTests.length > 0 && (
        <>
            <Separator className="my-12" />
            <div className="mb-6">
                <h2 className="text-2xl font-bold">Completed Tests</h2>
                <p className="text-muted-foreground">Tests you have already taken.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTests.map(test => (
                    <Card key={test._id} className="flex flex-col bg-muted/50">
                        <CardHeader>
                            <FileTextIcon className="w-8 h-8 text-muted-foreground mb-2" />
                            <CardTitle className="text-muted-foreground">{test.testname}</CardTitle>
                            <CardDescription>You have already completed this test.</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            <Button disabled className="w-full">
                                <FiBookOpen className="mr-2 h-4 w-4" />
                                Completed
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
      )}
    </div>
  );
};

export default TestList;
