import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJourney, getDayBySlug, getNavigation } from "@/data/journey";
import { serializeDay } from "@/domain";
import { DayPage } from "@/components/livre/DayPage";

// Génération statique de toutes les pages
export function generateStaticParams() {
  const journey = getJourney();
  return journey.getAllDays().map((day) => ({ slug: day.getSlug() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const day = getDayBySlug(slug);
  if (!day) return {};
  return {
    title: day.getLabel(),
    description: day.content.slice(0, 160).trim().replace(/\s+/g, " "),
  };
}

export default async function LivreSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const day = getDayBySlug(slug);
  if (!day) notFound();

  const nav = getNavigation(day);

  // Sérialiser pour passer au Client Component
  const serializedDay = serializeDay(day);

  return <DayPage day={serializedDay} nav={nav} />;
}
