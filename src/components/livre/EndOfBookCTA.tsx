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
        Si ce récit vous a touché, un petit soutien est toujours apprécié.
        C'est une façon de dire merci pour le travail accompli et de permettre 
        de futurs projets.
      </p>

      <Link
        href="/don"
        className="btn btn-primary"
        style={{ display: 'inline-flex' }}
      >
        Soutenir ce projet
      </Link>
    </div>
  );
}
