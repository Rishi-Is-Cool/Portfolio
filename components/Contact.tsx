import { profile } from "@/lib/content";
import { Reveal } from "./Reveal";
import { ArrowIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";

const CHANNELS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, Icon: MailIcon },
  { label: "LinkedIn", value: "rishikesh-patil", href: profile.linkedin, Icon: LinkedInIcon },
  { label: "GitHub", value: profile.githubUser, href: profile.github, Icon: GitHubIcon },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-20 sm:py-28">
      <Reveal>
        <h2 className="max-w-3xl text-[length:var(--text-display)] font-medium leading-[0.95] tracking-[-0.03em] text-fg">
          Let&apos;s build something intelligent.
        </h2>

        <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-muted">
          Open to Applied AI and GenAI engineering roles, and to research collaboration on
          retrieval, agents and efficient speech models.
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {CHANNELS.map(({ label, value, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group bg-bg px-5 py-6 transition-colors hover:bg-surface"
            >
              <p className="label flex items-center gap-2">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </p>
              <p className="mt-2.5 flex items-center gap-2 break-all text-[0.95rem] text-fg">
                {value}
                <ArrowIcon className="h-3.5 w-3.5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
              </p>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
