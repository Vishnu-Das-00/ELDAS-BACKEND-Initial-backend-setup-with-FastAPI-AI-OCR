export interface Question {
  id: number;
  test_id: number;
  text: string;
  subject: string;
  chapter: string;
  concepts: string[];
  steps: string[];
  calculation_types: string[];
}

export interface Test {
  id: number;
  class_id: number;
  subject: string;
  chapter: string;
  questions: Question[];
}
