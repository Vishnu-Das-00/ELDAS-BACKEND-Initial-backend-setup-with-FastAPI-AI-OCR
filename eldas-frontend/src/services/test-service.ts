import { apiClient } from "@/lib/api-client";
import type { Test } from "@/types/test";

export interface TestBuilderQuestionPayload {
  text: string;
  subject: string;
  chapter: string;
  concepts: string[];
  steps: string[];
  calculation_types: string[];
}

export interface CreateTestPayload {
  class_id: number;
  subject: string;
  chapter: string;
  questions: TestBuilderQuestionPayload[];
}

export async function createTest(payload: CreateTestPayload) {
  const { data } = await apiClient.post<Test>("/test/create", payload);
  return data;
}

export async function getTestsByClass(classId: number) {
  const { data } = await apiClient.get<Test[]>(`/test/${classId}`);
  return data;
}
