// The opening sentence is also the navigation. Each project name is set in that
// project's own typeface; pointing at one (or at its strip of real work) turns
// the entire page into that product's identity. Until the visitor touches
// anything it walks through the four on its own, so the idea lands even for
// someone who only looks. That stops at the first interaction, when the hero
// leaves the screen, and never starts under prefers-reduced-motion.

"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowDown, Download } from "lucide-react";
import { LOCATION, worlds, type WorldId } from "@/app/_lib/data";
import { applyWorld } from "./WorldObserver";

const NAME_STYLE: Record<WorldId, string> = {
  bk: "font-bk font-semibold",
  nativa: "font-nat font-bold italic",
  tally: "font-tally font-bold tracking-[-0.045em]",
  stride: "font-stride font-semibold tracking-[-0.025em]",
  codeher: "font-ch font-extrabold tracking-[-0.04em]",
};

const STEP_MS = 3400;

export default function Hero() {
  const [active, setActive] = useState<WorldId | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useRef(true);
  const touched = useRef(false);

  // Keep the page in step with the active project while the hero is on screen.
  useEffect(() => {
    if (inView.current) applyWorld(active ?? "base");
  }, [active]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting;
    }, { rootMargin: "-50% 0px -49.9% 0px" });
    observer.observe(section);

    let timer = 0;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let index = -1;
      const advance = () => {
        if (touched.current) return;
        if (inView.current) {
          index = (index + 1) % worlds.length;
          setActive(worlds[index].id);
        }
        timer = window.setTimeout(advance, STEP_MS);
      };
      timer = window.setTimeout(advance, 1400);
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  function point(id: WorldId) {
    touched.current = true;
    setActive(id);
  }

  const current = worlds.find((world) => world.id === active);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-world={active ?? "base"}
      className="relative mx-auto grid min-h-dvh w-full max-w-[1500px] grid-cols-1 gap-8 px-5 pt-24 pb-8 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:pt-28"
    >
      <div className="flex flex-col justify-between gap-8 lg:col-span-7">
        <h1 className="text-[clamp(2.35rem,5.1vw,5.1rem)] leading-[1.1] font-medium tracking-[-0.03em] text-ink motion-safe:animate-rise">
          I&apos;m Jethro Cruz. I design and build what runs{" "}
          {worlds.map((world, i) => (
            <span key={world.id}>
              <a
                href={`#${world.id}`}
                onPointerEnter={() => point(world.id)}
                onFocus={() => point(world.id)}
                aria-current={active === world.id ? "true" : undefined}
                className={`focus-ring -mx-[0.08em] rounded-[0.22em] px-[0.08em] pb-[0.04em] whitespace-nowrap ${
                  active === world.id
                    ? "glass glass-faux glass-tint glass-static"
                    : "underline decoration-1 decoration-line underline-offset-[0.14em]"
                } ${NAME_STYLE[world.id]}`}
              >
                {world.name}
              </a>
              {i < worlds.length - 2 ? ", " : i === worlds.length - 2 ? " and " : ""}
            </span>
          ))}
          , from the brand to the database.
        </h1>

        <div className="motion-safe:animate-rise motion-safe:[animation-delay:120ms]">
          <p className="text-lg text-muted sm:text-xl">
            Fullstack developer based in {LOCATION}. Open to remote roles.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group focus-ring glass glass-tint inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium"
            >
              See the work
              <ArrowDown className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5" aria-hidden />
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring glass inline-flex h-12 items-center gap-2 rounded-full px-6 font-medium text-ink"
            >
              Download CV
              <Download className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      {/* Four strips of real work. The active one opens up. */}
      <div className="flex min-h-[44dvh] flex-col gap-3 motion-safe:animate-rise motion-safe:[animation-delay:220ms] lg:col-span-5 lg:min-h-0">
        <ul className="flex min-h-0 flex-1 gap-2 sm:gap-3">
          {worlds.map((world, i) => (
            <li
              key={world.id}
              style={{ "--grow": active === world.id ? 5 : active ? 1 : 1.6 } as CSSProperties}
              className="glass-rim min-w-0 grow-[var(--grow)] basis-0 overflow-hidden rounded-2xl bg-ink/10 transition-[flex-grow] duration-700 ease-out-expo motion-reduce:transition-none"
            >
              <a
                href={`#${world.id}`}
                onPointerEnter={() => point(world.id)}
                aria-label={`${world.name}: ${world.line}`}
                tabIndex={-1}
                className="absolute inset-0 block"
              >
                <Image
                  src={world.image}
                  alt={world.alt}
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  sizes="(min-width: 1024px) 30vw, 70vw"
                  className={`object-cover ${world.position}`}
                />
              </a>
            </li>
          ))}
        </ul>
        <p className="min-h-[1.5em] text-muted" aria-live="off">
          {current ? (
            <>
              <span className="font-medium text-ink">{current.name}.</span> {current.line}
            </>
          ) : (
            "Five products, five identities, one person."
          )}
        </p>
      </div>
    </section>
  );
}
