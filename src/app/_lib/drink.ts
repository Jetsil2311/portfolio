// The "Arma tu bebida" logic from the Bubble Kaapeh menu
// (bk-menu-app/src/utils/drinkBuilder.js), with types added. In production the
// config below is a Firestore document; here it's the repo's sample document
// translated to English.

export type DrinkOption = {
  id: string;
  name: string;
  priceModifier: number;
  color?: string;
  amount?: number;
  showIf?: Record<string, string[]>;
};

export type DrinkStep = {
  id: string;
  name: string;
  type: "single" | "multi";
  required: boolean;
  maxSelections?: number;
  visual: "liquid" | "pearls" | "foam" | "ice" | "none";
  showIf?: Record<string, string[]>;
  options: DrinkOption[];
};

export type DrinkConfig = { basePrice: number; steps: DrinkStep[] };
export type Selections = Record<string, string[]>;

export type CupVisual = {
  liquids: { id: string; color?: string }[];
  pearls: { id: string; color?: string }[];
  foam: { id: string; color?: string } | null;
  ice: { id: string; amount: number } | null;
};

export const DRINK_CONFIG: DrinkConfig = {
  basePrice: 55,
  steps: [
    {
      id: "base",
      name: "Base",
      type: "single",
      required: true,
      visual: "liquid",
      options: [
        { id: "milk", name: "Creamy milk", priceModifier: 0, color: "#f6efe4" },
        { id: "soda", name: "Mineral water", priceModifier: 0, color: "#e2f2f6" },
        { id: "espresso", name: "Espresso", priceModifier: 5, color: "#7a4a32" },
      ],
    },
    {
      id: "flavor",
      name: "Flavor, up to two",
      type: "multi",
      maxSelections: 2,
      required: true,
      visual: "liquid",
      options: [
        { id: "taro", name: "Taro", priceModifier: 0, color: "#c9b3e6", showIf: { base: ["milk"] } },
        { id: "mango", name: "Mango", priceModifier: 0, color: "#ffc94d" },
        { id: "strawberry", name: "Strawberry", priceModifier: 0, color: "#ff8fa3" },
        { id: "blueberry", name: "Blueberry", priceModifier: 0, color: "#7d78d8" },
        { id: "matcha", name: "Matcha", priceModifier: 10, color: "#9cc66b", showIf: { base: ["milk"] } },
        { id: "kiwi", name: "Kiwi", priceModifier: 0, color: "#a8d86e" },
        { id: "caramel", name: "Caramel", priceModifier: 0, color: "#c8894a" },
        { id: "mocha", name: "Mocha", priceModifier: 0, color: "#6e4330" },
      ],
    },
    {
      id: "style",
      name: "Style",
      type: "single",
      required: true,
      visual: "none",
      options: [
        { id: "iced", name: "Iced", priceModifier: 0 },
        { id: "frappe", name: "Frappé", priceModifier: 5 },
        { id: "hot", name: "Hot", priceModifier: 0 },
      ],
    },
    {
      id: "ice",
      name: "Ice",
      type: "single",
      required: false,
      visual: "ice",
      showIf: { style: ["iced", "frappe"] },
      options: [
        { id: "normal", name: "Normal", amount: 1, priceModifier: 0 },
        { id: "less", name: "Less ice", amount: 0.5, priceModifier: 0 },
        { id: "none", name: "No ice", amount: 0, priceModifier: 0 },
      ],
    },
    {
      id: "pearls",
      name: "Pearls, up to two",
      type: "multi",
      maxSelections: 2,
      required: false,
      visual: "pearls",
      options: [
        { id: "tapioca", name: "Tapioca", priceModifier: 0, color: "#3a2016" },
        { id: "pop-strawberry", name: "Popping strawberry", priceModifier: 10, color: "#ff5c7a" },
        { id: "pop-mango", name: "Popping mango", priceModifier: 10, color: "#ffb000" },
      ],
    },
    {
      id: "top",
      name: "On top",
      type: "single",
      required: false,
      visual: "foam",
      options: [
        { id: "cloud", name: "Cloud top", priceModifier: 15, color: "#fff7ec" },
        { id: "cloud-taro", name: "Taro cloud", priceModifier: 15, color: "#e4d6f5" },
      ],
    },
  ],
};

// True when a showIf rule is satisfied by the current selections.
export const conditionMet = (showIf: DrinkStep["showIf"], selections: Selections) =>
  !showIf ||
  Object.entries(showIf).every(([stepId, ids]) =>
    (selections[stepId] || []).some((id) => ids.includes(id)),
  );

// What the customer can choose right now, with picks that no longer apply
// removed. Conditions only look at earlier steps, so one pass settles it.
export const resolveBuilder = (config: DrinkConfig, selections: Selections) => {
  const steps: DrinkStep[] = [];
  const kept: Selections = {};
  for (const step of config.steps) {
    if (!conditionMet(step.showIf, kept)) continue;
    const options = step.options.filter((o) => conditionMet(o.showIf, kept));
    if (!options.length) continue;
    steps.push(options.length === step.options.length ? step : { ...step, options });
    const ids = (selections[step.id] || []).filter((id) => options.some((o) => o.id === id));
    if (ids.length) kept[step.id] = ids;
  }
  return { config: { ...config, steps }, selections: kept };
};

export const toggleSelection = (selections: Selections, step: DrinkStep, optionId: string): Selections => {
  const current = selections[step.id] || [];
  if (step.type === "single") {
    // Tapping the chosen option again clears it only when the step is optional.
    if (current[0] === optionId) return step.required ? selections : { ...selections, [step.id]: [] };
    return { ...selections, [step.id]: [optionId] };
  }
  if (current.includes(optionId)) {
    return { ...selections, [step.id]: current.filter((id) => id !== optionId) };
  }
  if (step.maxSelections && current.length >= step.maxSelections) {
    // At the limit: the oldest choice makes room for the new one.
    return { ...selections, [step.id]: [...current.slice(1), optionId] };
  }
  return { ...selections, [step.id]: [...current, optionId] };
};

export const selectedOptionsOf = (step: DrinkStep, selections: Selections) => {
  const ids = selections[step.id] || [];
  return ids
    .map((id) => step.options.find((o) => o.id === id))
    .filter((o): o is DrinkOption => Boolean(o));
};

export const computeTotal = (config: DrinkConfig, selections: Selections) =>
  config.steps.reduce(
    (sum, step) => sum + selectedOptionsOf(step, selections).reduce((s, o) => s + o.priceModifier, 0),
    config.basePrice,
  );

// What the animated cup draws.
export const deriveCupVisual = (config: DrinkConfig, selections: Selections): CupVisual => {
  const visual: CupVisual = { liquids: [], pearls: [], foam: null, ice: null };
  for (const step of config.steps) {
    const chosen = selectedOptionsOf(step, selections);
    if (!chosen.length) continue;
    // The latest liquid step wins: once flavors are picked they color the
    // drink (the base is mixed into them), before that the base shows.
    if (step.visual === "liquid") visual.liquids = chosen.map((o) => ({ id: o.id, color: o.color }));
    if (step.visual === "pearls") visual.pearls.push(...chosen.map((o) => ({ id: o.id, color: o.color })));
    if (step.visual === "foam") visual.foam = { id: chosen[0].id, color: chosen[0].color };
    if (step.visual === "ice") visual.ice = { id: chosen[0].id, amount: chosen[0].amount ?? 1 };
  }
  return visual;
};

// Random but valid drink: every required step gets something, optional steps
// get something about half the time, conditions are respected.
export const randomSelections = (config: DrinkConfig, rand = Math.random) => {
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const out: Selections = {};
  for (const step of config.steps) {
    if (!conditionMet(step.showIf, out)) continue;
    const options = step.options.filter((o) => conditionMet(o.showIf, out));
    if (!options.length) continue;
    if (!step.required && rand() < 0.4) {
      out[step.id] = [];
      continue;
    }
    if (step.type === "single") {
      out[step.id] = [pick(options).id];
      continue;
    }
    const limit = Math.min(step.maxSelections || 2, options.length, 2);
    const count = 1 + Math.floor(rand() * limit);
    const pool = [...options];
    const chosen: string[] = [];
    while (chosen.length < count && pool.length) {
      chosen.push(pool.splice(Math.floor(rand() * pool.length), 1)[0].id);
    }
    out[step.id] = chosen;
  }
  return out;
};

const NAME_PATTERNS = ["Cloud of", "Galaxy of", "Wave of", "Swirl of", "Burst of"];

// Production picks a pattern at random when the summary opens. Here the name
// shows on every render, so it's derived from the choice to stay stable.
export const suggestName = (config: DrinkConfig, selections: Selections) => {
  const liquids = config.steps
    .filter((s) => s.visual === "liquid")
    .flatMap((s) => selectedOptionsOf(s, selections));
  const star = liquids[liquids.length - 1];
  if (!star) return "";
  const hash = [...star.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  return `${NAME_PATTERNS[hash % NAME_PATTERNS.length]} ${star.name}`;
};
