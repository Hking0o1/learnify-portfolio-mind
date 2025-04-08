
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { portfolioAPI } from "@/services/portfolio";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  fullName: string | null;
  isInstructor: boolean;
  isAdmin: boolean;
  userRole: string;
  checkAccess: (allowedRoles?: string[]) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isAuthenticated: false,
  fullName: null,
  isInstructor: false,
  isAdmin: false,
  userRole: 'user',
  checkAccess: () => false,
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [isInstructor, setIsInstructor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  // Check auth status and set up user info
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      const newUserId = user.id;
      setUserId(newUserId);
      
      // Check if this is user's first login
      const firstLoginKey = `first_login_${newUserId}`;
      const hasLoggedInBefore = localStorage.getItem(firstLoginKey);
      
      if (!hasLoggedInBefore) {
        setIsFirstLogin(true);
        localStorage.setItem(firstLoginKey, 'true');
      }
      
      // In a real app, you would fetch user roles from the database
      // For demo purposes, assign random roles
      const randomNum = Math.random();
      const isInstr = randomNum > 0.3;  // 70% chance to be an instructor
      const isAdm = randomNum > 0.7;    // 30% chance to be an admin
      
      setIsInstructor(isInstr);
      setIsAdmin(isAdm);
      
      if (isAdm) {
        setUserRole('admin');
      } else if (isInstr) {
        setUserRole('instructor');
      } else {
        setUserRole('user');
      }
      
    } else {
      setUserId(null);
      setIsInstructor(false);
      setIsAdmin(false);
      setUserRole('user');
    }
  }, [isLoaded, isSignedIn, user]);
  
  // Initialize user data on first login
  useEffect(() => {
    const initializeUserData = async () => {
      if (!userId || !isFirstLogin) return;
      
      console.log(`First login detected for user ${userId}. Setting up initial data...`);
      
      try {
        // Generate roadmap for new user
        await portfolioAPI.generateUserRoadmap(userId);
        console.log("User roadmap generated successfully");
        
        // Mark first login as processed
        setIsFirstLogin(false);
      } catch (error) {
        console.error("Error initializing user data:", error);
        toast({
          title: "Setup Error",
          description: "Could not initialize your account data. Please try refreshing the page.",
          variant: "destructive"
        });
      }
    };
    
    initializeUserData();
  }, [userId, isFirstLogin, toast]);

  // Function to check if user has required role
  const checkAccess = (allowedRoles?: string[]) => {
    if (!isSignedIn) return false;
    if (!allowedRoles) return true;
    
    if (isAdmin) return true; // Admin has access to everything
    if (allowedRoles.includes(userRole)) return true;
    
    return false;
  };

  // Safe logout function
  const logout = async () => {
    try {
      // First, sign out from Clerk
      await signOut();
      
      // Then, sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any sensitive data from localStorage
      // Only clear our app data, not everything
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('first_login_') || key.includes('user_data')) {
          localStorage.removeItem(key);
        }
      });
      
      // Navigate to home page
      navigate('/');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout Error",
        description: "Something went wrong during logout. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        isAuthenticated: Boolean(isSignedIn && userId),
        fullName: user?.fullName || null,
        isInstructor,
        isAdmin,
        userRole,
        checkAccess,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
