import { NextResponse } from 'next/server';
import { getDownloadStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getDownloadStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur stats:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Désactiver le cache pour avoir les stats en temps réel
export const dynamic = 'force-dynamic';
