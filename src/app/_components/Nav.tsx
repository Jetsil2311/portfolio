// GUIDE: Plain in-page navigation. Every "page" here is a <section id="...">
// on the same route, so ordinary anchor links are enough; next/link is for
// navigating between routes. Server Component; the two interactive bits
// (section links with the scroll-spy pill, and the theme switch) are their
// own small Client Components.
//
// It's `fixed`, so the whole page scrolls *underneath* it. That's what makes
// the glass pill worth having: screenshots and text visibly blur through it
// as you scroll.

import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full pr-2 pl-4 sm:pl-5"
      >
        <a
          href="#hero"
          className="focus-ring rounded-full text-sm font-semibold tracking-tight text-ink"
        >
          <span className="sm:hidden" aria-hidden>
            JC
          </span>
          <span className="sr-only sm:not-sr-only">Jethro Cruz</span>
        </a>

        <div className="flex items-center gap-1">
          <NavLinks />
          <ThemeToggle />
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring ml-1 hidden h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-canvas transition-transform duration-200 active:scale-[0.97] md:inline-flex"
          >
            Download CV
          </a>
        </div>
      </nav>
    </header>
  );
}
