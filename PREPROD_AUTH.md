# Protection Préprod

## Activation

Pour activer la protection par mot de passe sur la préprod :

1. Ajouter dans `.env.local` ou les variables d'environnement de production :
```bash
PREPROD_PASSWORD=votre_mot_de_passe_secret
```

2. Redémarrer le serveur Next.js

## Comportement

- **Avec `PREPROD_PASSWORD` défini** : Tout le site demande une authentification Basic Auth
- **Sans `PREPROD_PASSWORD`** : Le site fonctionne normalement (pas de protection)
- **Exception** : `/coming-soon` reste toujours accessible sans mot de passe

## Authentification

Quand la protection est active :
- Le navigateur affiche une popup d'authentification
- **Utilisateur** : n'importe quoi (ignoré)
- **Mot de passe** : celui défini dans `PREPROD_PASSWORD`
- Un cookie est créé pour 24h après authentification réussie

## Désactivation

Pour désactiver la protection :

**Option 1 - Temporaire** : Retirer la variable `PREPROD_PASSWORD` de l'environnement

**Option 2 - Définitive** : Supprimer le fichier `src/middleware.ts`

## Exemple d'utilisation

```bash
# Préprod avec protection
PREPROD_PASSWORD=test123 npm run build
PREPROD_PASSWORD=test123 npm start

# Production sans protection
npm run build
npm start
```

## Notes

- Le mot de passe est vérifié côté serveur (sécurisé)
- Le cookie d'authentification expire après 24h
- `/coming-soon` reste accessible pour les visiteurs non authentifiés
- Les assets statiques (_next/static, images, favicon) ne sont pas protégés
