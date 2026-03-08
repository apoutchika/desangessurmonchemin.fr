export default function ConfidentialitePage() {
  return (
    <div className="simple-page">
      <div className="simple-page__inner" style={{ maxWidth: '800px' }}>
        <h1 className="simple-page__title">Politique de confidentialité</h1>
        <p className="simple-page__subtitle">
          Dernière mise à jour : Mars 2026
        </p>

        <div style={{ 
          fontFamily: 'var(--font-serif)', 
          fontSize: '1rem', 
          lineHeight: 1.8,
          color: 'var(--earth)'
        }}>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            1. Responsable du traitement
          </h2>
          <p>
            Ce site est édité par Julien Philippon, développeur indépendant.
          </p>
          <p>
            Contact : via le <a href="/contact" className="link-underline">formulaire de contact</a>
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            2. Données collectées
          </h2>
          
          <h3 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.25rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2rem',
            marginBottom: '0.75rem'
          }}>
            2.1 Données de navigation
          </h3>
          <p>
            Nous utilisons Google Analytics pour comprendre comment les visiteurs utilisent le site. 
            Ces données sont anonymisées et incluent :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Pages visitées</li>
            <li>Durée de visite</li>
            <li>Type d'appareil et navigateur</li>
            <li>Pays et langue</li>
          </ul>
          <p>
            Vous pouvez refuser ces cookies via la bannière de consentement qui apparaît lors de votre première visite.
          </p>

          <h3 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.25rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2rem',
            marginBottom: '0.75rem'
          }}>
            2.2 Données d'interaction
          </h3>
          <p>
            Pour les fonctionnalités du site (likes, téléchargements), nous stockons :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Un identifiant anonyme (hash de votre adresse IP)</li>
            <li>Votre navigateur (user-agent)</li>
            <li>Les dates de vos interactions</li>
          </ul>
          <p>
            Ces données sont anonymisées et ne permettent pas de vous identifier personnellement. 
            Elles servent uniquement à éviter les doublons (un like ou téléchargement par personne).
          </p>

          <h3 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.25rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2rem',
            marginBottom: '0.75rem'
          }}>
            2.3 Formulaire de contact
          </h3>
          <p>
            Lorsque vous utilisez le formulaire de contact, nous collectons :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Votre nom</li>
            <li>Votre adresse email</li>
            <li>Le contenu de votre message</li>
          </ul>
          <p>
            Ces données sont envoyées par email et ne sont pas stockées dans une base de données. 
            Elles sont conservées uniquement le temps nécessaire pour répondre à votre demande.
          </p>

          <h3 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.25rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2rem',
            marginBottom: '0.75rem'
          }}>
            2.4 Paiements
          </h3>
          <p>
            Les paiements par carte bancaire sont gérés par Stripe. Nous ne stockons aucune donnée bancaire. 
            Consultez la <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener" className="link-underline">politique de confidentialité de Stripe</a> pour plus d'informations.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            3. Finalité du traitement
          </h2>
          <p>
            Les données collectées servent à :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Améliorer l'expérience utilisateur</li>
            <li>Comprendre l'audience du site</li>
            <li>Éviter les abus (likes multiples, téléchargements répétés)</li>
            <li>Répondre à vos messages</li>
          </ul>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            4. Durée de conservation
          </h2>
          <p>
            Les données anonymisées (likes, téléchargements) sont conservées indéfiniment pour les statistiques du site.
          </p>
          <p>
            Les données Google Analytics sont conservées selon les paramètres de Google (26 mois par défaut).
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            5. Vos droits
          </h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Droit d'accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l'effacement</li>
            <li>Droit d'opposition au traitement</li>
            <li>Droit à la portabilité</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous via le <a href="/contact" className="link-underline">formulaire de contact</a>.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            6. Cookies
          </h2>
          <p>
            Ce site utilise des cookies pour :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Google Analytics (si vous avez accepté)</li>
            <li>Mémoriser votre choix de consentement</li>
          </ul>
          <p>
            Vous pouvez à tout moment modifier vos préférences de cookies en cliquant sur le lien en bas de page.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            7. Sécurité
          </h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Chiffrement HTTPS</li>
            <li>Anonymisation des adresses IP</li>
            <li>Hébergement sécurisé</li>
          </ul>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            8. Modifications
          </h2>
          <p>
            Cette politique peut être mise à jour. La date de dernière modification est indiquée en haut de cette page.
          </p>
        </div>
      </div>
    </div>
  );
}
