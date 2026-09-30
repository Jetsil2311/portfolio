// GUIDE: The section recruiters scan for stack fit, so it's static and
// scannable (no moving marquee). Data still comes from `_lib/data.ts`;
// `important: true` items render at full contrast with a logo, the rest are
// quieter. It sits on the canvas, not over imagery, so it's a plain surface
// panel rather than glass (see the material rules in globals.css).

import type { IconType } from "react-icons";
import {
  SiCss,
  SiExpress,
  SiHtml5,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { skills } from "@/app/_lib/data";

// Brand marks from Simple Icons, keyed by the titles used in data.ts.
// Anything without an entry (e.g. "REST APIs") renders as text only.
const LOGOS: Record<string, IconType> = {
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  Typescript: SiTypescript,
  HTML: SiHtml5,
  CSS: SiCss,
  "Node.js": SiNodedotjs,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
};

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
      className="mt-16 scroll-mt-24 sm:mt-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 rounded-3xl border border-line bg-surface/60 p-6 sm:p-8 lg:grid-cols-[12rem_1fr_1fr] lg:gap-10">
          <h2
            id="skills-title"
            className="text-lg font-semibold tracking-tight text-balance text-ink"
          >
            What I build with
          </h2>

          {skills.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm text-subtle">{group.category}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const Logo = LOGOS[item.title];
                  return (
                    <li
                      key={item.title}
                      translate="no"
                      className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm ${
                        item.important
                          ? "border-line bg-ink/5 font-medium text-ink"
                          : "border-transparent text-muted"
                      }`}
                    >
                      {Logo && <Logo className="size-3.5" aria-hidden />}
                      {item.title}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
