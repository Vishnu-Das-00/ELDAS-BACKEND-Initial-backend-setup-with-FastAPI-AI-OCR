export type DashboardThemeKey = "teacher" | "student" | "parent";

export interface DashboardTheme {
  key: DashboardThemeKey;
  name: string;
  gradient: string;
  shellGlow: string;
  shellAccent: string;
  sidebar: string;
  sidebarMuted: string;
  sidebarActive: string;
  badge: string;
  subtlePanel: string;
  strongPanel: string;
  iconWrap: string;
}
