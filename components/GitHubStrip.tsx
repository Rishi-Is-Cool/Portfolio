import { formatUpdated, getRepos } from "@/lib/github";
import { profile } from "@/lib/content";
import { Reveal } from "./Reveal";
import { ExternalIcon, GitHubIcon } from "./icons";

/**
 * Server-rendered and cached for an hour. If GitHub is unreachable, rate
 * limited, or returns anything unexpected, `getRepos` yields an empty list and
 * this section renders nothing at all — the page is never blocked on it.
 */
export async function GitHubStrip() {
  const repos = await getRepos();
  if (repos.length === 0) return null;

  return (
    <Reveal>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex flex-col p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[0.92rem] font-medium text-fg">
                <GitHubIcon className="h-3.5 w-3.5 text-subtle" />
                {repo.name}
              </span>
              <ExternalIcon className="h-3.5 w-3.5 text-subtle transition-colors group-hover:text-accent" />
            </div>

            {repo.description ? (
              <p className="mt-2.5 flex-1 text-[0.85rem] leading-relaxed text-muted">
                {repo.description}
              </p>
            ) : (
              <p className="mt-2.5 flex-1" />
            )}

            <p className="mt-4 flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.1em] text-subtle">
              {repo.language ? <span>{repo.language}</span> : null}
              {repo.stars > 0 ? <span>{repo.stars} ★</span> : null}
              <span>Updated {formatUpdated(repo.pushedAt)}</span>
            </p>
          </a>
        ))}
      </div>

      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
      >
        <GitHubIcon className="h-3.5 w-3.5" />
        All repositories
      </a>
    </Reveal>
  );
}
