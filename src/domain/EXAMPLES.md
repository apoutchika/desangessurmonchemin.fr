# Exemples d'utilisation du domaine

## Création manuelle d'objets

### Value Objects

```typescript
import { LatLng, Place, Photo, DayStats, GpxPoint } from '@/domain';

// Créer des coordonnées GPS
const coords = LatLng.create(45.764043, 4.835659);
console.log(coords.toTuple()); // [45.764043, 4.835659]

// Calculer la distance entre deux points
const lyon = LatLng.create(45.764043, 4.835659);
const paris = LatLng.create(48.856614, 2.352222);
const distance = lyon.distanceTo(paris); // ≈ 392 km

// Créer un lieu
const place = Place.create(
  'Lyon',
  'Chez moi',
  LatLng.create(45.76, 4.84),
  'https://maps.app.goo.gl/...'
);

if (place.hasCoordinates()) {
  console.log('Le lieu a des coordonnées');
}

if (place.hasLink()) {
  console.log('Le lieu a un lien:', place.link);
}

// Créer une photo
const photo = Photo.create(
  '/images/jour-1/photo-1.jpg',
  'Vue sur les montagnes',
  'Magnifique panorama au lever du soleil',
  1920,
  1080
);

if (photo.hasCaption()) {
  console.log('Caption:', photo.caption);
}

// Créer des statistiques
const stats = DayStats.create(
  25.5,  // distance du jour (km)
  650,   // dénivelé positif (m)
  450,   // dénivelé négatif (m)
  125.5, // distance totale (km)
  3250,  // dénivelé positif total (m)
  2850   // dénivelé négatif total (m)
);

// Créer un point GPX
const gpxPoint = GpxPoint.create('point-1', 45.76, 4.84, 250);
console.log(gpxPoint.toLatLng()); // [45.76, 4.84]
```

### Entité Day

```typescript
import { Day, Place, Photo, DayStats, LatLng } from '@/domain';

// Créer une journée de marche
const day = Day.create({
  id: 1,
  type: 'jour',
  day: 1,
  date: new Date('2025-03-23'),
  from: Place.create('Lyon', 'Chez moi', LatLng.create(45.76, 4.84)),
  to: Place.create('Thurins', 'Chez Dominique', LatLng.create(45.67, 4.65)),
  stats: DayStats.create(25.5, 650, 450, 25.5, 650, 450),
  content: 'Première journée de marche...',
  photos: [
    Photo.create('/images/jour-1/photo-1.jpg', 'Départ de Lyon'),
  ],
  fromMemory: false,
});

// Utiliser les méthodes métier
console.log(day.isJour()); // true
console.log(day.hasMap()); // true
console.log(day.hasPhotos()); // true
console.log(day.hasStats()); // true

console.log(day.getSlug()); // 'jour-1'
console.log(day.getTitle()); // 'Lyon → Thurins'
console.log(day.getLabel()); // 'Jour 1 — Lyon → Thurins'
console.log(day.getFormattedDate()); // 'dimanche 23 mars 2025'

const center = day.getMapCenter(); // [45.715, 4.745]
```

## Utilisation dans les composants React

### Composant de page

```typescript
// src/app/livre/[slug]/page.tsx
import { getDayBySlug, getNavigation } from '@/data/journey';
import { DayPage } from '@/components/livre/DayPage';

export default async function LivreSlugPage({ params }) {
  const { slug } = await params;
  const day = getDayBySlug(slug);
  
  if (!day) notFound();

  const nav = getNavigation(day);

  return <DayPage day={day} nav={nav} />;
}
```

### Composant avec conditions métier

```typescript
// src/components/livre/DayPage.tsx
import type { Day, PageNavigation } from '@/domain';

interface Props {
  day: Day;
  nav: PageNavigation;
}

export function DayPage({ day, nav }: Props) {
  return (
    <article>
      <header>
        {day.isJour() && <div>Jour {day.day}</div>}
        <h1>{day.getTitle()}</h1>
        {day.getFormattedDate() && <div>{day.getFormattedDate()}</div>}
      </header>

      {/* Afficher les stats uniquement si disponibles */}
      {day.hasStats() && <DayStats stats={day.stats!} />}

      {/* Afficher la carte uniquement si from/to ont des coordonnées */}
      {day.hasMap() && <DayMap day={day} />}

      {/* Contenu textuel */}
      <ProseContent content={day.content} />

      {/* Galerie photo uniquement si photos disponibles */}
      {day.hasPhotos() && <DayGallery photos={day.photos} />}

      {/* Navigation */}
      <nav>
        {nav.prev && <Link href={`/livre/${nav.prev.slug}`}>{nav.prev.label}</Link>}
        {nav.next && <Link href={`/livre/${nav.next.slug}`}>{nav.next.label}</Link>}
      </nav>
    </article>
  );
}
```

### Composant de carte

```typescript
// src/components/livre/DayMap.tsx
import type { Day } from '@/domain';

interface Props {
  day: Day;
}

export function DayMap({ day }: Props) {
  // Vérification simplifiée
  if (!day.hasMap()) return null;

  // Utiliser les méthodes du domaine
  const center = day.getMapCenter()!;
  const gpxLatLngs = day.getGpxLatLngs();
  const fromLatLng = day.from!.latlng!.toTuple();
  const toLatLng = day.to!.latlng!.toTuple();

  return (
    <div>
      {/* Initialiser la carte avec center */}
      {/* Ajouter les marqueurs avec fromLatLng et toLatLng */}
      {/* Tracer le parcours avec gpxLatLngs */}
      
      {day.hasElevationProfile() && <DayElevation points={day.gpx} />}
    </div>
  );
}
```

## Utilisation de l'agrégat Journey

### Récupérer et filtrer les jours

```typescript
import { getJourney } from '@/data/journey';

// Récupérer le voyage complet
const journey = getJourney();

// Tous les jours (avant-propos, jours, postface)
const allDays = journey.getAllDays();

// Uniquement les jours de marche
const journeyDays = journey.getJourneyDays();

// Jours avec carte
const daysWithMap = journey.getDaysWithMap();

// Jours avec photos
const daysWithPhotos = journey.getDaysWithPhotos();

// Statistiques globales
const stats = journey.getStats();
console.log(`${stats.totalDays} jours`);
console.log(`${stats.totalDistance} km`);
console.log(`${stats.totalElevationGain} m D+`);
```

### Navigation

```typescript
import { getJourney } from '@/data/journey';

const journey = getJourney();

// Trouver un jour par slug
const day = journey.getDayBySlug('jour-1');

// Obtenir la navigation
const nav = journey.getNavigation(day);

if (nav.prev) {
  console.log('Précédent:', nav.prev.label);
  console.log('URL:', `/livre/${nav.prev.slug}`);
}

if (nav.next) {
  console.log('Suivant:', nav.next.label);
  console.log('URL:', `/livre/${nav.next.slug}`);
}
```

### Génération de pages statiques

```typescript
// src/app/livre/[slug]/page.tsx
import { getJourney } from '@/data/journey';

export function generateStaticParams() {
  const journey = getJourney();
  
  return journey.getAllDays().map(day => ({
    slug: day.getSlug(),
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const journey = getJourney();
  const day = journey.getDayBySlug(slug);
  
  if (!day) return {};
  
  return {
    title: day.getLabel(),
    description: day.content.slice(0, 160),
  };
}
```

## Désérialisation depuis JSON

```typescript
import { Day, Journey } from '@/domain';
import data from './data.json';

// Créer un jour depuis des données JSON
const day = Day.fromPlain({
  id: 1,
  type: 'jour',
  day: 1,
  date: '2025-03-23T11:00:00.000Z',
  from: {
    latlng: { lat: 45.76, lng: 4.84 },
    city: 'Lyon',
    name: 'Chez moi',
  },
  to: {
    latlng: { lat: 45.67, lng: 4.65 },
    city: 'Thurins',
    name: 'Chez Dominique',
  },
  stats: {
    distance: 25.5,
    elevationGain: 650,
    elevationLoss: 450,
    totalDistance: 25.5,
    totalElevationGain: 650,
    totalElevationLoss: 450,
  },
  gpx: [
    { id: '1', lat: 45.76, lng: 4.84, ele: 200 },
    { id: '2', lat: 45.77, lng: 4.85, ele: 250 },
  ],
  content: 'Première journée...',
  photos: [
    { src: '/photo.jpg', alt: 'Photo 1' },
  ],
  fromMemory: false,
});

// Créer un voyage depuis des données JSON
const journey = Journey.fromPlain(data);
```

## Validation des données

```typescript
import { LatLng, Place, DayStats } from '@/domain';

// ❌ Erreurs de validation
try {
  LatLng.create(91, 4.84); // Latitude invalide
} catch (error) {
  console.error(error.message); // "Latitude must be between -90 and 90"
}

try {
  Place.create('', 'Nom'); // Ville vide
} catch (error) {
  console.error(error.message); // "City cannot be empty"
}

try {
  DayStats.create(-10, 500, 400, 0, 0, 0); // Distance négative
} catch (error) {
  console.error(error.message); // "Distance cannot be negative"
}
```

## Comparaison avant/après

### Avant (sans DDD)

```typescript
// Conditions complexes dispersées
if (day.type === 'jour' && day.from && day.to && day.from.latlng && day.to.latlng) {
  const center = [
    (day.from.latlng.lat + day.to.latlng.lat) / 2,
    (day.from.latlng.lng + day.to.latlng.lng) / 2,
  ];
  // Afficher la carte
}

if (day.photos && day.photos.length > 0) {
  // Afficher la galerie
}

if (day.gpx && day.gpx.length > 1) {
  // Afficher le profil altimétrique
}
```

### Après (avec DDD)

```typescript
// Méthodes métier explicites
if (day.hasMap()) {
  const center = day.getMapCenter();
  // Afficher la carte
}

if (day.hasPhotos()) {
  // Afficher la galerie
}

if (day.hasElevationProfile()) {
  // Afficher le profil altimétrique
}
```
