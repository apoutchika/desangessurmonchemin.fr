// Serialization layer for Next.js Server/Client Components
import type { Day } from "./entities/Day";

// Types sérialisables (plain objects)
export interface SerializedLatLng {
  lat: number;
  lng: number;
}

export interface SerializedPlace {
  latlng: SerializedLatLng | null;
  city: string;
  name: string;
  link?: string;
  stamp?: string; // Chemin vers l'image du tampon
}

export interface SerializedPhoto {
  type?: "photo" | "video";
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  poster?: string; // Pour vidéos
  duration?: number; // Pour vidéos
}

export interface SerializedDayStats {
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  totalDistance: number;
  totalElevationGain: number;
  totalElevationLoss: number;
}

export interface SerializedGpxPoint {
  id: string;
  lat: number;
  lng: number;
  ele: number;
}

export type PageType = "avant-propos" | "jour" | "postface";

export interface SerializedDay {
  slug: string;
  type: PageType;
  day: number | null;
  date: string | null; // ISO string
  title: string | null;
  from: SerializedPlace | null;
  to: SerializedPlace | null;
  stats: SerializedDayStats | null;
  gpx: SerializedGpxPoint[];
  content: string;
  photos: SerializedPhoto[];
  fromMemory: boolean;
}

export interface SerializedPageNavigation {
  prev?: { slug: string; label: string };
  next?: { slug: string; label: string };
}

// Sérialisation : Day -> SerializedDay
export function serializeDay(day: Day): SerializedDay {
  return {
    slug: day.slug,
    type: day.type,
    day: day.day,
    date: day.date ? day.date.toISOString() : null,
    title: day.title,
    from: day.from
      ? {
          latlng: day.from.latlng
            ? { lat: day.from.latlng.lat, lng: day.from.latlng.lng }
            : null,
          city: day.from.city,
          name: day.from.name,
          link: day.from.link,
          stamp: day.from.stamp,
        }
      : null,
    to: day.to
      ? {
          latlng: day.to.latlng
            ? { lat: day.to.latlng.lat, lng: day.to.latlng.lng }
            : null,
          city: day.to.city,
          name: day.to.name,
          link: day.to.link,
          stamp: day.to.stamp,
        }
      : null,
    stats: day.stats
      ? {
          distance: day.stats.distance,
          elevationGain: day.stats.elevationGain,
          elevationLoss: day.stats.elevationLoss,
          totalDistance: day.stats.totalDistance,
          totalElevationGain: day.stats.totalElevationGain,
          totalElevationLoss: day.stats.totalElevationLoss,
        }
      : null,
    gpx: day.gpx.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      ele: p.ele,
    })),
    content: day.content,
    photos: day.photos.map((p) => ({
      type: p.type,
      src: p.src,
      alt: p.alt,
      caption: p.caption,
      width: p.width,
      height: p.height,
      poster: p.poster,
      duration: p.duration,
    })),
    fromMemory: day.fromMemory,
  };
}
