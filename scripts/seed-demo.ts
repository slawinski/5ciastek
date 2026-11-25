import { resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { getPayload } from 'payload';

const uri = process.env.DATABASE_URI;
const password = process.env.DEMO_PASSWORD;
if (!uri?.startsWith('file:/') || process.env.SYNTHETIC_DATABASE_URI !== uri || !password || password.length < 16) throw new Error('Explicit confirmed synthetic database and temporary demo password required.');
const path = resolve(uri.slice(5));
if (![resolve(tmpdir()), resolve(tmpdir(), 'opencode')].some(root => path.startsWith(`${root}${sep}5ciastek-demo-`))) throw new Error('Demo seed only accepts a fresh 5ciastek-demo-* OS temporary directory.');
const payload = await getPayload({ config: (await import('../src/payload.config')).default });
try {
  if ((await payload.count({ collection: 'users', overrideAccess: true })).totalDocs) throw new Error('Refusing to seed a nonempty account database.');
  const admin = await payload.create({ collection: 'users', overrideAccess: true, data: { email: 'admin@example.invalid', password, role: 'administrator' } });
  for (const role of ['editor', 'baker'] as const) await payload.create({ collection: 'users', user: admin, overrideAccess: false, data: { email: `${role}@example.invalid`, password, role } });
  const flour = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Mąka pszenna', kind: 'flour', flourType: 'pszenna' } });
  const water = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Woda', kind: 'water' } });
  const salt = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Sól', kind: 'salt' } });
  const other = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Dodatek', kind: 'other' } });
  const starter = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Zakwas żytni', kind: 'starter', compositionKnown: true, composition: { waterGrams: '500', flours: [{ flourType: 'żytnia', grams: '500' }] } } });
  const unknown = await payload.create({ collection: 'ingredients', user: admin, overrideAccess: false, data: { name: 'Zakwas bez kompozycji', kind: 'starter', compositionKnown: false } });
  const base = { audience: 'bakers' as const, standalone: true, yield: 5, description: 'Syntetyczna receptura demonstracyjna. Nie jest instrukcją zatwierdzoną do rzeczywistej produkcji.', process: [{ instruction: 'Wymieszaj składniki.' }, { instruction: 'Prowadź ciasto według przyjętej procedury.' }], publishNow: true };
  await payload.create({ collection: 'recipes', user: admin, overrideAccess: false, data: { ...base, name: 'Chleb wiejski', ingredients: [{ ingredient: flour.id, mass: '2000' }, { ingredient: water.id, mass: '1560' }, { ingredient: salt.id, mass: '40' }, { ingredient: other.id, mass: '400' }] } });
  await payload.create({ collection: 'recipes', user: admin, overrideAccess: false, data: { ...base, name: 'Chleb z zakwasem żytnim', ingredients: [{ ingredient: flour.id, mass: '2000' }, { ingredient: starter.id, mass: '1000' }] } });
  await payload.create({ collection: 'recipes', user: admin, overrideAccess: false, data: { ...base, name: 'Chleb — nieznana kompozycja', ingredients: [{ ingredient: flour.id, mass: '2000' }, { ingredient: unknown.id, mass: '1000' }] } });
  await payload.create({ collection: 'recipes', user: admin, overrideAccess: false, data: { name: 'Nieopublikowany szkic', audience: 'editors' } });
  console.log('Created isolated synthetic demo: 3 publications, 1 draft, administrator/editor/baker accounts.');
} finally { await payload.destroy(); }
