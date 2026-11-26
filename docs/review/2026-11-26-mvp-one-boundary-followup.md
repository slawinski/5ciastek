# MVP-1 boundary follow-up — 2026-11-26

Independent, single-reviewer follow-up of original findings #3/#8/#11/#12/#13/#15 against the working tree at HEAD `0ee305b95a37072af1a012eb819a1d733531906d`, including uncommitted fixes. Original receipt: `/var/folders/zl/fkgnlthd363175f4ffymzcjh0000gn/T/opencode/ce-code-review/mvp-one-merge-20261125/review.json`. Authority: TASK-INV-001, SCN-REQ-007/008/020/021 and architecture AS1. No product fixes, commits, pushes or delegated review.

## Result

**All six scoped findings are resolved.** The follow-up initially found the #12 defect below. The final action-boundary correction preserves `ZodError` explicitly in all three catches; a fresh production build and the complete unchanged HTTP smoke passed on Node 24.22.3 on 2026-11-26. The historical diagnosis and initial failed checks below explain why service-only proof was insufficient.

| Finding | Receipt |
|---|---|
| #3 — peer account takeover/deletion | Closed for the reviewed native paths. `src/collections/recipes.ts:23–42` rejects peer password/email changes per document and counts owned revisions before peer deletion, independent of the owner's current role. Installed Payload 3.94.2 bulk update calls `updateDocument` (`dist/collections/operations/update.js:260–290`); its collection `beforeChange` runs before password hashing (`utilities/update.js:156–169,302–310`). Single and bulk delete execute `beforeDelete` before deletion (`deleteByID.js:68–79`, `delete.js:107–118`). These are real operation paths, not direct hook invocations or replaced security hooks. Integration checks include a demoted owner's deletion refusal. HTTP diagnostic checks verify single/bulk peer password and email refusals, single/bulk owner deletion refusals, failed takeover logins, preserved legitimate owner login, and cross-owner scenario denial. |
| Legitimate Users operations | HTTP diagnostic checks retain administrator provisioning, role changes with unchanged email, bulk role changes, deletion of an account without scenarios, and single/bulk self credential changes followed by successful authentication. Integration also exercises actor-free trusted Local API recovery. Native hash/salt/reset-token fields deny client create/update in installed Payload; the ownership hooks do not grant an HTTP recovery bypass. |
| #8 — creation-route history | Closed. `ScenarioWorkspace.tsx:40–50` uses the established `key.current` for explicit revision loads. The component regression creates two revisions with `scenarioKey=null`, opens revision 1, checks the saved key passed to the action and restored inputs. |
| #11 — full history/owned lookup | Closed. `service.ts:25–37` fetches all owner-filtered revisions with `pagination:false, limit:0`; explicit selection uses access-enforced `findByID` plus a scenario-key check. The real-database test retains 101 revisions and a second scenario, returns the oldest revision, and rejects wrong-scenario and cross-owner IDs (`investment-scenarios.integration.test.ts:131–138`). The action uses that explicit lookup (`scenario.actions.ts:34`). HTTP diagnostic wrong-scenario/cross-owner selection assertions also pass. |
| #13 — assembled HTTP history proof | Closed as a test-coverage finding. The smoke now accepts multiple action arguments and checks exact saved revision/input/publication IDs and version keys, run identity/input/report, edited revision 2 with a new publication, and explicit revision-1 readback (`scripts/investment-scenarios-smoke.ts:40–44,63–89`). Those assertions complete in the HTTP diagnostic pass; this does not make the stock smoke green. |
| #15 — pending-logout retry race | Closed. `ScenarioWorkspace.tsx:33,40–46,90–100` blocks loads synchronously while logout is pending and clears/increments the response generation both before and after logout. `scenarioMachine.ts:15` blocks reload/late events in `loggingOut`. Deferred-promise component checks cover pending logout, late history/run responses, successful logout with no restored protected data, and recovery only after failed logout settles. |

## Remaining actionable issue

### #12 / P2 — action discards the new field-validation error

**Location:** `src/features/investment-scenarios/scenario.actions.ts:48`, interacting with `service.ts:55–57`.

The service correctly rejects an invalid publication step with path `input.operations.2.step`, but constructs it using `new z.ZodError(issues)`. In installed Zod **4.6.7**, that object satisfies `instanceof ZodError` but **not** `instanceof Error`. The action catch therefore substitutes `new Error('Save failure')` before `failure()` can recognize it. Built HTTP returns `category='persistence', fields=[]`, rather than validation with the editable field and Polish message. Retrying cannot repair that input. No revision is appended.

**Requested correction:** preserve `ZodError` explicitly at the action catch boundary before generic error normalization, retaining the existing validation mapping. Keep the production smoke's exact category/path/message assertions; they already reproduce the defect. Do not treat the passing service-only Zod assertion as action-boundary closure.

## Executed verification

- `npm run test -- src/features/investment-scenarios/components/ScenarioWorkspace.test.tsx src/features/investment-scenarios/scenarioMachine.test.ts` — **12/12 passed**.
- `npm run test:scenarios` — **passed**, real isolated SQLite database, including native Users operations, rollback/no append for invalid steps, 101-revision history and explicit owned lookup.
- `npm run build` with synthetic explicit environment — **passed**. Generated Next type imports were returned to development paths afterward.
- `npm run test:scenarios:production` — **failed at line 72**, both before and after a fresh build: actual `persistence`, expected `validation`. This is reproducible on the current build, not explained by a stale artifact.
- Additional in-memory diagnostic wrapper around the unchanged smoke recorded only the two assertion failures at lines 72–73 and continued through every remaining assertion. Result: exactly those **two #12 failures**; all remaining HTTP assertions completed, including preserved revision count, historical readback and native account-security/self/provision/role operations. No request, hook or service behavior was replaced. This diagnostic is **not** a passing stock smoke.
- Direct installed-library probe: `new z.ZodError([...]) instanceof Error` is `false`; `instanceof ZodError` is `true`. A schema `.parse()` failure is an `Error`, explaining why ordinary schema validation and the service test do not expose the same catch-boundary problem.

Current Payload and Zod documentation were consulted through Context7; installed implementation and runtime results determined version-specific conclusions. References: [Payload collection hooks](https://payloadcms.com/docs/hooks/collections), [Zod core errors](https://zod.dev/packages/core#errors). Documentation now also describes newer Payload defaults; the installed v3 code and explicit access flags were used here.

Coverage limits: UI race evidence is component/state-machine execution, not a new browser session. Checks ran on available Node **24.8.0**, rather than repository-pinned **24.22.3**. This scoped follow-up does not reassess the other original findings or establish release approval.
