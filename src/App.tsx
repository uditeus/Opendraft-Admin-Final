import * as React from "react";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n/i18n";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useRadixScrollLockFix } from "@/hooks/use-radix-fix";

import { ChatApp } from "@/components/chat/ChatApp";
import Index from "./pages/Index";
import NewPage from "./pages/New";
import LibraryPage from "./pages/Library";
import DraftsPage from "./pages/Drafts";
import AppsPage from "./pages/Apps";
import AppDetailsPage from "./pages/apps/AppDetailsPage";
import ProjectsPage from "./pages/Projects";
import WorkspacePage from "./pages/workspace/Workspace";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Onboarding from "./pages/Onboarding";
import PricingPage from "./pages/Pricing";
import UpgradePage from "./pages/Upgrade";

import { ChatLayout } from "@/components/chat/ChatLayout";

const queryClient = new QueryClient();

const App = () => {
  useRadixScrollLockFix();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="lovable-chat-theme"
      >
        <I18nProvider>
          <TooltipProvider>
            <Sonner position="top-center" />
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/signup" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Index />} />

                {/* Onboarding */}
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected routes */}
                <Route
                  element={
                    <AuthGuard>
                      <ChatLayout />
                    </AuthGuard>
                  }
                >
                  <Route path="/new" element={<ChatApp />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/playbooks" element={<AppsPage />} />
                  <Route path="/apps" element={<AppsPage />} />
                  <Route path="/apps/:appId" element={<AppDetailsPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/chat/:id" element={<ChatApp />} />
                </Route>

                {/* Upgrade — no sidebar */}
                <Route
                  path="/upgrade"
                  element={
                    <AuthGuard>
                      <UpgradePage />
                    </AuthGuard>
                  }
                />

                <Route path="/pricing" element={<PricingPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
