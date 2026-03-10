# Migration : Likes basés sur les slugs

## ✅ Modifications effectuées

### 1. Base de données (`src/lib/db.ts`)
- ✅ Changé `day_id` → `page_slug` dans toutes les fonctions
- ✅ `addLike(pageSlug, ...)` au lieu de `addLike(dayId, ...)`
- ✅ `removeLike(pageSlug, ...)`
- ✅ `toggleLike(pageSlug, ...)`
- ✅ `getLikesForPage(pageSlug, ...)` au lieu de `getLikesForDay(dayId, ...)`
- ✅ Schéma de table mis à jour dans `initDatabase()`

### 2. Cache (`src/lib/cache.ts`)
- ✅ Changé `LRUCache<number, ...>` → `LRUCache<string, ...>`
- ✅ Changé `Set<number>` → `Set<string>` pour userLikesCache
- ✅ Toutes les fonctions utilisent maintenant `pageSlug` au lieu de `dayId`

### 3. Hook React (`src/hooks/useLikes.ts`)
- ✅ Signature changée : `useLikes(pageSlug: string)` au lieu de `useLikes(dayId: number)`
- ✅ URL API mise à jour : `/api/likes?pageSlug=...`
- ✅ Paramètres des requêtes mis à jour

### 4. API Route (`src/app/api/likes/route.ts`)
- ✅ Tous les endpoints utilisent `pageSlug` au lieu de `dayId`
- ✅ Validation changée : `typeof pageSlug !== "string"`
- ✅ Query params mis à jour

### 5. Composants (`src/components/livre/`)
- ✅ `DayLike.tsx` : Props changé de `dayId: number` → `pageSlug: string`
- ✅ `DayPage.tsx` : Appel changé de `<DayLike dayId={day.day} />` → `<DayLike pageSlug={day.slug} />`
- ✅ Le like est maintenant disponible pour TOUTES les pages (pas seulement les jours)

### 6. Script de migration
- ✅ Créé `scripts/migrate-likes-to-slug.mjs` pour migrer les données existantes

## 🔧 Actions à effectuer

### 1. Migrer la base de données Turso

```bash
# Option A : Réinitialiser complètement (perte des likes existants)
npm run reset-turso

# Option B : Migrer les données (nécessite un mapping jour → slug)
# Éditer scripts/migrate-likes-to-slug.mjs avec votre mapping
# Puis exécuter :
node scripts/migrate-likes-to-slug.mjs
```

### 2. Vérifier le mapping jour → slug

Le script de migration nécessite un mapping. Exemple :

```javascript
const DAY_TO_SLUG_MAP = {
  1: "jour-1",
  2: "jour-2",
  // ... pour tous les jours
};
```

Vous pouvez générer ce mapping automatiquement depuis vos données JSON.

### 3. Tester les likes

Après la migration :
1. Ouvrir une page du livre
2. Cliquer sur le cœur
3. Vérifier que le compteur s'incrémente
4. Rafraîchir la page
5. Vérifier que le like est toujours là

### 4. Vérifier les analytics

Le tracking GA utilise maintenant `pageSlug` au lieu de `dayId`. Vérifier que les événements sont bien envoyés.

## 📝 Autres corrections à faire

### 1. Ajouter la licence dans mentions légales
- [ ] Ajouter une section "Licence" dans `src/app/mentions-legales/page.tsx`
- [ ] Utiliser CC BY-NC-ND 4.0

### 2. Fixer les listes à puces
- [ ] Corriger le style des `<ul>` dans mentions légales et confidentialité
- [ ] Ajouter un style global pour les listes dans `.simple-page`

### 3. Styler les liens dans le contenu
- [ ] Ajouter un style pour les liens dans `.prose` ou `.simple-page`
- [ ] Utiliser `.link-underline` ou créer un nouveau style

### 4. Fixer les boutons téléchargement sur mobile
- [ ] La flèche `→` passe au-dessus du texte sur mobile
- [ ] Options :
  - Enlever la flèche sur mobile (bof)
  - Forcer à gauche (hey)
  - Mettre la flèche en icône séparée (youpi)

## 🚨 Points d'attention

1. **Cache** : Après la migration, vider le cache LRU si nécessaire
2. **Analytics** : Les événements GA utilisent maintenant des slugs au lieu de nombres
3. **Rétrocompatibilité** : L'ancien endpoint POST avec `dayId` ne fonctionne plus
4. **Toutes les pages** : Les likes sont maintenant disponibles sur TOUTES les pages (avant-propos, postface, etc.)

## 🎯 Avantages de cette migration

1. ✅ Plus flexible : fonctionne avec n'importe quelle page, pas seulement les jours
2. ✅ Plus lisible : les slugs sont plus explicites que des IDs numériques
3. ✅ Meilleure structure : cohérent avec le reste du système (navigation, URLs, etc.)
4. ✅ Évolutif : facile d'ajouter de nouvelles pages (remerciements, licence, etc.)
