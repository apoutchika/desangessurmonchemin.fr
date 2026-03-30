import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (!format || !["epub", "pdf"].includes(format)) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }

    // Lire la version du livre pour l'inclure dans le nom du fichier
    let version = "";
    try {
      const versionPath = path.join(process.cwd(), "public", "book.version.json");
      const versionData = JSON.parse(await readFile(versionPath, "utf-8"));
      if (versionData.version) {
        version = `-v${versionData.version}`;
      }
    } catch {
      // Si le fichier est absent, on continue sans version
    }

    // Chemin vers le fichier PRIVÉ (hors du dossier public)
    const filePath = path.join(
      process.cwd(),
      "private",
      "downloads",
      `DesAngesSurMonChemin.${format}`,
    );

    // Lire le fichier
    const fileBuffer = await readFile(filePath);

    // Définir les headers appropriés
    const headers = new Headers();
    headers.set(
      "Content-Type",
      format === "epub" ? "application/epub+zip" : "application/pdf",
    );
    // Le nom inclut la version → change à chaque mise à jour, invalide le cache navigateur
    headers.set(
      "Content-Disposition",
      `attachment; filename="des-anges-sur-mon-chemin${version}.${format}"`,
    );
    headers.set("Content-Length", fileBuffer.length.toString());

    // L'URL contient ?v= (cache-busting) → on peut cacher la réponse 24h
    headers.set("Cache-Control", "private, max-age=86400");

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Erreur téléchargement:", error);
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}

// Désactiver le cache Next.js pour cette route
export const dynamic = "force-dynamic";
