import { apiClient } from "@/lib/api-client";
import type { Evaluation } from "@/types/evaluation";
import type { ProgressRecord } from "@/types/progress";
import type { Submission } from "@/types/submission";

export interface SubmissionPayload {
  testId: number;
  answerText?: string;
  imageFile?: File | null;
}

export async function uploadSubmission(payload: SubmissionPayload) {
  const formData = new FormData();
  formData.append("test_id", String(payload.testId));
  if (payload.answerText) {
    formData.append("answer_text", payload.answerText);
  }
  if (payload.imageFile) {
    formData.append("image_file", payload.imageFile);
  }

  const { data } = await apiClient.post<Submission>("/submission/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function getSubmissionsByStudent(studentId: number) {
  const { data } = await apiClient.get<Submission[]>(`/submission/${studentId}`);
  return data;
}

export async function getEvaluation(submissionId: number) {
  const { data } = await apiClient.get<Evaluation>(`/evaluation/${submissionId}`);
  return data;
}

export async function getProgress(studentId: number) {
  const { data } = await apiClient.get<ProgressRecord[]>(`/progress/${studentId}`);
  return data;
}
