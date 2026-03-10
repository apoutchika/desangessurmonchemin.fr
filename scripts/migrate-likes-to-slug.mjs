#!/usr/bin/env node
/**
 * Script de migration : day_id → page_slug dans la table likes
 * 
 * Ce script migre les likes existants de l'ancien système (day_id numérique)
 * vers le nouveau système (page_slug string).
 * 
 * ATTENTION : Ce script nécessite un mapping jour → slug
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Mapping day_id → slug (à adapter selon vos données)
// Exemple : jour 1 → "jour-1-lyon-thurins"
const DAY_TO_SLUG_MAP = {
  // Remplir avec votre mapping réel
  // 1: "jour-1-lyon-thurins",
  // 2: "jour-2-thurins-yzeron",
  // ...
};

async function migrateLikes() {
  console.log('🔄 Migration des likes : day_id → page_slug\n');

  try {
    // 1. Vérifier si la nouvelle colonne existe
    const tableInfo = await db.execute("PRAGMA table_info(likes)");
    const hasPageSlug = tableInfo.rows.some(row => row.name === 'page_slug');
    const hasDayId = tableInfo.rows.some(row => row.name === 'day_id');

    if (hasPageSlug && !hasDayId) {
      console.log('✅ La migration a déjà été effectuée');
      return;
    }

    if (!hasDayId) {
      console.log('❌ Erreur : colonne day_id introuvable');
      return;
    }

    // 2. Créer la nouvelle table avec page_slug
    console.log('📝 Création de la nouvelle table likes_new...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS likes_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        page_slug TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        UNIQUE(page_slug, user_id)
      )
    `);

    // 3. Migrer les données (si vous avez un mapping)
    if (Object.keys(DAY_TO_SLUG_MAP).length > 0) {
      console.log('📦 Migration des données existantes...');
      
      const oldLikes = await db.execute('SELECT * FROM likes');
      let migrated = 0;
      let skipped = 0;

      for (const like of oldLikes.rows) {
        const dayId = like.day_id;
        const slug = DAY_TO_SLUG_MAP[dayId];

        if (slug) {
          try {
            await db.execute({
              sql: 'INSERT INTO likes_new (user_id, page_slug, timestamp) VALUES (?, ?, ?)',
              args: [like.user_id, slug, like.timestamp],
            });
            migrated++;
          } catch (e) {
            // Ignorer les doublons
            skipped++;
          }
        } else {
          console.log(`⚠️  Pas de slug pour day_id=${dayId}`);
          skipped++;
        }
      }

      console.log(`✅ ${migrated} likes migrés, ${skipped} ignorés`);
    } else {
      console.log('⚠️  Aucun mapping fourni, table vide créée');
    }

    // 4. Remplacer l'ancienne table
    console.log('🔄 Remplacement de l\'ancienne table...');
    await db.execute('DROP TABLE likes');
    await db.execute('ALTER TABLE likes_new RENAME TO likes');

    // 5. Recréer les index
    console.log('📊 Création des index...');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_page ON likes(page_slug)');
    await db.execute('CREATE INDEX IF NOT EXISTS idx_likes_user ON likes(user_id)');

    console.log('\n✅ Migration terminée avec succès !');
    console.log('\n⚠️  N\'oubliez pas de :');
    console.log('   1. Vérifier que les likes fonctionnent');
    console.log('   2. Tester sur quelques pages');
    console.log('   3. Vider le cache si nécessaire');

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    process.exit(1);
  }
}

// Exécuter la migration
migrateLikes()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
