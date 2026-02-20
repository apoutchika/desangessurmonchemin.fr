import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { journeyData, getDayBySlug, getNavigation, getPageLabel } from '@/data/journey';
import { DayPage } from '@/components/livre/DayPage';

// Génération statique de toutes les pages
export function generateStaticParams() {
  return journeyData.map(day => {
    if (day.type === 'avant-propos') return { slug: 'avant-propos' };
    if (day.type === 'postface') return { slug: 'postface' };
    return { slug: `jour-${day.day}` };
  });
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
    title: getPageLabel(day),
    description: day.content.slice(0, 160).trim().replace(/\s+/g, ' '),
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

  return <DayPage day={day} nav={nav} />;
}
