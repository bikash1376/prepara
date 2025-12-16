import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, ChevronDown, Flag, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TestViewer = ({ test: propTest, onSubmit, isPreview = false, isSubmitting = false }) => {
  const { id } = useParams();
  const [test, setTest] = useState(propTest);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState(new Set());

  useEffect(() => {
    if (propTest) {
      setTest(propTest);
    } else if (id) {
      fetch(`http://localhost:5000/api/v1/test/${id}`)
        .then((res) => res.json())
        .then((data) => setTest(data));
    }
  }, [id, propTest]);

  if (!test) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* <span className="text-xl font-semibold">Loading test...</span> */}

<Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Handle both old format (test.questions) and new format (transformed questions)
  const questions = test.questions || [];
  const question = questions[currentQuestionIdx];

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      // Save current answer before moving
      if (selectedOption !== null) {
        setAnswers(prev => ({ ...prev, [currentQuestionIdx]: selectedOption }));
      }
      setCurrentQuestionIdx(currentQuestionIdx - 1);
      // Load previous answer
      setSelectedOption(answers[currentQuestionIdx - 1] || null);
    }
  };

  const handleNext = () => {
    // Save current answer before moving
    if (selectedOption !== null) {
      setAnswers(prev => ({ ...prev, [currentQuestionIdx]: selectedOption }));
    }
    
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      // Load next answer
      setSelectedOption(answers[currentQuestionIdx + 1] || null);
    }
  };

  const handleSubmit = () => {
    // Save current answer
    const finalAnswers = { ...answers };
    if (selectedOption !== null) {
      finalAnswers[currentQuestionIdx] = selectedOption;
    }
    
    if (onSubmit) {
      onSubmit(finalAnswers);
    }
  };

  // Load saved answer when question changes
  useEffect(() => {
    setSelectedOption(answers[currentQuestionIdx] || null);
  }, [currentQuestionIdx, answers]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border px-4 py-2 flex justify-between items-center bg-card">
        <div>
          <h1 className="text-lg font-semibold">{test.testname}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50 mt-1 focus:outline-none">
                Question {currentQuestionIdx + 1} of {questions.length}
                <ChevronDown className="ml-2 w-4 h-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[340px] p-4" align="start">
              <div className="flex items-center justify-between gap-2 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                  <span>Review</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-muted border border-foreground/10 rounded-full"></div>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="w-2.5 h-2.5 border-2 border-primary rounded-full"></div>
                   <span>Current</span>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, idx) => {
                  const hasAnswer = answers[idx] !== undefined && answers[idx] !== null;
                  const isMarked = markedQuestions.has(idx);
                  const isCurrent = currentQuestionIdx === idx;
                  
                  let bgClass = "bg-muted text-muted-foreground border border-transparent hover:bg-muted/80";
                  if (hasAnswer) {
                     bgClass = "bg-green-500 text-white hover:bg-green-600 border-transparent";
                  }
                  if (isMarked) {
                     bgClass = "bg-yellow-500 text-white hover:bg-yellow-600 border-transparent";
                  }

                  return (
                    <DropdownMenuItem
                      key={idx}
                      onSelect={(e) => {
                        e.preventDefault(); // Prevent closing if desired, or let it close
                        if (selectedOption !== null) {
                            setAnswers(prev => ({ ...prev, [currentQuestionIdx]: selectedOption }));
                        }
                        setCurrentQuestionIdx(idx);
                        setSelectedOption(answers[idx] === undefined ? null : answers[idx]);
                      }}
                      className={`
                        flex relative items-center justify-center h-10 w-full rounded-md font-semibold text-sm cursor-pointer transition-all
                        ${bgClass}
                        ${isCurrent ? "ring-2 ring-primary ring-offset-2 ring-offset-background z-10" : ""}
                        focus:outline-none confirm-selection
                      `}
                    >
                      {idx + 1}
                      {hasAnswer && isMarked && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-200 rounded-full" />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-3 py-1 rounded text-sm transition-colors">
            <Link to={isPreview ? "/admin/test-list" : "/test-list"}>Leave</Link>
        </button>
      </header>
      <main className="flex flex-1 flex-col md:flex-row">
        {/* Question Panel */}
        <div className="md:w-1/2 p-6 border-r border-border flex items-start justify-center bg-card text-card-foreground">
          <div>
            <p className="text-base mb-2">{question.question}</p>
            
            {/* Display question image if available */}
            {question.image && (
              <div className="mt-4">
                <img 
                  src={question.image} 
                  alt={`Question ${currentQuestionIdx + 1} image`}
                  className="max-w-full h-auto max-h-64 rounded border shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
        {/* Options Panel */}
        <div className="md:w-1/2 p-6 flex flex-col bg-card text-card-foreground">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
              Question {currentQuestionIdx + 1}
            </span>
            <button
                onClick={() => {
                  setMarkedQuestions(prev => {
                    const next = new Set(prev);
                    if (next.has(currentQuestionIdx)) {
                      next.delete(currentQuestionIdx);
                    } else {
                      next.add(currentQuestionIdx);
                    }
                    return next;
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  markedQuestions.has(currentQuestionIdx)
                    ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${markedQuestions.has(currentQuestionIdx) ? "fill-current" : ""}`} />
                {markedQuestions.has(currentQuestionIdx) ? "Marked for Review" : "Mark for Review"}
              </button>
          </div>
          
          <div className="mb-4">
            <span className="font-medium leading-relaxed">
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
                    ? "border-primary bg-primary/10 text-primary-foreground"
                    : "border-border hover:bg-muted"
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
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50 hover:bg-secondary/80 transition-colors"
            >
              Previous
            </button>
            {currentQuestionIdx === questions.length - 1 && isPreview ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={currentQuestionIdx === questions.length - 1}
                className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            )}
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