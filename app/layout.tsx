import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { profile, siteUrl, education } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Applied AI / GenAI Engineer building RAG systems, agent orchestration and multimodal AI. FinGuard, ACE-SER, and Springer-indexed research on continual learning and speech emotion recognition.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s — ${profile.name}`,
  },
  description,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: [
    "Applied AI Engineer",
    "GenAI Engineer",
    "RAG",
    "LangGraph",
    "Agent Orchestration",
    "Speech Emotion Recognition",
    "Continual Learning",
    profile.name,
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: `${profile.name} — ${profile.title}`,
    title: `${profile.name} — ${profile.title}`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#060a08",
  colorScheme: "dark",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  sameAs: [profile.github, profile.linkedin],
  alumniOf: { "@type": "CollegeOrUniversity", name: education.institute },
  knowsAbout: [...profile.focus],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds a `js` class to
    // <html> before hydration, which is otherwise reported as a mismatch.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* Marks scripting as available before first paint, so the reveal's
            hidden state never applies to a page that cannot un-hide it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line-strong focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:text-fg"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          // Static, author-controlled JSON built from lib/content.ts.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
