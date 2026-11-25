import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getPayload } from 'payload';
import config from '@/payload.config';

assert.match(process.env.DATABASE_URI ?? '', /\/5ciastek-scenarios-test-[^/]+\/restored\.db$/);
assert.match(process.env.SCENARIO_EXPECTED ?? '', /\/5ciastek-scenarios-test-[^/]+\/expected\.json$/);
const expected = JSON.parse(await readFile(process.env.SCENARIO_EXPECTED!, 'utf8'));
const payload = await getPayload({ config });
try {
  const admin = (await payload.find({ collection: 'users', where: { email: { equals: 'owner@example.invalid' } } })).docs[0];
  const other = (await payload.find({ collection: 'users', where: { email: { equals: 'other@example.invalid' } } })).docs[0];
  assert.ok(admin); assert.ok(other);
  assert.deepEqual((await payload.find({ collection: 'scenario-revisions', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs, expected.revisions);
  assert.deepEqual((await payload.find({ collection: 'scenario-runs', user: admin, overrideAccess: false, depth: 0, sort: 'id', limit: 0 })).docs, expected.runs);
  assert.equal((await payload.find({ collection: 'scenario-runs', user: other, overrideAccess: false, depth: 0 })).totalDocs, 0);
  assert.equal((await payload.find({ collection: 'publications', user: admin, overrideAccess: false })).totalDocs, 3);
  console.log('PASS: populated scenario restore, exact immutable revisions/runs and owner isolation.');
} finally { await payload.destroy(); }
