# Configuration SEO - Préprod vs Production

## État actuel : PRÉPROD (indexation bloquée)

Trois niveaux de protection contre l'indexation sont en place :

### 1. robots.txt (`public/robots.txt`)
```
User-agent: *
Disallow: /
```
Bloque tous les robots sur toutes les pages.

### 2. Meta robots (`src/app/layout.tsx`)
```typescript
robots: {
  index: false,
  follow: false,
  nocache: true,
}
```
Ajoute `<meta name="robots" content="noindex, nofollow">` sur toutes les pages.

### 3. Sitemap (`src/app/sitemap.ts`)
Le sitemap est généré automatiquement et inclut :
- Page d'accueil
- Page livre (index)
- 82 pages de jours individuels
- Pages téléchargement, don, contact
- Pages légales

## Passage en PRODUCTION

Quand tu es prêt à lancer le site en production :

### Étape 1 : Modifier robots.txt
Remplacer le contenu de `public/robots.txt` par :
```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://votredomaine.fr/sitemap.xml
```

### Étape 2 : Retirer les meta robots
Dans `src/app/layout.tsx`, supprimer ou commenter la section :
```typescript
// À RETIRER EN PRODUCTION
robots: {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
  },
},
```

### Étape 3 : Configurer l'URL du site
Ajouter dans `.env.local` ou les variables d'environnement :
```bash
NEXT_PUBLIC_SITE_URL=https://votredomaine.fr
```

### Étape 4 : Soumettre le sitemap
Une fois en production, soumettre le sitemap à :
- Google Search Console : https://search.google.com/search-console
- Bing Webmaster Tools : https://www.bing.com/webmasters

## Vérification

Pour vérifier que l'indexation est bien bloquée :
1. Ouvrir n'importe quelle page du site
2. Afficher le code source (Ctrl+U)
3. Chercher `<meta name="robots"` → doit contenir `noindex, nofollow`
4. Accéder à `/robots.txt` → doit contenir `Disallow: /`

Pour vérifier le sitemap :
- Accéder à `/sitemap.xml` → doit lister toutes les pages

## Structure du sitemap

Le sitemap généré contient environ 90 URLs :
- 7 pages statiques (accueil, livre, téléchargement, don, contact, mentions légales, confidentialité)
- 82 pages de jours du livre (une par jour de pèlerinage)
- Priorités définies selon l'importance des pages
- Fréquence de mise à jour suggérée pour chaque type de page
