# Configuration Turso

Turso est une base de données SQLite distribuée, parfaite pour Vercel et les applications edge.

## Avantages

- ✅ Compatible SQLite (même syntaxe SQL)
- ✅ Gratuit jusqu'à 500 DB, 9 GB stockage, 1 milliard de lectures/mois
- ✅ Edge-ready (faible latence mondiale)
- ✅ Backups automatiques
- ✅ Pas besoin de gérer le fichier local

## Installation et Configuration

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

### 7. Installer le client (déjà fait)

```bash
pnpm add @libsql/client
```

### 8. Initialiser les tables

```bash
pnpm run init-turso
```

Cette commande va créer automatiquement toutes les tables et index nécessaires.

## ✅ Configuration actuelle

L'application est déjà configurée pour utiliser Turso :

- ✅ Package `@libsql/client` installé
- ✅ `src/lib/db.ts` utilise Turso
- ✅ Variables d'environnement configurées dans `.env.local`
- ✅ Routes API mises à jour pour l'async
- ✅ Script d'initialisation disponible (`pnpm run init-turso`)

## Backup SQLite local

L'ancienne version SQLite locale a été sauvegardée dans `src/lib/db-sqlite.ts.backup` au cas où.

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
