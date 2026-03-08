'use client';

import { useState, useEffect } from 'react';

interface Props {
  dayId: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

export function DayLike({ dayId }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showTears, setShowTears] = useState(false);

  useEffect(() => {
    // Charger l'état initial
    fetch(`/api/likes?dayId=${dayId}`)
      .then(res => res.json())
      .then(data => {
        setLiked(data.liked);
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [dayId]);

  const createParticles = (isLike: boolean) => {
    if (isLike) {
      // Créer 8 petits cœurs qui tombent
      const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100, // -50 à 50px
        y: 0,
        rotation: Math.random() * 360,
        delay: i * 0.05, // Décalage de 50ms entre chaque
      }));
      setParticles(newParticles);
      
      // Nettoyer après l'animation
      setTimeout(() => setParticles([]), 1500);
    } else {
      // Afficher les larmes
      setShowTears(true);
      setTimeout(() => setShowTears(false), 1500);
    }
  };

  const handleLike = async () => {
    if (loading) return;

    const wasLiked = liked;
    
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayId }),
      });

      const data = await res.json();
      setLiked(data.liked);
      setCount(data.count);
      
      // Tracker dans GA
      if (typeof window !== 'undefined') {
        const { trackLike } = await import('@/lib/analytics');
        trackLike(dayId, data.liked ? 'add' : 'remove');
      }
      
      // Créer les particules après avoir reçu la réponse
      createParticles(data.liked);
    } catch (error) {
      console.error('Erreur like:', error);
    }
  };

  if (loading) return null;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleLike}
        className={`day-like ${liked ? 'day-like--liked' : ''} ${animating ? 'day-like--animating' : ''}`}
        aria-label={liked ? 'Retirer le like' : 'Aimer cette journée'}
        title={liked ? 'Retirer le like' : 'Aimer cette journée'}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={liked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        <span className="day-like__count">{count}</span>
      </button>

      {/* Particules de cœurs qui tombent */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="day-like-particle"
          style={{
            left: `calc(50% + ${particle.x}px)`,
            animationDelay: `${particle.delay}s`,
            '--rotation': `${particle.rotation}deg`,
          } as React.CSSProperties}
        >
          ❤️
        </div>
      ))}

      {/* Larmes qui tombent */}
      {showTears && (
        <>
          <div className="day-like-tear" style={{ left: '30%', animationDelay: '0s' }}>💧</div>
          <div className="day-like-tear" style={{ left: '50%', animationDelay: '0.1s' }}>💧</div>
          <div className="day-like-tear" style={{ left: '70%', animationDelay: '0.2s' }}>💧</div>
        </>
      )}
    </div>
  );
}
