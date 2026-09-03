import { credentials } from "@/lib/content";
import { Reveal } from "./Reveal";
import { ExternalIcon } from "./icons";

export function Credentials() {
  return (
    <Reveal>
      <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
        {credentials.map((credential) => {
          const body = (
            <>
              <p className="text-[0.95rem] font-medium text-fg">{credential.title}</p>
              <p className="mt-1 text-[0.82rem] text-muted">{credential.issuer}</p>
              {credential.detail ? (
                <p className="mt-2 text-[0.8rem] leading-relaxed text-subtle">{credential.detail}</p>
              ) : null}
            </>
          );

          return (
            <li key={credential.title} className="bg-bg">
              {credential.href ? (
                <a
                  href={credential.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-start justify-between gap-4 px-5 py-5 transition-colors hover:bg-surface"
                >
                  <div>{body}</div>
                  <ExternalIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-subtle transition-colors group-hover:text-accent" />
                </a>
              ) : (
                <div className="h-full px-5 py-5">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
