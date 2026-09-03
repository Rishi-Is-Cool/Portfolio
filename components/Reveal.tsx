"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Section reveal. Motion here communicates structure — content arrives as you
 * reach it and then stops moving.
 *
 * Deliberately CSS-first rather than a JS animation library:
 *
 * - the hidden state is applied only when scripting is on (`html.js`), so the
 *   server-rendered page is fully visible without JavaScript;
 * - the transition runs on the compositor, so it does not compete with the
 *   canvas portrait for main-thread time;
 * - a timeout backstops the observer, because content that never appears is a
 *   far worse failure than an animation that does not play.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("is-visible");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    observer.observe(el);

    const backstop = setTimeout(show, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(backstop);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
