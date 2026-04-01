import { useEffect } from "react";

import { useAuthStore } from "@/store/auth-store";

export function useSessionBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const markHydrated = useAuthStore((state) => state.markHydrated);

  useEffect(() => {
    if (!hydrated) {
      const timer = window.setTimeout(() => markHydrated(true), 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [hydrated, markHydrated]);
}
