import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";

const emptyQuestion = { question: "", options: ["", "", "", ""], answer: "", explanation: "" };
const emptyModule = { moduleName: "", timer: 600, questions: [ { ...emptyQuestion } ] };
const emptySection = { sectionName: "", modules: [ { ...emptyModule } ], breakAfter: { duration: 0 } };

// Deep copy helpers
const deepCopyQuestion = (q = emptyQuestion) => ({
  question: q.question || "",
  options: [...(q.options || ["", "", "", ""])],
  answer: q.answer || "",
  explanation: q.explanation || ""
});
const deepCopyModule = (m = emptyModule) => ({
  moduleName: m.moduleName || "",
  timer: m.timer || 600,
  questions: (m.questions || [deepCopyQuestion()]).map(deepCopyQuestion)
});
const deepCopySection = (s = emptySection) => ({
  sectionName: s.sectionName || "",
  modules: (s.modules || [deepCopyModule()]).map(deepCopyModule),
  breakAfter: { duration: s.breakAfter?.duration || 0 }
});

const AddTest = () => {
  const { getToken } = useAuth();
  const [testname, setTestname] = useState("");
  const [sections, setSections] = useState([ { ...emptySection } ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Section handlers
  const addSection = () => setSections([...sections, deepCopySection()]);
  const removeSection = idx => setSections(sections.filter((_, i) => i !== idx));
  const handleSectionChange = (idx, field, value) => {
    const updated = sections.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setSections(updated);
  };

  // Module handlers
  const addModule = (sectionIdx) => {
    const updated = sections.map((s, i) =>
      i === sectionIdx ? { ...s, modules: [...s.modules, deepCopyModule()] } : s
    );
    setSections(updated);
  };
  const removeModule = (sectionIdx, moduleIdx) => {
    const updated = sections.map((s, i) =>
      i === sectionIdx ? { ...s, modules: s.modules.filter((_, mi) => mi !== moduleIdx) } : s
    );
    setSections(updated);
  };
  const handleModuleChange = (sectionIdx, moduleIdx, field, value) => {
    const updated = sections.map((s, i) => {
      if (i !== sectionIdx) return s;
      return {
        ...s,
        modules: s.modules.map((m, mi) => mi === moduleIdx ? { ...m, [field]: value } : m)
      };
    });
    setSections(updated);
  };

  // Question handlers
  const addQuestion = (sectionIdx, moduleIdx) => {
    const updated = sections.map((s, i) => {
      if (i !== sectionIdx) return s;
      return {
        ...s,
        modules: s.modules.map((m, mi) =>
          mi === moduleIdx ? { ...m, questions: [...m.questions, deepCopyQuestion()] } : m
        )
      };
    });
    setSections(updated);
  };
  const removeQuestion = (sectionIdx, moduleIdx, qIdx) => {
    const updated = sections.map((s, i) => {
      if (i !== sectionIdx) return s;
      return {
        ...s,
        modules: s.modules.map((m, mi) =>
          mi === moduleIdx ? { ...m, questions: m.questions.filter((_, qi) => qi !== qIdx) } : m
        )
      };
    });
    setSections(updated);
  };
  const handleQuestionChange = (sectionIdx, moduleIdx, qIdx, field, value) => {
    const updated = sections.map((s, i) => {
      if (i !== sectionIdx) return s;
      return {
        ...s,
        modules: s.modules.map((m, mi) => {
          if (mi !== moduleIdx) return m;
          return {
            ...m,
            questions: m.questions.map((q, qi) =>
              qi === qIdx ? { ...q, [field]: value } : q
            )
          };
        })
      };
    });
    setSections(updated);
  };
  const handleOptionChange = (sectionIdx, moduleIdx, qIdx, optIdx, value) => {
    const updated = sections.map((s, i) => {
      if (i !== sectionIdx) return s;
      return {
        ...s,
        modules: s.modules.map((m, mi) => {
          if (mi !== moduleIdx) return m;
          return {
            ...m,
            questions: m.questions.map((q, qi) => {
              if (qi !== qIdx) return q;
              const newOptions = [...q.options];
              newOptions[optIdx] = value;
              return { ...q, options: newOptions };
            })
          };
        })
      };
    });
    setSections(updated);
  };

  // Break handler
  const handleBreakChange = (sectionIdx, value) => {
    const updated = [...sections];
    updated[sectionIdx].breakAfter.duration = value;
    setSections(updated);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/v1/test/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testname, sections })
      });
      if (res.ok) {
        setMessage("Test created successfully!");
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
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Test (Sections, Modules, Breaks)</h2>
      {loading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
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
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-6 border rounded p-4 bg-gray-500">
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Section {sIdx + 1}</span>
              <button type="button" onClick={() => removeSection(sIdx)} className="text-red-500 text-sm" disabled={sections.length === 1}>Remove Section</button>
            </div>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Section name"
              value={section.sectionName}
              onChange={e => handleSectionChange(sIdx, "sectionName", e.target.value)}
              required
            />
            {section.modules.map((module, mIdx) => (
              <div key={mIdx} className="mb-10 border rounded p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-2xl">Module {mIdx + 1}</span>
                  <button type="button" onClick={() => removeModule(sIdx, mIdx)} className="text-red-500 text-xs" disabled={section.modules.length === 1}>Remove Module</button>
                </div>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="Module name"
                  value={module.moduleName}
                  onChange={e => handleModuleChange(sIdx, mIdx, "moduleName", e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2 mb-2"
                  placeholder="Timer (seconds)"
                  value={module.timer}
                  onChange={e => handleModuleChange(sIdx, mIdx, "timer", Number(e.target.value))}
                  required
                  min={60}
                />
                {module.questions.map((q, qIdx) => (
                  <div key={qIdx} className="mb-4 border rounded p-2 bg-purple-300">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Question {qIdx + 1}</span>
                      <button type="button" onClick={() => removeQuestion(sIdx, mIdx, qIdx)} className="text-red-500 text-xs" disabled={module.questions.length === 1}>Remove</button>
                    </div>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2 mb-1"
                      placeholder="Question text"
                      value={q.question}
                      onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "question", e.target.value)}
                      required
                    />
                    <div className="mb-1">
                      <label className="block font-medium mb-1">Options</label>
                      {q.options.map((opt, optIdx) => (
                        <input
                          key={optIdx}
                          type="text"
                          className="w-full border rounded px-3 py-2 mb-1"
                          placeholder={`Option ${optIdx + 1}`}
                          value={opt}
                          onChange={e => handleOptionChange(sIdx, mIdx, qIdx, optIdx, e.target.value)}
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
                        onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "answer", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1">Explanation (Optional)</label>
                      <textarea
                        className="w-full border rounded px-3 py-2"
                        placeholder="Explain why this is the correct answer..."
                        value={q.explanation || ""}
                        onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "explanation", e.target.value)}
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addQuestion(sIdx, mIdx)} className="mb-2 px-3 py-1 bg-green-500 text-white rounded">Add Question</button>
              </div>
            ))}
            <button type="button" onClick={() => addModule(sIdx)} className="mb-2 px-3 py-1 bg-blue-500 text-white rounded">Add Module</button>
            <div className="mb-2">
              <label className="block font-medium mb-1">Break After Section (seconds, 0 = no break)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={section.breakAfter.duration}
                onChange={e => handleBreakChange(sIdx, Number(e.target.value))}
                min={0}
              />
            </div>
          </div>
        ))}
        <button type="button" onClick={addSection} className="mb-4 px-4 py-2 bg-purple-500 text-white rounded">Add Section</button>
        <div>
          <button type="submit" className="px-6 py-2 bg-black text-white rounded" disabled={loading}>
            {loading ? "Creating..." : "Create Test"}
          </button>
        </div>
        {message && (
          <div className="mt-4 text-center text-sm text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
};

export default AddTest;