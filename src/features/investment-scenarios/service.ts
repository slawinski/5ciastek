import { APIError, createLocalReq, type Payload, type PayloadRequest } from 'payload';
import { z } from 'zod';
import { appendContext, authorizeOwner } from './access';
import { versionedScenarioSchema, versionedSavedInputSchema } from './versioned';
import { keySchema } from './values';
import { fingerprint } from './identity';
import { snapshotSchema } from '../recipes/schema';
import { scaleRecipe } from '../recipes/scaling';
import { evaluateScenario } from './evaluate';
import { evaluateScenarioV2 } from './evaluate-v2';

export const saveCommandSchema = z.strictObject({ scenarioKey: keySchema, expectedRevision: z.number().int().nonnegative(), requestKey: z.string().uuid(), input: versionedScenarioSchema });
export type SaveCommand = z.input<typeof saveCommandSchema>;
export async function transaction<T>(payload: Payload, actor: PayloadRequest['user'], operation: (req: PayloadRequest) => Promise<T>): Promise<T> {
  const req = await createLocalReq({ user: actor ?? undefined, context: appendContext() }, payload);
  authorizeOwner(req);
  const id = await payload.db.beginTransaction();
  if (id == null) throw new APIError('Transakcje są niedostępne.', 503);
  req.transactionID = id;
  try {
    const result = await operation(req);
    await payload.db.commitTransaction(id);
    return result;
  } catch (error) { await payload.db.rollbackTransaction(id); throw error; }
}
export async function listScenarios(payload: Payload, actor: PayloadRequest['user']) {
  authorizeOwner({ user: actor });
  return payload.find({ collection: 'scenario-revisions', user: actor, overrideAccess: false, depth: 0, sort: '-revision', pagination: false, limit: 0 });
}
export async function readScenario(payload: Payload, actor: PayloadRequest['user'], scenarioKey: string) {
  authorizeOwner({ user: actor }); keySchema.parse(scenarioKey);
  return payload.find({ collection: 'scenario-revisions', user: actor, overrideAccess: false, depth: 0, where: { scenarioKey: { equals: scenarioKey } }, sort: '-revision', pagination: false, limit: 0 });
}
export async function readRevision(payload: Payload, actor: PayloadRequest['user'], scenarioKey: string, revisionId: number) {
  authorizeOwner({ user: actor }); keySchema.parse(scenarioKey); z.number().int().positive().parse(revisionId);
  const revision = await payload.findByID({ collection: 'scenario-revisions', id: revisionId, user: actor, overrideAccess: false, depth: 0 });
  if (revision.scenarioKey !== scenarioKey) throw new APIError('Brak dostępu.', 403);
  return revision;
}
export async function saveScenario(payload: Payload, actor: PayloadRequest['user'], raw: SaveCommand) {
  authorizeOwner({ user: actor });
  const command = saveCommandSchema.parse(raw);
  const commandFingerprint = fingerprint(JSON.parse(JSON.stringify(command.input)));
  return transaction(payload, actor, async req => {
    const replay = (await payload.find({ collection: 'scenario-revisions', req, overrideAccess: false, depth: 0, where: { requestKey: { equals: command.requestKey } }, limit: 1 })).docs[0];
    if (replay) {
      const stored = versionedSavedInputSchema.parse(replay.body);
      if (replay.scenarioKey !== command.scenarioKey || replay.revision !== command.expectedRevision + 1 || fingerprint(JSON.parse(JSON.stringify(stored.input))) !== commandFingerprint) throw new APIError('Klucz ponowienia dotyczy innej treści.', 409);
      return replay;
    }
    const latest = (await payload.find({ collection: 'scenario-revisions', req, overrideAccess: false, depth: 0, where: { scenarioKey: { equals: command.scenarioKey } }, sort: '-revision', limit: 1 })).docs[0];
    if ((latest?.revision ?? 0) !== command.expectedRevision) throw new APIError('Wariant został zmieniony. Otwórz najnowszą wersję.', 409);
    const publications = await Promise.all(command.input.products.map(async product => {
      const publication = await payload.findByID({ collection: 'publications', id: product.publicationId, req, overrideAccess: false, depth: 0 });
      const snapshot = snapshotSchema.parse(publication.snapshot);
      const issues = command.input.operations.flatMap((operation, index) => operation.productId === product.id && !snapshot.process[operation.step]
        ? [{ code: 'custom' as const, path: ['input', 'operations', index, 'step'], message: 'Nieznany etap publikacji.' }] : []);
      if (issues.length) throw new z.ZodError(issues);
      const targets = command.input.schemaVersion === 1 ? command.input.products.filter(row => row.id === product.id).map(row => row.target) : command.input.batches.filter(batch => batch.productId === product.id).map(batch => batch.target);
      for (const target of targets) scaleRecipe(snapshot, target);
      return { productId: product.id, publicationId: publication.id, versionKey: publication.versionKey, snapshot };
    }));
    const body = versionedSavedInputSchema.parse({ input: command.input, publications });
    return payload.create({ collection: 'scenario-revisions', req, overrideAccess: false, depth: 0, data: {
      owner: authorizeOwner(req).id, scenarioKey: command.scenarioKey, revision: command.expectedRevision + 1, previousRevision: latest?.id,
      requestKey: command.requestKey, fingerprint: fingerprint(JSON.parse(JSON.stringify(body))), schemaVersion: command.input.schemaVersion, body,
    } });
  });
}

export const runCommandSchema = z.strictObject({ revisionId: z.number().int().positive(), requestKey: z.string().uuid() });
export async function runScenario(payload: Payload, actor: PayloadRequest['user'], raw: z.input<typeof runCommandSchema>) {
  authorizeOwner({ user: actor }); const command = runCommandSchema.parse(raw);
  const revision = await payload.findByID({ collection: 'scenario-revisions', id: command.revisionId, user: actor, overrideAccess: false, depth: 0 });
  const saved = versionedSavedInputSchema.parse(revision.body);
  for (const publication of saved.publications) await payload.findByID({ collection: 'publications', id: publication.publicationId, user: actor, overrideAccess: false, depth: 0 });
  return transaction(payload, actor, async req => {
    const replay = (await payload.find({ collection: 'scenario-runs', req, overrideAccess: false, depth: 0, where: { requestKey: { equals: command.requestKey } }, limit: 1 })).docs[0];
    if (replay) {
      if (replay.revision !== command.revisionId || replay.fingerprint !== revision.fingerprint) throw new APIError('Klucz ponowienia dotyczy innego przebiegu.', 409);
      return replay;
    }
    const output = saved.input.schemaVersion === 2 ? evaluateScenarioV2({ input: saved.input, publications: saved.publications }) : evaluateScenario({ input: saved.input, publications: saved.publications });
    return payload.create({ collection: 'scenario-runs', req, overrideAccess: false, depth: 0, data: {
      owner: authorizeOwner(req).id, revision: revision.id, requestKey: command.requestKey, fingerprint: revision.fingerprint,
      engineVersion: output.engineVersion, body: { input: saved, output },
    } });
  });
}
export async function readRuns(payload: Payload, actor: PayloadRequest['user'], revisionId: number) {
  authorizeOwner({ user: actor });
  await payload.findByID({ collection: 'scenario-revisions', id: revisionId, user: actor, overrideAccess: false, depth: 0 });
  return payload.find({ collection: 'scenario-runs', user: actor, overrideAccess: false, depth: 0, where: { revision: { equals: revisionId } }, sort: '-createdAt', limit: 100 });
}
