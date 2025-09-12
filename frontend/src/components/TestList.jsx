import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileTextIcon } from "@radix-ui/react-icons";
import {FiBookOpen, FiRefreshCw, FiAlertCircle} from "react-icons/fi";
import { Loader2 } from "lucide-react";

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
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isApiCallInProgress, setIsApiCallInProgress] = useState(false);
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const navigate = useNavigate();

  // Hardcoded score for demonstration
  const lastScore = "85/100";
  const userName = user?.firstName || "Student";

  // Cache key for localStorage
  const TESTS_CACHE_KEY = `tests_cache_${user?.id || 'anonymous'}`;
  const CACHE_EXPIRY_KEY = `tests_cache_expiry_${user?.id || 'anonymous'}`;
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Load tests from cache
  const loadTestsFromCache = useCallback(() => {
    try {
      const cachedTests = localStorage.getItem(TESTS_CACHE_KEY);
      const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (cachedTests && cacheExpiry && Date.now() < parseInt(cacheExpiry)) {
        const parsedTests = JSON.parse(cachedTests);
        console.log('Loading tests from cache:', parsedTests.length, 'tests');
        setTests(parsedTests);
        return true;
      }
    } catch (error) {
      console.error('Error loading tests from cache:', error);
    }
    return false;
  }, [TESTS_CACHE_KEY, CACHE_EXPIRY_KEY]);

  // Save tests to cache
  const saveTestsToCache = useCallback((testsData) => {
    try {
      localStorage.setItem(TESTS_CACHE_KEY, JSON.stringify(testsData));
      localStorage.setItem(CACHE_EXPIRY_KEY, (Date.now() + CACHE_DURATION).toString());
      console.log('Tests saved to cache:', testsData.length, 'tests');
    } catch (error) {
      console.error('Error saving tests to cache:', error);
    }
  }, [TESTS_CACHE_KEY, CACHE_EXPIRY_KEY, CACHE_DURATION]);

  // Fetch function without useCallback to avoid circular dependencies
  const fetchTestsWithStatus = async (showLoading = true) => {
    console.log('fetchTestsWithStatus called, showLoading:', showLoading, 'isApiCallInProgress:', isApiCallInProgress);
    
    // Prevent multiple simultaneous API calls
    if (isApiCallInProgress) {
      console.log('API call already in progress, skipping...');
      return;
    }
    
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    setIsApiCallInProgress(true);
    
    try {
      // Ensure authentication is fully ready before making API calls
      if (!authLoaded || !userLoaded || !user) {
        console.log("Authentication not fully ready yet - authLoaded:", authLoaded, "userLoaded:", userLoaded, "user:", !!user);
        return;
      }
      
      const token = await getToken();
      console.log('Token received:', token ? `Token: ${token.substring(0, 20)}...` : 'No token');
      if (!token) {
        throw new Error("No authentication token available");
      }
      
      console.log('Making API call to:', "http://localhost:5000/api/v1/test/with-status");
      const response = await fetch("http://localhost:5000/api/v1/test/with-status", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        const testsArray = Array.isArray(data) ? data : [];
        console.log('Tests fetched successfully:', testsArray.length, 'tests');
        setTests(testsArray);
        saveTestsToCache(testsArray);
        setRetryCount(0); // Reset retry count on success
      } else {
        // Handle non-JSON error responses
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Unknown error';
        } catch (jsonError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
      setError(error.message || 'Failed to fetch tests');
      
      // Don't clear tests if we have cached data
      // setTests([]) would clear existing cached tests
    } finally {
      setLoading(false);
      setIsApiCallInProgress(false);
    }
  };

  useEffect(() => {
    console.log('TestList useEffect - authLoaded:', authLoaded, 'userLoaded:', userLoaded, 'user:', !!user);
    
    // Only proceed if both auth and user are loaded AND user exists
    if (authLoaded && userLoaded && user) {
      console.log('Authentication fully ready, proceeding with data loading...');
      
      // Try to load from cache first
      const cacheLoaded = loadTestsFromCache();
      if (cacheLoaded) {
        setLoading(false);
        console.log('Cache loaded, setting loading to false');
      }
      
      // Always fetch fresh data, but don't show loading if cache was loaded
      console.log('Fetching fresh test data...');
      fetchTestsWithStatus(!cacheLoaded);
    } else {
      console.log('Authentication not ready yet, waiting...');
      // Keep loading state while waiting for authentication
      setLoading(true);
    }
  }, [authLoaded, userLoaded, user?.id]); // Remove fetchTestsWithStatus from dependencies

  // Retry function
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchTestsWithStatus(true);
  }, []);

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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Available Tests</h2>
        {error && (
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <Card className="text-center py-8 mb-6 border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center gap-4">
            <FiAlertCircle className="w-12 h-12 text-red-500" />
            <div>
              <p className="text-red-700 font-medium">Failed to load tests</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              {retryCount > 0 && (
                <p className="text-red-500 text-xs mt-2">Retry attempt: {retryCount}</p>
              )}
            </div>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
      
      {tests.length === 0 && !error ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-gray-500">No tests available at the moment.</p>
            <Button 
              onClick={() => fetchTestsWithStatus(true)} 
              variant="outline" 
              size="sm" 
              className="mt-4"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      ) : tests.length > 0 ? (
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
      ) : null}
    </div>
  );
};

export default TestList;