// GUIDE: The first thing a recruiter sees, so it answers three questions in
// one glance: who (name), what (role), and proof (real shipped work on the
// right). Server Component: the entrance animation is pure CSS
// (`animate-rise` from globals.css), so no client JS ships for it.
//
// The right side is a composition of real project work, where every piece
// is anchored to an edge rather than placed by eye:
// - the browser screenshot's right edge lines up with the page container
//   (the same edge the nav ends on)
// - the 5+ glass card is flush with the screenshot's right edge and centered
//   on its bottom edge, half on / half off, so the image blurs through it
// - the phone (a transparent cutout of the Stride app) overlaps the
//   screenshot's left edge and defines the bottom of the box; the text
//   column is bottom-aligned to it (`lg:items-end`)
// All overlaps stay inside the composition; `isolate` keeps their stacking
// local to this section.
// Hovering the composition spreads the pieces apart. That uses the
// `translate`/`rotate` properties (Tailwind v4's translate-*/rotate-*), which
// are separate from `transform`, so it doesn't fight the entrance animation.

import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative isolate scroll-mt-24 pt-28 sm:pt-36">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7 lg:pb-14">
          <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted motion-safe:animate-rise">
            {/* real state, not decoration: availability */}
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            Open to remote fullstack roles
          </p>

          <h1 className="mt-6 text-5xl leading-[1.02] font-semibold tracking-tighter text-balance text-ink motion-safe:animate-rise motion-safe:[animation-delay:80ms] sm:text-6xl lg:text-[3.5rem] xl:text-6xl">
            Jethro Cruz
            <span className="block text-subtle">Fullstack developer.</span>
          </h1>

          <p className="mt-6 max-w-136 text-lg leading-relaxed text-pretty text-muted motion-safe:animate-rise motion-safe:[animation-delay:160ms]">
            I build and ship production React apps for real businesses, from
            café ordering platforms to POS systems and iOS apps.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 motion-safe:animate-rise motion-safe:[animation-delay:240ms]">
            <a
              href="#projects"
              className="group focus-ring inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-on-accent shadow-lift transition-transform duration-300 ease-out-expo hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              View Projects
              <ArrowRight
                className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
            <a
              href="/cv.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex h-12 items-center gap-2 rounded-full border border-line px-6 text-sm font-medium text-ink transition-[transform,background-color] duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-ink/5 active:translate-y-0 active:scale-[0.98]"
            >
              Download CV
              <Download className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        {/* Work composition. Positions are % of the box (aspect 20:19, i.e.
            height = 95% of width), so it scales as one unit from phone to
            desktop. */}
        <div className="group/stack relative mx-auto w-full max-w-136 lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-20/19">
            {/* back: browser screenshot, right edge = container edge */}
            <div className="absolute top-0 right-0 w-[88%] overflow-hidden rounded-2xl border border-line shadow-lift transition-[translate] duration-700 ease-out-expo motion-safe:animate-rise motion-safe:[animation-delay:200ms] motion-safe:group-hover/stack:translate-x-2 motion-safe:group-hover/stack:-translate-y-2">
              <div className="relative aspect-16/10">
                <Image
                  src="/projects/bubblekaapeh.png"
                  alt="Bubble Kaapeh digital menu, showing a featured iced latte promotion"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 34vw, 88vw"
                  className="object-cover object-top-left"
                />
              </div>
            </div>

            {/* middle: Stride phone, overlapping the screenshot's left edge;
                its bottom (30% + 33% x 762/390 = 94.5% of width) is the box's
                bottom */}
            <div className="absolute top-[31.6%] left-0 w-[33%] drop-shadow-float transition-[translate,rotate] duration-700 ease-out-expo motion-safe:animate-rise motion-safe:[animation-delay:320ms] motion-safe:group-hover/stack:-translate-x-3 motion-safe:group-hover/stack:translate-y-1 motion-safe:group-hover/stack:-rotate-3">
              {/* `unoptimized`: this is already a small, pre-sized WebP with
                  transparency, and the image optimizer stalls re-encoding it */}
              <Image
                src="/projects/stride-phone.webp"
                alt="Stride Mobility iOS app, map view with walk controls"
                width={390}
                height={762}
                loading="eager"
                unoptimized
                className="h-auto w-full"
              />
            </div>

            {/* front: floating glass card, flush right, centered on the
                screenshot's bottom edge (88% width x 10/16 = 55% of the box
                width = 57.9% of its height) */}
            <div className="absolute top-[57.9%] right-0 w-[58%] -translate-y-1/2 sm:w-1/2">
              <div className="glass-strong rounded-2xl p-4 transition-[translate] duration-700 ease-out-expo motion-safe:animate-rise motion-safe:[animation-delay:450ms] motion-safe:group-hover/stack:translate-x-2 motion-safe:group-hover/stack:translate-y-3 sm:p-5">
                <p className="text-xs font-medium whitespace-nowrap text-ink/70">
                  Freelance, since Feb 2026
                </p>
                <p className="mt-2 text-4xl font-semibold tracking-tighter text-ink tabular-nums sm:text-5xl">
                  5+
                </p>
                <p className="mt-1 text-sm leading-snug text-pretty text-ink/80">
                  cafés and restaurants run on platforms I built
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
