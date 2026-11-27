'use server';
import { headers } from 'next/headers';
import { APIError, getPayload } from 'payload';
import { ZodError } from 'zod';
import config from '@/payload.config';
import { authorizeOwner } from './access';
import { listScenarios } from './service';
import { prepareComparisonRun, readComparison, saveComparison, type SaveComparisonCommand } from './comparison-service';
import { versionedSavedInputSchema } from './versioned';

async function session() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  authorizeOwner({ user }); return { payload, user };
}
function failure(error: Error) {
  const status = error instanceof APIError ? error.status : 500;
  return { ok: false as const, category: status === 403 || status === 404 ? 'denied' : status === 409 ? 'conflict' : 'persistence', message: error instanceof ZodError ? 'Niepoprawny wybór. Wybierz różne zapisane warianty MVP-2.' : status === 403 || status === 404 ? 'Brak dostępu. Zaloguj się kontem właściciela.' : status === 409 ? 'Konflikt treści lub klucza ponowienia porównania.' : 'Nie potwierdzono operacji. Zachowano wybór; ponów z tym samym kluczem.' };
}
export async function listComparisonOptionsAction() {
  try {
    const { payload, user } = await session();
    const revisions = await listScenarios(payload, user);
    const comparisons = await payload.find({ collection: 'scenario-comparisons', user, overrideAccess: false, depth: 0, pagination: false, limit: 0, sort: '-createdAt' });
    return { ok: true as const, revisions: revisions.docs.filter(doc => doc.schemaVersion === 2).map(doc => ({ id: doc.id, number: doc.revision, scenarioKey: doc.scenarioKey, name: versionedSavedInputSchema.parse(doc.body).input.name })), comparisons: comparisons.docs.map(doc => ({ key: doc.comparisonKey, createdAt: doc.createdAt })) };
  } catch (error) { return failure(error instanceof Error ? error : new Error('Read failure')); }
}
export async function prepareComparisonAction(command: { revisionId: number; requestKey: string }) {
  try { const { payload, user } = await session(); return { ok: true as const, run: await prepareComparisonRun(payload, user, command) }; }
  catch (error) { return failure(error instanceof Error ? error : new Error('Run failure')); }
}
export async function saveComparisonAction(command: SaveComparisonCommand) {
  try { const { payload, user } = await session(); const doc = await saveComparison(payload, user, command); return { ok: true as const, comparisonKey: doc.comparisonKey }; }
  catch (error) { return failure(error instanceof Error ? error : new Error('Save failure')); }
}
export async function loadComparisonAction(comparisonKey: string) {
  try { const { payload, user } = await session(); return { ok: true as const, comparison: await readComparison(payload, user, comparisonKey) }; }
  catch (error) { return failure(error instanceof Error ? error : new Error('Read failure')); }
}
