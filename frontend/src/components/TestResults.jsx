import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, CheckCircle2, XCircle, Timer, Target, Percent, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const TestResults = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoaded && submissionId) {
      fetchResults();
    }
  }, [authLoaded, submissionId]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      if (!authLoaded) {
        // console.log("Authentication not loaded yet");
        return;
      }
      
      const token = await getToken();
      if (!token) {
        console.error("Clerk token not found. User may be signed out.");
        setLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:5000/api/v1/submission/review/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to load results. Status: ${response.status}. Response: ${errorText}`);
        setResults(null);
        return;
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("An error occurred during the fetch operation:", error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load test results. Please try again or return to your submission history.
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/submission-history")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test Results</h1>
          <p className="text-muted-foreground">
            Summary for your attempt at: <span className="font-semibold">{results.testName}</span>
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
            <Button onClick={() => navigate("/test-list")}>Take Another Test</Button>
            <Button variant="outline" onClick={() => navigate("/submission-history")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> View History
            </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Final Score</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", results.passed ? "text-green-600" : "text-destructive")}>
              {results.percentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              Completed on {new Date(results.submittedAt).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {results.passed ? <CheckCircle2 className="h-4 w-4 text-muted-foreground" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
             <Badge variant={results.passed ? "default" : "destructive"} className="text-lg">
                {results.passed ? "Passed" : "Failed"}
             </Badge>
            <p className="text-xs text-muted-foreground">Passing score is 60%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.score} / {results.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">
              {results.totalQuestions - results.score} incorrect answers
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Taken</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(results.timeTaken)}</div>
            <p className="text-xs text-muted-foreground">Total duration of the test</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Detailed Question Review using Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Question Review</CardTitle>
          <CardDescription>
            Click on any question to expand and see the details of your answer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {results.review.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center text-left">
                      <span className="font-semibold mr-4">Q{index + 1}</span>
                      <p className="truncate max-w-md">{item.question}</p>
                    </div>
                    <Badge variant={item.isCorrect ? "default" : "destructive"}>
                      {item.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Your Answer:</h4>
                      <div className={cn("p-3 rounded-md text-sm", 
                        item.isCorrect 
                        ? "bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400" 
                        : "bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-400"
                      )}>
                        {item.userAnswer || "No answer selected"}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Correct Answer:</h4>
                      <div className="p-3 rounded-md text-sm bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-400">
                        {item.correctAnswer}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Explanation:</h4>
                    <div className="p-3 rounded-md text-sm border bg-background">
                      <p className="text-muted-foreground">{item.explanation}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResults;