"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    } else if (consent === "accepted") {
      // Petit délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        loadGoogleAnalytics();
      }, 100);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
    loadGoogleAnalytics();
  };

  const refuse = () => {
    localStorage.setItem("cookie-consent", "refused");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--white)",
        borderTop: "1px solid var(--line)",
        padding: "1.5rem",
        zIndex: 9999,
        boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.9375rem",
              color: "var(--ink)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Ce site utilise des cookies pour améliorer votre expérience et
            analyser le trafic via Google Analytics.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8125rem",
              color: "var(--muted)",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            En savoir plus :{" "}
            <Link href="/confidentialite" className="link-underline">
              Politique de confidentialité
            </Link>
            {" • "}
            <Link href="/mentions-legales" className="link-underline">
              Mentions légales
            </Link>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={accept}
            className="btn btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}
          >
            Accepter
          </button>
          <button
            onClick={refuse}
            className="btn btn-outline"
            style={{ fontSize: "0.875rem", padding: "0.625rem 1.25rem" }}
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
}

function loadGoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  
  if (!GA_ID) {
    console.warn('Google Analytics ID not found');
    return;
  }

  // Vérifier si déjà chargé
  if (window.gtag) {
    console.log('Google Analytics already loaded');
    return;
  }

  console.log('Loading Google Analytics:', GA_ID);

  // Initialiser dataLayer AVANT de charger le script
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer!.push(arguments);
  };

  // Charger le script Google Analytics
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  
  script.onload = () => {
    console.log('Google Analytics script loaded');
    // Initialiser après le chargement
    window.gtag!("js", new Date());
    window.gtag!("config", GA_ID, {
      anonymize_ip: true,
      cookie_flags: 'SameSite=None;Secure',
    });
  };

  script.onerror = () => {
    console.error('Failed to load Google Analytics script');
  };

  document.head.appendChild(script);
}
