import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Appointments from "@/pages/appointments";
import CaseStudies from "@/pages/case-studies";
import Donate from "@/pages/donate";
import Services from "@/components/services-section"
import NotFound from "@/pages/not-found";
import { AccessibilityProvider } from "@/hooks/use-accessibility";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/case-studies" component={CaseStudies} />
      <Route path="/donate" component={Donate} />
      <Route path="/services" component={Services} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground">
            {/* Skip to main content link */}
            <a
              href="#main-content"
              className="skip-to-main"
              aria-label="Skip to main content"
            >
              Skip to main content
            </a>
            <Router />
            <Toaster />
          </div>
        </TooltipProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
