// Stride's scoring running on a real street grid (Centro de Toluca, from
// OpenStreetMap). Click the map to drop a report; everything within 300 m of
// the walker, the app's real USER_SAFETY_RADIUS_METERS, goes through the real
// calculateAreaScore and getSafetyLevel. Dragging time forward applies the same
// 72-hour decay. The pill at the top is what the app's Live Activity shows.

"use client";

import { useMemo, useState, type MouseEvent } from "react";
import { RotateCcw } from "lucide-react";
import {
  HOURS_DECAY_CONSTANT,
  calculateAreaScore,
  getReportDecayMultiplier,
  getSafetyLevel,
  getSpatialCohesionMultiplier,
  haversineDistanceMeters,
  type Report,
  type ReportImpact,
} from "@/app/_lib/areaScore";
import { MAJOR_STREETS, MAP, MINOR_STREETS } from "@/app/_lib/streets";

const HOUR = 60 * 60 * 1000;
// The demo's clock. Only differences matter, so a fixed "now" keeps rendering pure.
const NOW = 1_800_000_000_000;
const RADIUS_METERS = 300; // USER_SAFETY_RADIUS_METERS in ReportsContext.tsx
const WALKER = { x: MAP.width / 2, y: MAP.height / 2 };

const TYPES: { id: ReportImpact; label: string; color: string }[] = [
  { id: "negative", label: "Hazard", color: "#f43966" },
  { id: "neutral", label: "Note", color: "#b5b5b5" },
  { id: "positive", label: "Good vibe", color: "#2fd08f" },
];

const LEVEL_COLOR = { safe: "#2fd08f", caution: "#f4c75b", unsafe: "#f43966" };
const LEVEL_LABEL = { safe: "Safe", caution: "Caution", unsafe: "Unsafe" };

type Pin = { id: number; x: number; y: number; impact: ReportImpact; age: number };

// A quiet starting block: a few reports, of varying age, around the walker.
const SEED: Pin[] = [
  { id: 1, x: 430, y: 235, impact: "negative", age: 6 },
  { id: 2, x: 590, y: 270, impact: "negative", age: 20 },
  { id: 3, x: 545, y: 385, impact: "negative", age: 3 },
  { id: 4, x: 390, y: 360, impact: "positive", age: 30 },
];

// viewBox units to lat/lng, at the map's fixed scale
function toCoordinate(x: number, y: number) {
  const metresPerDegLat = 111320;
  const metresPerDegLng = 111320 * Math.cos((MAP.center.latitude * Math.PI) / 180);
  return {
    latitude: MAP.center.latitude - ((y - MAP.height / 2) * MAP.metresPerUnit) / metresPerDegLat,
    longitude: MAP.center.longitude + ((x - MAP.width / 2) * MAP.metresPerUnit) / metresPerDegLng,
  };
}

export default function StrideLab() {
  const [pins, setPins] = useState<Pin[]>(SEED);
  const [impact, setImpact] = useState<ReportImpact>("negative");
  const [hoursLater, setHoursLater] = useState(0);

  const { score, level, nearby, cohesion } = useMemo(() => {
    const walker = toCoordinate(WALKER.x, WALKER.y);
    // Time passing is the same as every report having been written earlier.
    const reports: Report[] = pins.map((pin) => ({
      impact: pin.impact,
      timestamp: NOW - (pin.age + hoursLater) * HOUR,
      coordinate: toCoordinate(pin.x, pin.y),
    }));
    const near = reports.filter((report) => haversineDistanceMeters(walker, report.coordinate) <= RADIUS_METERS);
    const value = calculateAreaScore(near, NOW);
    return {
      score: value,
      level: getSafetyLevel(value, near.length),
      nearby: near.length,
      cohesion: getSpatialCohesionMultiplier(near),
    };
  }, [pins, hoursLater]);

  function drop(event: MouseEvent<SVGSVGElement>) {
    const svg = event.currentTarget;
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const { x, y } = point.matrixTransform(svg.getScreenCTM()?.inverse());
    setPins((list) => [...list, { id: Date.now(), x, y, impact, age: -hoursLater }]);
  }

  const radiusUnits = RADIUS_METERS / MAP.metresPerUnit;
  const bubble = LEVEL_COLOR[level];

  return (
    <div className="glass-panel grid overflow-hidden rounded-[2rem] lg:grid-cols-12">
      <div className="relative lg:col-span-8">
        {/* the Live Activity, as the Dynamic Island shows it */}
        <div className="glass glass-lens glass-static pointer-events-none absolute top-4 left-1/2 z-10 flex h-10 -translate-x-1/2 items-center gap-2.5 rounded-full pr-4 pl-3 font-stride text-sm font-semibold whitespace-nowrap text-white sm:h-11 sm:text-[0.9375rem]" aria-live="polite">
          <span className="size-2.5 rounded-full transition-colors duration-500" style={{ background: bubble }} aria-hidden />
          {LEVEL_LABEL[level]}
          <span className="font-normal text-white/60">{nearby} {nearby === 1 ? "report" : "reports"}</span>
        </div>

        <svg
          viewBox={`0 0 ${MAP.width} ${MAP.height}`}
          onClick={drop}
          role="img"
          aria-label={`Street map. ${nearby} reports nearby, level ${LEVEL_LABEL[level]}. Click to drop a report.`}
          className="block aspect-[4/3] w-full cursor-crosshair bg-[#141414] sm:aspect-[1000/620]"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d={MINOR_STREETS} fill="none" stroke="#3a3a3a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d={MAJOR_STREETS} fill="none" stroke="#565656" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          <circle
            cx={WALKER.x}
            cy={WALKER.y}
            r={radiusUnits}
            fill={bubble}
            fillOpacity="0.16"
            stroke={bubble}
            strokeOpacity="0.55"
            strokeWidth="1.5"
            className="transition-[fill,stroke] duration-500"
          />

          {pins.map((pin) => {
            const decay = getReportDecayMultiplier(NOW - (pin.age + hoursLater) * HOUR, NOW);
            const inside = Math.hypot(pin.x - WALKER.x, pin.y - WALKER.y) <= radiusUnits;
            const color = TYPES.find((t) => t.id === pin.impact)?.color;
            return (
              <g key={pin.id} transform={`translate(${pin.x} ${pin.y})`} opacity={inside ? 0.25 + 0.75 * decay : 0.22} className="transition-opacity duration-300">
                <g className="report-drop">
                  <circle r="11" fill={color} fillOpacity="0.25" />
                  <circle r="5.5" fill={color} stroke="#141414" strokeWidth="1.5" />
                </g>
              </g>
            );
          })}

          <circle cx={WALKER.x} cy={WALKER.y} r="9" fill="#3b82f6" stroke="#fff" strokeWidth="3" />
        </svg>
      </div>

      {/* controls + the real numbers */}
      <div className="flex flex-col justify-center gap-7 border-t border-white/10 p-5 sm:p-7 lg:col-span-4 lg:border-t-0 lg:border-l">
        <div>
          <p className="mb-2 font-stride text-sm text-white/60" id="report-type">Click the map to drop a</p>
          <div role="radiogroup" aria-labelledby="report-type" className="flex flex-wrap gap-2">
            {TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={impact === type.id}
                onClick={() => setImpact(type.id)}
                className={`glass glass-faux inline-flex h-10 items-center gap-2 rounded-full px-3.5 font-stride text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${impact === type.id ? "glass-tint" : "text-white"}`}
              >
                <span className="size-2.5 rounded-full ring-1 ring-black/30" style={{ background: type.color }} aria-hidden />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="hours" className="block font-stride text-sm text-white/60">
            Time passes: <output htmlFor="hours" className="text-white tabular-nums">{hoursLater} h</output>
          </label>
          <input
            id="hours"
            type="range"
            min={0}
            max={240}
            step={4}
            value={hoursLater}
            onChange={(event) => setHoursLater(Number(event.target.value))}
            className="demo-range mt-1 w-full text-white [--thumb:#f43966]"
          />
        </div>

        <div className="flex items-end justify-between gap-4 glass-dark rounded-xl p-4 font-mono text-xray-ink">
          <dl className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs">
            <div>
              <dt className="text-xray-dim">score</dt>
              <dd className="mt-1 text-xl font-medium text-xray-hot tabular-nums">{score.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="text-xray-dim">cohesion</dt>
              <dd className="mt-1 text-xl font-medium tabular-nums">{cohesion.toFixed(2)}</dd>
            </div>
            <div>
              <dt className="whitespace-nowrap text-xray-dim">half-life</dt>
              <dd className="mt-1 text-xl font-medium tabular-nums">{Math.round(HOURS_DECAY_CONSTANT * Math.LN2)}h</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() => {
              setPins(SEED);
              setHoursLater(0);
            }}
            aria-label="Reset the map"
            className="glass glass-faux flex size-10 shrink-0 items-center justify-center rounded-full text-xray-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-xray-hot"
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
