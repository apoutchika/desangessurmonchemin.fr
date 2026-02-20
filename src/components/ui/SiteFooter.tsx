import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Sur le Chemin — Tous droits réservés</span>
      <nav style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="/telechargement" className="link-underline">Télécharger</Link>
        <Link href="/don" className="link-underline">Soutenir</Link>
      </nav>
    </footer>
  );
}
