# Migration vers DDD - Récapitulatif

## Objectif

Refactoriser le projet selon les principes du Domain-Driven Design (DDD) pour encapsuler la logique métier dans des entités et value objects au lieu de la disperser dans les composants React.

## Changements effectués

### 1. Création de la couche domaine

**Structure créée:**
```
src/domain/
├── value-objects/
│   ├── LatLng.ts       # Coordonnées GPS avec validation et calcul de distance
│   ├── Place.ts        # Lieu avec méthodes hasCoordinates(), hasLink()
│   ├── Photo.ts        # Photo avec méthodes hasCaption(), hasDimensions()
│   ├── DayStats.ts     # Statistiques avec validation
│   └── GpxPoint.ts     # Point GPS avec méthode toLatLng()
├── entities/
│   └── Day.ts          # Entité principale avec toute la logique métier
├── aggregates/
│   └── Journey.ts      # Agrégat racine pour gérer la collection de jours
└── index.ts            # Exports publics
```

### 2. Encapsulation de la logique métier dans Day

**Méthodes ajoutées à l'entité Day:**

#### Vérifications de type
- `isJour()`: Vérifie si c'est une journée de marche
- `isAvantPropos()`: Vérifie si c'est l'avant-propos
- `isPostface()`: Vérifie si c'est la postface

#### Vérifications de contenu
- `hasMap()`: Vérifie si la journée a une carte (from/to avec coordonnées)
- `hasGpx()`: Vérifie si des points GPS existent
- `hasPhotos()`: Vérifie si des photos existent
- `hasStats()`: Vérifie si des statistiques existent
- `hasElevationProfile()`: Vérifie si un profil altimétrique peut être affiché

#### Génération de données
- `getSlug()`: Génère le slug URL (avant-propos, postface, jour-N)
- `getTitle()`: Génère le titre de la page
- `getLabel()`: Génère le label pour la navigation
- `getFormattedDate(locale)`: Formate la date selon la locale
- `getMapCenter()`: Calcule le centre de la carte
- `getGpxLatLngs()`: Retourne les coordonnées GPS au format [lat, lng][]

### 3. Création de l'agrégat Journey

**Méthodes de l'agrégat Journey:**
- `getAllDays()`: Retourne tous les jours
- `getDayBySlug(slug)`: Trouve un jour par son slug
- `getDayById(id)`: Trouve un jour par son id
- `getNavigation(currentDay)`: Génère la navigation prev/next
- `getStats()`: Calcule les statistiques globales du voyage
- `getJourneyDays()`: Filtre uniquement les jours de marche
- `getDaysWithMap()`: Filtre les jours avec carte
- `getDaysWithPhotos()`: Filtre les jours avec photos

### 4. Refactorisation des composants

**Avant (logique dispersée):**
```typescript
// DayPage.tsx
{isJour && day.from && day.to && <DayMap day={day} />}
{day.photos && day.photos.length > 0 && <DayGallery photos={day.photos} />}

// DayMap.tsx
if (!mapRef.current || !day.from || !day.to) return;
const center: [number, number] = [
  (day.from!.latlng!.lat + day.to!.latlng!.lat) / 2,
  (day.from!.latlng!.lng + day.to!.latlng!.lng) / 2,
];
```

**Après (logique encapsulée):**
```typescript
// DayPage.tsx
{day.hasMap() && <DayMap day={day} />}
{day.hasPhotos() && <DayGallery photos={day.photos} />}

// DayMap.tsx
if (!mapRef.current || !day.hasMap()) return;
const center = day.getMapCenter()!;
```

### 5. Mise à jour des imports

**Fichiers modifiés:**
- `src/data/journey.ts`: Utilise Journey aggregate
- `src/app/livre/[slug]/page.tsx`: Utilise les méthodes du domaine
- `src/components/livre/DayPage.tsx`: Utilise day.hasMap(), day.hasPhotos()
- `src/components/livre/DayMap.tsx`: Utilise day.getMapCenter(), day.getGpxLatLngs()
- `src/components/livre/DayStats.tsx`: Import depuis @/domain
- `src/components/livre/DayGallery.tsx`: Import depuis @/domain
- `src/components/livre/DayElevation.tsx`: Import depuis @/domain
- `src/components/livre/LivreSidebar.tsx`: Utilise journey.getAllDays()
- `src/lib/gpx.ts`: Utilise GpxPoint value object

## Avantages obtenus

### 1. Code plus lisible et maintenable

**Avant:**
```typescript
if (day.type === "jour" && day.from && day.to && day.from.latlng && day.to.latlng) {
  // Afficher la carte
}
```

**Après:**
```typescript
if (day.hasMap()) {
  // Afficher la carte
}
```

### 2. Logique métier centralisée

Toutes les règles métier sont dans le domaine, pas dispersées dans les composants.

### 3. Tests facilités

Les entités et value objects peuvent être testés indépendamment:
- `src/domain/__tests__/Day.test.ts`
- `src/domain/__tests__/LatLng.test.ts`

### 4. Validation des données

Les value objects valident les données à la création:
```typescript
LatLng.create(91, 4.84); // ❌ Throw: Latitude must be between -90 and 90
Place.create("", "name"); // ❌ Throw: City cannot be empty
```

### 5. Évolution facilitée

Ajouter une nouvelle règle métier se fait dans le domaine:
```typescript
// Dans Day.ts
hasVideo(): boolean {
  return this.videos.length > 0;
}

// Dans les composants
{day.hasVideo() && <VideoPlayer videos={day.videos} />}
```

## Compatibilité

L'ancien fichier `src/types/index.ts` est conservé pour compatibilité. Les helpers dans `src/data/journey.ts` permettent une transition en douceur.

## Documentation

- `src/domain/README.md`: Documentation complète de l'architecture DDD
- `src/domain/__tests__/`: Exemples de tests unitaires

## Prochaines étapes possibles

1. Ajouter plus de tests unitaires pour couvrir tous les cas
2. Créer des repositories pour l'accès aux données
3. Ajouter des services pour la logique applicative complexe
4. Implémenter des événements de domaine si nécessaire
5. Migrer complètement et supprimer `src/types/index.ts`

## Résultat

Le projet suit maintenant les principes DDD avec:
- ✅ Value Objects immuables avec validation
- ✅ Entités avec identité et comportement
- ✅ Agrégats pour gérer les collections
- ✅ Logique métier encapsulée (ex: `day.hasMap()`)
- ✅ Code plus lisible et maintenable
- ✅ Tests facilités
