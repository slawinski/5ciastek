# MVP-1 local implementation verification

Date: 2026-11-26 (latest local review-fix verification; initial implementation evidence: 2026-11-25). Task authority: [TASK-INV-001](../projects/investment-scenarios.md#task-inv-001). Implementation source: [reviewed U1–U8 plan](../plans/2026-11-25-1641-feat-mvp-one-investment-scenario-plan.md), SHA-256 `f2afaa6aee6f702ed892cd773e04b188d439a2993b50d9551dd8fa8a24a6e844`.

Workspace: `/Users/psla/private-space/5ciastek`, branch `feat/mvp-one-investment-scenario`, based on `65abf5ded40fda8c242ec7b6da97b8fcb24164ec`. Verification ran on the implementation working tree before the native host's local canonical checkpoint; the baseline SHA does not identify the new code as a committed artifact. The checkpoint SHA is recorded in the structured return. Final review, any remaining commits and publication remain caller-owned. Code-content SHA-256: `4f33a37fa4fc5509eb7e79bdbfe6bee9ac0ae38c93e2afd60cec492ef10d33d5` (49 changed code/config/test/generated paths; sorted path, NUL, bytes, NUL). The [structured work-return receipt](mvp-one-work-return.json) identifies the exact changed files and route/evidence records. Preexisting `docs/ideation/`, the selected plan and its review receipt were preserved.

Environment: Darwin, Node **24.22.3**, npm **11.6.0**, manifest/lockfile-installed Next **16.4.6**, React **19.3.1**, Payload/SQLite adapter **3.94.2**. The shell initially had Node 24.8.0; install emitted engine warnings. `npm exec --yes --package=node@24.22.3 -- <command>` supplied the pinned runtime for subsequent checks without changing dependency versions. `npm ci` installed 630 packages and reported zero audit findings.

## Initial implementation checks (2026-11-25)

Local logs are in `/var/folders/zl/fkgnlthd363175f4ffymzcjh0000gn/T/opencode/` with the names below. Database suites allocate fresh `5ciastek-*-test-*` OS-temporary targets; HTTP smoke owns a fresh `5ciastek-production-smoke-*` directory. They do not consume an ambient production URI or real accounts. The browser target listened only on `127.0.0.1:3198` with synthetic accounts. Production builds used a separate explicit synthetic file URI and nonproduction build secret.

| Check | Actual result | Log |
|---|---|---|
| `npm ci` | Passed; engine warnings on initial shell Node, then pinned Node used | Installation output in execution transcript |
| `npm run lint` | Passed | `mvp-one-lint.log` |
| `npm run typecheck` | Passed | `mvp-one-types.log` |
| `npm test` | Passed: 64 tests in 16 files; integration files excluded | `mvp-one-unit.log` |
| `npm run test:integration` | Passed: 5 top-level node:test cases, including recipe and scenario DB suites | `mvp-one-integration.log` |
| `npm run build` | Passed; both scenario routes/actions in optimized Next build | `mvp-one-build.log` |
| `npm run test:production` | Passed existing migrated recipe/auth/history/bulk/precision proof | `mvp-one-production.log` |
| `npm run test:scenarios:production` | Passed built save/reopen/run actions, A/B results, retry, REST ownership and forged-write refusal | `mvp-one-browser.log` |
| `npm run security` | Passed limited tracked-path secret-pattern scan and npm audit: zero vulnerabilities | `mvp-one-security.log` |
| Additional owned-file pattern scan | Includes new/untracked implementation paths, excludes preexisting plan/review/ideation; limited patterns, not an exhaustive secret audit | `mvp-one-owned-evidence.json` |
| UI mechanical detector | `[]`, no findings for changed components/routes/header | Detector output in execution transcript |

## Final local review-fix checks (2026-11-26)

These results supersede the initial check table for the corrected working tree. The original code-content hash and work-return receipt above describe the earlier implementation checkpoint, not this corrected tree. No source fixes, dependency installation, commits or publication were performed during this verification pass. The only intentional repository edit was this receipt; the production build also regenerated `next-env.d.ts`.

Pinned invocation: `npm exec --yes --package=node@24.22.3 -- node /var/folders/zl/fkgnlthd363175f4ffymzcjh0000gn/T/opencode/mvp-one-final-checks-20261126.mjs`. The runner observed Node **24.22.3**, invoked the exact commands below sequentially, and retained exit statuses in `results.json`. One production build completed before both smoke commands; no concurrent build was launched. Logs are under `/var/folders/zl/fkgnlthd363175f4ffymzcjh0000gn/T/opencode/mvp-one-final-20261126/`.

| Exact command | Observed result | Log basename |
|---|---|---|
| `npm run lint` | Passed, exit 0 | `lint.log` |
| `npm run typecheck` | Passed, exit 0 | `typecheck.log` |
| `npm test` | Passed, exit 0: **115 tests, 16 files** | `test.log` |
| `npm run test:integration` | Passed, exit 0: **5 tests**, 0 failed/cancelled/skipped/todo | `integration.log` |
| `npm run build` | Passed, exit 0: optimized Next 16.4.6 webpack build, including both scenario routes | `build.log` |
| `npm run test:production` | Passed, exit 0: migrated recipe/auth/history/contention/bulk/precision/role proof | `production.log` |
| `npm run test:scenarios:production` | **Failed, exit 1**: invalid publication step returned `persistence`, expected `validation`, at `scripts/investment-scenarios-smoke.ts:72:47` | `scenarios-production.log` |
| `npm run security` | Passed, exit 0: limited secret-pattern scan over 434 tracked paths; npm audit found **0 vulnerabilities** | `security.log` |
| `git diff --check` | Passed, exit 0 | `diff-check.log` |

### Review-fix verification summary

- Passing unit regressions cover dimension-normalized cost arithmetic, independent cash unit/period qualification, whole-piece required-sales rounding, duplicate expense/full-unit-cost exclusion, measured staffing consistency, transfer destination validation and provenance/expiry/admission preservation, creation-route revision history, logout/late-response isolation, and stable save/run retry identities.
- Passing isolated integration evidence includes rejection of nonexistent publication steps before revision append, plus peer credential/deletion denial. The native invalid-step assertion expects a `ZodError` and passes.
- **Unresolved built-action blocker:** scenario HTTP smoke successfully saves/replays/runs/reopens the reference scenario, then fails on the new invalid-step validation-category assertion. Subsequent v2/history, peer-account and forged-write assertions in that command are **not reached** and cannot be claimed as passing for this tree. The service throws `new z.ZodError(issues)` for this condition; action error mapping uses `instanceof ZodError`. The observed built response is misclassified, but this pass did not establish the underlying cause. There was no evidence of timing flakiness, so the failing command was not retried.
- The runner supplied an explicit synthetic `DATABASE_URI` (`file:<log-directory>/build-only.db`) and a fresh nonproduction build secret. Integration and smoke scripts create and clean up their own fresh databases; scenario browser-hold mode was explicitly disabled. The live demo listener at `127.0.0.1:3002` retained PID **24923** before and after checks; its database was not selected by these commands.
- `next-env.d.ts` was already modified at entry, importing `.next/dev/types/routes.d.ts` and `.next/dev/types/root-params.d.ts`. Build regenerated imports to `.next/types/routes.d.ts` and `.next/types/root-params.d.ts`, leaving no diff against HEAD at inspection. Both versions are retained as `next-env.before.txt` and `next-env.after.txt` in the log directory. No manual restoration was made; the parent owns that decision.

The initial failure above was resolved on 2026-11-26: all three action catches now preserve `ZodError` explicitly before generic `Error` normalization. Installed Zod's manually constructed error need not extend `Error`. A fresh production build with explicit synthetic environment and the unchanged `npm run test:scenarios:production` both passed under Node 24.22.3. The complete smoke reached invalid-step field validation, v2/history readback, peer-account protections and forged-write assertions. This supersedes the blocker above. Earlier browser images remain historical evidence; this final check used built HTTP smoke rather than a new interactive browser matrix. Hosted CI and actual-data release approval are separate.

## Requirement and unit evidence

| Unit / canonical coverage | Executable evidence and observed outcome |
|---|---|
| U1 — SCN-REQ-001/002/006/020; PRC-REQ-005; DEC-001 | `schema.test.ts`: provenance/missing/zero round-trip, exact g/kg normalization, precision rejection, offset/zone and midnight boundaries, cycles/staffing/context reuse, conflicting movement identity and fingerprints. Input/result schemas preserve JSON-safe contracts. New-schema tests first failed on absent modules; the final behavioral assertions pass. |
| U2 — SCN-REQ-007/020; SCN-AC-002/005/017/018; STK-AC-009; ECO-AC-013 | `investment-scenarios.integration.test.ts`: real publication selection; save/read, lost-response replay identity, changed-content conflict, stale/competing saves, native mutation denial, actor isolation, append failure, actual COMMIT failure via independent reader lock, durable post-contention write and invalid publication refusal. Later ingredient/publication edits preserve saved v1. HTTP smoke additionally denies anonymous/editor/baker/other-owner reads/runs and forged REST/action fields. |
| U3 — PRC-AC-001–006/008; SCN-AC-003/008/009/016 | Process tests: A20 oven 06:00–06:30; B12 waits 15 min and finishes 06:50; baker 30 person-minutes; over-capacity conflict, shared baker contention, passive child boundary, wait-window equality/missing/overrun, 10×1 + 20×2 = 50 person-minutes, retained cross-midnight passive start, explicit yield conversion and exact 1/3-g capacity comparison. Reversed operation display rows retain the same result. Initial tests failed because the evaluator was absent. |
| U4 — STK-REQ-001–003/007/008; STK-AC-003/006/009; SCN-AC-010 | Stock tests: exact 20,000−19,500−500 = 0 g, atomic rejected excess issue, unknown opening, pre-readiness sale refusal, duplicate movement replay/conflict, inadmissible returns/refund neutrality, limited supported sales, expiry, transfer source-part conservation and mass/piece conversion. Connected test consumes frozen recipe requirements, leaving 4,000 g from 20,000 g for A20/B12 at 500 g each. Initial tests failed on missing evaluator. |
| U5 — ECO-AC-001–006/013; SCN-AC-006/011 | Economics tests: signed half-cent rounding, required 2,400 pieces/48,000 PLN, sold mix 80/80 with production 80/100 and 4,000−1,800=2,200 PLN; no finite requirement for nonpositive contribution/100% loss; one 30-minute/60-PLN-hour pool allocated 15+15 PLN; 10 kg×4 + 5 + 2×1 = 47 PLN; separate gross margin/contribution/operating/cash; missing/mixed bases withhold dependent totals and ratios. Missing fixed costs are not zero. Initial tests failed on missing arithmetic/required-sales modules. |
| U6 — SCN-AC-001/002/006/021 | Pure connected test plus migrated service/run tests produce 460 revenue −224 variable =236 contribution −100 day costs −80 seller =56 PLN, before owner charges/income. Persisted readback retains 15-minute wait/30 person-minutes, exact inputs, fingerprint and engine identity. A separate persisted structured 2,200-piece process compares to required 2,400 and reports deficit 200; capacity is not injected as a summary. Run append/COMMIT failure and retry are exercised. Available non-scenario collection state is compared before/after. Report decoder rejects malformed monetary output. |
| U7 — SCN-AC-017–019; F1–F3 | Machine/component tests cover save-before-run, retained local input/report on conflict, stale response after switch/logout, third-product addition, confirmed revision-selector update and prior-result labeling. Browser exercises actual publication control, manual source/context entry, save/run/reload, historical revision selection, invalid negative quantity, Polish field error, retained prior report and focus reveal. Existing catalog/navigation tests remain in the unit run. |
| U8 — connected proof, migration/recovery, assurance/design boundary | Built HTTP smoke exercises the real Next action IDs and Payload auth/REST. Fresh-process populated restore compares exact revision/run JSON, sources/relations and owner denial. Recipe migration regression applies the additive migration to populated recipes and compares unchanged rows/snapshots; existing injected migration-failure proof remains green. CI invokes both integration suites and both HTTP smoke commands. Architecture, task evidence and command documentation are linked. |

## Browser evidence

Chromium/Playwright drove the optimized built app against the owned synthetic database. The tested owner opened the HTTP-created variant, edited/saved/reran it and reloaded the same confirmed history. A prior report retained its old revision when inputs changed. The final revision selector was checked after confirmation and used to reopen versions 1 and 2. Negative production quantity produced a Polish error; its link opened the lazy input section and focused `input-input.products.0.target`, preserving `-1` and the prior confirmed report until reload. Keyboard Enter executed the run action with visible solid focus. Source/context control entry was also exercised during the local iteration.

| Surface | Result | Image |
|---|---|---|
| Phone 390×844 | Document width 390; no horizontal page overflow; readable commands/state | [Phone](mvp-one-phone.png) |
| Tablet 768×1024 | Document width 768; readable report/financial separation | [Tablet](mvp-one-tablet.png) |
| Desktop 1440×1000 | Document width 1440; existing shell/tokens and report | [Desktop](mvp-one-desktop.png) |
| 200% CSS zoom at desktop | Document width 1440; retained chronology meaning/reflow | [Zoom](mvp-one-zoom.png) |

`prefers-reduced-motion: reduce` was active for the captured matrix; labels and numbers remain present. Zoom evidence is explicitly CSS zoom, not a claim of native browser-menu 400% zoom or a full accessibility audit. The caller's independent browser/design gate remains pending.

## Failures found and corrected

- The initial Node runtime did not match the manifest; checks switched to available Node 24.22.3.
- New unit tests initially failed on absent modules, then passed after implementation. A schema test accidentally constructed a missing evidence object with stale known-value fields; the fixture was corrected rather than weakening strict validation.
- The stock fixture initially assigned three movements the same instant, allowing stable-ID order to differ from its intended chronology; explicit movement times now prove the intended consumption/loss/over-issue sequence.
- A native Local API persistence test passed while built HTTP save failed with `Forbidden`. Separate Next bundles had different object-sentinel identities. A process-stable symbol preserves the trusted server boundary across bundles; built smoke now proves legitimate appends and forged-write denial.
- The original recipe down/up test assumed there was only one migration. It now removes the additive scenario migration first and separately verifies populated recipe preservation. Dependency order in the generated scenario down migration was corrected for isolated destructive tests.
- Staged whitespace checking found the generator's mixed space/tab indentation inside SQL literals. Indentation was normalized without changing SQL tokens; the integration suites and production build were rerun successfully.
- Component tests exposed excessive hidden form rendering; closed object sections now render lazily. Focus-to-error opens the required ancestors.
- Browser proof found the revision dropdown still showing version 1 after saving version 2, and default schema text in English. Selector/history updates and Polish validation mapping are covered by regressions. A pending-run logout regression proves obsolete completion cannot restore protected data.

## Remaining delivery and release ownership

This receipt is local implementation evidence. Final simplify, independent code review, independent browser QA, any remaining commits, PR publication, hosted CI and merge remain caller-owned. The native host records the local implementation checkpoint required by `ce-work`; it performs no independent publication. No PR, push, hosted CI result, branch-protection activation or release approval is claimed here.

AS1 remains the approved plan's implementation default, not an organization/tenant model. Real-account/data use still needs repository/service-owner P0 approval, actual controller/privacy/retention and backup decisions, and business-owner review of measurement applicability, prices and taxes. No actual production events, formal attendance or employee identities were introduced. Synthetic revenue/capacity calculations establish no customers, recurring month, owner-net income, payback or legal compliance.
