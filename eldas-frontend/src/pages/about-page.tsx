import { Linkedin } from "lucide-react";
import { Card } from "@/components/card";
import { SectionHeader } from "@/components/section-header";

export function AboutPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="About"
        title="Meet the founder"
        description="The person behind Eldas."
      />
      <Card className="bg-white/90 p-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <img
            src="/vishnu.png"
            alt="Vishnu Das"
            className="h-40 w-40 rounded-3xl object-cover shadow-panel flex-shrink-0"
          />
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">Vishnu Das</h2>
            <p className="mt-1 text-sm font-semibold text-tide">Founder &amp; CEO, Eldas</p>
            
              href="https://www.linkedin.com/in/vishnu-das-5b2055240"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-tide hover:text-lagoon"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <p className="mt-5 text-sm leading-7 text-slate-500">
              Vishnu Das is the visionary founder and CEO of Eldas, a pioneering AI-powered education platform
              revolutionizing personalized learning for students and educators across the globe. Holding a degree
              in computer applications from Bangalore University, Bengaluru, Vishnu bridges cutting-edge technology
              with pedagogical innovation to democratize access to high-quality education.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              With a robust foundation in full-stack development — mastering Python frameworks like FastAPI and
              Django, React for dynamic frontends, and seamless deployments via GitHub and Render — Vishnu has
              architected scalable web applications that empower users through intelligent AI-driven tools.
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              An aspiring entrepreneur with a passion for edtech's transformative potential, Vishnu excels in
              startup orchestration, from crafting compelling pitch decks to navigating deployment challenges in
              resource-constrained environments. Based in Bengaluru, he draws inspiration from India's vibrant
              tech ecosystem, advocating for AI as a catalyst for equitable education.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
    </div>
  );
}
