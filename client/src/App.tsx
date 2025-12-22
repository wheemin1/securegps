import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <PWAUpdatePrompt />
        <PWAInstallPrompt />
        <Router />
      </TooltipProvider>
    </LanguageProvider>
  );
}

export default App;
