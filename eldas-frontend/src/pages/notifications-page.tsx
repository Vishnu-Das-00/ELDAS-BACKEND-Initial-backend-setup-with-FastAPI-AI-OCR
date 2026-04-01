import { NotificationCenter } from "@/features/notifications/notification-center";
import { useNotifications } from "@/hooks/use-notifications";
import { ErrorPanel } from "@/components/feedback/error-panel";
import { PageLoader } from "@/components/feedback/page-loader";
import { SectionHeader } from "@/components/section-header";

export function NotificationsPage() {
  const { query, mutation } = useNotifications();

  if (query.isLoading) {
    return <PageLoader label="Loading notifications..." />;
  }

  if (query.isError) {
    return <ErrorPanel message={query.error.message} onRetry={() => query.refetch()} />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Notifications"
        title="Alerts and updates"
        description="Track the signals Eldas surfaces for new risk trends, parent alerts, and follow-up actions."
      />
      <NotificationCenter
        notifications={query.data ?? []}
        onMarkRead={(notificationId) => mutation.mutate(notificationId)}
        isUpdating={mutation.isPending}
      />
    </div>
  );
}
