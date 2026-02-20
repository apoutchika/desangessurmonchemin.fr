'use client';

import { useEffect, useRef, useState } from 'react';
import type { JourneyDay, GpxPoint } from '@/types';
import { parseGpx, getElevationProfile, samplePoints } from '@/lib/gpx';

interface Props {
  day: JourneyDay;
}

export function DayMap({ day }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [elevProfile, setElevProfile] = useState<{ distance: number; elevation: number }[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !day.from || !day.to) return;

    let map: import('leaflet').Map;
    let animationFrame: number;

    async function init() {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      // Fix icônes par défaut manquantes dans next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Centrage de la carte
      const center: [number, number] = [
        (day.from!.latlng.lat + day.to!.latlng.lat) / 2,
        (day.from!.latlng.lng + day.to!.latlng.lng) / 2,
      ];

      map = L.map(mapRef.current!, {
        center,
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false, // Meilleure UX sur page scrollable
      });

      // Tuiles élégantes (CartoDB Voyager)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '© <a href="https://carto.com">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }
      ).addTo(map);

      // Icônes personnalisées
      const iconA = L.divIcon({
        className: '',
        html: `<div style="
          width:32px;height:32px;border-radius:50%;
          background:var(--forest, #5a7a5f);
          border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
          color:white;font-size:12px;font-weight:600;
        ">A</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const iconB = L.divIcon({
        className: '',
        html: `<div style="
          width:32px;height:32px;border-radius:50%;
          background:var(--rust, #b5603a);
          border:2px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          display:flex;align-items:center;justify-content:center;
          color:white;font-size:12px;font-weight:600;
        ">B</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Marqueur départ avec popup
      const markerA = L.marker(
        [day.from!.latlng.lat, day.from!.latlng.lng],
        { icon: iconA }
      ).addTo(map);

      const popupA = `
        <div style="font-family:var(--font-serif,'Georgia',serif);padding:0.25rem">
          <strong style="font-size:0.9rem">${day.from!.name}</strong><br>
          <span style="color:#888;font-size:0.75rem">${day.from!.city}</span>
          ${day.from!.link ? `<br><a href="${day.from!.link}" target="_blank" rel="noopener" style="color:#5a7a5f;font-size:0.75rem">Voir l'hébergement →</a>` : ''}
        </div>`;
      markerA.bindPopup(popupA);

      // Marqueur arrivée avec popup
      const markerB = L.marker(
        [day.to!.latlng.lat, day.to!.latlng.lng],
        { icon: iconB }
      ).addTo(map);

      const popupB = `
        <div style="font-family:var(--font-serif,'Georgia',serif);padding:0.25rem">
          <strong style="font-size:0.9rem">${day.to!.name}</strong><br>
          <span style="color:#888;font-size:0.75rem">${day.to!.city}</span>
          ${day.to!.link ? `<br><a href="${day.to!.link}" target="_blank" rel="noopener" style="color:#b5603a;font-size:0.75rem">Voir l'hébergement →</a>` : ''}
        </div>`;
      markerB.bindPopup(popupB);

      // Tracé GPX
      const gpxPoints: GpxPoint[] = day.gpx ? parseGpx(day.gpx) : [
        { lat: day.from!.latlng.lat, lng: day.from!.latlng.lng },
        { lat: day.to!.latlng.lat, lng: day.to!.latlng.lng },
      ];

      // Profil altimétrique
      const profile = getElevationProfile(gpxPoints);
      if (profile.length > 1) setElevProfile(profile);

      // Tracé complet (gris clair en fond)
      const fullLatLngs: [number, number][] = gpxPoints.map(p => [p.lat, p.lng]);

      L.polyline(fullLatLngs, {
        color: '#ccc',
        weight: 3,
        opacity: 0.6,
      }).addTo(map);

      // Tracé animé
      const animPoints = samplePoints(gpxPoints, Math.min(gpxPoints.length, 200));
      const animLatLngs: [number, number][] = animPoints.map(p => [p.lat, p.lng]);

      const animatedLine = L.polyline([], {
        color: '#5c4f3a',
        weight: 4,
        opacity: 0.9,
      }).addTo(map);

      // Adapter la vue
      if (fullLatLngs.length > 1) {
        map.fitBounds(L.polyline(fullLatLngs).getBounds(), { padding: [30, 30] });
      }

      // Animation du tracé
      let idx = 0;
      const animate = () => {
        if (idx < animLatLngs.length) {
          animatedLine.addLatLng(animLatLngs[idx]);
          idx += 3; // vitesse d'animation
          animationFrame = requestAnimationFrame(animate);
        }
      };

      // Lancer l'animation après un court délai
      setTimeout(() => {
        animationFrame = requestAnimationFrame(animate);
      }, 600);

      setMapReady(true);
    }

    init();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (map) map.remove();
    };
  }, [day]);

  // Calcul des extremes du profil pour le SVG
  const minElev = Math.min(...elevProfile.map(p => p.elevation));
  const maxElev = Math.max(...elevProfile.map(p => p.elevation));
  const maxDist = elevProfile.at(-1)?.distance ?? 1;

  const toSvgX = (d: number) => (d / maxDist) * 100;
  const toSvgY = (e: number) =>
    100 - ((e - minElev) / Math.max(maxElev - minElev, 1)) * 100;

  const svgPath =
    elevProfile.length > 1
      ? elevProfile
          .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.distance)} ${toSvgY(p.elevation)}`)
          .join(' ')
      : '';

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div ref={mapRef} className="day-map-container" />

      {!mapReady && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--parch)',
            color: 'var(--muted)',
            fontSize: '0.875rem',
          }}
        >
          Chargement de la carte…
        </div>
      )}

      {/* Profil altimétrique SVG */}
      {elevProfile.length > 1 && (
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
            Profil altimétrique — {minElev} m → {maxElev} m
          </div>
          <svg
            viewBox="0 0 100 30"
            preserveAspectRatio="none"
            className="elevation-chart"
            aria-label="Profil altimétrique du jour"
          >
            <defs>
              <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--forest, #5a7a5f)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--forest, #5a7a5f)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {/* Zone remplie */}
            <path
              d={`${svgPath} L ${toSvgX(maxDist)} 100 L 0 100 Z`}
              fill="url(#elevGrad)"
            />
            {/* Ligne */}
            <path
              d={svgPath}
              fill="none"
              stroke="var(--forest, #5a7a5f)"
              strokeWidth="0.8"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
