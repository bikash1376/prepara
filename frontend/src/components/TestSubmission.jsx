import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const TestSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [test, setTest] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState({}); // {sectionIdx: {moduleIdx: [answers]}}
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

  // Load Desmos API
  useEffect(() => {
    if (window.Desmos) return;
    const script = document.createElement('script');
    const apiKey = 'dcb31709b452b1cf9dc26972add0fda6';
    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${apiKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Desmos calculator init
  useEffect(() => {
    if (showDesmos) {
      const timer = setTimeout(() => {
        if (desmosRef.current && window.Desmos && !desmosCalculator.current) {
          desmosCalculator.current = window.Desmos.GraphingCalculator(desmosRef.current, {
            expressions: true,
            settingsMenu: true,
            zoomButtons: true,
            expressionsTopbar: false,
            pointsOfInterest: false,
            trace: false,
            border: false,
            lockViewport: false,
            expressionsCollapsed: true,
          });
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
        if (scientificRef.current && window.Desmos && !scientificCalculator.current) {
          scientificCalculator.current = window.Desmos.ScientificCalculator(scientificRef.current, {
            expressions: false,
            settingsMenu: false,
            border: false
          });
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
      const response = await fetch(`http://localhost:5000/api/v1/test/${id}/access`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        setModuleAnswers({ 0: { 0: new Array(data.sections[0].modules[0].questions.length).fill("") } });
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  const section = test.sections[currentSection];
  const module = section.modules[currentModule];
  const answersArr = (moduleAnswers[currentSection] && moduleAnswers[currentSection][currentModule]) || new Array(module.questions.length).fill("");

  // Handle answer change for current module
 const handleAnswerChange = (qIdx, value) => {
  setModuleAnswers(prev => {
    const sec = { ...(prev[currentSection] || {}) };
    const mod = [...(sec[currentModule] || new Array(module.questions.length).fill(""))];
    mod[qIdx] = value;
    return { ...prev, [currentSection]: { ...sec, [currentModule]: mod } };
  });
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
        setModuleAnswers(prev => {
          const sec = { ...(prev[currentSection] || {}) };
          if (!sec[nextModuleIdx]) {
            sec[nextModuleIdx] = new Array(section.modules[nextModuleIdx].questions.length).fill("");
          }
          return { ...prev, [currentSection]: sec };
        });
      }
    }, 500);
  };

  // Go to next section or finish
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
        setModuleAnswers(prev => {
          const sec = { ...(prev[nextSectionIdx] || {}) };
          if (!sec[0]) {
            sec[0] = new Array(test.sections[nextSectionIdx].modules[0].questions.length).fill("");
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
          const modAns = (moduleAnswers[s] && moduleAnswers[s][m]) || new Array(test.sections[s].modules[m].questions.length).fill("");
          allAnswers.push(...modAns);
        }
      }
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      const response = await fetch("http://localhost:5000/api/v1/submission/submit", {
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
      });
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
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Break Time</h2>
      <div className="text-4xl mb-6">{breakTime}s</div>

      {breakTime > 0 ? (
        <div className="text-gray-600">Relax! You can continue once the break ends.</div>
      ) : (
        <button
          onClick={() => {
            setInBreak(false);
            goToNextModuleOrSection();
          }}
          className="px-8 py-3 bg-black text-white rounded hover:bg-gray-800"
        >
          Continue to Next Module →
        </button>
      )}
    </div>
  );
}


  const q = module.questions[currentQuestion];

  return (
    <div className="max-w-6xl mx-auto mt-6 p-6">
      {/* Calculator Buttons */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setShowDesmos(!showDesmos);
              setShowScientific(false);
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showDesmos
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📊 Desmos Calculator
          </button>
          <button
            onClick={() => {
              setShowScientific(!showScientific);
              setShowDesmos(false);
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showScientific
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🧮 Scientific Calculator
          </button>
          <button className="px-6 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => navigate("/test-list")}>Leave</button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{test.testname}</h1>
          <div className={`text-lg font-bold ${timer < 60 ? 'text-red-600' : 'text-black'}`}>
            ⏱️ {formatTime(timer)}
          </div>
        </div>
        <div className="mb-2 font-semibold">Section: {section.sectionName}</div>
        <div className="mb-2 font-semibold">Module: {module.moduleName}</div>
      </div>

      {/* Question and Calculator Layout */}
      <div className="flex gap-6 mb-6">
        {/* Current Question */}
        <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
          showDesmos || showScientific ? "w-1/2" : "w-full"
        }`}>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Question {currentQuestion + 1} of {module.questions.length}</span>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">
              {q.question}
            </h2>
          </div>

          <div className="space-y-3">
            {q.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  answersArr[currentQuestion] === option
                    ? "border-black bg-black-50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Calculator Area */}
        {(showDesmos || showScientific) && (
          <div className="w-1/2 bg-white rounded-lg shadow-md p-4">
            {showDesmos && (
              <div className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Desmos Calculator</h3>
                  <button
                    onClick={() => setShowDesmos(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                <div
                  ref={desmosRef}
                  className="w-full h-96 border border-gray-200 rounded-lg"
                  style={{ minHeight: '384px' }}
                ></div>
              </div>
            )}
            {showScientific && (
              <div className="h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Scientific Calculator</h3>
                  <button
                    onClick={() => setShowScientific(false)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
                <div
                  ref={scientificRef}
                  className="w-full h-96 border border-gray-200 rounded-lg"
                  style={{ minHeight: '384px' }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>

 {/* Navigation Buttons */}
<div className="bg-white rounded-lg shadow-md p-6">
  <div className="flex justify-between items-center">
    {/* Previous */}
    {currentQuestion > 0 && (
      <button
        onClick={() => setCurrentQuestion(currentQuestion - 1)}
        className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        ← Previous
      </button>
    )}

    {/* Spacer if no previous */}
    {currentQuestion === 0 && <div></div>}

    {/* Next / Submit */}
    {currentQuestion < module.questions.length - 1 ? (
      <button
        onClick={() => setCurrentQuestion(currentQuestion + 1)}
        disabled={answersArr[currentQuestion] === ""}
        className="px-6 py-2 bg-black text-white rounded hover:bg-black disabled:opacity-50"
      >
        Next →
      </button>
    ) : (
      <button
        onClick={handleModuleSubmit}
        disabled={submitting || answersArr[currentQuestion] === ""}
        className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
        {currentModule === section.modules.length - 1 && currentSection === test.sections.length - 1
          ? "Submit Test"
          : "Submit Module"}
      </button>
    )}
  </div>
</div>

    </div>
  );
};

export default TestSubmission;
