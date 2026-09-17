import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { findPhp } from './php-runtime.mjs';

const result = spawnSync(await findPhp(), ['server/bin/import-institutional.php', resolve('src/data/institutional.json')], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
