import type { Metadata } from 'next';
import './globals.css';
import { SiteNav } from '@/components/ui/SiteNav';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { CookieConsent } from '@/components/ui/CookieConsent';

export const metadata: Metadata = {
  title: {
    default: 'Des anges sur mon chemin — Un printemps vers Santiago',
    template: '%s — Des anges sur mon chemin',
  },
  description:
    'De Lyon à Compostelle, 1 814 km seul mais jamais vraiment. Le récit d\'une aventure humaine portée par les rencontres du chemin.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Des anges sur mon chemin',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" translate="yes" data-scroll-behavior="smooth">
      <head>
        {/* Meta tag pour Google Translate */}
        <meta name="google" content="notranslate" />
        <meta httpEquiv="content-language" content="fr" />
      </head>
      <body>
        <SiteNav />
        <main translate="yes">{children}</main>
        <SiteFooter />
        <CookieConsent />
      </body>
    </html>
  );
}
