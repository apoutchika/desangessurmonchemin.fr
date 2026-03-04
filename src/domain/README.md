# Architecture DDD - Domaine du Pèlerinage

Ce projet suit les principes du Domain-Driven Design (DDD) pour structurer le code métier.

## Structure

```
src/domain/
├── value-objects/     # Objets immuables sans identité
│   ├── LatLng.ts     # Coordonnées géographiques
│   ├── Place.ts      # Lieu (ville, hébergement)
│   ├── Photo.ts      # Photo avec métadonnées
│   ├── DayStats.ts   # Statistiques d'une journée
│   └── GpxPoint.ts   # Point GPS avec altitude
├── entities/          # Objets avec identité
│   └── Day.ts        # Journée de pèlerinage
├── aggregates/        # Racines d'agrégats
│   └── Journey.ts    # Voyage complet (collection de jours)
└── index.ts          # Exports publics
```

## Concepts DDD

### Value Objects (Objets Valeur)

Les Value Objects sont immuables et définis par leurs attributs. Deux instances avec les mêmes valeurs sont considérées égales.

**Exemples:**
- `LatLng`: Coordonnées GPS (lat, lng)
- `Place`: Lieu avec coordonnées, ville, nom
- `Photo`: Image avec src, alt, caption
- `DayStats`: Statistiques de distance et dénivelé
- `GpxPoint`: Point GPS avec altitude

**Caractéristiques:**
- Constructeur privé
- Factory method `create()` pour validation
- Factory method `fromPlain()` pour désérialisation
- Méthodes métier (ex: `hasCoordinates()`, `distanceTo()`)

### Entities (Entités)

Les entités ont une identité unique (id) qui persiste dans le temps.

**Exemple: `Day`**
```typescript
const day = Day.fromPlain(data);

// Méthodes métier encapsulées
if (day.hasMap()) {
  // Afficher la carte
}

if (day.hasPhotos()) {
  // Afficher la galerie
}

const title = day.getTitle();
const slug = day.getSlug();
```

**Méthodes disponibles:**
- `isJour()`, `isAvantPropos()`, `isPostface()`: Type de page
- `hasMap()`: Vérifie si la journée a une carte (from/to avec coordonnées)
- `hasGpx()`: Vérifie si des points GPS existent
- `hasPhotos()`: Vérifie si des photos existent
- `hasStats()`: Vérifie si des statistiques existent
- `hasElevationProfile()`: Vérifie si un profil altimétrique peut être affiché
- `getSlug()`: Génère le slug URL
- `getTitle()`: Génère le titre
- `getLabel()`: Génère le label pour navigation
- `getFormattedDate()`: Formate la date en français
- `getMapCenter()`: Calcule le centre de la carte
- `getGpxLatLngs()`: Retourne les coordonnées GPS

### Aggregates (Agrégats)

Les agrégats sont des clusters d'entités et value objects traités comme une unité.

**Exemple: `Journey`**
```typescript
const journey = Journey.fromPlain(data);

// Accès aux jours
const day = journey.getDayBySlug('jour-1');
const allDays = journey.getAllDays();

// Navigation
const nav = journey.getNavigation(currentDay);

// Statistiques globales
const stats = journey.getStats();

// Filtres
const daysWithMap = journey.getDaysWithMap();
const daysWithPhotos = journey.getDaysWithPhotos();
```

## Avantages de cette architecture

### 1. Encapsulation de la logique métier

**Avant (logique dans les composants):**
```typescript
// ❌ Conditions dispersées dans le code
{isJour && day.from && day.to && <DayMap day={day} />}
{day.photos && day.photos.length > 0 && <DayGallery photos={day.photos} />}
```

**Après (logique dans le domaine):**
```typescript
// ✅ Méthodes métier explicites
{day.hasMap() && <DayMap day={day} />}
{day.hasPhotos() && <DayGallery photos={day.photos} />}
```

### 2. Validation centralisée

Les Value Objects valident les données à la création:
```typescript
LatLng.create(lat, lng); // Valide que lat ∈ [-90, 90] et lng ∈ [-180, 180]
Place.create(city, name); // Valide que city et name ne sont pas vides
```

### 3. Code réutilisable

Les méthodes métier sont réutilisables partout:
```typescript
const slug = day.getSlug();
const title = day.getTitle();
const center = day.getMapCenter();
```

### 4. Tests facilités

Les entités et value objects sont testables indépendamment des composants React.

### 5. Évolution facilitée

Ajouter une nouvelle règle métier se fait dans le domaine, pas dans les composants:
```typescript
// Nouvelle méthode dans Day
hasVideo(): boolean {
  return this.videos.length > 0;
}
```

## Utilisation

### Dans les Server Components (Next.js)

Next.js ne permet pas de passer des instances de classes aux Client Components. Il faut sérialiser les données :

```typescript
// src/app/livre/[slug]/page.tsx (Server Component)
import { getDayBySlug, getNavigation } from '@/data/journey';
import { serializeDay } from '@/domain';
import { DayPage } from '@/components/livre/DayPage';

export default async function LivreSlugPage({ params }) {
  const { slug } = await params;
  const day = getDayBySlug(slug); // Retourne une instance Day
  const nav = getNavigation(day);

  // Sérialiser pour passer au Client Component
  const serializedDay = serializeDay(day);

  return <DayPage day={serializedDay} nav={nav} />;
}
```

### Dans les Client Components

Utiliser le hook `useDay` pour reconstruire l'entité :

```typescript
// src/components/livre/DayPage.tsx (Client Component)
"use client";

import type { SerializedDay, PageNavigation } from "@/domain";
import { useDay } from "@/domain";

interface Props {
  day: SerializedDay; // Plain object sérialisé
  nav: PageNavigation;
}

export function DayPage({ day: serializedDay, nav }: Props) {
  // Reconstruire l'entité Day côté client
  const day = useDay(serializedDay);

  // Utiliser les méthodes métier
  if (day.hasMap()) {
    const center = day.getMapCenter();
    // Afficher la carte
  }

  return (
    <article>
      {day.hasMap() && <DayMap day={day} />}
      {day.hasPhotos() && <DayGallery photos={day.photos} />}
    </article>
  );
}
```

## Migration depuis l'ancien code

L'ancien fichier `src/types/index.ts` contient les interfaces TypeScript simples. Le nouveau code DDD encapsule ces types dans des classes avec comportement.

**Compatibilité:** Les helpers dans `src/data/journey.ts` maintiennent la compatibilité avec l'ancien code pendant la transition.
