import { apiClient } from "@/lib/api-client";
import type { NotificationItem } from "@/types/notification";

export async function getNotifications() {
  const { data } = await apiClient.get<NotificationItem[]>("/notifications/me");
  return data;
}

export async function markNotificationRead(notificationId: number) {
  const { data } = await apiClient.patch<NotificationItem>(`/notifications/${notificationId}/read`);
  return data;
}
