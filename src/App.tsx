import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ChangePassword from "./pages/auth/ChangePassword";

import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import SellerDashboard from "./pages/dashboard/SellerDashboard";
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import IndustryDashboard from "./pages/dashboard/IndustryDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import Pricing from "./pages/Pricing";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

// Info Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Careers from "./pages/Careers";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Trends from "./pages/Trends";

// Seller Pages
import SellerProducts from "./pages/seller/Products";
import ProductForm from "./pages/seller/ProductForm";
import SellerPrices from "./pages/seller/Prices";

// Price Pages
import PriceList from "./pages/prices/PriceList";
import MarketComparison from "./pages/prices/MarketComparison";

// Messages
import Messages from "./pages/messages/Messages";

// Industry
import ProductApprovals from "./pages/industry/ProductApprovals";

// Admin
import AdminPanel from "./pages/admin/AdminPanel";
import SystemOverview from "./pages/admin/SystemOverview";
import UserCredentials from "./pages/admin/UserCredentials";
import AuditLog from "./pages/admin/AuditLog";
import DataManagement from "./pages/admin/DataManagement";
import DeletedItems from "./pages/admin/DeletedItems";
import IndustryCategoryAssignment from "./pages/admin/IndustryCategoryAssignment";
 import AdminPriceTrends from "./pages/admin/PriceTrends";
import Settings from "./pages/settings/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <AnimatedBackground />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/prices" element={<PriceList />} />
            <Route path="/markets" element={<MarketComparison />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/seller"
              element={
                <ProtectedRoute allowedRoles={["seller", "admin"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/seller/products"
              element={
                <ProtectedRoute allowedRoles={["seller", "admin"]}>
                  <SellerProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/seller/products/new"
              element={
                <ProtectedRoute allowedRoles={["seller", "admin"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/seller/products/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["seller", "admin"]}>
                  <ProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/seller/prices"
              element={
                <ProtectedRoute allowedRoles={["seller", "admin"]}>
                  <SellerPrices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/buyer"
              element={
                <ProtectedRoute allowedRoles={["buyer", "admin"]}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/industry"
              element={
                <ProtectedRoute allowedRoles={["industry", "admin"]}>
                  <IndustryDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/industry/approvals"
              element={
                <ProtectedRoute allowedRoles={["industry", "admin"]}>
                  <ProductApprovals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/system"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SystemOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/credentials"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserCredentials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-log"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AuditLog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DataManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/deleted"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DeletedItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/industry-categories"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <IndustryCategoryAssignment />
                </ProtectedRoute>
              }
            />
             <Route
               path="/admin/price-trends"
               element={
                 <ProtectedRoute allowedRoles={["admin"]}>
                   <AdminPriceTrends />
                 </ProtectedRoute>
               }
             />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
