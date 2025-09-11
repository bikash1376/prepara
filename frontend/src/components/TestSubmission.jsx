import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Cross1Icon,
  DesktopIcon,
  BookmarkIcon,
  QuestionMarkCircledIcon
} from "@radix-ui/react-icons";

const TestSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [test, setTest] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentModule, setCurrentModule] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState({});
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

  // Load Desmos API script
  useEffect(() => {
    if (window.Desmos) return;
    const script = document.createElement("script");
    const apiKey = "dcb31709b452b1cf9dc26972add0fda6";
    script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${apiKey}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Initialize Desmos and Scientific Calculators
  useEffect(() => {
    const initCalculator = (show, ref, type, calcRef) => {
      if (show) {
        const timerId = setTimeout(() => {
          if (ref.current && window.Desmos && !calcRef.current) {
            calcRef.current = new window.Desmos[type](ref.current, {
              expressions: type === "GraphingCalculator",
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
        return () => clearTimeout(timerId);
      } else if (calcRef.current) {
        calcRef.current.destroy();
        calcRef.current = null;
      }
    };

    initCalculator(showDesmos, desmosRef, "GraphingCalculator", desmosCalculator);
    initCalculator(showScientific, scientificRef, "ScientificCalculator", scientificCalculator);
  }, [showDesmos, showScientific]);

  // Fetch test details
  useEffect(() => {
    checkTestAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auth check and test fetch logic (kept as is)
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

  // Timer logic for module and break (kept as is)
  useEffect(() => {
    if (loading || inBreak || timer <= 0) return;
    const t = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, loading, inBreak]);

  useEffect(() => {
    if (!inBreak || breakTime <= 0) return;
    const t = setTimeout(() => setBreakTime(breakTime - 1), 1000);
    return () => clearTimeout(t);
  }, [breakTime, inBreak]);

  useEffect(() => {
    if (inBreak && breakTime === 0) {
      setInBreak(false);
      goToNextModuleOrSection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakTime, inBreak]);

  useEffect(() => {
    if (!inBreak && timer === 0 && !loading) {
      handleModuleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, inBreak, loading]);

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

  const handleModuleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (currentModule === section.modules.length - 1) {
        if (section.breakAfter?.duration > 0) {
          setInBreak(true);
          setBreakTime(section.breakAfter.duration);
        } else {
          goToNextModuleOrSection();
        }
      } else {
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
      }
    }, 500);
  };

  const goToNextModuleOrSection = () => {
    if (currentModule === section.modules.length - 1) {
      if (currentSection === test.sections.length - 1) {
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
      }
    }
  };

  const handleTestSubmit = async () => {
    setSubmitting(true);
    try {
      const token = await getToken();
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Main render logic
  if (loading || !test) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (inBreak) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Break Time</h2>
        <div className="text-4xl mb-6">{breakTime}s</div>
        {breakTime > 0 ? (
          <div className="text-gray-600">Relax! You can continue once the break ends.</div>
        ) : (
          <Button onClick={() => goToNextModuleOrSection()}>
            Continue to Next Module →
          </Button>
        )}
      </div>
    );
  }

  const section = test.sections[currentSection];
  const module = section.modules[currentModule];
  const q = module.questions[currentQuestion];
  const answersArr = moduleAnswers[currentSection]?.[currentModule] || new Array(module.questions.length).fill("");

  const questionNumber = currentQuestion + 1;
  const totalQuestions = module.questions.length;
  const questionLabel = `Question ${questionNumber} of ${totalQuestions}`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Header */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900" onClick={() => navigate("/test-list")}>Leave</Button>
          <div className="font-semibold text-gray-800">
            Section {currentSection + 1}, Module {currentModule + 1}: {section.sectionName}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`text-xl font-bold ${timer < 60 ? "text-red-600" : "text-black"}`}>
            {formatTime(timer)}
          </div>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100"><BookmarkIcon /></Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100"><QuestionMarkCircledIcon /></Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-100"><DesktopIcon /></Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 p-6 gap-6">
        {/* Question Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <span className="text-lg font-semibold text-gray-800">
              {section.sectionName}, {module.moduleName}
            </span>
          </div>

          <div className="mb-4 text-gray-700 leading-relaxed">
            <p>{q.question}</p>
          </div>

          {/* This is where you would render the passage if it exists */}
          {q.passage && (
            <div className="mb-4 p-4 border rounded bg-gray-50 text-gray-600">
              <p>{q.passage}</p>
            </div>
          )}

          <RadioGroup 
            onValueChange={(value) => handleAnswerChange(currentQuestion, value)} 
            value={answersArr[currentQuestion]} 
          >
            {q.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={`option-${index}`} className="shrink-0" />
                <Label htmlFor={`option-${index}`} className="flex-1 font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Right Side Tools Panel */}
        <div className="w-1/3 min-w-[300px] flex flex-col space-y-4">
          <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-auto">
            <h3 className="text-lg font-bold mb-4">Tools</h3>
            {/* Desmos Dialog */}
            <Dialog onOpenChange={setShowDesmos} open={showDesmos}>
              <DialogTrigger asChild>
                <Button className="w-full mb-2" variant="outline" onClick={() => setShowScientific(false)}>
                  Graphing Calculator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Graphing Calculator</DialogTitle>
                </DialogHeader>
                <div ref={desmosRef} className="w-full h-[400px]"></div>
              </DialogContent>
            </Dialog>

            {/* Scientific Calculator Dialog */}
            <Dialog onOpenChange={setShowScientific} open={showScientific}>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline" onClick={() => setShowDesmos(false)}>
                  Scientific Calculator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xs">
                <DialogHeader>
                  <DialogTitle>Scientific Calculator</DialogTitle>
                </DialogHeader>
                <div ref={scientificRef} className="w-full h-[400px]"></div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center sticky bottom-0">
        <div className="flex items-center space-x-4">
          <div className="font-semibold text-gray-800">
            {questionLabel}
          </div>
        </div>
        <div className="flex space-x-4">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Previous
            </Button>
          )}
          {currentQuestion < module.questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleModuleSubmit}
              disabled={submitting}
            >
              {currentModule === section.modules.length - 1 && currentSection === test.sections.length - 1
                ? "Submit Test"
                : "Submit Module"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSubmission;