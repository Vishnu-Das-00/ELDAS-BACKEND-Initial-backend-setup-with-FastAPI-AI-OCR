import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookText, ChartScatter, NotebookPen } from "lucide-react";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { SubmissionPanel } from "@/features/submissions/submission-panel";
import { useClassrooms } from "@/hooks/use-classrooms";
import { getSubmissionsByStudent } from "@/services/submission-service";
import { getTestsByClass } from "@/services/test-service";
import { useAuthStore } from "@/store/auth-store";
import { formatDateTime } from "@/utils/format";

export function StudentTestDetailPage() {
  const params = useParams();
  const classId = Number(params.classId);
  const testId = Number(params.testId);
  const user = useAuthStore((state) => state.user);
  const classroomsQuery = useClassrooms();
  const testsQuery = useQuery({
    queryKey: ["tests", classId],
    queryFn: () => getTestsByClass(classId),
    enabled: Number.isFinite(classId),
  });
  const submissionsQuery = useQuery({
    queryKey: ["submissions", user?.id],
    queryFn: () => getSubmissionsByStudent(user!.id),
    enabled: Boolean(user?.id),
  });

  const classroom = useMemo(
    () => classroomsQuery.data?.find((item) => item.id === classId) ?? null,
    [classId, classroomsQuery.data],
  );
  const test = useMemo(
    () => testsQuery.data?.find((item) => item.id === testId) ?? null,
    [testId, testsQuery.data],
  );
  const testSubmissions = (submissionsQuery.data ?? []).filter((submission) => submission.test_id === testId);

  if (classroomsQuery.isLoading || testsQuery.isLoading || submissionsQuery.isLoading) {
    return <PageLoader label="Loading test detail..." />;
  }
  if (classroomsQuery.isError) {
    return <ErrorPanel message={classroomsQuery.error.message} onRetry={() => classroomsQuery.refetch()} />;
  }
  if (testsQuery.isError) {
    return <ErrorPanel message={testsQuery.error.message} onRetry={() => testsQuery.refetch()} />;
  }
  if (submissionsQuery.isError) {
    return <ErrorPanel message={submissionsQuery.error.message} onRetry={() => submissionsQuery.refetch()} />;
  }
  if ((!classroom || !test || !user) && (classroomsQuery.isFetching || testsQuery.isFetching || submissionsQuery.isFetching)) {
    return <PageLoader label="Refreshing test detail..." />;
  }
  if (!classroom || !test || !user) {
    return <ErrorPanel message="This test detail is not available right now." />;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Test detail"
        title={`${test.subject} - ${test.chapter}`}
        description={`Review each question, understand the expected concepts, and submit your work for ${classroom.name}.`}
        actions={
          <Link
            to={`/student/classrooms/${classId}`}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Back to classroom
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Classroom"
          value={classroom.name}
          helper={`Teacher ${classroom.teacher.name}`}
          icon={<BookText className="h-5 w-5" />}
          accentClassName="bg-sky-100 text-sky-700"
        />
        <StatCard
          label="Question blocks"
          value={String(test.questions.length)}
          helper="Structured prompts in this test"
          icon={<NotebookPen className="h-5 w-5" />}
          accentClassName="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Attempts"
          value={String(testSubmissions.length)}
          helper="Your submissions for this test"
          icon={<ChartScatter className="h-5 w-5" />}
          accentClassName="bg-indigo-100 text-indigo-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-gradient-to-br from-white/96 to-sky-50/55">
          <p className="eyebrow">Question detail</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">Read the full prompt set before you submit</h3>
          <div className="mt-6 grid gap-5">
            {test.questions.map((question, index) => (
              <Card key={question.id} className="border border-slate-100 bg-white/90">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone="accent">Question {index + 1}</Badge>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {question.subject} / {question.chapter}
                  </p>
                </div>
                <p className="mt-4 text-base font-semibold leading-7 text-ink">{question.text}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {question.concepts.map((concept) => (
                    <Badge key={`${question.id}-concept-${concept}`}>{concept}</Badge>
                  ))}
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Suggested steps</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.steps.map((step) => (
                        <Badge key={`${question.id}-step-${step}`} tone="warning">
                          {step}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Calculation types</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {question.calculation_types.map((type) => (
                        <Badge key={`${question.id}-calc-${type}`} tone="success">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <SubmissionPanel test={test} studentId={user.id} />
          <Card className="bg-gradient-to-br from-white/96 to-indigo-50/55">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Previous submissions</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">Attempt history</h3>
              </div>
              <Badge tone="accent">{testSubmissions.length} attempts</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {testSubmissions.length ? (
                testSubmissions.map((submission) => (
                  <div key={submission.id} className="rounded-3xl border border-slate-200 bg-white px-5 py-4" data-testid="test-attempt-item">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">Submission #{submission.id}</p>
                        <p className="mt-2 text-sm text-slate-500">{formatDateTime(submission.created_at)}</p>
                      </div>
                      <Badge data-testid={`test-attempt-status-${submission.id}`}>{submission.status}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Your attempts for this test will appear here after you submit.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
