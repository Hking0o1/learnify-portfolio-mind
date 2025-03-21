
import { createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "instructor" | "student";

interface AuthContextType {
  userRole: UserRole | null;
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
  userId: string | null;  // Add userId property
  setUserRole: (role: UserRole) => void;
  checkAccess: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // Add userId state
  const navigate = useNavigate();
  const { toast } = useToast();

  // In a real application, you would fetch the user's role from your database
  // Here we're using a simplified approach with metadata
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Set userId from user object
      setUserId(user.id);
      
      // Check if user has a role in public metadata
      const userMetadata = user.publicMetadata;
      
      if (userMetadata && userMetadata.role) {
        setUserRole(userMetadata.role as UserRole);
      } else {
        // Default role is student if not specified
        setUserRole("student");
      }
    } else if (isLoaded && !isSignedIn) {
      setUserRole(null);
      setUserId(null);
    }
  }, [isLoaded, isSignedIn, user]);

  const checkAccess = (allowedRoles: UserRole[]) => {
    if (!isSignedIn || !userRole) return false;
    return allowedRoles.includes(userRole);
  };

  const contextValue: AuthContextType = {
    userRole,
    isAdmin: userRole === "admin",
    isInstructor: userRole === "instructor" || userRole === "admin", // Admin can do everything an instructor can
    isStudent: userRole === "student" || userRole === "instructor" || userRole === "admin", // Everyone has student access
    userId, // Add userId to context value
    setUserRole,
    checkAccess,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUserAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useUserAuth must be used within an AuthProvider");
  }
  return context;
}
