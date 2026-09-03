"use client";

import { useState } from "react";

interface Node {
  id: string;
  label: string;
  detail: string;
}

/**
 * Interactive architecture view. Every node is a verified component of the
 * real system — nothing is added to make the diagram look fuller. Nodes are
 * buttons, so the diagram is operable by keyboard and readable by a screen
 * reader rather than being a picture of one.
 */
export function ArchitectureDiagram({
  nodes,
  caption,
}: {
  nodes: Node[];
  caption?: string;
}) {
  const [active, setActive] = useState(nodes[0]?.id ?? "");
  const selected = nodes.find((node) => node.id === active) ?? nodes[0];

  if (!nodes.length) return null;

  return (
    <div className="rounded-xl border border-line bg-surface p-4 sm:p-6">
      {caption ? <p className="label mb-4">{caption}</p> : null}

      <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-stretch">
        {nodes.map((node, i) => (
          <li key={node.id} className="flex items-center gap-2 sm:flex-1 sm:min-w-[8.5rem]">
            <button
              type="button"
              onClick={() => setActive(node.id)}
              aria-pressed={active === node.id}
              className={`w-full rounded-lg border px-3.5 py-3 text-left transition-colors ${
                active === node.id
                  ? "border-accent bg-accent/10 text-fg"
                  : "border-line bg-bg text-muted hover:border-line-strong hover:text-fg"
              }`}
            >
              <span className="block font-mono text-[0.62rem] tracking-[0.14em] text-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-1 block text-[0.82rem] font-medium leading-snug">
                {node.label}
              </span>
            </button>
            {i < nodes.length - 1 ? (
              <span aria-hidden="true" className="hidden text-line-strong sm:inline">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      <div className="mt-5 border-t border-line pt-4">
        <p className="label">{selected.label}</p>
        <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-muted">{selected.detail}</p>
      </div>
    </div>
  );
}
