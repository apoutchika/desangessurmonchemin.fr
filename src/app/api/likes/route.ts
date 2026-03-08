import { NextResponse } from "next/server";
import { toggleLike, getLikesForDay, addLike, removeLike } from "@/lib/db";
import { headers } from "next/headers";

// POST pour toggle (rétrocompatibilité)
export async function POST(request: Request) {
  try {
    const { dayId } = await request.json();

    if (!dayId || typeof dayId !== "number") {
      return NextResponse.json({ error: "dayId invalide" }, { status: 400 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await toggleLike(
      dayId,
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
    const { dayId } = await request.json();

    if (!dayId || typeof dayId !== "number") {
      return NextResponse.json({ error: "dayId invalide" }, { status: 400 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await addLike(
      dayId,
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
    const dayId = parseInt(searchParams.get("dayId") || "0");

    if (!dayId) {
      return NextResponse.json({ error: "dayId requis" }, { status: 400 });
    }

    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await removeLike(
      dayId,
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
    const dayId = parseInt(searchParams.get("dayId") || "0");

    if (!dayId) {
      return NextResponse.json({ error: "dayId requis" }, { status: 400 });
    }

    // Récupérer IP
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const result = await getLikesForDay(dayId, ip);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur get likes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// Désactiver le cache
export const dynamic = "force-dynamic";
