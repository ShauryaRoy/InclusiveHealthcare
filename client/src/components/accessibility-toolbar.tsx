import { useAccessibility } from "@/hooks/use-accessibility";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Palette, Languages, X } from "lucide-react";

export default function AccessibilityToolbar() {
  const {
    isToolbarVisible,
    setToolbarVisible,
    isHighContrast,
    toggleHighContrast,
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    language,
    setLanguage,
  } = useAccessibility();

  if (!isToolbarVisible) {
    return (
      <Button
        onClick={() => setToolbarVisible(true)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white"
        aria-label="Open accessibility options"
      >
        <span className="sr-only">Accessibility Options</span>
        🔧
      </Button>
    );
  }

  return (
    <div 
      className="bg-gray-100 border-b border-gray-200 py-3 px-4 fixed top-0 left-0 right-0 z-50"
      role="toolbar"
      aria-label="Accessibility controls"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Accessibility:</span>
          
          <Button
            onClick={toggleHighContrast}
            variant={isHighContrast ? "default" : "outline"}
            size="sm"
            aria-pressed={isHighContrast}
            aria-label="Toggle high contrast mode"
          >
            <Palette className="w-4 h-4 mr-2" />
            High Contrast
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Font Size:</span>
            <Button
              onClick={decreaseFontSize}
              variant="outline"
              size="sm"
              disabled={fontSize === "small"}
              aria-label="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {fontSize === "small" ? "Small" : fontSize === "medium" ? "Medium" : fontSize === "large" ? "Large" : "X-Large"}
            </span>
            <Button
              onClick={increaseFontSize}
              variant="outline"
              size="sm"
              disabled={fontSize === "xlarge"}
              aria-label="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-700" />
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue aria-label="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          onClick={() => setToolbarVisible(false)}
          variant="ghost"
          size="sm"
          aria-label="Close accessibility toolbar"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
