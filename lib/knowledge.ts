/**
 * Retrieval corpus for the "Ask about my work" assistant.
 *
 * Every chunk is derived from lib/content.ts — the assistant can only ground
 * answers in facts this site already publishes. Nothing private, nothing
 * inferred, and no separate copy of the facts to drift out of sync.
 */

import {
  credentials,
  education,
  experience,
  profile,
  research,
  stack,
  systems,
} from "./content";

export interface Chunk {
  id: string;
  /** Attribution shown to the visitor, e.g. "Systems → FinGuard AI". */
  source: string;
  text: string;
}

function buildCorpus(): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: "profile",
    source: "Profile",
    text: [
      `${profile.name} is an ${profile.title} based in ${profile.location}.`,
      profile.summary,
      `Focus areas: ${profile.focus.join(", ")}.`,
      `Contact: ${profile.email}. GitHub: ${profile.github}. LinkedIn: ${profile.linkedin}.`,
    ].join(" "),
  });

  chunks.push({
    id: "education",
    source: "Profile → Education",
    text: `${education.degree} at ${education.institute}, ${education.period}. CGPA ${education.cgpa}, ranked ${education.rank}.`,
  });

  for (const s of systems) {
    chunks.push({
      id: `system-${s.slug}`,
      source: `Systems → ${s.name}`,
      text: [
        `${s.name} (${s.year}, ${s.status}). ${s.summary}`,
        s.problem && `Problem: ${s.problem}`,
        s.build && `What was built: ${s.build}`,
        s.architecture.length &&
          `Architecture: ${s.architecture.map((a) => `${a.label} — ${a.detail}`).join(" ")}`,
        s.decisions.length &&
          `Technical decisions: ${s.decisions.map((d) => `${d.title}: ${d.body}`).join(" ")}`,
        s.results.length && `Results: ${s.results.join("; ")}.`,
        `Technologies: ${s.tech.join(", ")}.`,
        s.note,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  for (const r of research) {
    chunks.push({
      id: `research-${r.id}`,
      source: `Research → ${r.short}`,
      text: [
        `${r.title}. Role: ${r.role}. Venue: ${r.venue}. Status: ${r.status} (${r.year}).`,
        r.abstract,
        r.findings.length && `Findings: ${r.findings.join("; ")}.`,
        `Topics: ${r.topics.join(", ")}.`,
        r.gaps?.length && `Identified research gaps: ${r.gaps.join(", ")}.`,
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  for (const role of experience) {
    chunks.push({
      id: `experience-${role.org.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      source: `Experience → ${role.org.split(",")[0].replace(/ \(.*\)/, "")}`,
      text: `${role.title} at ${role.org}, ${role.period}, ${role.location}. ${role.points.join(" ")}`,
    });
  }

  // One chunk per group, so a question about backend work does not have to
  // outrank every frontend term in a single oversized stack blob.
  for (const group of stack) {
    chunks.push({
      id: `stack-${group.group.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      source: `Engineering Stack → ${group.group}`,
      text: `${group.group} technologies, tools and frameworks used: ${group.items
        .map((i) => (i.usedIn.length ? `${i.name} (used in ${i.usedIn.join(", ")})` : i.name))
        .join(", ")}.`,
    });
  }

  chunks.push({
    id: "credentials",
    source: "Credentials",
    text: credentials
      .map((c) => `${c.title} — ${c.issuer}${c.detail ? `: ${c.detail}` : ""}`)
      .join(" "),
  });

  return chunks;
}

export const corpus: Chunk[] = buildCorpus();

const STOPWORDS = new Set([
  "a","about","an","and","any","are","as","at","be","but","by","can","did","do","does","doing",
  "for","from","has","have","he","her","him","his","how","i","in","is","it","its","me","my","of",
  "on","or","really","she","so","tell","that","the","their","them","then","there","these","they",
  "this","to","use","used","uses","was","we","were","what","when","where","which","who","why",
  "will","with","would","you","your","rishikesh","patil",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./-]+/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^[./-]+|[./-]+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

/** Inverse document frequency over the corpus, computed once at module load. */
const idf: Map<string, number> = (() => {
  const df = new Map<string, number>();
  for (const chunk of corpus) {
    // Source is folded in so every attribution term carries a weight too.
    for (const term of new Set(tokenize(`${chunk.source} ${chunk.text}`))) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }
  const table = new Map<string, number>();
  for (const [term, count] of df) {
    table.set(term, Math.log(1 + corpus.length / count));
  }
  return table;
})();

interface Indexed {
  counts: Map<string, number>;
  length: number;
  /** Terms of the attribution path, e.g. "Systems → FinGuard AI". */
  title: Set<string>;
}

const index: Map<string, Indexed> = new Map(
  corpus.map((chunk) => {
    const counts = new Map<string, number>();
    const terms = tokenize(chunk.text);
    for (const term of terms) counts.set(term, (counts.get(term) ?? 0) + 1);
    return [chunk.id, { counts, length: terms.length, title: new Set(tokenize(chunk.source)) }];
  }),
);

const averageLength =
  [...index.values()].reduce((sum, entry) => sum + entry.length, 0) / (index.size || 1);

// Standard BM25 constants.
const K1 = 1.4;
// Moderate length normalisation: enough to stop long chunks winning on volume,
// not so much that a two-line chunk wins on a single common word.
const B = 0.5;
/** How much a hit on the chunk's own name outweighs a hit in its body. */
const TITLE_WEIGHT = 2.6;

export interface Retrieved extends Chunk {
  score: number;
}

/**
 * BM25 over the corpus, with a boost for terms that match a chunk's own name.
 * The boost matters: "Explain FinGuard" has to reach the FinGuard chunk and
 * not the stack listing, which mentions every technology and would otherwise
 * dominate on raw term frequency.
 *
 * The corpus is small enough that an exact scan beats any index — and it means
 * the retrieval step is a real operation, not a decorative loading state.
 */
export function retrieve(query: string, limit = 4): Retrieved[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];

  const scored = corpus.map((chunk) => {
    const entry = index.get(chunk.id)!;
    let score = 0;

    for (const term of terms) {
      const weight = idf.get(term);
      if (weight === undefined) continue;

      const tf = entry.counts.get(term) ?? 0;
      if (tf > 0) {
        const norm = 1 - B + (B * entry.length) / averageLength;
        score += weight * ((tf * (K1 + 1)) / (tf + K1 * norm));
      }
      if (entry.title.has(term)) score += weight * TITLE_WEIGHT;
    }

    return { ...chunk, score };
  });

  const hits = scored.filter((c) => c.score > 0).sort((a, b) => b.score - a.score);
  if (hits.length === 0) return [];

  // Keep the best hit plus anything close enough to be genuinely relevant.
  const cutoff = hits[0].score * 0.3;
  return hits.filter((c, i) => i === 0 || c.score >= cutoff).slice(0, limit);
}

export const suggestedQuestions = [
  "What is FinGuard?",
  "What is ACE-SER?",
  "What did he build at AyriTech?",
  "Tell me about his research",
  "Why is he suitable for an Applied AI role?",
] as const;
