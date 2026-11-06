// All page copy that isn't tied to a single demo. Every claim here traces back
// to the project repos or the CV; when a project changes, update it here.

export const LOCATION = "Estado de México, México";

export type WorldId = "bk" | "nativa" | "tally" | "stride";

export const REPOS = {
  bk: "https://github.com/Jetsil2311/bk-menu-app",
  tally: "https://github.com/Jetsil2311/tally-app",
  stride: "https://github.com/Jetsil2311/stride",
};

export const LIVE = {
  bk: "https://bubblekaapeh.vercel.app/",
  nativa: "https://nativa-menu.vercel.app/",
  tally: "https://t-ally.vercel.app/",
};

export const worlds: {
  id: WorldId;
  name: string;
  line: string;
  image: string;
  alt: string;
  position: string;
}[] = [
  {
    id: "bk",
    name: "Bubble Kaapeh",
    line: "A café's brand, ordering menu and register.",
    image: "/work/poster-pumpkin.webp",
    alt: "Pumpkin Spice Latte poster from the Bubble Kaapeh menu",
    position: "object-center",
  },
  {
    id: "nativa",
    name: "Nativa",
    line: "A restaurant's menu and a register that prints.",
    image: "/work/nat-phone.webp",
    alt: "Nativa digital menu on a phone",
    position: "object-center",
  },
  {
    id: "tally",
    name: "Tally",
    line: "A finance app you can ask before you buy.",
    image: "/work/tally-phone.webp",
    alt: "Tally home screen with sample data",
    position: "object-top",
  },
  {
    id: "stride",
    name: "Stride",
    line: "An iOS map built for people on foot.",
    image: "/work/stride-walk.webp",
    alt: "Stride iOS app during a walk, with the route on a dark map",
    position: "object-center",
  },
];

export type Region = {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  note: string;
  /** keep the tag on the left even though the region reaches the right edge */
  tagLeft?: boolean;
};

export type Tool = {
  name: string;
  where: string;
  did: string;
  file: string;
  code: string;
};

// Snippets are excerpts copied from the repos. A "..." marks an omission;
// nothing else is changed except line breaks.
export const tools: Tool[] = [
  {
    name: "React",
    where: "Bubble Kaapeh",
    did: "Built the builder as a pure view of its data: the cup draws whatever the selections derive, so new ingredients need no code.",
    file: "bk-menu-app/src/utils/drinkBuilder.js",
    code: `if (step.visual === 'liquid') visual.liquids = chosen.map((o) => ({ id: o.id, color: o.color }))
if (step.visual === 'pearls') visual.pearls.push(...chosen.map((o) => ({ id: o.id, color: o.color })))
if (step.visual === 'foam') visual.foam = { id: chosen[0].id, color: chosen[0].color }
if (step.visual === 'ice') visual.ice = { id: chosen[0].id, amount: chosen[0].amount }`,
  },
  {
    name: "Next.js",
    where: "Tally",
    did: "Streams each page behind Suspense and proxies the assistant's answers, so the session token stays in an httpOnly cookie the browser never reads.",
    file: "tally-app/src/app/api/chat/route.ts",
    code: `const type = upstream.headers.get("content-type") ?? "application/json";
return new Response(upstream.body, {
  status: upstream.status,
  headers: { "Content-Type": type, "Cache-Control": "no-cache, no-transform", ... },
});`,
  },
  {
    name: "TypeScript",
    where: "Stride, Tally",
    did: "Typed the scoring functions to ask only for the fields they read, so any report shape can be scored.",
    file: "stride/utils/areaScore.ts",
    code: `export function calculateAreaScore<
  T extends Pick<Report, "impact" | "timestamp" | "coordinate">
>(reports: T[]): number`,
  },
  {
    name: "React Native",
    where: "Stride",
    did: "Built the iOS app with Expo and NativeWind, including a background task that keeps logging location fixes.",
    file: "stride/services/locationLogging.ts",
    code: `TaskManager.defineTask(LOCATION_LOGGING_TASK, async ({ data, error }) => { ... })
...
await Location.startLocationUpdatesAsync(LOCATION_LOGGING_TASK, { ... })`,
  },
  {
    name: "Swift",
    where: "Stride",
    did: "Wrote the native module that puts the safety level on the Lock Screen and in the Dynamic Island, callable from JavaScript.",
    file: "stride/ios/StrideLiveActivities.swift",
    code: `let activity = try Activity.request(attributes: attributes, content: content, pushType: nil)
resolve(activity.id)`,
  },
  {
    name: "Supabase + PostGIS",
    where: "Stride",
    did: "Stores reports as geography points and pushes new ones to every open map as they are written.",
    file: "stride/context/ReportsContext.tsx",
    code: `const channel = supabase
  .channel("reports_realtime")
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "reports" },
    (payload) => { ... }
  )`,
  },
  {
    name: "Firebase",
    where: "Bubble Kaapeh, Nativa",
    did: "Runs menus, orders and stock on Firestore. Rules let anyone place an order but validate its exact shape, and only staff can read it back.",
    file: "bk-menu-app/firestore.rules",
    code: `allow create: if request.resource.data.keys().hasOnly([...])
  && request.resource.data.status == 'pending'
  ...
  && request.resource.data.items.size() <= 60
  ...
  && request.resource.data.createdAt == request.time;
allow read, update, delete: if request.auth != null;`,
  },
  {
    name: "Node.js",
    where: "Bubble Kaapeh, Tally",
    did: "Wrote a read-only POS API so Tally can pull the café's books. Keys are looked up by hash, scoped, and can be revoked. Finance math is unit-tested.",
    file: "bk-menu-app/server/posApi/auth.js",
    code: `const ref = db.collection(API_KEYS_COLLECTION).doc(await hashApiKey(key))
const snap = await ref.get()
if (!snap.exists || snap.data().revokedAt)
  throw new ApiError(401, 'invalid_key', 'This key does not exist or was revoked')`,
  },
  {
    name: "WebUSB",
    where: "Nativa, Bubble Kaapeh",
    did: "Prints receipts and kitchen tickets directly from the browser with raw ESC/POS bytes, and rasterizes the logo to 1-bit for the print head.",
    file: "bk-menu-app/src/utils/printing/usbPrinter.js",
    code: `init:     () => new Uint8Array([ESC, 0x40]),
cutPaper: () => new Uint8Array([GS,  0x56, 0x41, 0x03]),
...
await device.transferOut(ep.endpointNumber, data)`,
  },
  {
    name: "Tailwind CSS",
    where: "All four",
    did: "Gives each product its own token set, so a redesign or a new client changes values and not components.",
    file: "bk-menu-app/src/index.css",
    code: `--color-taro: #e4d6f5;    --color-taro-ink: #5b3f86;
--color-matcha: #dcebc4;  --color-matcha-ink: #3f5a1f;
--color-mango: #ffe3a3;   --color-mango-ink: #7a4b00;`,
  },
];

export const alsoUsed = ["JavaScript", "Express", "PostgreSQL", "MongoDB", "MySQL", "Docker", "Mapbox", "Stripe", "Cloudinary", "REST APIs", "Git"];

export const experience = {
  role: "Fullstack Developer",
  organization: "Freelance",
  period: "Feb 2026 - Present",
  highlights: [
    "Designed and built two production SaaS platforms using React, Express and NativeWind, so local businesses can take orders online.",
    "Built the React menu and ordering platform for Bubble Kaapeh, now adopted by 5+ restaurant and café clients.",
    "Designed an ordering platform and POS system tailored to Nativa.",
  ],
};
