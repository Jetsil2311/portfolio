import { LIVE, REPOS, type Region } from "@/app/_lib/data";
import BuckCheck from "./BuckCheck";
import ProjectLinks from "./ProjectLinks";
import SourceNote from "./SourceNote";
import XRay from "./XRay";

const REGIONS: Region[] = [
  { x: 51.5, y: 10, w: 17, h: 12.6, label: "Buck over SSE", note: "Answers stream through a Next.js route handler, which adds the token the browser never sees." },
  { x: 75, y: 1.6, w: 13.5, h: 4.4, label: "Google OAuth + PKCE", note: "The server swaps the code. The session lives in an httpOnly cookie." },
  { x: 11.6, y: 24, w: 34.6, h: 16.5, label: "i18n dictionaries", note: "Spanish and English, plus any display currency." },
  { x: 59.5, y: 28, w: 20.5, h: 30, label: "cents, not floats", note: "Money is calculated in integer cents. Transfers stay out of spending totals." },
  { x: 51.6, y: 57.5, w: 15.4, h: 8.8, label: "receipt photos", note: "Buck reads the amount, store and date from a picture of the ticket." },
];

const POS_FLOW = [
  { name: "Bubble Kaapeh POS", note: "Sales, purchases, cash register" },
  { name: "GET /api/v1", note: "Read-only, scoped key, stored as a SHA-256 hash" },
  { name: "Tally workspace", note: "The café's books next to its owner's" },
];

export default function ChapterTally() {
  return (
    <article id="tally" data-world="tally" className="scroll-mt-20 pt-28 pb-24 sm:pt-40 sm:pb-36">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <header>
          <h2 className="font-tally text-[clamp(4rem,17vw,16rem)] leading-[0.92] font-bold tracking-[-0.055em]">
            Tally
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
            <p className="font-tally text-[clamp(1.5rem,3vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.025em] text-balance lg:col-span-7">
              Know where every cent goes, and ask before you spend it.
            </p>
            <div className="lg:col-span-5">
              <p className="max-w-[46ch] text-lg leading-relaxed text-muted">
                Accounts, budgets, shared expenses and goals, with an assistant called Buck that checks your month before you buy.
              </p>
              <ProjectLinks name="Tally" live={LIVE.tally} repo={REPOS.tally} className="mt-6" />
            </div>
          </div>
        </header>

        <div className="mt-14 sm:mt-20">
          <BuckCheck />
          <div className="mt-4">
            <SourceNote>
              A small demo with the sample numbers from Tally&apos;s landing page, and local rules for the verdict. In the app, Buck reads your real month and streams the answer from an API.
            </SourceNote>
          </div>
        </div>

        <div className="mt-24 sm:mt-40">
          <XRay
            src="/work/tally-desk.webp"
            alt="The Tally landing page: a large headline on deep indigo beside a phone showing the home screen, with Buck answering a question"
            width={1440}
            height={900}
            regions={REGIONS}
            title="the Tally landing page"
            darkSource
          />
        </div>

        {/* two of the products really do talk to each other */}
        <div className="reveal mt-24 sm:mt-36">
          <h3 className="max-w-3xl font-tally text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.08] font-bold tracking-[-0.03em] text-balance">
            Two of these products talk to each other.
          </h3>
          <ol className="glass-dark mt-8 grid overflow-hidden rounded-2xl font-mono text-xray-ink md:grid-cols-3">
            {POS_FLOW.map((step, i) => (
              <li key={step.name} className={`relative p-5 sm:p-6 ${i > 0 ? "border-t border-xray-line md:border-t-0 md:border-l" : ""}`}>
                <p className={`text-sm font-medium ${i === 1 ? "text-xray-hot" : ""}`}>{step.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-xray-dim">{step.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </article>
  );
}
