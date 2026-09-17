import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

export async function findPhp() {
  if (process.env.APAG_PHP_BIN) return process.env.APAG_PHP_BIN;
  const available = spawnSync('php', ['--version'], { stdio: 'ignore' });
  if (!available.error && available.status === 0) return 'php';
  if (process.platform === 'win32') {
    const directory = 'C:/laragon/bin/php';
    if (existsSync(directory)) {
      for (const name of (await readdir(directory)).sort().reverse()) {
        const executable = join(directory, name, 'php.exe');
        if (existsSync(executable)) return executable;
      }
    }
  }
  throw Error('Instala PHP 8.2+ o configura APAG_PHP_BIN con la ruta al ejecutable.');
}
