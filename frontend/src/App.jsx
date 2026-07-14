import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Loader from "./components/Loader";

// Route-level code splitting: each page loads only when visited
const AddTest = lazy(() => import("./components/AddTest"));
const TestViewer = lazy(() => import("./components/TestViewer"));
const AdminTestList = lazy(() => import("./components/AdminTestList"));
const EditTest = lazy(() => import("./components/EditTest"));
const AuthForm = lazy(() => import("./components/AuthForm"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const StudentDashboard = lazy(() => import("./components/StudentDashboard"));
const TestSubmission = lazy(() => import("./components/TestSubmission"));
const TestResults = lazy(() => import("./components/TestResults"));
const SubmissionHistory = lazy(() => import("./components/SubmissionHistory"));
const StudentMgmt = lazy(() => import("./components/StudentMgmt"));
const AdminSubmissions = lazy(() => import("./components/AdminSubmissions"));
const AdminTestPreview = lazy(() => import("./components/AdminTestPreview"));
const Tests = lazy(() => import("./components/Tests"));
const AdminAiChat = lazy(() => import("./components/AdminAiChat"));
const LandingPage = lazy(() => import("./components/LandingPage"));
const PaymentSuccess = lazy(() => import("./components/PaymentSuccess"));

// Home page component that handles authentication-based routing
const HomePage = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      if (!role) {
        navigate("/login", { replace: true });
        return;
      }

      // Redirect to appropriate dashboard based on role
      if (role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/student/dashboard", { replace: true });
      }
    }
    // If not signed in, stay on landing page (no redirect needed)
  }, [isSignedIn, user, isLoaded, navigate]);

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="large" text="Initializing..." />
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return <LandingPage />;
};

const RouteFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader size="large" />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/test-submission/') || location.pathname === '/';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
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
      </Suspense>
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
