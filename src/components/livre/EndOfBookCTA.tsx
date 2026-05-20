import Link from 'next/link';

export function EndOfBookCTA() {
  return (
    <div
      style={{
        marginTop: '4rem',
        padding: '2rem 1.5rem',
        background: 'linear-gradient(135deg, var(--sand) 0%, var(--parch) 100%)',
        border: '1px solid var(--line)',
        borderRadius: '12px',
        textAlign: 'center',
        maxWidth: '580px',
        margin: '4rem auto 0',
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>☕</div>
      
      <h3
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
          fontWeight: 600,
          color: 'var(--ink)',
          marginBottom: '0.75rem',
          lineHeight: 1.3,
        }}
      >
        Vous avez terminé le livre ?
      </h3>
      
      <p
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.9375rem',
          color: 'var(--stone)',
          lineHeight: 1.7,
          maxWidth: '42ch',
          margin: '0 auto 1.5rem',
        }}
      >
        Si ce récit vous a touché, retrouvez-le en version imprimée sur Amazon
        ou soutenez l'auteur par un don libre.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="https://amzn.eu/d/0elqDxQ8"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ display: 'inline-flex' }}
        >
          📦 Commander la version papier
        </a>
        <Link
          href="/don"
          className="btn btn-outline"
          style={{ display: 'inline-flex' }}
        >
          ☕ Soutenir l'auteur
        </Link>
      </div>
    </div>
  );
}
