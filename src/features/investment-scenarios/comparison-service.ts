import { APIError, type Payload, type PayloadRequest } from 'payload';
import { z } from 'zod';
import { authorizeOwner } from './access';
import { transaction, runScenario } from './service';
import { fingerprint } from './identity';
import { keySchema } from './values';
import { comparisonManifestSchema, type PinnedRun, type ComparisonManifest } from './comparison';
import { runBodyV2Schema, versionedSavedInputSchema } from './versioned';

export const saveComparisonSchema = z.strictObject({ comparisonKey: z.string().uuid(), requestKey: z.string().uuid(), runIds: z.array(z.number().int().positive()).min(2) });
export type SaveComparisonCommand = z.infer<typeof saveComparisonSchema>;
type ReadContext = { user: PayloadRequest['user']; overrideAccess: false; depth: 0; req?: PayloadRequest };

/** Authorize every edge, even with depth zero; never trust relationship expansion. */
export async function readPinnedRun(payload: Payload, context: ReadContext, runId: number): Promise<PinnedRun> {
  authorizeOwner({ user: context.user });
  const run = await payload.findByID({ collection: 'scenario-runs', id: runId, ...context });
  const body = runBodyV2Schema.parse(run.body);
  const revisionId = typeof run.revision === 'number' ? run.revision : run.revision.id;
  const revision = await payload.findByID({ collection: 'scenario-revisions', id: revisionId, ...context });
  const saved = versionedSavedInputSchema.parse(revision.body);
  if (revision.schemaVersion !== 2 || run.engineVersion !== 'investment-scenario/2' || run.fingerprint !== revision.fingerprint || fingerprint(JSON.parse(JSON.stringify(saved))) !== revision.fingerprint || fingerprint(JSON.parse(JSON.stringify(body.input))) !== revision.fingerprint) throw new APIError('Niezgodna tożsamość przebiegu.', 409);
  for (const publication of saved.publications) await payload.findByID({ collection: 'publications', id: publication.publicationId, ...context });
  return { runId: run.id, revisionId, revisionNumber: revision.revision, scenarioKey: revision.scenarioKey, fingerprint: revision.fingerprint, engineVersion: 'investment-scenario/2', body };
}
export async function prepareComparisonRun(payload: Payload, actor: PayloadRequest['user'], command: { revisionId: number; requestKey: string }) {
  authorizeOwner({ user: actor });
  const revision = await payload.findByID({ collection: 'scenario-revisions', id: command.revisionId, user: actor, overrideAccess: false, depth: 0 });
  if (revision.schemaVersion !== 2) throw new APIError('Porównanie wymaga zapisanej wersji MVP-2.', 400);
  const run = await runScenario(payload, actor, command);
  return readPinnedRun(payload, { user: actor, overrideAccess: false, depth: 0 }, run.id);
}
export async function saveComparison(payload: Payload, actor: PayloadRequest['user'], raw: SaveComparisonCommand) {
  authorizeOwner({ user: actor }); const command = saveComparisonSchema.parse(raw);
  return transaction(payload, actor, async req => {
    const context = { req, user: actor, overrideAccess: false as const, depth: 0 as const };
    const runs = await Promise.all(command.runIds.map(id => readPinnedRun(payload, context, id)));
    const manifest = comparisonManifestSchema.parse({ schemaVersion: 1, selections: runs.map(({ body: _body, ...identity }) => identity) });
    const digest = fingerprint(manifest);
    const replay = (await payload.find({ collection: 'scenario-comparisons', ...context, where: { requestKey: { equals: command.requestKey } }, limit: 1 })).docs[0];
    if (replay) {
      if (replay.comparisonKey !== command.comparisonKey || replay.fingerprint !== digest) throw new APIError('Klucz ponowienia dotyczy innego porównania.', 409);
      return replay;
    }
    return payload.create({ collection: 'scenario-comparisons', ...context, data: { owner: authorizeOwner(req).id, requestKey: command.requestKey, comparisonKey: command.comparisonKey, fingerprint: digest, schemaVersion: 1, runs: command.runIds, manifest } });
  });
}
export async function readComparison(payload: Payload, actor: PayloadRequest['user'], comparisonKey: string) {
  authorizeOwner({ user: actor }); keySchema.parse(comparisonKey);
  const context = { user: actor, overrideAccess: false as const, depth: 0 as const };
  const doc = (await payload.find({ collection: 'scenario-comparisons', ...context, where: { comparisonKey: { equals: comparisonKey } }, limit: 1 })).docs[0];
  if (!doc) throw new APIError('Brak dostępu.', 403);
  if (doc.schemaVersion !== 1) throw new APIError('Niezgodna wersja porównania.', 409);
  const manifest = comparisonManifestSchema.parse(doc.manifest);
  const runs = await Promise.all(manifest.selections.map(row => readPinnedRun(payload, context, row.runId)));
  assertManifestIdentity(manifest, runs, doc.fingerprint, (doc.runs ?? []).map(run => typeof run === 'number' ? run : run.id));
  return { comparisonKey: doc.comparisonKey, fingerprint: doc.fingerprint, manifest, runs };
}
export function assertManifestIdentity(manifest: ComparisonManifest, runs: PinnedRun[], digest: string, references: number[]) {
  const actual = { schemaVersion: 1, selections: runs.map(({ body: _body, ...identity }) => identity) };
  if (fingerprint(manifest) !== digest || fingerprint(actual) !== digest || JSON.stringify(references) !== JSON.stringify(manifest.selections.map(row => row.runId))) throw new APIError('Niezgodna tożsamość porównania.', 409);
}
