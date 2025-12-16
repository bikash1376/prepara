import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { FilePlus, Pencil, Trash2, Loader2, AlertCircle, Play, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminTestList = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tests:", error);
      setMessage("Failed to fetch tests.");
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/test/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMessage("Test deleted successfully!");
        // Optimistically remove the test from the list for a faster UI response
        setTests((prevTests) => prevTests.filter((test) => test._id !== id));
      } else {
        setMessage("Error deleting test. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  const handleToggleVisibility = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/test/${id}/toggle-visibility`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
        // Update the test in the list
        setTests((prevTests) =>
          prevTests.map((test) =>
            test._id === id ? { ...test, isHidden: data.test.isHidden } : test
          )
        );
      } else {
        setMessage("Error toggling test visibility. Please try again.");
      }
    } catch (error) {
      console.error("Error toggling test visibility:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="mb-2">Manage Tests</CardTitle>
            <CardDescription>Add, edit, or delete question papers.</CardDescription>
          </div>
          <Button onClick={() => navigate("/admin/add-test")}>
            <FilePlus className="mr-2 h-4 w-4" />
            Add Test
          </Button>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No tests found.</p>
              <p className="text-sm">Click "Add Test" to create a new one.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => (
                <div
                  key={test._id}
                  className="flex items-center justify-between rounded-md border p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{test.testname}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      test.isHidden 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {test.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleVisibility(test._id)}
                      className={test.isHidden ? "text-gray-600 hover:text-gray-700" : "text-blue-600 hover:text-blue-700"}
                      title={test.isHidden ? "Show test to students" : "Hide test from students"}
                    >
                      {test.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{test.isHidden ? "Show Test" : "Hide Test"}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/preview-test/${test._id}`)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Preview Test</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate(`/admin/edit-test/${test._id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit Test</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete Test</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the test
                            and all associated submissions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(test._id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestList;