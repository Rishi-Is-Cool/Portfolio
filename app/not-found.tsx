import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 sm:px-8">
      <p className="label">404</p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] text-fg sm:text-5xl">
        That page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-muted">
        The link may be out of date. Everything published lives on the main page.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex w-fit items-center gap-2 rounded-md border border-line-strong px-5 py-2.5 text-sm text-fg transition-colors hover:border-accent hover:text-accent"
      >
        Back to the portfolio
        <ArrowIcon className="h-4 w-4" />
      </Link>
    </main>
  );
}
