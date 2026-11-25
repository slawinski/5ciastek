import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { getPayload } from 'payload';
import { createClient } from '@libsql/client';
import { saveScenario, readScenario, runScenario, readRuns } from '@/features/investment-scenarios/service';
import { scenarioFixture, sourced } from './fixtures/investment-scenarios';
import { savedInputSchema } from '@/features/investment-scenarios/schema';

test('scenario revisions are owned, immutable, idempotent and independently committed', async () => {
  const directory = await mkdtemp(join(tmpdir(), '5ciastek-scenarios-test-'));
  process.env.PAYLOAD_SECRET = randomBytes(32).toString('hex');
  process.env.DATABASE_URI = `file:${join(directory, 'source.db')}`;
  const migrate = spawnSync(process.execPath, ['scripts/migrate.mjs'], { env: { ...process.env, CONFIRM_DATABASE_URI: process.env.DATABASE_URI }, encoding: 'utf8' });
  assert.equal(migrate.status, 0, migrate.stdout + migrate.stderr);
  const payload = await getPayload({ config: (await import('@/payload.config')).default });
  const independent = createClient({ url: process.env.DATABASE_URI });
  let destroyed = false;
  try {
    const admin = await payload.create({ collection: 'users', data: { email: 'owner@example.invalid', password: randomBytes(24).toString('hex'), role: 'administrator' } });
    const other = await payload.create({ collection: 'users', data: { email: 'other@example.invalid', password: randomBytes(24).toString('hex'), role: 'administrator' } });
    const baker = await payload.create({ collection: 'users', data: { email: 'baker@example.invalid', password: randomBytes(24).toString('hex'), role: 'baker' } });
    const flour = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Mąka', kind: 'flour', flourType: 'pszenna' } });
    const publications = [];
    for (const name of ['A', 'B']) {
      const recipe = await payload.create({ collection: 'recipes', user: admin, overrideAccess: false, data: { name, audience: 'bakers', yield: 1, standalone: true, description: name, process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: flour.id, mass: '500' }], publishNow: true } });
      publications.push((await payload.find({ collection: 'publications', user: admin, overrideAccess: false, where: { recipe: { equals: recipe.id } } })).docs[0]);
    }
    const command = { scenarioKey: 'test', expectedRevision: 0, requestKey: randomUUID(), input: scenarioFixture(publications[0].id, publications[1].id) };
    const operationalBefore = {
      users: (await payload.find({ collection: 'users', depth: 0, limit: 0, sort: 'id' })).docs,
      ingredients: (await payload.find({ collection: 'ingredients', depth: 0, limit: 0, sort: 'id' })).docs,
      recipes: (await payload.find({ collection: 'recipes', depth: 0, limit: 0, sort: 'id' })).docs,
      publications: (await payload.find({ collection: 'publications', depth: 0, limit: 0, sort: 'id' })).docs,
    };
    const first = await saveScenario(payload, admin, command);
    assert.equal(first.revision, 1);
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_revisions')).rows[0].n, 1);
    assert.deepEqual(savedInputSchema.parse(first.body).input, command.input);
    const runCommand = { revisionId: first.id, requestKey: randomUUID() };
    const run = await runScenario(payload, admin, runCommand);
    assert.equal((await runScenario(payload, admin, runCommand)).id, run.id);
    const persistedRun = JSON.parse(String((await independent.execute('SELECT body FROM scenario_runs')).rows[0].body));
    assert.equal(persistedRun.output.economics.operatingRemainder, '56.00');
    assert.equal(persistedRun.output.process.laborMinutes.baker, 30);
    assert.equal(persistedRun.output.process.operations.find((operation: { id: string }) => operation.id === 'bake-B').waitingMinutes, 15);
    assert.deepEqual({
      users: (await payload.find({ collection: 'users', depth: 0, limit: 0, sort: 'id' })).docs,
      ingredients: (await payload.find({ collection: 'ingredients', depth: 0, limit: 0, sort: 'id' })).docs,
      recipes: (await payload.find({ collection: 'recipes', depth: 0, limit: 0, sort: 'id' })).docs,
      publications: (await payload.find({ collection: 'publications', depth: 0, limit: 0, sort: 'id' })).docs,
    }, operationalBefore, 'hypothetical save/run changes no available operational collection');
    await payload.update({ collection: 'ingredients', id: flour.id, user: admin, overrideAccess: false, data: { name: 'Nowa nazwa surowca' } });
    const recipeId = typeof publications[0].recipe === 'number' ? publications[0].recipe : publications[0].recipe.id;
    await payload.update({ collection: 'recipes', id: recipeId, user: admin, overrideAccess: false, data: { name: 'A v2', publishNow: true } });
    assert.deepEqual((await readScenario(payload, admin, 'test')).docs[0].body, first.body, 'later publication and ingredient edits cannot rewrite saved v1');
    await assert.rejects(runScenario(payload, other, runCommand));
    await assert.rejects(readRuns(payload, other, first.id));
    const runFailures = payload.collections['scenario-runs'].config.hooks!.afterChange ??= [];
    runFailures.push(() => { throw new Error('Injected run failure'); });
    await assert.rejects(runScenario(payload, admin, { ...runCommand, requestKey: randomUUID() }), /Injected run failure/);
    runFailures.pop();
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_runs')).rows[0].n, 1);
    const blockedRun = { revisionId: first.id, requestKey: randomUUID() };
    const runReader = createClient({ url: process.env.DATABASE_URI });
    await runReader.execute('BEGIN'); await runReader.execute('SELECT id FROM scenario_runs');
    try { await assert.rejects(runScenario(payload, admin, blockedRun), /SQLITE_BUSY/); }
    finally { await runReader.execute('ROLLBACK'); runReader.close(); }
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_runs')).rows[0].n, 1);
    const recoveredRun = await runScenario(payload, admin, blockedRun);
    assert.equal((await runScenario(payload, admin, blockedRun)).id, recoveredRun.id);
    assert.equal((await saveScenario(payload, admin, command)).id, first.id);
    await assert.rejects(saveScenario(payload, admin, { ...command, expectedRevision: 1, requestKey: randomUUID(), input: { ...command.input, products: [{ ...command.input.products[0], publicationId: 999999 }, command.input.products[1]] } }));
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_revisions')).rows[0].n, 1);
    await assert.rejects(saveScenario(payload, admin, { ...command, input: { ...command.input, name: 'Zmiana' } }), /ponowienia/);
    await assert.rejects(saveScenario(payload, baker, { ...command, requestKey: randomUUID() }));
    await assert.rejects(saveScenario(payload, null, command));
    assert.equal((await readScenario(payload, other, 'test')).totalDocs, 0);
    await assert.rejects(payload.findByID({ collection: 'scenario-revisions', id: first.id, user: other, overrideAccess: false }));
    await assert.rejects(payload.create({ collection: 'scenario-revisions', user: admin, overrideAccess: false, data: { owner: admin.id, scenarioKey: 'forged', revision: 1, requestKey: randomUUID(), schemaVersion: 1, fingerprint: 'forged', body: first.body } }));
    await assert.rejects(payload.update({ collection: 'scenario-revisions', id: first.id, user: admin, overrideAccess: false, data: { revision: 99 } }));
    const failures = payload.collections['scenario-revisions'].config.hooks!.afterChange ??= [];
    failures.push(() => { throw new Error('Injected after append'); });
    await assert.rejects(saveScenario(payload, admin, { ...command, expectedRevision: 1, requestKey: randomUUID() }), /Injected/);
    failures.pop();
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_revisions')).rows[0].n, 1);
    const reader = createClient({ url: process.env.DATABASE_URI });
    await reader.execute('BEGIN'); await reader.execute('SELECT id FROM scenario_revisions');
    try { await assert.rejects(saveScenario(payload, admin, { ...command, expectedRevision: 1, requestKey: randomUUID() }), /SQLITE_BUSY/); }
    finally { await reader.execute('ROLLBACK'); reader.close(); }
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_revisions')).rows[0].n, 1);
    const competing = await Promise.allSettled([1, 2].map(() => saveScenario(payload, admin, { ...command, expectedRevision: 1, requestKey: randomUUID() })));
    assert.equal(competing.filter(result => result.status === 'fulfilled').length, 1);
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_revisions')).rows[0].n, 2);
    const third = await saveScenario(payload, admin, { ...command, expectedRevision: 2, requestKey: randomUUID() });
    assert.equal(third.revision, 3);
    assert.equal((await independent.execute('SELECT max(revision) AS n FROM scenario_revisions')).rows[0].n, 3);
    assert.deepEqual((await readRuns(payload, admin, first.id)).docs[0].body, run.body);
    const secondInput = scenarioFixture(publications[0].id, publications[1].id);
    secondInput.products = [{ ...secondInput.products[0], target: 2200 }];
    secondInput.operations = secondInput.operations.filter(operation => operation.productId === 'A').map(operation => ({ ...operation, context: { ...operation.context, batch: { value: '2200', unit: 'piece' } }, demands: operation.demands.map(demand => demand.unit === 'piece' ? { ...demand, amount: sourced('2200', 'piece') } : demand) }));
    secondInput.resources[2].capacity = sourced('2200', 'piece');
    secondInput.lots = [{ ...secondInput.lots[0], quantity: { value: '2200', unit: 'piece' } }];
    secondInput.movements = [{ ...secondInput.movements[0], quantity: { value: '2200', unit: 'piece' } }];
    secondInput.finance.requiredSales = { budget: sourced('24000', 'PLN'), period: 'day', mix: [{ productId: 'A', soldPieces: 1, price: sourced('20', 'PLN/piece'), unitCost: sourced('10', 'PLN/piece'), lossPercent: sourced('0', '%') }] };
    const secondRevision = await saveScenario(payload, admin, { scenarioKey: 'capacity', expectedRevision: 0, requestKey: randomUUID(), input: secondInput });
    const capacityRun = await runScenario(payload, admin, { revisionId: secondRevision.id, requestKey: randomUUID() });
    const capacityBody = capacityRun.body as { output: { economics: { comparison: { A: { ready: string; required: string; deficit: string } }; requiredSales: { revenue: string } } } };
    assert.deepEqual(capacityBody.output.economics.comparison.A, { ready: '2200', required: '2400', deficit: '200' });
    assert.equal(capacityBody.output.economics.requiredSales.revenue, '48000.00');
    const expected = { revisions: (await payload.find({ collection: 'scenario-revisions', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs,
      runs: (await payload.find({ collection: 'scenario-runs', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs };
    await writeFile(join(directory, 'expected.json'), JSON.stringify(expected));
    await payload.destroy(); destroyed = true;
    await copyFile(join(directory, 'source.db'), join(directory, 'restored.db'));
    const restored = spawnSync(process.execPath, ['--import', 'tsx', 'src/tests/fixtures/scenario-restore-readback.ts'], { env: { ...process.env, DATABASE_URI: `file:${join(directory, 'restored.db')}`, SCENARIO_EXPECTED: join(directory, 'expected.json') }, encoding: 'utf8' });
    assert.equal(restored.status, 0, restored.stdout + restored.stderr);
  } finally {
    independent.close(); if (!destroyed) await payload.destroy(); await rm(directory, { recursive: true, force: true });
  }
});
