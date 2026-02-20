# Cahier des charges — Sur le Chemin
## Site web pour publication d'un récit de pèlerinage

---

## 1. Vision & Objectifs

Créer un site web élégant et mémorable pour la publication en ligne d'un récit de pèlerinage. L'expérience doit être à l'image du voyage : lente, sensorielle, attentive au détail. Le lecteur doit se sentir embarqué.

**Principes directeurs :**
- Lisibilité maximale du texte (typographie éditoriale, rythme visuel)
- Interactivité pertinente (cartes, galeries) sans surcharger
- Gratuité totale de l'accès, monétisation douce via dons
- Performance et accessibilité soignées

---

## 2. Architecture des pages

### 2.1 Page d'accueil `/`
- Hero plein écran avec titre, accroche et statistiques globales du voyage
- 3 cartes features : lecture, téléchargement, don
- Animation d'entrée au chargement
- CTA vers la lecture et le téléchargement

### 2.2 Livre interactif `/livre/[slug]`
- Layout two-column : sidebar menu + contenu principal
- Slugs : `avant-propos`, `jour-1` ... `jour-N`, `postface`
- Génération statique de toutes les pages (SSG)

### 2.3 Téléchargement `/telechargement`
- Deux options : ePub + PDF
- Téléchargement direct, aucune création de compte requise

### 2.4 Don `/don`
- Montants suggérés + montant libre
- Intégration Stripe / PayPal / HelloAsso (à choisir)
- Message de remerciement post-don

---

## 3. Structure de données

### 3.1 JourneyDay (fichier JSON principal)

```typescript
{
  id: number;              // Ordre de la page (0 = AP, 1..N = jours, N+1 = PF)
  type: 'avant-propos' | 'jour' | 'postface';
  day?: number;            // N° de jour de marche
  date?: string;           // "YYYY-MM-DD"
  title?: string;          // Pour AP/PF uniquement
  from?: {
    latlng: { lat, lng };
    city: string;
    name: string;          // Nom hébergement
    link?: string;         // URL hébergement
  };
  to?: { ...idem };
  stats?: {
    distance: number;          // km du jour
    elevationGain: number;     // D+ en mètres
    elevationLoss: number;     // D- en mètres
    duration?: number;         // Durée en minutes
    totalDistance?: number;    // km cumulés
    totalElevationGain?: number; // D+ cumulés
  };
  gpx?: string;            // Contenu GPX (XML string)
  content: string;         // Texte en Markdown ou texte brut
  photos?: Photo[];        // Tableau de photos
  tags?: string[];         // Mots-clés thématiques
  mood?: number;           // Humeur de 1 à 5 (pour stats futures)
  weather?: {              // Météo optionnelle
    condition: string;
    tempMin?: number;
    tempMax?: number;
  };
}
```

### 3.2 Champs suggérés à ajouter

| Champ | Type | Usage |
|-------|------|-------|
| `tags` | `string[]` | Filtrage thématique, nuage de mots |
| `mood` | `1-5` | Visualisation humeur sur la durée |
| `weather.condition` | `string` | Contexte météo dans l'en-tête |
| `stats.duration` | `minutes` | Vitesse moyenne, effort |
| `stats.totalDistance` | `km` | Jauge de progression |
| `photos[].width/height` | `px` | Optimisation Image Next.js |
| `photos[].caption` | `string` | Légende dans la galerie |
| `gpx` | `XML string` | Tracé + profil altimétrique |

---

## 4. Composants livre interactif

### 4.1 DayHeader
- Numéro du jour, ville de départ → ville d'arrivée
- Date formatée en français
- Tags et météo optionnels

### 4.2 DayStats
- Distance du jour + total depuis le début
- D+ et D- du jour
- Durée si disponible
- Grille responsive

### 4.3 DayMap (Leaflet)
- Tuiles CartoDB Voyager (élégantes, sobres)
- Marqueur A (départ, vert forêt) avec popup hébergement + lien
- Marqueur B (arrivée, terre de Sienne) avec popup hébergement + lien
- Tracé GPX complet en fond (gris)
- **Tracé animé** au-dessus pour montrer le sens de marche
- **Profil altimétrique SVG** sous la carte
- ScrollWheelZoom désactivé par défaut (UX page scrollable)
- Chargement dynamique côté client uniquement (aucun SSR Leaflet)

### 4.4 ProseContent
- Rendu Markdown minimal (gras, italique, titres, paragraphes)
- Typographie Cormorant Garamond, corps 21px, interligne 1.85
- Max-width 68ch pour une ligne de lecture optimale
- Possibilité de remplacer par `react-markdown` ou `next-mdx-remote`

### 4.5 DayGallery
- Grille responsive auto-fill
- Hover : léger zoom sur l'image + fade-in de la légende
- **Lightbox** au clic : navigation clavier (← → Echap), fond sombre
- Composant `next/image` pour optimisation automatique

### 4.6 DayNav
- Liens Précédent / Suivant avec label complet
- Affiche ville A → ville B pour les jours, titre pour AP/PF

### 4.7 LivreSidebar
- Sticky, hauteur 100vh - hauteur nav
- Scroll interne si beaucoup de jours
- Item actif mis en surbrillance
- AP et PF en italique pour se démarquer

---

## 5. Design System

### 5.1 Palette
| Nom | Valeur | Usage |
|-----|--------|-------|
| `--sand` | `#f5f0e8` | Fond sidebar, cards |
| `--parch` | `#ede6d6` | Fond hover, encarts |
| `--warm` | `#c8b89a` | Accent doux, bordures actives |
| `--stone` | `#8a7968` | Texte secondaire |
| `--earth` | `#5c4f3a` | Texte prose |
| `--ink` | `#2b2318` | Titres, texte fort |
| `--rust` | `#b5603a` | Accent chaud, CTA secondaires |
| `--forest` | `#5a7a5f` | Carte, marqueur A |
| `--sky` | `#7ba7bc` | Réservé (futur) |

### 5.2 Typographie
- **Titres** : Cormorant Garamond 600 — sérieux, élégant, historique
- **Corps** : Cormorant Garamond 300 — aéré, éditorial
- **UI** : Jost 300-500 — sans-serif léger, moderne
- **Accents italiques** : Playfair Display Italic

### 5.3 Animations
- Entrée de page : `slideUp` 0.5s au chargement
- Carte : tracé animé via `requestAnimationFrame` (animation JS)
- Galerie : zoom `transform: scale(1.04)` au hover
- Navigation : transitions 200ms sur couleur/fond

---

## 6. Stack technique

| Couche | Outil |
|--------|-------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript strict |
| Styling | CSS custom properties (pas de Tailwind) |
| Carte | Leaflet (import dynamique client-side) |
| Images | `next/image` (optimisation WebP auto) |
| Markdown | Renderer custom ou `react-markdown` |
| Polices | Google Fonts (Cormorant Garamond, Jost, Playfair) |
| Déploiement | Vercel (gratuit pour usage perso) |
| Paiement | Stripe / HelloAsso / PayPal (à intégrer) |

---

## 7. Performance & SEO

- **SSG** (Static Site Generation) : toutes les pages livre pré-générées au build
- **`generateStaticParams`** : slugs générés depuis `journeyData`
- **`generateMetadata`** : title + description par page pour le SEO
- **`next/image`** : lazy loading, WebP, tailles responsives
- **Leaflet** importé dynamiquement (`'use client'` + import async) pour éviter le SSR
- **Polices** : preconnect Google Fonts, `display=swap`
- **Sitemap** : à générer avec `next-sitemap` ou route `/sitemap.xml`

---

## 8. Suggestions & Évolutions futures

### Phase 1 (base, couverte par cette base de code)
- [x] 4 pages principales
- [x] Livre interactif avec cartes Leaflet
- [x] Galerie + lightbox
- [x] Stats du jour
- [x] Navigation prev/next

### Phase 2 (recommandé)
- [ ] **Carte globale du voyage** `/carte` — Leaflet avec tous les jours, cliquables
- [ ] **Mode sombre** — toggle, CSS variables suffisent
- [ ] **Recherche full-text** — Fuse.js sur le contenu, léger et efficace
- [ ] **Partage social** — OG images générées avec `@vercel/og`
- [ ] **Progression de lecture** — barre en haut, localStorage
- [ ] **Stats globales visuelles** — graphique distance/jour avec Recharts
- [ ] **Filtre par tags** dans la sidebar

### Phase 3 (avancé)
- [ ] **Newsletter** — Resend / ConvertKit, pour un futur prochain livre
- [ ] **Commentaires** — Giscus (GitHub Discussions), gratuit et respectueux
- [ ] **Version offline** — PWA avec service worker
- [ ] **Export personnalisé** — choisir les jours à télécharger

---

## 9. Structure des fichiers

```
src/
├── app/
│   ├── layout.tsx           # Layout global (nav + footer)
│   ├── page.tsx             # Home
│   ├── globals.css          # Design system complet
│   ├── livre/
│   │   ├── layout.tsx       # Layout two-column avec sidebar
│   │   ├── page.tsx         # Redirect vers avant-propos
│   │   └── [slug]/
│   │       └── page.tsx     # Page dynamique SSG
│   ├── telechargement/
│   │   └── page.tsx
│   └── don/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── SiteNav.tsx
│   │   └── SiteFooter.tsx
│   └── livre/
│       ├── DayPage.tsx      # Orchestrateur de page jour
│       ├── LivreSidebar.tsx # Menu navigation
│       ├── DayStats.tsx     # Statistiques km/D+/D-
│       ├── DayMap.tsx       # Leaflet + profil altimétrique
│       ├── DayGallery.tsx   # Galerie + lightbox
│       └── ProseContent.tsx # Rendu texte Markdown
├── data/
│   └── journey.ts           # Données + helpers navigation
├── lib/
│   └── gpx.ts               # Parser GPX, profil altimétrique
└── types/
    └── index.ts             # Types TypeScript
```

---

## 10. Mise en route

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Vérifier les types
npm run type-check

# Build de production
npm run build
```

**À personnaliser avant le lancement :**
1. Remplacer les données de démo dans `src/data/journey.ts` par votre vrai JSON
2. Ajouter vos photos dans `public/photos/`
3. Placer vos fichiers `pelerinage.epub` et `pelerinage.pdf` dans `public/downloads/`
4. Mettre à jour les métadonnées dans `src/app/layout.tsx`
5. Intégrer votre solution de paiement dans `src/app/don/page.tsx`
6. Configurer votre domaine sur Vercel

---

*Cahier des charges — version 1.0*
