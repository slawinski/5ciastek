// Frozen v1 entry points. MVP-2 uses version-specific domain evaluators; these
// modules retain the persisted v1 protocol and numerical semantics.
export { scenarioSchema, savedInputSchema } from './schema';
export { reportSchema, runBodySchema } from './report-schema';
export { evaluateScenario, ENGINE_VERSION } from './evaluate';
