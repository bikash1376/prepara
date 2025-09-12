import { BrowserRouter, Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

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

// Protected home page with Clerk authentication
const HomePage = () => {
  const { user, isSignedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignedIn) {
      navigate("/login");
      return;
    }

    if (user) {
      const role = user.publicMetadata?.role;
      if (!role) {
        // User needs to select a role
        navigate("/login");
        return;
      }

      // Redirect to appropriate dashboard based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    }
  }, [isSignedIn, user, navigate]);

  if (!isSignedIn || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const role = user.publicMetadata?.role;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Welcome {user.firstName || user.emailAddresses[0]?.emailAddress}!
      </h1>

      {/* Show Admin Dashboard link only if user is admin */}
      {/* {role === "admin" && (
        <Link
          to="/admin/dashboard"
          className="mb-2 px-4 py-2 bg-purple-600 text-white rounded"
        >
          Admin Dashboard
        </Link>
      )} */}

      {/* Show Student Dashboard link only if user is student */}
      {/* {role === "student" && (
        <>
          <Link
            to="/student/dashboard"
            className="mb-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            Student Dashboard
          </Link>
        </>
      )} */}
    </div>
  );
};


const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/test-submission/');

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
    
                <TestList />
       
            
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

        {/* Public Auth Routes */}
        <Route path="/login/*" element={<AuthForm mode="login" />} />
        <Route path="/signup/*" element={<AuthForm mode="signup" />} />

        {/* Default */}
        <Route path="/" element={<HomePage />} />
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
