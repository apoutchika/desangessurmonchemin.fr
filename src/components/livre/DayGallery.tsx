'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { Photo } from '@/types';

interface Props {
  photos: Photo[];
}

export function DayGallery({ photos }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  const prev = useCallback(() =>
    setLightbox(i => (i !== null ? (i - 1 + photos.length) % photos.length : null)),
    [photos.length]
  );

  const next = useCallback(() =>
    setLightbox(i => (i !== null ? (i + 1) % photos.length : null)),
    [photos.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, close, prev, next]);

  return (
    <>
      <div className="day-gallery">
        <div className="day-gallery__title">
          Photos — {photos.length} image{photos.length > 1 ? 's' : ''}
        </div>

        <div className="day-gallery__grid">
          {photos.map((photo, i) => (
            <button
              key={i}
              className="day-gallery__item"
              onClick={() => setLightbox(i)}
              aria-label={`Voir la photo : ${photo.alt}`}
              style={{ all: 'unset', cursor: 'pointer', display: 'block' }}
            >
              <div className="day-gallery__item" style={{ all: 'unset', position: 'relative', display: 'block', aspectRatio: '4/3', overflow: 'hidden', borderRadius: '8px', background: 'var(--parch)' }}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
                />
                {photo.caption && (
                  <div className="day-gallery__caption">{photo.caption}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="lightbox"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photo"
        >
          <button
            className="lightbox__close"
            onClick={close}
            aria-label="Fermer"
          >
            ✕
          </button>

          {photos.length > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={e => { e.stopPropagation(); prev(); }}
                aria-label="Photo précédente"
              >
                ‹
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={e => { e.stopPropagation(); next(); }}
                aria-label="Photo suivante"
              >
                ›
              </button>
            </>
          )}

          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}>
            <Image
              src={photos[lightbox].src}
              alt={photos[lightbox].alt}
              width={photos[lightbox].width ?? 1200}
              height={photos[lightbox].height ?? 800}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px' }}
            />
          </div>

          {photos[lightbox].caption && (
            <div className="lightbox__caption">{photos[lightbox].caption}</div>
          )}
        </div>
      )}
    </>
  );
}
