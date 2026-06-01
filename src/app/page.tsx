import Link from "next/link";
import { getJourneyStats } from "@/data/journey";
import { formatNumber } from "@/lib/formatNumber";
import { BookCover } from "@/components/ui/BookCover";

const bookSchema = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Des anges sur mon chemin",
  alternateName: "Un printemps vers Santiago",
  author: {
    "@type": "Person",
    name: "Julien Philippon",
  },
  description:
    "De Lyon à Compostelle, 1 815 kilomètres seul mais jamais vraiment. Le récit d'une aventure humaine portée par les rencontres du chemin.",
  inLanguage: "fr",
  url: "https://www.desangessurmonchemin.fr",
  image: "https://s3.desangessurmonchemin.fr/Des_anges_sur_mon_chemin.cover.jpg",
  genre: "Récit de voyage",
  keywords:
    "Camino de Santiago, pèlerinage, Saint-Jacques-de-Compostelle, Saint-Jacques, chemin de Saint-Jacques, chemin de Compostelle, Compostelle, GR 65, Via Podiensis, récit de voyage, récit de pèlerinage, carnet de voyage, Lyon Compostelle, pèlerin, marche",
  isbn: "979-8253396025",
  datePublished: "2026-03-23",
  workExample: [
    {
      "@type": "Book",
      bookFormat: "https://schema.org/EBook",
      url: "https://www.desangessurmonchemin.fr/telechargement",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "Book",
      bookFormat: "https://schema.org/Paperback",
      isbn: "979-8253396025",
      url: "https://amzn.eu/d/0elqDxQ8",
      offers: {
        "@type": "Offer",
        price: "14.90",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        seller: {
          "@type": "Organization",
          name: "Amazon",
        },
      },
    },
  ],
  potentialAction: {
    "@type": "ReadAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.desangessurmonchemin.fr/livre",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
  },
};

export default function HomePage() {
  const stats = getJourneyStats();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__inner">
          <span className="home-hero__kicker">Récit de pèlerinage</span>
          <h1 className="home-hero__title">
            Des anges sur <em>mon chemin</em>
          </h1>
          <p className="home-hero__subtitle">Un printemps vers Santiago</p>

          {/* Layout 2 colonnes sur grand écran */}
          <div className="home-hero__content">
            <div className="home-hero__book">
              <BookCover size="large" />
            </div>

            <div className="home-hero__text">
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.125rem)",
                  color: "var(--stone)",
                  lineHeight: 1.7,
                  marginBottom: "2rem",
                  textAlign: "center",
                }}
              >
                De Lyon à Compostelle, 1 815 kilomètres seul mais jamais
                vraiment.
                <br />
                Le récit d'une aventure humaine portée par les rencontres du
                chemin.
              </p>

              <div className="home-ctas" style={{ justifyContent: "center" }}>
                <Link href="/livre" className="btn btn-primary">
                  Commencer la lecture →
                </Link>
                <Link href="/telechargement" className="btn btn-outline">
                  Télécharger (ePub/PDF)
                </Link>
              </div>
              <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--muted)" }}>
                Aussi disponible en{" "}
                <a
                  href="https://amzn.eu/d/0elqDxQ8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline"
                  style={{ color: "var(--stone)" }}
                >
                  version papier sur Amazon
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats globales */}
      <section
        style={{
          background: "var(--sand)",
          padding: "clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 3rem)",
        }}
      >
        <div className="container">
          <div
            className="day-stats"
            style={{ maxWidth: 700, margin: "0 auto" }}
          >
            <div className="day-stats__item">
              <span className="day-stats__value">{stats.totalDays}</span>
              <span className="day-stats__label">Jours de marche</span>
            </div>
            <div className="day-stats__item">
              <span className="day-stats__value">
                {formatNumber(stats.totalDistance, "", 0)}
              </span>
              <span className="day-stats__label">Kilomètres</span>
            </div>
            <div className="day-stats__item">
              <span className="day-stats__value">
                {formatNumber(stats.totalElevationGain, "", 0)}
              </span>
              <span className="day-stats__label">Mètres D+</span>
            </div>
            <div className="day-stats__item">
              <span className="day-stats__value">
                {stats.startCity?.split(" ")[0]}
              </span>
              <span className="day-stats__label">Ville de départ</span>
            </div>
          </div>
        </div>
      </section>

      {/* Résumé */}
      <section
        style={{
          padding: "clamp(2rem, 4vw, 3.5rem) clamp(1rem, 4vw, 3rem)",
        }}
      >
        <div className="container" style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Le livre
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              fontSize: "clamp(1rem, 1.5vw, 1.0625rem)",
              color: "var(--stone)",
              lineHeight: 1.8,
            }}
          >
            <p>
              Le 23 mars 2025, après avoir achevé un important projet
              professionnel de plus de quinze mois de travail presque non-stop,
              Julien décide de quitter son bureau pour rejoindre le chemin de
              Saint-Jacques-de-Compostelle.
            </p>
            <p>
              Dans son sac à dos : un ordinateur portable, du matériel de magie
              et le strict nécessaire. Dans son cœur : le deuil brutal de son
              parrain, survenu quelques jours seulement avant le départ.
            </p>
            <p>
              À travers ce journal de bord, il partage, jour après jour, son
              périple de France en Espagne : les efforts physiques, la traversée
              du deuil, ses tours de magie improvisés sur la route, ses
              introspections et les bonheurs simples du quotidien.
            </p>
            <p>
              Au cœur de ce récit : toutes ces rencontres – ses « anges » d’un
              instant – qui l’ont accompagné et aidé à tenir le chemin tout au
              long de ses 1 815 km.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: "0.5rem",
            }}
          >
            Un livre à votre rythme
          </h2>
          <p
            style={{
              color: "var(--stone)",
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
            }}
          >
            Le récit est gratuit en ligne et en numérique. Disponible aussi en
            version papier sur Amazon.
          </p>

          <div className="home-features__grid">
            <FeatureCard
              icon="📖"
              title="Livre interactif"
              desc="Cartes, photos, profils altimétriques — vivez le voyage depuis chez vous."
              href="/livre"
              cta="Commencer la lecture"
            />
            <FeatureCard
              icon="⬇️"
              title="Formats numériques"
              desc="Emportez le récit avec vous en ePub ou PDF, pour lire hors ligne sur tous vos appareils."
              href="/telechargement"
              cta="Télécharger"
            />
            <FeatureCard
              icon="☕"
              title="Prix libre"
              desc="Le récit est offert librement. Si le voyage vous a touché, un don soutient l'auteur."
              href="/don"
              cta="Soutenir le projet"
            />
          </div>

          <Link
            href="https://amzn.eu/d/0elqDxQ8"
            target="_blank"
            rel="noopener noreferrer"
            className="paper-banner"
          >
            <span className="paper-banner__label">Édition imprimée</span>
            <div className="paper-banner__body">
              <span className="paper-banner__icon">📚</span>
              <div>
                <p className="paper-banner__title">Envie de le tenir entre les mains ?</p>
                <p className="paper-banner__sub">Commander la version papier sur Amazon</p>
              </div>
            </div>
            <span className="paper-banner__arrow">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  href,
  cta,
  external,
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="feature-card"
      style={{ display: "block", textDecoration: "none" }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <div className="feature-card__icon">{icon}</div>
      <h3 className="feature-card__title">{title}</h3>
      <p className="feature-card__desc">{desc}</p>
      <p
        style={{
          marginTop: "1rem",
          fontSize: "0.8125rem",
          color: "var(--rust)",
          fontWeight: 500,
        }}
      >
        {cta} →
      </p>
    </Link>
  );
}
