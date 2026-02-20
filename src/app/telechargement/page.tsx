import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Télécharger',
  description: 'Téléchargez gratuitement le récit en ePub ou PDF.',
};

export default function TelechargementPage() {
  return (
    <div className="simple-page">
      <div className="simple-page__inner">
        <h1 className="simple-page__title">Téléchargement</h1>
        <p className="simple-page__subtitle">
          Le livre est entièrement gratuit. Choisissez le format qui convient à votre usage.
        </p>

        <div className="download-options">
          <a href="/downloads/pelerinage.epub" download className="download-card">
            <div className="download-card__info">
              <div className="download-card__format">ePub</div>
              <div className="download-card__desc">Pour liseuse, iPhone, Android</div>
            </div>
            <span className="btn btn-outline" style={{ pointerEvents: 'none' }}>
              ↓ Télécharger
            </span>
          </a>

          <a href="/downloads/pelerinage.pdf" download className="download-card">
            <div className="download-card__info">
              <div className="download-card__format">PDF</div>
              <div className="download-card__desc">Mise en page soignée, pour écran ou impression</div>
            </div>
            <span className="btn btn-outline" style={{ pointerEvents: 'none' }}>
              ↓ Télécharger
            </span>
          </a>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Ces fichiers sont librement redistribuables dans un cadre non commercial.
          Si ce livre vous a touché, pensez à{' '}
          <Link href="/don" className="link-underline">soutenir l'auteur</Link>.
        </p>
      </div>
    </div>
  );
}
