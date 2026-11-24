import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const patterns = [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /\bAKIA[0-9A-Z]{16}\b/, /\bgh[pousr]_[A-Za-z0-9]{36,}\b/];
const failures = [];
for (const file of files) {
  let content;
  try { content = readFileSync(file, 'utf8'); } catch { continue; }
  if (patterns.some(pattern => pattern.test(content))) failures.push(file);
}
if (failures.length) throw new Error(`Possible secrets in tracked files: ${failures.join(', ')}`);
console.log(`Secret pattern scan passed for ${files.length} tracked paths (limited pattern scan, not an exhaustive secret audit).`);
