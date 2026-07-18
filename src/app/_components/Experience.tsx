// GUIDE: Your "past works" — jobs, internships, freelance, open source.
// Same pattern as Projects: content lives in `_lib/data.ts`, this component
// just maps over it.

import { experience } from "@/app/_lib/data";
import { SectionHeader } from "./SectionHeader";

// Same glass-panel treatment as Projects.tsx (border/bg/blur), reused here
// only for the tech-stack badges — entries themselves are plain text, not
// cards, since there's nothing interactive about them.
const GLASS = "border border-white/10 bg-white/5 backdrop-blur-md";

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative scroll-mt-16 px-6 py-24 sm:px-8"
    >
      {/* Ambient glows — same recipe as Hero/Projects, corners swapped from
          Projects' so the light reads as continuous scrolling down the page. */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-150 w-150 rounded-full bg-purple-600 opacity-15 blur-[200px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-150 w-150 rounded-full bg-orange-500 opacity-15 blur-[200px]" />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader>Experience</SectionHeader>
        {/* TODO: populate `experience` in src/app/_lib/data.ts */}
        <div className="mt-6 divide-y divide-white/10">
          {experience.map((item) => (
            <article key={item.id} className="py-8 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-xl font-bold text-white">
                  {item.role} <span className="text-accent">·</span>{" "}
                  {item.organization}
                </h3>
                <span className="shrink-0 text-sm text-zinc-500">
                  {item.period}
                </span>
              </div>

              <ul className="mt-3 space-y-2">
                {item.highlights.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-zinc-300">
                    <span
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span className="w-[75%]">{point}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-4 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <li
                    key={tech}
                    className={`${GLASS} rounded-full px-3 py-1 text-xs text-slate-300`}
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      <p className="mt-12 text-sm text-slate-400 italic">
        Currently building new projects and experiences.
      </p>
      </div>
    </section>
  );
}
