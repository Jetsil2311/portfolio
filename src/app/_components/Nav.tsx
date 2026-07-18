// GUIDE: Plain in-page navigation. Because every "page" here is really just
// a <section id="..."> on the same route, ordinary anchor links (<a href="#id">)
// are enough to jump around — you do NOT need next/link's <Link>, which is
// for navigating *between different routes* (it prefetches the target route's
// code). `next/link` would still work for `#hash` hrefs, but it buys you
// nothing extra here, so plain <a> keeps things simple.
//
// This stays a Server Component (no "use client" needed) because it has no
// interactivity yet. The moment you add state — e.g. a hamburger menu toggle,
// or a "highlight the section currently in view" scroll-spy — that logic
// needs `useState`/`useEffect`, and you'll add `"use client"` as the very
// first line of this file to opt it (and only it) into the client bundle.
// Docs: node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md

import { Briefcase, Code2, FolderKanban, Home, Icon, Mail, User } from "lucide-react";

const links = [
  { href: "#skills", label: "Skills", icon: Code2 },
  { href: "#projects", label: "Projects", icon: FolderKanban },
  { href: "#experience", label: "Experience", icon: Briefcase },
  { href: "#contact", label: "Contact", icon: Mail },
];

export default function Nav() {
  return (
    // `fixed` (not `sticky`) so it floats above the page as its own pill
    // instead of a full-width bar docked to the top — see the compensating
    // top padding added to Hero.tsx since this no longer takes up layout
    // space. Plain frosted glass (border + translucent fill + blur) on
    // purpose — no accent glow/gradient sheen here, that's reserved for
    // interactive elements elsewhere on the page.
    <nav className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <a
            href="#hero"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
          >
            <Home className="h-4 w-4 shrink-0" />
          </a>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.href}
              href={link.href}
              aria-label={link.label}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-zinc-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {/* icon-only on mobile to keep the pill from overflowing the
                  viewport — aria-label above still names each link */}
              <span className="hidden sm:inline">{link.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
