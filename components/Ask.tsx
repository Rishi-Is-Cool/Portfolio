"use client";

import { useRef, useState } from "react";
import { suggestedQuestions } from "@/lib/knowledge";
import { ArrowIcon } from "./icons";

interface Answer {
  answer: string;
  sources: string[];
}

/**
 * Portfolio assistant. The question goes to /api/ask, which retrieves from the
 * published portfolio content and answers only from what it retrieved.
 *
 * The pending state covers exactly one real operation — the request — and
 * nothing is shown that does not correspond to work actually happening.
 */
export function Ask() {
  const [question, setQuestion] = useState("");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Answer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || pending) return;

    setPending(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data?.error === "string" ? data.error : "Something went wrong.");
      } else {
        setResult(data as Answer);
      }
    } catch {
      setError("Could not reach the assistant. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-surface">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(question);
        }}
        className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5"
      >
        <label htmlFor="ask-input" className="sr-only">
          Ask a question about this work
        </label>
        <input
          id="ask-input"
          ref={inputRef}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={300}
          autoComplete="off"
          placeholder="What is FinGuard?"
          disabled={pending}
          className="min-w-0 flex-1 bg-transparent text-[0.95rem] text-fg placeholder:text-subtle focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={pending || question.trim().length === 0}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-line-strong px-3.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Asking" : "Ask"}
          {!pending ? <ArrowIcon className="h-3.5 w-3.5" /> : null}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 px-4 py-3 sm:px-5">
        {suggestedQuestions.map((item) => (
          <button
            key={item}
            type="button"
            disabled={pending}
            onClick={() => {
              setQuestion(item);
              void submit(item);
            }}
            className="rounded-full border border-line px-3 py-1.5 text-[0.78rem] text-muted transition-colors hover:border-line-strong hover:text-fg disabled:opacity-40"
          >
            {item}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="px-4 pb-5 sm:px-5">
        {pending ? (
          <p className="flex items-center gap-2 border-t border-line pt-4 text-sm text-subtle">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Retrieving from the portfolio and answering…
          </p>
        ) : null}

        {error ? (
          <p className="border-t border-line pt-4 text-sm text-muted">{error}</p>
        ) : null}

        {result ? (
          <div className="border-t border-line pt-4">
            <p className="text-[0.95rem] leading-relaxed text-fg">{result.answer}</p>
            {result.sources.length ? (
              <div className="mt-4">
                <p className="label">Source</p>
                <ul className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                  {result.sources.map((source) => (
                    <li key={source} className="font-mono text-[0.72rem] text-muted">
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
