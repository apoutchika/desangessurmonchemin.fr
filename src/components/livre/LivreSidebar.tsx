"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { journeyData, getSlug, getPageLabel } from "@/data/journey";
import { JourneyDay } from "@/types";

export function LivreSidebar() {
  const pathname = usePathname();

  return (
    <aside className="livre-sidebar">
      <div className="livre-sidebar__title">Table des matières</div>

      {journeyData.map((day) => {
        const slug = getSlug(day);
        const href = `/livre/${slug}`;
        const isActive = pathname === href;
        const isSpecial = day.type !== "jour";

        let label: string;
        if (day.type === "avant-propos") {
          label = day.title ?? "Avant-propos";
        } else if (day.type === "postface") {
          label = day.title ?? "Postface";
        } else {
          label = `Jour ${day.day}`;
        }

        let city = `${day.from?.city} → ${day.to?.city} 3`;
        if (day.from?.city === day.to?.city) {
          city = day.from?.city ?? "";
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
            title={isSpecial ? label : getPageLabel(day)}
          >
            {label}
            {day.type === "jour" && day.from && day.to && (
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
