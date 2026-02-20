"use client";

import {
  TokenBTC,
  TokenETH,
  TokenUSDC,
  TokenSOL,
  TokenIconProps,
} from "@web3icons/react";
import { useState } from "react";

const AMOUNTS = [5, 10, 15, 20, 30, 50];

const CRYPTO_ICONS: Record<string, TokenIconProps> = {
  btc: TokenBTC,
  eth: TokenETH,
  "usdc-polygon": TokenUSDC,
  sol: TokenSOL,
};

const CRYPTO_WALLETS = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1q42q8qutaehalx94gc5qw67plgvs2jzvd62qxhj",
    color: "#f7931a",
    icon: "₿",
    network: "Bitcoin",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    address: "0x92687Ce71E7412Dd57705Db34A9b69b93a4b63b0",
    color: "#627eea",
    icon: "Ξ",
    network: "Ethereum (Mainnet)",
  },
  {
    id: "usdc-polygon",
    name: "USDC (Polygon)", // Précise le réseau dès le nom
    symbol: "USDC",
    address: "0x92687Ce71E7412Dd57705Db34A9b69b93a4b63b0",
    color: "#2775ca",
    icon: "S", // L'icône du dollar est plus parlante pour l'USDC
    network: "Polygon POS", // Très important à afficher
    // tip: "Frais quasi nuls : privilégiez ce réseau !", // Un petit plus pour guider
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL / USDC", // Solana permet aussi l'USDC sur la même adresse !
    address: "BvjFLWtiC6MHwz2ooPjdZtbXjQxFapF7sZHEFgjX3Nsf",
    color: "#9945ff",
    icon: "◉",
    network: "Solana",
  },
];

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

function CryptoCard({ wallet }: { wallet: (typeof CRYPTO_WALLETS)[0] }) {
  const Icon = CRYPTO_ICONS[wallet.id];

  return (
    <div
      style={{
        border: "1.5px solid var(--line)",
        borderRadius: "10px",
        padding: "1rem 1.25rem",
        background: "var(--sand)",
      }}
    >
      {/* En-tête */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "0.75rem",
        }}
      >
        {Icon ? (
          <Icon size={28} variant="branded" />
        ) : (
          <span
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: wallet.color,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: "600",
              flexShrink: 0,
            }}
          >
            {wallet.icon}
          </span>
        )}

        <div>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: "600",
              fontSize: "0.9375rem",
              color: "var(--ink)",
              display: "block",
              lineHeight: 1.2,
            }}
          >
            {wallet.name}
          </span>
          <span
            style={{
              fontSize: "0.6875rem",
              color: "var(--muted)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.05em",
            }}
          >
            {wallet.network}
          </span>
        </div>

        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.6875rem",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            fontFamily: "var(--font-sans)",
            flexShrink: 0,
          }}
        >
          {wallet.symbol}
        </span>
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
  const [tab, setTab] = useState<Tab>("fiat");
  const [selected, setSelected] = useState<number | null>(15);
  const [custom, setCustom] = useState("");

  const finalAmount = custom ? parseInt(custom, 10) : selected;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.875rem 2.5rem 0.875rem 1rem",
    border: "1.5px solid var(--line)",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: "var(--font-serif)",
    background: "var(--sand)",
    color: "var(--ink)",
    outline: "none",
  };

  return (
    <div className="simple-page">
      <div className="simple-page__inner" style={{ maxWidth: "520px" }}>
        <h1 className="simple-page__title">Soutenir l'auteur</h1>
        <p className="simple-page__subtitle">
          Ce livre est et restera gratuit. Si le récit vous a touché, votre
          soutien — même modeste — permet de continuer à écrire.
        </p>

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
          {(["fiat", "crypto"] as Tab[]).map((t) => (
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
              }}
            >
              {t === "fiat" ? (
                "💳 Carte / virement"
              ) : (
                <>
                  <TokenBTC /> Cryptomonnaie
                </>
              )}
            </button>
          ))}
        </div>

        {/* Onglet Fiat */}
        {tab === "fiat" && (
          <>
            <FieldLabel>Choisissez un montant</FieldLabel>
            <div className="don-amounts" style={{ marginBottom: "1.25rem" }}>
              {AMOUNTS.map((a) => (
                <button
                  key={a}
                  className={`don-amount-btn${selected === a && !custom ? " don-amount-btn--selected" : ""}`}
                  onClick={() => {
                    setSelected(a);
                    setCustom("");
                  }}
                >
                  {a} €
                </button>
              ))}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <FieldLabel>Autre montant</FieldLabel>
              <div style={{ position: "relative" }}>
                <input
                  id="custom"
                  type="number"
                  min="1"
                  value={custom}
                  onChange={(e) => {
                    setCustom(e.target.value);
                    setSelected(null);
                  }}
                  placeholder="Votre montant"
                  style={inputStyle}
                />
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  €
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                fontSize: "1rem",
                padding: "1rem",
              }}
              disabled={!finalAmount || finalAmount <= 0}
            >
              Donner {finalAmount ? `${finalAmount} €` : ""} →
            </button>

            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.75rem",
                color: "var(--muted)",
                lineHeight: 1.6,
              }}
            >
              Paiement sécurisé via Stripe. Aucun engagement, aucun abonnement.
              Vous recevrez un reçu par email.
            </p>
          </>
        )}

        {/* Onglet Crypto */}
        {tab === "crypto" && (
          <>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                color: "var(--stone)",
                lineHeight: 1.7,
                marginBottom: "1.75rem",
              }}
            >
              Envoyez le montant de votre choix directement à l'une des adresses
              ci-dessous. Chaque transaction, aussi petite soit-elle, est reçue
              avec gratitude.
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
              Si c'est votre premier envoi en cryptomonnaie, des services comme{" "}
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
          </>
        )}
      </div>
    </div>
  );
}
