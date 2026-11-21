import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const pasta = fileURLToPath(new URL('./mensagens', import.meta.url));
const pad = (n) => String(n).padStart(2, '0');

const carimbo = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;

export function salvarMensagemEmArquivo({ id, name, email, message }, dir = pasta) {
  const agora = new Date();
  mkdirSync(dir, { recursive: true });
  const arquivo = `${dir}/${carimbo(agora)}_${id}.txt`;
  const texto = [
    `Nome: ${name}`,
    `E-mail: ${email}`,
    `Data: ${agora.toLocaleString('pt-BR')}`,
    '',
    'Mensagem:',
    message,
    '',
  ].join('\n');
  writeFileSync(arquivo, texto, 'utf8');
  return arquivo;
}