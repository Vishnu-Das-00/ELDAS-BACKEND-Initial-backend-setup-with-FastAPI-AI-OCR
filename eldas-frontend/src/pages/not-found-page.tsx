import { Link } from "react-router-dom";

import { Card } from "@/components/card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-eldas-grid px-4">
      <Card className="max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">This page drifted out of orbit.</h1>
        <p className="mt-4 text-sm text-slate-500">
          The route you opened does not exist, or your role does not have access to it anymore.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Return to Eldas
          </Link>
        </div>
      </Card>
    </div>
  );
}
