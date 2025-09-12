import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, PlusCircle, Trash2, ChevronRight, Home } from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Custom Components
import ImageUpload from "./ImageUpload";

// Your existing state initialization and deep copy helpers remain unchanged
const emptyQuestion = { question: "", options: ["", "", "", ""], answer: "", explanation: "", image: null };
const emptyModule = { moduleName: "", timer: 600, questions: [ { ...emptyQuestion } ] };
const emptySection = { sectionName: "", modules: [ { ...emptyModule } ], breakAfter: { duration: 0 } };

const deepCopyQuestion = (q = emptyQuestion) => ({ question: q.question || "", options: [...(q.options || ["", "", "", ""])], answer: q.answer || "", explanation: q.explanation || "", image: q.image || null });
const deepCopyModule = (m = emptyModule) => ({ moduleName: m.moduleName || "", timer: m.timer || 600, questions: (m.questions || [deepCopyQuestion()]).map(deepCopyQuestion) });
const deepCopySection = (s = emptySection) => ({ sectionName: s.sectionName || "", modules: (s.modules || [deepCopyModule()]).map(deepCopyModule), breakAfter: { duration: s.breakAfter?.duration || 0 } });


const EditTest = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [testname, setTestname] = useState("");
  const [sections, setSections] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true); // For initial data fetch
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5000/api/v1/admin/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch test data');
        const data = await response.json();
        setTestname(data.testname);
        // Ensure data structure is sound before setting state
        const sanitizedSections = (data.sections || []).map(s => ({
            ...emptySection,
            ...s,
            modules: (s.modules || []).map(m => ({
                ...emptyModule,
                ...m,
                questions: (m.questions || []).map(q => ({ ...emptyQuestion, ...q }))
            }))
        }));
        setSections(sanitizedSections.length > 0 ? sanitizedSections : [deepCopySection()]);
      } catch (error) {
        console.error("Error loading test:", error);
        setMessage("Error loading test data. Please try again.");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTestData();
  }, [id, getToken]);

  // All your handler functions (addSection, removeModule, etc.) remain exactly the same.
  // ... (paste all your handler functions here)
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/v1/admin/tests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ testname, sections }),
      });
      if (res.ok) {
        setMessage("Test updated successfully!");
        setTimeout(() => navigate("/admin/test-list"), 1000);
      } else {
        const errData = await res.json();
        setMessage(`Error: ${errData.message || 'Failed to update test'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
        <div className="container mx-auto max-w-5xl py-8 px-4 space-y-8">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/admin"><Home className="h-4 w-4" /></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="/admin/test-list">Manage Tests</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><ChevronRight /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbPage>Edit Test</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Test</h1>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
        </div>
        <Separator className="my-6" />

        {message && (
          <Alert variant={message.startsWith("Error") ? "destructive" : "default"} className="mb-6">
            <AlertTitle>{message.startsWith("Error") ? "An Error Occurred" : "Success"}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* The rest of the form is identical to the AddTest component's UI */}
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Test Details</CardTitle>
                    <CardDescription>Update the name for the overall test.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Label htmlFor="testname">Test Name</Label>
                    <Input id="testname" value={testname} onChange={e => setTestname(e.target.value)} placeholder="e.g., Final Aptitude Exam" required />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Test Structure</CardTitle>
                    <CardDescription>Modify the test by adding or removing sections, modules, and questions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full space-y-4" defaultValue={["section-0"]}>
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
                                            <Label htmlFor={`sectionName-${sIdx}`}>Section Name</Label>
                                            <Input id={`sectionName-${sIdx}`} value={section.sectionName} onChange={e => handleSectionChange(sIdx, "sectionName", e.target.value)} required />
                                        </div>
                                        <div>
                                            <Label htmlFor={`break-${sIdx}`}>Break After Section (seconds)</Label>
                                            <Input id={`break-${sIdx}`} type="number" value={section.breakAfter?.duration || 0} onChange={e => handleBreakChange(sIdx, Number(e.target.value))} min={0} />
                                        </div>
                                    </div>
                                    
                                    <Accordion type="multiple" className="w-full space-y-3" defaultValue={[`module-${sIdx}-0`]}>
                                        {section.modules.map((module, mIdx) => (
                                            <AccordionItem key={mIdx} value={`module-${sIdx}-${mIdx}`} className="border rounded-md px-4 bg-muted/50">
                                                <div className="flex items-center justify-between">
                                                    <AccordionTrigger className="flex-1 font-medium">
                                                        {module.moduleName || `Module ${mIdx + 1}`}
                                                    </AccordionTrigger>
                                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(sIdx, mIdx)} disabled={section.modules.length === 1}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                                <AccordionContent className="pt-4 space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label htmlFor={`moduleName-${sIdx}-${mIdx}`}>Module Name</Label>
                                                            <Input id={`moduleName-${sIdx}-${mIdx}`} value={module.moduleName} onChange={e => handleModuleChange(sIdx, mIdx, "moduleName", e.target.value)} required />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`timer-${sIdx}-${mIdx}`}>Timer (seconds)</Label>
                                                            <Input id={`timer-${sIdx}-${mIdx}`} type="number" value={module.timer} onChange={e => handleModuleChange(sIdx, mIdx, "timer", Number(e.target.value))} min={60} required />
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
                                                                        <Label htmlFor={`qtext-${sIdx}-${mIdx}-${qIdx}`}>Question Text</Label>
                                                                        <Textarea id={`qtext-${sIdx}-${mIdx}-${qIdx}`} value={q.question} onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "question", e.target.value)} required />
                                                                    </div>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        {q.options.map((opt, optIdx) => (
                                                                            <div key={optIdx}>
                                                                                <Label htmlFor={`opt-${sIdx}-${mIdx}-${qIdx}-${optIdx}`}>Option {optIdx + 1}</Label>
                                                                                <Input id={`opt-${sIdx}-${mIdx}-${qIdx}-${optIdx}`} value={opt} onChange={e => handleOptionChange(sIdx, mIdx, qIdx, optIdx, e.target.value)} required />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor={`answer-${sIdx}-${mIdx}-${qIdx}`}>Correct Answer</Label>
                                                                        <Input id={`answer-${sIdx}-${mIdx}-${qIdx}`} placeholder="Must match one option exactly" value={q.answer} onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "answer", e.target.value)} required />
                                                                    </div>
                                                                    <div>
                                                                        <Label htmlFor={`exp-${sIdx}-${mIdx}-${qIdx}`}>Explanation (Optional)</Label>
                                                                        <Textarea id={`exp-${sIdx}-${mIdx}-${qIdx}`} value={q.explanation || ""} onChange={e => handleQuestionChange(sIdx, mIdx, qIdx, "explanation", e.target.value)} rows={2} />
                                                                    </div>
                                                                    <div>
                                                                        <Label>Image (Optional)</Label>
                                                                        <ImageUpload onImageChange={(url) => handleQuestionChange(sIdx, mIdx, qIdx, "image", url)} currentImage={q.image} />
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                    <Button type="button" variant="outline" size="sm" onClick={() => addQuestion(sIdx, mIdx)}><PlusCircle className="mr-2 h-4 w-4" />Add Question</Button>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addModule(sIdx)}><PlusCircle className="mr-2 h-4 w-4" />Add Module</Button>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <Button type="button" variant="secondary" className="mt-6" onClick={addSection}><PlusCircle className="mr-2 h-4 w-4" />Add Section</Button>
                </CardContent>
            </Card>
        </div>
      </form>
    </div>
  );
};

export default EditTest;