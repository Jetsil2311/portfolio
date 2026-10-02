// GUIDE: The first thing a recruiter sees, so it answers three questions in
// one glance: who (name), what (role, availability), and proof (real shipped
// work on the right). Still a Server Component: every effect here is CSS
// driven by variables that the small <PointerSurface> client wrappers write
// (see PointerSurface.tsx and the pointer utilities in globals.css).
//
// The right side is a composition of real project work. At rest every piece
// is anchored to an edge:
// - the browser screenshot's right edge lines up with the page container
//   (the same edge the nav ends on); a second print (Nativa) is tucked
//   exactly behind it, invisible until the pile spreads
// - the 5+ glass card is flush with the screenshot's right edge and centered
//   on its bottom edge, half on / half off, so the image blurs through it
// - the phone (a transparent cutout of the Stride app) overlaps the
//   screenshot's left edge and defines the bottom of the box; the text
//   column is bottom-aligned to it (`lg:items-end`)
//
// Interaction, in three independent CSS channels so they never fight:
// - `transform`: the entrance animation (animate-rise)
// - `translate` on each piece's outer wrapper: parallax, each at its own
//   `--depth`, so the pile shifts in layers as the mouse moves over the hero
// - `translate` + `rotate` + `scale` on each piece's inner element: hovering
//   the composition throws the prints apart like photos tossed on a desk
//   (staggered, with a slight spring); hovering one piece lifts it to the top
// Hover styles only apply on devices that actually hover (Tailwind v4 wraps
// `hover:` in `@media (hover: hover)`), and all motion is off for
// prefers-reduced-motion.

import Image from "next/image";
import { ArrowRight, Download } from "lucide-react";
import PointerSurface from "./PointerSurface";

// Shared by the real <h1> and its aria-hidden shine overlay; they must render
// identically for the glint to sit exactly on the letters.
const HEADLINE =
  "text-5xl leading-[1.02] font-semibold tracking-tighter text-balance sm:text-6xl lg:text-[3.5rem] xl:text-6xl";

// How each print moves when the pile is thrown, and how it settles back.
const PILE_MOTION =
  "transition-[translate,rotate,scale] duration-700 ease-spring motion-reduce:transition-none";

export default function Hero() {
  return (
    <PointerSurface
      as="section"
      id="hero"
      className="relative isolate scroll-mt-24 pt-28 sm:pt-36"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7 lg:pb-14">
          <PointerSurface className="group/headline relative motion-safe:animate-rise">
            <h1 className={`${HEADLINE} text-ink`}>
              Jethro Cruz
              <span className="block text-subtle">Fullstack developer.</span>
            </h1>
            {/* the shine: same text, transparent, with an accent glint at the
                cursor clipped to the letter shapes */}
            <p
              aria-hidden
              className={`${HEADLINE} text-shine pointer-events-none absolute inset-0 bg-clip-text text-transparent opacity-0 transition-opacity duration-500 select-none group-hover/headline:opacity-100 motion-reduce:hidden`}
            >
              Jethro Cruz
              <span className="block">Fullstack developer.</span>
            </p>
          </PointerSurface>

          {/* availability lives in the sentence itself, set in the strongest
              text color, instead of a status badge */}
          <p className="mt-6 max-w-136 text-lg leading-relaxed text-pretty text-muted motion-safe:animate-rise motion-safe:[animation-delay:100ms]">
            I ship production React apps for real businesses: café ordering
            platforms, POS systems and iOS apps.{" "}
            <span className="font-medium text-ink">Open to remote roles.</span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 motion-safe:animate-rise motion-safe:[animation-delay:180ms]">
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
            {/* hidden print: Nativa POS, exactly behind the screenshot at
                rest, slides out to the upper left when the pile is thrown */}
            <div className="parallax absolute top-0 right-0 w-[88%] [--depth:6] hover:z-10 motion-safe:animate-rise motion-safe:[animation-delay:200ms]">
              <div
                className={`overflow-hidden rounded-2xl border border-line shadow-lift ${PILE_MOTION} hover:scale-[1.03] motion-safe:group-hover/stack:-translate-x-28 motion-safe:group-hover/stack:-translate-y-10 motion-safe:group-hover/stack:-rotate-8`}
              >
                <div className="relative aspect-16/10">
                  <Image
                    src="/projects/nativa.png"
                    alt="Nativa POS digital menu, drinks category"
                    fill
                    sizes="(min-width: 1024px) 34vw, 88vw"
                    className="object-cover object-top-left"
                  />
                </div>
              </div>
            </div>

            {/* back: browser screenshot, right edge = container edge */}
            <div className="parallax absolute top-0 right-0 w-[88%] [--depth:10] hover:z-10 motion-safe:animate-rise motion-safe:[animation-delay:200ms]">
              <div
                className={`overflow-hidden rounded-2xl border border-line shadow-lift delay-50 ${PILE_MOTION} hover:scale-[1.03] motion-safe:group-hover/stack:translate-x-5 motion-safe:group-hover/stack:-translate-y-5 motion-safe:group-hover/stack:rotate-4`}
              >
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
            </div>

            {/* middle: Stride phone, overlapping the screenshot's left edge;
                its bottom (30% + 33% x 762/390 = 94.5% of width) is the box's
                bottom */}
            <div className="parallax absolute top-[31.6%] left-0 w-[33%] drop-shadow-float [--depth:18] hover:z-10 motion-safe:animate-rise motion-safe:[animation-delay:320ms]">
              <div
                className={`delay-100 ${PILE_MOTION} hover:scale-[1.04] motion-safe:group-hover/stack:-translate-x-10 motion-safe:group-hover/stack:translate-y-6 motion-safe:group-hover/stack:-rotate-10`}
              >
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
            </div>

            {/* front: floating glass card, flush right, centered on the
                screenshot's bottom edge (88% width x 10/16 = 55% of the box
                width = 57.9% of its height) */}
            <div className="absolute top-[57.9%] right-0 w-[58%] -translate-y-1/2 hover:z-10 sm:w-1/2">
              <div className="parallax [--depth:26]">
                <div
                  className={`glass-strong rounded-2xl p-4 delay-150 sm:p-5 ${PILE_MOTION} hover:scale-[1.03] motion-safe:animate-rise motion-safe:[animation-delay:450ms] motion-safe:group-hover/stack:translate-x-6 motion-safe:group-hover/stack:translate-y-10 motion-safe:group-hover/stack:rotate-5`}
                >
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
      </div>
    </PointerSurface>
  );
}
