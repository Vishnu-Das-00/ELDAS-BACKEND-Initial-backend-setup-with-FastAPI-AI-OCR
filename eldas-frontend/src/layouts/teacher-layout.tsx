import { DashboardLayout } from "@/layouts/dashboard-layout";
import { dashboardThemes } from "@/utils/dashboard-theme";
import { navigationByRole } from "@/utils/navigation";

export function TeacherLayout() {
  return (
    <DashboardLayout
      title="Teacher command center"
      description="Create classrooms, design tests, and keep an eye on concept-level weakness across your sections."
      items={navigationByRole.teacher}
      theme={dashboardThemes.teacher}
    />
  );
}
