# Google Analytics - Événements trackés

## Configuration

Google Analytics est configuré avec consentement RGPD via la bannière de cookies.

### Variables d'environnement
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Événements automatiques

### Pages vues
✅ **Automatique** - Next.js App Router gère les changements de page

Chaque navigation est trackée automatiquement :
- Page d'accueil
- Pages du livre (chaque jour)
- Page de téléchargement
- Page de don
- Page de contact
- Pages légales

## Événements personnalisés

### 1. Téléchargements

**Événement** : `download`

**Paramètres** :
- `event_category`: `engagement`
- `event_label`: `epub` ou `pdf`
- `format`: `epub` ou `pdf`

**Déclenché** : Quand un utilisateur télécharge un fichier

**Où voir dans GA** :
- Rapports > Engagement > Événements
- Filtre : `download`

---

### 2. Likes

**Événement** : `like`

**Paramètres** :
- `event_category`: `engagement`
- `event_label`: `day_X` (X = numéro du jour)
- `action`: `add` ou `remove`
- `day_id`: numéro du jour

**Déclenché** : Quand un utilisateur like/unlike une journée

**Où voir dans GA** :
- Rapports > Engagement > Événements
- Filtre : `like`
- Voir les jours les plus likés via `event_label`

---

### 3. Dons - Intention

**Événement** : `donation_initiated`

**Paramètres** :
- `event_category`: `conversion`
- `event_label`: `{montant}_EUR`
- `value`: montant en euros
- `currency`: `EUR`

**Déclenché** : Quand un utilisateur clique sur "Donner X €"

**Où voir dans GA** :
- Rapports > Engagement > Conversions
- Filtre : `donation_initiated`

---

### 4. Dons - Succès

**Événement** : `donation_completed`

**Paramètres** :
- `event_category`: `conversion`
- `event_label`: `{montant}_EUR`
- `value`: montant en euros
- `currency`: `EUR`

**Déclenché** : Quand un utilisateur revient de Stripe avec succès

**Où voir dans GA** :
- Rapports > Engagement > Conversions
- Filtre : `donation_completed`
- Voir le montant total via la métrique `value`

---

### 5. Contact

**Événement** : `contact_form_submit`

**Paramètres** :
- `event_category`: `engagement`

**Déclenché** : Quand un utilisateur envoie le formulaire de contact

**Où voir dans GA** :
- Rapports > Engagement > Événements
- Filtre : `contact_form_submit`

---

## Métriques utiles dans GA4

### Engagement
- **Téléchargements totaux** : Nombre d'événements `download`
- **Téléchargements par format** : Filtrer par `event_label` (epub/pdf)
- **Likes totaux** : Nombre d'événements `like` avec `action=add`
- **Jours les plus aimés** : Grouper par `event_label`

### Conversions
- **Taux de conversion don** : `donation_completed` / `donation_initiated`
- **Montant moyen des dons** : Moyenne de `value` pour `donation_completed`
- **Revenu total** : Somme de `value` pour `donation_completed`

### Parcours utilisateur
- **Pages vues avant téléchargement** : Parcours > Exploration
- **Pages vues avant don** : Parcours > Exploration
- **Taux de rebond par page** : Engagement > Pages et écrans

## Rapports personnalisés recommandés

### 1. Rapport d'engagement
- Dimension : Type d'événement
- Métriques : Nombre d'événements, Utilisateurs uniques
- Filtres : `download`, `like`, `contact_form_submit`

### 2. Rapport de conversion
- Dimension : Événement de conversion
- Métriques : Nombre de conversions, Valeur totale
- Filtres : `donation_initiated`, `donation_completed`

### 3. Rapport de contenu
- Dimension : Titre de page
- Métriques : Pages vues, Temps moyen, Likes
- Filtres : Pages commençant par `/livre/`

## Configuration des conversions dans GA4

Pour marquer les dons comme conversions :

1. Aller dans Admin > Événements
2. Cliquer sur "Créer un événement"
3. Nom : `donation_completed`
4. Cocher "Marquer comme conversion"

Cela permettra de voir les dons dans les rapports de conversion.

## Anonymisation et RGPD

✅ **Anonymisation des IPs** : Activée (`anonymize_ip: true`)
✅ **Consentement requis** : GA ne charge que si l'utilisateur accepte
✅ **Pas de données personnelles** : Aucun email, nom ou info identifiable trackée

## Debugging

### Vérifier que GA fonctionne

1. Ouvrir la console du navigateur
2. Taper : `window.gtag`
3. Si défini, GA est chargé

### Voir les événements en temps réel

1. Aller dans GA4 > Rapports > Temps réel
2. Effectuer une action (télécharger, liker, etc.)
3. L'événement devrait apparaître dans les 30 secondes

### Extension Chrome recommandée

**Google Analytics Debugger** : Affiche tous les événements envoyés dans la console

## Code source

Tous les événements sont définis dans `src/lib/analytics.ts`

Pour ajouter un nouvel événement :

```typescript
export function trackMonNouvelEvenement(param: string) {
  trackEvent('mon_evenement', {
    event_category: 'ma_categorie',
    event_label: param,
  });
}
```

Puis l'utiliser dans un composant :

```typescript
import { trackMonNouvelEvenement } from '@/lib/analytics';

// Dans une fonction
trackMonNouvelEvenement('valeur');
```

## Limites

- Les événements ne sont envoyés que si l'utilisateur a accepté les cookies
- Les bloqueurs de pub peuvent bloquer GA
- Les données apparaissent avec un léger délai (quelques minutes à quelques heures)
