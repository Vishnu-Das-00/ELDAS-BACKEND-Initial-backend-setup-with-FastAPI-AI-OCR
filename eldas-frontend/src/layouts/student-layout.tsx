import { DashboardLayout } from "@/layouts/dashboard-layout";
import { dashboardThemes } from "@/utils/dashboard-theme";
import { navigationByRole } from "@/utils/navigation";

export function StudentLayout() {
  return (
    <DashboardLayout
      title="Student learning space"
      description="See your classrooms, submit work, and follow the cognitive feedback behind each evaluation."
      items={navigationByRole.student}
      theme={dashboardThemes.student}
    />
  );
}
