import Link from "next/link";
import { getJourneyStats } from "@/data/journey";
import { formatNumber } from "@/lib/formatNumber";

export default function HomePage() {
  const stats = getJourneyStats();

  return (
    <>
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__inner">
          <span className="home-hero__kicker">Récit de pèlerinage</span>
          <h1 className="home-hero__title">
            Sur le <em>Chemin</em>
          </h1>
          <p className="home-hero__subtitle">
            Soixante jours de marche. {Math.round(stats.totalDistance)}{" "}
            kilomètres. {formatNumber(stats.totalElevationGain, null, 0)} mètres
            de dénivelé. Une seule question : qu'est-ce qu'on laisse derrière
            soi quand on marche vers l'essentiel ?
          </p>
          <div className="home-ctas">
            <Link href="/livre" className="btn btn-primary">
              Lire le livre →
            </Link>
            <Link href="/telechargement" className="btn btn-outline">
              Télécharger
            </Link>
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
            Lisez en ligne, emportez-le ou soutenez l'auteur.
          </p>

          <div className="home-features__grid">
            <FeatureCard
              icon="📖"
              title="Livre interactif"
              desc="Cartes interactives, galeries photos, profils altimétriques — vivez le voyage depuis chez vous."
              href="/livre"
              cta="Commencer la lecture"
            />
            <FeatureCard
              icon="⬇️"
              title="Téléchargement gratuit"
              desc="Emportez le récit avec vous en ePub pour liseuse ou en PDF soigneusement mis en page."
              href="/telechargement"
              cta="Télécharger"
            />
            <FeatureCard
              icon="☕"
              title="Soutenir l'auteur"
              desc="Ce livre est gratuit. Si le voyage vous a touché, un don même modeste fait une vraie différence."
              href="/don"
              cta="Faire un don"
            />
          </div>
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
}: {
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className="feature-card"
      style={{ display: "block", textDecoration: "none" }}
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
