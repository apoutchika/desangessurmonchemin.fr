import { Journey } from "@/domain";
import data from "./data.json";

// ============================================================
// DONNÉES DU PÈLERINAGE
// ============================================================

// Singleton Journey aggregate
let journeyInstance: Journey | null = null;

export function getJourney(): Journey {
  if (!journeyInstance) {
    journeyInstance = Journey.fromPlain(data);
  }
  return journeyInstance;
}

// Helpers pour compatibilité avec l'ancien code
export function getDayBySlug(slug: string) {
  return getJourney().getDayBySlug(slug);
}

export function getNavigation(currentDay: any) {
  const journey = getJourney();
  const day = journey.getDayBySlug(currentDay.slug);
  if (!day) return { prev: undefined, next: undefined };
  return journey.getNavigation(day);
}

export function getJourneyStats() {
  return getJourney().getStats();
}
