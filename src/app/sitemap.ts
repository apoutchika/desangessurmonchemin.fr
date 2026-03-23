import { MetadataRoute } from "next";
import { getJourney } from "@/data/journey";

const getUrl = (path: string) => {
  return new URL(path, process.env.NEXT_PUBLIC_SITE_URL).href;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://votredomaine.fr";
  const journey = getJourney();
  const days = journey.getAllDays();

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: getUrl(`/livre`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: getUrl(`/telechargement`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getUrl(`/don`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getUrl(`/contact`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: getUrl(`/mentions-legales`),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: getUrl(`/confidentialite`),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Pages dynamiques (jours du livre)
  const dayPages: MetadataRoute.Sitemap = days.map((day) => ({
    url: getUrl(`/livre/${day.getSlug()}`),
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...dayPages];
}
