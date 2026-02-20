import type { Metadata } from 'next';
import './globals.css';
import { SiteNav } from '@/components/ui/SiteNav';
import { SiteFooter } from '@/components/ui/SiteFooter';

export const metadata: Metadata = {
  title: {
    default: 'Sur le Chemin — Un pèlerinage en mots et en pas',
    template: '%s — Sur le Chemin',
  },
  description:
    'Soixante jours de marche, mille deux cents kilomètres, un seul fil conducteur : ' +
    'la quête de ce que la lenteur révèle.',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Sur le Chemin',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <SiteNav />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
