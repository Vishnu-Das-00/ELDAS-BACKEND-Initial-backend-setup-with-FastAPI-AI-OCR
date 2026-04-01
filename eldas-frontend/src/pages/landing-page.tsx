import { ArrowRight, BrainCircuit, ChartColumnIncreasing, GraduationCap, House, Layers3, ScanSearch } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/badge";
import { Card } from "@/components/card";

const roleCards = [
  {
    title: "Teachers",
    description: "See weak concepts, class momentum, and the students who need attention before the next assessment cycle.",
    icon: GraduationCap,
    tone: "from-teal-500 to-cyan-500",
    cta: "/signup?role=teacher",
  },
  {
    title: "Students",
    description: "Submit answers, review cognitive feedback, and understand which part of the process needs improvement.",
    icon: BrainCircuit,
    tone: "from-sky-500 to-emerald-500",
    cta: "/signup?role=student",
  },
  {
    title: "Parents",
    description: "Get a calmer, clearer picture of progress, warnings, and the next conversations worth having at home.",
    icon: House,
    tone: "from-amber-500 to-orange-500",
    cta: "/signup?role=parent",
  },
];

const pillars = [
  {
    title: "Classroom analytics that explain why",
    description: "Eldas combines performance signals with question metadata, so dashboards point toward teaching action instead of just showing scores.",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Cognitive evaluation beyond marks",
    description: "Understanding, concept recall, method choice, execution quality, and memory are surfaced in a format people can actually use.",
    icon: ScanSearch,
  },
  {
    title: "One shared system for all stakeholders",
    description: "Teachers, students, and parents each get a role-specific view, but the product still feels like one connected learning loop.",
    icon: Layers3,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-eldas-grid px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/50 bg-white/75 px-5 py-4 shadow-panel backdrop-blur-sm">
          <div>
            <p className="eyebrow">Eldas</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink">Learning intelligence for the full classroom loop</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-5 text-sm font-semibold text-ink transition hover:bg-white"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create account
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-gradient-to-br from-[#0d2338] via-[#0f766e] to-[#67e8f9] px-6 py-10 text-white shadow-panel md:px-10 md:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />
          <div className="relative grid gap-10 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Badge className="border border-white/15 bg-white/10 py-2 text-white">AI-powered learning signals</Badge>
              <h2 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-tight md:text-6xl">
                Build a clearer picture of how students think, not just what they score.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
                Eldas gives teachers a sharper command center, students a guided learning workspace, and parents a calm progress lens.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-6 text-sm font-semibold text-ink transition hover:bg-slate-100"
                >
                  Start with Eldas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/20 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Open existing workspace
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <Card className="bg-white/12 p-5 text-white backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Classrooms</p>
                <p className="mt-3 font-display text-4xl font-bold">3 views</p>
                <p className="mt-3 text-sm leading-6 text-white/80">One platform, designed separately for teachers, students, and parents.</p>
              </Card>
              <Card className="bg-white/12 p-5 text-white backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Signals</p>
                <p className="mt-3 font-display text-4xl font-bold">5 layers</p>
                <p className="mt-3 text-sm leading-6 text-white/80">Understanding, concept, method, execution, and memory all visible in context.</p>
              </Card>
              <Card className="bg-white/12 p-5 text-white backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Workflow</p>
                <p className="mt-3 font-display text-4xl font-bold">1 loop</p>
                <p className="mt-3 text-sm leading-6 text-white/80">Classroom creation, tests, submissions, evaluation, and parent awareness stay connected.</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {roleCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-white/88 p-7">
                <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p>
                <Link to={item.cta} className="mt-6 inline-flex text-sm font-semibold text-tide transition hover:text-lagoon">
                  Open {item.title.toLowerCase()} workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="bg-white/88 p-7">
            <p className="eyebrow">Role-first onboarding</p>
            <h3 className="mt-3 font-display text-3xl font-bold text-ink">Choose the right entrance, not a generic signup.</h3>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Eldas starts people in the correct workspace on day one, so teachers see instruction tools, students see work
              to complete, and parents see progress signals that matter.
            </p>
            <div className="mt-6 space-y-3">
              {roleCards.map((item) => (
                <div key={`${item.title}-journey`} className="rounded-3xl border border-slate-100 bg-slate-50/80 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-ink">{item.title}</p>
                      <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                    </div>
                    <Link to={item.cta} className="text-sm font-semibold text-tide">
                      Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-7 text-white">
            <p className="eyebrow text-white/60">The Eldas loop</p>
            <h3 className="mt-3 font-display text-3xl font-bold">One learning signal passes through every stakeholder.</h3>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">1. Teachers</p>
                <p className="mt-3 text-sm leading-7 text-white/75">Create classrooms and structured tests with concept, step, and calculation metadata.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">2. Students</p>
                <p className="mt-3 text-sm leading-7 text-white/75">Submit typed or handwritten work and receive evaluation on understanding, method, and execution.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">3. Cognitive engine</p>
                <p className="mt-3 text-sm leading-7 text-white/75">The AI layer converts raw work into clear signals that can be acted on by the classroom.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">4. Parents</p>
                <p className="mt-3 text-sm leading-7 text-white/75">Families see warnings, recent performance, and progress summaries without needing teacher exports.</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-5 xl:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="bg-white/86 p-7">
                <div className="inline-flex rounded-2xl bg-slate-100 p-3 text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">{item.description}</p>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
