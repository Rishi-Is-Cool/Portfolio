"use client";

import { useEffect, useState } from "react";
import { nav, profile } from "@/lib/content";

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="group flex items-baseline gap-2.5">
          <span className="text-sm font-medium tracking-tight text-fg">{profile.name}</span>
          <span className="label hidden sm:inline">Applied AI</span>
        </a>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={`rounded-md px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors ${
                active === item.id
                  ? "text-fg"
                  : "text-subtle hover:text-muted"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 rounded-md border border-line-strong px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Resume
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-muted md:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="border-t border-line bg-bg/95 backdrop-blur-md md:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3.5 font-mono text-xs uppercase tracking-[0.12em] text-muted"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block py-3.5 font-mono text-xs uppercase tracking-[0.12em] text-accent"
              >
                Download resume
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
