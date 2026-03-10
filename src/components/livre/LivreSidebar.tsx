"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getJourney } from "@/data/journey";
import { useEffect } from "react";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
}

export function LivreSidebar({ isOpen, onToggle }: Props) {
  const pathname = usePathname();
  const journey = getJourney();
  const days = journey.getAllDays();

  // Fermer la sidebar au changement de route
  useEffect(() => {
    if (isOpen && window.innerWidth < 1500) {
      onToggle();
    }
  }, [pathname]);

  // Empêcher le scroll du body quand la sidebar est ouverte sur mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1500) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Bouton toggle avec SVG vague organique */}
      <button
        onClick={onToggle}
        className={`livre-sidebar__toggle ${isOpen ? "livre-sidebar__toggle--open" : ""}`}
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <svg
          width="60"
          height="180"
          viewBox="0 0 60 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <defs>
            <filter
              id="shadow"
              x="0"
              y="0"
              width="70"
              height="190"
              filterUnits="userSpaceOnUse"
            >
              <feGaussianBlur stdDeviation="3" in="SourceAlpha" />
              <feOffset dx="2" dy="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.15" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#shadow)">
            <path
              d="M 0,0 C 0,45 55,45 55,90 C 55,135 0,135 0,180 L 0,0 Z"
              fill="#5a7a5f"
            />
          </g>
          {/* Flèche stylée qui change de sens */}
          <g
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transformOrigin: "30px 90px",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Flèche simple et élégante */}
            <path d="M 36 90 L 24 84 L 24 96 Z" fill="#f5f0e8" opacity="0.9" />
          </g>
        </svg>
      </button>

      {/* Overlay sombre (< 1500px uniquement) */}
      <div
        className={`livre-sidebar-overlay ${isOpen ? "livre-sidebar-overlay--visible" : ""}`}
        onClick={onToggle}
        aria-hidden="true"
      />

      <aside className={`livre-sidebar ${isOpen ? "livre-sidebar--open" : ""}`}>
        <div className="livre-sidebar__title">Table des matières</div>

        {days.map((day) => {
          const slug = day.getSlug();
          const href = `/livre/${slug}`;
          const isActive = pathname === href;
          const isSpecial = !day.isJour();

          const label = day.title;

          let city = "";
          if (day.isJour() && (day.from || day.to)) {
            city = day.getFromTo();
          }

          return (
            <Link
              key={day.slug}
              href={href}
              title={(isSpecial ? label : day.getLabel()) ?? undefined}
              className={[
                "livre-sidebar__item",
                isActive && "livre-sidebar__item--active",
                isSpecial && "livre-sidebar__item--special",
              ]
                .filter(Boolean)
                .join(" ")}
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
    </>
  );
}
