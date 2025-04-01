
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "./hooks/use-theme";

// Pages - Fix imports to use default exports
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Portfolio from "./pages/Portfolio";
import Admin from "./pages/Admin";
import Analytics from "./pages/Analytics";
import Assessment from "./pages/Assessment";
import Instructor from "./pages/Instructor";
import AddCourse from "./pages/AddCourse";
import AddModule from "./pages/AddModule";
import CourseRecommendation from "./pages/CourseRecommendation";
import InstructorLogin from "./pages/InstructorLogin";

// Components
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client for React Query
const queryClient = new QueryClient();

function App() {
  const { resolvedTheme } = useTheme();
  const clerkTheme = resolvedTheme === "dark" ? dark : undefined;

  // Get the Clerk publishable key from the environment variables
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    return (
      <div className="text-center p-5">
        <h1 className="text-2xl text-red-500 font-bold">Error</h1>
        <p>
          Missing Clerk publishable key. Make sure VITE_CLERK_PUBLISHABLE_KEY is
          set in your environment variables.
        </p>
      </div>
    );
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{ baseTheme: clerkTheme }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/instructor-login" element={<InstructorLogin />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute>
                      <Courses />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <ProtectedRoute>
                      <CourseDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/portfolio"
                  element={
                    <ProtectedRoute>
                      <Portfolio />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment"
                  element={
                    <ProtectedRoute>
                      <Assessment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/course-recommendation"
                  element={
                    <ProtectedRoute>
                      <CourseRecommendation />
                    </ProtectedRoute>
                  }
                />

                {/* Instructor Routes */}
                <Route
                  path="/instructor"
                  element={
                    <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                      <Instructor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-course"
                  element={
                    <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                      <AddCourse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-module/:courseId"
                  element={
                    <ProtectedRoute allowedRoles={["instructor", "admin"]}>
                      <AddModule />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <Analytics />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
