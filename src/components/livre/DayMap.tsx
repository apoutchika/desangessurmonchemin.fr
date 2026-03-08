"use client";

import { useEffect, useRef, useState } from "react";
import type { Day, GpxPoint } from "@/domain";
import { emitter } from "@/lib/events";
import { DayElevation } from "./DayElevation";
import "leaflet/dist/leaflet.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isTouchDevice() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

function buildPopupHtml(
  name: string,
  city: string,
  link: string | undefined,
  accentColor: string,
) {
  return `
    <div style="font-family:Georgia,serif;padding:0.25rem;min-width:140px">
      <strong style="font-size:0.9rem">${name}</strong><br>
      <span style="color:#888;font-size:0.75rem">${city}</span>
      ${link ? `<br><a href="${link}" target="_blank" rel="noopener" style="color:${accentColor};font-size:0.75rem">Voir l'hébergement →</a>` : ""}
    </div>`;
}

function buildRoundIcon(
  L: typeof import("leaflet"),
  letter: string,
  color: string,
) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;background:${color};
      border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);
      display:flex;align-items:center;justify-content:center;
      color:white;font-size:12px;font-weight:600;
    ">${letter}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function buildHoverIcon(L: typeof import("leaflet")) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:12px;height:12px;border-radius:50%;
      background:#b5603a;border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      transform:translate(-50%,-50%);
    "></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

// ─── Composant ────────────────────────────────────────────────────────────────

interface Props {
  day: Day;
}

export function DayMap({ day }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [gpxPoints, setGpxPoints] = useState<GpxPoint[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !day.hasMap()) return;

    let map: import("leaflet").Map;
    let animationFrame: number;

    async function init() {
      const L = (await import("leaflet")).default;

      // Fix icônes Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // ── Carte ──────────────────────────────────────────────────────────────
      const center = day.getMapCenter()!;

      const container = mapRef.current! as HTMLElement & {
        _leaflet_id?: number;
      };
      if (container._leaflet_id) return; // déjà initialisé

      map = L.map(mapRef.current!, {
        center,
        zoom: 11, // Zoom optimal pour voir les villes sans trop de détails
        zoomControl: true,
        scrollWheelZoom: isTouchDevice(),
      });

      // OpenStreetMap France : meilleur compromis pour les noms de villes
      L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
        maxZoom: 20,
        attribution: '© <a href="https://osm.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      /*
      L.tileLayer(
        "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg",
        {
          attribution:
            '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          // ext: 'jpg'
        },
      )
      */

      /*
      // Fond de carte avec plus de labels (OpenStreetMap France)
      L.tileLayer("https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abc",
        maxZoom: 20,
      }).addTo(map);
      */

      // ── Marqueurs hébergements ─────────────────────────────────────────────
      const fromLatLng = day.from!.latlng!.toTuple();
      const toLatLng = day.to!.latlng!.toTuple();

      const letters = ["B", "A"];

      // Marqueur départ avec label permanent
      if (fromLatLng) {
        L.marker(fromLatLng, {
          icon: buildRoundIcon(L, letters.pop()!, "#5a7a5f"),
        })
          .addTo(map)
          .bindPopup(
            buildPopupHtml(
              day.from!.name,
              day.from!.city,
              day.from!.link,
              "#5a7a5f",
            ),
          );
      }

      const isSame = day.to?.latlng && day.from?.latlng?.equals(day.to.latlng);

      // Marqueur arrivée avec label permanent
      if (toLatLng && !isSame) {
        L.marker(toLatLng, {
          icon: buildRoundIcon(L, letters.pop()!, "#b5603a"),
        })
          .addTo(map)
          .bindPopup(
            buildPopupHtml(day.to!.name, day.to!.city, day.to!.link, "#b5603a"),
          );
      }

      // ── GPX ───────────────────────────────────────────────────────────────
      setGpxPoints(day.gpx);
      const fullLatLngs = day.getGpxLatLngs();

      // Tracé fantôme (fond gris)
      L.polyline(fullLatLngs, {
        color: "#ccc",
        weight: 3,
        opacity: 0.6,
      }).addTo(map);

      // Tracé animé
      const animatedLine = L.polyline([], {
        color: "#5c4f3a",
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      if (day.getAllGpxLatLngs().length > 1) {
        map.fitBounds(L.polyline(day.getAllGpxLatLngs()).getBounds(), {
          padding: [30, 30],
        });
      }

      const step = Math.max(1, Math.floor(fullLatLngs.length / 150));
      let idx = 0;

      const animate = () => {
        if (idx < fullLatLngs.length) {
          animatedLine.addLatLng(fullLatLngs[idx]);
          idx += step;
          animationFrame = requestAnimationFrame(animate);
        } else {
          animatedLine.setLatLngs(fullLatLngs); // complète le tracé proprement
        }
      };

      setTimeout(() => requestAnimationFrame(animate), 600);

      // ── Marker de survol altimétrique ─────────────────────────────────────
      const hoverMarker = L.marker([0, 0], {
        icon: buildHoverIcon(L),
        interactive: false,
        opacity: 0,
      }).addTo(map);

      const onElevationHover = (id: number | null) => {
        if (id === null) {
          hoverMarker.setOpacity(0);
          return;
        }
        const el = fullLatLngs[id];
        if (!el) {
          hoverMarker.setOpacity(0);
          return;
        }
        hoverMarker.setLatLng(el);
        hoverMarker.setOpacity(1);
      };

      emitter.on("elevation:hover", onElevationHover);

      // Stocke le cleanup mitt dans une ref accessible depuis le return
      cleanupRef.current = () =>
        emitter.off("elevation:hover", onElevationHover);

      setMapReady(true);
    }

    init();

    return () => {
      cancelAnimationFrame(animationFrame);
      cleanupRef.current?.();
      map?.remove();
    };
  }, [day]);

  return (
    <>
      <div
        ref={mapRef}
        className="day-map-container"
        style={{ position: "relative" }}
      >
        {!mapReady && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--parch)",
              color: "var(--muted)",
              fontSize: "0.875rem",
            }}
          >
            Chargement de la carte…
          </div>
        )}
      </div>

      {day.hasElevationProfile() && <DayElevation points={gpxPoints} />}
    </>
  );
}
