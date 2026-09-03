import { profile } from "@/lib/content";
import { Portrait } from "./Portrait";
import { ArrowIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

const FOCUS = ["RAG", "Agents", "LLMs", "Multimodal AI", "Full-Stack Engineering"];

export function Hero() {
  return (
    <section id="top" className="relative pt-28 sm:pt-36">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-field" aria-hidden="true" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div>
          <p className="label">{profile.location} · Available for Applied AI roles</p>

          <h1 className="mt-5 text-[length:var(--text-display)] font-medium leading-[0.95] tracking-[-0.03em] text-fg">
            Rishikesh
            <br />
            Patil
          </h1>

          <p className="mt-6 text-xl font-normal tracking-tight text-fg sm:text-2xl">
            {profile.title}
          </p>

          <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted">
            {FOCUS.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                {i > 0 ? (
                  <span aria-hidden="true" className="text-line-strong">
                    ·
                  </span>
                ) : null}
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-xl text-[1.05rem] leading-relaxed text-muted">
            I build systems with AI, not demos about it — retrieval pipelines, agent graphs and
            efficient speech models, taken from problem statement through to evaluation.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#systems"
              className="group inline-flex items-center gap-2 rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            >
              Explore my systems
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
            >
              <DownloadIcon className="h-4 w-4" />
              View resume
            </a>
          </div>

          <div className="mt-9 flex items-center gap-5 text-muted">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-fg"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="transition-colors hover:text-fg"
            >
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="transition-colors hover:text-fg"
            >
              <MailIcon className="h-[18px] w-[18px]" />
            </a>
            <span className="hairline hidden flex-1 sm:block" />
          </div>
        </div>

        <div className="order-first mx-auto w-full max-w-[280px] lg:order-none lg:max-w-none">
          <Portrait />
        </div>
      </div>
    </section>
  );
}
