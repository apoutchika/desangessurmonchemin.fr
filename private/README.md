# Dossier privé

Ce dossier contient des fichiers qui ne doivent **PAS** être accessibles publiquement via HTTP.

## Structure

```
private/
├── downloads/          # Fichiers téléchargeables (EPUB, PDF)
│   ├── pelerinage.epub
│   └── pelerinage.pdf
└── README.md
```

## Sécurité

### ✅ Avantages de cette approche

1. **Contrôle d'accès**
   - Les fichiers ne sont accessibles que via l'API `/api/download-file`
   - Impossible d'accéder directement via URL (ex: `/downloads/pelerinage.pdf`)

2. **Tracking**
   - Chaque téléchargement passe par l'API
   - On peut compter les téléchargements
   - On peut ajouter de l'authentification si besoin

3. **Flexibilité**
   - Possibilité d'ajouter des vérifications (rate limiting, etc.)
   - Possibilité de générer des liens temporaires
   - Possibilité de servir différentes versions selon l'utilisateur

### 🔒 Ce qui est protégé

- Les fichiers dans `private/` ne sont **jamais** servis par Next.js
- Seul le code serveur (API routes) peut y accéder
- Impossible d'accéder via le navigateur directement

### 📝 Ajouter des fichiers

1. Placer les fichiers dans `private/downloads/`
2. Nommer les fichiers: `pelerinage.epub` et `pelerinage.pdf`
3. Les fichiers seront automatiquement disponibles via l'API

### 🚫 À ne PAS faire

- Ne pas mettre de fichiers sensibles (mots de passe, clés API)
- Ne pas commiter de gros fichiers (utiliser Git LFS si nécessaire)
- Ne pas oublier d'ajouter `private/` au `.gitignore` si les fichiers sont volumineux

## Utilisation

Les fichiers sont téléchargeables via:
- `/api/download-file?format=epub`
- `/api/download-file?format=pdf`

Le téléchargement est tracké dans la base de données.
