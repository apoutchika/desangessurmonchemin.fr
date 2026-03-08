/**
 * Script de vérification de la configuration
 * Vérifie que toutes les variables d'environnement sont définies
 * 
 * Usage: node scripts/check-config.js
 */

require('dotenv').config({ path: '.env.local' });

const requiredVars = [
  'MAILJET_API_KEY',
  'MAILJET_SECRET_KEY',
  'MAILJET_SENDER_EMAIL',
  'CONTACT_EMAIL',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'IP_SALT',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
];

const optionalVars = [
  'NEXT_PUBLIC_GA_ID',
];

console.log('🔍 Vérification de la configuration...\n');

let hasErrors = false;
let hasWarnings = false;

// Vérifier les variables requises
console.log('📋 Variables requises :');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`   ❌ ${varName} : manquante`);
    hasErrors = true;
  } else {
    // Masquer les valeurs sensibles
    const displayValue = value.length > 20 
      ? value.substring(0, 10) + '...' + value.substring(value.length - 5)
      : value.substring(0, 5) + '...';
    console.log(`   ✅ ${varName} : ${displayValue}`);
  }
});

// Vérifier les variables optionnelles
console.log('\n📋 Variables optionnelles :');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`   ⚠️  ${varName} : manquante (Google Analytics ne fonctionnera pas)`);
    hasWarnings = true;
  } else {
    console.log(`   ✅ ${varName} : ${value}`);
  }
});

// Vérifier les fichiers
console.log('\n📁 Fichiers requis :');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'public/downloads/pelerinage.epub',
  'public/downloads/pelerinage.pdf',
];

requiredFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`   ✅ ${filePath} (${sizeMB} MB)`);
  } else {
    console.log(`   ❌ ${filePath} : manquant`);
    hasErrors = true;
  }
});

// Vérifier la base de données
console.log('\n💾 Base de données :');
const dbPath = path.join(process.cwd(), 'data', 'stats.db');
if (fs.existsSync(dbPath)) {
  const stats = fs.statSync(dbPath);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`   ✅ data/stats.db existe (${sizeKB} KB)`);
  
  // Vérifier la structure
  try {
    const Database = require('better-sqlite3');
    const db = new Database(dbPath);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    
    if (tableNames.includes('users')) {
      console.log(`   ✅ Structure moderne détectée (table users)`);
    } else {
      console.log(`   ⚠️  Ancienne structure détectée. Exécuter: node scripts/migrate-db.js`);
      hasWarnings = true;
    }
    
    db.close();
  } catch (error) {
    console.log(`   ⚠️  Impossible de vérifier la structure : ${error.message}`);
  }
} else {
  console.log(`   ℹ️  data/stats.db n'existe pas encore (sera créée au premier démarrage)`);
}

// Résumé
console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('❌ Configuration incomplète. Corriger les erreurs ci-dessus.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Configuration OK avec avertissements.');
  process.exit(0);
} else {
  console.log('✅ Configuration complète ! Prêt pour le déploiement.');
  process.exit(0);
}
