// GUIDE: Plain in-page navigation. Every "page" here is a <section id="...">
// on the same route, so ordinary anchor links are enough; next/link is for
// navigating between routes. Still a Server Component: no state, no effects.
//
// It's `fixed`, so the whole page scrolls *underneath* it. That's what makes
// the glass pill worth having: screenshots and text visibly blur through it
// as you scroll. The theme switch is its own tiny Client Component, so the
// rest of the nav stays server-rendered.

import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

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
          <ul className="flex items-center">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="focus-ring rounded-full px-1.5 py-2 text-[0.8125rem] text-muted transition-colors duration-200 hover:bg-ink/5 hover:text-ink sm:px-3.5 sm:text-sm"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
