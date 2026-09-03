import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** Shared section shell: monospace index label, heading, hairline, content. */
export function Section({
  id,
  index,
  title,
  intro,
  children,
  className = "",
}: {
  id: string;
  index: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-t border-line py-20 sm:py-28 ${className}`}>
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span className="label">{index}</span>
          <h2 className="text-[length:var(--text-section)] font-medium tracking-tight text-fg">
            {title}
          </h2>
        </div>
        {intro ? <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-muted">{intro}</p> : null}
      </Reveal>
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  );
}
