// GUIDE: Jobs, internships, freelance, open source. Same pattern as
// Projects: content lives in `_lib/data.ts`, this component maps over it.
// Two-column layout: the heading sticks on the left while entries scroll on
// the right (plain CSS `sticky`, no JS). Collapses to one column below `lg`.

import { experience } from "@/app/_lib/data";

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="scroll-mt-24 border-t border-line py-24 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2
              id="experience-title"
              className="text-4xl font-semibold tracking-tighter text-ink sm:text-5xl"
            >
              Experience
            </h2>
            <p className="mt-4 max-w-xs leading-relaxed text-muted">
              Currently building new projects and experiences.
            </p>
          </div>
        </div>

        <ol className="space-y-16 lg:col-span-8">
          {experience.map((item) => (
            <li key={item.id} className="reveal">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {item.role}
                </h3>
                <p className="font-mono text-sm text-subtle tabular-nums">
                  {item.period}
                </p>
              </div>
              <p className="mt-1 font-medium text-accent-ink">
                {item.organization}
              </p>

              <ul className="mt-8 space-y-5">
                {item.highlights.map((point, i) => (
                  <li
                    key={i}
                    className="relative max-w-[62ch] pl-7 leading-relaxed text-pretty text-muted before:absolute before:top-[0.75em] before:left-0 before:h-px before:w-4 before:bg-accent"
                  >
                    {point}
                  </li>
                ))}
              </ul>

              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tech stack">
                {item.stack.map((tech) => (
                  <li
                    key={tech}
                    translate="no"
                    className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
