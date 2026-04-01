import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { ErrorBoundary } from "@/components/feedback/error-boundary";
import { useSessionBootstrap } from "@/hooks/use-session-bootstrap";
import { queryClient } from "@/lib/query-client";

function Bootstrap({ children }: PropsWithChildren) {
  useSessionBootstrap();
  return children;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Bootstrap>{children}</Bootstrap>
        <Toaster richColors position="top-right" closeButton />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
