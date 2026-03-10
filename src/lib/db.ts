import { createClient } from '@libsql/client';
import crypto from 'crypto';
import { cache } from './cache';

// Client Turso
const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialiser les tables (à exécuter une seule fois)
export async function initDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_hash TEXT NOT NULL UNIQUE,
      user_agent TEXT,
      first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      format TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, format)
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      page_slug TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(page_slug, user_id)
    )
  `);

  // Créer les index
  await db.execute('CREATE INDEX IF NOT EXISTS idx_users_ip_hash ON users(ip_hash)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_downloads_user_format ON downloads(user_id, format)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_page ON likes(page_slug)');
  await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id)');
}

// Anonymiser l'IP avec un hash
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'default-salt')).digest('hex');
}

// Récupérer ou créer un utilisateur
async function getOrCreateUser(ip: string, userAgent?: string): Promise<number> {
  const ipHash = hashIP(ip);
  
  // Chercher l'utilisateur existant
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE ip_hash = ?',
    args: [ipHash],
  });
  
  if (existing.rows.length > 0) {
    const userId = existing.rows[0].id as number;
    // Mettre à jour last_visit
    await db.execute({
      sql: 'UPDATE users SET last_visit = CURRENT_TIMESTAMP WHERE id = ?',
      args: [userId],
    });
    return userId;
  }
  
  // Créer un nouvel utilisateur
  const result = await db.execute({
    sql: 'INSERT INTO users (ip_hash, user_agent) VALUES (?, ?)',
    args: [ipHash, userAgent || null],
  });
  return Number(result.lastInsertRowid);
}

export async function incrementDownload(format: 'epub' | 'pdf', ip: string, userAgent?: string): Promise<boolean> {
  const userId = await getOrCreateUser(ip, userAgent);
  
  // Vérifier si cet utilisateur a déjà téléchargé ce format
  const existing = await db.execute({
    sql: 'SELECT id FROM downloads WHERE user_id = ? AND format = ?',
    args: [userId, format],
  });

  if (existing.rows.length > 0) {
    return false; // Déjà téléchargé
  }

  await db.execute({
    sql: 'INSERT INTO downloads (user_id, format) VALUES (?, ?)',
    args: [userId, format],
  });

  // Invalider le cache
  cache.invalidateDownloadStats();

  return true;
}

export async function getDownloadStats() {
  // Vérifier le cache d'abord
  const cached = cache.getDownloadStats();
  if (cached) {
    return cached;
  }

  // Sinon, requête DB
  const total = await db.execute('SELECT COUNT(*) as count FROM downloads');
  const byFormat = await db.execute(`
    SELECT format, COUNT(DISTINCT user_id) as count 
    FROM downloads 
    GROUP BY format
  `);

  const stats = {
    total: (total.rows[0].count as number) || 0,
    epub: (byFormat.rows.find((r: any) => r.format === 'epub')?.count as number) || 0,
    pdf: (byFormat.rows.find((r: any) => r.format === 'pdf')?.count as number) || 0,
  };

  // Mettre en cache
  cache.setDownloadStats(stats);

  return stats;
}

export async function addLike(pageSlug: string, ip: string, userAgent?: string): Promise<{ count: number }> {
  const userId = await getOrCreateUser(ip, userAgent);
  const ipHash = hashIP(ip);

  // Vérifier si déjà liké
  const existing = await db.execute({
    sql: 'SELECT id FROM likes WHERE page_slug = ? AND user_id = ?',
    args: [pageSlug, userId],
  });

  if (existing.rows.length === 0) {
    // Ajouter le like
    await db.execute({
      sql: 'INSERT INTO likes (page_slug, user_id) VALUES (?, ?)',
      args: [pageSlug, userId],
    });

    // Invalider le cache
    cache.invalidateLikes(pageSlug);
    cache.addUserLike(ipHash, pageSlug);
  }

  // Retourner le nouveau count (depuis le cache ou DB)
  let count = cache.getLikesCount(pageSlug);
  if (count === null) {
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM likes WHERE page_slug = ?',
      args: [pageSlug],
    });
    count = (result.rows[0].count as number) || 0;
    cache.setLikesCount(pageSlug, count);
  }

  return { count };
}

export async function removeLike(pageSlug: string, ip: string, userAgent?: string): Promise<{ count: number }> {
  const userId = await getOrCreateUser(ip, userAgent);
  const ipHash = hashIP(ip);

  // Retirer le like
  await db.execute({
    sql: 'DELETE FROM likes WHERE page_slug = ? AND user_id = ?',
    args: [pageSlug, userId],
  });

  // Invalider le cache
  cache.invalidateLikes(pageSlug);
  cache.removeUserLike(ipHash, pageSlug);

  // Retourner le nouveau count (depuis le cache ou DB)
  let count = cache.getLikesCount(pageSlug);
  if (count === null) {
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM likes WHERE page_slug = ?',
      args: [pageSlug],
    });
    count = (result.rows[0].count as number) || 0;
    cache.setLikesCount(pageSlug, count);
  }

  return { count };
}

export async function toggleLike(pageSlug: string, ip: string, userAgent?: string): Promise<{ liked: boolean; count: number }> {
  const userId = await getOrCreateUser(ip, userAgent);

  // Vérifier si déjà liké
  const existing = await db.execute({
    sql: 'SELECT id FROM likes WHERE page_slug = ? AND user_id = ?',
    args: [pageSlug, userId],
  });

  if (existing.rows.length > 0) {
    // Retirer le like
    await db.execute({
      sql: 'DELETE FROM likes WHERE page_slug = ? AND user_id = ?',
      args: [pageSlug, userId],
    });
  } else {
    // Ajouter le like
    await db.execute({
      sql: 'INSERT INTO likes (page_slug, user_id) VALUES (?, ?)',
      args: [pageSlug, userId],
    });
  }

  // Retourner le nouveau statut
  const count = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM likes WHERE page_slug = ?',
    args: [pageSlug],
  });
  const liked = existing.rows.length === 0;

  return { liked, count: (count.rows[0].count as number) || 0 };
}

export async function getLikesForPage(pageSlug: string, ip?: string) {
  // Vérifier le cache pour le count
  let count = cache.getLikesCount(pageSlug);
  if (count === null) {
    const result = await db.execute({
      sql: 'SELECT COUNT(*) as count FROM likes WHERE page_slug = ?',
      args: [pageSlug],
    });
    count = (result.rows[0].count as number) || 0;
    cache.setLikesCount(pageSlug, count);
  }
  
  let liked = false;
  if (ip) {
    const ipHash = hashIP(ip);
    
    // Vérifier le cache utilisateur
    const userLikes = cache.getUserLikes(ipHash);
    if (userLikes) {
      liked = userLikes.has(pageSlug);
    } else {
      // Sinon, requête DB
      const user = await db.execute({
        sql: 'SELECT id FROM users WHERE ip_hash = ?',
        args: [ipHash],
      });
      
      if (user.rows.length > 0) {
        const userId = user.rows[0].id as number;
        const existing = await db.execute({
          sql: 'SELECT id FROM likes WHERE page_slug = ? AND user_id = ?',
          args: [pageSlug, userId],
        });
        liked = existing.rows.length > 0;
      }
    }
  }

  return { count, liked };
}

export default db;
