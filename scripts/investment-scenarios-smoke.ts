import assert from 'node:assert/strict';
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { scenarioFixture } from '../src/features/investment-scenarios/reference';
import { versionedSavedInputSchema, versionedRunBodySchema, runBodyV2Schema } from '../src/features/investment-scenarios/versioned';
import { persistedMonthInput } from '../src/tests/fixtures/investment-month';
import { missing } from '../src/features/investment-scenarios/reference';
import type * as comparisonActions from '../src/features/investment-scenarios/comparison.actions';
import type { z } from 'zod';

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
type ActionResult = { ok: boolean; category?: string; fields?: { path: string; message: string }[];
  revision?: { id: number; number: number; fingerprint: string; saved: z.infer<typeof versionedSavedInputSchema> } | null;
  revisions?: { id: number; number: number }[];
  run?: { id: number; revisionNumber?: number; input: z.infer<typeof versionedSavedInputSchema>; report: z.infer<typeof versionedRunBodySchema>['output'] } | null;
  scenarios?: { key: string }[] };
try {
  run(['scripts/migrate.mjs']); run(['--import', 'tsx', 'src/tests/fixtures/smoke-users.ts']);
  const running = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3198'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  server = running;
  let output = ''; running.stdout!.on('data', chunk => { output += chunk; }); running.stderr!.on('data', chunk => { output += chunk; });
  for (let attempt = 0; attempt < 60 && !output.includes('Ready in'); attempt++) { assert.equal(running.exitCode, null, output); await setTimeout(500); }
  assert.ok(output.includes('Ready in'), output);
  const manifest: { node: Record<string, { exportedName: string }> } = JSON.parse(await readFile('.next/server/server-reference-manifest.json', 'utf8'));
  async function invoke(name: string, token: string | null, ...args: (object | string | number | null)[]) {
    const id = Object.entries(manifest.node).find(([, entry]) => entry.exportedName === name)?.[0]; assert.ok(id, `Built action ${name}`);
    const response = await fetch(`${origin}/investment-scenarios`, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=UTF-8', 'Next-Action': id, Origin: origin, ...(token ? { Cookie: `payload-token=${token}` } : {}) }, body: JSON.stringify(args) });
    const text = await response.text(); assert.equal(response.status, 200, text);
    const line = text.split('\n').find(line => /^1:/.test(line)); assert.ok(line, text); return JSON.parse(line.slice(2));
  }
  const action = async (name: string, token: string | null, ...args: (object | string | number | null)[]): Promise<ActionResult> => invoke(name, token, ...args);
  const comparisonAction = async <K extends keyof typeof comparisonActions>(name: K, token: string | null, ...args: Parameters<typeof comparisonActions[K]>): Promise<Awaited<ReturnType<typeof comparisonActions[K]>>> => invoke(name, token, ...args);
  const login = async (role: string) => (await success('users/login', null, 'POST', { email: `${role}@example.invalid`, password })).token as string;
  const admin = await login('administrator'); const editor = await login('editor'); const baker = await login('baker');
  const otherUser = (await success('users', admin, 'POST', { email: 'other@example.invalid', password, role: 'administrator' })).doc;
  assert.ok(otherUser.id);
  let other = (await success('users/login', null, 'POST', { email: 'other@example.invalid', password })).token as string;
  const flour = (await success('ingredients', admin, 'POST', { name: 'Mąka demonstracyjna', kind: 'flour', flourType: 'pszenna' })).doc;
  const publications: number[] = []; const recipes: number[] = [];
  for (const name of ['A', 'B']) {
    const recipe = (await success('recipes', admin, 'POST', { name, audience: 'bakers', yield: 1, standalone: true, description: 'Syntetyczna receptura demonstracyjna', process: [{ instruction: 'Etap 0' }], ingredients: [{ ingredient: flour.id, mass: '500' }], publishNow: true })).doc;
    recipes.push(recipe.id);
    publications.push((await success(`publications?where[recipe][equals]=${recipe.id}`, admin)).docs[0].id);
  }
  const command = { scenarioKey: 'connected-proof', expectedRevision: 0, requestKey: randomUUID(), input: scenarioFixture(publications[0], publications[1]) };
  const saved = await action('saveScenarioAction', admin, command); assert.ok(saved.ok, JSON.stringify(saved) + output); assert.ok(saved.revision);
  assert.equal((await action('saveScenarioAction', admin, command)).revision?.id, saved.revision.id);
  const evaluated = await action('runScenarioAction', admin, { revisionId: saved.revision.id, requestKey: randomUUID() });
  assert.ok(evaluated.ok, JSON.stringify(evaluated)); assert.equal(evaluated.run?.report.economics.operatingRemainder, '56.00'); assert.equal(evaluated.run.report.process.laborMinutes.baker, 30);
  assert.equal(evaluated.run.report.process.operations.find(row => row.id === 'bake-B')?.waitingMinutes, 15);
  assert.equal(evaluated.run.report.process.operations.find(row => row.id === 'bake-B')?.end, new Date('2026-11-25T06:50:00+01:00').toISOString());
  const reopened = await action('loadWorkspaceAction', admin, 'connected-proof');
  assert.ok(reopened.ok); assert.deepEqual(reopened.revision, saved.revision);
  assert.deepEqual(reopened.revision.saved.input, command.input);
  assert.deepEqual(reopened.revision.saved.publications.map(source => source.publicationId), publications);
  assert.deepEqual(reopened.revision.saved.publications.map(source => source.versionKey), recipes.map(id => `${id}:1`));
  assert.deepEqual(reopened.run, { ...evaluated.run, revisionNumber: 1 });
  assert.deepEqual(reopened.run!.input, saved.revision.saved);
  const invalidInput = structuredClone(command.input); invalidInput.operations[2].step = 999;
  const invalidStep = await action('saveScenarioAction', admin, { ...command, expectedRevision: 1, requestKey: randomUUID(), input: invalidInput });
  assert.equal(invalidStep.ok, false); assert.equal(invalidStep.category, 'validation');
  assert.deepEqual(invalidStep.fields, [{ path: 'input.operations.2.step', message: 'Nieznany etap publikacji.' }]);
  assert.deepEqual((await action('loadWorkspaceAction', admin, 'connected-proof')).revisions, [{ id: saved.revision.id, number: 1 }]);
  await success(`recipes/${recipes[0]}`, admin, 'PATCH', { name: 'A v2', publishNow: true });
  const publicationV2 = (await success(`publications?where[recipe][equals]=${recipes[0]}&sort=-version`, admin)).docs[0];
  const inputV2 = scenarioFixture(publicationV2.id, publications[1]); inputV2.name = 'Zmieniony wariant v2';
  const savedV2 = await action('saveScenarioAction', admin, { ...command, expectedRevision: 1, requestKey: randomUUID(), input: inputV2 });
  assert.ok(savedV2.ok); assert.ok(savedV2.revision); assert.equal(savedV2.revision.number, 2);
  const runV2 = await action('runScenarioAction', admin, { revisionId: savedV2.revision.id, requestKey: randomUUID() }); assert.ok(runV2.ok);
  const latest = await action('loadWorkspaceAction', admin, 'connected-proof');
  assert.deepEqual(latest.revision, savedV2.revision); assert.deepEqual(latest.run, { ...runV2.run, revisionNumber: 2 });
  assert.equal(latest.revision.saved.publications[0].versionKey, `${recipes[0]}:2`);
  const historical = await action('loadWorkspaceAction', admin, 'connected-proof', saved.revision.id);
  assert.ok(historical.ok); assert.deepEqual(historical.revision, reopened.revision); assert.deepEqual(historical.run, reopened.run);
  assert.notEqual(historical.run!.id, runV2.run!.id);
  const alternate = await action('saveScenarioAction', admin, { ...command, scenarioKey: 'other-scenario', requestKey: randomUUID() }); assert.ok(alternate.revision);
  assert.equal((await action('loadWorkspaceAction', admin, 'connected-proof', alternate.revision.id)).category, 'denied');
  assert.equal((await action('loadWorkspaceAction', other, 'connected-proof', saved.revision.id)).category, 'denied');
  const ownerId = (await success('users/me', admin)).user.id;
  const attackPassword = randomBytes(24).toString('hex'); const attackEmail = 'takeover@example.invalid';
  for (const credentials of [{ password: attackPassword }, { email: attackEmail }]) {
    assert.ok([403, 404].includes((await rest(`users/${ownerId}`, other, 'PATCH', credentials)).status));
    const bulkResponse = await rest(`users?where[id][equals]=${ownerId}`, other, 'PATCH', credentials);
    assert.equal(bulkResponse.status, 400);
    const bulk = await bulkResponse.json(); assert.equal(bulk.docs.length, 0); assert.equal(bulk.errors.length, 1);
  }
  assert.ok([403, 404].includes((await rest(`users/${ownerId}`, other, 'DELETE')).status));
  const deleted = await rest(`users?where[id][equals]=${ownerId}`, other, 'DELETE');
  const deletedBody = await deleted.json(); assert.equal(deletedBody.docs.length, 0); assert.equal(deletedBody.errors.length, 1);
  assert.equal((await rest('users/login', null, 'POST', { email: 'administrator@example.invalid', password: attackPassword })).ok, false);
  assert.equal((await rest('users/login', null, 'POST', { email: attackEmail, password: attackPassword })).ok, false);
  assert.equal((await success('users/login', null, 'POST', { email: 'administrator@example.invalid', password })).user.id, ownerId);
  assert.equal((await success(`users/${ownerId}`, other)).email, 'administrator@example.invalid');
  const provisioned = (await success('users', admin, 'POST', { email: 'provisioned@example.invalid', password, role: 'baker' })).doc;
  assert.equal((await success(`users/${provisioned.id}`, admin, 'PATCH', { email: provisioned.email, role: 'editor' })).doc.role, 'editor');
  const roles = await success(`users?where[id][equals]=${provisioned.id}`, admin, 'PATCH', { role: 'administrator' }); assert.equal(roles.docs[0].role, 'administrator');
  assert.ok((await rest(`users/${provisioned.id}`, admin, 'DELETE')).ok);
  const selfPassword = randomBytes(24).toString('hex');
  await success(`users/${otherUser.id}`, other, 'PATCH', { email: 'self@example.invalid', password: selfPassword });
  other = (await success('users/login', null, 'POST', { email: 'self@example.invalid', password: selfPassword })).token;
  const selfBulk = await success(`users?where[id][equals]=${otherUser.id}`, other, 'PATCH', { email: 'self-bulk@example.invalid', password }); assert.equal(selfBulk.docs[0].id, otherUser.id);
  other = (await success('users/login', null, 'POST', { email: 'self-bulk@example.invalid', password })).token;
  for (const token of [null, editor, baker, other]) {
    const denied = await action('runScenarioAction', token, { revisionId: saved.revision.id, requestKey: randomUUID() }); assert.equal(denied.ok, false); assert.equal(denied.category, 'denied');
    const response = await rest(`scenario-revisions/${saved.revision.id}?depth=5`, token); assert.ok([403, 404].includes(response.status)); assert.ok(!(await response.text()).includes('Przykład A20'));
    assert.ok([403, 404].includes((await rest(`scenario-runs/${evaluated.run!.id}`, token)).status));
    assert.equal((await rest('scenario-revisions', token, 'POST', { ...command, owner: otherUser.id, revision: 99, body: {} })).status, 403);
  }
  assert.equal((await rest(`scenario-revisions/${saved.revision.id}`, admin, 'PATCH', { revision: 99 })).status, 403);
  assert.equal((await rest('scenario-runs', admin, 'POST', { owner: otherUser.id, output: { profit: 999 } })).status, 403);
  const forged = await action('saveScenarioAction', admin, { ...command, owner: otherUser.id, requestKey: randomUUID() }); assert.equal(forged.ok, false); assert.equal(forged.category, 'validation');
  // AE3–AE5: the server resolves real publications and recomputes both saved variants.
  const operationalPaths = ['ingredients', 'recipes', 'publications'];
  const operationalBefore = await Promise.all(operationalPaths.map(path => success(`${path}?depth=0&limit=0&sort=id`, admin)));
  const completeInput = persistedMonthInput(publications[0], flour.id);
  completeInput.name = 'MVP-2 kompletny miesiąc';
  const incompleteInput = structuredClone(completeInput);
  incompleteInput.name = 'MVP-2 brak najmu';
  incompleteInput.month!.fixedCosts[0].amount = missing('PLN', 'Brak najmu');
  const pair = [];
  for (const [index, input] of [completeInput, incompleteInput].entries()) {
    const scenarioKey = `mvp-two-${index}`;
    const saveCommand = { scenarioKey, expectedRevision: 0, requestKey: randomUUID(), input };
    const savedMonth = await action('saveScenarioAction', admin, saveCommand);
    assert.ok(savedMonth.ok, JSON.stringify(savedMonth)); assert.ok(savedMonth.revision);
    assert.deepEqual((await action('saveScenarioAction', admin, saveCommand)).revision, savedMonth.revision);
    const reopenedMonth = await action('loadWorkspaceAction', admin, scenarioKey);
    assert.deepEqual(reopenedMonth.revision, savedMonth.revision);
    assert.deepEqual(reopenedMonth.revision?.saved.input, input);
    const runCommand = { revisionId: savedMonth.revision.id, requestKey: randomUUID() };
    const computed = await comparisonAction('prepareComparisonAction', admin, runCommand);
    assert.ok(computed.ok, JSON.stringify(computed));
    assert.deepEqual(await comparisonAction('prepareComparisonAction', admin, runCommand), computed);
    const body = runBodyV2Schema.parse(computed.run.body);
    assert.ok(body.output.investment);
    assert.equal(body.output.monthly?.recurringCash.value, index === 0 ? '2000.00' : null);
    assert.equal(body.output.investment.outlay.value, '120000.00');
    assert.equal(body.output.investment.payback.status, index === 0 ? 'calculated' : 'unverified');
    assert.equal(body.output.investment.payback.months, index === 0 ? '60.00' : null);
    assert.equal(body.output.monthly?.salesDays, 22);
    const loaded = await action('loadWorkspaceAction', admin, scenarioKey, savedMonth.revision.id);
    assert.deepEqual(loaded.run, { id: computed.run.runId, revisionNumber: 1, input: body.input, report: body.output });
    pair.push(computed.run);
  }
  assert.deepEqual(pair[0].body.output.process, pair[1].body.output.process, 'missing rent preserves chronology');
  const compareCommand = { comparisonKey: randomUUID(), requestKey: randomUUID(), runIds: pair.map(row => row.runId) };
  const comparison = await comparisonAction('saveComparisonAction', admin, compareCommand);
  assert.ok(comparison.ok, JSON.stringify(comparison));
  assert.deepEqual(await comparisonAction('saveComparisonAction', admin, compareCommand), comparison);
  const conflict = await comparisonAction('saveComparisonAction', admin, { ...compareCommand, runIds: [...compareCommand.runIds].reverse() });
  assert.ok(!conflict.ok); assert.equal(conflict.category, 'conflict');
  const pinned = await comparisonAction('loadComparisonAction', admin, comparison.comparisonKey);
  assert.ok(pinned.ok, JSON.stringify(pinned));
  assert.deepEqual(pinned.comparison.runs, pair);
  assert.deepEqual(pinned.comparison.manifest.selections.map(row => row.runId), compareCommand.runIds);
  const newer = await action('saveScenarioAction', admin, { scenarioKey: 'mvp-two-0', expectedRevision: 1, requestKey: randomUUID(), input: { ...completeInput, name: 'Nowa wersja poza porównaniem' } });
  assert.ok(newer.ok); assert.ok(newer.revision);
  assert.ok((await action('runScenarioAction', admin, { revisionId: newer.revision.id, requestKey: randomUUID() })).ok);
  assert.deepEqual(await comparisonAction('loadComparisonAction', admin, comparison.comparisonKey), pinned);
  const manifests = await success(`scenario-comparisons?where[comparisonKey][equals]=${comparison.comparisonKey}&depth=0`, admin);
  assert.equal(manifests.docs.length, 1);
  const manifestId = manifests.docs[0].id;
  for (const token of [other, editor, baker, null]) {
    for (const denied of [
      await comparisonAction('loadComparisonAction', token, comparison.comparisonKey),
      await comparisonAction('saveComparisonAction', token, { ...compareCommand, requestKey: randomUUID() }),
      await comparisonAction('prepareComparisonAction', token, { revisionId: pair[0].revisionId, requestKey: randomUUID() }),
    ]) { assert.ok(!denied.ok); assert.equal(denied.category, 'denied'); }
    for (const path of [`scenario-comparisons/${manifestId}?depth=5`, `scenario-runs/${pair[0].runId}?depth=5`, `scenario-revisions/${pair[0].revisionId}?depth=5`]) {
      const response = await rest(path, token); assert.ok([403, 404].includes(response.status));
      const text = await response.text(); assert.ok(!text.includes(completeInput.name)); assert.ok(!text.includes(pair[0].fingerprint));
    }
    const listing = await rest('scenario-comparisons?depth=5', token);
    if (token === other) { assert.equal(listing.status, 200); assert.equal((await listing.json()).docs.length, 0); }
    else assert.ok([403, 404].includes(listing.status));
  }
  for (const token of [admin, other, editor, baker, null]) {
    assert.equal((await rest('scenario-comparisons', token, 'POST', { owner: ownerId, ...compareCommand, runs: compareCommand.runIds, schemaVersion: 1, fingerprint: pinned.comparison.fingerprint, manifest: pinned.comparison.manifest, context: { scenarioAppend: '5ciastek.scenario-service-append' } })).status, 403);
  }
  const forgedManifestCommand = { ...compareCommand, requestKey: randomUUID(), owner: otherUser.id, manifest: pinned.comparison.manifest };
  const forgedManifest = await comparisonAction('saveComparisonAction', admin, forgedManifestCommand);
  assert.ok(!forgedManifest.ok);
  assert.deepEqual(await comparisonAction('loadComparisonAction', admin, comparison.comparisonKey), pinned);
  assert.deepEqual(await Promise.all(operationalPaths.map(path => success(`${path}?depth=0&limit=0&sort=id`, admin))), operationalBefore);
  assert.deepEqual((await action('loadWorkspaceAction', admin, 'connected-proof', saved.revision.id)).run, reopened.run, 'MVP-1 history is unchanged');
  const comparisonUrl = `${origin}/investment-scenarios/comparisons/${comparison.comparisonKey}`;
  assert.equal((await fetch(`${origin}/investment-scenarios/connected-proof`)).status, 200);
  console.log('PASS: built v1/v2 save/reopen/recompute, qualified 120000/2000=60, missing-rent comparison, pinned reads/retries, action/REST isolation and forged-write refusal.');
  if (browser) {
    console.log(`BROWSER_READY ${origin} ${directory}\nCOMPARISON_URL ${comparisonUrl}`);
    if (process.env.SMOKE_PASSWORD) console.log(`LOCAL_SYNTHETIC_LOGIN administrator@example.invalid ${process.env.SMOKE_PASSWORD}`);
    else console.log('No caller SMOKE_PASSWORD supplied; generated credentials are not printed. Restart with an explicit synthetic SMOKE_PASSWORD for browser login.');
    await new Promise<void>(resolve => { process.once('SIGTERM', resolve); process.once('SIGINT', resolve); });
  }
} finally {
  if (server && server.exitCode === null) { server.kill('SIGTERM'); await new Promise<void>(resolve => server!.once('exit', () => resolve())); }
  await rm(directory, { recursive: true, force: true });
}
