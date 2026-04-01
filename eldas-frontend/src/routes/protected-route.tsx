import { Navigate, Outlet, useLocation } from "react-router-dom";

import { PageLoader } from "@/components/feedback/page-loader";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";
import { getDefaultRouteForRole } from "@/utils/roles";

interface ProtectedRouteProps {
  roles?: UserRole[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { hydrated, isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!hydrated) {
    return <PageLoader label="Restoring your workspace..." />;
  }

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to={getDefaultRouteForRole(role)} replace />;
  }

  return <Outlet />;
}
