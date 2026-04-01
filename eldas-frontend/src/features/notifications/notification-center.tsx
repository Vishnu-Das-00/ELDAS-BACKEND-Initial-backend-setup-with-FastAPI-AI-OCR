import { BellRing } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { EmptyState } from "@/components/feedback/empty-state";
import type { NotificationItem } from "@/types/notification";
import { formatDateTime } from "@/utils/format";

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onMarkRead: (notificationId: number) => void;
  isUpdating?: boolean;
}

export function NotificationCenter({ notifications, onMarkRead, isUpdating }: NotificationCenterProps) {
  if (!notifications.length) {
    return (
      <EmptyState
        title="No notifications yet"
        description="When Eldas detects a weak trend or important update, it will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-tide/10 p-3 text-tide">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-bold text-ink">{notification.title}</h3>
                {notification.read_at ? <Badge>Read</Badge> : <Badge tone="warning">New</Badge>}
              </div>
              <p className="mt-2 text-sm text-slate-600">{notification.message}</p>
              <p className="mt-2 text-xs text-slate-400">{formatDateTime(notification.created_at)}</p>
            </div>
          </div>
          {!notification.read_at ? (
            <Button variant="outline" onClick={() => onMarkRead(notification.id)} disabled={isUpdating}>
              Mark as read
            </Button>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
