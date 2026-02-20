import type { GpxPoint } from '@/types';

// ============================================================
// GPX PARSER
// Parse une string GPX et retourne les points + stats
// ============================================================

export function parseGpx(gpxString: string): GpxPoint[] {
  if (!gpxString) return [];

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpxString, 'application/xml');
    const trkpts = doc.querySelectorAll('trkpt');

    return Array.from(trkpts).map(pt => ({
      lat: parseFloat(pt.getAttribute('lat') ?? '0'),
      lng: parseFloat(pt.getAttribute('lon') ?? '0'),
      ele: pt.querySelector('ele')
        ? parseFloat(pt.querySelector('ele')!.textContent ?? '0')
        : undefined,
      time: pt.querySelector('time')?.textContent ?? undefined,
    }));
  } catch {
    console.error('GPX parsing error');
    return [];
  }
}

// Calcul du profil altimétrique sous forme de tableau [distance_km, altitude]
export function getElevationProfile(
  points: GpxPoint[]
): { distance: number; elevation: number }[] {
  if (!points.length) return [];

  let totalDist = 0;
  return points
    .filter(p => p.ele !== undefined)
    .map((p, i, arr) => {
      if (i > 0) {
        totalDist += haversineKm(arr[i - 1], p);
      }
      return { distance: Math.round(totalDist * 10) / 10, elevation: p.ele! };
    });
}

// Calcul distance haversine entre deux points
function haversineKm(a: GpxPoint, b: GpxPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

// Calcul D+ et D- depuis les points GPX
export function computeElevationStats(points: GpxPoint[]) {
  let dPlus = 0;
  let dMinus = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].ele !== undefined && points[i - 1].ele !== undefined) {
      const diff = points[i].ele! - points[i - 1].ele!;
      if (diff > 0) dPlus += diff;
      else dMinus += Math.abs(diff);
    }
  }
  return { elevationGain: Math.round(dPlus), elevationLoss: Math.round(dMinus) };
}

// Interpolation de points pour une animation fluide (réduit ou augmente le nb de points)
export function samplePoints(points: GpxPoint[], targetCount: number): GpxPoint[] {
  if (points.length <= targetCount) return points;
  const step = (points.length - 1) / (targetCount - 1);
  return Array.from({ length: targetCount }, (_, i) => points[Math.round(i * step)]);
}
