// The Bubble Kaapeh builder, playable. The panel is condensed from the
// production multi-step dialog into one view, but the rules are the real ones:
// conditional options ("Taro" needs a milk base, "Ice" disappears for a hot
// drink), max selections, live price, a valid random drink.

"use client";

import { useMemo, useState } from "react";
import { Dices } from "lucide-react";
import {
  DRINK_CONFIG,
  computeTotal,
  deriveCupVisual,
  randomSelections,
  resolveBuilder,
  suggestName,
  toggleSelection,
  type Selections,
} from "@/app/_lib/drink";
import DrinkCup from "./DrinkCup";

const START: Selections = {
  base: ["milk"],
  flavor: ["taro"],
  style: ["iced"],
  ice: ["less"],
  pearls: ["tapioca"],
};

export default function DrinkLab() {
  const [raw, setRaw] = useState<Selections>(START);
  const { config, selections } = useMemo(() => resolveBuilder(DRINK_CONFIG, raw), [raw]);
  const visual = deriveCupVisual(config, selections);
  const total = computeTotal(config, selections);
  const name = suggestName(config, selections);

  return (
    <div
      style={
        {
          "--color-accent": "#fbe594",
          "--color-surface": "#fffdf5",
          "--color-ink": "#26100b",
          "--color-latte": "#f0dcc4",
          "--color-taro": "#e4d6f5",
          "--color-matcha": "#dcebc4",
          "--color-fresa": "#ffd6d2",
          "--color-mango": "#ffe3a3",
          "--pop": "#743121",
          "--on-pop": "#fff8e6",
          "--glass-fill": "#fff8e6e6",
          "--glow": "#74312180",
        } as React.CSSProperties
      }
      className="glass-panel grid overflow-hidden rounded-[2rem] text-[#26100b] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
    >
      {/* the cup */}
      <div className="relative flex min-h-[26rem] flex-col items-center justify-center bg-[#43180df2] p-6 lg:min-h-[38rem]">
        <div className="h-72 pt-5 sm:h-96 lg:h-[29rem]">
          <DrinkCup visual={visual} label={`Your drink: ${name || "empty cup"}`} />
        </div>
        <p className="mt-4 text-center font-bk text-2xl font-semibold text-[#fff8e6]" aria-live="polite">
          {name || "Pick a base"}
        </p>
        <div className="glass glass-lens glass-static absolute top-6 right-6 rotate-6 rounded-2xl px-3.5 py-2 font-bk text-xl font-bold text-[#26100b] tabular-nums sm:text-2xl">
          ${total}
        </div>
      </div>

      {/* the choices */}
      <div className="flex flex-col gap-5 p-5 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-bk text-3xl font-semibold tracking-tight sm:text-4xl">Build a drink</h3>
          <button
            type="button"
            onClick={() => setRaw(randomSelections(DRINK_CONFIG))}
            style={{ "--pop": "#fbe594", "--on-pop": "#26100b", "--glow": "#e8b93a99" } as React.CSSProperties}
            className="glass glass-faux glass-tint inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 font-bk font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26100b]"
          >
            <Dices className="size-4" aria-hidden />
            Surprise me
          </button>
        </div>

        {config.steps.map((step) => (
          <fieldset key={step.id}>
            <legend className="mb-2 font-bk-body text-sm font-bold text-[#6b4a3f]">{step.name}</legend>
            <div className="flex flex-wrap gap-2">
              {step.options.map((option) => {
                const on = (selections[step.id] || []).includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setRaw(toggleSelection(selections, step, option.id))}
                    className={`glass glass-faux inline-flex min-h-10 items-center gap-2 rounded-full py-1 pr-3.5 pl-2 font-bk-body text-[0.9375rem] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26100b] ${
                      on ? "glass-tint" : "text-[#26100b]"
                    } ${option.color ? "" : "pl-3.5"}`}
                  >
                    {option.color && (
                      <span aria-hidden className="size-5 rounded-full border border-[#26100b1f]" style={{ background: option.color }} />
                    )}
                    {option.name}
                    {option.priceModifier > 0 && (
                      <span className={on ? "text-[#fbe594]" : "text-[#743121]"}>+${option.priceModifier}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </div>
  );
}
