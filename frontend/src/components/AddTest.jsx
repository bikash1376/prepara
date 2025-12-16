import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, PlusCircle, Trash2, ChevronRight, Home } from "lucide-react";
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ImageUpload from "./ImageUpload";

// LaTeX Preview Component
const LaTeXPreview = ({ text }) => {
  if (!text) return null;

  try {
    // Split text by LaTeX delimiters and render accordingly
    const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

    return (
      <div className="latex-preview p-2 bg-gray-50 rounded border mt-1">
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
            // Regular text
            if (part) { // Don't render empty strings which can result from split
              return <span key={index}>{part}</span>;
            }
            return null;
          }
          _
        })}
      </div>
    );
  } catch (error) {
    return <div className="text-red-500 text-sm mt-1">LaTeX Error: Invalid syntax</div>;
  }
};

// State initialization and deep copy helpers
const emptyQuestion = { question: "", image: null, additionalText: "", options: ["", "", "", ""], answer: "", explanation: "" };
const emptyModule = { moduleName: "", timer: 600, questions: [{ ...emptyQuestion }] };
const emptySection = { sectionName: "", modules: [{ ...emptyModule }], breakAfter: { duration: 0 } };

const deepCopyQuestion = (q = emptyQuestion) => ({ question: q.question || "", image: q.image || null, additionalText: q.additionalText || "", options: [...(q.options || ["", "", "", ""])], answer: q.answer || "", explanation: q.explanation || "" });
const deepCopyModule = (m = emptyModule) => ({ moduleName: m.moduleName || "", timer: m.timer || 600, questions: (m.questions || [deepCopyQuestion()]).map(deepCopyQuestion) });
const deepCopySection = (s = emptySection) => ({ sectionName: s.sectionName || "", modules: (s.modules || [deepCopyModule()]).map(deepCopyModule), breakAfter: { duration: s.breakAfter?.duration || 0 } });


const AddTest = () => {
  const { getToken } = useAuth();
  const [testname, setTestname] = useState("");
  const [sections, setSections] = useState([deepCopySection()]);
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
      if (!token) throw new Error('No authentication token found');

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/test/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ testname, sections })
      });

      const responseData = await res.json();

      if (res.ok) {
        setMessage("Test created successfully!");
        setTimeout(() => navigate("/admin/test-list"), 1000);
      } else {
        setMessage(`Error: ${responseData.message || res.statusText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message || 'Failed to submit test'}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to='/admin/dashboard'><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink asChild><Link to='/admin/test-list'>Manage Tests</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage>Create New Test</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Create a New Test</h1>
          <Button type="submit" disabled={loading} className="fixed bottom-4 right-30">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Saving..." : "Save Test"}
          </Button>
        </div>
        <Separator className="my-6" />

        {message && (
          <Alert variant={message.startsWith("Error") ? "destructive" : "default"} className="mb-6">
            <AlertTitle>{message.startsWith("Error") ? "An Error Occurred" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Provide a name for the overall test.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="testname" className="mb-2">Test Name</Label>
              <Input id="testname" value={testname} onChange={e => setTestname(e.target.value)} placeholder="e.g., Final Aptitude Exam" required />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Structure</CardTitle>
              <CardDescription>Build the test by adding sections, modules, and questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full space-y-4">
                {sections.map((section, sIdx) => (
                  <AccordionItem key={sIdx} value={`section-${sIdx}`} className="border rounded-md px-4 bg-background">
                    <div className="flex items-center justify-between">
                      <AccordionTrigger className="flex-1 text-lg font-semibold">
                        {section.sectionName || `Section ${sIdx + 1}`}
                      </AccordionTrigger>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeSection(sIdx)} disabled={sections.length === 1}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <AccordionContent className="pt-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`sectionName-${sIdx}`} className="mb-2">Section Name</Label>
                          <Input id={`sectionName-${sIdx}`} value={section.sectionName} onChange={e => handleSectionChange(sIdx, "sectionName", e.target.value)} required />
                        </div>
                        <div>
                          <Label htmlFor={`break-${sIdx}`} className="mb-2">Break After Section (seconds)</Label>
                          <Input id={`break-${sIdx}`} type="number" value={600} disabled onChange={e => handleBreakChange(sIdx, Number(e.target.value))} min={0} />
                        </div>
                      </div>

                      <Accordion type="multiple" className="w-full space-y-3">
                        {section.modules.map((module, mIdx) => (
                          <AccordionItem key={mIdx} value={`module-${sIdx}-${mIdx}`} className="border rounded-md px-4 bg-muted/50">
                            <div className="flex items-center justify-between">
                              _                       <AccordionTrigger className="flex-1 font-medium">
                                {module.moduleName || `Module ${mIdx + 1}`}
                              </AccordionTrigger>
                              _                             <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(sIdx, mIdx)} disabled={section.modules.length === 1}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            <AccordionContent className="pt-4 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`moduleName-${sIdx}-${mIdx}`} className="mb-2">Module Name</Label>
                                  <Input id={`moduleName-${sIdx}-${mIdx}`} value={module.moduleName} onChange={e => handleModuleChange(sIdx, mIdx, "moduleName", e.target.value)} required />
                                </div>
                                <div>
                                  <Label htmlFor={`timer-${sIdx}-${mIdx}`} className="mb-2">Timer (seconds)</Label>
                                  <Input id={`timer-${sIdx}-${mIdx}`} type="number" 
                                  // value={module.timer} 
                                  value={2100} disabled
                                  onChange={e => handleModuleChange(sIdx, mIdx, "timer", Number(e.target.value))} min={60} required />
                                </div>
                              </div>

                              <div className="space-y-4">
                                {module.questions.map((q, qIdx) => (
                                  <Card key={qIdx} className="bg-background">
                                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                                      <CardTitle className="text-base">Question {qIdx + 1}</CardTitle>
                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeQuestion(sIdx, mIdx, qIdx)} disabled={module.questions.length === 1}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-4 pb-4">
                                      <div>
                                        <Label htmlFor={`qtext-${sIdx}-${mIdx}-${qIdx}`} className="mb-2">Question Text</Label>
                                        <Textarea
                                          id={`qtext-${sIdx}-${mIdx}-${qIdx}`}
                                          value={q.question}
                                          onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "question", e.target.value)}
                                          placeholder="Enter question text. Use $...$ for inline math or $$...$$ for block math"
                                          required
                                        />
                                        {q.question && (
                                          <div className="mt-2 bg-black">
                                            <Label className="text-sm text-gray-600">Preview:</Label>
                                            <LaTeXPreview className="dark:text-white bg-black" text={q.question} />
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <Label className="mb-2">Image (Optional)</Label>
                                        <ImageUpload onImageChange={(url) => handleQuestionChange(sIdx, mIdx, qIdx, "image", url)} currentImage={q.image} />
                                      </div>
                                      <div>
                                        <Label htmlFor={`additionalText-${sIdx}-${mIdx}-${qIdx}`} className="mb-2">Additional Text (Optional)</Label>
                                        <Textarea
                                          id={`additionalText-${sIdx}-${mIdx}-${qIdx}`}
                                          value={q.additionalText}
                                          onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "additionalText", e.target.value)}
                                          placeholder="Enter additional text after image. Use $...$ for inline math or $$...$$ for block math"
                                        />
                                        {q.additionalText && (
                                          <div className="mt-2 bg-black">
                                            <Label className="text-sm text-gray-600">Preview:</Label>
                                            <LaTeXPreview className="dark:text-white bg-black" text={q.additionalText} />
                                          </div>
                                        )}
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt, optIdx) => (
                                          <div key={optIdx}>
                                            <Label htmlFor={`opt-${sIdx}-${mIdx}-${qIdx}-${optIdx}`} className="mb-2" >Option {optIdx + 1}</Label>
                                            <Input
                                              id={`opt-${sIdx}-${mIdx}-${qIdx}-${optIdx}`}
                                              value={opt}
                                              onChange={e => handleOptionChange(sIdx, mIdx, qIdx, optIdx, e.target.value)}
                                              placeholder="Use $...$ for inline math"
                                              required
                                            />
                                            {/* {opt && (
                                              <div className="mt-1">
                                                <LaTeXPreview text={opt} />
                                              </div>
                                            )} */}
                                          </div>
                                        ))}
                                      </div>
                                      <div>
                                        <Label htmlFor={`answer-${sIdx}-${mIdx}-${qIdx}`} className="mb-2">Correct Answer</Label>
                                        <select
                                          id={`answer-${sIdx}-${mIdx}-${qIdx}`}
                                          value={q.answer}
                                          onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "answer", e.target.value)}
                                          className="w-full p-2 border border-gray-300 rounded-md"
                                          required
                                        >
                                          <option value="">Select correct answer</option>
                                          {q.options.filter(opt => opt.trim()).map((opt, idx) => (
                                            <option key={idx} value={opt}>
                                              {`Option ${idx + 1}: ${opt.substring(0, 50)}${opt.length > 50 ? '...' : ''}`}
                                            </option>
                                          ))}
                                        </select>
                                      {q.explanation && (
                                        <div className="mt-2">
                                          <Label className="text-sm text-gray-600">Preview:</Label>
                                          <LaTeXPreview text={q.explanation} />
                                        </div>
                                      )}
                                    </div>
                                      <div>
                                        <Label htmlFor={`explanation-${sIdx}-${mIdx}-${qIdx}`} className="mb-2">Explanation (Optional)</Label>
                                        <Textarea
                                          id={`explanation-${sIdx}-${mIdx}-${qIdx}`}
                                          value={q.explanation}
                                          onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "explanation", e.target.value)}
                                          placeholder="Enter explanation. Use $...$ for inline math or $$...$$ for block math"
                                        />
                                        {q.explanation && (
                                          <div className="mt-2">
                                            <Label className="text-sm text-gray-600">Preview:</Label>
                                            <LaTeXPreview text={q.explanation} />
                                          </div>
                                        )}
                                      </div>
                                  </CardContent>
                                                            </Card>
                                                        ))}
                              </div>
                              <Button type="button" variant="outline" size="sm" onClick={() => addQuestion(sIdx, mIdx)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Question
                              </Button>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                      <Button type="button" variant="outline" size="sm" onClick={() => addModule(sIdx)} className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Module
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Button type="button" variant="secondary" className="mt-6" onClick={addSection}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default AddTest;
