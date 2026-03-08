#!/usr/bin/env node

/**
 * Script pour initialiser la base de données Turso
 * Lance ce script une seule fois après avoir créé ta DB Turso
 * 
 * Usage: node scripts/init-turso.mjs
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
config({ path: join(__dirname, '..', '.env.local') });

async function initTurso() {
  const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('Vérifiez que TURSO_DATABASE_URL et TURSO_AUTH_TOKEN sont définis dans .env.local');
    process.exit(1);
  }

  console.log('🔗 Connexion à Turso:', TURSO_DATABASE_URL);

  const db = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    console.log('🚀 Création de la table users...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_hash TEXT NOT NULL UNIQUE,
        user_agent TEXT,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('🚀 Création de la table downloads...');
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

    console.log('🚀 Création de la table likes...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        day_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(day_id, user_id)
      )
    `);

    console.log('🚀 Création des index...');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_users_ip_hash ON users(ip_hash)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_downloads_user_format ON downloads(user_id, format)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_day ON likes(day_id)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id)');

    console.log('✅ Base de données initialisée avec succès!');
    console.log('');
    console.log('Tables créées:');
    console.log('  - users');
    console.log('  - downloads');
    console.log('  - likes');
    console.log('');
    console.log('Index créés:');
    console.log('  - idx_users_ip_hash');
    console.log('  - idx_downloads_user_format');
    console.log('  - idx_likes_day');
    console.log('  - idx_likes_user');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initTurso();
