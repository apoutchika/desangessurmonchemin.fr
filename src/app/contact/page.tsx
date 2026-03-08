"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReCAPTCHA from "react-google-recaptcha";
import { contactSchema, type ContactFormData } from "@/lib/contactSchema";

type Status = "idle" | "loading" | "success" | "error";

const SUBJECT_OPTIONS = [
  "Question sur le récit",
  "Remerciement après un don",
  "Partage d'expérience",
  "Suggestion ou remarque",
  "Autre",
] as const;

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontSize: "0.6875rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "0.5rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </label>
  );
}

const fieldStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.875rem 1rem",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderColor: "var(--line)",
  borderRadius: "8px",
  fontSize: "0.9375rem",
  fontFamily: "var(--font-serif)",
  background: "var(--sand)",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.2s",
  display: "block",
};

const errorFieldStyle: React.CSSProperties = {
  ...fieldStyle,
  borderColor: "#fca5a5",
  background: "#fef2f2",
};

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
  });

  const handleSubjectChange = (value: string) => {
    setSelectedSubject(value);
    if (value === "Autre") {
      setShowCustomSubject(true);
      setValue("subject", "");
    } else {
      setShowCustomSubject(false);
      setValue("subject", value);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Une erreur est survenue");
        setStatus("error");
        recaptchaRef.current?.reset();
        return;
      }

      setStatus("success");
      
      // Tracker l'envoi du formulaire
      if (typeof window !== 'undefined') {
        const { trackContact } = await import('@/lib/analytics');
        trackContact();
      }
    } catch {
      setServerError(
        "Impossible d'envoyer le message. Vérifiez votre connexion.",
      );
      setStatus("error");
      recaptchaRef.current?.reset();
    }
  };

  // Succès
  if (status === "success") {
    return (
      <div className="simple-page">
        <div className="simple-page__inner" style={{ maxWidth: "480px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--forest)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              margin: "0 auto 1.5rem",
            }}
          >
            ✓
          </div>
          <h1 className="simple-page__title" style={{ fontSize: "2rem" }}>
            Message envoyé
          </h1>
          <p className="simple-page__subtitle">
            Merci pour votre message. Je vous répondrai dès que possible,
            généralement sous quelques jours.
          </p>
          <Link
            href="/livre"
            className="btn btn-outline"
            style={{ display: "inline-flex" }}
          >
            ← Retour au livre
          </Link>
        </div>
      </div>
    );
  }

  // Formulaire
  return (
    <div
      className="simple-page"
      style={{ alignItems: "flex-start", paddingTop: "4rem" }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          margin: "0 auto",
          padding: "0 clamp(1rem, 4vw, 2rem)",
        }}
      >
        <h1
          className="simple-page__title"
          style={{ textAlign: "left", marginBottom: "0.5rem" }}
        >
          Me contacter
        </h1>
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.0625rem",
            color: "var(--stone)",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          Une question sur le récit, un mot après un don, ou simplement l'envie
          d'échanger — je lis chaque message avec plaisir.
        </p>

        <form
          onSubmit={async (...data) => {
            data[0].preventDefault();
            const token = await recaptchaRef.current?.executeAsync();
            console.log({ token });
            setValue("recaptcha", token || "");

            handleSubmit(onSubmit)(...data);
          }}
        >
          {/* Nom + Email */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <FieldLabel htmlFor="name">Votre nom</FieldLabel>
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Marie Dupont"
                style={errors.name ? errorFieldStyle : fieldStyle}
                autoComplete="name"
              />
              {errors.name && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#dc2626",
                    marginTop: "0.375rem",
                  }}
                >
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <FieldLabel htmlFor="email">Votre email</FieldLabel>
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="marie@exemple.fr"
                style={errors.email ? errorFieldStyle : fieldStyle}
                autoComplete="email"
              />
              {errors.email && (
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#dc2626",
                    marginTop: "0.375rem",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Sujet */}
          <div style={{ marginBottom: "1.5rem" }}>
            <FieldLabel htmlFor="subject-select">Sujet</FieldLabel>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => handleSubjectChange(e.target.value)}
              style={{
                ...fieldStyle,
                cursor: "pointer",
              }}
            >
              <option value="">Choisissez un sujet…</option>
              {SUBJECT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            
            {showCustomSubject && (
              <input
                id="subject"
                type="text"
                {...register("subject")}
                placeholder="Précisez votre sujet…"
                style={{
                  ...(errors.subject ? errorFieldStyle : fieldStyle),
                  marginTop: "0.75rem",
                }}
              />
            )}
            
            {errors.subject && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#dc2626",
                  marginTop: "0.375rem",
                }}
              >
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div style={{ marginBottom: "1.5rem" }}>
            <FieldLabel htmlFor="message">Message</FieldLabel>
            <textarea
              id="message"
              {...register("message")}
              placeholder="Votre message…"
              rows={6}
              style={{
                ...(errors.message ? errorFieldStyle : fieldStyle),
                resize: "vertical",
                lineHeight: "1.7",
                minHeight: "140px",
              }}
            />
            {errors.message && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#dc2626",
                  marginTop: "0.375rem",
                }}
              >
                {errors.message.message}
              </p>
            )}
          </div>

          {/* reCAPTCHA */}
          <div style={{ marginBottom: "1.5rem" }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={(token) => setValue("recaptcha", token || "")}
              theme="light"
            />
            {errors.recaptcha && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#dc2626",
                  marginTop: "0.375rem",
                }}
              >
                {errors.recaptcha.message}
              </p>
            )}
          </div>

          {/* Erreur serveur */}
          {serverError && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
              }}
            >
              <p style={{ fontSize: "0.875rem", color: "#b91c1c", margin: 0 }}>
                {serverError}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
            style={{
              width: "100%",
              justifyContent: "center",
              fontSize: "1rem",
              padding: "1rem",
              opacity: status === "loading" ? 0.7 : 1,
            }}
          >
            {status === "loading" ? "Envoi en cours…" : "Envoyer le message →"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.25rem",
            fontSize: "0.75rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Votre email ne sera jamais partagé ni utilisé à d'autres fins que de
          vous répondre.
        </p>

        {/* Email direct */}
        <div
          style={{
            marginTop: "2.5rem",
            paddingTop: "2rem",
            borderTop: "1px solid var(--line)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--muted)",
              marginBottom: "0.375rem",
            }}
          >
            Vous préférez écrire directement ?
          </p>
          <a
            href="mailto:contact@votredomaine.fr"
            className="link-underline"
            style={{
              fontSize: "0.9375rem",
              color: "var(--earth)",
              fontFamily: "var(--font-serif)",
            }}
          >
            contact@votredomaine.fr
          </a>
        </div>
      </div>
    </div>
  );
}
