import type { JourneyDay } from "@/types";

// ============================================================
// DONNÉES DU PÈLERINAGE
// Remplacer par votre vrai fichier JSON importé
// ============================================================

export const journeyData: JourneyDay[] = [
  {
    id: 0,
    type: "avant-propos",
    title: "Avant-propos",
    content: `
Il y a des décisions qui semblent absurdes jusqu'au moment où elles deviennent inévitables.

Celle de poser mon sac à dos un matin de printemps et de marcher pendant soixante jours 
vers quelque chose que je ne savais pas encore nommer — c'était une de celles-là.

Ce livre est la chronique de ce voyage. Pas un guide. Pas une performance sportive.
Juste la trace d'un homme qui marche, qui doute, qui souffre parfois, 
et qui trouve, pas à pas, quelque chose qui ressemble à de la paix.

Bonne lecture.
    `,
    photos: [],
  },
  {
    id: 1,
    type: "jour",
    day: 1,
    date: "2024-04-01",
    from: {
      latlng: { lat: 43.7102, lng: 7.262 },
      city: "Nice",
      name: "Hôtel Le Negresco",
      link: "https://www.negresco.com",
    },
    to: {
      latlng: { lat: 43.6954, lng: 7.2682 },
      city: "Villefranche-sur-Mer",
      name: "La Flore Hôtel",
      link: "https://www.laflorehotel.com",
    },
    stats: {
      distance: 12.4,
      elevationGain: 320,
      elevationLoss: 290,
      duration: 240,
      totalDistance: 12.4,
      totalElevationGain: 320,
    },
    gpx: `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="pelerinage-app">
  <trk><trkseg>
    <trkpt lat="43.7102" lon="7.262"><ele>5</ele></trkpt>
    <trkpt lat="43.705" lon="7.268"><ele>45</ele></trkpt>
    <trkpt lat="43.700" lon="7.271"><ele>120</ele></trkpt>
    <trkpt lat="43.6954" lon="7.2682"><ele>10</ele></trkpt>
  </trkseg></trk>
</gpx>`,
    content: `
Le départ. Enfin.

Ça fait des mois que j'en parle, des années peut-être que j'en rêve.
Ce matin à 6h30, les pieds sur le Promenade des Anglais encore endormi, 
j'ai regardé la mer une dernière fois avant de me retourner vers les collines.

La Méditerranée avait cette couleur bleu-gris des matins sans touristes.
Quelques joggers. Un vieux monsieur qui promenait un chien minuscule.
Personne ne m'a regardé partir.

C'est peut-être ça, finalement, la liberté : quitter un endroit sans que personne ne le remarque.

**Le chemin vers Villefranche**

La montée depuis Nice est traitresse. Ce qu'on croit être une promenade côtière 
se transforme rapidement en ascension sèche sur des chemins calcaires blancs.
La vue sur la rade depuis le Mont Boron valait chaque mètre de dénivelé.

J'ai mangé mon premier sandwich assis sur un rocher,
face à la presqu'île de Saint-Jean-Cap-Ferrat qui flottait dans la brume de chaleur.

Premier bilan des pieds : impeccable. Le moral : au beau fixe.
Le rouge du soir sur les falaises de l'Esterel en toile de fond — magnifique cadeau.
    `,
    photos: [
      {
        src: "/photos/j01-depart-nice.jpg",
        alt: "Départ depuis la Promenade des Anglais",
        caption: "La mer avant de lui tourner le dos",
      },
      {
        src: "/photos/j01-mont-boron.jpg",
        alt: "Vue depuis le Mont Boron",
        caption: "La rade de Villefranche depuis les hauteurs",
      },
      {
        src: "/photos/j01-arrivee.jpg",
        alt: "Arrivée à Villefranche",
        caption: "Les premières ampoules, les premières bières",
      },
    ],
    tags: ["mer", "début", "soleil"],
    mood: 5,
    weather: {
      condition: "Ensoleillé",
      tempMin: 14,
      tempMax: 22,
    },
  },
  {
    id: 2,
    type: "jour",
    day: 2,
    date: "2024-04-02",
    from: {
      latlng: { lat: 43.6954, lng: 7.2682 },
      city: "Villefranche-sur-Mer",
      name: "La Flore Hôtel",
      link: "https://www.laflorehotel.com",
    },
    to: {
      latlng: { lat: 43.7298, lng: 7.4194 },
      city: "Menton",
      name: "Hôtel Napoléon",
      link: "https://www.napoleon-menton.com",
    },
    stats: {
      distance: 28.3,
      elevationGain: 780,
      elevationLoss: 760,
      duration: 420,
      totalDistance: 40.7,
      totalElevationGain: 1100,
    },
    gpx: `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="pelerinage-app">
  <trk><trkseg>
    <trkpt lat="43.6954" lon="7.2682"><ele>10</ele></trkpt>
    <trkpt lat="43.710" lon="7.310"><ele>280</ele></trkpt>
    <trkpt lat="43.720" lon="7.360"><ele>420</ele></trkpt>
    <trkpt lat="43.7298" lon="7.4194"><ele>15</ele></trkpt>
  </trkseg></trk>
</gpx>`,
    content: `
Première vraie journée.

Hier c'était le baptême, l'euphorie du départ. 
Aujourd'hui, c'est la marche — avec tout ce que ça implique.

Les premières heures sur le sentier du littoral m'ont rappelé pourquoi j'avais choisi ce chemin.
La Méditerranée à ma droite, les pins parasols, l'odeur du thym écrasé sous les semelles.

Mais passé Èze-sur-Mer, le chemin monte franchement vers Roquebrune.
780 mètres de dénivelé positif sur la journée — mes cuisses s'en souviennent.

**Roquebrune et ses ruelles**

Le village médiéval de Roquebrune m'a cloué sur place.
Ces ruelles couvertes, ces passages voûtés, ce château du Xe siècle 
qui semble avoir poussé naturellement depuis le rocher...

J'y ai bu un café dans un bar tenu par une vieille dame qui m'a demandé où j'allais.
Quand j'ai répondu "loin", elle a souri et n'a pas posé d'autre question.
C'est le genre de réponse que les gens d'ici comprennent.

Arrivée à Menton sous un soleil rasant, golden hour parfaite,
les façades pastels de la vieille ville irradiaient.
Acheté des citrons de Menton au marché. Décidément cette côte gâte ses marcheurs.
    `,
    photos: [
      {
        src: "/photos/j02-roquebrune.jpg",
        alt: "Les ruelles de Roquebrune",
        caption: "Passé voûté du Xe siècle",
      },
      {
        src: "/photos/j02-menton.jpg",
        alt: "Arrivée à Menton",
        caption: "Les couleurs du soir sur les façades",
      },
    ],
    tags: ["village", "montée", "mer", "citrons"],
    mood: 4,
    weather: {
      condition: "Ensoleillé",
      tempMin: 13,
      tempMax: 24,
    },
  },
  {
    id: 99,
    type: "postface",
    title: "Postface",
    content: `
Soixante jours après ce premier matin sur la Promenade des Anglais,
j'ai posé mon sac pour la dernière fois.

Mes pieds ont parcouru 1 200 kilomètres.
Mes semelles ont usé trois paires de chaussures.
Mon carnet s'est rempli de mots, de doutes, de rires et de silences.

Ce que j'ai trouvé sur ce chemin, je ne saurai peut-être jamais le nommer précisément.
Une légèreté. Une certitude que l'essentiel tient dans peu de choses.
La conviction que la lenteur est une forme de sagesse que nos vies modernes ont oubliée.

Merci à tous ceux qui m'ont offert un toit, un repas, un mot d'encouragement.
Ce voyage était aussi le vôtre.

À bientôt, sur les chemins ou ailleurs.
    `,
    photos: [],
  },
];

// Helpers
export function getDayBySlug(slug: string): JourneyDay | undefined {
  if (slug === "avant-propos")
    return journeyData.find((d) => d.type === "avant-propos");
  if (slug === "postface")
    return journeyData.find((d) => d.type === "postface");
  const day = parseInt(slug.replace("jour-", ""), 10);
  return journeyData.find((d) => d.day === day);
}

export function getSlug(day: JourneyDay): string {
  if (day.type === "avant-propos") return "avant-propos";
  if (day.type === "postface") return "postface";
  return `jour-${day.day}`;
}

export function getNavigation(current: JourneyDay) {
  const idx = journeyData.findIndex((d) => d.id === current.id);
  const prev = idx > 0 ? journeyData[idx - 1] : undefined;
  const next = idx < journeyData.length - 1 ? journeyData[idx + 1] : undefined;
  return {
    prev: prev
      ? { id: prev.id, slug: getSlug(prev), label: getPageLabel(prev) }
      : undefined,
    next: next
      ? { id: next.id, slug: getSlug(next), label: getPageLabel(next) }
      : undefined,
  };
}

export function getPageLabel(day: JourneyDay): string {
  if (day.type === "avant-propos") return day.title ?? "Avant-propos";
  if (day.type === "postface") return day.title ?? "Postface";
  return `Jour ${day.day} — ${day.from?.city} → ${day.to?.city}`;
}

export function getJourneyStats() {
  const days = journeyData.filter((d) => d.type === "jour" && d.stats);
  return {
    totalDays: days.length,
    totalDistance: days.reduce((s, d) => s + (d.stats?.distance ?? 0), 0),
    totalElevationGain: days.reduce(
      (s, d) => s + (d.stats?.elevationGain ?? 0),
      0,
    ),
    startDate: days[0]?.date,
    endDate: days[days.length - 1]?.date,
    startCity: days[0]?.from?.city,
    endCity: days[days.length - 1]?.to?.city,
  };
}
