
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { portfolioAPI } from "@/services/portfolio";

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  fullName: string | null;
  isInstructor: boolean;
  isAdmin: boolean;
  userRole: string;
  checkAccess: (allowedRoles?: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  isAuthenticated: false,
  fullName: null,
  isInstructor: false,
  isAdmin: false,
  userRole: 'user',
  checkAccess: () => false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
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
      }
    };
    
    initializeUserData();
  }, [userId, isFirstLogin]);

  // Function to check if user has required role
  const checkAccess = (allowedRoles?: string[]) => {
    if (!isSignedIn) return false;
    if (!allowedRoles) return true;
    
    if (isAdmin) return true; // Admin has access to everything
    if (allowedRoles.includes(userRole)) return true;
    
    return false;
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
        checkAccess
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
