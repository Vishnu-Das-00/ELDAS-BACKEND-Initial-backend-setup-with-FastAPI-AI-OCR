export type NotificationChannel = "in_app" | "email";

export interface NotificationItem {
  id: number;
  user_id: number;
  channel: NotificationChannel;
  title: string;
  message: string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}
