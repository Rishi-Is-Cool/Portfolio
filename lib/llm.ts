/**
 * Text generation for the portfolio assistant.
 *
 * Two free-tier providers, tried in order: Groq first (fastest), Gemini as the
 * fallback. Both are plain REST calls — no vendor SDK, so the client bundle is
 * untouched and the dependency list stays short.
 *
 * Keys are read from the environment on the server only. If neither is set,
 * `generate` throws `LlmUnavailableError` and the route degrades gracefully.
 */

export class LlmUnavailableError extends Error {}
export class LlmRateLimitError extends Error {}

const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const TIMEOUT_MS = 20_000;

interface Request {
  system: string;
  prompt: string;
  maxTokens: number;
}

interface Attempt {
  name: string;
  run: (request: Request) => Promise<string>;
}

async function callGroq({ system, prompt, maxTokens }: Request): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      max_completion_tokens: maxTokens,
      // Grounded extraction from a short context — deep reasoning buys nothing
      // here and costs latency.
      reasoning_effort: "low",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (response.status === 429) throw new LlmRateLimitError("groq rate limited");
  if (!response.ok) throw new Error(`groq ${response.status}`);

  const data = await response.json();
  // `reasoning` is a separate field on these models and is deliberately ignored.
  const text: unknown = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("groq returned no text");
  return text.trim();
}

async function callGemini({ system, prompt, maxTokens }: Request): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${encodeURIComponent(
    process.env.GEMINI_API_KEY ?? "",
  )}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (response.status === 429) throw new LlmRateLimitError("gemini rate limited");
  if (!response.ok) throw new Error(`gemini ${response.status}`);

  const data = await response.json();
  const parts: unknown = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .join("")
        .trim()
    : "";
  if (!text) throw new Error("gemini returned no text");
  return text;
}

function providers(): Attempt[] {
  const available: Attempt[] = [];
  if (process.env.GROQ_API_KEY) available.push({ name: "groq", run: callGroq });
  if (process.env.GEMINI_API_KEY) available.push({ name: "gemini", run: callGemini });
  return available;
}

export function hasProvider(): boolean {
  return providers().length > 0;
}

/**
 * Runs the request against each configured provider in turn. A provider that
 * errors or times out hands off to the next; only when every one has failed
 * does the caller see an error — and if all of them were rate limited, that is
 * reported distinctly so the visitor gets an accurate message.
 */
export async function generate(request: Request): Promise<{ text: string; provider: string }> {
  const chain = providers();
  if (chain.length === 0) throw new LlmUnavailableError("no provider configured");

  let allRateLimited = true;

  for (const provider of chain) {
    try {
      const text = await provider.run(request);
      return { text, provider: provider.name };
    } catch (error) {
      if (!(error instanceof LlmRateLimitError)) allRateLimited = false;
      console.error(`[llm:${provider.name}]`, error instanceof Error ? error.message : error);
    }
  }

  if (allRateLimited) throw new LlmRateLimitError("all providers rate limited");
  throw new LlmUnavailableError("all providers failed");
}
