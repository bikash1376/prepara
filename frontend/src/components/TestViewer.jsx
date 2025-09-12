import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TestViewer = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/test/${id}`)
      .then((res) => res.json())
      .then((data) => setTest(data));
  }, [id]);

  if (!test) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* <span className="text-xl font-semibold">Loading test...</span> */}

<Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const questions = test.questions;
  const question = questions[currentQuestionIdx];

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      setSelectedOption(null);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="border-b px-4 py-2 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">{test.testname}</h1>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIdx + 1} of {questions.length}
          </span>
        </div>
        <button className="bg-zinc-600 text-white px-3 py-1 rounded text-sm">
            <Link to="/test-list">Leave</Link>
        </button>
      </header>
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Question Panel */}
        <div className="md:w-1/2 p-6 border-r flex items-start justify-center bg-zinc-900 text-white">
          <div>
            <p className="text-base mb-2">{question.question}</p>
          </div>
        </div>
        {/* Options Panel */}
        <div className="md:w-1/2 p-6 flex flex-col bg-zinc-900 text-white">
          <div className="mb-4">
            <span className="font-medium">
              Which choice completes the text with the most logical and precise word
              or phrase?
            </span>
          </div>
          <div className="space-y-3 mb-6">
            {question.options.map((opt, idx) => (
              <label
                key={idx}
                className={`block border rounded px-4 py-2 cursor-pointer transition ${
                  selectedOption === idx
                    ? "border-black bg-black-50"
                    : "hover:bg-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  className="mr-2"
                  checked={selectedOption === idx}
                  onChange={() => setSelectedOption(idx)}
                />
                <span className="font-semibold mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </label>
            ))}
          </div>
          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIdx === questions.length - 1}
              className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </main>
      {/* <footer className="px-4 py-2 border-t text-right text-sm text-gray-600"> */}
      {/* Mohamed Elkirs */}
      {/* </footer> */}
    </div>
  );
};

export default TestViewer;