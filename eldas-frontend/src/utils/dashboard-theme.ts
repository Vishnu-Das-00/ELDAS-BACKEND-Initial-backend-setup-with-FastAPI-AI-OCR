import type { DashboardTheme, DashboardThemeKey } from "@/types/theme";

export const dashboardThemes: Record<DashboardThemeKey, DashboardTheme> = {
  teacher: {
    key: "teacher",
    name: "Teacher",
    gradient:
      "from-[#0b3c49] via-[#0f766e] to-[#5eead4]",
    shellGlow:
      "before:absolute before:-left-16 before:top-0 before:h-72 before:w-72 before:rounded-full before:bg-teal-300/20 before:blur-3xl after:absolute after:right-0 after:top-24 after:h-64 after:w-64 after:rounded-full after:bg-amber-200/20 after:blur-3xl",
    shellAccent: "bg-gradient-to-br from-white/75 to-white/50",
    sidebar: "bg-gradient-to-b from-[#0e2437] via-[#0f3f4d] to-[#0b283a]",
    sidebarMuted: "text-teal-100/70",
    sidebarActive: "bg-white text-[#102033]",
    badge: "bg-teal-100 text-teal-700",
    subtlePanel: "from-teal-50/90 to-cyan-50/60",
    strongPanel: "from-[#0d3e4d] via-[#0f766e] to-[#34d399]",
    iconWrap: "bg-white/14 text-white",
  },
  student: {
    key: "student",
    name: "Student",
    gradient:
      "from-[#1d4ed8] via-[#0f766e] to-[#86efac]",
    shellGlow:
      "before:absolute before:-right-10 before:top-8 before:h-72 before:w-72 before:rounded-full before:bg-sky-300/20 before:blur-3xl after:absolute after:left-0 after:bottom-0 after:h-60 after:w-60 after:rounded-full after:bg-emerald-200/20 after:blur-3xl",
    shellAccent: "bg-gradient-to-br from-white/75 to-emerald-50/40",
    sidebar: "bg-gradient-to-b from-[#132c63] via-[#155e75] to-[#0f766e]",
    sidebarMuted: "text-sky-100/70",
    sidebarActive: "bg-white text-[#102033]",
    badge: "bg-sky-100 text-sky-700",
    subtlePanel: "from-sky-50/90 to-emerald-50/60",
    strongPanel: "from-[#173a77] via-[#155e75] to-[#22c55e]",
    iconWrap: "bg-white/14 text-white",
  },
  parent: {
    key: "parent",
    name: "Parent",
    gradient:
      "from-[#7c2d12] via-[#b45309] to-[#f59e0b]",
    shellGlow:
      "before:absolute before:left-0 before:top-10 before:h-72 before:w-72 before:rounded-full before:bg-amber-300/20 before:blur-3xl after:absolute after:right-10 after:bottom-0 after:h-56 after:w-56 after:rounded-full after:bg-rose-200/20 after:blur-3xl",
    shellAccent: "bg-gradient-to-br from-white/80 to-amber-50/40",
    sidebar: "bg-gradient-to-b from-[#4a2412] via-[#7c3f14] to-[#b45309]",
    sidebarMuted: "text-amber-100/70",
    sidebarActive: "bg-white text-[#102033]",
    badge: "bg-amber-100 text-amber-700",
    subtlePanel: "from-amber-50/90 to-orange-50/70",
    strongPanel: "from-[#6b2f14] via-[#b45309] to-[#f59e0b]",
    iconWrap: "bg-white/14 text-white",
  },
};
