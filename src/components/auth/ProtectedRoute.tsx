
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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
  const { checkAccess, userRole } = useUserAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    // Only show toast and check access after component mounts and auth is loaded
    if (isLoaded && isSignedIn && userRole) {
      const hasAccess = checkAccess(allowedRoles);
      if (!hasAccess) {
        toast({
          title: "Access Denied",
          description: `You need ${allowedRoles.join(" or ")} permissions to access this page.`,
          variant: "destructive",
        });
      }
      setAccessChecked(true);
    }
  }, [isLoaded, isSignedIn, userRole, allowedRoles, toast, checkAccess]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Authenticating...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Only redirect after we've checked access
  if (accessChecked && !checkAccess(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
