import type { UserRole } from "@/types/auth";

export const roleLabels: Record<UserRole, string> = {
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export function getDefaultRouteForRole(role: UserRole) {
  switch (role) {
    case "teacher":
      return "/teacher";
    case "student":
      return "/student";
    case "parent":
      return "/parent";
    default:
      return "/login";
  }
}
