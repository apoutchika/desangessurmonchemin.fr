import { NextRequest, NextResponse } from "next/server";

// Validation minimale
function validate(data: Record<string, string>) {
  const errors: string[] = [];
  if (!data.name?.trim()) errors.push("Le nom est requis");
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push("L'email est invalide");
  if (!data.message?.trim() || data.message.trim().length < 10)
    errors.push("Le message est trop court");
  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, context } = body;

    const errors = validate({ name, email, message });
    if (errors.length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const contextLabels: Record<string, string> = {
      don: "Suite à un don",
      lecture: "À propos du livre",
      autre: "Autre",
    };

    const contextLabel = contextLabels[context] ?? "Non précisé";

    console.log({
      from: "Site pèlerinage <contact@votredomaine.fr>", // ← à adapter
      to: "vous@votredomaine.fr", // ← votre email
      replyTo: email,
      subject: `[Sur le Chemin] Message de ${name} — ${contextLabel}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2b2318;">
          <div style="border-bottom: 1px solid #e8dfc8; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin: 0 0 0.25rem;">
              Nouveau message — Sur le Chemin
            </h2>
            <p style="color: #8a7968; font-size: 0.875rem; margin: 0;">${contextLabel}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
            <tr>
              <td style="padding: 0.5rem 0; color: #8a7968; font-size: 0.875rem; width: 80px;">Nom</td>
              <td style="padding: 0.5rem 0; font-size: 0.875rem;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 0.5rem 0; color: #8a7968; font-size: 0.875rem;">Email</td>
              <td style="padding: 0.5rem 0; font-size: 0.875rem;">
                <a href="mailto:${email}" style="color: #5a7a5f;">${email}</a>
              </td>
            </tr>
          </table>

          <div style="background: #f5f0e8; border-radius: 8px; padding: 1.25rem; line-height: 1.75; font-size: 0.9375rem;">
            ${message.replace(/\n/g, "<br>")}
          </div>

          <p style="margin-top: 1.5rem; font-size: 0.75rem; color: #9e9080;">
            Répondez directement à cet email pour contacter ${name}.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact]", err);
    return NextResponse.json(
      { errors: ["Erreur serveur, veuillez réessayer."] },
      { status: 500 },
    );
  }
}
