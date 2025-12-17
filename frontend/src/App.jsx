import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import AddTest from "./components/AddTest";
import TestViewer from "./components/TestViewer";
import TestList from "./components/TestList";
import AdminTestList from "./components/AdminTestList";
import EditTest from "./components/EditTest";
import AuthForm from "./components/AuthForm";
import AuthSuccess from "./components/AuthSuccess";
import LogoutButton from "./components/LogoutButton";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import Navbar from "./components/Navbar";
import TestSubmission from "./components/TestSubmission";
import TestResults from "./components/TestResults";
import SubmissionHistory from "./components/SubmissionHistory";
import ProtectedRoute from "./components/ProtectedRoute";
import { Button } from "./components/ui/button";
import StudentMgmt from "./components/StudentMgmt";
import AdminSubmissions from "./components/AdminSubmissions";
import AdminTestPreview from "./components/AdminTestPreview";
import Tests from "./components/Tests";
import AdminAiChat from "./components/AdminAiChat";
import LandingPage from "./components/LandingPage";
import PaymentSuccess from "./components/PaymentSuccess";
import Loader from "./components/Loader";



// Home page component that handles authentication-based routing
const HomePage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    // console.log('🔴 HomePage rendered');
    // console.log('🔴 User loaded:', isLoaded);
    // console.log('🔴 User signed in:', isSignedIn);
    // console.log('🔴 User:', user?.id);
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (!role) {
        // console.log('🔴 No role found, redirecting to login');
        navigate("/login");
        return;
      }

      // Redirect to appropriate dashboard based on role
      if (role === "admin") {
        // console.log('🔴 Admin user, redirecting to admin dashboard');
        navigate("/admin/dashboard");
      } else {
        // console.log('🔴 Student user, redirecting to student dashboard');
        navigate("/student/dashboard");
      }
    }
    // If not signed in, stay on landing page (no redirect needed)
  }, [isSignedIn, user, isLoaded, navigate]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    // console.log('🔴 Clerk not loaded yet');
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="large" text="Initializing..." />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  // console.log('🔴 Showing landing page');
  return <LandingPage />;
};

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/test-submission/') || location.pathname === '/';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Student Routes - Protected */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test-viewer/:id" 
          element={
            <ProtectedRoute requiredRole="student">
              <TestViewer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test-list" 
          element={
            <ProtectedRoute requiredRole="student">
    
                {/* <TestList /> */}
                <Tests />
       
            
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test-submission/:id" 
          element={
            <ProtectedRoute requiredRole="student">
              <TestSubmission />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/test-results/:submissionId" 
          element={
            <ProtectedRoute requiredRole="student">
              <TestResults />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/submission-history" 
          element={
            <ProtectedRoute requiredRole="student">
              <SubmissionHistory />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes - Protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/add-test" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AddTest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/test-list" 
          element={
            <ProtectedRoute requiredRole="admin">
             
              
              <AdminTestList />
              
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/edit-test/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <EditTest />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/preview-test/:id" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminTestPreview />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/submissions" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminSubmissions />
            </ProtectedRoute>
          } 
        />

<Route 
          path="/admin/ai-chat" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAiChat />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin/student-management" 
          element={
            <ProtectedRoute requiredRole="admin">
              <StudentMgmt />
            </ProtectedRoute>
          } 
        />

        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login/*" element={<AuthForm mode="login" />} />
        <Route path="/signup/*" element={<AuthForm mode="signup" />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
