import type { JourneyDay } from "@/types";
import data from "./data.json";

// ============================================================
// DONNÉES DU PÈLERINAGE
// Remplacer par votre vrai fichier JSON importé
// ============================================================

export const journeyData = data as unknown as JourneyDay[];

// Helpers
export function getDayBySlug(slug: string): JourneyDay | undefined {
  if (slug === "avant-propos")
    return journeyData.find((d) => d.type === "avant-propos");
  if (slug === "postface")
    return journeyData.find((d) => d.type === "postface");
  const day = parseInt(slug.replace("jour-", ""), 10);
  return journeyData.find((d) => d.day === day);
}

export function getSlug(day: JourneyDay): string {
  if (day.type === "avant-propos") return "avant-propos";
  if (day.type === "postface") return "postface";
  return `jour-${day.day}`;
}

export function getNavigation(current: JourneyDay) {
  const idx = journeyData.findIndex((d) => d.id === current.id);
  const prev = idx > 0 ? journeyData[idx - 1] : undefined;
  const next = idx < journeyData.length - 1 ? journeyData[idx + 1] : undefined;
  return {
    prev: prev
      ? { id: prev.id, slug: getSlug(prev), label: getPageLabel(prev) }
      : undefined,
    next: next
      ? { id: next.id, slug: getSlug(next), label: getPageLabel(next) }
      : undefined,
  };
}

export function getPageLabel(day: JourneyDay): string {
  if (day.type === "avant-propos") return day.title ?? "Avant-propos";
  if (day.type === "postface") return day.title ?? "Postface";

  if (day.from?.city === day.to?.city) {
    return `Jour ${day.day} — ${day.from?.city}`;
  }

  return `Jour ${day.day} — ${day.from?.city} → ${day.to?.city}`;
}

export function getJourneyStats() {
  const days = journeyData.filter((d) => d.type === "jour" && d.stats);
  return {
    totalDays: 77,
    totalDistance: days.reduce((s, d) => s + (d.stats?.distance ?? 0), 0),
    totalElevationGain: days.reduce(
      (s, d) => s + (d.stats?.elevationGain ?? 0),
      0,
    ),
    startDate: days[0]?.date,
    endDate: days[days.length - 1]?.date,
    startCity: days[0]?.from?.city,
    endCity: days[days.length - 1]?.to?.city,
  };
}
