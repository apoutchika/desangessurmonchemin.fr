import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Créer le dossier data s'il n'existe pas
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'stats.db');
const db = new Database(dbPath);

// Créer les tables si elles n'existent pas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_hash TEXT NOT NULL UNIQUE,
    user_agent TEXT,
    first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    format TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, format)
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    day_id INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(day_id, user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_users_ip_hash ON users(ip_hash);
  CREATE INDEX IF NOT EXISTS idx_downloads_user_format ON downloads(user_id, format);
  CREATE INDEX IF NOT EXISTS idx_likes_day ON likes(day_id);
  CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id);
`);

// Anonymiser l'IP avec un hash
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + (process.env.IP_SALT || 'default-salt')).digest('hex');
}

// Récupérer ou créer un utilisateur
function getOrCreateUser(ip: string, userAgent?: string): number {
  const ipHash = hashIP(ip);
  
  // Chercher l'utilisateur existant
  const existing = db.prepare('SELECT id FROM users WHERE ip_hash = ?').get(ipHash) as { id: number } | undefined;
  
  if (existing) {
    // Mettre à jour last_visit
    db.prepare('UPDATE users SET last_visit = CURRENT_TIMESTAMP WHERE id = ?').run(existing.id);
    return existing.id;
  }
  
  // Créer un nouvel utilisateur
  const result = db.prepare('INSERT INTO users (ip_hash, user_agent) VALUES (?, ?)').run(ipHash, userAgent || null);
  return result.lastInsertRowid as number;
}

export function incrementDownload(format: 'epub' | 'pdf', ip: string, userAgent?: string): boolean {
  const userId = getOrCreateUser(ip, userAgent);
  
  // Vérifier si cet utilisateur a déjà téléchargé ce format
  const existing = db.prepare(
    'SELECT id FROM downloads WHERE user_id = ? AND format = ?'
  ).get(userId, format);

  if (existing) {
    return false; // Déjà téléchargé
  }

  const stmt = db.prepare('INSERT INTO downloads (user_id, format) VALUES (?, ?)');
  stmt.run(userId, format);
  return true;
}

export function getDownloadStats() {
  // Total = nombre d'utilisateurs uniques ayant téléchargé
  const total = db.prepare('SELECT COUNT(*) as count FROM downloads').get() as { count: number };
  const byFormat = db.prepare(`
    SELECT format, COUNT(DISTINCT user_id) as count 
    FROM downloads 
    GROUP BY format
  `).all() as { format: string; count: number }[];

  return {
    total: total.count,
    epub: byFormat.find(f => f.format === 'epub')?.count || 0,
    pdf: byFormat.find(f => f.format === 'pdf')?.count || 0,
  };
}

export function toggleLike(dayId: number, ip: string, userAgent?: string): { liked: boolean; count: number } {
  const userId = getOrCreateUser(ip, userAgent);

  // Vérifier si déjà liké
  const existing = db.prepare(
    'SELECT id FROM likes WHERE day_id = ? AND user_id = ?'
  ).get(dayId, userId);

  if (existing) {
    // Retirer le like
    db.prepare('DELETE FROM likes WHERE day_id = ? AND user_id = ?').run(dayId, userId);
  } else {
    // Ajouter le like
    db.prepare('INSERT INTO likes (day_id, user_id) VALUES (?, ?)').run(dayId, userId);
  }

  // Retourner le nouveau statut
  const count = db.prepare('SELECT COUNT(*) as count FROM likes WHERE day_id = ?').get(dayId) as { count: number };
  const liked = !existing;

  return { liked, count: count.count };
}

export function getLikesForDay(dayId: number, ip?: string) {
  const count = db.prepare('SELECT COUNT(*) as count FROM likes WHERE day_id = ?').get(dayId) as { count: number };
  
  let liked = false;
  if (ip) {
    const ipHash = hashIP(ip);
    const user = db.prepare('SELECT id FROM users WHERE ip_hash = ?').get(ipHash) as { id: number } | undefined;
    if (user) {
      const existing = db.prepare('SELECT id FROM likes WHERE day_id = ? AND user_id = ?').get(dayId, user.id);
      liked = !!existing;
    }
  }

  return { count: count.count, liked };
}

export default db;
