import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { useAccessibility } from "@/hooks/use-accessibility";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const handleScrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.substring(2);
      // If we're not on the home page, navigate to home first
      if (window.location.pathname !== "/") {
        window.location.href = href;
        return;
      }
      // If we're on home page, scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  const { isToolbarVisible } = useAccessibility();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/#about", label: "About" },
    { href: "/#services", label: "Services" },
    { href: "/appointments", label: "Appointments" },
    { href: "/pharmacy", label: "Pharmacy" },
    { href: "/track-order", label: "Track Order" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/donate", label: "Donate" },
    { href: "/#contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.includes(href.replace("#", ""));
  };

  return (
    <nav 
      className={`bg-white shadow-sm sticky z-40 ${isToolbarVisible ? "top-16" : "top-0"}`}
      role="navigation" 
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
              <Heart className="w-8 h-8" />
              <span>HealthCare Plus</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                item.href.startsWith("/#") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection(item.href);
                    }}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      isActive(item.href)
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive(item.href)
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                item.href.startsWith("/#") ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollToSection(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 text-base font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
