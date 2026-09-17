import { createInterface } from 'node:readline/promises';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { findPhp } from './php-runtime.mjs';

if (!process.stdin.isTTY || !process.stdout.isTTY) throw Error('Ejecuta este comando en una terminal interactiva.');
const php = await findPhp();
const replace = process.argv.includes('--reset');
if (replace) console.log('Se reemplazará la cuenta existente y se invalidarán sus sesiones.');
const terminal = createInterface({ input: process.stdin, output: process.stdout });
const username = await terminal.question('Usuario (por ejemplo administrador): ');
terminal.close();

function secret(prompt) {
  process.stdout.write(prompt);
  return new Promise((resolveSecret, reject) => {
    let value = '';
    process.stdin.setEncoding('utf8'); process.stdin.setRawMode(true); process.stdin.resume();
    const finish = () => { process.stdin.off('data', listener); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n'); };
    const listener = (chunk) => {
      for (const character of chunk) {
        if (character === '\u0003') { finish(); reject(Error('Operación cancelada.')); return; }
        if (character === '\r' || character === '\n') { finish(); resolveSecret(value); return; }
        if (character === '\u007f' || character === '\b') { value = [...value].slice(0, -1).join(''); continue; }
        if (character >= ' ') value += character;
      }
    };
    process.stdin.on('data', listener);
  });
}
const password = await secret('Contraseña (no se muestra): ');
const confirmation = await secret('Repite la contraseña: ');
if (password !== confirmation) throw Error('Las contraseñas no coinciden.');
const child = spawn(php, ['server/bin/create-admin.php'], {
  stdio: ['pipe', 'inherit', 'inherit'], env: { ...process.env, APAG_STORAGE_DIR: process.env.APAG_STORAGE_DIR ?? resolve('storage') },
});
child.stdin.end(JSON.stringify({ username, password, replace }));
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
