# Migration vers Turso - Résumé

## ✅ Changements effectués

### 1. Installation du client Turso
```bash
pnpm add @libsql/client
```

### 2. Migration de la base de données
- `src/lib/db.ts` → Maintenant utilise Turso (async)
- `src/lib/db-sqlite.ts.backup` → Backup de l'ancienne version SQLite locale

### 3. Mise à jour des routes API
Toutes les routes ont été mises à jour pour utiliser `await` :
- `src/app/api/stats/route.ts`
- `src/app/api/likes/route.ts`
- `src/app/api/download/route.ts`

### 4. Script d'initialisation
- Nouveau script : `scripts/init-turso.js`
- Commande : `pnpm run init-turso`

### 5. Corrections de build
- `src/components/livre/DayElevation.tsx` : Retiré `fontVariantNumeric` incompatible avec recharts 3.8.0
- `src/app/don/page.tsx` : Ajout de Suspense boundary pour `useSearchParams()`

## 🚀 Pour initialiser la base Turso

Si ce n'est pas déjà fait, lance une seule fois :

```bash
pnpm run init-turso
```

Cela va créer toutes les tables et index nécessaires dans ta base Turso.

## 📝 Variables d'environnement requises

Dans `.env.local` :
```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
```

## 🔄 Différences principales

### Avant (SQLite local)
```typescript
const stats = getDownloadStats(); // Synchrone
```

### Après (Turso)
```typescript
const stats = await getDownloadStats(); // Async
```

## 📦 Avantages de Turso

- ✅ Base de données distribuée (edge-ready)
- ✅ Compatible avec Vercel et autres plateformes serverless
- ✅ Pas de fichier local à gérer
- ✅ Backups automatiques
- ✅ Plan gratuit généreux (1 milliard de lectures/mois)

## 🔧 Retour en arrière (si besoin)

Si tu veux revenir à SQLite local :

```bash
mv src/lib/db.ts src/lib/db-turso.ts
mv src/lib/db-sqlite.ts.backup src/lib/db.ts
```

Et retirer les `await` dans les routes API.

## 📚 Documentation complète

Voir `TURSO_SETUP.md` pour plus de détails sur la configuration et l'utilisation de Turso.
