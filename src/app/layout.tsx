import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/ui/SiteNav";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { CookieConsent } from "@/components/ui/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Des anges sur mon chemin — Un printemps vers Santiago",
    template: "%s — Des anges sur mon chemin",
  },
  description:
    "De Lyon à Compostelle, 1 814 km seul mais jamais vraiment. Le récit d'une aventure humaine portée par les rencontres du chemin.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Des anges sur mon chemin",
    title: "Des anges sur mon chemin — Un printemps vers Santiago",
    description: "De Lyon à Compostelle, 1 875 km seul mais jamais vraiment.",
    images: [
      {
        url: "/cover.jpg",
        width: 1200,
        height: 630,
        alt: "Couverture — Des anges sur mon chemin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // ✅ "large_image" plutôt que "summary" = aperçu bien plus visible
    title: "Des anges sur mon chemin — Un printemps vers Santiago",
    description: "De Lyon à Compostelle, 1 875 km seul mais jamais vraiment.",
    images: ["/cover.jpg"],
  },
  metadataBase: new URL("https://www.desangessurmonchemin.fr"),
  // Bloque l'indexation en préprod (à retirer en production)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
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
