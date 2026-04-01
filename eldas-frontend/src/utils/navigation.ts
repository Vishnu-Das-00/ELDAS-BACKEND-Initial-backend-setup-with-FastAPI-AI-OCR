import { Bell, BookCheck, BookOpenText, ChartColumnIncreasing, LayoutDashboard, School2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { UserRole } from "@/types/auth";

export interface NavigationItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  teacher: [
    { label: "Dashboard", to: "/teacher", icon: LayoutDashboard },
    { label: "Test Builder", to: "/teacher/tests", icon: BookCheck },
    { label: "Notifications", to: "/notifications", icon: Bell },
  ],
  student: [
    { label: "Dashboard", to: "/student", icon: LayoutDashboard },
    { label: "Learning", to: "/student", icon: School2 },
    { label: "Notifications", to: "/notifications", icon: Bell },
  ],
  parent: [
    { label: "Dashboard", to: "/parent", icon: ChartColumnIncreasing },
    { label: "Reports", to: "/parent", icon: BookOpenText },
    { label: "Notifications", to: "/notifications", icon: Bell },
  ],
};
