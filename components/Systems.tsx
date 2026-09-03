import Link from "next/link";
import { systems, type ProjectLink } from "@/lib/content";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { Reveal } from "./Reveal";
import { ArrowIcon, ExternalIcon, GitHubIcon } from "./icons";

function LinkChip({ link }: { link: ProjectLink }) {
  const external = link.href.startsWith("http");
  const Icon = link.kind === "GitHub" ? GitHubIcon : external ? ExternalIcon : ArrowIcon;

  const className =
    "inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted transition-colors hover:border-accent hover:text-accent";

  if (external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        <Icon className="h-3.5 w-3.5" />
        {link.kind}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      <Icon className="h-3.5 w-3.5" />
      {link.kind}
    </Link>
  );
}

function TechList({ tech }: { tech: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {tech.map((item) => (
        <li key={item} className="font-mono text-[0.7rem] tracking-wide text-subtle">
          {item}
        </li>
      ))}
    </ul>
  );
}

function TierLabel({ children }: { children: string }) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <span className="label whitespace-nowrap">{children}</span>
      <span className="hairline flex-1" />
    </div>
  );
}

export function Systems() {
  const flagship = systems.find((s) => s.tier === "flagship")!;
  const research = systems.find((s) => s.tier === "research")!;
  const selected = systems.filter((s) => s.tier === "selected");
  const earlier = systems.filter((s) => s.tier === "earlier");

  return (
    <div className="space-y-16">
      {/* ---- Tier 1: flagship ------------------------------------------- */}
      <Reveal>
        <TierLabel>Featured system</TierLabel>
        <article className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
              {flagship.name}
            </h3>
            <span className="rounded-full border border-accent-dim px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent">
              {flagship.status}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">
            {flagship.summary}
          </p>

          <div className="mt-7">
            <ArchitectureDiagram
              nodes={flagship.architecture.map(({ id, label, detail }) => ({ id, label, detail }))}
              caption="System components"
            />
          </div>

          {flagship.note ? (
            <p className="mt-5 border-l-2 border-line-strong pl-4 text-[0.85rem] leading-relaxed text-subtle">
              {flagship.note}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <TechList tech={flagship.tech} />
            <div className="flex flex-wrap gap-2">
              {flagship.links.map((link) => (
                <LinkChip key={link.kind} link={link} />
              ))}
            </div>
          </div>
        </article>
      </Reveal>

      {/* ---- Tier 1: research system ------------------------------------ */}
      <Reveal>
        <TierLabel>Research system</TierLabel>
        <article className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
              {research.name}
            </h3>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-subtle">
              {research.year}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-muted">{research.summary}</p>

          <div className="mt-7">
            <ArchitectureDiagram
              nodes={research.architecture.map(({ id, label, detail }) => ({ id, label, detail }))}
              caption="Modules"
            />
          </div>

          {research.results.length ? (
            <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {research.results.map((result) => (
                <div key={result} className="bg-bg px-4 py-4">
                  <dd className="text-[0.85rem] leading-snug text-fg">{result}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {research.note ? (
            <p className="mt-5 border-l-2 border-line-strong pl-4 text-[0.85rem] leading-relaxed text-subtle">
              {research.note}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <TechList tech={research.tech} />
            <div className="flex flex-wrap gap-2">
              {research.links.map((link) => (
                <LinkChip key={link.kind} link={link} />
              ))}
            </div>
          </div>
        </article>
      </Reveal>

      {/* ---- Tier 2: selected builds ------------------------------------ */}
      <Reveal>
        <TierLabel>Selected builds</TierLabel>
        <div className="grid gap-4 sm:grid-cols-2">
          {selected.map((system) => (
            <article key={system.slug} className="card flex flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-lg font-medium tracking-tight text-fg">{system.name}</h3>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-subtle">
                  {system.year}
                </span>
              </div>
              <p className="mt-3 flex-1 text-[0.9rem] leading-relaxed text-muted">
                {system.summary}
              </p>
              <div className="mt-5 space-y-4">
                <TechList tech={system.tech} />
                <div className="flex flex-wrap gap-2">
                  {system.links.map((link) => (
                    <LinkChip key={link.kind} link={link} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      {/* ---- Tier 3: earlier builds ------------------------------------- */}
      {earlier.length ? (
        <Reveal>
          <TierLabel>Earlier builds</TierLabel>
          <ul className="divide-y divide-line border-y border-line">
            {earlier.map((system) => (
              <li key={system.slug}>
                <a
                  href={system.links[0]?.href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4 transition-colors hover:text-fg"
                >
                  <span className="text-[0.95rem] text-fg">{system.name}</span>
                  <span className="flex-1 text-[0.85rem] text-subtle">{system.summary}</span>
                  <ExternalIcon className="h-3.5 w-3.5 text-subtle transition-colors group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      ) : null}
    </div>
  );
}
