import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const TestResults = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [submissionId]);

  const fetchResults = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/v1/submission/review/${submissionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      } else {
        alert("Failed to load results");
        navigate("/submission-history");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      alert("Error loading results");
      navigate("/submission-history");
    } finally {
      setLoading(false);
    }
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

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100 border-green-200";
    if (percentage >= 60) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold text-red-600">Results not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6">
      {/* Results Header */}
      <div className={`rounded-lg shadow-md p-8 mb-6 border-2 ${getScoreBgColor(results.percentage)}`}>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{results.testName}</h1>
          <div className="mb-4">
            <span className="text-sm text-gray-600">Test completed on </span>
            <span className="font-medium">
              {new Date(results.submittedAt).toLocaleDateString()} at{" "}
              {new Date(results.submittedAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Score Display */}
          <div className="mb-6">
            <div className={`text-6xl font-bold ${getScoreColor(results.percentage)} mb-2`}>
              {results.percentage}%
            </div>
            <div className="text-xl text-gray-700 mb-2">
              {results.score} out of {results.totalQuestions} correct
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${
              results.passed 
                ? "bg-green-500 text-white" 
                : "bg-red-500 text-white"
            }`}>
              {results.passed ? "✅ PASSED" : "❌ FAILED"}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-black">{results.score}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-orange-600">{results.totalQuestions - results.score}</div>
              <div className="text-sm text-gray-600">Incorrect Answers</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="text-2xl font-bold text-purple-600">{formatTime(results.timeTaken)}</div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setShowReview(!showReview)}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black font-medium"
          >
            {showReview ? "Hide Review" : "Show Detailed Review"}
          </button>
          <button
            onClick={() => navigate("/test-list")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Take Another Test
          </button>
          <button
            onClick={() => navigate("/submission-history")}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            View History
          </button>
        </div>
      </div>

      {/* Detailed Review */}
      {showReview && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Detailed Review</h2>
          
          <div className="space-y-6">
            {results.review.map((item, index) => (
              <div
                key={index}
                className={`border-l-4 p-6 rounded-r-lg ${
                  item.isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-500">
                    Question {index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1">
                    {item.question}
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                      <div className={`mt-1 p-3 rounded ${
                        item.isCorrect 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {item.userAnswer || "No answer selected"}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                      <div className="mt-1 p-3 rounded bg-green-100 text-green-800">
                        {item.correctAnswer}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded border">
                  <span className="text-sm font-medium text-gray-600">Explanation:</span>
                  <p className="mt-1 text-gray-700">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResults;
