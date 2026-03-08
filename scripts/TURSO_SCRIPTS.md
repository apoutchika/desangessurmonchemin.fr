# Scripts Turso

Scripts utilitaires pour gérer la base de données Turso.

## 📋 Scripts disponibles

### 1. Initialiser la base de données

Crée toutes les tables et index nécessaires (première utilisation).

```bash
pnpm run init-turso
```

**Utilisation:** Une seule fois après avoir créé votre base Turso.

**Ce qu'il fait:**
- Crée la table `users`
- Crée la table `downloads`
- Crée la table `likes`
- Crée tous les index nécessaires

**Note:** Utilise `IF NOT EXISTS`, donc sans danger si les tables existent déjà.

---

### 2. Vérifier l'état de la base

Affiche les tables, index et statistiques.

```bash
pnpm run check-turso
```

**Utilisation:** À tout moment pour vérifier l'état de la DB.

**Ce qu'il affiche:**
- Liste des tables
- Nombre d'enregistrements par table
- Liste des index
- État général de la base

**Exemple de sortie:**
```
📊 Vérification des tables...
   ✓ Tables trouvées:
     - downloads
     - likes
     - users

📈 Statistiques:
   - Users: 3
   - Downloads: 0
   - Likes: 2

🔍 Index:
   - idx_downloads_user_format
   - idx_likes_day
   - idx_likes_user
   - idx_users_ip_hash

✅ Base de données opérationnelle!
```

---

### 3. Réinitialiser la base (⚠️ DANGER)

Supprime TOUTES les données et recrée les tables vides.

```bash
pnpm run reset-turso
```

**⚠️ ATTENTION:** Cette commande supprime définitivement toutes les données!

**Utilisation:** Uniquement si vous voulez repartir de zéro.

**Ce qu'il fait:**
1. Demande confirmation
2. Supprime toutes les tables existantes
3. Supprime toutes les données
4. Recrée les tables vides
5. Recrée les index

**Exemple d'utilisation:**
```bash
$ pnpm run reset-turso

⚠️  ATTENTION: Cette opération va:
   1. Supprimer toutes les tables existantes
   2. Supprimer toutes les données
   3. Recréer les tables vides

⚠️  Êtes-vous sûr de vouloir SUPPRIMER toutes les données? (oui/non): oui

🗑️  Suppression des tables existantes...
   ✓ Table likes supprimée
   ✓ Table downloads supprimée
   ✓ Table users supprimée

🚀 Recréation des tables...
   ✓ Table users créée
   ✓ Table downloads créée
   ✓ Table likes créée

✅ Base de données réinitialisée avec succès!
```

---

## 🔧 Prérequis

Ces scripts nécessitent:
- Node.js
- Les variables d'environnement dans `.env.local`:
  - `TURSO_DATABASE_URL`
  - `TURSO_AUTH_TOKEN`

## 🐛 Dépannage

### Erreur "Variables d'environnement manquantes"

Vérifiez que `.env.local` contient:
```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=eyJhbGc...
```

### Erreur "no such table"

Lancez `pnpm run init-turso` pour créer les tables.

### Erreur de connexion

Vérifiez:
1. Que votre base Turso existe: `turso db list`
2. Que l'URL est correcte: `turso db show <nom-db>`
3. Que le token est valide: `turso db tokens list <nom-db>`

## 📚 Documentation complète

Voir `TURSO_SETUP.md` pour plus d'informations sur Turso.
