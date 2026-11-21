import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';

try {
  const db = new Database(fileURLToPath(new URL('./data/4tech.db', import.meta.url)), {
    readonly: true,
    fileMustExist: true,
  });
  const rows = db.prepare('SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC').all();
  if (rows.length === 0) console.log('Nenhuma mensagem recebida ainda.');
  else console.table(rows);
} catch {
  console.log('Banco ainda nao existe. Rode "npm start" primeiro.');
}
