# Configuration du projet

## Variables d'environnement

Copier `.env.example` vers `.env.local` et remplir les valeurs :

```bash
cp .env.example .env.local
```

### Mailjet (emails de contact)
1. Créer un compte sur https://www.mailjet.com
2. Aller dans Account Settings > API Keys
3. Copier API Key et Secret Key

### Google reCAPTCHA v2
1. Créer sur https://www.google.com/recaptcha/admin
2. Choisir reCAPTCHA v2 "Je ne suis pas un robot"
3. Ajouter votre domaine
4. Copier Site Key (publique) et Secret Key

### IP Salt
Générer un salt aléatoire pour l'anonymisation des IPs :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Stripe (dons)
1. Créer un compte sur https://stripe.com
2. Aller dans Developers > API keys
3. Copier Publishable key et Secret key
4. En mode test, les clés commencent par `pk_test_` et `sk_test_`

### Google Analytics
1. Créer une propriété GA4 sur https://analytics.google.com
2. Récupérer l'ID de mesure (format `G-XXXXXXXXXX`)
3. Ajouter dans `.env.local` : `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

## Migration de la base de données

Si vous avez déjà des données dans l'ancienne structure :

```bash
node scripts/migrate-db.js
```

Ou pour repartir de zéro :
```bash
rm data/stats.db
# La base sera recréée automatiquement au prochain démarrage
```

## Déploiement

### Vercel (recommandé)

1. Connecter le repo GitHub à Vercel
2. Ajouter les variables d'environnement dans Settings > Environment Variables
3. Déployer

### Variables d'environnement sur Vercel

Toutes les variables de `.env.local` doivent être ajoutées :
- `MAILJET_API_KEY`
- `MAILJET_SECRET_KEY`
- `MAILJET_SENDER_EMAIL`
- `CONTACT_EMAIL`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`
- `IP_SALT`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_GA_ID`

⚠️ Les variables commençant par `NEXT_PUBLIC_` sont exposées côté client.

## Fichiers à ajouter

### Téléchargements

Placer les fichiers dans `public/downloads/` :
- `pelerinage.epub`
- `pelerinage.pdf`

Ces fichiers seront servis via l'API `/api/download-file`.

## RGPD et cookies

### Bannière de consentement

La bannière s'affiche automatiquement à la première visite. Le choix est stocké dans `localStorage`.

### Google Analytics

GA n'est chargé que si l'utilisateur accepte les cookies. L'anonymisation des IPs est activée par défaut.

### Pages légales

- `/mentions-legales` : informations légales
- `/confidentialite` : politique RGPD

Ces pages sont accessibles depuis le footer et la bannière de cookies.

## Développement

```bash
# Installer les dépendances
npm install

# Lancer en dev
npm run dev

# Build
npm run build

# Lancer en production
npm start
```

## Tests

```bash
# Tester le formulaire de contact
# Vérifier que l'email arrive bien

# Tester les téléchargements
# Vérifier que le compteur s'incrémente

# Tester les likes
# Vérifier qu'on ne peut liker qu'une fois

# Tester la bannière de cookies
# Vérifier que GA ne charge pas si refusé
```

## Stripe en mode test

Pour tester les paiements sans argent réel :

Cartes de test :
- Succès : `4242 4242 4242 4242`
- Échec : `4000 0000 0000 0002`
- 3D Secure : `4000 0027 6000 3184`

Date d'expiration : n'importe quelle date future
CVC : n'importe quel 3 chiffres

## Troubleshooting

### Les téléchargements ne comptent pas
- Vérifier que `IP_SALT` est défini
- Vérifier les logs de l'API `/api/download`

### Les emails ne partent pas
- Vérifier les credentials Mailjet
- Vérifier que `MAILJET_SENDER_EMAIL` est vérifié dans Mailjet

### Google Analytics ne fonctionne pas
- Vérifier que `NEXT_PUBLIC_GA_ID` est défini
- Vérifier que les cookies sont acceptés
- Ouvrir la console et chercher `gtag`

### Erreur de base de données
- Supprimer `data/stats.db` et relancer
- Vérifier les permissions du dossier `data/`

## Support

Pour toute question, utiliser le formulaire de contact du site.
