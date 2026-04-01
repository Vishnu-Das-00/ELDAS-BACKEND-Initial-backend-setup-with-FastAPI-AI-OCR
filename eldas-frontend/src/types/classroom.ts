import type { User } from "@/types/auth";

export interface Classroom {
  id: number;
  name: string;
  teacher_id: number;
  join_code: string;
}

export interface ClassroomDetail extends Classroom {
  teacher: User;
  student_count: number;
}

export interface TeacherStudentSummary {
  student_id: number;
  student_name: string;
  average_score: number;
}

export interface WeakConceptSummary {
  concept: string;
  count: number;
}

export interface TeacherDashboardResponse {
  class_id: number;
  avg_class_scores: Record<string, number>;
  weak_concepts: WeakConceptSummary[];
  student_ranking: TeacherStudentSummary[];
  students_needing_attention: TeacherStudentSummary[];
}
