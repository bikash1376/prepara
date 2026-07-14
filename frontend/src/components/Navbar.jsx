import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useTheme } from "./theme-provider";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { HamburgerMenuIcon, SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";

const STUDENT_LINKS = [
  { to: "/test-list", label: "My Tests" },
  { to: "/submission-history", label: "My Submissions" },
];

const ADMIN_LINKS = [
  { to: "/admin/test-list", label: "Tests" },
  { to: "/admin/student-management", label: "Students" },
  { to: "/admin/submissions", label: "Submissions" },
];

const Navbar = () => {
  const location = useLocation();
  const { user, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  if (!isSignedIn || !user) {
    return null;
  }

  const role = user?.publicMetadata?.role;
  const links = [{ to: "/", label: "Home" }, ...(role === "admin" ? ADMIN_LINKS : role === "student" ? STUDENT_LINKS : [])];
  const isActive = (path) => location.pathname === path;

  const cycleTheme = () => {
    setTheme(theme === "dark" ? "light" : theme === "light" ? "system" : "dark");
  };

  const ThemeIcon = theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : DesktopIcon;

  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-xl font-bold tracking-tight">
            Prepara
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {links.map((link) => (
                  <NavigationMenuItem key={link.to}>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link
                        to={link.to}
                        className={`text-sm font-medium ${isActive(link.to) ? "bg-secondary text-secondary-foreground" : ""}`}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Button variant="ghost" size="icon" onClick={cycleTheme} title={`Current theme: ${theme}`}>
              <ThemeIcon />
            </Button>

            <UserButton afterSignOutUrl="/" />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={cycleTheme} title={`Current theme: ${theme}`}>
              <ThemeIcon />
            </Button>

            <UserButton afterSignOutUrl="/" />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader />
                <div className="grid gap-2 py-4 px-4">
                  {links.map((link) => (
                    <SheetClose asChild key={link.to}>
                      <Link
                        to={link.to}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                          isActive(link.to)
                            ? "bg-secondary text-secondary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
