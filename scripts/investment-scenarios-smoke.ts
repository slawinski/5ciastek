import assert from 'node:assert/strict';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { scenarioFixture } from '../src/features/investment-scenarios/reference';

const directory = await mkdtemp(join(tmpdir(), '5ciastek-production-smoke-'));
const target = `file:${join(directory, 'smoke.db')}`;
const browser = process.env.SCENARIO_BROWSER === '1';
const password = browser && process.env.SMOKE_PASSWORD ? process.env.SMOKE_PASSWORD : randomBytes(24).toString('hex');
const env: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: 'production', DATABASE_URI: target, CONFIRM_DATABASE_URI: target, PAYLOAD_SECRET: randomBytes(32).toString('hex'), SMOKE_PASSWORD: password };
const origin = 'http://127.0.0.1:3198';
let server: ChildProcess | undefined;
const run = (args: string[]) => { const result = spawnSync(process.execPath, args, { env, encoding: 'utf8' }); assert.equal(result.status, 0, result.stdout + result.stderr); };
async function rest(path: string, token: string | null = null, method = 'GET', data?: object) {
  return fetch(`${origin}/api/${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}) });
}
async function success(path: string, token: string | null = null, method = 'GET', data?: object) {
  const response = await rest(path, token, method, data); assert.ok(response.ok, `${method} ${path}: ${response.status} ${await response.clone().text()}`); return response.json();
}
type ActionResult = { ok: boolean; category?: string; revision?: { id: number; number: number }; run?: { id: number; report: { economics: { operatingRemainder: string }; process: { laborMinutes: { baker: number } } } }; scenarios?: { key: string }[] };
try {
  run(['scripts/migrate.mjs']); run(['--import', 'tsx', 'src/tests/fixtures/smoke-users.ts']);
  const running = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3198'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  server = running;
  let output = ''; running.stdout!.on('data', chunk => { output += chunk; }); running.stderr!.on('data', chunk => { output += chunk; });
  for (let attempt = 0; attempt < 60 && !output.includes('Ready in'); attempt++) { assert.equal(running.exitCode, null, output); await setTimeout(500); }
  assert.ok(output.includes('Ready in'), output);
  const manifest: { node: Record<string, { exportedName: string }> } = JSON.parse(await readFile('.next/server/server-reference-manifest.json', 'utf8'));
  async function action(name: string, token: string | null, argument: object | string | null): Promise<ActionResult> {
    const id = Object.entries(manifest.node).find(([, entry]) => entry.exportedName === name)?.[0]; assert.ok(id, `Built action ${name}`);
    const response = await fetch(`${origin}/investment-scenarios`, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Next-Action': id, Origin: origin, ...(token ? { Cookie: `payload-token=${token}` } : {}) }, body: JSON.stringify([argument]) });
    const text = await response.text(); assert.equal(response.status, 200, text);
    const line = text.split('\n').find(line => /^1:/.test(line)); assert.ok(line, text); return JSON.parse(line.slice(2));
  }
  const login = async (role: string) => (await success('users/login', null, 'POST', { email: `${role}@example.invalid`, password })).token as string;
  const admin = await login('administrator'); const editor = await login('editor'); const baker = await login('baker');
  const otherUser = (await success('users', admin, 'POST', { email: 'other@example.invalid', password, role: 'administrator' })).doc;
  assert.ok(otherUser.id);
  const other = (await success('users/login', null, 'POST', { email: 'other@example.invalid', password })).token as string;
  const flour = (await success('ingredients', admin, 'POST', { name: 'Mąka demonstracyjna', kind: 'flour', flourType: 'pszenna' })).doc;
  const publications: number[] = [];
  for (const name of ['A', 'B']) {
    const recipe = (await success('recipes', admin, 'POST', { name, audience: 'bakers', yield: 1, standalone: true, description: 'Syntetyczna receptura demonstracyjna', process: [{ instruction: 'Etap 0' }], ingredients: [{ ingredient: flour.id, mass: '500' }], publishNow: true })).doc;
    publications.push((await success(`publications?where[recipe][equals]=${recipe.id}`, admin)).docs[0].id);
  }
  const command = { scenarioKey: 'connected-proof', expectedRevision: 0, requestKey: randomUUID(), input: scenarioFixture(publications[0], publications[1]) };
  const saved = await action('saveScenarioAction', admin, command); assert.ok(saved.ok, JSON.stringify(saved) + output); assert.ok(saved.revision);
  assert.equal((await action('saveScenarioAction', admin, command)).revision?.id, saved.revision.id);
  const evaluated = await action('runScenarioAction', admin, { revisionId: saved.revision.id, requestKey: randomUUID() });
  assert.ok(evaluated.ok, JSON.stringify(evaluated)); assert.equal(evaluated.run?.report.economics.operatingRemainder, '56.00'); assert.equal(evaluated.run.report.process.laborMinutes.baker, 30);
  assert.ok((await action('loadWorkspaceAction', admin, 'connected-proof')).ok);
  for (const token of [null, editor, baker, other]) {
    const denied = await action('runScenarioAction', token, { revisionId: saved.revision.id, requestKey: randomUUID() }); assert.equal(denied.ok, false); assert.equal(denied.category, 'denied');
    const response = await rest(`scenario-revisions/${saved.revision.id}?depth=5`, token); assert.ok([403, 404].includes(response.status)); assert.ok(!(await response.text()).includes('Przykład A20'));
    assert.ok([403, 404].includes((await rest(`scenario-runs/${evaluated.run!.id}`, token)).status));
    assert.equal((await rest('scenario-revisions', token, 'POST', { ...command, owner: otherUser.id, revision: 99, body: {} })).status, 403);
  }
  assert.equal((await rest(`scenario-revisions/${saved.revision.id}`, admin, 'PATCH', { revision: 99 })).status, 403);
  assert.equal((await rest('scenario-runs', admin, 'POST', { owner: otherUser.id, output: { profit: 999 } })).status, 403);
  const forged = await action('saveScenarioAction', admin, { ...command, owner: otherUser.id, requestKey: randomUUID() }); assert.equal(forged.ok, false); assert.equal(forged.category, 'validation');
  assert.equal((await fetch(`${origin}/investment-scenarios/connected-proof`)).status, 200);
  console.log('PASS: built scenario save/reopen/run actions, reference chronology/finance, retries, ownership-filtered REST and forged-write refusal.');
  if (browser) {
    console.log(`BROWSER_READY ${origin} ${directory}`);
    await new Promise<void>(resolve => { process.once('SIGTERM', resolve); process.once('SIGINT', resolve); });
  }
} finally {
  if (server && server.exitCode === null) { server.kill('SIGTERM'); await new Promise<void>(resolve => server!.once('exit', () => resolve())); }
  await rm(directory, { recursive: true, force: true });
}
