import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Des anges sur mon chemin — Tous droits réservés</span>
      <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/mentions-legales" className="footer-link">Mentions légales</Link>
        <Link href="/confidentialite" className="footer-link">Confidentialité</Link>
      </nav>
    </footer>
  );
}
