import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { createClient } from '@libsql/client';

// This smoke owns its fresh target and never accepts an operator's database or credentials.
const directory = await mkdtemp(join(tmpdir(), '5ciastek-production-smoke-'));
const target = `file:${join(directory, 'smoke.db')}`;
const env = { ...process.env, NODE_ENV: 'production', DATABASE_URI: target, CONFIRM_DATABASE_URI: target, PAYLOAD_SECRET: randomBytes(32).toString('hex'), SMOKE_PASSWORD: randomBytes(24).toString('hex') };
const origin = 'http://127.0.0.1:3199';
let server;
const run = args => {
  const result = spawnSync(process.execPath, args, { env, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
};
async function request(path, token, method = 'GET', data) {
  return fetch(`${origin}/api/${path}`, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `JWT ${token}` } : {}) }, ...(data ? { body: JSON.stringify(data) } : {}) });
}
async function success(path, token, method, data) {
  const response = await request(path, token, method, data);
  assert.ok(response.ok, `${method ?? 'GET'} ${path}: ${response.status}`);
  return response.json();
}
try {
  run(['scripts/migrate.mjs']);
  run(['--import', 'tsx', 'src/tests/fixtures/smoke-users.ts']);
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3199'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  server.stdout.on('data', chunk => { output += chunk; });
  server.stderr.on('data', chunk => { output += chunk; });
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(`Production server exited: ${output}`);
    // Do not send credentials or writes to a pre-existing service on this port.
    if (output.includes('Ready in')) break;
    await setTimeout(500);
  }
  assert.ok(output.includes('Ready in'), 'Owned production server did not become ready');
  assert.equal(server.exitCode, null, output);
  assert.equal((await fetch(origin)).status, 200);
  assert.equal((await request('publications')).status, 403);
  assert.equal((await request('publications', 'invalid-token')).status, 403);
  const login = async role => (await success('users/login', null, 'POST', { email: `${role}@example.invalid`, password: env.SMOKE_PASSWORD })).token;
  const editor = await login('editor'), baker = await login('baker'), admin = await login('administrator');
  const flour = (await success('ingredients', editor, 'POST', { name: 'Frozen flour', kind: 'flour', flourType: 'A' })).doc;
  const draft = name => ({ name, audience: 'bakers', standalone: true, yield: 3, description: 'Original description', ingredients: [{ ingredient: flour.id, mass: '1.235' }], process: [{ instruction: 'Original process' }] });
  const recipe = (await success('recipes', editor, 'POST', { ...draft('Historical bread'), publishNow: true })).doc;
  const first = (await success('publications?depth=2', baker)).docs[0];
  assert.equal(first.snapshot.name, 'Historical bread');
  assert.equal(first.snapshot.ingredients[0].mass, '1.235');
  assert.equal(first.snapshot.ingredients[0].ingredientId, flour.id);
  assert.equal(first.recipe, recipe.id, 'baker relationship must not populate a private draft');
  await success(`ingredients/${flour.id}`, editor, 'PATCH', { name: 'Changed source' });
  await success(`recipes/${recipe.id}`, editor, 'PATCH', { name: 'PRIVATE DRAFT', description: 'PRIVATE DESCRIPTION', audience: 'editors', publishNow: true });
  const history = await success(`publications/${first.id}?depth=3`, baker);
  assert.deepEqual(history.snapshot, first.snapshot);
  assert.equal(history.recipe, recipe.id);
  assert.ok(!JSON.stringify(history).includes('PRIVATE'));
  const privateVersion = (await success('publications?sort=-id', editor)).docs[0];
  assert.equal(privateVersion.version, 2);
  assert.equal((await request(`publications/${privateVersion.id}`, baker)).status, 404);
  assert.equal((await success('publications', baker)).totalDocs, 1);
  const exported = await success('publications?limit=0&depth=0', baker);
  assert.equal(exported.docs.length, 1);
  assert.deepEqual(exported.docs[0].snapshot, first.snapshot);
  assert.equal(exported.docs[0].snapshot.unit, 'g');
  assert.ok(!JSON.stringify(exported).includes('PRIVATE'));
  const beforeDeniedWrites = await success(`recipes/${recipe.id}`, editor);
  for (const token of [null, baker]) {
    assert.equal((await request('recipes', token, 'POST', draft('Denied'))).status, 403);
    assert.equal((await request(`recipes/${recipe.id}`, token, 'PATCH', { publishNow: true })).status, 403);
    assert.equal((await request(`recipes/${recipe.id}`, token)).status, 403);
  }
  assert.deepEqual(await success(`recipes/${recipe.id}`, editor), beforeDeniedWrites);
  assert.equal((await success('publications', editor)).totalDocs, 2);
  assert.equal((await success('recipes', editor)).totalDocs, 1);
  for (const token of [editor, baker, admin]) assert.equal((await request(`publications/${first.id}`, token, 'PATCH', { version: 99 })).status, 403);
  const escalated = (await success('users/me', baker)).user;
  await success(`users/${escalated.id}`, baker, 'PATCH', { role: 'administrator' });
  assert.equal((await success('users/me', baker)).user.role, 'baker');
  const competing = await Promise.all([1, 2].map(() => request(`recipes/${recipe.id}`, editor, 'PATCH', { publishNow: true })));
  const committed = competing.filter(response => response.ok).length;
  assert.ok(committed > 0, 'a production publication must commit');
  assert.ok(competing.every(response => response.ok || response.status >= 500), 'contention must not become an authorization failure');
  const independent = createClient({ url: target });
  try {
    const rows = (await independent.execute({ sql: 'SELECT publication_number FROM recipes WHERE id = ?', args: [recipe.id] })).rows;
    assert.equal(rows[0].publication_number, 2 + committed);
    const history = (await independent.execute({ sql: 'SELECT version FROM publications WHERE recipe_id = ? ORDER BY version', args: [recipe.id] })).rows;
    assert.deepEqual(history.map(row => row.version), Array.from({ length: 2 + committed }, (_, index) => index + 1));
  } finally { independent.close(); }
  const bulkDrafts = [];
  for (const [index, mass] of ['11.001', '22.002'].entries()) bulkDrafts.push((await success('recipes', editor, 'POST', { ...draft(`Bulk ${index}`), ingredients: [{ ingredient: flour.id, mass }] })).doc);
  const query = new URLSearchParams({ 'where[id][in]': bulkDrafts.map(doc => doc.id).join(','), limit: '2' });
  for (const publishNow of [true, 'true']) {
    const rejected = await request(`recipes?${query}`, editor, 'PATCH', { name: 'Must not write', publishNow });
    assert.equal(rejected.status, 400);
    assert.match(JSON.stringify(await rejected.json()), /Publikuj receptury pojedynczo/);
  }
  const one = new URLSearchParams({ 'where[id][equals]': String(bulkDrafts[0].id), limit: '1' });
  assert.equal((await request(`recipes?${one}`, editor, 'PATCH', { publishNow: true })).status, 400);
  const unchanged = createClient({ url: target });
  try {
    const counters = (await unchanged.execute({ sql: 'SELECT publication_number FROM recipes WHERE id IN (?, ?) ORDER BY id', args: bulkDrafts.map(doc => doc.id) })).rows;
    assert.deepEqual(counters.map(row => row.publication_number), [0, 0]);
    assert.equal((await unchanged.execute({ sql: 'SELECT id FROM publications WHERE recipe_id IN (?, ?)', args: bulkDrafts.map(doc => doc.id) })).rows.length, 0);
  } finally { unchanged.close(); }
  for (const doc of bulkDrafts) assert.deepEqual(await success(`recipes/${doc.id}`, editor), doc);
  const bulk = await success(`recipes?${query}`, editor, 'PATCH', { code: 'draft-only', publishNow: false });
  assert.deepEqual(bulk.errors, []);
  assert.equal(bulk.docs.length, 2);
  for (const [index, doc] of bulkDrafts.entries()) {
    assert.equal((await success(`recipes/${doc.id}`, editor)).code, 'draft-only');
    await success(`recipes/${doc.id}`, editor, 'PATCH', { publishNow: true });
    const publications = await success(`publications?where[recipe][equals]=${doc.id}&depth=0`, editor);
    assert.equal(publications.totalDocs, 1);
    assert.equal(publications.docs[0].snapshot.name, `Bulk ${index}`);
    assert.equal(publications.docs[0].snapshot.totalGrams, ['11.001', '22.002'][index]);
    assert.equal((await success(`recipes/${doc.id}`, editor)).publicationNumber, 1);
  }
  const optional = (await success('recipes', editor, 'POST', { ...draft('Optional portion'), audience: 'editors', yield: 5, portionGrams: '', ingredients: [{ ingredient: flour.id, mass: '4000' }], publishNow: true })).doc;
  for (const data of [{ portionGrams: '800', publishNow: true }, { publishNow: true }, { portionGrams: '', publishNow: true }]) await success(`recipes/${optional.id}`, editor, 'PATCH', data);
  await success(`recipes/${optional.id}`, editor, 'PATCH', { portionGrams: '750' });
  assert.equal((await request(`recipes/${optional.id}`, editor, 'PATCH', { publishNow: true })).status, 400);
  await success(`recipes/${optional.id}`, editor, 'PATCH', { portionGrams: '' });
  const beforeInvalid = await success(`recipes/${optional.id}`, editor);
  for (const portionGrams of [' ', '0', '800.0001', '750']) assert.equal((await request(`recipes/${optional.id}`, editor, 'PATCH', { portionGrams, publishNow: true })).status, 400);
  for (const mass of ['', '0', '1.0001']) assert.equal((await request(`recipes/${optional.id}`, editor, 'PATCH', { portionGrams: '', ingredients: [{ ingredient: flour.id, mass }], publishNow: true })).status, 400);
  assert.deepEqual(await success(`recipes/${optional.id}`, editor), beforeInvalid);
  const optionalVersions = await success(`publications?where[recipe][equals]=${optional.id}&sort=version`, editor);
  assert.deepEqual(optionalVersions.docs.map(doc => doc.snapshot.portionGrams), ['800.000', '800.000', '800.000', '800.000']);
  assert.equal(beforeInvalid.publicationNumber, 4);
  console.log('Production migrated HTTP smoke passed: login, publication/history, exact masses, contention recovery, bulk publication rejection, draft bulk edit, single publication, optional portion and role/privacy denials.');
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
    await new Promise(resolve => server.once('exit', resolve));
  }
  await rm(directory, { recursive: true, force: true });
}
