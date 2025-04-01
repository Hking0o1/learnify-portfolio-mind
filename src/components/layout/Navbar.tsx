
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Book,
  Home,
  Menu,
  X,
  LogIn,
  Sparkles,
  BookOpen,
  LayoutDashboard,
} from "lucide-react";
import { SignOutButton, useClerk, useUser } from "@clerk/clerk-react";
import { useUserAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isInstructor } = useUserAuth();
  const { isSignedIn, user } = useUser();

  const handleSignOut = () => {
    signOut(() => navigate("/"));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <Book className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">LearnSphere</span>
            </NavLink>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive
                      ? "border-primary text-primary dark:border-primary dark:text-primary"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                  }`
                }
              >
                <LayoutDashboard className="mr-1 h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                    isActive
                      ? "border-primary text-primary dark:border-primary dark:text-primary"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                  }`
                }
              >
                <BookOpen className="mr-1 h-4 w-4" />
                Courses
              </NavLink>
              {isSignedIn && (
                <NavLink
                  to="/course-recommendation"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      isActive
                        ? "border-primary text-primary dark:border-primary dark:text-primary"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                    }`
                  }
                >
                  <Sparkles className="mr-1 h-4 w-4" />
                  Personalized Course
                </NavLink>
              )}
              {isInstructor && (
                <NavLink
                  to="/instructor"
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      isActive
                        ? "border-primary text-primary dark:border-primary dark:text-primary"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300"
                    }`
                  }
                >
                  Instructor
                </NavLink>
              )}
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <NavLink
                  to="/profile"
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || ""}
                    />
                    <AvatarFallback>
                      {getInitials(user?.fullName || "")}
                    </AvatarFallback>
                  </Avatar>
                </NavLink>
                <SignOutButton>
                  <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/sign-in")}
                  className="flex items-center"
                >
                  <LogIn className="mr-1 h-4 w-4" />
                  Sign In
                </Button>
                <Button onClick={() => navigate("/sign-up")}>Sign Up</Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink
              to="/dashboard"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "border-primary text-primary dark:border-primary dark:text-primary bg-indigo-50 dark:bg-gray-800"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                }`
              }
            >
              <div className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </div>
            </NavLink>
            <NavLink
              to="/courses"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "border-primary text-primary dark:border-primary dark:text-primary bg-indigo-50 dark:bg-gray-800"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                }`
              }
            >
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Courses
              </div>
            </NavLink>
            {isSignedIn && (
              <NavLink
                to="/course-recommendation"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? "border-primary text-primary dark:border-primary dark:text-primary bg-indigo-50 dark:bg-gray-800"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                  }`
                }
              >
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Personalized Course
                </div>
              </NavLink>
            )}
            {isInstructor && (
              <NavLink
                to="/instructor"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive
                      ? "border-primary text-primary dark:border-primary dark:text-primary bg-indigo-50 dark:bg-gray-800"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                  }`
                }
              >
                <div className="flex items-center">
                  <Book className="mr-2 h-4 w-4" />
                  Instructor
                </div>
              </NavLink>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isSignedIn ? (
              <div className="space-y-2">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.imageUrl}
                        alt={user?.fullName || ""}
                      />
                      <AvatarFallback>
                        {getInitials(user?.fullName || "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user?.fullName}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {user?.emailAddresses[0]?.emailAddress}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1 px-2">
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Your Profile
                  </NavLink>
                  <SignOutButton>
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Sign out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            ) : (
              <div className="px-4 space-y-2">
                <button
                  onClick={() => {
                    navigate("/sign-in");
                    closeMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate("/sign-up");
                    closeMenu();
                  }}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary/90"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
