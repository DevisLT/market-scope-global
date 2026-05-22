import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // First-time users see the futuristic onboarding tutorial
  const seenOnboarding =
    typeof window !== "undefined" && localStorage.getItem("priceflow_onboarding_seen") === "1";
  if (!seenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to role-specific dashboard
  switch (role) {
    case "seller":
      return <Navigate to="/dashboard/seller" replace />;
    case "buyer":
      return <Navigate to="/dashboard/buyer" replace />;
    case "industry":
      return <Navigate to="/dashboard/industry" replace />;
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    default:
      return <Navigate to="/dashboard/buyer" replace />;
  }
}
