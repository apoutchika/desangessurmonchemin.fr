import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');

    if (!format || !['epub', 'pdf'].includes(format)) {
      return NextResponse.json(
        { error: 'Format invalide' },
        { status: 400 }
      );
    }

    // Chemin vers le fichier
    const filePath = path.join(process.cwd(), 'public', 'downloads', `pelerinage.${format}`);
    
    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Définir les headers appropriés
    const headers = new Headers();
    headers.set('Content-Type', format === 'epub' ? 'application/epub+zip' : 'application/pdf');
    headers.set('Content-Disposition', `attachment; filename="des-anges-sur-mon-chemin.${format}"`);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    return NextResponse.json(
      { error: 'Fichier introuvable' },
      { status: 404 }
    );
  }
}
