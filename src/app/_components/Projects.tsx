// GUIDE: Reads from the `projects` array in `_lib/data.ts`. Each project
// gets a `next/image`-friendly slot if you add screenshots later, and plain
// <a> tags for demo/repo links (external URLs — again, no next/link needed,
// that component is only for internal route navigation).
//
// LEVEL UP: if this list ever gets long, this is a good place to learn
// Suspense streaming — wrap this section in <Suspense> from "react" and
// make Projects an `async` component that awaits real data (e.g. from a
// CMS or your GitHub API) so the rest of the page can render immediately
// while this section streams in. Docs: node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md

"use client";

import { useState } from "react";
import Image from "next/image";

import { projects } from "@/app/_lib/data";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { MdOpenInNew } from "react-icons/md";
import { SectionHeader } from "./SectionHeader";

// Shared glow shadows, pulled out so the spots that use them (image frame,
// icon buttons) stay in sync and the JSX below isn't repeating the same
// arbitrary box-shadow value several times. Color comes from the
// `--color-accent` theme token in globals.css — the same purple used for
// Hero's glow — so this section reads as a continuation of Hero, not a
// different palette.
//
// IMPORTANT: Tailwind generates CSS by scanning the literal text of source
// files for class-shaped strings — it doesn't evaluate JS. So these consts
// have to be the *complete* class, variant prefix included; something like
// `` `group-hover:${IMAGE_GLOW}` `` would never appear as a real substring
// anywhere in this file, so Tailwind would silently skip generating it.
const IMAGE_GLOW = "shadow-[0_0_90px_20px_var(--color-accent)]/25";
const ICON_GLOW = "group-hover:shadow-[0_0_20px_3px_var(--color-accent)]/35";

// Glass panel treatment reused for every translucent surface in this
// section (image frame, project rows, pills, icon buttons) so they all
// read as one consistent material instead of one-off styles per element.
const GLASS =
  "border border-white/10 bg-white/5 backdrop-blur-md";

export default function Projects() {
  // `hoveredProject` drives which preview shows on the left. It has to be
  // React state (not just CSS `:hover`) because hovering a row on the right
  // needs to change what's rendered in a completely different part of the
  // tree. Everything else below (arrow, colors, icon buttons) reacts to
  // hover with plain Tailwind `group-hover:`, no state needed.
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section
      id="projects"
      className="relative scroll-mt-16 px-6 py-24 sm:px-8"
    >
      {/* Ambient glows — same recipe as Hero (color, opacity, blur), just
          moved to the opposite corners so the two sections read as one
          continuous background rather than a jarring repeat. */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-150 w-150 rounded-full bg-orange-500 opacity-15 blur-[250px]"
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 h-150 w-150 rounded-full bg-purple-600 opacity-15 blur-[200px]"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
        {/* Preview column: desktop only — every project is mounted at once,
            stacked on top of each other, and crossfades via opacity/scale.
            Swapping which one is *visible* (instead of filtering the array
            down to just the hovered project) is what makes this smooth —
            an element that's removed and re-added to the DOM can't
            transition, only an element whose classes change can. */}
        <div className="relative hidden lg:block lg:h-110">
          {projects.map((project) => {
            const isActive = project.id === hoveredProject;

            return (
              <article
                key={project.id}
                aria-hidden={!isActive}
                className={`
                  absolute inset-0
                  transition-all duration-700 ease-in-out
                  ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
                `}
              >
                {/* Outer wrapper has no `overflow-hidden`, unlike the sharp
                    image below it, on purpose — the blurred glow has to be
                    allowed to spill past the image's own edges to read as
                    ambient light instead of just a fuzzy border. */}
                <div className="relative h-110 w-full">
                  {/* Color glow: the same image again, scaled up and blurred
                      into mush. Since it's literally the photo's own pixels,
                      the glow color always matches that image with zero
                      color-extraction logic — no canvas, no palette library.
                      Purely decorative, so it's aria-hidden with empty alt;
                      the real <Image> below carries the actual alt text.
                      `quality` is dropped low since blur-3xl destroys any
                      fine detail anyway — no reason to ship full-res bytes
                      for pixels nobody can resolve. */}
                  <Image
                    src={project.image}
                    alt=""
                    aria-hidden
                    fill
                    quality={20}
                    className={`
                      absolute inset-0 -z-10 scale-95 rounded-2xl object-cover
                      blur-3xl saturate-150
                      transition-opacity duration-700 ease-in-out
                      ${isActive ? "opacity-70" : "opacity-0"}
                    `}
                  />
                  <div
                    className={`
                      relative h-110 w-full overflow-hidden rounded-2xl
                      border border-white/10
                      transition-shadow duration-700 ease-in-out
                      ${isActive ? IMAGE_GLOW : "shadow-none"}
                    `}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={500}
                      height={500}
                      className="h-110 w-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-4 text-zinc-300">{project.description}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className={`${GLASS} rounded-full px-3 py-1 text-xs text-slate-300`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>

        {/* Index column: the list itself. On mobile (no hover), each row
            carries its own thumbnail/description/stack inline instead of
            relying on the preview column above, which is hidden below lg. */}
        <div>
          <SectionHeader>Projects</SectionHeader>

          <div className="space-y-5">
            {projects.map((project) => (
              <div
                key={project.id}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`
                  group relative overflow-hidden rounded-2xl
                  ${GLASS} p-5
                  transition-all duration-300 ease-out
                  hover:border-accent/50 hover:bg-white/8
                  hover:shadow-[0_0_40px_-10px_var(--color-accent)]/40
                `}
              >
                {/* mobile-only thumbnail — the crossfade preview column is
                    hidden below lg, so this is the only visual on phones */}
                <div className="mb-4 overflow-hidden rounded-xl lg:hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={600}
                    height={340}
                    className="h-40 w-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Fixed-width slot so the title doesn't jump sideways
                        when the arrow fades in — only opacity/position
                        animate, nothing shifts layout. */}
                    <span
                      className={`
                        hidden w-5 shrink-0 items-center justify-center
                        -translate-x-2 text-accent opacity-0
                        transition-all duration-300 ease-out
                        group-hover:translate-x-0 group-hover:opacity-100
                        lg:flex
                      `}
                      aria-hidden
                    >
                      <ArrowRight className="h-5 w-5" />
                    </span>
                    <span className="truncate text-xl font-bold text-white">
                      {project.title}
                    </span>
                  </div>

                  <span
                    className={`${GLASS} hidden shrink-0 rounded-full px-3 py-1 text-xs text-slate-300 sm:inline-flex`}
                  >
                    {project.category}
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={project.repoHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${project.title} source on GitHub`}
                      aria-disabled={!project.repoHref}
                      tabIndex={project.repoHref ? 0 : -1}
                      className={`
                        flex h-10 w-10 items-center justify-center rounded-full
                        ${GLASS}
                        transition-all duration-300 ease-out
                        focus-visible:outline-2 focus-visible:outline-accent
                        ${project.repoHref
                          ? `text-slate-200 hover:border-accent/60 hover:bg-accent/15 hover:text-accent ${ICON_GLOW}`
                          : "pointer-events-none text-slate-600"}
                      `}
                    >
                      <FaGithub className="h-4 w-4" />
                    </a>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${project.title} live demo`}
                      aria-disabled={!project.href}
                      tabIndex={project.href ? 0 : -1}
                      className={`
                        flex h-10 w-10 items-center justify-center rounded-full
                        ${GLASS}
                        transition-all duration-300 ease-out
                        focus-visible:outline-2 focus-visible:outline-accent
                        ${project.href
                          ? `text-slate-200 hover:border-accent/60 hover:bg-accent/15 hover:text-accent ${ICON_GLOW}`
                          : "pointer-events-none text-slate-600"}
                      `}
                    >
                      <MdOpenInNew className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* mobile-only description + stack — desktop shows these in
                    the preview column instead */}
                <p className="mt-3 text-sm text-zinc-300 lg:hidden">
                  {project.description}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2 lg:hidden">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className={`${GLASS} rounded-full px-3 py-1 text-xs text-slate-300`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
