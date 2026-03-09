# Prix et Sécurité - Décisions

## 💰 Prix psychologiques - Décision: NON

### Question
Faut-il utiliser des prix psychologiques (4,99€, 9,90€) au lieu de prix ronds (5€, 10€)?

### Réponse: Garder les prix ronds

#### Pourquoi?

1. **Contexte: Don volontaire, pas vente commerciale**
   - Les prix psychologiques sont pour la vente (créer l'illusion d'un prix plus bas)
   - Ton projet est un don libre, pas un achat obligatoire
   - L'approche doit être authentique, pas marketing

2. **Perception**
   - Prix ronds = Noble, généreux, transparent
   - Prix psychologiques = Marketing agressif, manipulation
   - Pour un projet culturel/artistique, l'authenticité prime

3. **Praticité**
   - 5€, 10€, 15€ sont plus faciles à calculer mentalement
   - Pas de centimes à gérer
   - Plus simple pour les virements bancaires

4. **Exemples de référence**
   - Wikipédia: 2€, 5€, 10€, 20€ (prix ronds)
   - Patreon: 1€, 5€, 10€ (prix ronds)
   - Kickstarter: Prix ronds majoritairement

#### Quand utiliser les prix psychologiques?

Seulement si tu vendais le livre à un **prix fixe**:
- "Livre à 14,99€" → OK (vente commerciale)
- "Don suggéré: 15€" → Prix rond (don volontaire)

### Recommandation finale

**Garde tes prix actuels: 5, 10, 15, 20, 30, 50€**

C'est parfait pour un don volontaire. Ça communique:
- Transparence
- Authenticité
- Respect du donateur
- Pas de manipulation

---

## 🔒 Fichiers privés - Décision: OUI

### Question
Faut-il déplacer les fichiers EPUB/PDF du dossier `public/` vers un dossier privé?

### Réponse: Oui, absolument!

#### Pourquoi?

### Avant (public/downloads/)

```
❌ Problèmes:
- Accès direct possible: https://site.com/downloads/pelerinage.epub
- Impossible de tracker les téléchargements
- Impossible de contrôler l'accès
- Pas de rate limiting possible
- Fichiers indexables par Google
```

### Après (private/downloads/)

```
✅ Avantages:
- Accès uniquement via API: /api/download-file?format=epub
- Tracking de chaque téléchargement
- Contrôle d'accès possible
- Rate limiting possible
- Fichiers non indexables
- Possibilité d'authentification future
```

#### Architecture

```
Client
  ↓
  Demande: /api/download-file?format=epub
  ↓
API Route (src/app/api/download-file/route.ts)
  ↓
  1. Validation du format
  2. Tracking en DB (incrementDownload)
  3. Lecture du fichier privé
  4. Headers appropriés
  ↓
  Envoi du fichier au client
```

#### Sécurité

1. **Impossible d'accéder directement**
   ```bash
   # ❌ Échoue (404)
   curl https://site.com/private/downloads/pelerinage.epub
   
   # ✅ Fonctionne
   curl https://site.com/api/download-file?format=epub
   ```

2. **Tracking automatique**
   - Chaque téléchargement est enregistré
   - Stats précises par format
   - Détection d'abus possible

3. **Flexibilité future**
   - Ajouter de l'authentification
   - Générer des liens temporaires
   - Rate limiting (max X téléchargements/heure)
   - Watermarking dynamique

#### Performance

- **Latence**: +5-10ms (négligeable)
- **Cache**: Headers HTTP cache (1 heure)
- **Streaming**: Fichier streamé, pas chargé en mémoire
- **Scalabilité**: Identique à public/

#### Limites de taille

- **Vercel**: 50MB max (utiliser Blob Storage au-delà)
- **Netlify**: 50MB max
- **VPS**: Pas de limite

Pour des fichiers > 50MB, utiliser:
- Vercel Blob Storage
- AWS S3 + CloudFront
- Cloudflare R2

### Recommandation finale

**Déplacer vers private/downloads/**

C'est une best practice pour:
- Sécurité
- Tracking
- Contrôle
- Flexibilité

---

## 📊 Comparaison finale

### Prix

| Aspect | Prix ronds | Prix psychologiques |
|--------|-----------|---------------------|
| Perception | Authentique, noble | Marketing, manipulation |
| Calcul mental | Facile | Plus complexe |
| Contexte | Don volontaire ✅ | Vente commerciale |
| Exemples | Wikipédia, Patreon | E-commerce |

**Verdict: Prix ronds**

### Fichiers

| Aspect | public/ | private/ |
|--------|---------|----------|
| Accès direct | ✅ Oui | ❌ Non |
| Tracking | ❌ Non | ✅ Oui |
| Contrôle | ❌ Non | ✅ Oui |
| Sécurité | ❌ Faible | ✅ Forte |
| Flexibilité | ❌ Limitée | ✅ Totale |

**Verdict: private/**

---

## 🚀 Actions à faire

### 1. Prix (rien à faire)
- ✅ Les prix actuels sont parfaits
- ✅ Garde 5, 10, 15, 20, 30, 50€

### 2. Fichiers (migration)
1. Créer `private/downloads/`
2. Déplacer les fichiers EPUB/PDF
3. Supprimer `public/downloads/`
4. Tester les téléchargements
5. Vérifier la sécurité (404 sur accès direct)

Voir `PRIVATE_DOWNLOADS_MIGRATION.md` pour le guide complet.

---

## 💡 Bonus: Améliorations futures

### Prix
- Ajouter un champ "Autre montant" avec suggestions
- Afficher le montant moyen des dons
- Proposer des paliers avec contreparties symboliques

### Fichiers
- Générer des liens de téléchargement temporaires (expire après 1h)
- Watermarking dynamique (ajouter l'email du donateur dans le PDF)
- Rate limiting (max 3 téléchargements/heure par IP)
- Analytics avancées (temps de téléchargement, taux d'abandon)

Pour l'instant, la configuration actuelle est excellente!
