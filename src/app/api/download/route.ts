import { NextResponse } from 'next/server';
import { incrementDownload, getDownloadStats } from '@/lib/db';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { format } = await request.json();

    if (!format || !['epub', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Format invalide' },
        { status: 400 }
      );
    }

    // Récupérer IP et User-Agent
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 
               headersList.get('x-real-ip') || 
               'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Incrémenter le compteur (retourne false si déjà téléchargé)
    const incremented = await incrementDownload(format as 'epub' | 'pdf', ip, userAgent);

    // Retourner les stats mises à jour
    const stats = await getDownloadStats();

    return NextResponse.json({ 
      success: true, 
      incremented,
      stats 
    });
  } catch (error) {
    console.error('Erreur download:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
