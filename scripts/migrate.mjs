import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

const target = process.env.DATABASE_URI;
if (!target?.startsWith('file:/') || process.env.CONFIRM_DATABASE_URI !== target) {
  throw new Error('Name and confirm the same absolute file: database target before migration.');
}
const path = resolve(target.slice(5));
if (existsSync(path) && process.env.VERIFIED_BACKUP_PATH == null) throw new Error('Existing database requires an explicitly verified backup path.');
if (process.env.VERIFIED_BACKUP_PATH && (!existsSync(process.env.VERIFIED_BACKUP_PATH) || resolve(process.env.VERIFIED_BACKUP_PATH) === path)) throw new Error('Backup must exist at a separate path.');
const result = spawnSync(process.execPath, ['node_modules/payload/bin.js', 'migrate'], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
process.exit(result.status ?? 1);
