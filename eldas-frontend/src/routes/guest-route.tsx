import { Navigate, Outlet } from "react-router-dom";

import { PageLoader } from "@/components/feedback/page-loader";
import { useAuth } from "@/hooks/use-auth";
import { getDefaultRouteForRole } from "@/utils/roles";

export function GuestRoute() {
  const { hydrated, isAuthenticated, role } = useAuth();

  if (!hydrated) {
    return <PageLoader label="Preparing sign-in..." />;
  }

  if (isAuthenticated && role) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
}
