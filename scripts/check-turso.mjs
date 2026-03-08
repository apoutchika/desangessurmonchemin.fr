#!/usr/bin/env node

/**
 * Script pour vérifier l'état de la base de données Turso
 * 
 * Usage: node scripts/check-turso.mjs
 */

import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
config({ path: join(__dirname, '..', '.env.local') });

async function checkTurso() {
  const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
  const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

  if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('Vérifiez que TURSO_DATABASE_URL et TURSO_AUTH_TOKEN sont définis dans .env.local');
    process.exit(1);
  }

  console.log('🔗 Connexion à Turso:', TURSO_DATABASE_URL);
  console.log('');

  const db = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  try {
    // Vérifier les tables
    console.log('📊 Vérification des tables...');
    const tables = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);

    if (tables.rows.length === 0) {
      console.log('   ⚠️  Aucune table trouvée!');
      console.log('   💡 Lancez: pnpm run init-turso');
      process.exit(1);
    }

    console.log('   ✓ Tables trouvées:');
    tables.rows.forEach(row => {
      console.log(`     - ${row.name}`);
    });

    // Compter les données
    console.log('');
    console.log('📈 Statistiques:');

    try {
      const users = await db.execute('SELECT COUNT(*) as count FROM users');
      console.log(`   - Users: ${users.rows[0].count}`);
    } catch (e) {
      console.log('   ⚠️  Table users non trouvée');
    }

    try {
      const downloads = await db.execute('SELECT COUNT(*) as count FROM downloads');
      console.log(`   - Downloads: ${downloads.rows[0].count}`);
    } catch (e) {
      console.log('   ⚠️  Table downloads non trouvée');
    }

    try {
      const likes = await db.execute('SELECT COUNT(*) as count FROM likes');
      console.log(`   - Likes: ${likes.rows[0].count}`);
    } catch (e) {
      console.log('   ⚠️  Table likes non trouvée');
    }

    // Vérifier les index
    console.log('');
    console.log('🔍 Index:');
    const indexes = await db.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    if (indexes.rows.length === 0) {
      console.log('   ⚠️  Aucun index trouvé');
    } else {
      indexes.rows.forEach(row => {
        console.log(`   - ${row.name}`);
      });
    }

    console.log('');
    console.log('✅ Base de données opérationnelle!');

    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Erreur lors de la vérification:', error);
    process.exit(1);
  }
}

checkTurso();
