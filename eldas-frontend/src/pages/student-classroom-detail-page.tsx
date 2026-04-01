import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, ScanText } from "lucide-react";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { useClassrooms } from "@/hooks/use-classrooms";
import { getProgress, getSubmissionsByStudent } from "@/services/submission-service";
import { getTestsByClass } from "@/services/test-service";
import { useAuthStore } from "@/store/auth-store";

export function StudentClassroomDetailPage() {
  const params = useParams();
  const classId = Number(params.classId);
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
  const progressQuery = useQuery({
    queryKey: ["progress", user?.id],
    queryFn: () => getProgress(user!.id),
    enabled: Boolean(user?.id),
  });

  const classroom = useMemo(
    () => classroomsQuery.data?.find((item) => item.id === classId) ?? null,
    [classId, classroomsQuery.data],
  );
  const classTests = testsQuery.data ?? [];
  const classSubmissions = (submissionsQuery.data ?? []).filter((submission) =>
    classTests.some((test) => test.id === submission.test_id),
  );
  const subjectSet = new Set(classTests.map((test) => test.subject));
  const classProgress = (progressQuery.data ?? []).filter((record) => subjectSet.has(record.subject));

  if (classroomsQuery.isLoading || testsQuery.isLoading || submissionsQuery.isLoading || progressQuery.isLoading) {
    return <PageLoader label="Loading classroom detail..." />;
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
  if (progressQuery.isError) {
    return <ErrorPanel message={progressQuery.error.message} onRetry={() => progressQuery.refetch()} />;
  }
  if (!classroom && (classroomsQuery.isFetching || testsQuery.isFetching || submissionsQuery.isFetching || progressQuery.isFetching)) {
    return <PageLoader label="Refreshing classroom detail..." />;
  }
  if (!classroom) {
    return <ErrorPanel message="That classroom is not available for this student account." />;
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Classroom detail"
        title={classroom.name}
        description={`Review available tests, your activity, and subject progress for ${classroom.teacher.name}'s class.`}
        actions={
          <Link
            to="/student"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Back to dashboard
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Teacher"
          value={classroom.teacher.name}
          helper={classroom.teacher.email}
          icon={<GraduationCap className="h-5 w-5" />}
          accentClassName="bg-sky-100 text-sky-700"
        />
        <StatCard
          label="Tests"
          value={String(classTests.length)}
          helper="Published for this classroom"
          icon={<BookOpen className="h-5 w-5" />}
          accentClassName="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Tracked subjects"
          value={String(classProgress.length)}
          helper="Subjects with progress records"
          icon={<ScanText className="h-5 w-5" />}
          accentClassName="bg-indigo-100 text-indigo-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-white/96 to-sky-50/55">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Available tests</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">Open a test in detail</h3>
            </div>
            <Badge tone="accent">{classTests.length} tests</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {classTests.length ? (
              classTests.map((test) => (
                <Link
                  key={test.id}
                  to={`/student/classrooms/${classId}/tests/${test.id}`}
                  className="block rounded-3xl border border-slate-200 bg-white px-5 py-5 transition hover:border-sky-300 hover:bg-sky-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-display text-xl font-bold text-ink">
                        {test.subject} - {test.chapter}
                      </h4>
                      <p className="mt-2 text-sm text-slate-500">{test.questions.length} question blocks</p>
                    </div>
                    <Badge>{test.id}</Badge>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">No tests are available for this classroom yet.</p>
            )}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-white/96 to-emerald-50/55">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Your activity</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">Submission history in this class</h3>
            </div>
            <Badge tone="accent">{classSubmissions.length} submissions</Badge>
          </div>
          <div className="mt-5 space-y-3">
            {classSubmissions.length ? (
              classSubmissions.map((submission) => (
                <div key={submission.id} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">Submission #{submission.id}</p>
                    <Badge>{submission.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No submissions have been made for this classroom yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
