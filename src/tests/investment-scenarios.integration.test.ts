import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createLocalReq, getPayload } from 'payload';
import { createClient } from '@libsql/client';
import { ZodError } from 'zod';
import { saveScenario, listScenarios, readScenario, readRevision, runScenario, readRuns } from '@/features/investment-scenarios/service';
import { scenarioFixture, sourced } from './fixtures/investment-scenarios';
import { savedInputSchema } from '@/features/investment-scenarios/schema';
import { upgradeScenario } from '@/features/investment-scenarios/upgrade';
import { versionedSavedInputSchema, versionedRunBodySchema, runBodyV2Schema } from '@/features/investment-scenarios/versioned';
import { prepareComparisonRun, readComparison, saveComparison } from '@/features/investment-scenarios/comparison-service';
import { projectComparison } from '@/features/investment-scenarios/comparison';
import { missing } from '@/features/investment-scenarios/reference';
import { persistedMonthInput } from './fixtures/investment-month';
import { up as comparisonUp, down as comparisonDown } from '@/migrations/20261127_093515_mvp_two_comparisons';

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
    await assert.rejects(payload.update({ collection: 'users', id: admin.id, user: other, overrideAccess: false, data: { password: 'peer-takeover-password' } }));
    const bulkCredentials = await payload.update({ collection: 'users', where: { id: { equals: admin.id } }, user: other, overrideAccess: false, data: { email: 'taken@example.invalid' } });
    assert.equal(bulkCredentials.docs.length, 0);
    assert.equal(bulkCredentials.errors.length, 1);
    await assert.rejects(payload.delete({ collection: 'users', id: admin.id, user: other, overrideAccess: false }));
    const bulkDelete = await payload.delete({ collection: 'users', where: { id: { equals: admin.id } }, user: other, overrideAccess: false });
    assert.equal(bulkDelete.docs.length, 0);
    const invalidStep = structuredClone(command.input);
    invalidStep.operations[2].step = 999;
    await assert.rejects(saveScenario(payload, admin, { ...command, expectedRevision: 1, requestKey: randomUUID(), input: invalidStep }), error => {
      assert.ok(error instanceof ZodError);
      assert.deepEqual(error.issues.map(({ path, message }) => ({ path, message })), [{ path: ['input', 'operations', 2, 'step'], message: 'Nieznany etap publikacji.' }]);
      return true;
    });
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_revisions')).rows[0].n, 1);
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
    for (let revision = 4; revision <= 101; revision++) await saveScenario(payload, admin, { ...command, expectedRevision: revision - 1, requestKey: randomUUID() });
    const history = await readScenario(payload, admin, 'test');
    assert.equal(history.docs.length, 101);
    assert.equal(history.docs.at(-1)?.id, first.id);
    assert.deepEqual(new Set((await listScenarios(payload, admin)).docs.map(doc => doc.scenarioKey)), new Set(['test', 'capacity']));
    assert.deepEqual((await readRevision(payload, admin, 'test', first.id)).body, first.body);
    // AE3–AE4: use genuine publications and the saved evaluator, not precomputed report JSON.
    for (const example of [
      { key: 'complete', receipts: '40000', cash: '2000.00', status: 'calculated', missing: null },
      { key: 'zero', receipts: '38000', cash: '0.00', status: 'no-finite-payback', missing: null },
      { key: 'negative', receipts: '35000', cash: '-3000.00', status: 'no-finite-payback', missing: null },
      { key: 'missing-deposit', receipts: '40000', cash: '2000.00', status: 'unverified', missing: 'deposit' },
      { key: 'missing-rent', receipts: '40000', cash: null, status: 'unverified', missing: 'rent' },
      { key: 'missing-charges', receipts: '40000', cash: null, status: 'unverified', missing: 'charges' },
      { key: 'missing-replenishment', receipts: '40000', cash: null, status: 'unverified', missing: 'replenishment' },
    ]) {
      const input = persistedMonthInput(publications[0].id, flour.id);
      input.month!.cashEntries[0].amount = sourced(example.receipts, 'PLN', '2026-11');
      if (example.missing === 'deposit') input.investment.deposit = missing('PLN', 'Brak oferty kaucji');
      if (example.missing === 'rent') input.month!.fixedCosts[0].amount = missing('PLN', 'Brak najmu');
      if (example.missing === 'charges') input.month!.ownerCharges = missing('PLN', 'Brak obciążeń');
      if (example.missing === 'replenishment') input.month!.preparations = [];
      const scenarioKey = `month-${example.key}`;
      const revision = await saveScenario(payload, admin, { scenarioKey, expectedRevision: 0, requestKey: randomUUID(), input });
      const runCommand = { revisionId: revision.id, requestKey: randomUUID() };
      const result = await runScenario(payload, admin, runCommand);
      const body = runBodyV2Schema.parse(result.body);
      assert.ok(body.output.investment);
      assert.equal(body.output.monthly?.recurringCash.value, example.cash, example.key);
      assert.equal(body.output.investment.payback.status, example.status, example.key);
      assert.equal(body.output.investment.payback.months, example.status === 'calculated' ? '60.00' : null);
      if (example.missing !== 'deposit') assert.equal(body.output.investment.outlay.value, '120000.00');
      if (example.status === 'unverified') assert.ok(body.output.investment.payback.reasons.length > 0);
      assert.deepEqual(versionedSavedInputSchema.parse((await readRevision(payload, admin, scenarioKey, revision.id)).body).input, input);
      assert.deepEqual((await readRuns(payload, admin, revision.id)).docs[0].body, result.body);
      const independentBody = (await independent.execute({ sql: 'SELECT body FROM scenario_runs WHERE id = ?', args: [result.id] })).rows[0].body;
      assert.deepEqual(versionedRunBodySchema.parse(JSON.parse(String(independentBody))), body);
      assert.deepEqual((await runScenario(payload, admin, runCommand)).body, result.body);
    }
    // Apply the additive migration to populated v1/v2 history, not just an empty database.
    const beforeMigrationV2 = await saveScenario(payload, admin, { scenarioKey: 'migration-v2', expectedRevision: 0, requestKey: randomUUID(), input: persistedMonthInput(publications[0].id, flour.id) });
    await runScenario(payload, admin, { revisionId: beforeMigrationV2.id, requestKey: randomUUID() });
    const beforeMigration = (await independent.execute('SELECT id, body FROM scenario_runs ORDER BY id')).rows;
    const migrationArgs = { db: payload.db.drizzle, payload, req: await createLocalReq({ user: admin }, payload) };
    await comparisonDown(migrationArgs);
    await comparisonUp(migrationArgs);
    assert.deepEqual((await independent.execute('SELECT id, body FROM scenario_runs ORDER BY id')).rows, beforeMigration);
    const pairInputs = [40, 84].map(hours => {
      const input = upgradeScenario(command.input); input.name = `Wariant ${hours} h`; input.period = 'week';
      input.interval = { start: '2026-11-23T00:00:00+01:00', end: '2026-11-30T00:00:00+01:00', zone: 'Europe/Warsaw' };
      input.resources[0].availability = Array.from({ length: hours === 40 ? 5 : 7 }, (_, day) => ({ zone: input.interval.zone, start: `2026-11-${23 + day}T05:00:00+01:00`, end: `2026-11-${23 + day}T${hours === 40 ? '13' : '17'}:00:00+01:00` }));
      input.finance.period = 'week'; input.finance.costs = [{ ...input.finance.costs[0], id: 'rent', expenseId: 'rent', name: 'Najem', category: 'rent', period: 'week', quantity: sourced('1', 'batch', 'week'), rate: hours === 40 ? sourced('100', 'PLN/batch', 'week') : missing('PLN/batch', 'Brak najmu') }];
      input.lots.push({ id: 'flour-opening', itemId: String(flour.id), location: 'magazyn', kind: 'material', quantity: { value: '20000', unit: 'g' }, evidence: sourced('20000', 'g', 'week'), availableAt: input.interval.start, expiresAt: input.interval.end, admitted: true, admissionSource: 'Syntetyczne źródło', sourceParts: ['delivery'], preparationContext: 'Zapas otwarcia' });
      if (hours === 84) { input.products[0].price = sourced('22', 'PLN/piece'); input.products[0].lossPercent = sourced('5', '%'); input.resources[2].capacity = sourced('32', 'piece'); const prep = input.operations.find(row => row.id === 'prep-B')!; prep.duration = sourced('30', 'min'); prep.demands[0].duration = sourced('30', 'min'); }
      return input;
    });
    const pairRevisions = [];
    const pairRuns = [];
    for (let index = 0; index < pairInputs.length; index++) {
      const revision = await saveScenario(payload, admin, { scenarioKey: `comparison-${index}`, expectedRevision: 0, requestKey: randomUUID(), input: pairInputs[index] });
      pairRevisions.push(revision);
      pairRuns.push(await prepareComparisonRun(payload, admin, { revisionId: revision.id, requestKey: randomUUID() }));
    }
    assert.deepEqual(projectComparison(pairRuns).variants.map(row => row.labor.find(role => role.id === 'baker')?.availableHours), [40, 84]);
    assert.deepEqual(pairRuns.map(row => row.body.output.process.laborMinutes.baker), [30, 45]);
    assert.equal(pairRuns[0].body.output.economics.operatingRemainder, '136.00');
    assert.equal(pairRuns[1].body.output.economics.operatingRemainder, null);
    const comparisonCommand = { comparisonKey: randomUUID(), requestKey: randomUUID(), runIds: pairRuns.map(row => row.runId) };
    const comparison = await saveComparison(payload, admin, comparisonCommand);
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_comparisons')).rows[0].n, 1);
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_comparisons_rels')).rows[0].n, 2);
    assert.equal((await saveComparison(payload, admin, comparisonCommand)).id, comparison.id);
    await assert.rejects(saveComparison(payload, admin, { ...comparisonCommand, runIds: [...comparisonCommand.runIds].reverse() }), /ponowienia/);
    await assert.rejects(saveComparison(payload, admin, { ...comparisonCommand, requestKey: randomUUID(), comparisonKey: randomUUID(), runIds: [pairRuns[0].runId, pairRuns[0].runId] }));
    await assert.rejects(saveComparison(payload, admin, { ...comparisonCommand, requestKey: randomUUID(), runIds: [run.id, pairRuns[1].runId] }));
    const pinned = await readComparison(payload, admin, comparison.comparisonKey);
    await saveScenario(payload, admin, { scenarioKey: pairRevisions[0].scenarioKey, expectedRevision: 1, requestKey: randomUUID(), input: { ...pairInputs[0], name: 'Nowa wersja poza porównaniem' } });
    assert.deepEqual(await readComparison(payload, admin, comparison.comparisonKey), pinned);
    const foreignRevision = await saveScenario(payload, other, { scenarioKey: 'foreign', expectedRevision: 0, requestKey: randomUUID(), input: pairInputs[0] });
    const foreignRun = await prepareComparisonRun(payload, other, { revisionId: foreignRevision.id, requestKey: randomUUID() });
    await assert.rejects(saveComparison(payload, admin, { ...comparisonCommand, requestKey: randomUUID(), runIds: [pairRuns[0].runId, foreignRun.runId] }));
    const editor = await payload.create({ collection: 'users', data: { email: 'editor@example.invalid', password: randomBytes(24).toString('hex'), role: 'editor' } });
    for (const actor of [other, editor, baker, null]) {
      await assert.rejects(readComparison(payload, actor, comparison.comparisonKey));
      await assert.rejects(saveComparison(payload, actor, { ...comparisonCommand, requestKey: randomUUID() }));
      await assert.rejects(prepareComparisonRun(payload, actor, { revisionId: pairRevisions[0].id, requestKey: randomUUID() }));
      if (actor?.role === 'administrator') assert.equal((await payload.find({ collection: 'scenario-comparisons', user: actor, overrideAccess: false, depth: 3 })).docs.length, 0);
      else await assert.rejects(payload.find({ collection: 'scenario-comparisons', user: actor, overrideAccess: false, depth: 3 }));
    }
    await assert.rejects(payload.create({ collection: 'scenario-comparisons', user: admin, overrideAccess: false, context: { scenarioAppend: '5ciastek.scenario-service-append' }, data: { owner: admin.id, comparisonKey: randomUUID(), requestKey: randomUUID(), schemaVersion: 1, fingerprint: comparison.fingerprint, runs: comparisonCommand.runIds, manifest: comparison.manifest } }));
    await assert.rejects(payload.create({ collection: 'scenario-comparisons', user: admin, overrideAccess: true, context: { scenarioAppend: true }, data: { owner: admin.id, comparisonKey: randomUUID(), requestKey: randomUUID(), schemaVersion: 1, fingerprint: comparison.fingerprint, runs: comparisonCommand.runIds, manifest: comparison.manifest } }));
    await assert.rejects(payload.update({ collection: 'scenario-comparisons', id: comparison.id, user: admin, overrideAccess: false, data: { runs: [foreignRun.runId] } }));
    await assert.rejects(payload.delete({ collection: 'scenario-comparisons', id: comparison.id, user: admin, overrideAccess: false }));
    const comparisonFailures = payload.collections['scenario-comparisons'].config.hooks!.afterChange ??= [];
    comparisonFailures.push(() => { throw new Error('Injected comparison append failure'); });
    const retryComparison = { ...comparisonCommand, requestKey: randomUUID(), comparisonKey: randomUUID() };
    await assert.rejects(saveComparison(payload, admin, retryComparison), /Injected comparison/);
    comparisonFailures.pop();
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_comparisons')).rows[0].n, 1);
    const comparisonReader = createClient({ url: process.env.DATABASE_URI });
    await comparisonReader.execute('BEGIN'); await comparisonReader.execute('SELECT id FROM scenario_comparisons');
    try { await assert.rejects(saveComparison(payload, admin, retryComparison), /SQLITE_BUSY/); }
    finally { await comparisonReader.execute('ROLLBACK'); comparisonReader.close(); }
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_comparisons')).rows[0].n, 1);
    assert.equal((await independent.execute('SELECT count(*) AS n FROM scenario_comparisons_rels')).rows[0].n, 2);
    const confirmedRetry = await saveComparison(payload, admin, retryComparison);
    assert.equal((await saveComparison(payload, admin, retryComparison)).id, confirmedRetry.id);
    await assert.rejects(readRevision(payload, admin, 'capacity', first.id), /Brak dostępu/);
    await assert.rejects(readRevision(payload, other, 'test', first.id));
    const weeklyInput = upgradeScenario(command.input);
    const weekly = await saveScenario(payload, admin, { scenarioKey: 'weekly', expectedRevision: 0, requestKey: randomUUID(), input: weeklyInput });
    assert.equal(weekly.schemaVersion, 2);
    assert.deepEqual(versionedSavedInputSchema.parse((await readRevision(payload, admin, 'weekly', weekly.id)).body).input, weeklyInput);
    const weeklyRun = await runScenario(payload, admin, { revisionId: weekly.id, requestKey: randomUUID() });
    assert.equal(versionedRunBodySchema.parse(weeklyRun.body).output.engineVersion, 'investment-scenario/2');
    assert.deepEqual((await runScenario(payload, admin, runCommand)).body, run.body, 'v1 retry remains the original receipt after adding v2');
    assert.deepEqual((await readRevision(payload, admin, 'test', first.id)).body, first.body);
    await payload.update({ collection: 'users', id: admin.id, user: other, overrideAccess: false, data: { email: admin.email, role: 'editor' } });
    await assert.rejects(payload.delete({ collection: 'users', id: admin.id, user: other, overrideAccess: false }), /właściciela/);
    await payload.update({ collection: 'users', id: admin.id, user: other, overrideAccess: false, data: { role: 'administrator' } });
    const selfPassword = randomBytes(24).toString('hex');
    await payload.update({ collection: 'users', id: other.id, user: other, overrideAccess: false, data: { email: 'self@example.invalid', password: selfPassword } });
    assert.equal((await payload.login({ collection: 'users', data: { email: 'self@example.invalid', password: selfPassword } })).user?.id, other.id);
    const selfBulk = await payload.update({ collection: 'users', where: { id: { equals: other.id } }, user: other, overrideAccess: false, data: { email: 'self-bulk@example.invalid', password: selfPassword } });
    assert.equal(selfBulk.docs[0].id, other.id);
    assert.equal((await payload.login({ collection: 'users', data: { email: 'self-bulk@example.invalid', password: selfPassword } })).user?.id, other.id);
    const recoveryPassword = randomBytes(24).toString('hex');
    await payload.update({ collection: 'users', id: other.id, overrideAccess: true, data: { email: 'other@example.invalid', password: recoveryPassword } });
    assert.equal((await payload.login({ collection: 'users', data: { email: 'other@example.invalid', password: recoveryPassword } })).user?.id, other.id);
    const expected = { revisions: (await payload.find({ collection: 'scenario-revisions', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs,
      runs: (await payload.find({ collection: 'scenario-runs', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs,
      comparisons: (await payload.find({ collection: 'scenario-comparisons', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs,
      pinned: await readComparison(payload, admin, comparison.comparisonKey) };
    await writeFile(join(directory, 'expected.json'), JSON.stringify(expected));
    await payload.destroy(); destroyed = true;
    await copyFile(join(directory, 'source.db'), join(directory, 'restored.db'));
    const restored = spawnSync(process.execPath, ['--import', 'tsx', 'src/tests/fixtures/scenario-restore-readback.ts'], { env: { ...process.env, DATABASE_URI: `file:${join(directory, 'restored.db')}`, SCENARIO_EXPECTED: join(directory, 'expected.json') }, encoding: 'utf8' });
    assert.equal(restored.status, 0, restored.stdout + restored.stderr);
  } finally {
    independent.close(); if (!destroyed) await payload.destroy(); await rm(directory, { recursive: true, force: true });
  }
});
