# Implémentation des Likes avec SWR

## ✅ Fonctionnalités

### 1. SWR pour la gestion du cache
- Optimistic updates (mise à jour immédiate avant la réponse serveur)
- Rollback automatique en cas d'erreur
- Revalidation automatique toutes les 30 secondes
- Cache partagé entre tous les composants

### 2. Routes API séparées
- `GET /api/likes?dayId=X` - Récupérer les likes
- `PUT /api/likes` - Ajouter un like
- `DELETE /api/likes?dayId=X` - Retirer un like
- `POST /api/likes` - Toggle (rétrocompatibilité)

### 3. Animations
- ❤️ Petits cœurs qui tombent quand on ajoute un like
- 💧 Larmes qui tombent quand on retire son propre like
- Pas de larmes quand quelqu'un d'autre retire un like (juste le count qui change)

### 4. Synchronisation multi-utilisateurs
- Refresh automatique toutes les 30 secondes
- Tous les utilisateurs voient les mêmes counts
- Les animations sont locales (seulement pour l'utilisateur qui clique)

## 📁 Fichiers modifiés/créés

### Nouveau hook
- `src/hooks/useLikes.ts` - Hook SWR pour gérer les likes

### Composant mis à jour
- `src/components/livre/DayLike.tsx` - Utilise maintenant le hook useLikes

### Routes API
- `src/app/api/likes/route.ts` - Ajout de PUT et DELETE

### Base de données
- `src/lib/db.ts` - Ajout de `addLike()` et `removeLike()`

## 🎯 Utilisation

### Dans un composant

```tsx
import { useLikes } from '@/hooks/useLikes';

function MyComponent({ dayId }: { dayId: number }) {
  const { count, liked, isLoading, addLike, removeLike, toggleLike } = useLikes(dayId);

  return (
    <div>
      <p>Likes: {count}</p>
      <button onClick={toggleLike}>
        {liked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
}
```

### API directe

```typescript
// Ajouter un like
await fetch('/api/likes', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ dayId: 1 }),
});

// Retirer un like
await fetch('/api/likes?dayId=1', {
  method: 'DELETE',
});

// Récupérer les likes
const response = await fetch('/api/likes?dayId=1');
const { count, liked } = await response.json();
```

## 🔄 Flux de données

### Ajout d'un like

1. Utilisateur clique sur le bouton
2. **Optimistic update** - UI se met à jour immédiatement
3. Animation des cœurs démarre
4. Requête PUT envoyée au serveur
5. Serveur répond avec le nouveau count
6. SWR met à jour le cache avec les données serveur
7. Tous les autres utilisateurs verront le nouveau count au prochain refresh (30s)

### Retrait d'un like

1. Utilisateur clique sur le bouton
2. **Optimistic update** - UI se met à jour immédiatement
3. Animation des larmes démarre (seulement pour l'utilisateur)
4. Requête DELETE envoyée au serveur
5. Serveur répond avec le nouveau count
6. SWR met à jour le cache avec les données serveur

### En cas d'erreur

1. Optimistic update appliqué
2. Requête échoue
3. **Rollback automatique** - UI revient à l'état précédent
4. Erreur loggée dans la console

## 🎨 Animations

### Cœurs qui tombent (ajout de like)
- 8 petits cœurs ❤️
- Positions aléatoires autour du bouton
- Rotations aléatoires
- Décalage de 50ms entre chaque
- Durée totale: 1.5s

### Larmes qui tombent (retrait de like)
- 3 larmes 💧
- Positions fixes (30%, 50%, 70%)
- Décalage de 100ms entre chaque
- Durée totale: 1.5s
- **Seulement visible pour l'utilisateur qui retire son like**

## 🔧 Configuration SWR

```typescript
useSWR(key, fetcher, {
  revalidateOnFocus: false,      // Pas de revalidation au focus
  revalidateOnReconnect: true,   // Revalider à la reconnexion
  refreshInterval: 30000,        // Refresh toutes les 30 secondes
});
```

## 📊 Avantages de cette approche

1. **Performance** - Optimistic updates = UI instantanée
2. **Fiabilité** - Rollback automatique en cas d'erreur
3. **Simplicité** - Pas besoin de WebSocket/Socket.io
4. **Cache** - SWR gère le cache automatiquement
5. **Synchronisation** - Refresh automatique toutes les 30s
6. **UX** - Animations fluides et feedback immédiat

## 🚀 Améliorations futures possibles

Si tu veux vraiment du temps réel (sans attendre 30s):

1. **Server-Sent Events (SSE)** - Plus simple que WebSocket
2. **Polling adaptatif** - Augmenter la fréquence quand l'utilisateur est actif
3. **WebSocket** - Pour du vrai temps réel (mais plus complexe avec Next.js)

Pour l'instant, le refresh de 30s est un bon compromis entre performance et synchronisation.
