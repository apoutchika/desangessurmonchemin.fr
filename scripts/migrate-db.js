/**
 * Script de migration de la base de données
 * Convertit l'ancienne structure (ip_hash direct) vers la nouvelle (table users)
 * 
 * Usage: node scripts/migrate-db.js
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.cwd(), 'data', 'stats.db');

if (!fs.existsSync(dbPath)) {
  console.log('❌ Aucune base de données trouvée. Rien à migrer.');
  process.exit(0);
}

const db = new Database(dbPath);

console.log('🔍 Vérification de la structure actuelle...');

// Vérifier si la table users existe déjà
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
const hasUsersTable = tables.some(t => t.name === 'users');

if (hasUsersTable) {
  console.log('✅ La table users existe déjà. Migration déjà effectuée ou nouvelle installation.');
  process.exit(0);
}

console.log('📦 Ancienne structure détectée. Début de la migration...');

try {
  // Commencer une transaction
  db.exec('BEGIN TRANSACTION');

  // 1. Créer la nouvelle table users
  console.log('1️⃣  Création de la table users...');
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip_hash TEXT NOT NULL UNIQUE,
      user_agent TEXT,
      first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Migrer les données depuis downloads
  console.log('2️⃣  Migration des utilisateurs depuis downloads...');
  db.exec(`
    INSERT OR IGNORE INTO users (ip_hash, user_agent, first_visit)
    SELECT DISTINCT ip_hash, user_agent, MIN(timestamp)
    FROM downloads
    GROUP BY ip_hash
  `);

  // 3. Migrer les données depuis likes
  console.log('3️⃣  Migration des utilisateurs depuis likes...');
  db.exec(`
    INSERT OR IGNORE INTO users (ip_hash, first_visit)
    SELECT DISTINCT ip_hash, MIN(timestamp)
    FROM likes
    WHERE ip_hash NOT IN (SELECT ip_hash FROM users)
    GROUP BY ip_hash
  `);

  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`   ✅ ${userCount.count} utilisateurs migrés`);

  // 4. Renommer les anciennes tables
  console.log('4️⃣  Sauvegarde des anciennes tables...');
  db.exec('ALTER TABLE downloads RENAME TO downloads_old');
  db.exec('ALTER TABLE likes RENAME TO likes_old');

  // 5. Créer les nouvelles tables
  console.log('5️⃣  Création des nouvelles tables...');
  db.exec(`
    CREATE TABLE downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      format TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(user_id, format)
    )
  `);

  db.exec(`
    CREATE TABLE likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      day_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(day_id, user_id)
    )
  `);

  // 6. Migrer les données downloads
  console.log('6️⃣  Migration des téléchargements...');
  db.exec(`
    INSERT INTO downloads (user_id, format, timestamp)
    SELECT u.id, d.format, d.timestamp
    FROM downloads_old d
    JOIN users u ON u.ip_hash = d.ip_hash
  `);

  const downloadCount = db.prepare('SELECT COUNT(*) as count FROM downloads').get();
  console.log(`   ✅ ${downloadCount.count} téléchargements migrés`);

  // 7. Migrer les données likes
  console.log('7️⃣  Migration des likes...');
  db.exec(`
    INSERT INTO likes (user_id, day_id, timestamp)
    SELECT u.id, l.day_id, l.timestamp
    FROM likes_old l
    JOIN users u ON u.ip_hash = l.ip_hash
  `);

  const likeCount = db.prepare('SELECT COUNT(*) as count FROM likes').get();
  console.log(`   ✅ ${likeCount.count} likes migrés`);

  // 8. Créer les index
  console.log('8️⃣  Création des index...');
  db.exec(`
    CREATE INDEX idx_users_ip_hash ON users(ip_hash);
    CREATE INDEX idx_downloads_user_format ON downloads(user_id, format);
    CREATE INDEX idx_likes_day ON likes(day_id);
    CREATE INDEX idx_likes_user ON likes(user_id);
  `);

  // 9. Supprimer les anciennes tables
  console.log('9️⃣  Suppression des anciennes tables...');
  db.exec('DROP TABLE downloads_old');
  db.exec('DROP TABLE likes_old');

  // Valider la transaction
  db.exec('COMMIT');

  console.log('\n✅ Migration terminée avec succès !');
  console.log('\n📊 Résumé :');
  console.log(`   - ${userCount.count} utilisateurs`);
  console.log(`   - ${downloadCount.count} téléchargements`);
  console.log(`   - ${likeCount.count} likes`);

} catch (error) {
  // Annuler la transaction en cas d'erreur
  db.exec('ROLLBACK');
  console.error('\n❌ Erreur lors de la migration :', error.message);
  console.error('\n⚠️  La base de données n\'a pas été modifiée.');
  process.exit(1);
} finally {
  db.close();
}
