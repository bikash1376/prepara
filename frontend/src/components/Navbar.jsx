"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useTheme } from "./theme-provider";

// shadcn/ui components
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
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { HamburgerMenuIcon, SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const location = useLocation();
  const { user, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  if (!isSignedIn || !user) return null;

  const role = user?.publicMetadata?.role;
  const isActive = (path) => location.pathname === path;

  // Render navigation links based on user role
  const renderNavLinks = () => (
    <>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link to="/" className={isActive("/") ? "bg-accent text-accent-foreground font-bold" : ""}>
            Home
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {role === "student" && (
        <>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/test-list" className={isActive("/test-list") ? "bg-accent text-accent-foreground font-bold" : ""}>
                My Tests
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/submission-history" className={isActive("/submission-history") ? "bg-accent text-accent-foreground font-bold" : ""}>
                My Submissions
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/submission-history" className={isActive("/submission-history") ? "bg-accent text-accent-foreground" : ""}>
                My submissions
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </>
      )}

      {role === "admin" && (
        <>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/admin/test-list" className={isActive("/admin/test-list") ? "bg-accent text-accent-foreground font-bold" : ""}>
                Test Management
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/admin/student-management" className={isActive("/admin/student-management") ? "bg-accent text-accent-foreground font-bold" : ""}>
                Student Management
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/admin/submissions" className={isActive("/admin/submissions") ? "bg-accent text-accent-foreground font-bold" : ""}>
                Submissions
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </>
      )}
    </>
  );

  const renderMobileLinks = () => (
    <>
      <SheetClose asChild>
        <Link to="/" className={`block py-2 ${isActive("/") ? "bg-secondary text-secondary-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
          Home
        </Link>
      </SheetClose>
      {role === "student" && (
        <>
          <SheetClose asChild>
            <Link to="/test-list" className={`block py-2 ${isActive("/test-list") ? "bg-secondary text-secondary-foreground font-bold" : "hover:bg-accent hover:text-accent-foreground"}`}>
              My Tests
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/submission-history" className={`block py-2 ${isActive("/submission-history") ? "bg-secondary text-secondary-foreground font-bold" : "hover:bg-accent hover:text-accent-foreground"}`}>
              My Submissions
            </Link>
          </SheetClose>


        </>
      )}
      {role === "admin" && (
        <>
          <SheetClose asChild>
            <Link to="/admin/dashboard" className={` block py-2 ${isActive("/admin/dashboard") ? "bg-secondary text-secondary-foreground font-bold" : "hover:bg-accent hover:text-accent-foreground"}`}>
              Dashboard
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/admin/test-list" className={`block py-2 ${isActive("/admin/test-list") ? "bg-secondary text-secondary-foreground font-bold" : "hover:bg-accent hover:text-accent-foreground"}`}>
              Manage Tests
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/admin/add-test" className={`block py-2 ${isActive("/admin/add-test") ? "bg-secondary text-secondary-foreground font-bold" : "hover:bg-accent hover:text-accent-foreground"}`}>
              Add Test
            </Link>
          </SheetClose>
        </>
      )}
    </>
  );

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              <img src="https://10xlearningacademy.com/assets/images/logo-learn2.png" alt="Logo" width={150} className=" dark:invert" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavigationMenu>
              <NavigationMenuList>
                {renderNavLinks()}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
                setTheme(newTheme);
              }}
              title={`Current theme: ${theme}`}
            >
              {theme === "dark" ? <MoonIcon /> : theme === "light" ? <SunIcon /> : <DesktopIcon />}
            </Button>

            {/* User Button */}
            <div className="flex items-center space-x-2">
              <UserButton afterSignOutUrl="/login" />
              <span>{user.firstName}</span>
            </div>


          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const newTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
                setTheme(newTheme);
              }}
              title={`Current theme: ${theme}`}
            >
              {theme === "dark" ? <MoonIcon /> : theme === "light" ? <SunIcon /> : <DesktopIcon />}
            </Button>

            {/* Mobile User Button */}
            <UserButton afterSignOutUrl="/login" />

            {/* Mobile Sheet Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerMenuIcon className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  {/* <SheetTitle>Navigation</SheetTitle> */}
                </SheetHeader>
                <div className="grid gap-4 py-4 ml-4">
                  {renderMobileLinks()}
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