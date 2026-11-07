import { LIVE, REPOS, type Region } from "@/app/_lib/data";
import CodeLab from "./CodeLab";
import ProjectLinks from "./ProjectLinks";
import SourceNote from "./SourceNote";
import XRay from "./XRay";

const REGIONS: Region[] = [
  { x: 52.3, y: 28.5, w: 40.7, h: 37.4, label: "lexer > parser > interpreter", note: "The language above, written from scratch in TypeScript. No eval and no WebAssembly." },
  { x: 49.8, y: 39.7, w: 7.4, h: 6.4, label: "levelFromXp", note: "Points turn into levels with one formula: floor(sqrt(xp / 50)) + 1." },
  { x: 90.6, y: 2.2, w: 7.4, h: 4.5, label: "student codes + RLS", note: "Minors sign in with a code and PIN, no email. Postgres row-level security guards their data." },
  { x: 7.2, y: 32, w: 27.6, h: 16.8, label: "next-intl", note: "The interface text lives in Spanish message files." },
  { x: 17.2, y: 62.7, w: 14.8, h: 5.8, label: "Web Worker + Pyodide", note: "Lessons run in the browser with no account. Python loads on demand, only when a lesson needs it." },
];

export default function ChapterCodeher() {
  return (
    <article id="codeher" data-world="codeher" className="scroll-mt-20 pt-28 pb-24 sm:pt-40 sm:pb-36">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <header className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* the wordmark keeps its real colors, so it sits on white as in the site's footer */}
            <h2 className="inline-flex rounded-2xl bg-[#f7f7f7] px-4 py-2 font-ch text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
              <span className="text-[#9b5de5]">CODE</span>
              <span className="text-[#f15bb5]">HER</span>
            </h2>
            <p className="mt-8 font-ch text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.06] font-extrabold tracking-[-0.03em] text-balance">
              A first programming language,{" "}
              <em className="font-ch-accent font-semibold tracking-[-0.02em] text-[#fbb6e0]">in Spanish.</em>
            </p>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[46ch] font-ch text-lg leading-relaxed font-medium text-muted">
              CODEHER teaches programming to girls aged 12 to 18 in semi-rural Estado de México. I built its platform, including the interpreter that runs and grades their code in the browser.
            </p>
            <ProjectLinks name="CODEHER" live={LIVE.codeher} repo={REPOS.codeher} className="mt-6 font-ch" />
          </div>
        </header>

        <div className="mt-14 sm:mt-20">
          <CodeLab />
          <div className="mt-4">
            <SourceNote href={`${REPOS.codeher}/blob/main/packages/grader/src/pseudo/interpreter.ts`} file="interpreter.ts">
              Write anything. This is CODEHER&apos;s real interpreter, unchanged, in a Web Worker. Its keywords and its error messages are Spanish on purpose: that&apos;s the point of it.
            </SourceNote>
          </div>
        </div>

        <div className="mt-24 sm:mt-40">
          <XRay
            src="/work/ch-desk.webp"
            alt="The CODEHER home page: the headline Programar es para ti beside a tilted code editor on violet and pink circles"
            width={1440}
            height={900}
            regions={REGIONS}
            title="the CODEHER home page"
          />
        </div>
      </div>
    </article>
  );
}
