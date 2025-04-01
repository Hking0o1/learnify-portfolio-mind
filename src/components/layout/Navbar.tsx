
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton, SignOutButton } from "@clerk/clerk-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserAuth } from "@/contexts/AuthContext";
import { Menu, X, ChevronDown, Laptop, Moon, Sun } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/hooks/use-theme";
import useMobile from "@/hooks/use-mobile";

// ModeToggle component
export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { isAuthenticated, fullName, userId, isInstructor, isAdmin } = useUserAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = () => {
    // Additional sign out logic if needed
    navigate("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">EduLMS</span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <ListItem
                      href="/courses"
                      title="All Courses"
                    >
                      Browse our catalog of professional courses.
                    </ListItem>
                    <ListItem
                      href="/assessment"
                      title="Skills Assessment"
                    >
                      Evaluate your current skills and get personalized recommendations.
                    </ListItem>
                    <ListItem
                      href="/course-recommendation"
                      title="Course Recommendation"
                    >
                      Get AI-powered course recommendations based on your goals.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              {isInstructor && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/instructor"
                      className={({ isActive }) =>
                        cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive && "bg-accent text-accent-foreground"
                        )
                      }
                    >
                      Instructor
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}

              {isAdmin && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive && "bg-accent text-accent-foreground"
                        )
                      }
                    >
                      Admin
                    </NavLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <NavLink to="/profile" className="flex items-center space-x-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={fullName || "User"} />
                  <AvatarFallback>{getInitials(fullName || "")}</AvatarFallback>
                </Avatar>
              </NavLink>
              <SignOutButton>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
              </SignOutButton>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <ModeToggle />
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button>Sign Up</Button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px]">
              <div className="flex flex-col h-full">
                <div className="px-4 py-6">
                  <NavLink
                    to="/"
                    className="flex items-center space-x-2 mb-6"
                    onClick={closeMenu}
                  >
                    <span className="font-bold text-xl">EduLMS</span>
                  </NavLink>
                  <nav className="flex flex-col space-y-4">
                    <NavLink
                      to="/courses"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          "px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800",
                          isActive 
                            ? "text-primary font-semibold" 
                            : "text-gray-700 dark:text-gray-300"
                        )
                      }
                    >
                      Courses
                    </NavLink>
                    <NavLink
                      to="/assessment"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          "px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800",
                          isActive 
                            ? "text-primary font-semibold" 
                            : "text-gray-700 dark:text-gray-300"
                        )
                      }
                    >
                      Assessment
                    </NavLink>
                    <NavLink
                      to="/course-recommendation"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          "px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800",
                          isActive 
                            ? "text-primary font-semibold" 
                            : "text-gray-700 dark:text-gray-300"
                        )
                      }
                    >
                      Course Recommendation
                    </NavLink>
                    
                    {isInstructor && (
                      <NavLink
                        to="/instructor"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          cn(
                            "px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800",
                            isActive 
                              ? "text-primary font-semibold" 
                              : "text-gray-700 dark:text-gray-300"
                          )
                        }
                      >
                        Instructor Dashboard
                      </NavLink>
                    )}
                    
                    {isAdmin && (
                      <NavLink
                        to="/admin"
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          cn(
                            "px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-800",
                            isActive 
                              ? "text-primary font-semibold" 
                              : "text-gray-700 dark:text-gray-300"
                          )
                        }
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                  </nav>
                </div>
                <div className="mt-auto px-4 py-6 border-t">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <NavLink
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src="" alt={fullName || "User"} />
                          <AvatarFallback>{getInitials(fullName || "")}</AvatarFallback>
                        </Avatar>
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
                  ) : (
                    <div className="space-y-4">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignInButton mode="modal">
                        <Button className="w-full">
                          Sign Up
                        </Button>
                      </SignInButton>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
