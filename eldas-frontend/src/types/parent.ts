export interface ParentPerformanceItem {
  submission_id: number;
  subject: string;
  chapter: string;
  score: number;
  error_reason: string;
}

export interface ParentDashboardResponse {
  student_id: number;
  progress: Array<{
    subject: string;
    skill_scores: {
      attempts?: number;
      averages?: Record<string, number | Record<string, number> | undefined>;
    };
    updated_at: string;
  }>;
  recent_performance: ParentPerformanceItem[];
  warnings: string[];
}
