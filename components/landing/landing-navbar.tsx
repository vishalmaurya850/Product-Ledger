"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const sections = ["features", "testimonials", "pricing"];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { id: "features", label: "Features" },
    { id: "testimonials", label: "Testimonials" },
    { id: "pricing", label: "Pricing" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={handleLogoClick}
        >
          <Package className="h-6 w-6 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
          <span className="text-lg font-bold transition-all duration-300 group-hover:text-primary/90">
            Product Ledger
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`text-sm font-medium transition-all duration-300 relative group ${
                activeSection === link.id
                  ? "text-primary"
                  : "hover:text-primary"
              }`}
            >
              <span className="relative z-10">{link.label}</span>
              <span
                className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary transition-all duration-300 ${
                  activeSection === link.id
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth/login" className="group">
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              Log In
            </Button>
          </Link>
          <Link href="/auth/register" className="group">
            <Button
              size="sm"
              className="transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Sign Up</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary focus:outline-none"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md shadow-md px-4 pb-6 pt-2 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block text-sm font-medium text-foreground hover:text-primary transition-all text-left w-full py-2"
            >
              {link.label}
            </button>
          ))}

          {/* Auth & Theme Section */}
          <div className="flex flex-col items-center gap-3 mt-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Login Button */}
            <Link href="/auth/login" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                Log In
              </Button>
            </Link>

            {/* Sign Up Button */}
            <Link href="/auth/register" className="w-full">
              <Button size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}