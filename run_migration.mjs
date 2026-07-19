import mysql2 from 'mysql2/promise';
import { readFileSync } from 'fs';

const sql = readFileSync('./drizzle/0002_access_codes.sql', 'utf8');
const rawStatements = sql.split(';');
const statements = rawStatements
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

const conn = await mysql2.createConnection(process.env.DATABASE_URL);

for (const stmt of statements) {
  if (stmt.trim()) {
    try {
      await conn.execute(stmt);
      console.log('OK:', stmt.substring(0, 70).replace(/\n/g, ' '));
    } catch(e) {
      console.log('SKIP:', e.message.substring(0, 100));
    }
  }
}

await conn.end();
console.log('Migration complete');
