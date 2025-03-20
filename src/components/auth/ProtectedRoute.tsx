
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "instructor" | "student";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({
  children,
  allowedRoles = ["student", "instructor", "admin"],
}: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useUser();
  const { checkAccess } = useUserAuth();
  const location = useLocation();
  const { toast } = useToast();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  const hasAccess = checkAccess(allowedRoles);

  if (!hasAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
