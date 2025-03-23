
import { useState, useEffect, useRef } from "react";
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
  Sparkles,
  ChevronDown,
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
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains("dark")
  );
  
  const isMobile = useIsMobile();
  const location = useLocation();
  const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearch({
    redirectToCoursesPage: true
  });
  const { isAdmin, isInstructor } = useUserAuth();
  const { user } = useUser();
  
  // Effect to update isDarkMode state when system preference changes
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    darkModeMediaQuery.addEventListener('change', handleChange);
    
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

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

  const themeSwitchAnimation = {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Sample notifications
  const notifications = [
    { id: 1, title: "New course available", message: "Check out the new Data Science course!" },
    { id: 2, title: "Quiz reminder", message: "You have a quiz due tomorrow" },
    { id: 3, title: "Forum reply", message: "Someone replied to your forum post" }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/20 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span 
                  className="text-white font-semibold text-sm relative z-10"
                  initial={{ y: 0 }}
                  whileHover={{ y: [-1, 1, -1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  P
                </motion.span>
                <motion.div 
                  className="absolute inset-0 bg-blue-400 opacity-0"
                  whileHover={{ 
                    opacity: 0.3, 
                    scale: 1.5,
                    transition: { duration: 0.8 }
                  }}
                />
              </motion.div>
              <motion.h1 
                className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400"
                initial={{ opacity: 1 }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
              >
                Pragati
              </motion.h1>
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="py-3 cursor-pointer">
                      <div>
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={themeSwitchAnimation}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="transition-transform duration-200 hover:scale-110 relative overflow-hidden"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isDarkMode ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span className="sr-only">Toggle theme</span>
                  
                  {/* Ripple effect on click */}
                  <motion.span
                    className="absolute inset-0 rounded-full bg-blue-400/20"
                    initial={{ scale: 0, opacity: 0.8 }}
                    whileTap={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>

              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center space-x-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={themeSwitchAnimation}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="transition-transform duration-200 hover:scale-110 relative overflow-hidden"
                >
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: isDarkMode ? 180 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    {isDarkMode ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span className="sr-only">Toggle theme</span>
                  
                  {/* Ripple effect on click */}
                  <motion.span
                    className="absolute inset-0 rounded-full bg-blue-400/20"
                    initial={{ scale: 0, opacity: 0.8 }}
                    whileTap={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
              
              <Link to="/instructor-login">
                <Button variant="outline" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>For Instructors</span>
                </Button>
              </Link>
              
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              
              <SignUpButton mode="modal">
                <Button className="group relative overflow-hidden">
                  <span className="relative z-10">Sign Up</span>
                  <motion.span
                    className="absolute inset-0 bg-blue-600 group-hover:bg-blue-700"
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <Sparkles className="w-4 h-4 ml-2 relative z-10" />
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* Mobile Navigation - Using Sheet component for better mobile experience */}
          <div className="flex md:hidden items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="transition-transform"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="py-6 w-[80vw] sm:max-w-sm">
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-2">
                    <SignedIn>
                      <div className="flex items-center px-2 py-3 mb-6">
                        <UserButton afterSignOutUrl="/" />
                        <div className="ml-3">
                          <div className="text-base font-medium">
                            {user?.fullName || 'User'}
                          </div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {user?.primaryEmailAddress?.emailAddress || ''}
                          </div>
                        </div>
                      </div>

                      <div className="px-2 space-y-1 mb-6">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                              location.pathname === item.href
                                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      <div className="px-2 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Notifications
                        </div>
                        <div className="space-y-2 mt-1">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SignedIn>

                    <SignedOut>
                      <div className="mt-6 px-3 space-y-3">
                        <Link to="/instructor-login" className="block w-full">
                          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>For Instructors</span>
                          </Button>
                        </Link>
                        
                        <SignInButton mode="modal">
                          <Button variant="outline" className="w-full">Sign In</Button>
                        </SignInButton>
                        
                        <SignUpButton mode="modal">
                          <Button className="w-full">Sign Up</Button>
                        </SignUpButton>
                      </div>
                    </SignedOut>
                  </div>

                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="px-2">
                      <Button variant="ghost" className="w-full justify-start text-sm" onClick={toggleDarkMode}>
                        {isDarkMode ? (
                          <Sun className="h-4 w-4 mr-3" />
                        ) : (
                          <Moon className="h-4 w-4 mr-3" />
                        )}
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
