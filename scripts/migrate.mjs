import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

const target = process.env.DATABASE_URI;
if (!target?.startsWith('file:/') || process.env.CONFIRM_DATABASE_URI !== target) {
  throw new Error('Name and confirm the same absolute file: database target before migration.');
}
const url = new URL(target);
if (url.hostname || target.includes('?') || target.includes('#')) throw new Error('Database target must be a local file URI without authority, query or fragment (localhost is normalized).');
const path = fileURLToPath(url);
if (path.includes('\0')) throw new Error('Database target must not contain a null byte.');
const normalizedTarget = pathToFileURL(path).href;
const backup = process.env.VERIFIED_BACKUP_PATH?.trim();
if (existsSync(path)) {
  if (!backup) throw new Error('Existing database requires an explicitly verified backup path.');
  const targetStat = statSync(path);
  const backupStat = existsSync(backup) ? statSync(backup) : null;
  if (!backupStat?.isFile() || resolve(backup) === path || (targetStat.dev === backupStat.dev && targetStat.ino === backupStat.ino)) {
    throw new Error('Backup must be an existing separate regular file.');
  }
}
const result = spawnSync(process.execPath, ['node_modules/payload/bin.js', 'migrate'], { stdio: 'inherit', env: { ...process.env, DATABASE_URI: normalizedTarget, CONFIRM_DATABASE_URI: normalizedTarget, NODE_ENV: 'production' } });
process.exit(result.status ?? 1);
