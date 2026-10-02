// GUIDE: Reads from the `projects` array in `_lib/data.ts`. Each card is the
// screenshot itself, full-bleed, with a glass caption panel floating over its
// lower edge: the screenshot's own colors blur through the panel, which is
// the glass effect doing real work. The section stays a Server Component;
// each card is wrapped in <PointerSurface> only so a soft light can follow
// the cursor *behind* the glass panel, which makes the frosted blur visible
// as you move. The whole card is clickable (live site, else source code)
// through a full-size link layered under the panel; the icon buttons on top
// stay the keyboard and screen-reader path.
//
// Layout is an asymmetric 12-column grid (7/5, then 5/7) so the four
// projects don't read as a row of identical cards. It collapses to a single
// column below `lg`.
//
// LEVEL UP: if this list ever gets long, wrap this section in <Suspense> and
// make it an `async` component that awaits real data (a CMS or the GitHub
// API). Docs: node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { projects } from "@/app/_lib/data";
import PointerSurface from "./PointerSurface";

// Column span per position; repeats every four projects. With an odd count
// the last project would sit alone next to an empty cell, so it spans the
// full row instead (and its caption panel is capped to a readable width).
const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
];

function spanFor(index: number, count: number) {
  const isLoneLast = count % 2 === 1 && index === count - 1;
  return isLoneLast ? "lg:col-span-12" : SPANS[index % SPANS.length];
}

export default function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="scroll-mt-24 pt-28 pb-24 sm:pt-36 sm:pb-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2
            id="projects-title"
            className="text-4xl font-semibold tracking-tighter text-balance text-ink sm:text-5xl"
          >
            Selected projects
          </h2>
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-pretty text-muted">
            Client work and personal builds. I handle the whole thing, from
            branding and UI to the database and deployment.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          {projects.map((project, i) => {
            const span = spanFor(i, projects.length);
            const primaryHref = project.href ?? project.repoHref;
            return (
              <PointerSurface
                as="li"
                key={project.id}
                className={`reveal group relative isolate aspect-4/5 overflow-hidden rounded-3xl border border-line bg-surface sm:aspect-4/3 lg:aspect-auto lg:h-136 ${span}`}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} screenshot`}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.04] motion-reduce:transition-none"
                />

                {/* light that follows the cursor, diffused by the glass */}
                <div
                  aria-hidden
                  className="spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:hidden"
                />

                {/* whole-card click target for mouse users; duplicates the
                    buttons below, so it's hidden from keyboard and AT */}
                {primaryHref && (
                  <a
                    href={primaryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-hidden
                    tabIndex={-1}
                    className="absolute inset-0"
                  />
                )}

                <div
                  className={`glass-strong pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl p-5 sm:inset-x-4 sm:bottom-4 sm:p-6 ${span === "lg:col-span-12" ? "lg:right-auto lg:w-xl" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink/70">
                        {project.category}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold tracking-tight text-balance text-ink sm:text-2xl">
                        {project.title}
                      </h3>
                    </div>

                    <div className="pointer-events-auto flex shrink-0 items-center gap-2">
                      {project.repoHref && (
                        <a
                          href={project.repoHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${project.title} source code on GitHub`}
                          className="focus-ring flex size-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-200 hover:bg-ink/10"
                        >
                          <FaGithub className="size-4" aria-hidden />
                        </a>
                      )}
                      {project.href && (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Open ${project.title} live site`}
                          className="focus-ring flex size-10 items-center justify-center rounded-full bg-accent text-on-accent transition-transform duration-200 ease-out-expo hover:scale-105 active:scale-95"
                        >
                          <ArrowUpRight className="size-4" aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-2 max-w-[56ch] text-sm leading-relaxed text-ink/80">
                    {project.description}
                  </p>

                  <ul
                    className="mt-4 flex flex-wrap gap-1.5"
                    aria-label="Tech stack"
                  >
                    {project.stack.map((tech) => (
                      <li
                        key={tech}
                        translate="no"
                        className="rounded-full border border-ink/15 px-2.5 py-1 text-xs text-ink/75"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </PointerSurface>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
