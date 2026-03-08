"use client";

import type { Day } from "@/domain";
import { DayStats } from "./DayStats";
import { DayMap } from "./DayMap";

interface Props {
  day: Day;
}

/**
 * Bloc complet des statistiques d'une journée :
 * - Stats (distance, dénivelé +/-)
 * - Carte interactive
 * - Profil altimétrique
 *
 * Ce composant est toujours affiché ensemble, que ce soit
 * dans la sidebar desktop ou au-dessus du contenu sur mobile/tablette.
 */
export function DayStatsBlock({ day }: Props) {
  if (!day.hasStats() && !day.hasMap()) {
    return null;
  }

  return (
    <div className="day-stats-block">
      {/* Stats distance et dénivelé */}
      {day.hasStats() && (
        <div className="day-stats-block__section">
          <DayStats stats={day.stats!} />
        </div>
      )}

      {/* Carte et profil altimétrique */}
      {day.hasMap() && (
        <div className="day-stats-block__section">
          <DayMap day={day} />
        </div>
      )}
    </div>
  );
}
