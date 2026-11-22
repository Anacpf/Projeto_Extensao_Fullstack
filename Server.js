import express from 'express';
import cors from 'cors';
import multer from 'multer';
import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { salvarMensagemEmArquivo } from './arquivos.js';

const dataDir = fileURLToPath(new URL('./data', import.meta.url));
const publicDir = fileURLToPath(new URL('./public', import.meta.url));
mkdirSync(dataDir, { recursive: true });

const db = new Database(`${dataDir}/4tech.db`);
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
  )
`);
const insertMessage = db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)');

const app = express();
app.use(cors({ origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(express.static(publicDir));

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/contact', multer().none(), (req, res) => {
  const { name, email, message } = req.body ?? {};
  const valid =
    [name, email, message].every((v) => typeof v === 'string') &&
    name.trim().length >= 2 && name.length <= 120 &&
    emailRegex.test(email.trim()) && email.length <= 254 &&
    message.trim().length >= 5 && message.length <= 5000;

  if (!valid) return res.status(400).json({ error: 'dados invalidos' });

  const dados = { name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() };
  const { lastInsertRowid } = insertMessage.run(dados.name, dados.email, dados.message);

  try {
    salvarMensagemEmArquivo({ id: lastInsertRowid, ...dados });
  } catch (err) {
    console.error('Nao foi possivel salvar o arquivo da mensagem:', err.message);
  }

  res.status(201).json({ ok: true });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'erro interno' });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
