// ============================================================
// TYPES — Pèlerinage
// ============================================================

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  latlng: LatLng | null;
  city: string;
  name: string; // Nom de l'hébergement
  link?: string; // Lien vers l'hébergement
}

export interface DayStats {
  distance: number; // km du jour
  elevationGain: number; // D+ du jour en mètres
  elevationLoss: number; // D- du jour en mètres
  totalDistance: number; // km cumulés depuis le début
  totalElevationGain: number; // D+ cumulés
  totalElevationLoss: number; // D+ cumulés
}

export interface Photo {
  src: string; // Chemin ou URL
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export type PageType = "avant-propos" | "jour" | "postface";

export interface JourneyDay {
  id: number; // Ordre absolu (0 = AP, 1..N = jours, N+1 = PF)
  type: PageType;
  day: number | null; // Numéro du jour de marche (1..N), absent pour AP/PF
  date: Date | null; // ISO date string "YYYY-MM-DD"
  title: string | null; // Titre custom pour AP/PF, sinon généré automatiquement
  from: Place | null;
  to: Place | null;
  stats?: DayStats;
  gpx: GpxPoint[] | null; // Points parsés (généré côté server depuis gpx)
  content: string; // Markdown ou texte brut
  photos?: Photo[];
  fromMemory: boolean;
}

export interface GpxPoint {
  id: string;
  lat: number;
  lng: number;
  ele: number; // Altitude en mètres
}

// Statistiques globales du voyage
export interface JourneyStats {
  totalDays: number;
  totalDistance: number;
  totalElevationGain: number;
  startDate: string;
  endDate: string;
  startCity: string;
  endCity: string;
}

// Navigation entre pages
export interface PageNavigation {
  prev?: { id: number; slug: string; label: string };
  next?: { id: number; slug: string; label: string };
}
