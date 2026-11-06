// "Can I afford it?", Tally's signature question. The month's numbers are the
// sample data from Tally's own landing page. The verdict here follows simple
// local rules and says so in the caption; in the app, Buck's answer streams
// from the API.

"use client";

import { useEffect, useState } from "react";
import { BUCK_PATH, BUCK_VIEWBOX } from "@/app/_lib/buck";

const IN = 4120;
const OUT = 1843.3;
const LEFT = IN - OUT;

const money = (n: number) =>
  `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function verdict(price: number) {
  if (price > LEFT) return { text: `Not this month. You'd be ${money(price - LEFT)} short.`, tone: "#ff6b6b" };
  if (price > LEFT * 0.75) return { text: "Only if nothing else comes up this month.", tone: "#ff9d57" };
  if (price > 300) return { text: "It fits, but it's tight.", tone: "#f4c75b" };
  return { text: "It fits. Nothing to worry about.", tone: "#2fd08f" };
}

function useTyped(text: string) {
  const [count, setCount] = useState(text.length);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    const timer = window.setInterval(() => {
      n += 2;
      setCount(n);
      if (n >= text.length) window.clearInterval(timer);
    }, 26);
    return () => window.clearInterval(timer);
  }, [text]);
  return text.slice(0, count);
}

export default function BuckCheck() {
  const [price, setPrice] = useState(500);
  const v = verdict(price);
  const typed = useTyped(v.text);
  const afterPrice = LEFT - price;
  const pct = (n: number) => `${Math.max(0, (n / IN) * 100)}%`;

  return (
    <div className="glass-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-2">
      <div className="flex flex-col justify-center gap-7 p-6 sm:p-10">
        <div>
          <label htmlFor="afford" className="block font-tally text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.08] font-bold tracking-[-0.03em] text-[#f3f1ff]">
            Can I afford headphones for{" "}
            <output htmlFor="afford" className="text-[#b6a6ff] tabular-nums">${price.toLocaleString("en-US")}</output>?
          </label>
          <input
            id="afford"
            type="range"
            min={50}
            max={3000}
            step={10}
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            className="demo-range mt-5 w-full text-[#f3f1ff] [--thumb:#8f76ff]"
          />
        </div>

        <div className="flex items-start gap-3" aria-live="polite">
          <svg viewBox={BUCK_VIEWBOX} className="mt-0.5 size-9 shrink-0" aria-hidden>
            <defs>
              <linearGradient id="buck-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff5c9d" />
                <stop offset="1" stopColor="#6f4fff" />
              </linearGradient>
            </defs>
            <path d={BUCK_PATH} fill="url(#buck-grad)" />
          </svg>
          <p className="min-h-[3.2em] font-tally text-xl leading-snug font-medium sm:text-2xl" style={{ color: v.tone }}>
            {typed}
          </p>
        </div>
      </div>

      {/* the month, from the sample data in Tally's landing page */}
      <div className="flex flex-col justify-center gap-5 border-t border-line p-6 sm:p-10 lg:border-t-0 lg:border-l">
        <div className="glass-rim rounded-3xl bg-linear-135 from-[#6f4fff] via-[#5a3fe0] to-[#8f46d8] p-6 text-[#f3f1ff] shadow-[inset_0_1px_1px_#ffffff80,0_16px_44px_-10px_#6f4fffb3]">
          <p className="text-sm opacity-85">Left this month</p>
          <p className="mt-1 font-tally text-[clamp(2.25rem,4.4vw,3.75rem)] leading-none font-bold tracking-[-0.03em] tabular-nums">
            {money(Math.max(afterPrice, 0))}
          </p>
        </div>

        <div>
          <div className="flex h-3 gap-1">
            <span className="rounded-full bg-[#f06b52] transition-[width] duration-300 ease-out-expo" style={{ width: pct(OUT) }} />
            <span className="rounded-full bg-[#ff5c9d] transition-[width] duration-300 ease-out-expo" style={{ width: pct(Math.min(price, LEFT)) }} />
            <span className="flex-1 rounded-full bg-[#2fd08f]" />
          </div>
          <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="text-muted">In</dt>
              <dd className="mt-0.5 font-tally text-base font-semibold tabular-nums sm:text-lg">{money(IN)}</dd>
            </div>
            <div>
              <dt className="text-muted">Out</dt>
              <dd className="mt-0.5 font-tally text-base font-semibold tabular-nums sm:text-lg">{money(OUT)}</dd>
            </div>
            <div>
              <dt className="text-muted">This buy</dt>
              <dd className="mt-0.5 font-tally text-base font-semibold text-[#ff8fb9] tabular-nums sm:text-lg">{money(price)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
