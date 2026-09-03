import { Ask } from "@/components/Ask";
import { Contact } from "@/components/Contact";
import { Credentials } from "@/components/Credentials";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { Footer } from "@/components/Footer";
import { GitHubStrip } from "@/components/GitHubStrip";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { ProofStrip } from "@/components/ProofStrip";
import { ResearchLab } from "@/components/ResearchLab";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/Section";
import { Stack } from "@/components/Stack";
import { Systems } from "@/components/Systems";
import { DownloadIcon, ExternalIcon } from "@/components/icons";
import { profile } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-6xl px-5 sm:px-8">
        <Hero />
        <ProofStrip />

        <Section
          id="ask"
          index="01"
          title="Ask about my work"
          intro="A retrieval-grounded assistant over this portfolio. It answers only from what is published here and shows which section each answer came from."
        >
          <Reveal>
            <Ask />
          </Reveal>
        </Section>

        <Section
          id="systems"
          index="02"
          title="Systems I've built"
          intro="Ordered by weight, not by date."
        >
          <Systems />
        </Section>

        <Section
          id="research"
          index="03"
          title="Research lab"
          intro="Published, under review and under submission — with the numbers exactly as they were measured."
        >
          <ResearchLab />
        </Section>

        <Section id="experience" index="04" title="Experience">
          <ExperienceTimeline />
        </Section>

        <Section
          id="stack"
          index="05"
          title="Engineering stack"
          intro="Select a technology to see where it was actually used."
        >
          <Reveal>
            <Stack />
          </Reveal>
        </Section>

        <Section
          id="github"
          index="06"
          title="GitHub"
          intro="Selected repositories, fetched from the GitHub API and cached hourly."
        >
          <GitHubStrip />
        </Section>

        <Section id="credentials" index="07" title="Credentials">
          <Credentials />
        </Section>

        <Section
          id="resume"
          index="08"
          title="Resume"
          intro="Everything on this page is drawn from the same document."
        >
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
              >
                <ExternalIcon className="h-4 w-4" />
                View resume
              </a>
              <a
                href={profile.resume}
                download
                className="inline-flex items-center gap-2 rounded-md border border-line-strong px-5 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <DownloadIcon className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          </Reveal>
        </Section>

        <Contact />
        <Footer />
      </main>
    </>
  );
}
