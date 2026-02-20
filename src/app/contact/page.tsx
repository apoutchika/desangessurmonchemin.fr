"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Context = "don" | "lecture" | "autre";
type Status = "idle" | "loading" | "success" | "error";

// ─── Helpers UI ───────────────────────────────────────────────────────────────

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
  border: "1.5px solid var(--line)",
  borderRadius: "8px",
  fontSize: "0.9375rem",
  fontFamily: "var(--font-serif)",
  background: "var(--sand)",
  color: "var(--ink)",
  outline: "none",
  transition: "border-color 0.2s",
  display: "block",
};

// ─── Composant ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState<Context>("lecture");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<string[]>([]);

  const contexts: { value: Context; label: string }[] = [
    { value: "lecture", label: "À propos du livre" },
    { value: "don", label: "Suite à un don" },
    { value: "autre", label: "Autre" },
  ];

  const handleSubmit = async () => {
    setStatus("loading");
    setErrors([]);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, context, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors ?? ["Une erreur est survenue."]);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrors(["Impossible d'envoyer le message. Vérifiez votre connexion."]);
      setStatus("error");
    }
  };

  // ── Succès ──────────────────────────────────────────────────────────────────
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

  // ── Formulaire ──────────────────────────────────────────────────────────────
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
        {/* En-tête */}
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

        {/* Contexte */}
        <div style={{ marginBottom: "1.5rem" }}>
          <FieldLabel htmlFor="context">Objet du message</FieldLabel>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {contexts.map((c) => (
              <button
                key={c.value}
                onClick={() => setContext(c.value)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "100px",
                  border: "1.5px solid",
                  borderColor:
                    context === c.value ? "var(--earth)" : "var(--line)",
                  background:
                    context === c.value ? "var(--earth)" : "transparent",
                  color: context === c.value ? "var(--white)" : "var(--stone)",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nom + Email côte à côte */}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Marie Dupont"
              style={fieldStyle}
              autoComplete="name"
            />
          </div>
          <div>
            <FieldLabel htmlFor="email">Votre email</FieldLabel>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marie@exemple.fr"
              style={fieldStyle}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Message */}
        <div style={{ marginBottom: "1.75rem" }}>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Votre message…"
            rows={6}
            style={{
              ...fieldStyle,
              resize: "vertical",
              lineHeight: "1.7",
              minHeight: "140px",
            }}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: "0.6875rem",
              color: message.length > 20 ? "var(--muted)" : "transparent",
              marginTop: "0.375rem",
              transition: "color 0.2s",
              fontFamily: "var(--font-sans)",
            }}
          >
            {message.length} caractères
          </div>
        </div>

        {/* Erreurs */}
        {errors.length > 0 && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "0.875rem 1rem",
              marginBottom: "1.25rem",
            }}
          >
            {errors.map((e, i) => (
              <p
                key={i}
                style={{
                  fontSize: "0.875rem",
                  color: "#b91c1c",
                  margin: i > 0 ? "0.25rem 0 0" : "0",
                }}
              >
                {e}
              </p>
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={status === "loading" || !name || !email || !message}
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

        {/* Note vie privée */}
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

        {/* Lien email direct */}
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
            href="mailto:contact@votredomaine.fr" // ← à adapter
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
