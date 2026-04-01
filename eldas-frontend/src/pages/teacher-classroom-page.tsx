import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";
import { PerformanceBarChart } from "@/components/charts/performance-bar-chart";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { SectionHeader } from "@/components/section-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { useClassrooms } from "@/hooks/use-classrooms";
import { getTeacherClassroomOverview } from "@/services/classroom-service";
import { getTestsByClass } from "@/services/test-service";
import { formatPercent } from "@/utils/format";

type SortKey = "student_name" | "average_score";

export function TeacherClassroomPage() {
  const params = useParams();
  const classId = Number(params.classId);
  const [sortKey, setSortKey] = useState<SortKey>("average_score");
  const classroomsQuery = useClassrooms();

  const overviewQuery = useQuery({
    queryKey: ["teacher-overview", classId],
    queryFn: () => getTeacherClassroomOverview(classId),
    enabled: Number.isFinite(classId),
  });
  const testsQuery = useQuery({
    queryKey: ["tests", classId],
    queryFn: () => getTestsByClass(classId),
    enabled: Number.isFinite(classId),
  });

  const classroom = useMemo(
    () => classroomsQuery.data?.find((item) => item.id === classId) ?? null,
    [classId, classroomsQuery.data],
  );

  if (classroomsQuery.isLoading || overviewQuery.isLoading || testsQuery.isLoading) {
    return <PageLoader label="Loading classroom detail..." />;
  }

  if (classroomsQuery.isError) {
    return <ErrorPanel message={classroomsQuery.error.message} onRetry={() => classroomsQuery.refetch()} />;
  }

  if (overviewQuery.isError) {
    return <ErrorPanel message={overviewQuery.error.message} onRetry={() => overviewQuery.refetch()} />;
  }

  if (testsQuery.isError) {
    return <ErrorPanel message={testsQuery.error.message} onRetry={() => testsQuery.refetch()} />;
  }

  if (!overviewQuery.data || !classroom) {
    return <ErrorPanel message="Classroom data could not be found." />;
  }

  const ranking = [...overviewQuery.data.student_ranking].sort((left, right) =>
    sortKey === "average_score"
      ? right.average_score - left.average_score
      : left.student_name.localeCompare(right.student_name),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Classroom detail"
        title={classroom.name}
        description="Review join codes, concept weakness, published tests, ranking, and the students who need more support."
        actions={
          <Badge tone="accent" data-testid="teacher-classroom-join-code">
            Join code: {classroom.join_code}
          </Badge>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <PerformanceBarChart title="Class performance" data={overviewQuery.data.avg_class_scores} />
        <div className="space-y-6">
          <Card>
            <p className="eyebrow">Weak concepts</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Areas to reteach</h3>
            <div className="mt-5 flex flex-wrap gap-3">
              {overviewQuery.data.weak_concepts.length ? (
                overviewQuery.data.weak_concepts.map((concept) => (
                  <Badge key={concept.concept} tone="warning" className="py-2">
                    {concept.concept} - {concept.count}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500">No concentrated weak concepts yet.</p>
              )}
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-white/95 to-teal-50/60">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Published tests</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-ink">Assessment library for this class</h3>
              </div>
              <Badge tone="accent">{testsQuery.data?.length ?? 0} tests</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {testsQuery.data?.length ? (
                testsQuery.data.map((test) => (
                  <div key={test.id} className="rounded-3xl border border-slate-200 bg-white px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">
                          {test.subject} - {test.chapter}
                        </p>
                        <p className="mt-2 text-sm text-slate-500">{test.questions.length} question blocks</p>
                      </div>
                      <Link
                        to={`/teacher/classrooms/${classId}/tests/${test.id}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-ink transition hover:bg-slate-50"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Create a test from the builder to populate this class library.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Student ranking</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-ink">Ordered by classroom performance</h3>
          </div>
          <div className="flex gap-2">
            <Badge tone={sortKey === "average_score" ? "accent" : "neutral"} onClick={() => setSortKey("average_score")}>
              Sort by score
            </Badge>
            <Badge tone={sortKey === "student_name" ? "accent" : "neutral"} onClick={() => setSortKey("student_name")}>
              Sort by name
            </Badge>
          </div>
        </div>
        <div className="mt-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Student</TableHeader>
                <TableHeader>Average score</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {ranking.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell>{student.student_name}</TableCell>
                  <TableCell>{formatPercent(student.average_score)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
