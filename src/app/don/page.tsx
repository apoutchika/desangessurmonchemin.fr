"use client";

import { TokenBTC, TokenETH, TokenSOL } from "@web3icons/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BookCover } from "@/components/ui/BookCover";

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
    symbol: "SOL / USDC",
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

export default function DonPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("fiat");

  const [amount, setAmount] = useState<number | null>(15);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Vérifier si on revient de Stripe
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      // Nettoyer l'URL après 5 secondes
      setTimeout(() => {
        window.history.replaceState({}, "", "/don");
      }, 5000);
    }
  }, [searchParams]);

  const handlePayment = async () => {
    const finalAmount = showCustomInput ? Number(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      // Rediriger vers Stripe
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

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
              marcher, photographier, écrire, relire, coder ce site. Si ce récit
              vous a touché, accompagné ou inspiré, votre soutien permet de
              continuer à créer et partager.
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
                    className={`don-amount-btn${amount === a && !showCustomInput ? " don-amount-btn--selected" : ""}`}
                    onClick={() => {
                      setAmount(a);
                      setShowCustomInput(false);
                    }}
                  >
                    {a} €
                  </button>
                ))}
                <button
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
                <div
                  style={{
                    marginBottom: "1.5rem",
                    animation: "fadeIn 0.2s ease-in",
                  }}
                >
                  <FieldLabel>Votre montant</FieldLabel>
                  <div style={{ position: "relative" }}>
                    <input
                      id="custom"
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Entrez un montant"
                      autoFocus
                      style={{
                        width: "100%",
                        padding: "0.875rem 2.5rem 0.875rem 1rem",
                        border: "1.5px solid var(--forest)",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontFamily: "var(--font-serif)",
                        background: "var(--white)",
                        color: "var(--ink)",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
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
                </div>
              )}

              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  fontSize: "1rem",
                  padding: "1rem",
                }}
                disabled={
                  loading ||
                  (showCustomInput
                    ? !customAmount || Number(customAmount) <= 0
                    : !amount || amount <= 0)
                }
                onClick={handlePayment}
              >
                {loading
                  ? "Redirection..."
                  : `Donner ${showCustomInput ? (customAmount ? `${customAmount} €` : "") : amount ? `${amount} €` : ""} →`}
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
