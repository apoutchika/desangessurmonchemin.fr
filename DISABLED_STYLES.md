# Styles des éléments disabled

## 🎨 Styles appliqués

### Boutons génériques (.btn)

```css
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  filter: grayscale(50%);
  pointer-events: none;
}
```

**Effet visuel:**
- Opacité réduite à 50%
- Filtre grayscale (désaturation)
- Curseur "not-allowed"
- Pas d'interaction possible

### Bouton primaire (.btn-primary)

```css
.btn-primary:disabled {
  background: var(--stone);
  color: var(--muted);
  opacity: 0.6;
}
```

**Effet visuel:**
- Fond gris (stone)
- Texte gris clair (muted)
- Opacité 60%

**Exemple:**
```
Normal:    [Donner 15€ →]  (fond noir, texte blanc)
Disabled:  [Donner 15€ →]  (fond gris, texte gris clair, désaturé)
```

### Bouton outline (.btn-outline)

```css
.btn-outline:disabled {
  background: transparent;
  color: var(--muted);
  border-color: var(--line);
  opacity: 0.5;
}
```

**Effet visuel:**
- Bordure gris clair
- Texte gris clair
- Opacité 50%

### Boutons de montant (.don-amount-btn)

```css
.don-amount-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  filter: grayscale(70%);
  background: var(--parch);
  color: var(--muted);
  border-color: var(--line);
}
```

**Effet visuel:**
- Opacité 40% (plus visible que disabled)
- Grayscale 70% (très désaturé)
- Fond parchemin clair
- Texte et bordure gris

**Exemple:**
```
Normal:    [5 €]  (fond sable, texte foncé)
Selected:  [5 €]  (bordure rouge, texte rouge)
Disabled:  [5 €]  (fond clair, texte gris, très désaturé)
```

### Inputs (input, textarea, select)

```css
input:disabled,
textarea:disabled,
select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: var(--parch);
  color: var(--muted);
  border-color: var(--line);
}
```

**Effet visuel:**
- Fond parchemin clair
- Texte gris
- Bordure gris clair
- Opacité 50%

## 🎯 Objectifs

### 1. Visibilité maximale
- **Opacité réduite** (40-60%) pour un effet immédiat
- **Grayscale** pour désaturer les couleurs
- **Couleurs grises** pour renforcer l'effet "inactif"

### 2. Feedback utilisateur
- **Curseur "not-allowed"** au survol
- **Pas d'effet hover** sur les éléments disabled
- **pointer-events: none** pour bloquer toute interaction

### 3. Cohérence visuelle
- Tous les disabled utilisent les mêmes couleurs (stone, muted, parch)
- Même approche (opacité + grayscale + couleurs grises)
- Facile à reconnaître d'un coup d'œil

## 📊 Comparaison avant/après

### Avant
```
Disabled: Légèrement grisé, pas très visible
Risque: L'utilisateur clique sans comprendre pourquoi ça ne marche pas
```

### Après
```
Disabled: Très visible (gris, désaturé, opaque)
Bénéfice: L'utilisateur voit immédiatement que c'est inactif
```

## 🔍 Cas d'usage

### Page don

**Bouton "Donner X€" disabled quand:**
- Aucun montant sélectionné
- Montant custom invalide (< 1€)
- Chargement en cours (redirection Stripe)

**Effet:**
```
[Donner  →]  (gris, désaturé, curseur not-allowed)
```

### Boutons de montant disabled quand:
- Chargement en cours
- Erreur de paiement

**Effet:**
```
[5 €] [10 €] [15 €]  (tous gris, désaturés)
```

### Inputs disabled quand:
- Formulaire en cours de soumission
- Champ non éditable (lecture seule)

**Effet:**
```
[Montant: 15€]  (fond clair, texte gris, curseur not-allowed)
```

## 🎨 Variables CSS utilisées

```css
--stone: #6b5d4f;      /* Gris-brun pour fond disabled */
--muted: #9b8b7a;      /* Gris clair pour texte disabled */
--parch: #f5f1ed;      /* Beige très clair pour fond input disabled */
--line: #e5dfd8;       /* Gris très clair pour bordures disabled */
```

## ✅ Checklist

- [x] Boutons génériques (.btn)
- [x] Bouton primaire (.btn-primary)
- [x] Bouton outline (.btn-outline)
- [x] Boutons de montant (.don-amount-btn)
- [x] Inputs (input, textarea, select)
- [x] Curseur "not-allowed"
- [x] Opacité réduite
- [x] Grayscale pour désaturation
- [x] Couleurs grises cohérentes

## 🚀 Améliorations futures possibles

1. **Animation de transition**
   ```css
   .btn {
     transition: all 0.2s ease;
   }
   ```
   → Transition douce vers l'état disabled

2. **Tooltip explicatif**
   ```html
   <button disabled title="Veuillez sélectionner un montant">
   ```
   → Expliquer pourquoi c'est disabled

3. **Message d'erreur visible**
   ```html
   <button disabled>Donner →</button>
   <p class="error">Le montant minimum est de 1€</p>
   ```
   → Guider l'utilisateur vers la correction

Pour l'instant, les styles visuels sont suffisants et très visibles!
