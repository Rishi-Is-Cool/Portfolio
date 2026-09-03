import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, ExternalIcon, GitHubIcon } from "@/components/icons";
import { profile, systems } from "@/lib/content";

/** Only systems with a case study get a page — no stub pages. */
const caseStudies = systems.filter((system) =>
  system.links.some((link) => link.kind === "Case Study"),
);

export function generateStaticParams() {
  return caseStudies.map((system) => ({ slug: system.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const system = caseStudies.find((s) => s.slug === slug);
  if (!system) return {};

  return {
    title: `${system.name} — Case Study`,
    description: system.summary,
    alternates: { canonical: `/systems/${system.slug}` },
    openGraph: {
      title: `${system.name} — ${profile.name}`,
      description: system.summary,
      url: `/systems/${system.slug}`,
    },
  };
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-10">
      <h2 className="label">{label}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = caseStudies.find((s) => s.slug === slug);
  if (!system) notFound();

  const externalLinks = system.links.filter((link) => link.kind !== "Case Study");

  return (
    <main id="main" className="mx-auto max-w-4xl px-5 pb-24 pt-24 sm:px-8">
      <Link
        href="/#systems"
        className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-subtle transition-colors hover:text-fg"
      >
        <ArrowIcon className="h-3.5 w-3.5 rotate-180" />
        All systems
      </Link>

      <Reveal>
        <header className="mt-8">
          <p className="label">
            {system.category} · {system.year}
          </p>
          <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl">
            {system.name}
          </h1>
          <p className="mt-5 max-w-2xl text-[1.05rem] leading-relaxed text-muted">
            {system.summary}
          </p>
        </header>
      </Reveal>

      <div className="mt-12">
        <Block label="Problem">
          <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted">{system.problem}</p>
        </Block>

        <Block label="What was built">
          <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted">{system.build}</p>
        </Block>

        {system.architecture.length ? (
          <Block label={system.slug === "ace-ser" ? "Modules" : "Architecture"}>
            <ArchitectureDiagram
              nodes={system.architecture.map(({ id, label, detail }) => ({ id, label, detail }))}
            />
          </Block>
        ) : null}

        {system.decisions.length ? (
          <Block label="Technical decisions">
            <div className="grid gap-4 sm:grid-cols-2">
              {system.decisions.map((decision) => (
                <article key={decision.title} className="rounded-xl border border-line p-5">
                  <h3 className="text-[0.95rem] font-medium text-fg">{decision.title}</h3>
                  <p className="mt-2 text-[0.88rem] leading-relaxed text-muted">{decision.body}</p>
                </article>
              ))}
            </div>
          </Block>
        ) : null}

        <Block label="Results">
          {system.results.length ? (
            <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
              {system.results.map((result) => (
                <li key={result} className="bg-bg px-5 py-5 text-[0.9rem] leading-snug text-fg">
                  {result}
                </li>
              ))}
            </ul>
          ) : (
            <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted">
              No results are published yet. Numbers will appear here when the evaluation is
              finalised — not before.
            </p>
          )}
        </Block>

        <Block label="Current status">
          <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted">
            {system.status}
            {system.note ? ` — ${system.note}` : ""}
          </p>
        </Block>

        <Block label="Technologies">
          <ul className="flex flex-wrap gap-2">
            {system.tech.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-line bg-surface px-3 py-1.5 font-mono text-[0.72rem] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Block>

        <Block label="Links">
          {externalLinks.length ? (
            <ul className="flex flex-wrap gap-2">
              {externalLinks.map((link) => (
                <li key={link.kind}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent"
                  >
                    {link.kind === "GitHub" ? (
                      <GitHubIcon className="h-3.5 w-3.5" />
                    ) : (
                      <ExternalIcon className="h-3.5 w-3.5" />
                    )}
                    {link.kind}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Nothing public to link yet. Ask me about it at{" "}
              <a
                href={`mailto:${profile.email}`}
                className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
              >
                {profile.email}
              </a>
              .
            </p>
          )}
        </Block>
      </div>
    </main>
  );
}
