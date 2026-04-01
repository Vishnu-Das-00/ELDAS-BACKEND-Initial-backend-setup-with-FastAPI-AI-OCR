import type { User } from "@/types/auth";
import { apiClient } from "@/lib/api-client";
import type { ParentDashboardResponse } from "@/types/parent";

export async function getLinkedStudents() {
  const { data } = await apiClient.get<User[]>("/parent/links");
  return data;
}

export async function getParentStudentDashboard(studentId: number) {
  const { data } = await apiClient.get<ParentDashboardResponse>(`/parent/student/${studentId}`);
  return data;
}
