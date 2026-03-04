"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getJourney } from "@/data/journey";

export function LivreSidebar() {
  const pathname = usePathname();
  const journey = getJourney();
  const days = journey.getAllDays();

  return (
    <aside className="livre-sidebar">
      <div className="livre-sidebar__title">Table des matières</div>

      {days.map((day) => {
        const slug = day.getSlug();
        const href = `/livre/${slug}`;
        const isActive = pathname === href;
        const isSpecial = !day.isJour();

        let label: string;
        if (day.isAvantPropos()) {
          label = day.title ?? "Avant-propos";
        } else if (day.isPostface()) {
          label = day.title ?? "Postface";
        } else {
          label = `Jour ${day.day}`;
        }

        let city = "";
        if (day.isJour() && day.from && day.to) {
          city = day.from.city === day.to.city 
            ? day.from.city 
            : `${day.from.city} → ${day.to.city}`;
        }

        return (
          <Link
            key={day.id}
            href={href}
            className={[
              "livre-sidebar__item",
              isActive && "livre-sidebar__item--active",
              isSpecial && "livre-sidebar__item--special",
            ]
              .filter(Boolean)
              .join(" ")}
            title={isSpecial ? label : day.getLabel()}
          >
            {label}
            {day.isJour() && city && (
              <span
                style={{
                  display: "block",
                  fontSize: "0.6875rem",
                  color: "var(--muted)",
                  marginTop: "1px",
                }}
              >
                {city}
              </span>
            )}
          </Link>
        );
      })}
    </aside>
  );
}
