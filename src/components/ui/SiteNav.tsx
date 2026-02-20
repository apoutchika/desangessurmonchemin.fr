"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/livre", label: "Livre interactif" },
  { href: "/telechargement", label: "Télécharger" },
  { href: "/don", label: "Faire un don" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="site-nav">
      <Link href="/" className="site-nav__brand" onClick={() => setOpen(false)}>
        Sur&nbsp;le&nbsp;Chemin
      </Link>

      <ul className={`site-nav__links${open ? " site-nav__links--open" : ""}`}>
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        className="nav-mobile-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
      </button>
    </nav>
  );
}
