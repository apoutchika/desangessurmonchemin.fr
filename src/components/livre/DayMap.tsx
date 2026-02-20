"use client";

import { useEffect, useRef, useState } from "react";
import type { JourneyDay, GpxPoint } from "@/types";
import { emitter } from "@/lib/events";
import { DayElevation } from "./DayElevation";

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
  day: JourneyDay;
}

export function DayMap({ day }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [gpxPoints, setGpxPoints] = useState<GpxPoint[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !day.from || !day.to) return;

    let map: import("leaflet").Map;
    let animationFrame: number;

    async function init() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

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
      const center: [number, number] = [
        (day.from!.latlng!.lat + day.to!.latlng!.lat) / 2,
        (day.from!.latlng!.lng + day.to!.latlng!.lng) / 2,
      ];

      const container = mapRef.current! as HTMLElement & {
        _leaflet_id?: number;
      };
      if (container._leaflet_id) return; // déjà initialisé

      map = L.map(mapRef.current!, {
        center,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: isTouchDevice(),
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution: '© <a href="https://carto.com">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        },
      ).addTo(map);

      // ── Marqueurs hébergements ─────────────────────────────────────────────
      L.marker([day.from!.latlng!.lat, day.from!.latlng!.lng], {
        icon: buildRoundIcon(L, "A", "#5a7a5f"),
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

      L.marker([day.to!.latlng!.lat, day.to!.latlng!.lng], {
        icon: buildRoundIcon(L, "B", "#b5603a"),
      })
        .addTo(map)
        .bindPopup(
          buildPopupHtml(day.to!.name, day.to!.city, day.to!.link, "#b5603a"),
        );

      // ── GPX ───────────────────────────────────────────────────────────────
      let fullLatLngs: [number, number][] = [];
      setGpxPoints(day?.gpx ?? []);
      if (day.gpx) {
        fullLatLngs = day.gpx.map((p) => [p.lat, p.lng]);
      }

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

      if (fullLatLngs.length > 1) {
        map.fitBounds(L.polyline(fullLatLngs).getBounds(), {
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
    <div style={{ marginBottom: "2.5rem" }}>
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

      {gpxPoints.length > 1 && <DayElevation points={gpxPoints} />}
    </div>
  );
}
