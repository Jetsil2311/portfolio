// Plain in-page navigation. Its colors are the world tokens, so it changes with
// the page. The two interactive bits (scroll-spy links, theme switch) are their
// own small Client Components.

import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pt-2">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-[1500px] items-center justify-between gap-2 px-5 sm:px-8"
      >
        <a href="#hero" className="focus-ring glass glass-bar glass-lens flex h-11 items-center rounded-full px-4 font-medium tracking-tight text-ink">
          <span className="sm:hidden" aria-hidden>
            JC
          </span>
          <span className="sr-only sm:not-sr-only">Jethro Cruz</span>
        </a>

        <div className="glass glass-bar glass-lens glass-static flex items-center gap-0.5 rounded-full p-1">
          <NavLinks />
          <ThemeToggle />
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring glass glass-faux glass-tint ml-1 hidden h-9 items-center rounded-full px-4 text-sm font-medium md:inline-flex"
          >
            Download CV
          </a>
        </div>
      </nav>
    </header>
  );
}
