import { useMemo } from "react";

import { useAuthStore } from "@/store/auth-store";

export function useAuth() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const logout = useAuthStore((state) => state.logout);
  const setSession = useAuthStore((state) => state.setSession);

  return useMemo(
    () => ({
      token,
      role,
      user,
      hydrated,
      isAuthenticated: Boolean(token && user),
      logout,
      setSession,
    }),
    [hydrated, logout, role, setSession, token, user],
  );
}
