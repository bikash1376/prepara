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
import { Sparkles } from "lucide-react";

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
          <Link to="/" className={`text-lg font-medium uppercase ${isActive('/') ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>
            Home
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {role === "student" && (
        <>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/test-list" className={`text-lg font-medium uppercase ${isActive('/test-list') ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>
                My Tests
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/submission-history" className={`text-lg uppercase ${isActive('/submission-history') ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>
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
              <Link to="/admin/test-list" className={`text-lg font-medium uppercase ${isActive('/admin/test-list') ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>
                Test Management
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/admin/student-management" className={`text-lg font-medium uppercase ${isActive('/admin/student-management') ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>
                Student Management
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/admin/submissions" className={`text-lg font-medium uppercase ${isActive('/admin/submissions') ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>
                Submissions
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {/* <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link to="/admin/ai-chat" className={isActive("/admin/ai-chat") ? "bg-accent text-accent-foreground font-bold" : ""}>
              <Sparkles />
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem> */}
        </>
      )}
    </>
  );

  const renderMobileLinks = () => (
    <>
      <SheetClose asChild>
        <Link to="/" className={`block py-2 text-lg font-medium uppercase ${isActive('/') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'}`}>
          Home
        </Link>
      </SheetClose>
      {role === "student" && (
        <>
          <SheetClose asChild>
            <Link to="/test-list" className={`block py-2 text-lg font-medium uppercase ${isActive('/test-list') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'}`}>
              My Tests
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/submission-history" className={`block py-2 text-lg font-medium uppercase ${isActive('/submission-history') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'}`}>
              My Submissions
            </Link>
          </SheetClose>


        </>
      )}
      {role === "admin" && (
        <>
          <SheetClose asChild>
            <Link to="/admin/test-list" className={`block py-2 text-lg font-medium uppercase ${isActive('/admin/test-list') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'}`}>
            Test Management
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/admin/student-management" className={`block py-2 text-lg font-medium uppercase ${isActive('/admin/student-management') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'}`}>
            Student Management
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/admin/submissions" className={`block py-2 text-lg font-medium uppercase ${isActive('/admin/submissions') ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]'}`}>
            Submissions
            </Link>
          </SheetClose>
        </>
      )}
    </>
  );

  return (
    <nav className="border-b mt-5 pb-2 ">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">
              <img src="/logo.png" alt="Logo" width={220} className="" />
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
              <UserButton afterSignOutUrl="/login" 
              // showName
              />
              <span 
                className="cursor-pointer hover:text-[hsl(var(--primary))] transition-colors"
                onClick={() => {
                  // Programmatically click the UserButton to open the menu
                  const userButton = document.querySelector('[data-clerk-element="userButton"]');
                  if (userButton) {
                    userButton.click();
                  }
                }}
              >
                {user.firstName}
              </span>
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