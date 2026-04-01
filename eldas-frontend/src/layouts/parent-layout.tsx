import { DashboardLayout } from "@/layouts/dashboard-layout";
import { dashboardThemes } from "@/utils/dashboard-theme";
import { navigationByRole } from "@/utils/navigation";

export function ParentLayout() {
  return (
    <DashboardLayout
      title="Parent progress view"
      description="Stay updated on your child's recent performance, weak areas, and the alerts that need attention."
      items={navigationByRole.parent}
      theme={dashboardThemes.parent}
    />
  );
}
