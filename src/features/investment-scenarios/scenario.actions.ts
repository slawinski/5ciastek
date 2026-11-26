'use server';
import { headers } from 'next/headers';
import { getPayload, APIError } from 'payload';
import { ZodError } from 'zod';
import config from '@/payload.config';
import { listScenarios, readScenario, readRevision, readRuns, saveScenario, runScenario, type SaveCommand } from './service';
import { authorizeOwner } from './access';
import { savedInputSchema } from './schema';
import { keySchema } from './values';
import { snapshotSchema } from '../recipes/schema';
import { validationMessage } from './validation';
import { runBodySchema } from './report-schema';

async function session() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  authorizeOwner({ user }); return { payload, user };
}
function failure(error: Error | ZodError | APIError) {
  const status = 'status' in error && typeof error.status === 'number' ? error.status : 500;
  console.error('scenario-command', { category: error.name, status });
  if (error instanceof ZodError) return { ok: false as const, category: 'validation', message: 'Popraw wskazane dane.', fields: error.issues.map(issue => ({ path: issue.path.join('.'), message: validationMessage(issue) })) };
  return { ok: false as const, category: status === 403 || status === 404 ? 'denied' : status === 409 ? 'conflict' : 'persistence', message: status === 403 || status === 404 ? 'Brak dostępu. Zaloguj się kontem właściciela.' : status === 409 ? 'Konflikt wersji lub klucza ponowienia. Otwórz najnowszą wersję.' : 'Nie potwierdzono odczytu lub zapisu. Zachowaj dane i ponów operację.', fields: [] };
}
export async function loadWorkspaceAction(scenarioKey: string | null, revisionId: number | null = null) {
  try {
    const { payload, user } = await session();
    if (scenarioKey !== null) keySchema.parse(scenarioKey);
    const list = await listScenarios(payload, user);
    const revisions = scenarioKey ? (await readScenario(payload, user, scenarioKey)).docs : [];
    if (scenarioKey && !revisions.length) throw new APIError('Brak dostępu.', 403);
    const publications = await payload.find({ collection: 'publications', user, overrideAccess: false, depth: 0, limit: 0 });
    if (revisionId !== null && (!Number.isSafeInteger(revisionId) || revisionId <= 0)) throw new APIError('Niepoprawna wersja.', 400);
    const active = revisionId === null ? revisions[0] : scenarioKey ? await readRevision(payload, user, scenarioKey, revisionId) : null;
    if (revisionId !== null && !active) throw new APIError('Brak dostępu.', 403);
    const runs = active ? (await readRuns(payload, user, active.id)).docs : [];
    const runBody = runs[0] ? runBodySchema.parse(runs[0].body) : null;
    return { ok: true as const, scenarios: [...new Map([...list.docs].reverse().map(doc => [doc.scenarioKey, { key: doc.scenarioKey, name: savedInputSchema.parse(doc.body).input.name }])).values()],
      revisions: revisions.map(revision => ({ id: revision.id, number: revision.revision })),
      publications: publications.docs.map(doc => ({ id: doc.id, versionKey: doc.versionKey, name: snapshotSchema.parse(doc.snapshot).name })),
      revision: active ? { id: active.id, number: active.revision, fingerprint: active.fingerprint, saved: savedInputSchema.parse(active.body) } : null,
      run: active && runs[0] && runBody ? { id: runs[0].id, revisionNumber: active.revision, report: runBody.output, input: runBody.input } : null };
  } catch (error) { return failure(error instanceof ZodError || error instanceof Error ? error : new Error('Source failure')); }
}
export async function saveScenarioAction(command: SaveCommand) {
  try { const { payload, user } = await session(); const doc = await saveScenario(payload, user, command);
    return { ok: true as const, revision: { id: doc.id, number: doc.revision, fingerprint: doc.fingerprint, saved: savedInputSchema.parse(doc.body) } };
  } catch (error) { return failure(error instanceof ZodError || error instanceof Error ? error : new Error('Save failure')); }
}
export async function runScenarioAction(command: { revisionId: number; requestKey: string }) {
  try { const { payload, user } = await session(); const doc = await runScenario(payload, user, command);
    const body = runBodySchema.parse(doc.body);
    return { ok: true as const, run: { id: doc.id, report: body.output, input: body.input } };
  } catch (error) { return failure(error instanceof ZodError || error instanceof Error ? error : new Error('Run failure')); }
}
