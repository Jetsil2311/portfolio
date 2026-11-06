import Image from "next/image";
import { REPOS, type Region } from "@/app/_lib/data";
import ProjectLinks from "./ProjectLinks";
import SourceNote from "./SourceNote";
import StrideLab from "./StrideLab";
import XRay from "./XRay";

const REGIONS: Region[] = [
  { x: 8, y: 8, w: 84, h: 22, label: "@rnmapbox/maps", note: "Mapbox's dark style, with clustered report pins and a compass." },
  { x: 24, y: 32, w: 60, h: 31, label: "calculateAreaScore", note: "The bubble's color: the same function you just played with, re-run as reports arrive over Supabase Realtime." },
  { x: 12, y: 71.5, w: 78, h: 6.5, label: "PostGIS", note: "A new report is stored as a geography POINT and reaches every open map." },
  { x: 12, y: 79, w: 78, h: 7, label: "expo-task-manager", note: "A background task keeps logging location with the phone in a pocket." },
];

export default function ChapterStride() {
  return (
    <article id="stride" data-world="stride" className="scroll-mt-20 pt-28 pb-24 sm:pt-40 sm:pb-36">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8">
        <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="font-stride text-xl font-semibold text-pop">Stride</h2>
            <p className="mt-3 font-stride text-[clamp(2.5rem,6.4vw,6.5rem)] leading-[1] font-bold tracking-[-0.035em] text-balance">
              Navigation apps are built for drivers. This one is for walking.
            </p>
          </div>
          <div className="lg:col-span-4">
            <p className="max-w-[44ch] font-stride text-lg leading-relaxed text-muted">
              People report what they see on the street. Stride turns those reports into a live safety score, on the map and in the iPhone&apos;s Dynamic Island.
            </p>
            <ProjectLinks name="Stride" repo={REPOS.stride} className="mt-6 font-stride" />
          </div>
        </header>

        <div className="mt-14 sm:mt-20">
          <StrideLab />
          <div className="mt-4">
            <SourceNote href={`${REPOS.stride}/blob/main/utils/areaScore.ts`} file="utils/areaScore.ts">
              The score above is computed by Stride&apos;s real code: time decay, spatial cohesion, and a floor of 4 reports for Caution, 10 for Unsafe. Try ten hazards, then let a week pass. Streets from OpenStreetMap.
            </SourceNote>
          </div>
        </div>

        <div className="mt-24 grid gap-10 sm:mt-40 lg:grid-cols-12 lg:gap-14">
          <div className="hidden lg:col-span-3 lg:block">
            <Image
              src="/work/stride-report.webp"
              alt="Stride's new report form, with type and category choices"
              width={776}
              height={1532}
              sizes="20vw"
              className="mx-auto h-auto w-full max-w-[calc(70dvh*776/1532)] lg:mt-24"
            />
          </div>
          <div className="lg:col-span-9">
            <XRay
              src="/work/stride-walk.webp"
              alt="Stride during a walk: the route on a dark map inside a green safety bubble, with a timer below"
              width={776}
              height={1532}
              regions={REGIONS}
              sizes="(min-width: 1024px) 35vw, 100vw"
              title="the Stride app"
              darkSource
              layout="side"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
