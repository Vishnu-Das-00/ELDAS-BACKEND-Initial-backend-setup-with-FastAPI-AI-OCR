import { apiClient } from "@/lib/api-client";
import type { ApiMessage } from "@/types/api";
import type { Classroom, ClassroomDetail, TeacherDashboardResponse } from "@/types/classroom";

export async function createClassroom(name: string) {
  const { data } = await apiClient.post<Classroom>("/class/create", { name });
  return data;
}

export async function getMyClassrooms() {
  const { data } = await apiClient.get<ClassroomDetail[]>("/class/me");
  return data;
}

export async function joinClassroom(payload: { classroom_id?: number; join_code?: string }) {
  const { data } = await apiClient.post<Classroom>("/class/join", payload);
  return data;
}

export async function getTeacherClassroomOverview(classId: number) {
  const { data } = await apiClient.get<TeacherDashboardResponse>(`/teacher/class/${classId}`);
  return data;
}

export async function linkParentToStudent(studentId: number) {
  const { data } = await apiClient.post<ApiMessage>("/parent/link", { student_id: studentId });
  return data;
}
