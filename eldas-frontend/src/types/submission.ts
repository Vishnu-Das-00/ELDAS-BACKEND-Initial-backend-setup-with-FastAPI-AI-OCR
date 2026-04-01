import type { Evaluation } from "@/types/evaluation";

export type SubmissionStatus = "pending" | "processing" | "completed" | "failed";

export interface Submission {
  id: number;
  student_id: number;
  test_id: number;
  answer_text: string | null;
  extracted_text: string | null;
  image_url: string | null;
  status: SubmissionStatus;
  created_at: string;
  evaluation?: Evaluation | null;
}
