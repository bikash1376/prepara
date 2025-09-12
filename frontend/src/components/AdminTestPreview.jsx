import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import TestViewer from './TestViewer';

// Helper function to transform the test data to match the expected format
const transformTestData = (testData) => {
  // Flatten all questions from sections and modules into a single array
  const questions = [];
  
  testData.sections.forEach((section, sectionIndex) => {
    section.modules.forEach((module, moduleIndex) => {
      module.questions.forEach((question, questionIndex) => {
        questions.push({
          ...question,
          sectionIndex,
          moduleIndex,
          questionIndex,
          sectionName: section.sectionName,
          moduleName: module.moduleName
        });
      });
    });
  });

  return {
    ...testData,
    questions,
    // Add any other required fields that TestViewer might expect
  };
};

const AdminTestPreview = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`http://localhost:5000/api/v1/admin/tests/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch test');
        }

        const data = await response.json();
        // Transform the test data to match TestViewer's expected format
        const transformedTest = transformTestData(data);
        setTest(transformedTest);
      } catch (err) {
        console.error('Error fetching test:', err);
        setError('Failed to load test. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTest();
    }
  }, [id, getToken]);

  const handleTestComplete = async (answers) => {
    setIsSubmitting(true);
    try {
      // Calculate score based on the transformed test data
      let score = 0;
      const totalQuestions = test.questions.length;
      
      test.questions.forEach((question, index) => {
        if (answers[index] === question.answer) {
          score++;
        }
      });

      const percentage = Math.round((score / totalQuestions) * 100);
      
      // Show the score to the admin
      toast.success(`Test completed! Your score: ${score}/${totalQuestions} (${percentage}%)`, {
        duration: 10000,
      });

      // Navigate back to test list after a short delay
      setTimeout(() => {
        navigate('/admin/test-list');
      }, 2000);

    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to process test results');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => navigate('/admin/test-list')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/test-list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tests
        </Button>
        <h1 className="text-2xl font-bold">
          Test Preview: {test.testname}
        </h1>
        <div className="w-24"></div> {/* For alignment */}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Preview Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You are previewing this test as a student would see it. 
            Your responses will not be saved to the database.
          </p>
        </CardContent>
      </Card>

      {test && (
        <TestViewer 
          test={test} 
          onSubmit={handleTestComplete}
          isPreview={true}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default AdminTestPreview;
