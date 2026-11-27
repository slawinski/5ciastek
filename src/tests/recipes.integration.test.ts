import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, copyFile, rm, writeFile, readFile, mkdir, link } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createLocalReq, getPayload } from 'payload';
import { snapshotSchema } from '@/features/recipes/schema';
import { up, down } from '@/migrations/20261124_172929_mvp_zero';
import { up as upScenarios, down as downScenarios } from '@/migrations/20261125_155445_mvp_one';
import { down as downComparisons } from '@/migrations/20261127_093515_mvp_two_comparisons';
import { sql } from '@payloadcms/db-sqlite';
import { pathToFileURL } from 'node:url';
import { setImmediate } from 'node:timers/promises';

test('isolated SQLite publication, authorization, history, export and restore', async () => {
  const directory = await mkdtemp(join(tmpdir(), '5ciastek-recipes-test-'));
  process.env.PAYLOAD_SECRET = randomBytes(32).toString('hex');
  process.env.DATABASE_URI = `file:${join(directory, 'source.db')}`;
  const migration = spawnSync(process.execPath, ['scripts/migrate.mjs'], { env: { ...process.env, CONFIRM_DATABASE_URI: process.env.DATABASE_URI }, encoding: 'utf8' });
  assert.equal(migration.status, 0, migration.stdout + migration.stderr);
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
    const { createClient } = await import('@libsql/client');
    const independent = createClient({ url: process.env.DATABASE_URI });
    // An actual reader lock allows writes but prevents COMMIT in rollback-journal mode.
    const reader = createClient({ url: process.env.DATABASE_URI });
    await reader.execute('BEGIN');
    try {
      await reader.execute('SELECT id FROM recipes');
      await assert.rejects(payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { name: 'Uncommitted snapshot', publishNow: true } }), /SQLITE_BUSY/);
    } finally { await reader.execute('ROLLBACK'); reader.close(); }
    assert.equal((await payload.findByID({ collection: 'recipes', id: recipe.id })).publicationNumber, 2);
    assert.equal((await read()).totalDocs, 2);
    const attempts = [];
    for (let round = 0; round < 3; round++) {
      const competing = await Promise.allSettled([1, 2].map(() => payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { publishNow: true } })));
      assert.ok(competing.some(attempt => attempt.status === 'rejected'), 'exercise the failed concurrent writer');
      assert.ok(competing.some(attempt => attempt.status === 'fulfilled'), 'the winning writer must commit');
      attempts.push(...competing);
    }
    const versions = (await payload.find({ collection: 'publications', user: editor, overrideAccess: false, where: { recipe: { equals: recipe.id } } })).docs.map(doc => doc.version).sort((a, b) => a - b);
    assert.equal(new Set(versions).size, versions.length);
    assert.equal(versions.length, 2 + attempts.filter(attempt => attempt.status === 'fulfilled').length);
    assert.deepEqual(versions, Array.from({ length: versions.length }, (_, index) => index + 1));
    const bulkDrafts = [];
    try {
      for (const [index, mass] of ['11.001', '22.002'].entries()) {
        const draft = await payload.create({ collection: 'recipes', user: editor, overrideAccess: false, data: { name: `Bulk ${index}`, audience: 'bakers', standalone: true, yield: 1, description: `Distinct ${index}`, ingredients: [{ ingredient: flour.id, mass }], process: [{ instruction: `Step ${index}` }] } });
        assert.equal((await independent.execute({ sql: 'SELECT name FROM recipes WHERE id = ?', args: [draft.id] })).rows[0]?.name, `Bulk ${index}`, 'successful post-contention write must already be independently durable');
        bulkDrafts.push(draft);
      }
    } catch (error) { independent.close(); throw error; }
    const bulkWhere = { id: { in: bulkDrafts.map(doc => doc.id) } };
    const publicationHooks = payload.collections.publications.config.hooks!.afterChange ??= [];
    let publicationCalls = 0;
    publicationHooks.push(async () => {
      if (++publicationCalls === 2) {
        await setImmediate(); // Let the first document complete before the nested write fails.
        throw new Error('Injected nested publication failure');
      }
    });
    try {
      await assert.rejects(async () => {
        await payload.update({ collection: 'recipes', limit: 2, where: bulkWhere, user: editor, overrideAccess: false, data: { publishNow: true } });
      }, /Publikuj receptury pojedynczo/);
      assert.equal(publicationCalls, 0, 'bulk publication must stop before any nested publication');
    } finally { publicationHooks.pop(); }
    for (const overrideAccess of [false, true]) await assert.rejects(payload.update({ collection: 'recipes', limit: 2, where: bulkWhere, user: editor, overrideAccess, data: { publishNow: true } }), /Publikuj receptury pojedynczo/);
    await assert.rejects(payload.update({ collection: 'recipes', limit: 1, where: { id: { equals: bulkDrafts[0].id } }, user: editor, overrideAccess: false, data: { publishNow: true } }), /Publikuj receptury pojedynczo/);
    assert.deepEqual((await independent.execute({ sql: 'SELECT publication_number FROM recipes WHERE id IN (?, ?) ORDER BY id', args: bulkDrafts.map(doc => doc.id) })).rows.map(row => row.publication_number), [0, 0]);
    assert.equal((await independent.execute({ sql: 'SELECT id FROM publications WHERE recipe_id IN (?, ?)', args: bulkDrafts.map(doc => doc.id) })).rows.length, 0);
    const bulk = await payload.update({ collection: 'recipes', limit: 2, where: bulkWhere, user: editor, overrideAccess: false, data: { code: 'draft-only', publishNow: false } });
    assert.deepEqual(bulk.errors, []);
    assert.equal(bulk.docs.length, 2);
    for (const [index, draft] of bulkDrafts.entries()) {
      assert.equal((await payload.findByID({ collection: 'recipes', id: draft.id })).code, 'draft-only');
      await payload.update({ collection: 'recipes', id: draft.id, user: editor, overrideAccess: false, data: { publishNow: true } });
      const publications = await payload.find({ collection: 'publications', user: editor, overrideAccess: false, where: { recipe: { equals: draft.id } }, depth: 0 });
      assert.equal(publications.totalDocs, 1);
      const snapshot = snapshotSchema.parse(publications.docs[0].snapshot);
      assert.equal(snapshot.name, `Bulk ${index}`);
      assert.equal(snapshot.totalGrams, ['11.001', '22.002'][index]);
      assert.equal(publications.docs[0].versionKey, `${draft.id}:1`);
      assert.equal((await payload.findByID({ collection: 'recipes', id: draft.id })).publicationNumber, 1);
      const persisted = (await independent.execute({ sql: 'SELECT r.publication_number, p.snapshot, p.version_key FROM recipes r JOIN publications p ON p.recipe_id = r.id WHERE r.id = ?', args: [draft.id] })).rows;
      assert.equal(persisted.length, 1);
      assert.equal(persisted[0].publication_number, 1);
      assert.equal(persisted[0].version_key, `${draft.id}:1`);
      assert.deepEqual(JSON.parse(String(persisted[0].snapshot)), snapshot);
    }
    const nextVersion = versions.length + 1;
    await payload.update({ collection: 'recipes', id: recipe.id, user: editor, overrideAccess: false, data: { name: 'Durable after contention', publishNow: true } });
    const durable = (await independent.execute({ sql: 'SELECT r.publication_number, p.snapshot FROM recipes r JOIN publications p ON p.recipe_id = r.id WHERE p.version_key = ?', args: [`${recipe.id}:${nextVersion}`] })).rows;
    assert.equal(durable.length, 1);
    assert.equal(durable[0].publication_number, nextVersion);
    assert.equal(snapshotSchema.parse(JSON.parse(String(durable[0].snapshot))).name, 'Durable after contention');
    const persistedVersions = (await independent.execute({ sql: 'SELECT version, snapshot FROM publications WHERE recipe_id = ? ORDER BY version', args: [recipe.id] })).rows;
    assert.deepEqual(persistedVersions.map(row => row.version), Array.from({ length: nextVersion }, (_, index) => index + 1));
    assert.deepEqual(JSON.parse(String(persistedVersions[0].snapshot)), frozen);
    assert.ok(persistedVersions.every(row => snapshotSchema.parse(JSON.parse(String(row.snapshot))).totalGrams === '3000.000'));
    independent.close();
    const optional = await payload.create({ collection: 'recipes', user: editor, overrideAccess: false, data: { name: 'Optional portion', audience: 'editors', standalone: true, yield: 5, portionGrams: '', description: 'Optional', ingredients: [{ ingredient: flour.id, mass: '4000' }], process: [{ instruction: 'Test' }], publishNow: true } });
    await payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { portionGrams: '800', publishNow: true } });
    await payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { publishNow: true } }); // Omission retains the supplied value.
    await payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { portionGrams: '', publishNow: true } });
    await payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { portionGrams: '750' } });
    await assert.rejects(payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { publishNow: true } })); // Omission must not discard an inconsistent saved auxiliary value.
    await payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { portionGrams: '' } });
    for (const portionGrams of [' ', '0', '800.0001', '750']) await assert.rejects(payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { portionGrams, publishNow: true } }));
    for (const mass of ['', '0', '1.0001']) await assert.rejects(payload.update({ collection: 'recipes', id: optional.id, user: editor, overrideAccess: false, data: { portionGrams: '', ingredients: [{ ingredient: flour.id, mass }], publishNow: true } }));
    const optionalVersions = await payload.find({ collection: 'publications', user: editor, overrideAccess: false, where: { recipe: { equals: optional.id } }, sort: 'version' });
    assert.deepEqual(optionalVersions.docs.map(doc => snapshotSchema.parse(doc.snapshot).portionGrams), ['800.000', '800.000', '800.000', '800.000']);
    assert.equal((await payload.findByID({ collection: 'recipes', id: optional.id })).publicationNumber, 4);
    // Populate all child-table families before exercising the actual initial down/up.
    await payload.db.drizzle.run(sql`INSERT INTO users_sessions (_order, _parent_id, id, expires_at) VALUES (1, ${admin.id}, 'synthetic-session', '2099-01-01')`);
    await payload.db.drizzle.run(sql`INSERT INTO payload_preferences (id, key, value) VALUES (1, 'test', '{}')`);
    await payload.db.drizzle.run(sql`INSERT INTO payload_preferences_rels (parent_id, path, users_id) VALUES (1, 'user', ${admin.id})`);
    await payload.db.drizzle.run(sql`INSERT INTO payload_locked_documents (id) VALUES (1)`);
    await payload.db.drizzle.run(sql`INSERT INTO payload_locked_documents_rels (parent_id, path, users_id, ingredients_id, recipes_id, publications_id) VALUES (1, 'document', ${admin.id}, ${flour.id}, ${recipe.id}, ${first.id})`);
    // Close SQLite before copying; the restore never targets the source database.
    await payload.destroy();
    await copyFile(join(directory, 'source.db'), join(directory, 'restored.db'));
    const sourceBeforeFailure = await readFile(join(directory, 'source.db'));
    const restored = createClient({ url: `file:${join(directory, 'restored.db')}` });
    const rows = await restored.execute('SELECT snapshot FROM publications WHERE id = 1');
    assert.deepEqual(JSON.parse(String(rows.rows[0].snapshot)), frozen);
    const failure = spawnSync(process.execPath, ['--import', 'tsx', 'src/tests/fixtures/failed-migration.ts'], { env: { ...process.env, DATABASE_URI: `file:${join(directory, 'restored.db')}`, CONFIRM_DATABASE_URI: `file:${join(directory, 'restored.db')}` }, encoding: 'utf8' });
    assert.equal(failure.status, 1, failure.stdout + failure.stderr);
    assert.match(failure.stdout, /^INJECTED_MIGRATION_DDL_APPLIED$/m);
    assert.match(failure.stdout + failure.stderr, /Failed query: INSERT INTO missing_table VALUES \(1\)/);
    assert.match(failure.stdout + failure.stderr, /no such table: (?:main\.)?missing_table/);
    assert.deepEqual(await readFile(join(directory, 'source.db')), sourceBeforeFailure);
    assert.equal((await restored.execute("SELECT name FROM sqlite_master WHERE name = 'injected_migration'")).rows.length, 0);
    assert.deepEqual(JSON.parse(String((await restored.execute('SELECT snapshot FROM publications WHERE id = 1')).rows[0].snapshot)), frozen);
    assert.equal((await restored.execute("SELECT name FROM payload_migrations WHERE name = 'injected_migration_failure'")).rows.length, 0);
    assert.deepEqual((await restored.execute('PRAGMA foreign_key_check')).rows, []);
    restored.close();
    const recovery = spawnSync(process.execPath, ['--import', 'tsx', 'src/tests/fixtures/restore-readback.ts'], { env: { ...process.env, DATABASE_URI: `file:${join(directory, 'restored.db')}` }, encoding: 'utf8' });
    assert.equal(recovery.status, 0, recovery.stdout + recovery.stderr);
    // Use the migration's real functions, with FK enforcement left enabled.
    const { drizzle } = await import('drizzle-orm/libsql');
    const client = createClient({ url: `file:${join(directory, 'restored.db')}` });
    const db = drizzle(client);
    assert.equal((await client.execute('PRAGMA foreign_keys')).rows[0].foreign_keys, 1);
    const req = await createLocalReq({}, payload);
    const recipesBeforeScenarioMigration = (await client.execute('SELECT * FROM recipes ORDER BY id')).rows;
    const publicationsBeforeScenarioMigration = (await client.execute('SELECT * FROM publications ORDER BY id')).rows;
    await downComparisons({ db, payload, req });
    await downScenarios({ db, payload, req });
    await upScenarios({ db, payload, req });
    assert.deepEqual((await client.execute('SELECT * FROM recipes ORDER BY id')).rows, recipesBeforeScenarioMigration);
    assert.deepEqual((await client.execute('SELECT * FROM publications ORDER BY id')).rows, publicationsBeforeScenarioMigration);
    await downScenarios({ db, payload, req });
    await down({ db, payload, req });
    assert.equal((await client.execute("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")).rows.length, 0);
    await up({ db, payload, req });
    assert.deepEqual((await client.execute('PRAGMA foreign_key_check')).rows, []);
    assert.ok((await client.execute('PRAGMA table_info(recipes)')).rows.some(row => row.name === 'description'));
    client.close();
  } finally {
    await payload.destroy().catch(() => undefined);
    await rm(directory, { recursive: true, force: true });
  }
});

test('existing-target backup guard rejects blank, missing, directory and same-file paths before launching Payload', async () => {
  const directory = await mkdtemp(join(tmpdir(), '5ciastek-migration-guard-'));
  try {
    const target = join(directory, 'target.db');
    await writeFile(target, 'owned synthetic sentinel');
    await mkdir(join(directory, 'backup-directory'));
    await link(target, join(directory, 'alias.db'));
    for (const backup of [undefined, '', '   ', join(directory, 'missing.db'), target, join(directory, 'alias.db'), join(directory, 'backup-directory')]) {
      const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URI: `file:${target}`, CONFIRM_DATABASE_URI: `file:${target}` };
      delete env.VERIFIED_BACKUP_PATH;
      if (backup !== undefined) env.VERIFIED_BACKUP_PATH = backup;
      // No node_modules here: reaching the child would fail with MODULE_NOT_FOUND instead.
      const result = spawnSync(process.execPath, [resolve('scripts/migrate.mjs')], { cwd: directory, env, encoding: 'utf8' });
      assert.equal(result.status, 1);
      assert.match(result.stderr, /backup path|Backup must/);
      assert.doesNotMatch(result.stderr, /MODULE_NOT_FOUND/);
      assert.equal(await readFile(target, 'utf8'), 'owned synthetic sentinel');
    }
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('migration wrapper refuses unconfirmed targets before mutation', () => {
  const result = spawnSync(process.execPath, ['scripts/migrate.mjs'], { env: { ...process.env, DATABASE_URI: 'file:/unconfirmed-test-target.db', CONFIRM_DATABASE_URI: '' }, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Name and confirm/);
});

test('migration URI guard checks the decoded driver target and passes only a canonical URI to its child', async () => {
  const directory = await mkdtemp(join(tmpdir(), '5ciastek-migration-uri-'));
  try {
    const path = join(directory, 'production.db');
    await writeFile(path, 'owned synthetic target');
    const canonical = pathToFileURL(path).href;
    const encoded = canonical.replace('production.db', 'production%2Edb');
    const localhost = canonical.replace('file:///', 'file://localhost/');
    const childDirectory = join(directory, 'node_modules', 'payload');
    await mkdir(childDirectory, { recursive: true });
    await writeFile(join(childDirectory, 'bin.js'), 'process.stdout.write(JSON.stringify({ target: process.env.DATABASE_URI, confirmed: process.env.CONFIRM_DATABASE_URI, mode: process.env.NODE_ENV }));');
    const invoke = (target: string, backup?: string) => {
      const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URI: target, CONFIRM_DATABASE_URI: target };
      delete env.VERIFIED_BACKUP_PATH;
      if (backup !== undefined) env.VERIFIED_BACKUP_PATH = backup;
      return spawnSync(process.execPath, [resolve('scripts/migrate.mjs')], { cwd: directory, env, encoding: 'utf8' });
    };
    const blocked = [encoded, localhost, `${canonical}?tls=0`, `${canonical}#fragment`, canonical.replace('file:///', 'file://unsupported-host/')].map(target => invoke(target));
    assert.deepEqual(blocked.map(result => result.status), [1, 1, 1, 1, 1], 'every existing or unsupported URI must stop before the fake migration child');
    for (const result of blocked) assert.equal(result.stdout, '');
    for (const target of [encoded, localhost]) {
      const sameBackup = invoke(target, path);
      assert.equal(sameBackup.status, 1);
      assert.match(sameBackup.stderr, /Backup must/);
    }
    const backup = join(directory, 'separate.db');
    await copyFile(path, backup);
    for (const target of [canonical, encoded, localhost]) {
      const allowed = invoke(target, backup);
      assert.equal(allowed.status, 0, allowed.stderr);
      assert.deepEqual(JSON.parse(allowed.stdout), { target: canonical, confirmed: canonical, mode: 'production' });
    }
    for (const target of [`${canonical}?tls=0`, `${canonical}#fragment`, canonical.replace('file:///', 'file://unsupported-host/')]) assert.equal(invoke(target, backup).status, 1);
    assert.equal(await readFile(path, 'utf8'), 'owned synthetic target');
  } finally { await rm(directory, { recursive: true, force: true }); }
});
