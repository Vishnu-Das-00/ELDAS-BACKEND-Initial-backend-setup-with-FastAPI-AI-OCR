export interface ProgressRecord {
  student_id: number;
  subject: string;
  skill_scores: {
    attempts?: number;
    averages?: {
      understanding?: number;
      concept?: number;
      method?: number;
      memory?: number;
      execution?: Record<string, number>;
    };
  };
  updated_at: string;
}
