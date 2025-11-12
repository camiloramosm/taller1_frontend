/**
 * Script para configurar automáticamente las tablas de Supabase
 * Ejecuta: node scripts/setup-database.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las credenciales de Supabase en .env.local');
  console.error('Asegúrate de tener:');
  console.error('  VITE_SUPABASE_URL=...');
  console.error('  VITE_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Leer el SQL del archivo
const sqlPath = path.join(__dirname, '..', 'setup-supabase.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

console.log('🚀 Configurando base de datos de Supabase...\n');

// Como la clave anon no tiene permisos para ejecutar DDL,
// mostramos instrucciones claras
console.log('⚠️  IMPORTANTE: El script SQL debe ejecutarse manualmente en Supabase');
console.log('   debido a restricciones de seguridad (solo admin puede crear tablas).\n');

console.log('📋 INSTRUCCIONES:');
console.log('1. Abre este enlace en tu navegador:');
console.log(`   https://supabase.com/dashboard/project/vtvnafaqofqnxhulneoy/sql/new\n`);
console.log('2. Copia el contenido del archivo: setup-supabase.sql');
console.log('3. Pégalo en el SQL Editor');
console.log('4. Haz clic en "Run"\n');

console.log('✅ Verificando conexión a Supabase...');

// Verificar conexión
async function verificarConexion() {
  try {
    // Intentar una consulta simple para verificar conexión
    const { data, error } = await supabase
      .from('pedidos')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('⚠️  La tabla "pedidos" no existe todavía.');
        console.log('   Debes ejecutar el SQL manualmente (ver instrucciones arriba).\n');
        return false;
      }
      throw error;
    }
    
    console.log('✅ ¡Conexión exitosa! Las tablas ya existen.\n');
    return true;
  } catch (err) {
    console.error('❌ Error al conectar:', err.message);
    return false;
  }
}

verificarConexion().then((tablesExist) => {
  if (tablesExist) {
    console.log('🎉 Todo está configurado correctamente!');
    console.log('   Puedes iniciar el servidor: npm run dev\n');
  } else {
    console.log('📝 Después de ejecutar el SQL:');
    console.log('   1. Ejecuta este script de nuevo para verificar');
    console.log('   2. O simplemente inicia el servidor: npm run dev\n');
  }
});


