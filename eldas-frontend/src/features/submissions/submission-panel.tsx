import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { FileUploadField } from "@/components/file-upload-field";
import { Textarea } from "@/components/textarea";
import { uploadSubmission } from "@/services/submission-service";
import type { Test } from "@/types/test";

interface SubmissionPanelProps {
  test: Test;
  studentId: number;
}

export function SubmissionPanel({ test, studentId }: SubmissionPanelProps) {
  const queryClient = useQueryClient();
  const [answerText, setAnswerText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const questionCount = useMemo(() => test.questions.length, [test.questions.length]);

  const mutation = useMutation({
    mutationFn: () =>
      uploadSubmission({
        testId: test.id,
        answerText,
        imageFile,
      }),
    onSuccess: () => {
      toast.success("Submission uploaded. Eldas is processing the answer now.");
      setAnswerText("");
      setImageFile(null);
      void queryClient.invalidateQueries({ queryKey: ["submissions", studentId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="space-y-5" data-testid="submission-panel">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Submit work</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">
            {test.subject} - {test.chapter}
          </h3>
        </div>
        <Badge tone="accent">{questionCount} questions</Badge>
      </div>
      <Textarea
        placeholder="Type your answer, reasoning steps, and any assumptions you made..."
        value={answerText}
        onChange={(event) => setAnswerText(event.target.value)}
        data-testid="submission-answer-text"
      />
      <FileUploadField label="Optional handwritten image" file={imageFile} onChange={setImageFile} />
      <Button
        size="lg"
        className="w-full"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || (!answerText.trim() && !imageFile)}
        data-testid="submission-submit"
      >
        {mutation.isPending ? "Uploading..." : "Submit answer"}
      </Button>
    </Card>
  );
}
