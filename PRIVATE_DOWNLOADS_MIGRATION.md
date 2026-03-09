# Migration des fichiers téléchargeables vers dossier privé

## 🎯 Objectif

Déplacer les fichiers EPUB et PDF du dossier `public/` vers un dossier `private/` pour:
- Empêcher l'accès direct via URL
- Tracker tous les téléchargements
- Améliorer la sécurité

## 📋 Étapes de migration

### 1. Créer la structure (✅ Fait)

```bash
mkdir -p private/downloads
```

### 2. Déplacer les fichiers

Si tu as déjà des fichiers dans `public/downloads/`:

```bash
# Déplacer les fichiers
mv public/downloads/pelerinage.epub private/downloads/
mv public/downloads/pelerinage.pdf private/downloads/

# Supprimer l'ancien dossier
rm -rf public/downloads/
```

Si tu n'as pas encore les fichiers, place-les directement dans `private/downloads/`:

```bash
# Copier tes fichiers
cp /chemin/vers/ton/livre.epub private/downloads/pelerinage.epub
cp /chemin/vers/ton/livre.pdf private/downloads/pelerinage.pdf
```

### 3. Vérifier les permissions

```bash
# Les fichiers doivent être lisibles par le serveur
chmod 644 private/downloads/pelerinage.*
```

### 4. Tester

```bash
# Démarrer le serveur
pnpm dev

# Tester le téléchargement
curl -I http://localhost:42424/api/download-file?format=epub
# Devrait retourner 200 OK

curl -I http://localhost:42424/api/download-file?format=pdf
# Devrait retourner 200 OK
```

### 5. Vérifier la sécurité

Essayer d'accéder directement aux fichiers (devrait échouer):

```bash
curl -I http://localhost:42424/private/downloads/pelerinage.epub
# Devrait retourner 404 Not Found
```

✅ Si tu obtiens 404, c'est parfait! Les fichiers sont protégés.

## 🔒 Sécurité

### Avant (public/)
```
https://ton-site.com/downloads/pelerinage.epub
                  ↓
         Accès direct possible
         Pas de tracking
         Pas de contrôle
```

### Après (private/)
```
https://ton-site.com/api/download-file?format=epub
                  ↓
         API Route (contrôle d'accès)
                  ↓
         Tracking en DB
                  ↓
         Lecture du fichier privé
                  ↓
         Envoi au client
```

## 📊 Avantages

1. **Sécurité**
   - Impossible d'accéder directement aux fichiers
   - Contrôle total sur qui peut télécharger

2. **Tracking**
   - Chaque téléchargement est enregistré
   - Stats précises (nombre de téléchargements par format)

3. **Flexibilité future**
   - Possibilité d'ajouter de l'authentification
   - Possibilité de générer des liens temporaires
   - Possibilité de rate limiting

4. **Performance**
   - Cache HTTP (1 heure)
   - Pas de différence de vitesse vs public/

## 🚀 Déploiement

### Vercel

Les fichiers dans `private/` sont déployés avec ton app mais ne sont pas accessibles publiquement.

**Important**: Si tes fichiers sont > 50MB, utilise Vercel Blob Storage:

```bash
# Installer Vercel Blob
pnpm add @vercel/blob

# Uploader les fichiers
vercel blob upload private/downloads/pelerinage.epub
vercel blob upload private/downloads/pelerinage.pdf
```

Puis modifier l'API route pour lire depuis Blob Storage.

### Autres plateformes

- **Netlify**: Pareil, les fichiers privés sont OK
- **Railway/Render**: Pareil
- **VPS**: Aucun problème

## 📝 Notes

- Les fichiers dans `private/` ne sont PAS dans le bundle client
- Ils sont accessibles uniquement côté serveur
- Parfait pour des fichiers sensibles ou trackables

## ❓ FAQ

### Les fichiers sont-ils vraiment privés?

Oui! Next.js ne sert que les fichiers dans `public/`. Tout ce qui est en dehors est inaccessible via HTTP.

### Ça ralentit les téléchargements?

Non, la différence est négligeable (< 10ms). Le fichier est lu depuis le disque et streamé au client.

### Je peux mettre d'autres fichiers?

Oui! Tu peux mettre n'importe quoi dans `private/`:
- Images privées
- Documents
- Backups
- Etc.

### Ça marche avec des gros fichiers?

Oui, jusqu'à la limite de ta plateforme:
- Vercel: 50MB (utiliser Blob Storage au-delà)
- Netlify: 50MB
- VPS: Pas de limite

## ✅ Checklist finale

- [ ] Dossier `private/downloads/` créé
- [ ] Fichiers EPUB et PDF déplacés
- [ ] Ancien dossier `public/downloads/` supprimé
- [ ] Tests de téléchargement OK
- [ ] Vérification sécurité (404 sur accès direct) OK
- [ ] `.gitignore` mis à jour
- [ ] Déployé en production
