import type { DayStats as DayStatsType } from '@/types';

interface Props {
  stats: DayStatsType;
}

function fmt(n: number, unit: string) {
  return `${n % 1 === 0 ? n : n.toFixed(1)} ${unit}`;
}

function fmtDuration(mins?: number) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? m.toString().padStart(2, '0') : ''}` : `${m} min`;
}

export function DayStats({ stats }: Props) {
  return (
    <div className="day-stats">
      <div className="day-stats__item">
        <span className="day-stats__value">{fmt(stats.distance, 'km')}</span>
        <span className="day-stats__label">Distance du jour</span>
        {stats.totalDistance !== undefined && (
          <span className="day-stats__sublabel">
            {fmt(stats.totalDistance, 'km')} total
          </span>
        )}
      </div>

      <div className="day-stats__item">
        <span className="day-stats__value">{fmt(stats.elevationGain, 'm')}</span>
        <span className="day-stats__label">Dénivelé positif</span>
        {stats.totalElevationGain !== undefined && (
          <span className="day-stats__sublabel">
            {stats.totalElevationGain.toLocaleString('fr-FR')} m total
          </span>
        )}
      </div>

      <div className="day-stats__item">
        <span className="day-stats__value">{fmt(stats.elevationLoss, 'm')}</span>
        <span className="day-stats__label">Dénivelé négatif</span>
      </div>

      {stats.duration && (
        <div className="day-stats__item">
          <span className="day-stats__value">{fmtDuration(stats.duration)}</span>
          <span className="day-stats__label">Durée de marche</span>
        </div>
      )}
    </div>
  );
}
