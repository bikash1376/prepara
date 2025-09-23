import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useAuth, useUser } from "@clerk/clerk-react";
import { ChevronDown, Loader2, MoreVertical, X, Flag, ArrowRight, ArrowUp } from "lucide-react";
import DirectionsDialog from "./DirectionsDialog";
import ExamNavbar from "./ExamNavbar";
import { IoIosArrowUp } from "react-icons/io";

const TestSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [test, setTest] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState({}); // {sectionIdx: {moduleIdx: [answers]}}
  const [reviewedQuestions, setReviewedQuestions] = useState({}); // {sectionIdx: {moduleIdx: Set of question indices}}
  const [struckOutOptions, setStruckOutOptions] = useState({}); // {sectionIdx: {moduleIdx: {questionIdx: Set of option indices}}}
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [inBreak, setInBreak] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDesmos, setShowDesmos] = useState(false);
  const [showScientific, setShowScientific] = useState(false);
  const desmosRef = useRef(null);
  const scientificRef = useRef(null);
  const desmosCalculator = useRef(null);
  const scientificCalculator = useRef(null);
  const [startTime] = useState(Date.now());
  const [showTimer, setShowTimer] = useState(true);
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const [isQuestionSwitchOpen, setIsQuestionSwitchOpen] = useState(false);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);

  // Load Desmos API
  useEffect(() => {
    if (window.Desmos) return;
    const script = document.createElement("script");
    const apiKey = "dcb31709b452b1cf9dc26972add0fda6";
    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${apiKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Desmos calculator init
  useEffect(() => {
    if (showDesmos) {
      const timer = setTimeout(() => {
        if (desmosRef.current && window.Desmos && !desmosCalculator.current) {
          desmosCalculator.current = window.Desmos.GraphingCalculator(
            desmosRef.current,
            {
              expressions: true,
              settingsMenu: true,
              zoomButtons: true,
              expressionsTopbar: true,
              pointsOfInterest: true,
              trace: true, 
              border: false,
              lockViewport: false,
              expressionsCollapsed: true,
            }
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (desmosCalculator.current) {
      desmosCalculator.current.destroy();
      desmosCalculator.current = null;
    }
  }, [showDesmos]);

  // Scientific calculator init
  useEffect(() => {
    if (showScientific) {
      const timer = setTimeout(() => {
        if (
          scientificRef.current &&
          window.Desmos &&
          !scientificCalculator.current
        ) {
          scientificCalculator.current = window.Desmos.ScientificCalculator(
            scientificRef.current,
            {
              expressions: false,
              settingsMenu: false,
              border: false,
            }
          );
        }
      }, 100);
      return () => clearTimeout(timer);
    } else if (scientificCalculator.current) {
      scientificCalculator.current.destroy();
      scientificCalculator.current = null;
    }
  }, [showScientific]);

  // Fetch test and set timer for first module
  useEffect(() => {
    checkTestAccess();
    // eslint-disable-next-line
  }, [id]);

  const checkTestAccess = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/test/${id}/access`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok && data.canTake) {
        fetchTest();
      } else {
        alert(data.message || "You cannot take this test");
        navigate("/test-list");
      }
    } catch {
      alert("Error checking test access");
      navigate("/test-list");
    }
  };

  const fetchTest = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:5000/api/v1/test/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setTest(data);
        setTimer(data.sections[0].modules[0].timer);
        setModuleAnswers({
          0: {
            0: new Array(data.sections[0].modules[0].questions.length).fill(""),
          },
        });
        setReviewedQuestions({
          0: {
            0: new Set(),
          },
        });
      } else {
        alert("Failed to load test");
        navigate("/test-list");
      }
    } catch {
      alert("Error loading test");
      navigate("/test-list");
    } finally {
      setLoading(false);
    }
  };

  // Timer for module or break
  useEffect(() => {
    if (loading || inBreak) return;
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, loading, inBreak]);

  useEffect(() => {
    if (!inBreak) return;
    if (breakTime <= 0) return;
    const t = setTimeout(() => setBreakTime(breakTime - 1), 1000);
    return () => clearTimeout(t);
  }, [breakTime, inBreak]);

  // After break, go to next module/section
  useEffect(() => {
    if (inBreak && breakTime === 0) {
      setInBreak(false);
      goToNextModuleOrSection();
    }
    // eslint-disable-next-line
  }, [breakTime, inBreak]);

  // Timer auto-submit
  useEffect(() => {
    if (!inBreak && timer === 0 && !loading) {
      handleModuleSubmit();
    }
    // eslint-disable-next-line
  }, [timer, inBreak, loading]);

  if (loading || !test) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const section = test.sections[currentSection];
  const module = section.modules[currentModule];
  const answersArr =
    (moduleAnswers[currentSection] &&
      moduleAnswers[currentSection][currentModule]) ||
    new Array(module.questions.length).fill("");

  // Handle answer change for current module
  const handleAnswerChange = (qIdx, value) => {
    setModuleAnswers((prev) => {
      const sec = { ...(prev[currentSection] || {}) };
      const mod = [
        ...(sec[currentModule] || new Array(module.questions.length).fill("")),
      ];
      mod[qIdx] = value;
      return { ...prev, [currentSection]: { ...sec, [currentModule]: mod } };
    });
  };

  // Toggle question for review
  const toggleQuestionForReview = (qIdx) => {
    setReviewedQuestions((prev) => {
      const sec = { ...(prev[currentSection] || {}) };
      const modSet = new Set(sec[currentModule] || []);
      
      if (modSet.has(qIdx)) {
        modSet.delete(qIdx);
      } else {
        modSet.add(qIdx);
      }
      
      return { ...prev, [currentSection]: { ...sec, [currentModule]: modSet } };
    });
  };

  // Toggle strike-through for option
  const toggleStrikeThrough = (questionIdx, optionIdx) => {
    setStruckOutOptions((prev) => {
      const sec = { ...(prev[currentSection] || {}) };
      const mod = { ...(sec[currentModule] || {}) };
      const questionSet = new Set(mod[questionIdx] || []);
      
      if (questionSet.has(optionIdx)) {
        questionSet.delete(optionIdx);
      } else {
        questionSet.add(optionIdx);
      }
      
      return { 
        ...prev, 
        [currentSection]: { 
          ...sec, 
          [currentModule]: { 
            ...mod, 
            [questionIdx]: questionSet 
          } 
        } 
      };
    });
  };

  // Get struck out options for current question
  const getStruckOutOptions = () => {
    return struckOutOptions[currentSection]?.[currentModule]?.[currentQuestion] || new Set();
  };

  // Get current module's reviewed questions set
  const getReviewedQuestions = () => {
    return (reviewedQuestions[currentSection] && 
            reviewedQuestions[currentSection][currentModule]) || new Set();
  };

  // Jump to specific question
  const jumpToQuestion = (qIdx) => {
    setCurrentQuestion(qIdx);
  };

  // Submit current module
  const handleModuleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      // If last module in section, check for break
      if (currentModule === section.modules.length - 1) {
        if (section.breakAfter && section.breakAfter.duration > 0) {
          setInBreak(true);
          setBreakTime(section.breakAfter.duration);
        } else {
          goToNextModuleOrSection();
        }
      } else {
        // Next module in section
        const nextModuleIdx = currentModule + 1;
        setCurrentModule(nextModuleIdx);
        setCurrentQuestion(0);
        setTimer(section.modules[nextModuleIdx].timer);
        setModuleAnswers((prev) => {
          const sec = { ...(prev[currentSection] || {}) };
          if (!sec[nextModuleIdx]) {
            sec[nextModuleIdx] = new Array(
              section.modules[nextModuleIdx].questions.length
            ).fill("");
          }
          return { ...prev, [currentSection]: sec };
        });
        setReviewedQuestions((prev) => {
          const sec = { ...(prev[currentSection] || {}) };
          if (!sec[nextModuleIdx]) {
            sec[nextModuleIdx] = new Set();
          }
          return { ...prev, [currentSection]: sec };
        });
      }
    }, 500);
  };

  const goToNextModuleOrSection = () => {
    if (currentModule === section.modules.length - 1) {
      // Next section
      if (currentSection === test.sections.length - 1) {
        // All done, submit test
        handleTestSubmit();
      } else {
        const nextSectionIdx = currentSection + 1;
        setCurrentSection(nextSectionIdx);
        setCurrentModule(0);
        setCurrentQuestion(0);
        setTimer(test.sections[nextSectionIdx].modules[0].timer);
        setModuleAnswers((prev) => {
          const sec = { ...(prev[nextSectionIdx] || {}) };
          if (!sec[0]) {
            sec[0] = new Array(
              test.sections[nextSectionIdx].modules[0].questions.length
            ).fill("");
          }
          return { ...prev, [nextSectionIdx]: sec };
        });
        setReviewedQuestions((prev) => {
          const sec = { ...(prev[nextSectionIdx] || {}) };
          if (!sec[0]) {
            sec[0] = new Set();
          }
          return { ...prev, [nextSectionIdx]: sec };
        });
      }
    } else {
      // Should not happen, handled in handleModuleSubmit
    }
  };

  // Final test submit
  const handleTestSubmit = async () => {
    setSubmitting(true);
    try {
      const token = await getToken();
      // Flatten all answers in order
      const allAnswers = [];
      for (let s = 0; s < test.sections.length; s++) {
        for (let m = 0; m < test.sections[s].modules.length; m++) {
          const modAns =
            (moduleAnswers[s] && moduleAnswers[s][m]) ||
            new Array(test.sections[s].modules[m].questions.length).fill("");
          allAnswers.push(...modAns);
        }
      }
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const response = await fetch(
        "http://localhost:5000/api/v1/submission/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            testId: id,
            answers: allAnswers,
            timeTaken: timeTaken,
          }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        navigate(`/test-results/${result.submissionId}`);
      } else {
        alert(result.message || "Failed to submit test");
      }
    } catch {
      alert("Error submitting test");
    } finally {
      setSubmitting(false);
    }
  };

  // Timer format
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (inBreak) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 max-w-md w-full mx-4 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Break Time</h2>
            <p className="text-gray-600 dark:text-gray-400">Take a moment to rest before continuing</p>
          </div>

          <div className="mb-8">
            <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">{Math.floor(breakTime / 60)}:{(breakTime % 60).toString().padStart(2, '0')}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Time remaining</p>
          </div>

          {breakTime > 0 ? (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  You can relax during this break. The next section will begin automatically when the timer reaches zero.
                </p>
              </div>
              <button
                onClick={() => {
                  setInBreak(false);
                  goToNextModuleOrSection();
                }}
                className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Skip Break & Continue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                  Break time is over. You may now continue to the next section.
                </p>
              </div>
              <button
                onClick={() => {
                  setInBreak(false);
                  goToNextModuleOrSection();
                }}
                className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium shadow-md"
              >
                Continue to Next Section →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const q = module.questions[currentQuestion];

  // LaTeX Renderer Component
  const LaTeXRenderer = ({ text }) => {
    if (!text) return null;
    
    try {
      // Split text by LaTeX delimiters and render accordingly
      const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/);
      
      return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
          {parts.map((part, index) => {
            if (part.startsWith('$$') && part.endsWith('$$')) {
              // Block math
              const latex = part.slice(2, -2);
              return <BlockMath key={index} math={latex} />;
            } else if (part.startsWith('$') && part.endsWith('$')) {
              // Inline math
              const latex = part.slice(1, -1);
              return <InlineMath key={index} math={latex} />;
            } else {
              // Regular text - preserve line breaks and spacing
              return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
            }
          })}
        </span>
      );
    } catch (error) {
      return <span className="text-red-500">LaTeX Error: {error.message}</span>;
    }
  };

  // Question Switch Dialog Component
  const QuestionSwitchDialog = ({ open, onOpenChange }) => {
    if (!open) return null;

    const handleQuestionSelect = (qIdx) => {
      jumpToQuestion(qIdx);
      onOpenChange(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => onOpenChange(false)}
        />
        
        {/* Dialog */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Select Question</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>For Review</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-300"></div>
              <span>Current</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-8 gap-3">
            {module.questions.map((_, qIdx) => {
              const isAnswered = answersArr[qIdx] !== "";
              const isForReview = getReviewedQuestions().has(qIdx);
              const isCurrent = qIdx === currentQuestion;
              
              let bgColor = "bg-gray-300 hover:bg-gray-400";
              if (isAnswered && isForReview) {
                bgColor = "bg-yellow-500 hover:bg-yellow-600";
              } else if (isAnswered) {
                bgColor = "bg-green-500 hover:bg-green-600";
              } else if (isForReview) {
                bgColor = "bg-yellow-400 hover:bg-yellow-500";
              }
              
              return (
                <button
                  key={qIdx}
                  onClick={() => handleQuestionSelect(qIdx)}
                  className={`w-12 h-12 rounded-lg text-white font-semibold transition-all ${bgColor} ${
                    isCurrent ? "ring-4 ring-blue-500 ring-offset-2" : ""
                  } hover:scale-105 shadow-md`}
                >
                  {qIdx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {module.questions.length} • {section.name} - {module.name}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Submit Confirmation Dialog Component
  const SubmitConfirmationDialog = ({ open, onOpenChange }) => {
    if (!open) return null;

    const isLastModule = currentModule === section.modules.length - 1 && currentSection === test.sections.length - 1;

    const handleConfirmSubmit = () => {
      onOpenChange(false);
      handleModuleSubmit();
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => onOpenChange(false)}
        />
        
        {/* Dialog */}
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                {isLastModule ? "Submit Test" : "Submit Module"}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {isLastModule 
                ? "You are about to submit your entire test. Once submitted, you will not be able to make any changes or return to review your answers."
                : "You are about to submit this module. Once submitted, you will not be able to return to this module or make any changes to your answers."
              }
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                ⚠️ This action cannot be undone
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 transition-colors font-medium"
            >
              {submitting ? "Submitting..." : (isLastModule ? "Submit Test" : "Submit Module")}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-blue-50 dark:bg-black shadow-sm">
        <ExamNavbar
          section={section}
          module={module}
          timer={timer}
          formatTime={formatTime}
          showTimer={showTimer}
          setShowTimer={setShowTimer}
          setIsDirectionsOpen={setIsDirectionsOpen}
          setShowDesmos={setShowDesmos}
          setShowScientific={setShowScientific}
          navigate={navigate}
          currentSection={currentSection}
        />
      </div>

      <DirectionsDialog
        open={isDirectionsOpen}
        onOpenChange={setIsDirectionsOpen}
      />

      <QuestionSwitchDialog
        open={isQuestionSwitchOpen}
        onOpenChange={setIsQuestionSwitchOpen}
      />

      <SubmitConfirmationDialog
        open={isSubmitConfirmOpen}
        onOpenChange={setIsSubmitConfirmOpen}
      />

      {/* Main Content Area with top and bottom padding for fixed elements */}
      <div className="pt-20 pb-20 px-6">
        {/* Question Navigation Panel */}
        <div className="flex justify-end items-center gap-4 mb-6">
          {/* <button
            onClick={() => setIsQuestionSwitchOpen(true)}
            className="px-4 py-2 rounded text-sm font-medium transition-colors bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-between"
          >
            Question {currentQuestion + 1} of {module.questions.length}
            <ChevronDown className="ml-2 w-5 h-5" />
          </button> */}
        </div>

        {/* Main Content Layout */}
        <div className="flex gap-6 mb-6">
          {/* Question Panel - Left Side */}
          <div className={`bg-white dark:bg-neutral-950 rounded-lg p-6 transition-all duration-300 ${
            showDesmos || showScientific ? "w-1/4" : "w-1/2"
          }`}>
            <div className="mb-4">
              {/* <span className="text-sm text-gray-500 dark:text-gray-400">
                Question {currentQuestion + 1} of {module.questions.length}
              </span> */}

              <h2 className="font-serif text-xl font-semibold text-gray-800 dark:text-gray-200 mt-2 whitespace-pre-wrap">
                <LaTeXRenderer text={q.question} />
              </h2>
              
              {q.image && (
                <div className="mt-4">
                  <img 
                    src={q.image} 
                    alt={`Question ${currentQuestion + 1} image`}
                    className="max-w-full h-auto max-h-96 rounded border shadow-sm object-contain"
                    onError={(e) => {
                      // Fallback to original URL if Cloudinary transformation fails
                      if (e.target.src !== q.image) {
                        e.target.src = q.image;
                      }
                    }}
                  />
                </div>
              )}

              {q.additionalText && (
                <div className="mt-4">
                  <p className="font-serif text-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    <LaTeXRenderer text={q.additionalText} />
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Options Panel - Right Side */}
          <div className={`bg-white dark:bg-neutral-950 rounded-lg p-6 transition-all duration-300 ${
            showDesmos || showScientific ? "w-1/4" : "w-1/2"
          }`}>
            {/* Question number and Mark for Review */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {currentQuestion + 1}
                </span>
                <button
                  onClick={() => toggleQuestionForReview(currentQuestion)}
                  className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition-colors ${
                    getReviewedQuestions().has(currentQuestion)
                      ? "bg-yellow-500 dark:bg-yellow-600 text-white hover:bg-yellow-600 dark:hover:bg-yellow-500"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  Mark for Review
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                Which choice completes the text with the most logical and precise word or phrase?
              </span>
            </div>

            <div className="space-y-3">
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-3">
                  <label
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors w-full ${
                      answersArr[currentQuestion] === option
                        ? "border-black border-2 dark:border-white bg-black-50 dark:bg-neutral-900"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                    } ${
                      getStruckOutOptions().has(optionIndex) 
                        ? 'relative after:content-[""] after:absolute after:top-1/2 after:left-0 after:right-0 after:h-0.5 after:bg-red-500 after:transform after:-translate-y-1/2 opacity-50' 
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      value={option}
                      checked={answersArr[currentQuestion] === option}
                      onChange={() => handleAnswerChange(currentQuestion, option)}
                      className="mr-3"
                    />

                    <span className="font-semibold mr-2 text-gray-700 dark:text-gray-300">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>

                    <span className="text-gray-700 dark:text-gray-300">
                      <LaTeXRenderer text={option} />
                    </span>
                  </label>
                  
                  <button
                    onClick={() => toggleStrikeThrough(currentQuestion, optionIndex)}
                    className={`p-2 rounded-full transition-colors ${
                      getStruckOutOptions().has(optionIndex)
                        ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    title={getStruckOutOptions().has(optionIndex) ? "Remove strike-through" : "Strike through option"}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {(showDesmos || showScientific) && (
            <div className="w-1/2 bg-white dark:bg-neutral-950 rounded-lg p-4">
              {showDesmos && (
                <div className="h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Desmos Calculator
                    </h3>
                    <button
                      onClick={() => setShowDesmos(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl"
                    >
                      ×
                    </button>
                  </div>

                  <div
                    ref={desmosRef}
                    className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded-lg"
                    style={{ minHeight: "384px" }}
                  ></div>
                </div>
              )}

              {showScientific && (
                <div className="h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      Scientific Calculator
                    </h3>
                    <button
                      onClick={() => setShowScientific(false)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-3xl"
                    >
                      ×
                    </button>
                  </div>

                  <div
                    ref={scientificRef}
                    className="w-full h-96 border border-gray-200 dark:border-gray-600 rounded-lg"
                    style={{ minHeight: "384px" }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-blue-50 dark:bg-black border-t-[.2px] border-black dark:border-gray-700 shadow-lg">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Left side - User name */}
          <div className="text-gray-700 dark:text-gray-300 font-medium">
            {user?.fullName || user?.firstName || 'Student'}
          </div>

          {/* Center - Question indicator (clickable) */}
          <button
            onClick={() => setIsQuestionSwitchOpen(true)}
            className="px-4 py-2 text-gray-100 dark:text-gray-300 font-medium hover:text-white dark:hover:text-white transition-colors cursor-pointer bg-black flex items-center"
          >
            Question {currentQuestion + 1} of {module.questions.length}
           
            <IoIosArrowUp className="w-4 h-4 ml-2" />
          </button>

          {/* Right side - Navigation buttons */}
          <div className="flex items-center gap-4">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
              >
                Back
              </button>
            )}

            {currentQuestion < module.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 font-medium"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => setIsSubmitConfirmOpen(true)}
                disabled={submitting}
                className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 font-medium"
              >
                {currentModule === section.modules.length - 1 &&
                currentSection === test.sections.length - 1
                  ? "Submit Test"
                  : "Submit Module"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSubmission;
