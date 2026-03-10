'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './not-found.css';

export default function NotFound() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const walker = ['🚶', '🚶‍♂️', '🚶', '🚶‍♂️'][step];

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        {/* Animation du marcheur */}
        <div className="not-found-walker">{walker}</div>

        {/* Numéro 404 stylisé */}
        <h1 className="not-found-title">
          <span className="not-found-number">4</span>
          <span className="not-found-zero">🧭</span>
          <span className="not-found-number">4</span>
        </h1>

        {/* Message amusant */}
        <h2 className="not-found-subtitle">Vous vous êtes égaré !</h2>
        
        <p className="not-found-text">
          On dirait que vous avez quitté le chemin balisé. 
          Même les pèlerins les plus expérimentés se perdent parfois...
        </p>

        <div className="not-found-quote">
          <p>« Ce n'est pas grave de se perdre,</p>
          <p>c'est souvent là qu'on fait les plus belles rencontres. »</p>
        </div>

        {/* Boutons de navigation */}
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            🏠 Retour à l'accueil
          </Link>
          <Link href="/livre" className="btn btn-outline">
            📖 Commencer la lecture
          </Link>
        </div>

        {/* Petite note humoristique */}
        <p className="not-found-footer">
          Astuce : Vérifiez votre boussole (ou l'URL) 😉
        </p>
      </div>
    </div>
  );
}
