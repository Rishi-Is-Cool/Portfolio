import { research } from "@/lib/content";
import { Reveal } from "./Reveal";

/**
 * Research is presented as publications, not project cards: title, role,
 * venue, status, abstract, then the findings as factual callouts. No charts
 * are drawn, because the underlying benchmark data is not published here and
 * a chart without data would be decoration pretending to be evidence.
 */
export function ResearchLab() {
  return (
    <div className="divide-y divide-line border-y border-line">
      {research.map((paper, index) => (
        <Reveal key={paper.id} delay={index * 0.05}>
          <article className="grid gap-6 py-10 lg:grid-cols-[auto_1fr] lg:gap-12">
            <div className="lg:w-44">
              <p className="label">{paper.year}</p>
              <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-accent">
                {paper.role}
              </p>
              <p className="mt-3 text-[0.78rem] leading-snug text-subtle">{paper.status}</p>
            </div>

            <div>
              <h3 className="max-w-3xl text-lg font-medium leading-snug tracking-tight text-fg sm:text-xl">
                {paper.title}
              </h3>
              <p className="mt-2 text-[0.85rem] text-muted">{paper.venue}</p>

              <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted">
                {paper.abstract}
              </p>

              {paper.findings.length ? (
                <ul className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
                  {paper.findings.map((finding) => (
                    <li key={finding} className="bg-bg px-4 py-3.5 text-[0.85rem] leading-snug text-fg">
                      {finding}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5">
                {paper.topics.map((topic) => (
                  <span key={topic} className="font-mono text-[0.7rem] text-subtle">
                    {topic}
                  </span>
                ))}
              </div>

              {paper.gaps?.length ? (
                <p className="mt-5 border-l-2 border-line-strong pl-4 text-[0.85rem] leading-relaxed text-subtle">
                  <span className="text-muted">Open gaps identified:</span> {paper.gaps.join(", ")}.
                </p>
              ) : null}
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
