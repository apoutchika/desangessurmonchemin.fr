"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import { emitter } from "@/lib/events";
import type { GpxPoint } from "@/types";
import { getElevationProfile } from "@/lib/gpx";
import { formatNumber } from "@/lib/formatNumber";

interface DataPoint {
  distance: number;
  elevation: number;
  lat: number;
  lng: number;
}

interface Props {
  points: GpxPoint[]; // points GPX bruts avec lat/lng/ele
}

// Ticks tous les km entiers
function kmTicks(data: DataPoint[]): number[] {
  if (!data.length) return [];
  const max = data[data.length - 1].distance;
  const ticks: number[] = [];
  for (let km = 1; km <= Math.floor(max); km++) ticks.push(km);
  return ticks;
}

// Tooltip personnalisé
function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as DataPoint;
  return (
    <div
      style={{
        background: "var(--ink)",
        color: "var(--white)",
        padding: "0.5rem 0.75rem",
        borderRadius: "6px",
        fontSize: "0.75rem",
        fontFamily: "var(--font-sans)",
        lineHeight: 1.6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontVariantNumeric: "tabular-nums" }}>
        <strong>{formatNumber(d.elevation, "m", 1)}</strong>
      </div>
      <div style={{ color: "var(--warm)", fontVariantNumeric: "tabular-nums" }}>
        {formatNumber(d.distance, "km", 2)}
      </div>
    </div>
  );
}

export function DayElevation({ points }: Props) {
  // Construire les données enrichies avec lat/lng
  const profile = getElevationProfile(points); // { distance, elevation }[]

  // On réinjecte lat/lng en interpolant sur l'index
  const data: DataPoint[] = profile.map((p, i) => {
    const srcIdx = Math.round(
      (i / Math.max(profile.length - 1, 1)) * (points.length - 1),
    );
    return {
      distance: p.distance,
      elevation: p.elevation,
      lat: points[srcIdx]?.lat ?? 0,
      lng: points[srcIdx]?.lng ?? 0,
    };
  });

  const ticks = kmTicks(data);
  const elevations = data.map((d) => d.elevation);
  const minEle = Math.min(...elevations);
  const maxEle = Math.max(...elevations);
  // Marge visuelle de 10% en bas pour que le remplissage ne colle pas
  const yDomain = [
    Math.max(0, minEle - (maxEle - minEle) * 0.15),
    maxEle + (maxEle - minEle) * 0.1,
  ];

  const handleMouseMove = (state: any) => {
    const v = state?.activeIndex;
    if (!v || !v.match(/^\d+$/)) {
      emitter.emit("elevation:hover", null);
      return;
    }
    emitter.emit("elevation:hover", Number(v));
  };

  const handleMouseLeave = () => {
    emitter.emit("elevation:hover", null);
  };

  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart
          data={data.map((d) => ({ ...d, key: d.id }))}
          margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5a7a5f" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#5a7a5f" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="distance"
            type="number"
            domain={["dataMin", "dataMax"]}
            ticks={ticks}
            tickFormatter={(v) => formatNumber(v, "km", 0)}
            tick={{
              fontSize: 10,
              fill: "var(--muted)",
              fontFamily: "var(--font-sans)",
            }}
            axisLine={{ stroke: "var(--line)" }}
            tickLine={false}
          />

          <YAxis
            domain={yDomain}
            tickFormatter={(v) => formatNumber(v, "m", 0)}
            tick={
              {
                fontSize: 10,
                fill: "var(--muted)",
                fontFamily: "var(--font-sans)",
                fontVariantNumeric: "tabular-nums",
              } as React.SVGAttributes<SVGElement>
            }
            axisLine={false}
            tickLine={false}
            width={44}
            tickCount={4}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--stone)",
              strokeWidth: 1,
              strokeDasharray: "4 2",
            }}
          />

          <Area
            type="basis"
            dataKey="elevation"
            stroke="#5a7a5f"
            strokeWidth={1.5}
            fill="url(#elevGradient)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "#5a7a5f",
              stroke: "var(--white)",
              strokeWidth: 2,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
