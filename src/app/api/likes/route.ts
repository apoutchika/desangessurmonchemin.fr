import { NextResponse } from 'next/server';
import { toggleLike, getLikesForDay } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { dayId } = await request.json();

    if (!dayId || typeof dayId !== 'number') {
      return NextResponse.json(
        { error: 'dayId invalide' },
        { status: 400 }
      );
    }

    // Récupérer IP
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown';

    // Toggle le like
    const result = await toggleLike(dayId, ip, headersList.get('user-agent') || undefined);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur like:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dayId = parseInt(searchParams.get('dayId') || '0');

    if (!dayId) {
      return NextResponse.json(
        { error: 'dayId requis' },
        { status: 400 }
      );
    }

    // Récupérer IP
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown';

    const result = await getLikesForDay(dayId, ip);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur get likes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Désactiver le cache
export const dynamic = 'force-dynamic';
