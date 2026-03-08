#!/usr/bin/env node

/**
 * Script pour RÉINITIALISER complètement la base de données Turso
 * ⚠️ ATTENTION: Cela supprime TOUTES les données!
 * 
 * Usage: node scripts/reset-turso.mjs
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
config({ path: join(__dirname, '..', '.env.local') });

function askConfirmation() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('⚠️  Êtes-vous sûr de vouloir SUPPRIMER toutes les données? (oui/non): ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'oui');
    });
  });
}

async function resetTurso() {
  const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('Vérifiez que TURSO_DATABASE_URL et TURSO_AUTH_TOKEN sont définis dans .env.local');
    process.exit(1);
  }

  console.log('🔗 Connexion à Turso:', TURSO_DATABASE_URL);
  console.log('');
  console.log('⚠️  ATTENTION: Cette opération va:');
  console.log('   1. Supprimer toutes les tables existantes');
  console.log('   2. Supprimer toutes les données');
  console.log('   3. Recréer les tables vides');
  console.log('');

  const confirmed = await askConfirmation();

  if (!confirmed) {
    console.log('❌ Opération annulée');
    process.exit(0);
  }

  const db = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    console.log('');
    console.log('🗑️  Suppression des tables existantes...');
    
    try {
      await db.execute('DROP TABLE IF EXISTS likes');
      console.log('   ✓ Table likes supprimée');
    } catch (e) {
      console.log('   - Table likes n\'existait pas');
    }

    try {
      await db.execute('DROP TABLE IF EXISTS downloads');
      console.log('   ✓ Table downloads supprimée');
    } catch (e) {
      console.log('   - Table downloads n\'existait pas');
    }

    try {
      await db.execute('DROP TABLE IF EXISTS users');
      console.log('   ✓ Table users supprimée');
    } catch (e) {
      console.log('   - Table users n\'existait pas');
    }

    console.log('');
    console.log('🚀 Recréation des tables...');
    
    await db.execute(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip_hash TEXT NOT NULL UNIQUE,
        user_agent TEXT,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_visit DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('   ✓ Table users créée');

    await db.execute(`
      CREATE TABLE downloads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        format TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(user_id, format)
      )
    `);
    console.log('   ✓ Table downloads créée');

    await db.execute(`
      CREATE TABLE likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        day_id INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(day_id, user_id)
      )
    `);
    console.log('   ✓ Table likes créée');

    console.log('');
    console.log('🚀 Création des index...');
    await db.execute('CREATE INDEX idx_users_ip_hash ON users(ip_hash)');
    await db.execute('CREATE INDEX idx_downloads_user_format ON downloads(user_id, format)');
    await db.execute('CREATE INDEX idx_likes_day ON likes(day_id)');
    await db.execute('CREATE INDEX idx_likes_user ON likes(user_id)');
    console.log('   ✓ Index créés');

    console.log('');
    console.log('✅ Base de données réinitialisée avec succès!');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  }
}

resetTurso();
