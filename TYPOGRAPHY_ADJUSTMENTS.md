# Ajustements typographiques : Cormorant → EB Garamond

## Pourquoi EB Garamond est un meilleur choix

### Pour un récit de pèlerinage

✅ **EB Garamond** est parfaite car :
- Conçue pour la lecture de longs textes
- Basée sur les Garamond historiques de Claude Garamont (1592)
- Excellente lisibilité pour l'immersion
- Caractère authentique et intemporel
- Moins fatigante sur de longs passages

❌ **Cormorant Garamond** était moins adaptée car :
- Plus décorative, mieux pour les titres
- Contraste élevé qui fatigue sur de longs textes
- Moins lisible pour un journal/récit

## Différences optiques entre les deux fonts

**EB Garamond** apparaît :
- Plus petite optiquement (x-height plus basse)
- Plus légère en poids 300-400
- Espacement naturel plus serré
- Meilleure pour le corps de texte

**Cormorant Garamond** apparaît :
- Plus grande optiquement
- Plus contrastée
- Espacement plus large
- Meilleure pour les titres

## Ajustements appliqués

### 1. Corps de texte (prose)

```css
/* AVANT (Cormorant) */
font-size: clamp(1.125rem, 2.2vw, 1.3125rem);
line-height: 1.85;
letter-spacing: 0.01em;

/* APRÈS (EB Garamond) */
font-size: clamp(1.1875rem, 2.3vw, 1.375rem); /* +5-6% */
line-height: 1.75; /* Légèrement plus serré */
letter-spacing: 0.005em; /* Réduit de moitié */
```

**Raison** : EB Garamond est optiquement plus petite, on compense avec une taille légèrement plus grande.

### 2. Titres H2 (dans le texte)

```css
/* AVANT */
font-size: clamp(1.4rem, 2.5vw, 1.75rem);

/* APRÈS */
font-size: clamp(1.5rem, 2.6vw, 1.875rem); /* +7% */
```

### 3. Titres de jour (day-header__title)

```css
/* AVANT */
font-size: clamp(2rem, 4vw, 3.25rem);
font-weight: 600;

/* APRÈS */
font-size: clamp(2.125rem, 4.2vw, 3.5rem); /* +6-8% */
font-weight: 600; /* Inchangé, 600 fonctionne bien */
```

### 4. Sous-titres de jour (day-header__subtitle)

```css
/* AVANT */
font-size: clamp(1.125rem, 2vw, 1.375rem);
font-weight: 300;

/* APRÈS */
font-size: clamp(1.1875rem, 2.1vw, 1.4375rem); /* +5% */
font-weight: 400; /* 300 est trop léger pour EB Garamond */
```

**Important** : EB Garamond 300 est très fine, on passe à 400 pour les sous-titres.

### 5. Hero titre (page d'accueil)

```css
/* AVANT */
font-size: clamp(3rem, 8vw, 7rem);
font-weight: 300;

/* APRÈS */
font-size: clamp(3.25rem, 8.5vw, 7.5rem); /* +7% */
font-weight: 400; /* 300 trop léger */
```

### 6. Hero sous-titre

```css
/* AVANT */
font-size: clamp(1rem, 2vw, 1.3125rem);
font-weight: 300;

/* APRÈS */
font-size: clamp(1.0625rem, 2.1vw, 1.375rem); /* +5% */
font-weight: 400; /* Plus lisible */
```

## Règles générales appliquées

### Tailles
- **Corps de texte** : +5-6%
- **Titres moyens** : +6-7%
- **Grands titres** : +7-8%

### Poids (font-weight)
- **300** → **400** (EB Garamond 300 est trop fine)
- **400** → **400** (inchangé)
- **600** → **600** (inchangé, fonctionne bien)

### Espacement
- **letter-spacing** : Réduit de moitié (EB Garamond a un espacement naturel)
- **line-height** : Légèrement réduit (1.85 → 1.75 pour le corps)

## Vérifications à faire

### Sur mobile
- [ ] Le texte est-il lisible à 1.1875rem ?
- [ ] Les titres ne sont-ils pas trop grands ?

### Sur desktop
- [ ] Le texte à 1.375rem est-il confortable ?
- [ ] Les grands titres (7.5rem) ne sont-ils pas excessifs ?

### Lisibilité
- [ ] Les paragraphes longs sont-ils agréables à lire ?
- [ ] Le contraste est-il suffisant ?
- [ ] L'espacement entre les lignes est-il confortable ?

## Poids disponibles dans EB Garamond

```css
@import url("https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap");
```

Chargés :
- 400 (regular) - Corps de texte
- 500 (medium) - Optionnel, entre 400 et 600
- 600 (semibold) - Titres
- 400 italic - Emphases
- 500 italic - Optionnel

## Recommandations finales

### ✅ Bon choix
EB Garamond est **excellente** pour un récit de pèlerinage car :
- Authentique et intemporelle
- Parfaite pour la lecture immersive
- Évoque les livres classiques de voyage

### 🎯 Ajustements appliqués
Les ajustements de taille (+5-8%) et de poids (300→400) compensent parfaitement les différences optiques.

### 💡 Conseil
Si tu trouves le texte encore trop petit après test :
- Augmente de 0.0625rem (1px) supplémentaire
- Ou augmente le line-height à 1.8

### 🚀 Prochaines étapes
1. Tester sur différents écrans
2. Lire un jour complet pour vérifier le confort
3. Ajuster si nécessaire

## Comparaison visuelle

```
Cormorant Garamond 1.125rem ≈ EB Garamond 1.1875rem
Cormorant Garamond 2rem     ≈ EB Garamond 2.125rem
Cormorant Garamond 3rem     ≈ EB Garamond 3.25rem
```

Le ratio d'ajustement est d'environ **1.05-1.08** (5-8% plus grand).
