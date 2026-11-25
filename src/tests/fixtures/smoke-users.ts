import { getPayload } from 'payload';
import config from '@/payload.config';
import assert from 'node:assert/strict';

assert.match(process.env.DATABASE_URI ?? '', /\/5ciastek-production-smoke-[^/]+\/smoke\.db$/);
assert.ok(process.env.SMOKE_PASSWORD && process.env.SMOKE_PASSWORD.length >= 32);
const payload = await getPayload({ config });
try {
  for (const role of ['administrator', 'editor', 'baker'] as const) {
    await payload.create({ collection: 'users', overrideAccess: true, data: { email: `${role}@example.invalid`, role, password: process.env.SMOKE_PASSWORD! } });
  }
} finally { await payload.destroy(); }
