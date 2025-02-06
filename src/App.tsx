import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Subscriptions from "./pages/Subscriptions";
import Marketplace from "./pages/Marketplace";
import Insights from "./pages/Insights";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import BudgetGoals from "./pages/BudgetGoals";
import SubscriptionSharing from "./pages/SubscriptionSharing";
import CompareServices from "./pages/CompareServices";
import Account from "./pages/Account";
import Billing from "./pages/Billing";
import Security from "./pages/Security";
import Reports from "./pages/Reports";
import { AppSidebar } from "./components/layout/AppSidebar";
import { AccountButton } from "./components/layout/AccountButton";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Redirect root to landing page */}
              <Route path="/" element={<Navigate to="/landing" replace />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected app routes with sidebar layout */}
              <Route
                path="/app/*"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <div className="flex min-h-screen w-full">
                        <AppSidebar />
                        <main className="flex-1 p-6">
                          <div className="flex justify-end mb-6">
                            <AccountButton />
                          </div>
                          <Routes>
                            <Route index element={<Index />} />
                            <Route path="subscriptions" element={<Subscriptions />} />
                            <Route path="marketplace" element={<Marketplace />} />
                            <Route path="insights" element={<Insights />} />
                            <Route path="alerts" element={<Alerts />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="budget-goals" element={<BudgetGoals />} />
                            <Route path="subscription-sharing" element={<SubscriptionSharing />} />
                            <Route path="compare-services" element={<CompareServices />} />
                            <Route path="account" element={<Account />} />
                            <Route path="security" element={<Security />} />
                            <Route path="billing" element={<Billing />} />
                            <Route path="reports" element={<Reports />} />
                          </Routes>
                        </main>
                      </div>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;