// The real scoring code from Stride (stride/utils/areaScore.ts + distance.ts).
// The logic is unchanged. The only edits: a narrower Report type, exporting
// getSpatialCohesionMultiplier so the demo can display it, and `now` as a
// parameter of calculateAreaScore so the demo can render deterministically.

export type ReportImpact = "positive" | "neutral" | "negative";
type Coordinates = { latitude: number; longitude: number };
export type Report = {
  impact: ReportImpact;
  timestamp: number;
  coordinate: Coordinates;
};

const EARTH_RADIUS_METERS = 6371000;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function haversineDistanceMeters(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

const REPORT_IMPACT_WEIGHTS: Record<ReportImpact, number> = {
  positive: 2,
  neutral: 0,
  negative: -3,
};

export const HOURS_DECAY_CONSTANT = 72;
const MS_PER_HOUR = 60 * 60 * 1000;
const MIN_REPORTS_FOR_UNSAFE = 10;
const MIN_REPORTS_FOR_CAUTION = 4;
const FULL_COHESION_DISTANCE_METERS = 150;
const MIN_COHESION_DISTANCE_METERS = 900;
const MIN_COHESION_MULTIPLIER = 0.3;

export function getReportImpactWeight(impact: ReportImpact): number {
  return REPORT_IMPACT_WEIGHTS[impact] ?? 0;
}

export function getReportDecayMultiplier(timestamp: number, now = Date.now()): number {
  const hoursSinceCreation = Math.max(0, (now - timestamp) / MS_PER_HOUR);
  return Math.exp(-hoursSinceCreation / HOURS_DECAY_CONSTANT);
}

export function getSpatialCohesionMultiplier(reports: Pick<Report, "coordinate">[]): number {
  if (reports.length <= 1) {
    return 1;
  }

  const centroid = reports.reduce(
    (accumulator, report) => ({
      latitude: accumulator.latitude + report.coordinate.latitude / reports.length,
      longitude: accumulator.longitude + report.coordinate.longitude / reports.length,
    }),
    { latitude: 0, longitude: 0 },
  );

  const averageDistanceFromCentroid =
    reports.reduce((accumulator, report) => {
      return accumulator + haversineDistanceMeters(report.coordinate, centroid);
    }, 0) / reports.length;

  if (averageDistanceFromCentroid <= FULL_COHESION_DISTANCE_METERS) {
    return 1;
  }

  if (averageDistanceFromCentroid >= MIN_COHESION_DISTANCE_METERS) {
    return MIN_COHESION_MULTIPLIER;
  }

  const progress =
    (averageDistanceFromCentroid - FULL_COHESION_DISTANCE_METERS) /
    (MIN_COHESION_DISTANCE_METERS - FULL_COHESION_DISTANCE_METERS);

  return 1 - progress * (1 - MIN_COHESION_MULTIPLIER);
}

export function getNormalizedAreaScore(totalWeight: number, reportCount: number): number {
  if (reportCount <= 0) {
    return 0;
  }

  return totalWeight / Math.sqrt(reportCount + 1);
}

// Calculates the normalized area score for a set of reports.
// Positive means better vibe, negative means riskier area.
export function calculateAreaScore<T extends Pick<Report, "impact" | "timestamp" | "coordinate">>(
  reports: T[],
  now = Date.now(),
): number {
  if (reports.length === 0) {
    return 0;
  }

  let totalWeight = 0;

  for (let i = 0; i < reports.length; i += 1) {
    const report = reports[i];
    const decay = getReportDecayMultiplier(report.timestamp, now);
    const weight = getReportImpactWeight(report.impact);

    totalWeight += weight * decay;
  }

  const cohesionMultiplier = getSpatialCohesionMultiplier(reports);

  return getNormalizedAreaScore(totalWeight * cohesionMultiplier, reports.length);
}

// Converts a numeric score to a semantic bubble color.
export function getBubbleColor(score: number): "red" | "yellow" | "green" {
  if (score <= -1.5) {
    return "red";
  }
  if (score < 0) {
    return "yellow";
  }
  return "green";
}

export function getSafetyLevel(score: number, reportCount: number): "safe" | "caution" | "unsafe" {
  if (reportCount >= MIN_REPORTS_FOR_UNSAFE && score <= -1.5) {
    return "unsafe";
  }

  if (reportCount >= MIN_REPORTS_FOR_CAUTION && score < 0) {
    return "caution";
  }

  return "safe";
}
