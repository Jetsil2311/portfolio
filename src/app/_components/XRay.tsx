// The seam. Left of it, the product as a customer sees it (taste). Right of it,
// the same screenshot gone dark, with its parts outlined and named (tools). A
// real range input drives it, so arrow keys, touch and screen readers all work.
// When it first scrolls into view the seam sweeps once to teach the gesture.
//
// Motion note: the position is written straight to a CSS variable, never React
// state, so dragging doesn't re-render anything.

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Region } from "@/app/_lib/data";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  regions: Region[];
  sizes?: string;
  title: string;
  className?: string;
  /** The product is dark already, so the tools layer lifts it instead of dimming it. */
  darkSource?: boolean;
  /** side = image and legend in two columns from `lg` (for portrait images) */
  layout?: "stack" | "side";
};

export default function XRay({ src, alt, width, height, regions, sizes = "(min-width: 1500px) 1436px, 100vw", title, className = "", darkSource = false, layout = "stack" }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const touched = useRef(false);
  const [hot, setHot] = useState<number | null>(null);

  const place = (value: number) => {
    frame.current?.style.setProperty("--seam", `${value}%`);
    if (input.current) input.current.value = String(value);
  };

  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const stops = [100, 18, 50];
        const legMs = 1100;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = (now - start) / legMs;
          const leg = Math.min(Math.floor(t), stops.length - 2);
          const p = Math.min(t - leg, 1);
          const eased = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2;
          place(stops[leg] + (stops[leg + 1] - stops[leg]) * eased);
          if (t < stops.length - 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.55 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const figure = (
    <div
      ref={frame}
      style={{ "--seam": "50%", aspectRatio: `${width} / ${height}`, maxWidth: layout === "side" ? `calc(86dvh * ${width} / ${height})` : undefined } as React.CSSProperties}
      className="glass-rim mx-auto w-full overflow-hidden rounded-2xl bg-xray select-none"
    >
      <Image src={src} alt={alt} fill sizes={sizes} draggable={false} className="object-cover" />

      {/* the tools layer, clipped to everything right of the seam */}
      <div
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0 0 var(--seam))" }}
        aria-hidden
      >
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          draggable={false}
          className={`object-cover grayscale ${darkSource ? "brightness-[0.85] contrast-[0.9]" : "brightness-[0.38] contrast-[1.15]"}`}
        />
        {regions.map((region, i) => (
          <div
            key={region.label}
            className={`absolute rounded-md border transition-colors duration-200 ${
              hot === i ? "border-xray-hot bg-xray-hot/15" : "border-xray-hot/70"
            }`}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.w}%`,
              height: `${region.h}%`,
            }}
          >
            <span className={`absolute top-0 flex items-center gap-1.5 bg-xray-hot ${region.x + region.w > 82 && !region.tagLeft ? "right-0 rounded-tr-[5px] rounded-bl-md" : "left-0 rounded-tl-[5px] rounded-br-md"} px-1.5 py-0.5 font-mono text-[0.625rem] leading-tight font-medium whitespace-nowrap text-xray sm:text-[0.6875rem]`}>
              {i + 1}
              <span className="hidden sm:inline">{region.label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* the seam and its grip */}
      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-xray-hot"
        style={{ left: "var(--seam)" }}
        aria-hidden
      >
        <div className="glass glass-lens glass-hot glass-static absolute top-1/2 left-1/2 flex h-10 -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full px-3.5 font-mono text-[0.6875rem] font-semibold whitespace-nowrap">
          <span aria-hidden>←</span>
          Taste | Tools
          <span aria-hidden>→</span>
        </div>
      </div>

      <input
        ref={input}
        type="range"
        min={0}
        max={100}
        step={0.5}
        defaultValue={50}
        aria-label={`Move the seam between ${title} and how it is built`}
        onInput={(event) => {
          touched.current = true;
          place(Number(event.currentTarget.value));
        }}
        className="xray-range absolute inset-0 m-0 size-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-xray-hot"
      />
    </div>
  );

  const legend = (
    <ol className={`grid gap-x-8 gap-y-5 ${layout === "side" ? "" : "mt-6 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {regions.map((region, i) => (
        <li
          key={region.label}
          onPointerEnter={() => setHot(i)}
          onPointerLeave={() => setHot(null)}
          className="flex gap-3"
        >
          <span aria-hidden className="mt-px flex size-5 shrink-0 items-center justify-center rounded bg-xray font-mono text-[0.6875rem] text-xray-hot">
            {i + 1}
          </span>
          <p className="text-[0.9375rem] leading-snug">
            <span className="font-mono text-[0.8125rem] font-medium">{region.label}</span>
            <span className="mt-0.5 block text-muted">{region.note}</span>
          </p>
        </li>
      ))}
    </ol>
  );

  if (layout === "side") {
    return (
      <div className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${className}`}>
        {figure}
        {legend}
      </div>
    );
  }

  return (
    <div className={className}>
      {figure}
      {legend}
    </div>
  );
}
