import type { PropsWithChildren } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/navigation/app-header";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/auth-store";
import { useUiStore } from "@/store/ui-store";
import type { DashboardTheme } from "@/types/theme";
import type { NavigationItem } from "@/utils/navigation";

interface DashboardLayoutProps extends PropsWithChildren {
  title: string;
  description: string;
  items: NavigationItem[];
  theme: DashboardTheme;
}

export function DashboardLayout({ title, description, items, theme, children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-eldas-grid px-4 py-4 md:px-6 md:py-6">
      <div className={cn("relative mx-auto flex max-w-7xl gap-6", theme.shellGlow)}>
        <AppSidebar items={items} theme={theme} />
        <MobileNav open={sidebarOpen} items={items} theme={theme} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1">
          <AppHeader
            title={title}
            description={description}
            user={user}
            theme={theme}
            onMenuOpen={() => setSidebarOpen(true)}
            onLogout={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          />
          <div className="relative mt-6 space-y-8">{children ?? <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
