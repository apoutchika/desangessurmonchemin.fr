"use client";

import type { SerializedDay, PageNavigation } from "@/domain";
import { useDay } from "@/domain";
import Link from "next/link";
import { useState, useEffect } from "react";
import { DayGallery } from "./DayGallery";
import { ProseContent } from "./ProseContent";
import { PlaceCard } from "./PlaceCard";
import { EndOfBookCTA } from "./EndOfBookCTA";
import { DayLike } from "./DayLike";
import { DayStatsBlock } from "./DayStatsBlock";
import { StatsToggle } from "./StatsToggle";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface Props {
  day: SerializedDay;
  nav: PageNavigation;
}

export function DayPage({ day: serializedDay, nav }: Props) {
  const day = useDay(serializedDay);

  // Détecter la taille d'écran
  const isDesktop = useMediaQuery("(min-width: 1200px)");

  // État pour afficher/masquer les stats (uniquement < 1200px)
  const [statsVisible, setStatsVisible] = useState(false);

  // Charger la préférence depuis localStorage au montage
  useEffect(() => {
    if (typeof window !== "undefined" && !isDesktop) {
      const saved = localStorage.getItem("statsVisible");
      setStatsVisible(saved === "true");
    }
  }, [isDesktop]);

  // Sauvegarder la préférence dans localStorage
  const handleToggleStats = (visible: boolean) => {
    setStatsVisible(visible);
    if (typeof window !== "undefined") {
      localStorage.setItem("statsVisible", String(visible));
    }
  };

  const isJour = day.isJour();
  const formattedDate = day.getFormattedDate();
  const title = day.getTitle();
  const hasStatsOrMap = day.hasStats() || day.hasMap();

  return (
    <div className="day-layout" translate="yes">
      {/* Contenu principal */}
      <article className="day-main">
        {/* En-tête */}
        <header className="day-header">
          {isJour && day.day && (
            <div className="day-header__eyebrow">Jour {day.day}</div>
          )}

          <h1 className="day-header__title">{title}</h1>

          {formattedDate && (
            <div className="day-header__date">{formattedDate}</div>
          )}

          {day.fromMemory && (
            <span className="day-header__badge">De mémoire</span>
          )}

          <div className="day-header__divider" />
        </header>

        {/* Bouton like (toutes les pages) */}
        <div className="day-like-wrapper">
          <DayLike pageSlug={day.slug} />
        </div>

        {/* Stats complètes tablette/mobile (768px - 1199px) */}
        {!isDesktop && isJour && hasStatsOrMap && (
          <div className="day-tablet-stats">
            <StatsToggle visible={statsVisible} onToggle={handleToggleStats} />

            {statsVisible && <DayStatsBlock day={day} />}
          </div>
        )}

        {/* Lieu de départ (avant le texte) */}
        {isJour && day.from && <PlaceCard place={day.from} type="departure" />}

        {/* Texte principal */}
        <ProseContent content={day.content} />

        {/* Lieu d'arrivée (après le texte) */}
        {isJour && day.to && (
          <div className="day-place-arrival">
            <PlaceCard place={day.to} type="arrival" />
          </div>
        )}

        {/* Galerie photos */}
        {day.hasPhotos() && <DayGallery photos={day.photos} />}

        {/* CTA fin de livre (postface uniquement) */}
        {day.isPostface() && <EndOfBookCTA />}

        {/* Navigation */}
        <nav className="day-nav" aria-label="Navigation entre les journées">
          {nav.prev ? (
            <Link href={`/livre/${nav.prev.slug}`} className="day-nav__link">
              <span className="day-nav__direction">← Précédent</span>
              <span className="day-nav__label">{nav.prev.label}</span>
            </Link>
          ) : (
            <div />
          )}

          {nav.next && (
            <Link
              href={`/livre/${nav.next.slug}`}
              className="day-nav__link day-nav__link--next"
            >
              <span className="day-nav__direction">Suivant →</span>
              <span className="day-nav__label">{nav.next.label}</span>
            </Link>
          )}
        </nav>
      </article>

      {/* === SIDEBAR DESKTOP (≥ 1200px) === */}
      {isDesktop && isJour && hasStatsOrMap && (
        <aside className="day-sidebar">
          <div className="day-sidebar__sticky">
            <DayStatsBlock day={day} />
          </div>
        </aside>
      )}
    </div>
  );
}
