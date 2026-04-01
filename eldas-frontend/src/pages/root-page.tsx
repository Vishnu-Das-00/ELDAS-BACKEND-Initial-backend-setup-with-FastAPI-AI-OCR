import { Navigate } from "react-router-dom";

import { PageLoader } from "@/components/feedback/page-loader";
import { useAuth } from "@/hooks/use-auth";
import { LandingPage } from "@/pages/landing-page";
import { getDefaultRouteForRole } from "@/utils/roles";

export function RootPage() {
  const { hydrated, role, isAuthenticated } = useAuth();

  if (!hydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated || !role) {
    return <LandingPage />;
  }

  return <Navigate to={getDefaultRouteForRole(role)} replace />;
}
