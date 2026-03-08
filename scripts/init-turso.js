#!/usr/bin/env node

/**
 * Script pour initialiser la base de données Turso
 * Lance ce script une seule fois après avoir créé ta DB Turso
 */

async function initTurso() {
  try {
    const { initDatabase } = await import('../src/lib/db.ts');
    
    console.log('🚀 Initialisation de la base de données Turso...');
    await initDatabase();
    console.log('✅ Tables créées avec succès!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initTurso();
