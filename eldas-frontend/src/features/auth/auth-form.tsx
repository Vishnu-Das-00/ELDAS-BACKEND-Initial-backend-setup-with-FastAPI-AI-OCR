import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, KeyRound, ShieldCheck, UserRoundPlus } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { FormField } from "@/components/forms/form-field";
import { Input } from "@/components/input";
import { Select } from "@/components/select";
import { login, signup } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import type { AuthResponse, UserRole } from "@/types/auth";
import { getDefaultRouteForRole, roleLabels } from "@/utils/roles";

const baseSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password should be at least 8 characters."),
});

const signupSchema = baseSchema.extend({
  name: z.string().min(2, "Name should be at least 2 characters."),
  role: z.enum(["teacher", "student", "parent"]),
});

const loginSchema = baseSchema;

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

const roleSummaries: Record<UserRole, { title: string; description: string }> = {
  teacher: {
    title: "Teacher workspace",
    description: "Create classrooms, publish tests, and act on cognitive insight.",
  },
  student: {
    title: "Student workspace",
    description: "Join classes, submit answers, and review evaluation feedback.",
  },
  parent: {
    title: "Parent workspace",
    description: "Track progress, recent performance, and support alerts.",
  },
};

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const preferredRole = searchParams.get("role");
  const defaultSignupRole: UserRole =
    preferredRole === "teacher" || preferredRole === "student" || preferredRole === "parent" ? preferredRole : "teacher";

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: defaultSignupRole,
    },
  });

  useEffect(() => {
    if (mode === "signup") {
      signupForm.setValue("role", defaultSignupRole);
    }
  }, [defaultSignupRole, mode, signupForm]);

  const mutation = useMutation<AuthResponse, Error, LoginValues | SignupValues>({
    mutationFn: async (values) => {
      if (mode === "login") {
        return login(values as LoginValues);
      }
      return signup(values as SignupValues);
    },
    onSuccess: (data) => {
      setSession(data);
      toast.success(mode === "login" ? "Welcome back to Eldas." : "Account created successfully.");
      const requestedRoute = location.state?.from?.pathname;
      navigate(requestedRoute && requestedRoute !== "/login" ? requestedRoute : getDefaultRouteForRole(data.role), {
        replace: true,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isPending = mutation.isPending;

  function handleLoginSubmit(values: LoginValues) {
    mutation.mutate(values);
  }

  function handleSignupSubmit(values: SignupValues) {
    mutation.mutate(values);
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-8 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="accent">{mode === "login" ? "Secure sign in" : "Role-based onboarding"}</Badge>
          <Badge>{mode === "login" ? "JWT session" : "Teacher / Student / Parent"}</Badge>
        </div>
        <p className="eyebrow mt-4">{mode === "login" ? "Welcome back" : "Create workspace access"}</p>
        <h2 className="mt-3 font-display text-4xl font-bold text-ink">
        {mode === "login" ? "Sign in to Eldas" : "Join Eldas"}
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          {mode === "login"
            ? "Open your teacher, student, or parent workspace and continue exactly where you left off."
            : "Create a role-specific account and step into the Eldas learning platform with the right view from day one."}
        </p>
      </div>

      <div className="px-8 py-8">
        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="inline-flex rounded-xl bg-white p-2 text-tide shadow-sm">
              {mode === "login" ? <KeyRound className="h-4 w-4" /> : <UserRoundPlus className="h-4 w-4" />}
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">{mode === "login" ? "Fast return" : "Fast setup"}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="inline-flex rounded-xl bg-white p-2 text-tide shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">Role-aware access</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <div className="inline-flex rounded-xl bg-white p-2 text-tide shadow-sm">
              <ArrowRight className="h-4 w-4" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink">Directed to the right dashboard</p>
          </div>
        </div>

        {mode === "login" ? (
          <form className="space-y-5" onSubmit={loginForm.handleSubmit(handleLoginSubmit)}>
          <FormField label="Email" error={loginForm.formState.errors.email?.message}>
            <Input type="email" placeholder="you@example.com" data-testid="login-email" {...loginForm.register("email")} />
          </FormField>
          <FormField label="Password" error={loginForm.formState.errors.password?.message}>
            <Input type="password" placeholder="Your password" data-testid="login-password" {...loginForm.register("password")} />
          </FormField>
          <Button type="submit" size="lg" className="w-full" disabled={isPending} data-testid="login-submit">
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={signupForm.handleSubmit(handleSignupSubmit)}>
          <div className="grid gap-3 md:grid-cols-3">
            {(["teacher", "student", "parent"] as UserRole[]).map((role) => {
              const selectedRole = signupForm.watch("role");
              const isSelected = selectedRole === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => signupForm.setValue("role", role, { shouldDirty: true, shouldValidate: true })}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    isSelected ? "border-tide bg-tide/5 ring-2 ring-tide/10" : "border-slate-200 bg-slate-50 hover:bg-white"
                  }`}
                >
                  <p className="text-sm font-semibold text-ink">{roleSummaries[role].title}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{roleSummaries[role].description}</p>
                </button>
              );
            })}
          </div>
          <FormField label="Full name" error={signupForm.formState.errors.name?.message}>
            <Input placeholder="Ananya Rao" data-testid="signup-name" {...signupForm.register("name")} />
          </FormField>
          <FormField label="Email" error={signupForm.formState.errors.email?.message}>
            <Input type="email" placeholder="you@example.com" data-testid="signup-email" {...signupForm.register("email")} />
          </FormField>
          <FormField label="Password" error={signupForm.formState.errors.password?.message}>
            <Input
              type="password"
              placeholder="Create a secure password"
              data-testid="signup-password"
              {...signupForm.register("password")}
            />
          </FormField>
          <FormField label="Role" error={signupForm.formState.errors.role?.message}>
            <Select data-testid="signup-role" {...signupForm.register("role")}>
              {(["teacher", "student", "parent"] as UserRole[]).map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]}
                </option>
              ))}
            </Select>
          </FormField>
          <Button type="submit" size="lg" className="w-full" disabled={isPending} data-testid="signup-submit">
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          </form>
        )}

        <p className="mt-6 text-sm text-slate-500">
          {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
          <Link className="font-semibold text-tide" to={mode === "login" ? "/signup" : "/login"}>
            {mode === "login" ? "Create one" : "Sign in"}
          </Link>
        </p>
      </div>
    </Card>
  );
}
