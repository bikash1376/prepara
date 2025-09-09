import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissionHistory();
  }, []);

  const fetchSubmissionHistory = async () => {
    try {
      const token = await getToken();
      if (!token) {
        console.error("No authentication token available");
        setSubmissions([]);
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/v1/submission/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSubmissions(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to load submission history:", data.message || "Unknown error");
        setSubmissions([]);
      }
    } catch (error) {
      console.error("Error fetching submission history:", error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  const getScoreBadge = (percentage) => {
    if (percentage >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Submission History</h1>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No submissions yet</h2>
            <p className="text-gray-500 mb-6">Take your first test to see your results here!</p>
            <button
              onClick={() => navigate("/test-list")}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black font-medium"
            >
              Browse Tests
            </button>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-black">{submissions.length}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {submissions.filter(s => s.percentage >= 60).length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round(submissions.reduce((sum, s) => sum + s.percentage, 0) / submissions.length)}%
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(submissions.reduce((sum, s) => sum + s.timeTaken, 0) / submissions.length / 60)}m
                </div>
                <div className="text-sm text-gray-600">Avg. Time</div>
              </div>
            </div>

            {/* Submissions Table */}
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Test Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Score</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Percentage</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Time Taken</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr key={submission._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{submission.testName}</div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-medium">
                          {submission.score}/{submission.totalQuestions}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`font-bold text-lg ${getScoreColor(submission.percentage)}`}>
                          {submission.percentage}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreBadge(submission.percentage)}`}>
                          {submission.percentage >= 60 ? "✅ Passed" : "❌ Failed"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600">
                        {formatTime(submission.timeTaken)}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600 text-sm">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => navigate(`/test-results/${submission._id}`)}
                          className="px-4 py-2 bg-black text-white rounded hover:bg-black text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate("/test-list")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium mr-4"
              >
                Take Another Test
              </button>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;
