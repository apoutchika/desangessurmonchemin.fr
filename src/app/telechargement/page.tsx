"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type BookVersion = { version: string; lastUpdated: string };

const EPUB_GUIDE = [
  {
    name: "Apple Livres",
    platforms: ["iPhone / iPad", "Mac"],
    desc: "natif, ouvrez simplement le fichier",
  },
  {
    name: "Google Play Livres",
    platforms: ["Android"],
    desc: "gratuit, importez l'ePub directement",
  },
  {
    name: "Kindle",
    platforms: ["iPhone / iPad", "Android", "Liseuse"],
    desc: "app Amazon sur mobile, envoi par e-mail (@kindle.com) sur liseuse",
  },
  {
    name: "Lithium",
    platforms: ["Android"],
    desc: "interface sobre, parfait pour lire sans se perdre dans les options",
  },
  {
    name: "Moon+ Reader",
    platforms: ["Android"],
    desc: "plus complet, pour ceux qui aiment personnaliser (polices, thèmes…)",
  },
  {
    name: "Kobo",
    platforms: ["Liseuse"],
    desc: "ePub natif, branchez et copiez",
  },
  {
    name: "Calibre",
    platforms: ["Windows", "Mac", "Linux"],
    desc: "gratuit, idéal pour gérer sa bibliothèque",
  },
];

export default function TelechargementPage() {
  const [stats, setStats] = useState<{
    total: number;
    epub: number;
    pdf: number;
  } | null>(null);
  const [bookVersion, setBookVersion] = useState<BookVersion | null>(null);
  const [showEpubGuide, setShowEpubGuide] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => setStats(null));

    fetch("/book.version.json")
      .then((res) => res.json())
      .then((data) => setBookVersion(data))
      .catch(() => setBookVersion(null));
  }, []);

  useEffect(() => {
    if (showEpubGuide) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showEpubGuide]);

  const handleDownload = async (format: "epub" | "pdf") => {
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      const data = await res.json();
      if (data.stats) {
        setStats(data.stats);
      }

      if (typeof window !== "undefined") {
        const { trackDownload } = await import("@/lib/analytics");
        trackDownload(format);
      }

      const vParam = bookVersion
        ? `&v=${encodeURIComponent(bookVersion.version)}`
        : "";
      window.location.href = `/api/download-file?format=${format}${vParam}`;
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    }
  };

  return (
    <div className="simple-page">
      <div className="simple-page__inner">
        <h1 className="simple-page__title">Téléchargement gratuit</h1>
        <p className="simple-page__subtitle">
          Téléchargement gratuit, contribution libre. Choisissez le format qui
          convient à votre appareil.
        </p>

        <div style={{ marginBottom: "0.75rem" }}>
          {bookVersion && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                padding: "0.375rem 0.875rem",
                background: "var(--sand)",
                border: "1px solid var(--line)",
                borderRadius: "100px",
                fontSize: "0.8125rem",
                color: "var(--stone)",
                marginRight: "0.75rem",
              }}
            >
              <span style={{ fontWeight: 600 }}>v{bookVersion.version}</span>
              <span style={{ fontWeight: 600 }}>・</span>
              <span>Mise à jour le {bookVersion.lastUpdated}</span>
            </div>
          )}

          {stats && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "var(--sand)",
                border: "1px solid var(--line)",
                borderRadius: "100px",
                fontSize: "0.8125rem",
                color: "var(--stone)",
              }}
            >
              <span>📥</span>
              <span>
                {stats.total} téléchargement{stats.total > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="download-options">
          <div>
            <button
              onClick={() => handleDownload("epub")}
              className="download-card"
            >
              <div className="download-card__info">
                <div className="download-card__format">ePub</div>
                <div className="download-card__desc">
                  Pour liseuse, iPhone, Android
                </div>
                {stats && stats.epub > 0 && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {stats.epub} téléchargement{stats.epub > 1 ? "s" : ""}
                  </div>
                )}
              </div>
              <span className="btn btn-outline">↓ Télécharger</span>
            </button>
            <button
              onClick={() => setShowEpubGuide(true)}
              className="epub-guide-trigger"
            >
              Comment le lire ?
            </button>
          </div>

          <button
            onClick={() => handleDownload("pdf")}
            className="download-card"
          >
            <div className="download-card__info">
              <div className="download-card__format">PDF</div>
              <div className="download-card__desc">
                Mise en page soignée, pour écran ou impression
              </div>
              {stats && stats.pdf > 0 && (
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    marginTop: "0.25rem",
                  }}
                >
                  {stats.pdf} téléchargement{stats.pdf > 1 ? "s" : ""}
                </div>
              )}
            </div>
            <span className="btn btn-outline">↓ Télécharger</span>
          </button>
        </div>

        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--muted)",
            lineHeight: 1.6,
          }}
        >
          Librement redistribuables dans un cadre non commercial. Si le voyage
          vous a touché,{" "}
          <Link href="/don" className="link-underline">
            soutenez l&apos;auteur
          </Link>
          .
        </p>

        <a
          href="https://amzn.eu/d/0elqDxQ8"
          target="_blank"
          rel="noopener noreferrer"
          className="paper-banner"
          style={{ marginTop: "2rem" }}
        >
          <span className="paper-banner__label">Édition imprimée</span>
          <div className="paper-banner__body">
            <span className="paper-banner__icon">📚</span>
            <div>
              <p className="paper-banner__title">
                Envie de le tenir entre les mains ?
              </p>
              <p className="paper-banner__sub">
                Commander la version papier sur Amazon
              </p>
            </div>
          </div>
          <span className="paper-banner__arrow">→</span>
        </a>
      </div>

      {showEpubGuide && (
        <div
          className="epub-modal-backdrop"
          onClick={() => setShowEpubGuide(false)}
        >
          <div
            className="epub-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Comment lire un ePub"
          >
            <div className="epub-modal__header">
              <h2 className="epub-modal__title">Comment lire un ePub ?</h2>
              <button
                className="epub-modal__close"
                onClick={() => setShowEpubGuide(false)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <ul className="epub-modal__apps">
              {EPUB_GUIDE.map((app) => (
                <li key={app.name}>
                  <div className="epub-modal__app-row">
                    <strong>{app.name}</strong>
                    <span className="epub-modal__app-platforms">
                      {app.platforms.map((p) => (
                        <span key={p} className="epub-modal__badge">{p}</span>
                      ))}
                    </span>
                  </div>
                  <span className="epub-modal__app-desc">{app.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
