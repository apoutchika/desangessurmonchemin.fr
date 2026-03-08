# Configuration Turso

Turso est une base de données SQLite distribuée, parfaite pour Vercel et les applications edge.

## Avantages

- ✅ Compatible SQLite (même syntaxe SQL)
- ✅ Gratuit jusqu'à 500 DB, 9 GB stockage, 1 milliard de lectures/mois
- ✅ Edge-ready (faible latence mondiale)
- ✅ Backups automatiques
- ✅ Pas besoin de gérer le fichier local

## Installation

### 1. Installer le CLI Turso

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. Se connecter

```bash
turso auth signup  # ou turso auth login
```

### 3. Créer une base de données

```bash
turso db create pelerinage
```

### 4. Obtenir l'URL de la base

```bash
turso db show pelerinage
```

Copier l'URL (format: `libsql://your-database.turso.io`)

### 5. Créer un token d'authentification

```bash
turso db tokens create pelerinage
```

Copier le token généré

### 6. Configurer les variables d'environnement

Ajouter dans `.env.local` :

```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...votre_token
```

### 7. Installer le client Turso

```bash
npm install @libsql/client
```

### 8. Initialiser les tables

Créer un script `scripts/init-turso.js` :

```javascript
const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function init() {
  console.log('🔧 Initialisation de la base Turso...');
  
  // Créer les tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_hash TEXT NOT NULL UNIQUE,
      user_agent TEXT,
      first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      format TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, format)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      day_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(day_id, user_id)
    )
  `);

  // Créer les index
  await db.execute('CREATE INDEX IF NOT EXISTS idx_users_ip_hash ON users(ip_hash)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_downloads_user_format ON downloads(user_id, format)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_day ON likes(day_id)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id)');

  console.log('✅ Base de données initialisée !');
}

init().catch(console.error);
```

Exécuter :

```bash
node scripts/init-turso.js
```

## Utilisation dans le code

### Option 1 : Remplacer `src/lib/db.ts`

Renommer `src/lib/db.ts` en `src/lib/db-local.ts` (backup)
Renommer `src/lib/db-turso.ts` en `src/lib/db.ts`

### Option 2 : Utiliser une variable d'environnement

Dans `src/lib/db.ts`, ajouter en haut :

```typescript
// Utiliser Turso si configuré, sinon SQLite local
if (process.env.TURSO_DATABASE_URL) {
  module.exports = require('./db-turso');
} else {
  // Code SQLite local actuel
}
```

## Commandes utiles

```bash
# Lister les bases
turso db list

# Voir les infos d'une base
turso db show pelerinage

# Ouvrir un shell SQL
turso db shell pelerinage

# Voir les tokens
turso db tokens list pelerinage

# Supprimer une base
turso db destroy pelerinage
```

## Déploiement sur Vercel

Ajouter les variables d'environnement dans Vercel :

1. Aller dans Settings > Environment Variables
2. Ajouter :
   - `TURSO_DATABASE_URL` : `libsql://your-database.turso.io`
   - `TURSO_AUTH_TOKEN` : `eyJhbGc...`

## Migration depuis SQLite local

Si tu as déjà des données dans `data/stats.db` :

```bash
# Exporter les données
sqlite3 data/stats.db .dump > backup.sql

# Se connecter à Turso
turso db shell pelerinage

# Importer (adapter les commandes selon la nouvelle structure)
```

Ou utiliser un script de migration personnalisé.

## Monitoring

Dashboard Turso : https://turso.tech/app

- Voir les requêtes
- Monitorer l'usage
- Gérer les backups

## Limites du plan gratuit

- 500 bases de données
- 9 GB de stockage total
- 1 milliard de lectures/mois
- 25 millions d'écritures/mois

Largement suffisant pour ce projet !

## Troubleshooting

### Erreur "Cannot read properties of null"
- Vérifier que `TURSO_DATABASE_URL` et `TURSO_AUTH_TOKEN` sont définis
- Vérifier que le token n'a pas expiré

### Erreur "Table already exists"
- Normal si tu réexécutes l'init
- Les `IF NOT EXISTS` protègent contre ça

### Performances lentes
- Turso a des edge locations, vérifier la plus proche
- Utiliser `turso db locations` pour voir les régions disponibles
