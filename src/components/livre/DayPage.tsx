import type { JourneyDay, PageNavigation } from '@/types';
import Link from 'next/link';
import { DayStats } from './DayStats';
import { DayMap } from './DayMap';
import { DayGallery } from './DayGallery';
import { ProseContent } from './ProseContent';

interface Props {
  day: JourneyDay;
  nav: PageNavigation;
}

export function DayPage({ day, nav }: Props) {
  const isJour = day.type === 'jour';

  const formattedDate = day.date
    ? new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(day.date))
    : null;

  return (
    <article className="livre-content animate-slide-up">
      {/* En-tête */}
      <header className="day-header">
        {isJour && day.day && (
          <div className="day-header__eyebrow">Jour {day.day}</div>
        )}

        <h1 className="day-header__title">
          {isJour
            ? `${day.from?.city} → ${day.to?.city}`
            : day.title}
        </h1>

        {formattedDate && (
          <div className="day-header__date">{formattedDate}</div>
        )}

        {day.tags && day.tags.length > 0 && (
          <div className="tags" style={{ marginTop: '1rem' }}>
            {day.tags.map(t => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}

        <div className="day-header__divider" />
      </header>

      {/* Stats du jour */}
      {isJour && day.stats && <DayStats stats={day.stats} />}

      {/* Carte interactive */}
      {isJour && day.from && day.to && (
        <DayMap day={day} />
      )}

      {/* Texte */}
      <ProseContent content={day.content} />

      {/* Galerie */}
      {day.photos && day.photos.length > 0 && (
        <DayGallery photos={day.photos} />
      )}

      {/* Navigation */}
      <nav className="day-nav" aria-label="Navigation entre les journées">
        {nav.prev ? (
          <Link href={`/livre/${nav.prev.slug}`} className="day-nav__link">
            <span className="day-nav__direction">← Précédent</span>
            <span className="day-nav__label">{nav.prev.label}</span>
          </Link>
        ) : <div />}

        {nav.next && (
          <Link href={`/livre/${nav.next.slug}`} className="day-nav__link day-nav__link--next">
            <span className="day-nav__direction">Suivant →</span>
            <span className="day-nav__label">{nav.next.label}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
