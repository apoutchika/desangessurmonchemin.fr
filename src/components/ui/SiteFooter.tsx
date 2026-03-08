import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Des anges sur mon chemin — Tous droits réservés</span>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="/telechargement" className="footer-link">⬇️ Télécharger</Link>
        <Link href="/don" className="footer-link">☕ Soutenir</Link>
      </nav>
    </footer>
  );
}
