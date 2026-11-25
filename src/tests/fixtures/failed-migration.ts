import { getPayload } from 'payload';
import { sql, type MigrateUpArgs } from '@payloadcms/db-sqlite';
import config from '@/payload.config';
import assert from 'node:assert/strict';

// Invoked only by the integration test against its owned restored copy.
assert.match(process.env.DATABASE_URI ?? '', /\/5ciastek-recipes-test-[^/]+\/restored\.db$/);
assert.equal(process.env.CONFIRM_DATABASE_URI, process.env.DATABASE_URI);
const payload = await getPayload({ config });
await payload.db.migrate({ migrations: [{
  name: 'injected_migration_failure',
  up: async args => {
    const { db } = args as MigrateUpArgs;
    await db.run(sql`CREATE TABLE injected_migration (id INTEGER)`);
    console.log('INJECTED_MIGRATION_DDL_APPLIED');
    await db.run(sql`INSERT INTO missing_table VALUES (1)`);
  },
  down: async () => {},
}] });
await payload.destroy();
