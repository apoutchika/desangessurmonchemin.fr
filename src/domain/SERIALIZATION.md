# Sérialisation pour Next.js

## Problème

Next.js ne permet pas de passer des instances de classes des Server Components aux Client Components. Seuls les plain objects (objets sérialisables en JSON) sont autorisés.

**Erreur typique :**
```
Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. 
Classes or null prototypes are not supported.
```

## Solution

Nous utilisons une couche de sérialisation/désérialisation :

1. **Server Component** : Sérialise l'entité en plain object
2. **Client Component** : Reconstruit l'entité depuis le plain object

## Architecture

```
Server Component (RSC)
  ↓
  getDayBySlug() → Day (instance de classe)
  ↓
  serializeDay() → SerializedDay (plain object)
  ↓
  Props → Client Component
  ↓
  useDay() → Day (instance de classe)
  ↓
  Méthodes métier disponibles
```

## Types de sérialisation

### SerializedDay

```typescript
interface SerializedDay {
  id: number;
  type: PageType;
  day: number | null;
  date: string | null; // ISO string au lieu de Date
  title: string | null;
  from: SerializedPlace | null;
  to: SerializedPlace | null;
  stats: SerializedDayStats | null;
  gpx: SerializedGpxPoint[];
  content: string;
  photos: SerializedPhoto[];
  fromMemory: boolean;
}
```

Les différences avec `Day` :
- `date` est une string ISO au lieu d'un objet `Date`
- Les value objects sont remplacés par leurs équivalents sérialisés
- Pas de méthodes, uniquement des données

## Utilisation

### 1. Server Component (page Next.js)

```typescript
// src/app/livre/[slug]/page.tsx
import { getDayBySlug } from '@/data/journey';
import { serializeDay } from '@/domain';
import { DayPage } from '@/components/livre/DayPage';

export default async function LivreSlugPage({ params }) {
  const { slug } = await params;
  
  // Récupérer l'entité (Server-side)
  const day = getDayBySlug(slug);
  
  // Sérialiser pour passer au Client Component
  const serializedDay = serializeDay(day);
  
  // Passer le plain object
  return <DayPage day={serializedDay} />;
}
```

### 2. Client Component

```typescript
// src/components/livre/DayPage.tsx
"use client";

import type { SerializedDay } from "@/domain";
import { useDay } from "@/domain";

interface Props {
  day: SerializedDay; // Plain object
}

export function DayPage({ day: serializedDay }: Props) {
  // Reconstruire l'entité avec toutes ses méthodes
  const day = useDay(serializedDay);
  
  // Maintenant on peut utiliser les méthodes métier
  return (
    <article>
      <h1>{day.getTitle()}</h1>
      {day.hasMap() && <DayMap day={day} />}
      {day.hasPhotos() && <DayGallery photos={day.photos} />}
    </article>
  );
}
```

## Hook useDay

Le hook `useDay` reconstruit l'entité `Day` depuis un `SerializedDay` :

```typescript
// src/domain/hooks/useDay.ts
import { useMemo } from "react";
import { Day } from "../entities/Day";
import type { SerializedDay } from "../serialization";

export function useDay(serializedDay: SerializedDay): Day {
  return useMemo(() => Day.fromPlain(serializedDay), [serializedDay]);
}
```

Le `useMemo` garantit que l'entité n'est reconstruite que si les données changent.

## Fonction serializeDay

```typescript
// src/domain/serialization.ts
export function serializeDay(day: Day): SerializedDay {
  return {
    id: day.id,
    type: day.type,
    day: day.day,
    date: day.date ? day.date.toISOString() : null,
    // ... conversion des value objects en plain objects
    from: day.from ? {
      latlng: day.from.latlng ? {
        lat: day.from.latlng.lat,
        lng: day.from.latlng.lng
      } : null,
      city: day.from.city,
      name: day.from.name,
      link: day.from.link,
    } : null,
    // ...
  };
}
```

## Avantages de cette approche

### ✅ Compatibilité Next.js

Les Server Components peuvent passer des données aux Client Components sans erreur.

### ✅ Méthodes métier disponibles

Une fois reconstruit côté client, l'objet `Day` a toutes ses méthodes :
```typescript
day.hasMap()
day.getTitle()
day.getMapCenter()
```

### ✅ Performance

Le `useMemo` évite de reconstruire l'entité à chaque render.

### ✅ Type-safety

TypeScript garantit que la sérialisation est correcte.

## Exemple complet

### Server Component

```typescript
// app/livre/[slug]/page.tsx
import { getDayBySlug, getNavigation } from '@/data/journey';
import { serializeDay } from '@/domain';
import { DayPage } from '@/components/livre/DayPage';

export default async function Page({ params }) {
  const { slug } = await params;
  const day = getDayBySlug(slug);
  const nav = getNavigation(day);
  
  return <DayPage day={serializeDay(day)} nav={nav} />;
}
```

### Client Component

```typescript
// components/livre/DayPage.tsx
"use client";

import { useDay, type SerializedDay, type PageNavigation } from "@/domain";

interface Props {
  day: SerializedDay;
  nav: PageNavigation;
}

export function DayPage({ day: serializedDay, nav }: Props) {
  const day = useDay(serializedDay);
  
  return (
    <article>
      <header>
        {day.isJour() && <div>Jour {day.day}</div>}
        <h1>{day.getTitle()}</h1>
        {day.getFormattedDate() && <time>{day.getFormattedDate()}</time>}
      </header>

      {day.hasStats() && <DayStats stats={day.stats!} />}
      {day.hasMap() && <DayMap day={day} />}
      
      <ProseContent content={day.content} />
      
      {day.hasPhotos() && <DayGallery photos={day.photos} />}
    </article>
  );
}
```

## Composants enfants

Les composants enfants reçoivent directement l'entité `Day` reconstruite :

```typescript
// components/livre/DayMap.tsx
"use client";

import type { Day } from "@/domain";

interface Props {
  day: Day; // Entité complète, pas SerializedDay
}

export function DayMap({ day }: Props) {
  if (!day.hasMap()) return null;
  
  const center = day.getMapCenter()!;
  const gpxLatLngs = day.getGpxLatLngs();
  
  // Utiliser les méthodes métier
  return <div>...</div>;
}
```

## Résumé

1. **Server Component** : Utilise `serializeDay()` pour convertir `Day` → `SerializedDay`
2. **Client Component racine** : Utilise `useDay()` pour convertir `SerializedDay` → `Day`
3. **Composants enfants** : Reçoivent l'entité `Day` complète avec toutes ses méthodes

Cette approche permet de profiter des avantages du DDD tout en respectant les contraintes de Next.js.
