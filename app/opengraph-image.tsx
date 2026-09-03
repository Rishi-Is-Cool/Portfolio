import { ImageResponse } from "next/og";
import { profile } from "@/lib/content";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Purpose-built card, not a screenshot of the page. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#060a08",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#3ecf8e",
            }}
          >
            Applied AI · GenAI Engineer
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 104,
              lineHeight: 1,
              letterSpacing: -3,
              color: "#e9f1ec",
            }}
          >
            Rishikesh Patil
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 30,
              color: "#8b9a92",
              maxWidth: 900,
            }}
          >
            I don&apos;t just study AI. I build systems with it.
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", height: 1, background: "#25342c" }} />
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 2,
              color: "#8b9a92",
            }}
          >
            RAG · Agent Orchestration · LLM Systems · Multimodal AI · ML Research
          </div>
        </div>
      </div>
    ),
    size,
  );
}
