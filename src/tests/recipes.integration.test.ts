import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { getPayload } from 'payload';
import { snapshotSchema } from '@/features/recipes/schema';

test('isolated SQLite publication, authorization, history, export and restore', async () => {
  const directory = await mkdtemp(join(tmpdir(), '5ciastek-recipes-test-'));
  process.env.PAYLOAD_SECRET = randomBytes(32).toString('hex');
  process.env.DATABASE_URI = `file:${join(directory, 'source.db')}`;
  const config = (await import('@/payload.config')).default;
  const payload = await getPayload({ config });
  try {
    const admin = await payload.create({ collection: 'users', data: { email: 'admin@example.invalid', password: randomBytes(24).toString('hex'), role: 'administrator' }, overrideAccess: true });
    const editor = await payload.create({ collection: 'users', data: { email: 'editor@example.invalid', password: randomBytes(24).toString('hex'), role: 'editor' }, user: admin, overrideAccess: false });
    const baker = await payload.create({ collection: 'users', data: { email: 'baker@example.invalid', password: randomBytes(24).toString('hex'), role: 'baker' }, user: admin, overrideAccess: false });
    const flour = await payload.create({ collection: 'ingredients', user: editor, overrideAccess: false, data: { name: 'Mąka', kind: 'flour', flourType: 'pszenna' } });
    const starter = await payload.create({ collection: 'ingredients', user: editor, overrideAccess: false, data: { name: 'Zakwas', kind: 'starter', compositionKnown: true, composition: { waterGrams: '500', flours: [{ flourType: 'żytnia', grams: '500' }] } } });
    const recipe = await payload.create({ collection: 'recipes', user: editor, overrideAccess: false, data: { name: 'Chleb wiejski', audience: 'bakers', standalone: true, yield: 5, description: 'Test', process: [{ instruction: 'Pierwszy' }, { instruction: 'Drugi' }], ingredients: [{ ingredient: flour.id, mass: '2000' }, { ingredient: starter.id, mass: '1000' }], publishNow: true } });
    const read = () => payload.find({ collection: 'publications', user: baker, overrideAccess: false, depth: 0 });
    const first = (await read()).docs[0];
    assert.equal(first.version, 1);
    const frozen = snapshotSchema.parse(first.snapshot);
    assert.equal(frozen.totalGrams, '3000.000');
    assert.equal(frozen.ingredients[1].composition?.waterGrams, '500');
    await payload.update({ collection: 'ingredients', id: starter.id, user: editor, overrideAccess: false, data: { name: 'Zmieniony', composition: { waterGrams: '1000', flours: [{ flourType: 'pszenna', grams: '500' }] } } });
    await payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { name: 'Nowy szkic' } });
    assert.deepEqual((await read()).docs[0].snapshot, frozen);
    await assert.rejects(payload.update({ collection: 'recipes', id: recipe.id, user: baker, overrideAccess: false, data: { name: 'Włamanie' } }));
    await assert.rejects(payload.create({ collection: 'recipes', overrideAccess: false, data: { name: 'Anonim', audience: 'bakers' } }));
    const escalated = await payload.update({ collection: 'users', id: baker.id, user: baker, overrideAccess: false, data: { role: 'administrator' } });
    assert.equal(escalated.role, 'baker');
    assert.equal((await payload.find({ collection: 'recipes', user: baker, overrideAccess: false }).catch(() => ({ docs: [] }))).docs.length, 0);
    await assert.rejects(payload.findByID({ collection: 'publications', id: first.id, overrideAccess: false }));
    await assert.rejects(payload.update({ collection: 'publications', id: first.id, user: admin, overrideAccess: false, data: { version: 99 } }));
    await assert.rejects(payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { portionGrams: '750', publishNow: true } }));
    assert.equal((await read()).totalDocs, 1);
    await payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { publishNow: true } });
    assert.equal((await read()).totalDocs, 2);
    assert.deepEqual((await payload.findByID({ collection: 'publications', id: first.id, user: editor, overrideAccess: false, depth: 0 })).snapshot, frozen);
    await payload.create({ collection: 'recipes', user: editor, overrideAccess: false, data: { name: 'Prywatna', audience: 'editors', standalone: true, yield: 1, description: 'Prywatne', ingredients: [{ ingredient: flour.id, mass: '1' }], process: [{ instruction: 'Test' }], publishNow: true } });
    assert.equal((await read()).totalDocs, 2);
    const exported = JSON.parse(JSON.stringify((await read()).docs));
    assert.equal(exported[0].snapshot.unit, 'g');
    assert.equal(exported[0].snapshot.ingredients[0].ingredientId, flour.id);
    const hooks = payload.collections.recipes.config.hooks!.afterChange!;
    hooks.push(() => { throw new Error('Injected persistence failure after snapshot'); });
    await assert.rejects(payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { publishNow: true } }));
    hooks.pop();
    assert.equal((await read()).totalDocs, 2);
    const unchanged = await payload.findByID({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false });
    assert.equal(unchanged.publicationNumber, 2);
    const attempts = await Promise.allSettled([1, 2].map(() => payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { publishNow: true } })));
    const versions = (await read()).docs.map(doc => doc.version).sort((a, b) => a - b);
    assert.equal(new Set(versions).size, versions.length);
    assert.equal(versions.length, 2 + attempts.filter(attempt => attempt.status === 'fulfilled').length);
    assert.deepEqual(versions, Array.from({ length: versions.length }, (_, index) => index + 1));
    // Close SQLite before copying; the restore never targets the source database.
    await payload.destroy();
    await copyFile(join(directory, 'source.db'), join(directory, 'restored.db'));
    const { createClient } = await import('@libsql/client');
    const restored = createClient({ url: `file:${join(directory, 'restored.db')}` });
    const rows = await restored.execute('SELECT snapshot FROM publications WHERE id = 1');
    assert.deepEqual(JSON.parse(String(rows.rows[0].snapshot)), frozen);
    const transaction = await restored.transaction('write');
    try {
      await transaction.execute('CREATE TABLE injected_migration (id INTEGER)');
      await assert.rejects(transaction.execute('INSERT INTO missing_table VALUES (1)'));
      await transaction.rollback();
    } finally { transaction.close(); }
    assert.equal((await restored.execute("SELECT name FROM sqlite_master WHERE name = 'injected_migration'")).rows.length, 0);
    assert.deepEqual(JSON.parse(String((await restored.execute('SELECT snapshot FROM publications WHERE id = 1')).rows[0].snapshot)), frozen);
    restored.close();
  } finally {
    await payload.destroy().catch(() => undefined);
    await rm(directory, { recursive: true, force: true });
  }
});

test('migration wrapper refuses unconfirmed targets before mutation', () => {
  const result = spawnSync(process.execPath, ['scripts/migrate.mjs'], { env: { ...process.env, DATABASE_URI: 'file:/unconfirmed-test-target.db', CONFIRM_DATABASE_URI: '' }, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Name and confirm/);
});
