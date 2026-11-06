// The stack, as a claim you can check: each tool is a big word; open one and it
// says what I made it do, where, and shows the real code. It's one DOM order for
// every width. Below `lg` the panel opens inline under its tool; from `lg` it's
// taken out of flow and pinned to the right column of the list.

"use client";

import { useState } from "react";
import { alsoUsed, tools } from "@/app/_lib/data";

export default function Toolbox() {
  const [active, setActive] = useState(0);

  return (
    <section id="skills" data-world="base" aria-labelledby="skills-title" className="scroll-mt-20 pt-28 pb-24 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <h2 id="skills-title" className="max-w-4xl text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.04] font-medium tracking-[-0.03em] text-balance">
          No skill bars. Here&apos;s what each tool did.
        </h2>

        <ul className="relative mt-12 sm:mt-16 lg:w-1/2 lg:min-h-[44rem]">
          {tools.map((tool, i) => {
            const open = active === i;
            return (
              <li key={tool.name} className="border-b border-line first:border-t lg:border-0 lg:first:border-t-0">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`tool-${i}`}
                  onClick={() => setActive(i)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setActive(i);
                  }}
                  onFocus={() => setActive(i)}
                  className={`focus-ring block w-full rounded-md py-3 text-left text-[clamp(1.875rem,4.1vw,3.75rem)] leading-[1.08] font-medium tracking-[-0.03em] transition-[color,transform] duration-300 ease-out-expo lg:py-1 ${
                    open ? "text-ink lg:translate-x-3" : "text-ink/35 hover:text-ink/70"
                  }`}
                >
                  {tool.name}
                </button>

                <div
                  id={`tool-${i}`}
                  hidden={!open}
                  className="pt-1 pb-6 lg:absolute lg:top-0 lg:left-[calc(100%+1rem)] lg:w-[calc(100%-1rem)] lg:pt-2 lg:pb-0"
                >
                  <p className="text-sm text-muted">{tool.where}</p>
                  <p className="mt-2 max-w-[52ch] text-xl leading-snug font-medium text-pretty sm:text-2xl">{tool.did}</p>
                  <figure className="glass-dark mt-6 overflow-hidden rounded-xl font-mono text-xray-ink">
                    <figcaption className="border-b border-xray-line px-4 py-2.5 text-[0.6875rem] break-all text-xray-dim">{tool.file}</figcaption>
                    <pre className="overflow-x-auto p-4 text-xs leading-relaxed sm:text-[0.8125rem]">
                      <code>{tool.code}</code>
                    </pre>
                  </figure>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 max-w-[70ch] text-lg leading-relaxed text-muted">
          Also in the box: <span className="text-ink">{alsoUsed.join(", ")}</span>.
        </p>
      </div>
    </section>
  );
}
