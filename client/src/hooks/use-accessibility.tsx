import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityContextType {
  isToolbarVisible: boolean;
  setToolbarVisible: (visible: boolean) => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: "small" | "medium" | "large" | "xlarge";
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  language: string;
  setLanguage: (language: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isToolbarVisible, setToolbarVisible] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large" | "xlarge">("medium");
  const [language, setLanguage] = useState("en");

  // Apply accessibility settings to document
  useEffect(() => {
    const body = document.body;
    
    // High contrast mode
    if (isHighContrast) {
      body.classList.add("high-contrast");
    } else {
      body.classList.remove("high-contrast");
    }

    // Font size
    body.classList.remove("font-size-small", "font-size-medium", "font-size-large", "font-size-xlarge");
    body.classList.add(`font-size-${fontSize}`);

    // Language
    document.documentElement.lang = language;
  }, [isHighContrast, fontSize, language]);

  // Load saved preferences
  useEffect(() => {
    const savedContrast = localStorage.getItem("accessibility-high-contrast");
    const savedFontSize = localStorage.getItem("accessibility-font-size") as typeof fontSize;
    const savedLanguage = localStorage.getItem("accessibility-language");

    if (savedContrast === "true") {
      setIsHighContrast(true);
    }
    if (savedFontSize && ["small", "medium", "large", "xlarge"].includes(savedFontSize)) {
      setFontSize(savedFontSize);
    }
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("accessibility-high-contrast", isHighContrast.toString());
    localStorage.setItem("accessibility-font-size", fontSize);
    localStorage.setItem("accessibility-language", language);
  }, [isHighContrast, fontSize, language]);

  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  const increaseFontSize = () => {
    setFontSize(current => {
      switch (current) {
        case "small": return "medium";
        case "medium": return "large";
        case "large": return "xlarge";
        default: return current;
      }
    });
  };

  const decreaseFontSize = () => {
    setFontSize(current => {
      switch (current) {
        case "xlarge": return "large";
        case "large": return "medium";
        case "medium": return "small";
        default: return current;
      }
    });
  };

  const value = {
    isToolbarVisible,
    setToolbarVisible,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    language,
    setLanguage,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
