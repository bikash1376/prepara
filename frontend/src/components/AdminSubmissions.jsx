import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, ClipboardList, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const formatDuration = (seconds = 0) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/submissions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load submissions");
        const data = await res.json();
        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching submissions:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [getToken]);

  const filtered = submissions.filter((s) => {
    const q = query.toLowerCase();
    return (
      s.student.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.testName.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Every test submitted across the platform, newest first.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student or test…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {error ? (
        <Card>
          <CardContent className="py-10 text-center text-destructive">{error}</CardContent>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {submissions.length === 0
                ? "No submissions yet. They will appear here once students start taking tests."
                : "No submissions match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>
                    <div className="font-medium">{s.student}</div>
                    {s.email && <div className="text-xs text-muted-foreground">{s.email}</div>}
                  </TableCell>
                  <TableCell>{s.testName}</TableCell>
                  <TableCell>
                    {s.score}/{s.totalQuestions}
                    <span className="text-muted-foreground ml-1.5">({s.percentage}%)</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.percentage >= 60 ? "default" : "destructive"}>
                      {s.percentage >= 60 ? "Passed" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDuration(s.timeTaken)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(s.submittedAt).toLocaleDateString()}{" "}
                    {new Date(s.submittedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminSubmissions;
