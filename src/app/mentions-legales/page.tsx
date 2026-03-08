export default function MentionsLegalesPage() {
  return (
    <div className="simple-page">
      <div className="simple-page__inner" style={{ maxWidth: '800px' }}>
        <h1 className="simple-page__title">Mentions légales</h1>

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
            1. Éditeur du site
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
            2. Hébergement
          </h2>
          <p>
            Ce site est hébergé par Vercel Inc.<br />
            340 S Lemon Ave #4133<br />
            Walnut, CA 91789<br />
            États-Unis
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            3. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble du contenu de ce site (textes, photographies, illustrations, code source) 
            est la propriété exclusive de Julien Philippon, sauf mention contraire.
          </p>
          <p>
            Le livre "Des anges sur mon chemin" est mis à disposition gratuitement pour une lecture personnelle. 
            Toute reproduction, distribution ou utilisation commerciale sans autorisation est interdite.
          </p>
          <p>
            Les fichiers ePub et PDF sont librement redistribuables dans un cadre non commercial, 
            à condition de mentionner l'auteur et de ne pas modifier le contenu.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            4. Données personnelles
          </h2>
          <p>
            Pour toute information concernant la collecte et le traitement de vos données personnelles, 
            consultez notre <a href="/confidentialite" className="link-underline">politique de confidentialité</a>.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            5. Cookies
          </h2>
          <p>
            Ce site utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic. 
            Vous pouvez gérer vos préférences via la bannière de consentement.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            6. Limitation de responsabilité
          </h2>
          <p>
            L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. 
            Toutefois, il ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
          </p>
          <p>
            L'éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès 
            au site ou de l'utilisation de celui-ci.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            7. Liens hypertextes
          </h2>
          <p>
            Ce site peut contenir des liens vers des sites externes. L'éditeur n'exerce aucun contrôle 
            sur ces sites et décline toute responsabilité quant à leur contenu.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            8. Droit applicable
          </h2>
          <p>
            Les présentes mentions légales sont régies par le droit français. 
            En cas de litige, les tribunaux français seront seuls compétents.
          </p>

          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.5rem', 
            fontWeight: 600,
            color: 'var(--ink)',
            marginTop: '2.5rem',
            marginBottom: '1rem'
          }}>
            9. Crédits
          </h2>
          <p>
            Conception, développement et rédaction : Julien Philippon
          </p>
          <p>
            Photographies : Julien Philippon (sauf mention contraire)
          </p>
          <p>
            Typographies : EB Garamond (Google Fonts), Jost (Google Fonts)
          </p>
        </div>
      </div>
    </div>
  );
}
