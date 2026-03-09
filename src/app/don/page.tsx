"use client";

import { TokenBTC, TokenETH, TokenSOL } from "@web3icons/react";
import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { BookCover } from "@/components/ui/BookCover";
import { useForm, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { donationSchema, type DonationFormData } from "@/lib/donationSchema";
import { NumericFormat } from "react-number-format";

const AMOUNTS = [5, 10, 15, 20, 30, 50] as const;

const CRYPTO_WALLETS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qg5x9qrf0fcl6q6v3jy4tss3caj85uz8vyk4v4t",
    color: "#f7931a",
    network: "Bitcoin",
    Icon: TokenBTC,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    address: "0x92687Ce71E7412Dd57705Db34A9b69b93a4b63b0",
    color: "#627eea",
    network: "Ethereum (Mainnet)",
    Icon: TokenETH,
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    address: "BvjFLWtiC6MHwz2ooPjdZtbXjQxFapF7sZHEFgjX3Nsf",
    color: "#9945ff",
    network: "Solana",
    Icon: TokenSOL,
  },
  /*
  {
    id: "usdc-polygon",
    name: "USDC",
    symbol: "USDC",
    address: "0x92687Ce71E7412Dd57705Db34A9b69b93a4b63b0",
    color: "#2775ca",
    network: "Polygon POS",
    tip: "Frais quasi nuls : privilégiez ce réseau !",
    Icon: TokenUSDC,
  },
  */
] as const;

type Wallet = (typeof CRYPTO_WALLETS)[number] & { tip?: string };

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.6875rem",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "0.625rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        margin: "2rem 0",
      }}
    >
      <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
      <span
        style={{
          fontSize: "0.6875rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--muted)",
          fontFamily: "var(--font-sans)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontFamily: "var(--font-sans)",
        color: copied ? "var(--forest)" : "var(--muted)",
        transition: "color 0.2s",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}

function CryptoCard({ wallet }: { wallet: Wallet }) {
  const { Icon } = wallet;

  return (
    <div
      style={{
        border: "1.5px solid var(--line)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        background: "var(--sand)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "0.75rem",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Icon size={28} variant="branded" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: "600",
              fontSize: "0.9375rem",
              color: "var(--ink)",
              lineHeight: 1.2,
            }}
          >
            {wallet.name}
          </div>
          <div
            style={{
              fontSize: "0.6875rem",
              color: "var(--muted)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.05em",
            }}
          >
            {wallet.network}
          </div>
        </div>

        <div
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            fontFamily: "var(--font-sans)",
            flexShrink: 0,
          }}
        >
          {wallet.symbol}
        </div>
      </div>

      {/* Tip */}
      {"tip" in wallet && wallet.tip && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            background: "rgba(90, 122, 95, 0.1)",
            border: "1px solid rgba(90, 122, 95, 0.2)",
            borderRadius: "6px",
            padding: "0.375rem 0.625rem",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ fontSize: "0.75rem" }}>💡</span>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--forest)",
              fontFamily: "var(--font-sans)",
              lineHeight: 1.4,
            }}
          >
            {wallet.tip}
          </span>
        </div>
      )}

      {/* Adresse */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--parch)",
          borderRadius: "6px",
          padding: "0.625rem 0.75rem",
          border: "1px solid var(--line)",
        }}
      >
        <code
          style={{
            fontSize: "0.6875rem",
            fontFamily: "monospace",
            color: "var(--earth)",
            wordBreak: "break-all",
            flex: 1,
            lineHeight: 1.5,
          }}
        >
          {wallet.address}
        </code>
        <CopyButton text={wallet.address} />
      </div>
    </div>
  );
}

type Tab = "fiat" | "crypto";

function DonPageContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("fiat");

  const [amount, setAmount] = useState<number | null>(15);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // React Hook Form avec Yup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DonationFormData>({
    resolver: yupResolver(donationSchema),
    defaultValues: {
      amount: 15,
    },
  });
  const customAmount = watch("amount");

  // Vérifier si on revient de Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);

      // Tracker le don réussi
      if (typeof window !== "undefined") {
        const amount = searchParams.get("amount");
        if (amount) {
          import("@/lib/analytics").then(({ trackDonationSuccess }) => {
            trackDonationSuccess(Number(amount));
          });
        }
      }

      // Nettoyer l'URL après 5 secondes
      setTimeout(() => {
        window.history.replaceState({}, "", "/don");
      }, 5000);
    }
  }, [searchParams]);

  // Message d'encouragement basé sur le montant (non-bloquant, affiché en permanence)
  const encouragementMsg = useMemo(() => {
    const value = showCustomInput ? customAmount : amount;
    if (!value || value < 50) return null;

    if (value >= 50 && value < 100) {
      return "💚 Wahou, merci !";
    }
    if (value >= 100 && value < 500) {
      return "🙏 Quelle générosité, merci du fond du cœur !";
    }
    return null;
  }, [showCustomInput, customAmount, amount]);

  // Vérifier si le montant est trop élevé pour le paiement en ligne
  const isAmountTooHigh = useMemo(() => {
    const value = showCustomInput ? customAmount : amount;
    return value && value >= 500;
  }, [showCustomInput, customAmount, amount]);

  const handlePayment = async (data?: DonationFormData) => {
    const finalAmount = showCustomInput ? data?.amount : amount;

    if (!finalAmount || finalAmount < 1) {
      setError("Le montant minimum est de 1€");
      return;
    }

    // Ne devrait pas arriver car le bouton est remplacé pour les montants >= 500
    if (finalAmount >= 500) {
      return;
    }

    setLoading(true);
    setError(null);

    // Tracker l'intention de don
    if (typeof window !== "undefined") {
      const { trackDonation } = await import("@/lib/analytics");
      trackDonation(finalAmount);
    }

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error || "Erreur lors de la création du paiement",
        );
      }

      // Rediriger vers Stripe
      if (responseData.url) {
        window.location.href = responseData.url;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const btnLabel = useMemo(() => {
    if (loading) return "Redirection...";

    const value = showCustomInput ? customAmount : amount;

    // Si pas de valeur ou invalide
    if (!value || Number.isNaN(value)) {
      return showCustomInput ? "Entrez un montant" : "Choisissez un montant";
    }

    // Si valeur trop petite
    if (value < 1) {
      return "Montant minimum : 1€";
    }

    // Formater avec séparateur de milliers
    const formatted = value
      .toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })
      .replace(/\s/g, " "); // Espace insécable

    return `Donner ${formatted} € →`;
  }, [loading, showCustomInput, customAmount, amount]);

  const btnDisabled = useMemo(() => {
    if (loading) return true;
    const value = showCustomInput ? customAmount : amount;
    if (!value || Number.isNaN(value)) return true;
    return value < 1;
  }, [loading, showCustomInput, customAmount, amount]);

  return (
    <div className="simple-page">
      <div className="don-page__container">
        <div className="don-page__book">
          <BookCover size="medium" />
        </div>

        <div className="don-page__content">
          {showSuccess && (
            <div
              style={{
                background: "rgba(90, 122, 95, 0.1)",
                border: "2px solid var(--forest)",
                borderRadius: "10px",
                padding: "1.5rem",
                marginBottom: "2rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                🙏
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.5rem",
                  color: "var(--forest)",
                  marginBottom: "0.5rem",
                }}
              >
                Merci infiniment !
              </h2>
              <p
                style={{
                  color: "var(--stone)",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                Votre soutien est précieux et permet de continuer à créer et
                partager.
              </p>
              <p style={{ color: "var(--stone)", lineHeight: 1.6, margin: 0 }}>
                Si ce récit vous a touché, n'hésitez pas à{" "}
                <a
                  href="/contact"
                  className="link-underline"
                  style={{ color: "var(--forest)", fontWeight: 500 }}
                >
                  partager vos impressions
                </a>
                . Chaque message est lu avec attention et émotion.
              </p>
            </div>
          )}

          <h1 className="simple-page__title" style={{ textAlign: "left" }}>
            Soutenir ce projet
          </h1>
          <p className="simple-page__subtitle" style={{ textAlign: "left" }}>
            Ce récit est proposé en prix libre. Chacun peut le lire selon ses
            moyens, et ceux qui le souhaitent peuvent contribuer à sa valeur.
          </p>

          <div
            style={{
              background: "var(--parch)",
              border: "1px solid var(--line)",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "2rem",
              fontSize: "0.9375rem",
              color: "var(--earth)",
              lineHeight: 1.7,
              fontFamily: "var(--font-serif)",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              Écrire ce livre a demandé des centaines d'heures de travail :
              marcher, photographier, écrire, relire, coder ce site. Si vous
              avez terminé la lecture et que ce récit vous a touché, accompagné
              ou inspiré, votre soutien permet de continuer à créer et partager.
            </p>
            <p style={{ margin: 0 }}>
              Chaque contribution, quelle que soit sa forme, est reçue avec
              gratitude.
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              marginBottom: "2rem",
              background: "var(--sand)",
              padding: "0.3rem",
              borderRadius: "10px",
              border: "1px solid var(--line)",
            }}
          >
            {(["fiat", "crypto"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "0.625rem",
                  borderRadius: "7px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.875rem",
                  fontWeight: tab === t ? "500" : "400",
                  background: tab === t ? "var(--white)" : "transparent",
                  color: tab === t ? "var(--ink)" : "var(--muted)",
                  boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t === "fiat" ? (
                  "💳 Carte / virement"
                ) : (
                  <>
                    <TokenBTC variant="branded" /> Cryptomonnaie
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Onglet Fiat */}
          {tab === "fiat" && (
            <div style={{ maxWidth: "520px", margin: "0 auto" }}>
              <FieldLabel>Choisissez un montant</FieldLabel>
              <div className="don-amounts" style={{ marginBottom: "1.25rem" }}>
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`don-amount-btn${amount === a && !showCustomInput ? " don-amount-btn--selected" : ""}`}
                    onClick={() => {
                      setAmount(a);
                      setValue("amount", a);
                      setShowCustomInput(false);
                    }}
                  >
                    {a} €
                  </button>
                ))}
                <button
                  type="button"
                  className={`don-amount-btn${showCustomInput ? " don-amount-btn--selected" : ""}`}
                  onClick={() => {
                    setShowCustomInput(true);
                    setAmount(null);
                  }}
                >
                  Autre montant
                </button>
              </div>

              {showCustomInput && (
                <form onSubmit={handleSubmit(handlePayment)}>
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      animation: "fadeIn 0.2s ease-in",
                    }}
                  >
                    <FieldLabel>Votre montant</FieldLabel>
                    <div style={{ position: "relative" }}>
                      <Controller
                        name="amount"
                        control={control}
                        render={({ field }) => (
                          <NumericFormat
                            name={field.name}
                            id="custom"
                            placeholder="Entrez un montant"
                            autoComplete="off"
                            autoFocus
                            thousandSeparator=" "
                            decimalSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            min={1}
                            max={10_000}
                            onValueChange={(values) => {
                              field.onChange(Number(values.floatValue));
                            }}
                            style={{
                              width: "100%",
                              padding: "0.875rem 2.5rem 0.875rem 1rem",
                              border: errors.amount
                                ? "1.5px solid var(--rust)"
                                : "1.5px solid var(--forest)",
                              borderRadius: "8px",
                              fontSize: "1rem",
                              fontFamily: "var(--font-serif)",
                              background: "var(--white)",
                              color: "var(--ink)",
                              outline: "none",
                              transition: "all 0.2s",
                            }}
                          />
                        )}
                      />
                      <span
                        style={{
                          position: "absolute",
                          right: "1rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--muted)",
                          fontFamily: "var(--font-sans)",
                          fontSize: "0.875rem",
                        }}
                      >
                        €
                      </span>
                    </div>
                    {errors.amount && (
                      <p
                        style={{
                          marginTop: "0.5rem",
                          fontSize: "0.8125rem",
                          color: "var(--rust)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {errors.amount.message}
                      </p>
                    )}
                  </div>
                </form>
              )}

              {encouragementMsg && (
                <div
                  style={{
                    background: "rgba(90, 122, 95, 0.1)",
                    border: "1.5px solid var(--forest)",
                    borderRadius: "8px",
                    padding: "0.875rem 1rem",
                    marginBottom: "1rem",
                    fontSize: "0.875rem",
                    color: "var(--forest)",
                    lineHeight: 1.5,
                    fontFamily: "var(--font-sans)",
                    animation: "fadeIn 0.3s ease-in",
                    textAlign: "center",
                  }}
                >
                  {encouragementMsg}
                </div>
              )}

              {isAmountTooHigh ? (
                <div
                  style={{
                    background: "rgba(90, 122, 95, 0.05)",
                    border: "2px solid var(--forest)",
                    borderRadius: "10px",
                    padding: "1.5rem",
                    textAlign: "center",
                    animation: "fadeIn 0.3s ease-in",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
                    ✨
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.25rem",
                      color: "var(--forest)",
                      marginBottom: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    C'est un geste extraordinaire !
                  </h3>
                  <p
                    style={{
                      color: "var(--stone)",
                      lineHeight: 1.7,
                      marginBottom: "1rem",
                      fontSize: "0.9375rem",
                    }}
                  >
                    Pour un montant aussi généreux, prenez le temps de vérifier
                    que c'est bien ce que vous souhaitez.
                  </p>
                  <p
                    style={{
                      color: "var(--earth)",
                      lineHeight: 1.7,
                      marginBottom: "1.25rem",
                      fontSize: "0.9375rem",
                    }}
                  >
                    Si vous confirmez votre intention, merci de{" "}
                    <a
                      href="/contact"
                      className="link-underline"
                      style={{
                        color: "var(--forest)",
                        fontWeight: 500,
                      }}
                    >
                      me contacter directement
                    </a>{" "}
                    pour que nous puissions échanger.
                  </p>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--muted)",
                      fontStyle: "italic",
                    }}
                  >
                    Un tel soutien mérite une attention particulière. 🙏
                  </p>
                </div>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      fontSize: "1rem",
                      padding: "1rem",
                      minHeight: "50px",
                    }}
                    disabled={btnDisabled}
                    onClick={() => {
                      if (showCustomInput) {
                        handleSubmit(handlePayment)();
                      } else {
                        handlePayment();
                      }
                    }}
                    type="button"
                  >
                    {btnLabel}
                  </button>

                  {error && (
                    <p
                      style={{
                        marginTop: "1rem",
                        fontSize: "0.875rem",
                        color: "var(--rust)",
                        lineHeight: 1.6,
                      }}
                    >
                      ⚠️ {error}
                    </p>
                  )}

                  <p
                    style={{
                      marginTop: "1.25rem",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    Paiement sécurisé via Stripe. Aucun engagement, aucun
                    abonnement. Vous recevrez un reçu par email.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Onglet Crypto */}
          {tab === "crypto" && (
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <p
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1rem",
                  color: "var(--stone)",
                  lineHeight: 1.7,
                  marginBottom: "1.75rem",
                }}
              >
                Envoyez le montant de votre choix directement à l'une des
                adresses ci-dessous. Chaque transaction, aussi petite soit-elle,
                est reçue avec gratitude.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {CRYPTO_WALLETS.map((w) => (
                  <CryptoCard key={w.id} wallet={w} />
                ))}
              </div>

              <Divider label="Besoin d'aide ?" />

              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--muted)",
                  lineHeight: 1.7,
                }}
              >
                Si c'est votre premier envoi en cryptomonnaie, des services
                comme{" "}
                <a
                  href="https://www.coinbase.com"
                  target="_blank"
                  rel="noopener"
                  className="link-underline"
                >
                  Coinbase
                </a>{" "}
                ou{" "}
                <a
                  href="https://www.kraken.com"
                  target="_blank"
                  rel="noopener"
                  className="link-underline"
                >
                  Kraken
                </a>{" "}
                permettent d'acheter et envoyer des cryptos facilement. Vérifiez
                toujours l'adresse avant d'envoyer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DonPage() {
  return (
    <Suspense fallback={<div className="simple-page">Chargement...</div>}>
      <DonPageContent />
    </Suspense>
  );
}
