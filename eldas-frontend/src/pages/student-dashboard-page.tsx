import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock3, Compass, FileDigit, GraduationCap, Rocket, ScanText, Sparkles } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { InsightStrip } from "@/components/dashboard/insight-strip";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { StatCard } from "@/components/stat-card";
import { JoinClassroomForm } from "@/features/classrooms/join-classroom-form";
import { ProgressOverview } from "@/features/progress/progress-overview";
import { SubmissionPanel } from "@/features/submissions/submission-panel";
import { useClassrooms } from "@/hooks/use-classrooms";
import { getTestsByClass } from "@/services/test-service";
import { getProgress, getSubmissionsByStudent } from "@/services/submission-service";
import { useAuthStore } from "@/store/auth-store";
import type { SubmissionStatus } from "@/types/submission";
import { dashboardThemes } from "@/utils/dashboard-theme";
import { formatDateTime, titleCase } from "@/utils/format";

const statusTone: Record<SubmissionStatus, "neutral" | "warning" | "success" | "danger"> = {
  pending: "warning",
  processing: "warning",
  completed: "success",
  failed: "danger",
};

export function StudentDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const classroomsQuery = useClassrooms();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

  useEffect(() => {
    if (!selectedClassId && classroomsQuery.data?.length) {
      setSelectedClassId(classroomsQuery.data[0].id);
    }
  }, [classroomsQuery.data, selectedClassId]);

  const testsQuery = useQuery({
    queryKey: ["tests", selectedClassId],
    queryFn: () => getTestsByClass(selectedClassId!),
    enabled: Boolean(selectedClassId),
  });

  useEffect(() => {
    if (!selectedTestId && testsQuery.data?.length) {
      setSelectedTestId(testsQuery.data[0].id);
    }
  }, [selectedTestId, testsQuery.data]);

  const submissionsQuery = useQuery({
    queryKey: ["submissions", user?.id],
    queryFn: () => getSubmissionsByStudent(user!.id),
    enabled: Boolean(user?.id),
    refetchInterval: (query) => {
      const submissions = query.state.data ?? [];
      return submissions.some((submission) => submission.status === "pending" || submission.status === "processing")
        ? 7000
        : false;
    },
  });

  const progressQuery = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => getProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const selectedTest = useMemo(
    () => testsQuery.data?.find((test) => test.id === selectedTestId) ?? null,
    [selectedTestId, testsQuery.data],
  );

  const selectedSubmission = useMemo(
    () => submissionsQuery.data?.find((submission) => submission.id === selectedSubmissionId) ?? null,
    [selectedSubmissionId, submissionsQuery.data],
  );

  if (!user) {
    return <PageLoader label="Loading your workspace..." />;
  }

  if (classroomsQuery.isLoading) {
    return <PageLoader label="Loading classrooms..." />;
  }

  if (classroomsQuery.isError) {
    return <ErrorPanel message={classroomsQuery.error.message} onRetry={() => classroomsQuery.refetch()} />;
  }

  const classrooms = classroomsQuery.data ?? [];
  const activeSubmissionCount =
    submissionsQuery.data?.filter((submission) => submission.status === "pending" || submission.status === "processing").length ?? 0;

  return (
    <div className="space-y-8">
      <DashboardHero
        theme={dashboardThemes.student}
        eyebrow="Student dashboard"
        title="Know what to work on next, and why it matters."
        description="Your Eldas workspace keeps classrooms, tests, submissions, and cognitive feedback in one flow so you can focus on improving, not hunting for context."
        icon={<Rocket className="h-7 w-7" />}
        metrics={[
          { label: "Classrooms", value: String(classrooms.length) },
          { label: "Submissions", value: String(submissionsQuery.data?.length ?? 0) },
          { label: "In progress", value: String(activeSubmissionCount) },
        ]}
        chips={[
          `Student ID #${user.id}`,
          selectedTest ? `Focused test: ${selectedTest.subject}` : "Select a test to start",
          "Image and text submissions",
          "Live evaluation updates",
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <InsightStrip
          title="Pick the next best class"
          description="Use your class list to switch context quickly and keep test selection tied to the teacher and subject you are working on."
          icon={<Compass className="h-5 w-5" />}
        />
        <InsightStrip
          title="Submit however you work"
          description="Type your reasoning, upload handwritten steps, or combine both so the cognitive engine sees the thinking behind the answer."
          icon={<Sparkles className="h-5 w-5" />}
        />
        <InsightStrip
          title="Read the feedback properly"
          description="Evaluation cards show where understanding, concept recall, method choice, and execution are breaking down."
          icon={<ScanText className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Classrooms"
          value={String(classrooms.length)}
          helper="Current enrollments"
          icon={<GraduationCap />}
          accentClassName="bg-sky-100 text-sky-700"
        />
        <StatCard
          label="Submissions"
          value={String(submissionsQuery.data?.length ?? 0)}
          helper="Total work sent for evaluation"
          icon={<FileDigit />}
          accentClassName="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Progress subjects"
          value={String(progressQuery.data?.length ?? 0)}
          helper="Subjects with cognitive tracking"
          icon={<ScanText />}
          accentClassName="bg-blue-100 text-blue-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white/96 to-indigo-50/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Student profile</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">Keep your ID handy for family linking</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Parents can link to your progress with this ID, and teachers can use it to confirm the correct learner record.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-indigo-100 bg-white px-5 py-4 text-right shadow-sm" data-testid="student-id-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Student ID</p>
                <p className="mt-2 font-display text-4xl font-bold text-ink" data-testid="student-id-value">
                  {user.id}
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white/96 to-sky-50/70">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Join classroom</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">Add a new class with a join code</h3>
              </div>
              <Badge tone="accent">Student only</Badge>
            </div>
            <div className="mt-5">
              <JoinClassroomForm />
            </div>
          </Card>

          {!classrooms.length ? (
            <EmptyState
              title="No classrooms joined yet"
              description="Use the join code from your teacher to connect your account to a classroom and unlock tests."
            />
          ) : (
            <Card className="bg-gradient-to-br from-white/96 to-sky-50/55">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Your classes</p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-ink">Enrolled classrooms</h3>
                </div>
                <Badge tone="accent">{classrooms.length} active</Badge>
              </div>
              <div className="mt-5 grid gap-4">
                {classrooms.map((classroom) => (
                  <Card
                    key={classroom.id}
                    className={`rounded-3xl border p-5 text-left transition ${
                      selectedClassId === classroom.id
                        ? "border-sky-300 bg-sky-50"
                        : "border-slate-200 bg-slate-50/70 hover:border-tide/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <button type="button" onClick={() => setSelectedClassId(classroom.id)} className="flex-1 text-left">
                        <h4 className="font-display text-xl font-bold text-ink">{classroom.name}</h4>
                        <p className="mt-2 text-sm text-slate-500">Teacher: {classroom.teacher.name}</p>
                      </button>
                      <div className="flex items-center gap-3">
                        <Badge>{classroom.join_code}</Badge>
                        <Link
                          to={`/student/classrooms/${classroom.id}`}
                          className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-ink transition hover:bg-white"
                        >
                          View detail
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}

          <ProgressOverview progress={progressQuery.data ?? []} />
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white/96 to-emerald-50/55">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Tests</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">Available assessments</h3>
              </div>
              <Badge tone="accent">{testsQuery.data?.length ?? 0} tests</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {testsQuery.isLoading ? (
                <PageLoader label="Loading tests..." />
              ) : testsQuery.isError ? (
                <ErrorPanel message={testsQuery.error.message} onRetry={() => testsQuery.refetch()} />
              ) : testsQuery.data?.length ? (
                testsQuery.data.map((test) => (
                  <Card
                    key={test.id}
                    className={`w-full rounded-3xl border p-5 text-left transition ${
                      selectedTestId === test.id
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-slate-200 bg-slate-50/70 hover:border-tide/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <button type="button" onClick={() => setSelectedTestId(test.id)} className="flex-1 text-left">
                        <h4 className="font-display text-xl font-bold text-ink">
                          {test.subject} - {test.chapter}
                        </h4>
                        <p className="mt-2 text-sm text-slate-500">{test.questions.length} question blocks</p>
                      </button>
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-tide" />
                        {selectedClassId ? (
                          <Link
                            to={`/student/classrooms/${selectedClassId}/tests/${test.id}`}
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-ink transition hover:bg-white"
                          >
                            Open detail
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-slate-500">No tests published for the selected classroom yet.</p>
              )}
            </div>
          </Card>

          {selectedTest ? <SubmissionPanel test={selectedTest} studentId={user.id} /> : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-white/96 to-slate-50/70">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Submission history</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">Track evaluation status</h3>
            </div>
            <Button variant="outline" onClick={() => submissionsQuery.refetch()}>
              Refresh
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {submissionsQuery.isLoading ? (
              <PageLoader label="Loading submissions..." />
            ) : submissionsQuery.isError ? (
              <ErrorPanel message={submissionsQuery.error.message} onRetry={() => submissionsQuery.refetch()} />
            ) : submissionsQuery.data?.length ? (
              submissionsQuery.data.map((submission) => (
                <button
                  key={submission.id}
                  type="button"
                  onClick={() => setSelectedSubmissionId(submission.id)}
                  className={`w-full rounded-3xl border p-5 text-left transition ${
                    selectedSubmissionId === submission.id
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-slate-200 bg-slate-50/70 hover:border-tide/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">Submission #{submission.id}</p>
                      <p className="mt-2 text-sm text-slate-500">{formatDateTime(submission.created_at)}</p>
                    </div>
                    <Badge tone={statusTone[submission.status]}>{titleCase(submission.status)}</Badge>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">Your submissions will appear here after you upload work.</p>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white/96 to-indigo-50/65">
          <p className="eyebrow">Evaluation details</p>
          <h3 className="mt-2 font-display text-2xl font-bold text-ink">Cognitive feedback</h3>
          {selectedSubmission?.evaluation ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Badge tone={selectedSubmission.evaluation.understanding ? "success" : "danger"}>
                  Understanding: {selectedSubmission.evaluation.understanding ? "Strong" : "Needs work"}
                </Badge>
                <Badge tone={selectedSubmission.evaluation.concept ? "success" : "danger"}>
                  Concept: {selectedSubmission.evaluation.concept ? "Strong" : "Needs work"}
                </Badge>
                <Badge tone={selectedSubmission.evaluation.method ? "success" : "danger"}>
                  Method: {selectedSubmission.evaluation.method ? "Strong" : "Needs work"}
                </Badge>
                <Badge tone={selectedSubmission.evaluation.memory ? "success" : "danger"}>
                  Memory: {selectedSubmission.evaluation.memory ? "Strong" : "Needs work"}
                </Badge>
              </div>
              <div className="rounded-3xl bg-slate-50/80 p-5">
                <p className="text-sm font-semibold text-ink">Execution breakdown</p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600">
                  {Object.entries(selectedSubmission.evaluation.execution_json).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span>{titleCase(key)}</span>
                      <strong>{value ? "Correct" : "Needs support"}</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50/80 p-5">
                <p className="text-sm font-semibold text-ink">Error reason</p>
                <p className="mt-2 text-sm text-slate-600">{selectedSubmission.evaluation.error_reason || "No blocking error detected."}</p>
              </div>
            </div>
          ) : selectedSubmission ? (
            <div className="mt-5 rounded-3xl bg-slate-50/80 p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-sunrise" />
                <p className="text-sm font-medium text-slate-600">
                  {selectedSubmission.status === "failed"
                    ? "Evaluation failed for this submission. Try resubmitting with clearer text or a cleaner image."
                    : "This evaluation is still processing. Eldas will update it automatically."}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl bg-slate-50/80 p-5 text-sm text-slate-500">
              Select a submission to inspect its evaluation breakdown.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
