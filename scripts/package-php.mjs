import { cp, mkdir, readFile, writeFile, rm, lstat } from 'node:fs/promises';
import { resolve, dirname, basename } from 'node:path';

// Rebuild only the generated package. Uploaded media and private content are not copied.
const directory = resolve('dist-php');
await readFile('vendor/autoload.php');
if ((await lstat(directory).catch(() => null))?.isSymbolicLink()) throw Error('dist-php no puede ser un enlace simbólico.');
await mkdir(directory, { recursive: true });
for (const name of ['public', 'app']) {
  const target = resolve(directory, name);
  if (dirname(target) !== directory || dirname(directory) !== process.cwd()) throw Error('Destino de compilación fuera del proyecto.');
  await rm(target, { recursive: true, force: true });
}
await cp('dist', resolve(directory, 'public'), { recursive: true });
await cp('server', resolve(directory, 'app'), { recursive: true, filter: (source) => basename(source) !== 'config.local.php' });
await cp('vendor', resolve(directory, 'app/vendor'), { recursive: true });
await cp('composer.json', resolve(directory, 'composer.json'));
await cp('composer.lock', resolve(directory, 'composer.lock'));
await cp('server/admin-assets', resolve(directory, 'public/admin-assets'), { recursive: true });
await writeFile(resolve(directory, 'public/index.php'), '<?php\ndeclare(strict_types=1);\nif (!getenv(\'APAG_PUBLIC_DIR\')) putenv(\'APAG_PUBLIC_DIR=\' . __DIR__);\nrequire dirname(__DIR__) . \'/app/bootstrap.php\';\ncms_handle_request();\n');
await cp('server/apache.htaccess', resolve(directory, 'public/.htaccess'));
await writeFile(resolve(directory, 'LEEME.txt'), await readFile('docs/ADMIN.md', 'utf8'));
await cp('guia_deploy.md', resolve(directory, 'guia_deploy.md'));
await mkdir(resolve(directory, 'docs'), { recursive: true });
for (const name of ['ADMIN.md', 'CONTACT_FORM.md', 'SEO_ACCESSIBILITY.md', 'PREDEPLOY_REVIEW.md', 'ROADMAP_STATUS.md']) {
  await cp(resolve('docs', name), resolve(directory, 'docs', name));
}
console.log('Paquete PHP generado en dist-php/. La raíz pública del hosting debe ser dist-php/public/.');
