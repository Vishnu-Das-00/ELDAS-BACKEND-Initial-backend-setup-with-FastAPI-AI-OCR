import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpenCheck, BrainCircuit, ClipboardCheck, Plus, Sparkles, UsersRound } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { PerformanceBarChart } from "@/components/charts/performance-bar-chart";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { InsightStrip } from "@/components/dashboard/insight-strip";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { Modal } from "@/components/modal";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { CreateClassroomForm } from "@/features/classrooms/create-classroom-form";
import { useClassrooms } from "@/hooks/use-classrooms";
import { getTeacherClassroomOverview } from "@/services/classroom-service";
import { dashboardThemes } from "@/utils/dashboard-theme";
import { formatPercent } from "@/utils/format";

export function TeacherDashboardPage() {
  const classroomsQuery = useClassrooms();
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedClassId && classroomsQuery.data?.length) {
      setSelectedClassId(classroomsQuery.data[0].id);
    }
  }, [classroomsQuery.data, selectedClassId]);

  const selectedClassroom = useMemo(
    () => classroomsQuery.data?.find((item) => item.id === selectedClassId) ?? null,
    [classroomsQuery.data, selectedClassId],
  );

  const overviewQuery = useQuery({
    queryKey: ["teacher-overview", selectedClassId],
    queryFn: () => getTeacherClassroomOverview(selectedClassId!),
    enabled: Boolean(selectedClassId),
  });

  if (classroomsQuery.isLoading) {
    return <PageLoader label="Loading classrooms..." />;
  }

  if (classroomsQuery.isError) {
    return <ErrorPanel message={classroomsQuery.error.message} onRetry={() => classroomsQuery.refetch()} />;
  }

  const classrooms = classroomsQuery.data ?? [];
  const overview = overviewQuery.data;
  const weakConceptCount = overview?.weak_concepts.length ?? 0;
  const attentionCount = overview?.students_needing_attention.length ?? 0;

  return (
    <div className="space-y-8">
      <DashboardHero
        theme={dashboardThemes.teacher}
        eyebrow="Teacher dashboard"
        title="Run your class like a sharp signal room, not a spreadsheet."
        description="Track class performance, spot fragile concepts early, and move from raw results to teaching action without losing context."
        icon={<BrainCircuit className="h-7 w-7" />}
        metrics={[
          { label: "Classrooms", value: String(classrooms.length) },
          { label: "Weak concepts", value: String(weakConceptCount) },
          { label: "Students flagged", value: String(attentionCount) },
        ]}
        chips={[
          selectedClassroom ? `Selected class: ${selectedClassroom.name}` : "Select a class to focus",
          "Cognitive signals enabled",
          "Teacher-only authoring",
        ]}
        action={
          <Button onClick={() => setCreateModalOpen(true)} className="bg-white text-ink hover:bg-slate-100">
            <Plus className="h-4 w-4" />
            Create classroom
          </Button>
        }
        secondaryAction={
          <Link
            to="/teacher/tests"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Open test builder
          </Link>
        }
      />

      <Modal
        open={createModalOpen}
        title="Create a classroom"
        description="Set up a fresh classroom and share the join code with students."
        onClose={() => setCreateModalOpen(false)}
      >
        <CreateClassroomForm onCreated={() => setCreateModalOpen(false)} />
      </Modal>

      <div className="grid gap-4 xl:grid-cols-3">
        <InsightStrip
          title="See momentum per class"
          description="Use the class selector below to pivot between sections and keep your analytics grounded in one teaching context at a time."
          icon={<Sparkles className="h-5 w-5" />}
        />
        <InsightStrip
          title="Find reteaching targets"
          description="Weak concept clusters surface where whole groups are drifting, so you can reteach with intent instead of waiting for the next exam."
          icon={<BrainCircuit className="h-5 w-5" />}
        />
        <InsightStrip
          title="Follow attention lists"
          description="Students who need support stay visible alongside ranking and classroom averages, making intervention easier to prioritize."
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
      </div>

      {!classrooms.length ? (
        <EmptyState
          title="Create your first classroom"
          description="Once you create a classroom, Eldas will track join codes, performance trends, and student attention signals here."
          action={
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Start with a classroom
            </Button>
          }
        />
      ) : (
        <>
          <SectionHeader
            eyebrow="Classrooms"
            title="Choose a classroom focus"
            description="Each card opens a dedicated view of the class while also refreshing the live insight panel below."
          />
          <div className="grid gap-4 xl:grid-cols-3">
            {classrooms.map((classroom) => (
              <Card
                key={classroom.id}
                className={`cursor-pointer transition ${
                  classroom.id === selectedClassId
                    ? "border-transparent bg-gradient-to-br from-teal-50 to-cyan-50 ring-2 ring-tide/30"
                    : "hover:-translate-y-0.5"
                }`}
                onClick={() => setSelectedClassId(classroom.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Classroom</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-ink">{classroom.name}</h3>
                  </div>
                  <Badge tone="accent">{classroom.student_count} students</Badge>
                </div>
                <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50/80 px-4 py-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Join code</p>
                    <p className="mt-1 font-semibold text-ink">{classroom.join_code}</p>
                  </div>
                  <Link
                    to={`/teacher/classrooms/${classroom.id}`}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-ink transition hover:bg-white"
                  >
                    Detail view
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          {selectedClassroom ? (
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <StatCard
                    label="Selected class"
                    value={selectedClassroom.name}
                    helper="Use the class card grid above to switch context."
                    icon={<BookOpenCheck className="h-5 w-5" />}
                    accentClassName="bg-teal-100 text-teal-700"
                  />
                  <StatCard
                    label="Join code"
                    value={selectedClassroom.join_code}
                    helper="Share this with students."
                    icon={<UsersRound className="h-5 w-5" />}
                    accentClassName="bg-cyan-100 text-cyan-700"
                  />
                  <StatCard
                    label="Students"
                    value={String(selectedClassroom.student_count)}
                    helper="Current linked enrollments"
                    icon={<UsersRound className="h-5 w-5" />}
                    accentClassName="bg-emerald-100 text-emerald-700"
                  />
                </div>

                {overviewQuery.isLoading ? (
                  <PageLoader label="Loading analytics..." />
                ) : overviewQuery.isError ? (
                  <ErrorPanel message={overviewQuery.error.message} onRetry={() => overviewQuery.refetch()} />
                ) : overview ? (
                  <>
                    <PerformanceBarChart title="Average class scores" data={overview.avg_class_scores} />
                    <Card className="bg-gradient-to-br from-white/95 to-teal-50/70">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="eyebrow">Weak concepts</p>
                          <h3 className="mt-2 font-display text-2xl font-bold text-ink">Concepts needing reinforcement</h3>
                        </div>
                        <Link className="text-sm font-semibold text-tide" to={`/teacher/classrooms/${selectedClassroom.id}`}>
                          Open classroom detail
                        </Link>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {overview.weak_concepts.length ? (
                          overview.weak_concepts.map((concept) => (
                            <Badge key={concept.concept} tone="warning" className="py-2">
                              {concept.concept} - {concept.count}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500">No weak concepts detected yet.</p>
                        )}
                      </div>
                    </Card>
                  </>
                ) : null}
              </div>

              <Card className="bg-gradient-to-br from-white/96 to-amber-50/55">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow">Attention list</p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-ink">Students needing focus</h3>
                  </div>
                  <Link className="text-sm font-semibold text-tide" to="/teacher/tests">
                    Create a new test
                  </Link>
                </div>
                <div className="mt-5">
                  {overview?.students_needing_attention.length ? (
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableHeader>Student</TableHeader>
                          <TableHeader>Average</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {overview.students_needing_attention.map((student) => (
                          <TableRow key={student.student_id}>
                            <TableCell>{student.student_name}</TableCell>
                            <TableCell>{formatPercent(student.average_score)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-slate-500">No high-risk students surfaced for this class yet.</p>
                  )}
                </div>
              </Card>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
