export interface Evaluation {
  id: number;
  submission_id: number;
  understanding: boolean;
  concept: boolean;
  method: boolean;
  execution_json: Record<string, boolean>;
  memory: boolean;
  error_reason: string;
  created_at: string;
}
