import { education, experience } from "@/lib/content";
import { Reveal } from "./Reveal";
import { ExternalIcon } from "./icons";

export function ExperienceTimeline() {
  return (
    <div>
      <ol className="relative border-l border-line pl-6 sm:pl-8">
        {experience.map((role, index) => (
          <li key={`${role.org}-${role.title}`} className="pb-10 last:pb-0">
            <Reveal delay={index * 0.05}>
              <span
                aria-hidden="true"
                className={`absolute -left-[5px] mt-2 h-2.5 w-2.5 rounded-full border ${
                  role.current ? "border-accent bg-accent" : "border-line-strong bg-bg"
                }`}
              />

              <div
                className={`rounded-xl border p-5 sm:p-6 ${
                  role.current
                    ? "border-line-strong bg-surface"
                    : "border-line bg-transparent"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3
                    className={`font-medium tracking-tight text-fg ${
                      role.current ? "text-lg sm:text-xl" : "text-base sm:text-lg"
                    }`}
                  >
                    {role.title}
                  </h3>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-subtle">
                    {role.period}
                  </span>
                </div>

                <p className="mt-1 text-[0.9rem] text-muted">
                  {role.org} · {role.location}
                </p>

                <ul className="mt-4 space-y-2">
                  {role.points.map((point) => (
                    <li
                      key={point}
                      className="relative pl-4 text-[0.9rem] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1 before:w-1 before:rounded-full before:bg-line-strong"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                {role.link ? (
                  <a
                    href={role.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent"
                  >
                    <ExternalIcon className="h-3.5 w-3.5" />
                    {role.link.label}
                  </a>
                ) : null}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal>
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 rounded-xl border border-line px-5 py-5 sm:px-6">
          <div>
            <p className="label">Education</p>
            <p className="mt-2 text-[0.95rem] text-fg">{education.degree}</p>
            <p className="mt-1 text-[0.85rem] text-muted">{education.institute}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-subtle">
              {education.period}
            </p>
            <p className="mt-2 text-[0.95rem] text-fg">
              CGPA {education.cgpa} · {education.rank}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
