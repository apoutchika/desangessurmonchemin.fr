import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contactSchema";

// Vérifier reCAPTCHA
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return false;

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${token}`,
      },
    );

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation avec Yup
    const validatedData = await contactSchema.validate(body, {
      abortEarly: false,
    });

    // Vérifier reCAPTCHA
    const isHuman = await verifyRecaptcha(validatedData.recaptcha);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Échec de la vérification reCAPTCHA" },
        { status: 400 },
      );
    }

    // Configuration Mailjet via nodemailer
    const transporter = nodemailer.createTransport({
      host: "in-v3.mailjet.com",
      port: 465,
      secure: true, // true pour 465, false pour autres ports
      auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET_KEY,
      },
    });

    // Envoyer l'email
    await transporter.sendMail({
      from: `"Des anges sur mon chemin" <noreply@desangessurmonchemin.fr>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: validatedData.email,
      subject: validatedData.subject,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${validatedData.name}</p>
        <p><strong>Email :</strong> ${validatedData.email}</p>
        <p><strong>Sujet :</strong> ${validatedData.subject}</p>
        <hr />
        <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Erreurs de validation Yup
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: error.errors[0] || "Données invalides" },
        { status: 400 },
      );
    }

    console.error("Erreur contact:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 },
    );
  }
}
