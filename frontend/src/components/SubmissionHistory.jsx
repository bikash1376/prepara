import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { FaHistory, FaFileAlt, FaCheckCircle, FaTimesCircle, FaClipboardList, FaUserCheck, FaPercentage, FaClock, FaArrowRight } from 'react-icons/fa';
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded: authLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoaded) {
      fetchSubmissionHistory();
    }
  }, [authLoaded]);

  const fetchSubmissionHistory = async () => {
    // console.log('fetchSubmissionHistory called');
    setLoading(true);
    try {
      if (!authLoaded) {
        return;
      }
      
      const token = await getToken();
      if (!token) {
        setSubmissions([]);
        setLoading(false);
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/v1/submission/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubmissions(Array.isArray(data) ? data : []);
      } else {
        // Handle non-JSON error responses
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || 'Unknown error';
        } catch (jsonError) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        console.error("Failed to load submission history:", errorMessage);
        setSubmissions([]);
      }
    } catch (error) {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const averageScore = submissions.length > 0 ? Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length) : 0;
  const averageTime = submissions.length > 0 ? Math.round(submissions.reduce((sum, s) => sum + s.timeTaken, 0) / submissions.length / 60) : 0;
  const testsPassed = submissions.filter(s => s.percentage >= 60).length;

  return (
    <div className="container max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="md:text-3xl text-2xl font-bold flex items-center">
          <FaHistory className="mr-3" />
          Submission History
        </h1>
        <Button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</Button>
      </div>

      {submissions.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <FaFileAlt className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Submissions Yet</h2>
            <p className="text-muted-foreground mb-6">It looks like you haven't taken any tests. Start one now!</p>
            <Button onClick={() => navigate("/test-list")}>
              Browse Tests <FaArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                <FaClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{submissions.length}</div>
                <p className="text-xs text-muted-foreground">tests taken</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
                <FaUserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testsPassed}</div>
                <p className="text-xs text-muted-foreground">passed with 60% or higher</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <FaPercentage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageScore}%</div>
                <p className="text-xs text-muted-foreground">across all tests</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Time</CardTitle>
                <FaClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageTime}m</div>
                <p className="text-xs text-muted-foreground">average time per test</p>
              </CardContent>
            </Card>
          </div>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Submissions</CardTitle>
              <CardDescription>A detailed list of all your test attempts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Time Taken</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell className="font-medium">{submission.testName}</TableCell>
                      <TableCell className="text-center">{submission.score}/{submission.totalQuestions}</TableCell>
                      <TableCell className={cn("text-center font-bold", getScoreColor(submission.percentage))}>
                        {submission.percentage}%
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={submission.percentage >= 60 ? "default" : "destructive"}>
                          {submission.percentage >= 60 ? (
                            <FaCheckCircle className="mr-1.5 h-3.5 w-3.5" />
                          ) : (
                            <FaTimesCircle className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          {submission.percentage >= 60 ? "Passed" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{formatTime(submission.timeTaken)}</TableCell>
                      <TableCell className="text-right">{formatDate(submission.submittedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/test-results/${submission._id}`)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SubmissionHistory;