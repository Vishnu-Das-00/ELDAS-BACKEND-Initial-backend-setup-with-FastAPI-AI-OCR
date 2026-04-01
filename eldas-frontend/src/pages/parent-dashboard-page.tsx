import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, HeartHandshake, ShieldAlert, Sparkles, UserRoundPlus } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { InsightStrip } from "@/components/dashboard/insight-strip";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/input";
import { SectionHeader } from "@/components/section-header";
import { StatCard } from "@/components/stat-card";
import { NotificationCenter } from "@/features/notifications/notification-center";
import { getLinkedStudents, getParentStudentDashboard } from "@/services/parent-service";
import { linkParentToStudent } from "@/services/classroom-service";
import { useNotifications } from "@/hooks/use-notifications";
import { useAuthStore } from "@/store/auth-store";
import { dashboardThemes } from "@/utils/dashboard-theme";
import { formatDateTime, formatPercent } from "@/utils/format";

const linkSchema = z.object({
  studentId: z.coerce.number().min(1, "Enter a valid student ID."),
});

type LinkValues = z.infer<typeof linkSchema>;

export function ParentDashboardPage() {
  const linkedStudentId = useAuthStore((state) => state.linkedStudentId);
  const setLinkedStudentId = useAuthStore((state) => state.setLinkedStudentId);
  const notifications = useNotifications();
  const form = useForm<LinkValues>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      studentId: linkedStudentId ?? 0,
    },
  });

  const linkMutation = useMutation({
    mutationFn: (values: LinkValues) => linkParentToStudent(values.studentId),
    onSuccess: (_, variables) => {
      setLinkedStudentId(variables.studentId);
      toast.success("Child linked successfully.");
      void linkedStudentsQuery.refetch();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const linkedStudentsQuery = useQuery({
    queryKey: ["parent-links"],
    queryFn: getLinkedStudents,
  });

  const activeLinkedStudentId = linkedStudentId ?? linkedStudentsQuery.data?.[0]?.id ?? null;

  useEffect(() => {
    if (linkedStudentsQuery.data?.[0] && linkedStudentId !== linkedStudentsQuery.data[0].id) {
      setLinkedStudentId(linkedStudentsQuery.data[0].id);
      form.setValue("studentId", linkedStudentsQuery.data[0].id);
    }
  }, [form, linkedStudentId, linkedStudentsQuery.data, setLinkedStudentId]);

  const dashboardQuery = useQuery({
    queryKey: ["parent-dashboard", activeLinkedStudentId],
    queryFn: () => getParentStudentDashboard(activeLinkedStudentId!),
    enabled: Boolean(activeLinkedStudentId),
  });

  return (
    <div className="space-y-8">
      <DashboardHero
        theme={dashboardThemes.parent}
        eyebrow="Parent dashboard"
        title="Stay close to progress without hovering over every assignment."
        description="Eldas translates classroom activity into a simple family view of progress, recent performance, and the areas where your child may need support."
        icon={<HeartHandshake className="h-7 w-7" />}
        metrics={[
          { label: "Linked child", value: activeLinkedStudentId ? `#${activeLinkedStudentId}` : "None" },
          { label: "Warnings", value: String(dashboardQuery.data?.warnings.length ?? 0) },
          { label: "Alerts", value: String(notifications.query.data?.length ?? 0) },
        ]}
        chips={[
          activeLinkedStudentId ? "Child linked" : "Link a child to begin",
          "Progress snapshots",
          "In-app notifications",
        ]}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <InsightStrip
          title="See the bigger picture"
          description="Subject summaries help you distinguish a one-off bad submission from a pattern that needs attention."
          icon={<Sparkles className="h-5 w-5" />}
        />
        <InsightStrip
          title="Notice weak areas early"
          description="Warnings are generated when Eldas sees low performance signals that deserve a conversation or a follow-up plan."
          icon={<ShieldAlert className="h-5 w-5" />}
        />
        <InsightStrip
          title="Stay connected without noise"
          description="Notifications keep you informed about what matters instead of dumping every classroom event into your lap."
          icon={<BellRing className="h-5 w-5" />}
        />
      </div>

      {!activeLinkedStudentId ? (
        <Card className="max-w-2xl bg-gradient-to-br from-white/96 to-amber-50/65">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-tide/10 p-3 text-tide">
              <UserRoundPlus className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Onboarding</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">Link your child to begin</h3>
            </div>
          </div>
          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => linkMutation.mutate(values))}>
            <FormField
              label="Student ID"
              error={form.formState.errors.studentId?.message}
              hint="Use the student ID issued during onboarding or by the school."
            >
              <Input type="number" placeholder="1001" data-testid="parent-link-student-id" {...form.register("studentId")} />
            </FormField>
            <Button type="submit" disabled={linkMutation.isPending} data-testid="parent-link-submit">
              {linkMutation.isPending ? "Linking..." : "Link child"}
            </Button>
          </form>
        </Card>
      ) : dashboardQuery.isLoading ? (
        <PageLoader label="Loading child dashboard..." />
      ) : dashboardQuery.isError ? (
        <ErrorPanel message={dashboardQuery.error.message} onRetry={() => dashboardQuery.refetch()} />
      ) : dashboardQuery.data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              label="Tracked student"
              value={`#${dashboardQuery.data.student_id}`}
              helper="Linked child ID"
              icon={<UserRoundPlus />}
              accentClassName="bg-amber-100 text-amber-700"
            />
            <StatCard
              label="Recent performance"
              value={String(dashboardQuery.data.recent_performance.length)}
              helper="Recent assessed submissions"
              icon={<BellRing />}
              accentClassName="bg-orange-100 text-orange-700"
            />
            <StatCard
              label="Warnings"
              value={String(dashboardQuery.data.warnings.length)}
              helper="Current weak area alerts"
              icon={<ShieldAlert />}
              accentClassName="bg-rose-100 text-rose-700"
            />
          </div>

          {dashboardQuery.data.warnings.length ? (
            <div className="grid gap-3">
              {dashboardQuery.data.warnings.map((warning) => (
                <Card key={warning} className="border-amber-200 bg-amber-50/80">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" />
                    <p className="text-sm font-medium text-slate-700">{warning}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card className="bg-gradient-to-br from-white/96 to-amber-50/60">
              <p className="eyebrow">Skill breakdown</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">Progress by subject</h3>
              <div className="mt-5 space-y-4">
                {dashboardQuery.data.progress.length ? (
                  dashboardQuery.data.progress.map((item) => (
                    <div key={item.subject} className="rounded-3xl bg-slate-50/80 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-ink">{item.subject}</h4>
                        <span className="text-xs text-slate-400">{formatDateTime(item.updated_at)}</span>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-600">
                        {Object.entries((item.skill_scores.averages as Record<string, number | Record<string, number> | undefined>) ?? {}).map(
                          ([key, value]) => {
                            if (typeof value !== "number") {
                              return null;
                            }
                            return (
                              <div key={key} className="flex items-center justify-between">
                                <span>{key}</span>
                                <strong>{formatPercent(value)}</strong>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    title="No progress records yet"
                    description="Progress cards will appear once your child has completed evaluated submissions."
                  />
                )}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-white/96 to-orange-50/60">
              <p className="eyebrow">Recent performance</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">Latest evaluated work</h3>
              <div className="mt-5 space-y-4">
                {dashboardQuery.data.recent_performance.length ? (
                  dashboardQuery.data.recent_performance.map((item) => (
                    <div key={item.submission_id} className="rounded-3xl bg-slate-50/80 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-ink">
                            {item.subject} - {item.chapter}
                          </h4>
                          <p className="mt-2 text-sm text-slate-500">Submission #{item.submission_id}</p>
                        </div>
                        <Badge tone={item.score >= 0.6 ? "success" : "warning"}>{formatPercent(item.score)}</Badge>
                      </div>
                      <p className="mt-3 text-sm text-slate-600">{item.error_reason || "No major error reason reported."}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Recent performance items will appear after evaluated submissions.</p>
                )}
              </div>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-white/96 to-amber-50/50">
            <SectionHeader
              eyebrow="Notifications"
              title="Parent alert center"
              description="In-app alerts keep you updated when Eldas sees a pattern that may need attention."
            />
            <div className="mt-5">
              <NotificationCenter
                notifications={notifications.query.data ?? []}
                onMarkRead={(notificationId) => notifications.mutation.mutate(notificationId)}
                isUpdating={notifications.mutation.isPending}
              />
            </div>
          </Card>
        </>
      ) : (
        <EmptyState
          title="Link a child to continue"
          description="Eldas needs a linked student record before it can load progress or alerts."
        />
      )}
    </div>
  );
}
