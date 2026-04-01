import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";

import { PageLoader } from "@/components/feedback/page-loader";
import { TeacherLayout } from "@/layouts/teacher-layout";
import { StudentLayout } from "@/layouts/student-layout";
import { ParentLayout } from "@/layouts/parent-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { GuestRoute } from "@/routes/guest-route";
import { ProtectedRoute } from "@/routes/protected-route";
import { useAuthStore } from "@/store/auth-store";

const LoginPage = lazy(() => import("@/pages/login-page").then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import("@/pages/signup-page").then((module) => ({ default: module.SignupPage })));
const RootPage = lazy(() => import("@/pages/root-page").then((module) => ({ default: module.RootPage })));
const TeacherDashboardPage = lazy(() =>
  import("@/pages/teacher-dashboard-page").then((module) => ({ default: module.TeacherDashboardPage })),
);
const TeacherClassroomPage = lazy(() =>
  import("@/pages/teacher-classroom-page").then((module) => ({ default: module.TeacherClassroomPage })),
);
const TeacherTestsPage = lazy(() =>
  import("@/pages/teacher-tests-page").then((module) => ({ default: module.TeacherTestsPage })),
);
const TeacherTestDetailPage = lazy(() =>
  import("@/pages/teacher-test-detail-page").then((module) => ({ default: module.TeacherTestDetailPage })),
);
const StudentDashboardPage = lazy(() =>
  import("@/pages/student-dashboard-page").then((module) => ({ default: module.StudentDashboardPage })),
);
const StudentClassroomDetailPage = lazy(() =>
  import("@/pages/student-classroom-detail-page").then((module) => ({ default: module.StudentClassroomDetailPage })),
);
const StudentTestDetailPage = lazy(() =>
  import("@/pages/student-test-detail-page").then((module) => ({ default: module.StudentTestDetailPage })),
);
const ParentDashboardPage = lazy(() =>
  import("@/pages/parent-dashboard-page").then((module) => ({ default: module.ParentDashboardPage })),
);
const NotificationsPage = lazy(() =>
  import("@/pages/notifications-page").then((module) => ({ default: module.NotificationsPage })),
);
const NotFoundPage = lazy(() => import("@/pages/not-found-page").then((module) => ({ default: module.NotFoundPage })));

function lazyElement(node: React.ReactNode) {
  return <Suspense fallback={<PageLoader label="Loading page..." />}>{node}</Suspense>;
}

function NotificationsLayoutResolver() {
  const role = useAuthStore((state) => state.role);

  if (role === "teacher") {
    return <TeacherLayout />;
  }
  if (role === "student") {
    return <StudentLayout />;
  }
  return <ParentLayout />;
}

export function AppRouter() {
  return useRoutes([
    {
      path: "/",
      element: lazyElement(<RootPage />),
    },
    {
      element: <GuestRoute />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              path: "/login",
              element: lazyElement(<LoginPage />),
            },
            {
              path: "/signup",
              element: lazyElement(<SignupPage />),
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute roles={["teacher"]} />,
      children: [
        {
          path: "/teacher",
          element: <TeacherLayout />,
          children: [
            {
              index: true,
              element: lazyElement(<TeacherDashboardPage />),
            },
            {
              path: "classrooms/:classId",
              element: lazyElement(<TeacherClassroomPage />),
            },
            {
              path: "tests",
              element: lazyElement(<TeacherTestsPage />),
            },
            {
              path: "classrooms/:classId/tests/:testId",
              element: lazyElement(<TeacherTestDetailPage />),
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute roles={["student"]} />,
      children: [
        {
          path: "/student",
          element: <StudentLayout />,
          children: [
            {
              index: true,
              element: lazyElement(<StudentDashboardPage />),
            },
            {
              path: "classrooms/:classId",
              element: lazyElement(<StudentClassroomDetailPage />),
            },
            {
              path: "classrooms/:classId/tests/:testId",
              element: lazyElement(<StudentTestDetailPage />),
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute roles={["parent"]} />,
      children: [
        {
          path: "/parent",
          element: <ParentLayout />,
          children: [
            {
              index: true,
              element: lazyElement(<ParentDashboardPage />),
            },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute roles={["teacher", "student", "parent"]} />,
      children: [
        {
          path: "/notifications",
          element: <NotificationsLayoutResolver />,
          children: [
            {
              index: true,
              element: lazyElement(<NotificationsPage />),
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: lazyElement(<NotFoundPage />),
    },
  ]);
}
