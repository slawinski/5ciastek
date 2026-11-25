import assert from 'node:assert/strict';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { snapshotSchema } from '@/features/recipes/schema';

assert.match(process.env.DATABASE_URI ?? '', /\/5ciastek-recipes-test-[^/]+\/restored\.db$/);
const payload = await getPayload({ config });
try {
  const baker = (await payload.find({ collection: 'users', where: { email: { equals: 'baker@example.invalid' } } })).docs[0];
  const publication = await payload.findByID({ collection: 'publications', id: 1, user: baker, overrideAccess: false, depth: 2 });
  const snapshot = snapshotSchema.parse(publication.snapshot);
  assert.equal(snapshot.name, 'Chleb wiejski');
  assert.equal(snapshot.totalGrams, '3000.000');
  assert.equal(snapshot.ingredients[1].composition?.waterGrams, '500');
  assert.equal(snapshot.ingredients[1].composition?.flours[0].flourType, 'żytnia');
  assert.equal(publication.recipe, 1);
  assert.equal(snapshot.ingredients[0].ingredientId, 1);
  assert.equal(snapshot.ingredients[1].ingredientId, 2);
  await assert.rejects(payload.findByID({ collection: 'recipes', id: 1, user: baker, overrideAccess: false }));
  const latest = (await payload.find({ collection: 'publications', user: baker, overrideAccess: false, where: { recipe: { equals: 1 } }, sort: '-version', depth: 0 })).docs[0];
  assert.equal(snapshotSchema.parse(latest.snapshot).name, 'Durable after contention');
  const editor = (await payload.find({ collection: 'users', where: { email: { equals: 'editor@example.invalid' } } })).docs[0];
  const draft = await payload.findByID({ collection: 'recipes', id: 1, user: editor, overrideAccess: false });
  assert.equal(draft.publicationNumber, latest.version);
  const bulk = (await payload.find({ collection: 'publications', user: baker, overrideAccess: false, limit: 100, depth: 0 })).docs.map(doc => snapshotSchema.parse(doc.snapshot)).filter(doc => doc.name.startsWith('Bulk ')).sort((a, b) => a.name.localeCompare(b.name));
  assert.deepEqual(bulk.map(doc => [doc.name, doc.totalGrams]), [['Bulk 0', '11.001'], ['Bulk 1', '22.002']]);
} finally { await payload.destroy(); }
