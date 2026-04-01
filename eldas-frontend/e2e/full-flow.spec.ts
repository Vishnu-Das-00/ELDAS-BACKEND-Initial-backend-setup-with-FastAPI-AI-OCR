import { expect, test, type Page } from "@playwright/test";

const password = "SecurePass123!";

async function signup(
  page: Page,
  role: "teacher" | "student" | "parent",
  payload: { name: string; email: string },
) {
  await page.goto(`/signup?role=${role}`);
  await page.getByTestId("signup-name").fill(payload.name);
  await page.getByTestId("signup-email").fill(payload.email);
  await page.getByTestId("signup-password").fill(password);
  await page.getByTestId("signup-submit").click();
}

async function login(page: Page, payload: { email: string }) {
  await page.goto("/login");
  await page.getByTestId("login-email").fill(payload.email);
  await page.getByTestId("login-password").fill(password);
  await page.getByTestId("login-submit").click();
}

async function addTag(page: Page, placeholder: string, value: string) {
  await page.getByPlaceholder(placeholder).fill(value);
  await page.getByPlaceholder(placeholder).press("Enter");
}

test("teacher, student, and parent complete the core Eldas flow", async ({ page }) => {
  const stamp = Date.now();
  const teacher = { name: "Asha Teacher", email: `teacher.${stamp}@eldasapp.dev` };
  const student = { name: "Ravi Student", email: `student.${stamp}@eldasapp.dev` };
  const parent = { name: "Mina Parent", email: `parent.${stamp}@eldasapp.dev` };
  const classroomName = `Physics Cohort ${stamp}`;
  const subject = "Physics";
  const chapter = "Forces and Motion";

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Build a clearer picture/i })).toBeVisible();

  await signup(page, "teacher", teacher);
  await expect(page).toHaveURL(/\/teacher$/);

  await page.getByRole("button", { name: "Create classroom" }).click();
  await page.getByTestId("create-classroom-name").fill(classroomName);
  await page.getByTestId("create-classroom-submit").click();
  await expect(page.getByRole("heading", { name: classroomName }).first()).toBeVisible();

  await page.getByRole("link", { name: "Detail view" }).first().click();
  await expect(page.getByRole("heading", { name: classroomName })).toBeVisible();
  const joinCodeText = (await page.getByTestId("teacher-classroom-join-code").textContent()) ?? "";
  const joinCode = joinCodeText.replace("Join code:", "").trim();
  expect(joinCode.length).toBeGreaterThan(3);

  await page.goto("/teacher/tests");
  await page.getByLabel("Classroom").selectOption({ label: classroomName });
  await page.getByLabel("Subject", { exact: true }).fill(subject);
  await page.getByLabel("Chapter", { exact: true }).fill(chapter);
  await page.getByLabel("Question text").fill("Explain why the net force changes the motion of an object.");
  await page.getByLabel("Question subject").fill(subject);
  await page.getByLabel("Question chapter").fill(chapter);
  await addTag(page, "Add concept", "net force");
  await addTag(page, "Add concept", "acceleration");
  await addTag(page, "Add solution step", "identify the forces");
  await addTag(page, "Add solution step", "state Newton's second law");
  await addTag(page, "Add calculation type", "algebra");
  await page.getByRole("button", { name: "Create test" }).click();

  await expect(page.getByRole("heading", { name: `${subject} - ${chapter}` }).first()).toBeVisible();

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await signup(page, "student", student);
  await expect(page).toHaveURL(/\/student$/);
  const studentId = Number(((await page.getByTestId("student-id-value").textContent()) ?? "").trim());
  expect(studentId).toBeGreaterThan(0);

  await page.getByTestId("join-classroom-code").fill(joinCode);
  await page.getByTestId("join-classroom-submit").click();
  await expect(page.getByRole("heading", { name: classroomName }).first()).toBeVisible();

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await signup(page, "parent", parent);
  await expect(page).toHaveURL(/\/parent$/);
  await page.getByTestId("parent-link-student-id").fill(String(studentId));
  await page.getByTestId("parent-link-submit").click();
  await expect(page.getByText(/Tracked student/i)).toBeVisible();

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await login(page, student);
  await expect(page).toHaveURL(/\/student$/);
  await page.getByRole("link", { name: "View detail" }).first().click();
  await page.getByRole("link", { name: new RegExp(`${subject} - ${chapter}`) }).first().click();
  await expect(page.getByTestId("submission-panel")).toBeVisible();
  await page.getByTestId("submission-answer-text").fill("I am unsure.");
  await page.getByTestId("submission-submit").click();
  await expect(page.getByTestId("test-attempt-item").first()).toBeVisible();

  await expect
    .poll(
      async () => {
        await page.reload();
        const status = await page.locator("[data-testid^='test-attempt-status-']").first().textContent();
        return status?.trim().toLowerCase() ?? "";
      },
      {
        timeout: 60_000,
        message: "Waiting for the submission evaluation to complete.",
      },
    )
    .toBe("completed");

  await page.getByRole("button", { name: "Logout" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await login(page, parent);
  await expect(page).toHaveURL(/\/parent$/);

  await expect
    .poll(
      async () => {
        await page.reload();
        return await page.locator("body").textContent();
      },
      {
        timeout: 60_000,
        message: "Waiting for parent dashboard updates after the student submission.",
      },
    )
    .toContain(subject);

  await expect(page.getByText(`Low performance in ${subject} - ${chapter}.`)).toBeVisible();
  await expect(page.getByText("Student needs attention")).toBeVisible();
});
