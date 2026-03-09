'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TelechargementPage() {
  const [stats, setStats] = useState<{ total: number; epub: number; pdf: number } | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setStats(null));
  }, []);

  const handleDownload = async (format: 'epub' | 'pdf') => {
    try {
      // Incrémenter le compteur
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });
      
      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }

      // Tracker dans GA
      if (typeof window !== 'undefined') {
        const { trackDownload } = await import('@/lib/analytics');
        trackDownload(format);
      }

      // Télécharger le fichier via l'API
      window.location.href = `/api/download-file?format=${format}`;
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    }
  };

  return (
    <div className="simple-page">
      <div className="simple-page__inner">
        <h1 className="simple-page__title">Téléchargement</h1>
        <p className="simple-page__subtitle">
          Téléchargement gratuit, contribution libre.<br /> Choisissez le format qui convient à votre usage.
        </p>

        {stats && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'var(--sand)',
              border: '1px solid var(--line)',
              borderRadius: '100px',
              fontSize: '0.8125rem',
              color: 'var(--stone)',
              marginBottom: '2rem',
            }}
          >
            <span>📥</span>
            <span>{stats.total} téléchargement{stats.total > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="download-options">
          <button
            onClick={() => handleDownload('epub')}
            className="download-card"
          >
            <div className="download-card__info">
              <div className="download-card__format">ePub</div>
              <div className="download-card__desc">Pour liseuse, iPhone, Android</div>
              {stats && stats.epub > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  {stats.epub} téléchargement{stats.epub > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <span className="btn btn-outline">
              ↓ Télécharger
            </span>
          </button>

          <button
            onClick={() => handleDownload('pdf')}
            className="download-card"
          >
            <div className="download-card__info">
              <div className="download-card__format">PDF</div>
              <div className="download-card__desc">Mise en page soignée, pour écran ou impression</div>
              {stats && stats.pdf > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  {stats.pdf} téléchargement{stats.pdf > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <span className="btn btn-outline">
              ↓ Télécharger
            </span>
          </button>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Ces fichiers sont librement redistribuables dans un cadre non commercial.
          Si ce livre vous a touché après l'avoir lu, pensez à{' '}
          <Link href="/don" className="link-underline">soutenir l'auteur</Link>.
        </p>
      </div>
    </div>
  );
}
