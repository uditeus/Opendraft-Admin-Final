import * as React from "react";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { RoleGuard } from "@/components/admin/RoleGuard";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminSubscriptions from "@/pages/admin/AdminSubscriptions";
import AdminApiUsage from "@/pages/admin/AdminApiUsage";
import AdminFinancials from "@/pages/admin/AdminFinancials";
import AdminGrowth from "@/pages/admin/AdminGrowth";
import AdminProduct from "@/pages/admin/AdminProduct";
import AdminEconomics from "@/pages/admin/AdminEconomics";
import AdminLogs from "@/pages/admin/AdminLogs";
import AdminTechnicalLogs from "@/pages/admin/AdminTechnicalLogs";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminTickets from "@/pages/admin/AdminTickets";
import AdminRealtime from "@/pages/admin/AdminRealtime";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminUserActivity from "@/pages/admin/AdminUserActivity";
import AdminUserSecurity from "@/pages/admin/AdminUserSecurity";
import AdminAiCosts from "@/pages/admin/AdminAiCosts";
import AdminAiModels from "@/pages/admin/AdminAiModels";
import AdminAiLimits from "@/pages/admin/AdminAiLimits";
import AdminDevKnowledge from "@/pages/admin/AdminDevKnowledge";
import AdminDevExperiments from "@/pages/admin/AdminDevExperiments";
import AdminDevQueues from "@/pages/admin/AdminDevQueues";
import AdminMaintenance from "@/pages/admin/AdminMaintenance";
import AdminRetention from "@/pages/admin/AdminRetention";

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

                {/* Admin routes (unified) */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="realtime" element={<AdminRealtime />} />
                    <Route path="events" element={<AdminEvents />} />

                    <Route path="users" element={<AdminUsers />} />
                    <Route path="users/:id" element={<AdminUserDetail />} />
                    <Route path="users/activity" element={<AdminUserActivity />} />
                    <Route path="users/security" element={<AdminUserSecurity />} />
                    <Route path="tickets" element={<AdminTickets />} />

                    <Route path="api-usage" element={<AdminApiUsage />} />
                    <Route path="api-usage/costs" element={<AdminAiCosts />} />
                    <Route path="api-usage/models" element={<AdminAiModels />} />
                    <Route path="api-usage/limits" element={<AdminAiLimits />} />

                    <Route path="product" element={<AdminProduct />} />
                    <Route path="analytics/retention" element={<AdminRetention />} />

                    <Route path="logs" element={<AdminLogs />} />
                    <Route
                      path="logs/technical"
                      element={
                        <RoleGuard requires="dev" fallback={<Navigate to="/admin" replace />}>
                          <AdminTechnicalLogs />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="system/maintenance"
                      element={
                        <RoleGuard requires="dev" fallback={<Navigate to="/admin" replace />}>
                          <AdminMaintenance />
                        </RoleGuard>
                      }
                    />

                    <Route
                      path="settings"
                      element={
                        <RoleGuard requires="dev" fallback={<Navigate to="/admin" replace />}>
                          <AdminSettings />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="developer/knowledge"
                      element={
                        <RoleGuard requires="dev" fallback={<Navigate to="/admin" replace />}>
                          <AdminDevKnowledge />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="developer/experiments"
                      element={
                        <RoleGuard requires="dev" fallback={<Navigate to="/admin" replace />}>
                          <AdminDevExperiments />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="developer/queues"
                      element={
                        <RoleGuard requires="dev" fallback={<Navigate to="/admin" replace />}>
                          <AdminDevQueues />
                        </RoleGuard>
                      }
                    />

                    <Route
                      path="financials"
                      element={
                        <RoleGuard requires="owner" fallback={<Navigate to="/admin" replace />}>
                          <AdminFinancials />
                        </RoleGuard>
                      }
                    />
                    <Route path="subscriptions" element={<AdminSubscriptions />} />
                    <Route
                      path="growth"
                      element={
                        <RoleGuard requires="owner" fallback={<Navigate to="/admin" replace />}>
                          <AdminGrowth />
                        </RoleGuard>
                      }
                    />
                    <Route
                      path="economics"
                      element={
                        <RoleGuard requires="owner" fallback={<Navigate to="/admin" replace />}>
                          <AdminEconomics />
                        </RoleGuard>
                      }
                    />
                  </Route>
                </Route>

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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
