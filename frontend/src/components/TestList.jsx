import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FiRefreshCw, FiClock, FiAlertCircle, FiExternalLink, FiInfo, FiCheckCircle, FiFileText } from "react-icons/fi";
import { Loader2, Clock, Calendar, BookOpen, Award, BarChart2, CheckCircle } from "lucide-react";


// const poppins = Poppins_Regular;



const TestCard = ({ test, onTakeTest }) => (
  <div className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-primary transition-all duration-200 bg-card dark:bg-card max-w-sm h-[250px] ">
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{test.testname}</h3>
            <p className="text-sm text-muted-foreground">Full-length practice test</p>
          </div>
        </div>
        {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
          Available
        </span> */}
      </div>

      <div className="flex-1"></div>

      <div className="flex justify-end space-x-3">
        {/* <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              <FiInfo className="w-4 h-4 mr-1" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{test.testname}</DialogTitle>
              <DialogDescription>Test details and instructions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 mt-0.5">
                  <FiClock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Time Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    {test.duration || 180} minutes to complete the test.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 mt-0.5">
                  <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Your score will be available immediately after submission.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 mt-0.5">
                  <FiInfo className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">Instructions</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-1">
                    <li>Ensure you have a stable internet connection</li>
                    <li>Use the full-screen mode for best experience</li>
                    <li>Answers are saved automatically</li>
                  </ul>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => onTakeTest(test._id)} className="bg-[#7A6AD8] hover:bg-[#6B5BC7] rounded-lg">
                Start Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="text-white rounded-full px-6 py-5 "
            >
              Start Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{test.testname}</DialogTitle>
              <DialogDescription>Ready to begin your test?</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20 mt-0.5">
                  <FiClock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Test Duration</h4>
                  <p className="text-sm text-muted-foreground">
                    This test will take approximately {test.duration || 180} minutes to complete.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20 mt-0.5">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Questions</h4>
                  <p className="text-sm text-muted-foreground">
                    {test.questions?.length || 0} questions covering various topics.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-1.5 rounded-full bg-primary/10 dark:bg-primary/20 mt-0.5">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Scoring</h4>
                  <p className="text-sm text-muted-foreground">
                    Your performance will be evaluated and scored immediately.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={() => onTakeTest(test._id)} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg">
                Start Test
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
);

// Stats Card Component
const StatCard = ({ icon: Icon, title, value, description }) => (
  <div className="bg-card rounded-lg p-4 shadow-sm">
    <div className="flex items-center">
      <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20 text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold text-foreground">{value}</p>
      </div>
    </div>
  </div>
);

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

  const userName = user?.firstName || user?.username || "Student";
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
  // const completedTests = tests.filter(test => test.isCompleted);

  return (
    <div className={`min-h-screen bg-background`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Hero Section */}
      <div className="bg-card border-b border-border ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Welcome back, {userName}!
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              Prepare for success with our GRE practice tests
            </p>
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Practice Tests</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Select a test to begin your practice session
            </p>
          </div>
          <div className="mt-4 flex-shrink-0 md:mt-0 md:ml-4">
            <Button 
              onClick={() => fetchTestsWithStatus(true)} 
              variant="outline" 
              size="sm" 
              disabled={loading}
              className="inline-flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-md bg-destructive/10 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error loading tests</h3>
                <div className="mt-2 text-sm text-destructive/90">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchTestsWithStatus(true)}
                    className="border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-2" />
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && availableTests.length === 0 && (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <FiFileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No tests available</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              There are no tests available at the moment. Please check back later.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => fetchTestsWithStatus(true)}
                variant="outline"
                className="inline-flex items-center"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}

        {/* Tests Grid */}
        {!error && availableTests.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {availableTests.map(test => (
              <TestCard 
                key={test._id} 
                test={test} 
                onTakeTest={handleTakeTest} 
              />
            ))}
          </div>
        )}

        {/* Test Taking Tips */}
        <div className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-xl p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h3 className="text-lg font-medium text-foreground">Test Taking Tips</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Maximize your score with these essential test-taking strategies and time management tips.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Dialog>
                <DialogTrigger asChild>

                  <Button variant="outline" className="border-primary/20 text-foreground hover:bg-primary/10">
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Tips
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Test Taking Guide</DialogTitle>
                    <DialogDescription>Essential strategies for success</DialogDescription>
                  </DialogHeader>
                  <div className="prose prose-sm dark:prose-invert max-w-none py-4 space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">1. Time Management</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Allocate time for each section and stick to it</li>
                        <li>Don't spend too much time on any single question</li>
                        <li>Answer easier questions first, then return to harder ones</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">2. Reading Passages</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Skim the questions first to know what to look for</li>
                        <li>Underline key points as you read</li>
                        <li>Eliminate obviously wrong answers first</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">3. Math Section</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Show your work for every problem</li>
                        <li>Check your calculations</li>
                        <li>Use the calculator strategically</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TestList;
