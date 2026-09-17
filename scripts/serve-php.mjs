import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { access } from 'node:fs/promises';
import { findPhp } from './php-runtime.mjs';

await access('dist/index.html');
const php = await findPhp();
const port = process.env.APAG_PHP_PORT ?? '8080';
if (!/^\d{4,5}$/.test(port) || Number(port) > 65535) throw Error('Puerto PHP no válido.');
console.log('Web y panel PHP: http://127.0.0.1:' + port + '/ · panel: /admin');
const child = spawn(php, ['-d', 'upload_max_filesize=10M', '-d', 'post_max_size=12M', '-d', 'memory_limit=256M', '-S', '127.0.0.1:' + port, '-t', 'dist', 'server/router.php'], {
  stdio: 'inherit', env: { ...process.env, APAG_PUBLIC_DIR: resolve('dist'), APAG_BASE_PATH: '' },
});
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 0; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
