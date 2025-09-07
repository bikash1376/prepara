import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const emptyQuestion = {
  question: "",
  options: ["", "", "", ""],
  answer: "",
  explanation: ""
};

const EditTest = () => {
  const { id } = useParams();
  const [testname, setTestname] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/v1/admin/tests/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then(res => res.json())
      .then(data => {
        setTestname(data.testname);
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(() => {
        setMessage("Error loading test");
        setLoading(false);
      });
  }, [id]);

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: "",
      options: ["", "", "", ""],
      answer: "",
      explanation: ""
    }]);
  };

  const removeQuestion = (idx) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/tests/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ testname, questions })
        }
      );
      if (res.ok) {
        setMessage("Test updated successfully!");
        setTimeout(() => navigate("/admin/test-list"), 1000);
      } else {
        const err = await res.text();
        setMessage("Error: " + err);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Test</h2>
      {loading && <div className="mb-4 text-gray-600">Loading...</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Test Name</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={testname}
            onChange={e => setTestname(e.target.value)}
            required
          />
        </div>
        {questions.map((q, idx) => (
          <div key={idx} className="mb-6 border rounded p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Question {idx + 1}</span>
              <button
                type="button"
                onClick={() => removeQuestion(idx)}
                className="text-red-500 text-sm"
                disabled={questions.length === 1}
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Question text"
              value={q.question}
              onChange={e => handleQuestionChange(idx, "question", e.target.value)}
              required
            />
            <div className="mb-2">
              <label className="block font-medium mb-1">Options</label>
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  className="w-full border rounded px-3 py-2 mb-1"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={e => handleOptionChange(idx, optIdx, e.target.value)}
                  required
                />
              ))}
            </div>
            <div>
              <label className="block font-medium mb-1">Correct Answer</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="Answer (must match one option)"
                value={q.answer}
                onChange={e => handleQuestionChange(idx, "answer", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Explanation (Optional)</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                placeholder="Explain why this is the correct answer..."
                value={q.explanation || ""}
                onChange={e => handleQuestionChange(idx, "explanation", e.target.value)}
                rows="3"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          Add Question
        </button>
        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Test"}
          </button>
        </div>
        {message && (
          <div className="mt-4 text-center text-sm text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
};

export default EditTest;