import { Outlet } from "react-router-dom";
import { ArrowLeft, BrainCircuit, ChartNoAxesCombined, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-eldas-grid px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0d2237] via-[#0f766e] to-[#67e8f9] p-10 text-white shadow-panel lg:flex lg:flex-col lg:justify-between">
          <div className="absolute" />
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow text-white/60">Eldas</p>
                <h1 className="mt-3 max-w-xl font-display text-5xl font-bold leading-tight">
                  Step into a calmer, sharper learning system.
                </h1>
              </div>
              <Link
                to="/"
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Home
              </Link>
            </div>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/75">
              Teachers spot weak concepts faster, students submit work seamlessly, and parents stay close to progress
              without waiting for report day.
            </p>
          </div>
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
                <div className="inline-flex rounded-2xl bg-white/12 p-3">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-bold">3x</p>
                <p className="mt-2 text-sm text-white/70">faster classroom insight loops</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
                <div className="inline-flex rounded-2xl bg-white/12 p-3">
                  <ChartNoAxesCombined className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-bold">AI</p>
                <p className="mt-2 text-sm text-white/70">cognitive evaluation pipeline</p>
              </div>
              <div className="rounded-3xl bg-white/12 p-5 backdrop-blur-sm">
                <div className="inline-flex rounded-2xl bg-white/12 p-3">
                  <UsersRound className="h-5 w-5" />
                </div>
                <p className="mt-4 text-3xl font-bold">All</p>
                <p className="mt-2 text-sm text-white/70">teachers, students, parents connected</p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">What changes here</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-white/78">
                <p>Teachers move from raw scores to actionable weak-concept views.</p>
                <p>Students get feedback on method, concept, and execution, not just correctness.</p>
                <p>Parents receive a calm summary of progress and warnings that matter.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/12 bg-white/7 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Teacher</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Create classes, author tests, review weak concepts.</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/7 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Student</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Join a class, submit answers, study feedback.</p>
              </div>
              <div className="rounded-3xl border border-white/12 bg-white/7 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">Parent</p>
                <p className="mt-2 text-sm leading-6 text-white/80">Link a child, review progress, watch alerts.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-xl">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
