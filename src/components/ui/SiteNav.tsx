"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/livre", label: "Livre interactif" },
  { href: "/telechargement", label: "Télécharger" },
  { href: "https://amzn.eu/d/0elqDxQ8", label: "📦 Version papier", external: true },
  { href: "/don", label: "☕ Soutenir" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav__brand" onClick={() => setOpen(false)}>
        Des&nbsp;anges&nbsp;sur&nbsp;mon&nbsp;chemin
      </Link>

      <ul className={`site-nav__links${open ? " site-nav__links--open" : ""}`}>
        {links.map((l) =>
          l.external ? (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          )
        )}
      </ul>

      <button
        className="nav-mobile-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={`nav-mobile-toggle__bar${open ? " nav-mobile-toggle__bar--open" : ""}`}></span>
      </button>
    </nav>
  );
}
