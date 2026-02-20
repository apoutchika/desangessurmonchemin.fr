'use client';

import { useState } from 'react';

export default function DonPage() {
  const amounts = [5, 10, 15, 20, 30, 50];
  const [selected, setSelected] = useState<number | null>(15);
  const [custom, setCustom] = useState('');

  const finalAmount = custom ? parseInt(custom, 10) : selected;

  return (
    <div className="simple-page">
      <div className="simple-page__inner">
        <h1 className="simple-page__title">Soutenir l'auteur</h1>
        <p className="simple-page__subtitle">
          Ce livre est et restera gratuit. Un don vous permet de soutenir l'auteur
          et d'encourager la création de nouveaux récits.
        </p>

        <div className="don-amounts">
          {amounts.map(a => (
            <button
              key={a}
              className={`don-amount-btn${selected === a && !custom ? ' don-amount-btn--selected' : ''}`}
              onClick={() => { setSelected(a); setCustom(''); }}
            >
              {a} €
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label
            htmlFor="custom"
            style={{
              display: 'block',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '0.5rem',
            }}
          >
            Autre montant
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="custom"
              type="number"
              min="1"
              value={custom}
              onChange={e => { setCustom(e.target.value); setSelected(null); }}
              placeholder="Votre montant"
              style={{
                width: '100%',
                padding: '0.875rem 2.5rem 0.875rem 1rem',
                border: '1.5px solid var(--line)',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'var(--font-serif)',
                background: 'var(--sand)',
                color: 'var(--ink)',
                outline: 'none',
              }}
            />
            <span style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--muted)',
            }}>
              €
            </span>
          </div>
        </div>

        {/* Ici, intégrer Stripe, PayPal, HelloAsso ou autre selon préférence */}
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '1rem' }}
          disabled={!finalAmount || finalAmount <= 0}
        >
          Donner {finalAmount ? `${finalAmount} €` : ''} →
        </button>

        <p style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--muted)',
          lineHeight: 1.6,
        }}>
          Paiement sécurisé. Aucun engagement, aucun abonnement.
          Vous recevrez un reçu par email.
        </p>
      </div>
    </div>
  );
}
