import { NextResponse } from "next/server";
import { toggleLike, getLikesForPage, addLike, removeLike } from "@/lib/db";
import { headers } from "next/headers";

// POST pour toggle (rétrocompatibilité)
export async function POST(request: Request) {
  try {
    const { pageSlug } = await request.json();

    if (!pageSlug || typeof pageSlug !== "string") {
      return NextResponse.json({ error: "pageSlug invalide" }, { status: 400 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await toggleLike(
      pageSlug,
      ip,
      headersList.get("user-agent") || undefined,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur like:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT pour ajouter un like
export async function PUT(request: Request) {
  try {
    const { pageSlug } = await request.json();

    if (!pageSlug || typeof pageSlug !== "string") {
      return NextResponse.json({ error: "pageSlug invalide" }, { status: 400 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await addLike(
      pageSlug,
      ip,
      headersList.get("user-agent") || undefined,
    );

    return NextResponse.json({ ...result, liked: true });
  } catch (error) {
    console.error("Erreur add like:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE pour retirer un like
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get("pageSlug");

    if (!pageSlug) {
      return NextResponse.json({ error: "pageSlug requis" }, { status: 400 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await removeLike(
      pageSlug,
      ip,
      headersList.get("user-agent") || undefined,
    );

    return NextResponse.json({ ...result, liked: false });
  } catch (error) {
    console.error("Erreur remove like:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET pour récupérer les likes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get("pageSlug");

    if (!pageSlug) {
      return NextResponse.json({ error: "pageSlug requis" }, { status: 400 });
    }

    // Récupérer IP
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await getLikesForPage(pageSlug, ip);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur get likes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Désactiver le cache
export const dynamic = "force-dynamic";
