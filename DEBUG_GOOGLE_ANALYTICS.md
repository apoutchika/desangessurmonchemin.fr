# Debug Google Analytics

## ✅ Corrections apportées

1. **Initialisation de `window.gtag` AVANT le chargement du script**
   - `window.gtag` doit exister avant que le script GA ne se charge
   - Utilisation de `arguments` au lieu de `args` pour la compatibilité

2. **Ajout de handlers `onload` et `onerror`**
   - Permet de voir si le script se charge correctement
   - Initialise GA seulement après le chargement du script

3. **Vérification de double chargement**
   - Évite de charger GA plusieurs fois

4. **Logs de debug**
   - Console logs pour suivre le chargement

## 🔍 Comment tester

### 1. Ouvrir la console du navigateur (F12)

### 2. Effacer le localStorage
```javascript
localStorage.removeItem('cookie-consent');
```

### 3. Recharger la page

### 4. Accepter les cookies

Tu devrais voir dans la console:
```
Loading Google Analytics: G-B18LX7FVM8
Google Analytics script loaded
```

### 5. Vérifier le Network

Dans l'onglet Network, tu devrais voir:
- Une requête vers `googletagmanager.com/gtag/js?id=G-B18LX7FVM8`
- Des requêtes vers `google-analytics.com/g/collect`

### 6. Vérifier que gtag est disponible

Dans la console:
```javascript
typeof window.gtag
// Devrait retourner "function"

window.dataLayer
// Devrait retourner un array avec des données
```

## 🐛 Problèmes courants

### Le script ne se charge pas

**Vérifier:**
1. Bloqueur de pub désactivé (uBlock, AdBlock, etc.)
2. Extensions de confidentialité (Privacy Badger, Ghostery)
3. Paramètres du navigateur (Do Not Track, Enhanced Tracking Protection)
4. Console pour voir les erreurs

### Le script se charge mais pas d'événements

**Vérifier:**
1. `window.gtag` existe: `typeof window.gtag`
2. `window.dataLayer` existe: `window.dataLayer`
3. Tester manuellement:
```javascript
window.gtag('event', 'test_event', { test: 'value' });
```

### Rien ne s'affiche dans Google Analytics

**Rappel:**
- Les données peuvent prendre 24-48h pour apparaître dans les rapports
- Utilise la vue "Temps réel" dans GA pour voir les événements immédiatement
- Vérifie que tu regardes la bonne propriété GA (G-B18LX7FVM8)

## 🧪 Tester les événements

Dans la console, après avoir accepté les cookies:

```javascript
// Tester un événement de download
import('@/lib/analytics').then(({ trackDownload }) => {
  trackDownload('epub');
});

// Tester un événement de like
import('@/lib/analytics').then(({ trackLike }) => {
  trackLike(1, 'add');
});

// Tester un événement de don
import('@/lib/analytics').then(({ trackDonation }) => {
  trackDonation(15);
});
```

## 📊 Vérifier dans Google Analytics

1. Aller sur https://analytics.google.com
2. Sélectionner la propriété G-B18LX7FVM8
3. Aller dans "Temps réel" > "Aperçu"
4. Tu devrais voir ton activité en direct

## 🔧 Mode debug GA

Pour avoir plus de détails, active le mode debug:

```javascript
// Dans la console
window.gtag('config', 'G-B18LX7FVM8', {
  debug_mode: true
});
```

Ou ajoute `?debug_mode=true` à l'URL de ton site.

## 📝 Variables d'environnement

Vérifier que `.env.local` contient:
```bash
NEXT_PUBLIC_GA_ID=G-B18LX7FVM8
```

**Important:** Le préfixe `NEXT_PUBLIC_` est obligatoire pour que la variable soit accessible côté client!

## 🚀 En production

Sur Vercel, n'oublie pas d'ajouter la variable d'environnement:
- Settings > Environment Variables
- Ajouter `NEXT_PUBLIC_GA_ID` = `G-B18LX7FVM8`
- Redéployer
