import { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookMarked, BrainCircuit, Sigma } from "lucide-react";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { useClassrooms } from "@/hooks/use-classrooms";
import { getTestsByClass } from "@/services/test-service";
import type { ClassroomDetail } from "@/types/classroom";
import type { Test } from "@/types/test";

export function TeacherTestDetailPage() {
  const params = useParams();
  const location = useLocation();
  const classId = Number(params.classId);
  const testId = Number(params.testId);
  const routeState = (location.state as { classroom?: ClassroomDetail | null; test?: Test | null } | null) ?? null;

  const classroomsQuery = useClassrooms();
  const testsQuery = useQuery({
    queryKey: ["tests", classId],
    queryFn: () => getTestsByClass(classId),
    enabled: Number.isFinite(classId),
  });

  const classroom = useMemo(
    () => routeState?.classroom ?? classroomsQuery.data?.find((item) => item.id === classId) ?? null,
    [classId, classroomsQuery.data, routeState],
  );
  const test = useMemo(
    () => routeState?.test ?? testsQuery.data?.find((item) => item.id === testId) ?? null,
    [routeState, testId, testsQuery.data],
  );

  if (classroomsQuery.isLoading || testsQuery.isLoading) {
    return <PageLoader label="Loading test detail..." />;
  }

  if (classroomsQuery.isError) {
    return <ErrorPanel message={classroomsQuery.error.message} onRetry={() => classroomsQuery.refetch()} />;
  }

  if (testsQuery.isError) {
    return <ErrorPanel message={testsQuery.error.message} onRetry={() => testsQuery.refetch()} />;
  }

  if ((!classroom || !test) && (classroomsQuery.isFetching || testsQuery.isFetching)) {
    return <PageLoader label="Refreshing test detail..." />;
  }

  if (!classroom || !test) {
    return <ErrorPanel message="The requested test could not be found for this classroom." />;
  }

  const conceptCount = new Set(test.questions.flatMap((question) => question.concepts)).size;
  const calculationCount = new Set(test.questions.flatMap((question) => question.calculation_types)).size;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Test detail"
        title={`${test.subject} - ${test.chapter}`}
        description={`Review the complete question set, concept map, and calculation metadata for ${classroom.name}.`}
        actions={
          <Link
            to="/teacher/tests"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-ink transition hover:bg-white"
          >
            Back to tests
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Classroom"
          value={classroom.name}
          helper={`Join code ${classroom.join_code}`}
          icon={<BookMarked className="h-5 w-5" />}
          accentClassName="bg-teal-100 text-teal-700"
        />
        <StatCard
          label="Concepts"
          value={String(conceptCount)}
          helper="Distinct concept tags across the test"
          icon={<BrainCircuit className="h-5 w-5" />}
          accentClassName="bg-cyan-100 text-cyan-700"
        />
        <StatCard
          label="Calculation types"
          value={String(calculationCount)}
          helper="Execution modes expected in answers"
          icon={<Sigma className="h-5 w-5" />}
          accentClassName="bg-amber-100 text-amber-700"
        />
      </div>

      <Card className="bg-gradient-to-br from-white/96 to-teal-50/60">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Questions</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Structured question set</h3>
          </div>
          <Badge tone="accent">{test.questions.length} question blocks</Badge>
        </div>
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

              <div className="mt-5 grid gap-4 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Concepts</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {question.concepts.map((concept) => (
                      <Badge key={`${question.id}-concept-${concept}`}>{concept}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Steps</p>
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
    </div>
  );
}
