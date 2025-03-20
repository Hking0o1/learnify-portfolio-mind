
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  BookOpen,
  LayoutDashboard,
  LineChart,
  Briefcase,
  Shield,
  GraduationCap,
  PlusCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearch } from "@/hooks/use-search";
import { useUserAuth } from "@/contexts/AuthContext";
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  SignInButton, 
  SignUpButton,
  useUser,
} from "@clerk/clerk-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearch({
    redirectToCoursesPage: true
  });
  const { isAdmin, isInstructor } = useUserAuth();
  const { user } = useUser();

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  // Basic navigation items always visible to authenticated users
  const basicNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Portfolio", href: "/portfolio", icon: Briefcase },
    { name: "Analytics", href: "/analytics", icon: LineChart },
  ];

  // Role-based navigation items
  const roleBasedNavigation = [
    ...(isInstructor ? [{ name: "Instructor", href: "/instructor", icon: GraduationCap }] : []),
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Shield }] : []),
  ];

  // Combine navigation items based on user role
  const navigation = [...basicNavigation, ...roleBasedNavigation];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/20 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">P</span>
              </div>
              <h1 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Pragati
              </h1>
            </Link>
          </div>

          <SignedIn>
            <div className="hidden md:flex items-center justify-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 px-1 py-2 text-sm font-medium relative group ${
                    location.pathname === item.href
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out ${
                      location.pathname === item.href ? "scale-x-100" : ""
                    }`}
                  ></span>
                </Link>
              ))}
            </div>
          </SignedIn>

          <SignedIn>
            <div className="hidden md:flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </form>

              {isInstructor && (
                <Link to="/add-course">
                  <Button variant="ghost" size="icon" className="relative group">
                    <PlusCircle className="h-5 w-5" />
                    <span className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Add Course
                    </span>
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => {
                  // Notification logic
                }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                  3
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="transition-transform duration-200 hover:scale-110"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="transition-transform duration-200 hover:scale-110"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <div className="flex md:hidden items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && isMobile && (
        <div className="md:hidden h-screen bg-white dark:bg-gray-900 fixed inset-0 z-40 animate-fade-in pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <SignedIn>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-4 rounded-md text-base font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </SignedIn>

            <SignedOut>
              <div className="mt-6 px-3 space-y-3">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <Button className="w-full">Sign Up</Button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center px-5">
                  <UserButton afterSignOutUrl="/" />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                      {user?.fullName || 'User'}
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {user?.primaryEmailAddress?.emailAddress || ''}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto relative"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </nav>
  );
}
