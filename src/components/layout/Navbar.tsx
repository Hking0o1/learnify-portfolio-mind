
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

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearch({
    redirectToCoursesPage: true
  });

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Courses", href: "/courses" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Analytics", href: "/analytics" },
  ];

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

          {/* Desktop navigation */}
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 mt-1 mr-1 glass-dark dark:glass backdrop-blur-lg animate-fade-in-down"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
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

      {/* Mobile menu */}
      {isOpen && isMobile && (
        <div className="md:hidden h-screen bg-white dark:bg-gray-900 fixed inset-0 z-40 animate-fade-in pt-16">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-4 rounded-md text-base font-medium transition-all duration-200 ${
                  location.pathname === item.href
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    John Doe
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    john.doe@example.com
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
          </div>
        </div>
      )}
    </nav>
  );
}
