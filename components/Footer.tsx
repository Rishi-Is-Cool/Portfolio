import { profile } from "@/lib/content";

export function Footer() {
  const links = [
    { label: "GitHub", href: profile.github },
    { label: "LinkedIn", href: profile.linkedin },
    { label: "Email", href: `mailto:${profile.email}` },
    { label: "Resume", href: profile.resume },
  ];

  return (
    <footer className="border-t border-line py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.95rem] font-medium text-fg">{profile.name}</p>
          <p className="mt-1 text-[0.85rem] text-muted">{profile.title}</p>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-subtle transition-colors hover:text-fg"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <p className="font-mono text-[0.68rem] tracking-wide text-subtle">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
