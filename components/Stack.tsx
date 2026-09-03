"use client";

import { useState } from "react";
import { stack } from "@/lib/content";

/**
 * Selecting a technology shows where it was actually used. `usedIn` is empty
 * for anything whose project association is not verifiable, and the panel says
 * so rather than inventing a relationship.
 */
export function Stack() {
  const [selected, setSelected] = useState<{ name: string; usedIn: string[] } | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:gap-12">
      <div className="space-y-8">
        {stack.map((group) => (
          <div key={group.group}>
            <p className="label">{group.group}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((item) => {
                const active = selected?.name === item.name;
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      onClick={() => setSelected(active ? null : item)}
                      aria-pressed={active}
                      className={`rounded-md border px-3 py-1.5 text-[0.82rem] transition-colors ${
                        active
                          ? "border-accent bg-accent/10 text-fg"
                          : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <aside
        aria-live="polite"
        className="h-fit rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-24"
      >
        {selected ? (
          <>
            <p className="label">{selected.name}</p>
            {selected.usedIn.length ? (
              <>
                <p className="mt-3 text-[0.8rem] text-subtle">Used in</p>
                <ul className="mt-2 space-y-1.5">
                  {selected.usedIn.map((project) => (
                    <li key={project} className="text-[0.9rem] text-fg">
                      {project}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
                Part of the working toolkit, but not tied to a project published on this site.
              </p>
            )}
          </>
        ) : (
          <p className="text-[0.85rem] leading-relaxed text-muted">
            Select a technology to see the projects on this site where it was actually used.
          </p>
        )}
      </aside>
    </div>
  );
}
