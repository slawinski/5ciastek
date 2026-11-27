# MVP-2 — bounded U8 evidence receipt

This is an evidence ledger, not a delivery tracker. Only [TASK-INV-002–005](../projects/investment-scenarios.md#task-inv-002) own mutable delivery state. The [plan](../plans/2026-11-26-2012-feat-mvp-two-investment-comparison-plan.md) and canonical task REQ/AC lists remain authoritative. Prepared assertions are not observed results or task completion.

## Source and environment

- Date: 2026-11-27. Starting source: `337a7ed` (U1–U7); this receipt describes an **uncommitted U8 working-tree delta**, not a newly committed SHA. Caller must record final source SHA and dirty-tree status with final artifacts.
- Environment: local macOS; commands below use pinned Node `24.22.3` through `npm exec`. Dependencies already installed; `npm ci` was not run in this pass. Record caller OS, npm version, lockfile/source identity and exact build environment with final results.
- Data: only synthetic `example.invalid` accounts, genuine synthetic publications and OS-temporary SQLite databases. Business finance/recipe JSON is business-sensitive in actual use; accounts/session IDs are personal. Never attach tokens, secrets, passwords or real financial/customer/worker data.
- Scope: scripts/tests/documentation only; no production behavior changes, git writes, build, browser, full suite or publication in this pass. `docs/ideation/` was pre-existing user work and is untouched.

## Observed focused checks

| Exact command | Observed result | Evidence / limits |
|---|---|---|
| `npm exec --yes --package=node@24.22.3 -- npm run typecheck` | PASS, exit 0 | `tsc --noEmit`; local terminal output. Not a build or HTTP proof. |
| `npm exec --yes --package=node@24.22.3 -- npm run test:scenarios` | PASS, exit 0; 1 test, 0 failed/skipped | `scenario revisions are owned, immutable, idempotent and independently committed`; includes all assertions in the scenario integration file and fresh-process restore. Payload emitted the existing no-email-adapter warning. Not recipe/full integration or browser evidence. |
| `git diff --check` | PASS, exit 0 | Tracked-diff whitespace check; not a Markdown link audit or product test. |

Caller: preserve sanitized logs/artifact paths and final rerun results here. Local terminal output is the observation source for the rows above; no durable external log artifact is claimed. No red-before-fix observation is claimed: U8 adds characterization/evidence coverage for already implemented U1–U7, not a production bug fix.

## Acceptance trace

The task sections' complete prefix-qualified coverage lists remain the checklist. This bounded map identifies evidence locations and gaps; it does not replace every task AC with a single month fixture.

| Example / requirements | Executable check / evidence location | Observation in this pass / remaining evidence |
|---|---|---|
| AE1; R1–R3; PRC-AC-003–004, PRC-AC-009, SCN-AC-007–009 | `src/features/process-execution/evaluate.test.ts`: oversized oven, equality/missing wait limit; `week.test.ts`: “retains Sunday history and splits an active reservation at the boundary”, intersection/closing WIP | Source-inspected, **not run here**. Caller must run unit tests and demonstrate Sunday WIP, queue violation/equality/missing window in the real workspace. The full-month smoke is not this mixed-week demonstration. |
| AE2; R4; STK-AC-003–004, STK-AC-006, STK-AC-009–010, SCN-AC-010 | `src/features/stock-inventory/evaluate.test.ts`: exact grams/over-issue and no sale before readiness; `recipe-coverage.test.ts`: FEFO and same-lot carry | Source-inspected, **not run here**. Caller must verify 20−19.5−0.5 and 100=80+10+10, supported sales and no operational mutation in connected week/browser evidence. |
| AE3; R5–R6; ECO-AC-005, ECO-AC-007–008 | `src/features/economics-investment/month.test.ts`: “maps 22 calendar days…”, “qualifies 10 to 6 stock…counting 16 + 20 once”; scenario DB financial-case loop uses `persistedMonthInput` | DB month/qualification/source readback passed. Unit numeric examples (including A/B contribution 2200 and 4 kg/36 PLN) are **not rerun here**; full tests and month UI/calendar edit/stale-result checks pending. |
| AE4; R6–R7; ECO-AC-009–010, SCN-AC-012–014 | Scenario integration financial loop: complete, zero, negative, missing deposit/rent/charges/replenishment. `investment.test.ts` covers cash inclusion and initial-stock independence. Built smoke uses complete month and missing rent | DB passed: 120000/2000=60; receipts 38000→0 and 35000→−3000 give `no-finite-payback`; missing bases give `unverified` with reasons. Exact saved inputs, independent SQL run readback, same-key replay and restore included. Unit/build HTTP/UI observations pending. |
| AE5; R8–R10; SCN-AC-001–006, SCN-AC-011, SCN-AC-015–019, SCN-AC-021 | Scenario integration comparison pair, pinned identity after newer revision, real append/COMMIT failure, same-key recovery and foreign-run denial; MVP-1 baseline 56 PLN/30 person-min/15 min wait. `scripts/investment-scenarios-smoke.ts` now drives real save/load/prepare/save-comparison/load actions | DB passed, including 40/84 h available vs distinct 30/45 person-min required and retained missing rent. Smoke prepared, **not executed**: complete/incomplete month, immutable pair after newer revision/run, retries/conflict, other-owner/editor/baker/anonymous action + REST denial, forged manifest append denial, unchanged publications and v1 history. Browser presentation invariance/logout pending. |

### Integrity, access and recovery

The observed DB suite covers service append authority, immutable reads, independent connection receipts, injected append failures, actual SQLite COMMIT contention and retry, cross-owner/role denial, populated v1/v2 run preservation across isolated comparison migration down/up, and fresh-process restore of exact revisions/runs/manifests. The final snapshot includes all seven new month/payback cases. Down/up is destructive only to the disposable comparison tables, not a production rollback demonstration.

The expanded built HTTP smoke has not run: do not infer its action discovery, HTTP serialization, REST expansion or forged-write assertions pass from the DB suite/typecheck. Browser hold also remains unverified. GraphQL is disabled; no GraphQL proof is claimed. Production target/backup authorization and restore/rollback decisions remain service-owner responsibilities under [ass-recovery](../engineering-assurance.md#ass-recovery).

## Caller mandatory commands — pending observed outputs

Run on the final source with the explicit environment required by `.env.example` and isolated target safeguards. Fill each row with exact command, SHA/date/environment, exit status, sanitized log/artifact path, observed result and failures/omissions. Do not overwrite a failure with only a later green result.

| Exact command | Observed result / artifact |
|---|---|
| `npm exec --yes --package=node@24.22.3 -- npm ci` | PENDING — caller |
| `npm exec --yes --package=node@24.22.3 -- npm run lint` | PENDING — caller |
| `npm exec --yes --package=node@24.22.3 -- npm run typecheck` | Focused pass above; final-source rerun PENDING — caller |
| `npm exec --yes --package=node@24.22.3 -- npm run test` | PENDING — caller |
| `npm exec --yes --package=node@24.22.3 -- npm run test:integration` | PENDING — caller; focused scenario pass does not cover recipe suite |
| `npm exec --yes --package=node@24.22.3 -- npm run build` | PENDING — caller; build current source before either production smoke |
| `npm exec --yes --package=node@24.22.3 -- npm run test:production` | PENDING — caller; recipe/history/scaling/auth baseline |
| `npm exec --yes --package=node@24.22.3 -- npm run test:scenarios:production` | PENDING — caller; extended HTTP assertions and cleanup |
| `npm exec --yes --package=node@24.22.3 -- npm run security` | PENDING — caller; assess vulnerabilities, record any deviation owner/reason/review date |

No `release:validate` script exists. Final simplify/review, any feedback resolution, source commit/publication and hosted CI/LFG gates are caller-owned and not performed by this pass. Actual accounts/data still require P0 approval; no real events, tax, food-safety, demand or financial suitability approval is supplied.

## Caller browser checks — pending observed outputs

After building, run the architecture document's [browser hold command](../architecture/investment-scenarios.md#verification-commands) with `SCENARIO_BROWSER=1` and an **explicit disposable synthetic** `SMOKE_PASSWORD`. Wait for `BROWSER_READY` on `http://127.0.0.1:3198`; use `/recipes` login with `administrator@example.invalid`, then the printed `COMPARISON_URL`. The local credential line must not enter shared artifacts. SIGINT/SIGTERM stops the hold/server and removes its database. No browser session was opened here.

For each row attach source SHA, browser/version, viewport/zoom/motion settings, observed result and sanitized screenshot/log path; leave failures visible. Follow [ui-design/ui-accessibility](../design-system.md#ui-accessibility), not a documentation mockup.

| Actual flow/check | Observed output / artifact |
|---|---|
| F1: mixed week, Sunday WIP, deliveries/carry, save/reopen/run, chronology and separate people/machine/technology/stock qualifications | PENDING |
| F2: calendar/replenishment/cost sources; complete month and missing rent; edit calendar makes result stale without erasing prior report | PENDING |
| F3: outlay sources, 60-month result vs explicit unverified missing-rent variant; recompute two saved variants, save/reopen exact pinned comparison after newer revision | PENDING |
| MVP-1 historical result 15 min wait, 06:50 finish, 30 person-min, 56 PLN; recipe/login/history/scaling baseline | PENDING |
| Phone/tablet/desktop; high zoom; keyboard-only controls/order/visible focus; usable touch targets; Polish sources/errors/qualifications without color dependence | PENDING |
| Normal, loading, empty vs failed read, disabled, validation/error and permission-denied states; uncertain save preserves edits/request identity and prior receipt | PENDING |
| Reduced motion/stopped animation retains all information; presentation/layout change leaves inputs, numbers and sources identical; no operational mutation | PENDING |
| Logout during comparison read/save clears protected variants and ignores late responses | PENDING |

Remaining acceptance gaps are the pending command/browser evidence above, full canonical coverage review and release-owner decisions. No discovered production blocker is asserted solely from an unexecuted check; no missing evidence is marked passed.

## Integrated caller verification — 2026-11-27

The observations below supersede the pending execution rows above. Source baseline `337a7ed` plus the U8/final-action-fix working tree; the subsequent U8 commit identifies this checkpoint. macOS, pinned Node **24.22.3**, installed lockfile dependencies; all data synthetic. Sanitized command logs: `/var/folders/zl/fkgnlthd363175f4ffymzcjh0000gn/T/opencode/mvp-two-final/`. The build used a fresh explicit `build-only.db` URI in that directory and a random nonproduction secret. The build did not target the browser database.

| Command | Observed result |
|---|---|
| `npm exec --yes --package=node@24.22.3 -- npm ci` | PASS; 630 packages installed, zero audit vulnerabilities |
| `npm run lint` under pinned runtime | PASS (`lint.log`) |
| `npm run typecheck` under pinned runtime | PASS (`typecheck.log`), also checked during the final production build |
| `npm run test` under pinned runtime | PASS; **167 tests / 25 files**, including AE1–AE5 domain/component evidence (`test.log`) |
| `npm run test:integration` under pinned runtime | PASS; **5 top-level tests**, no failures/skips; independent COMMIT/readback, permissions, populated migration and restore (`test-integration.log`) |
| `npm run build` under pinned runtime | PASS; optimized Next build including saved comparison route (`build.log`) |
| `npm run test:production` under pinned runtime | PASS; recipe/login/publication/history/scaling and role baseline (`test-production.log`) |
| `npm run test:scenarios:production` under pinned runtime | PASS; authenticated complete/incomplete month, 60-month return, pinned comparison, retries and action/REST denial (`test-scenarios-production.log`) |
| `npm run security` under pinned runtime | PASS; limited tracked-path pattern scan and **0 npm audit vulnerabilities** (`security.log`) |

The commands were invoked by `npm exec --yes --package=node@24.22.3 -- node /var/folders/zl/fkgnlthd363175f4ffymzcjh0000gn/T/opencode/mvp-two-checks.mjs <script names>`; per-command Node/exit receipts are in the same log directory. The harness stops on a failed command. Earlier failures remain part of the history:

- Recipe migration teardown first left two new comparison tables because it only removed MVP-1 before MVP-0. The test now removes the additive MVP-2 migration first; the full five-test integration suite passed afterwards.
- The first HTTP attempt found port 3198 occupied by the canceled session's browser-hold harness (running for over 14 hours). Its identified parent was terminated and its temporary database cleaned up. No unrelated listener was stopped.
- The next HTTP run exposed a real built-bundle error classification: Payload's permission error was mapped to `persistence` because `instanceof APIError` did not recognize the other bundle's class. Comparison actions now read the numeric status, matching scenario actions, and preserve Zod errors before generic normalization. The unchanged HTTP denial regression passed after a fresh build.
- The first new browser launch used a synthetic password shorter than the seed's 32-character requirement; seeding rejected it. A longer disposable synthetic value was used, and the complete smoke reached `BROWSER_READY`. No credential is included in shared evidence.

### Observed browser evidence

Playwright/Chromium drove the optimized app at `127.0.0.1:3198` against the smoke-owned synthetic database. Login used the real `/recipes` form. It opened both pinned variants, verified **60.00 months** versus missing-rent unverified payback, reopened historical version 1 after version 2, edited a calendar date and observed stale-result labeling, cloned the inputs to an independent variant, saved/reran with keyboard Enter, recomputed two selected revisions, saved the manifest and opened its exact comparison route. It also created/saved/ran/reopened the mixed weekly template: Sunday 22:00 to Monday 06:00 retained its 480-minute history alongside the second product, stock coverage and separate qualifications.

| View | Observed result / artifact |
|---|---|
| Phone 390×844 | Document width 390, no page overflow; [image](mvp-two-phone.png) |
| Tablet 768×1024 | Document width 768, readable single-column comparison; [image](mvp-two-tablet.png) |
| Desktop 1440×1000 | Document width 1440, two variant columns with existing tokens; [image](mvp-two-desktop.png) |
| 200% CSS zoom at desktop | Document width 1440, retained text/reflow; [image](mvp-two-zoom.png) |

Reduced motion was active for this matrix. This is CSS zoom, not a claim of native-menu zoom or an exhaustive accessibility audit. Domain tests exercise queue-window equality/violation/missing bounds, exact stock/carry conservation, and outside-week replenishment; not every numeric boundary was manually re-entered in the browser. Deferred-response logout/error lifecycle is covered by component tests; a real network interruption/logout race was not injected in this browser pass. Final LFG review, browser gate, PR/CI and actual-data approvals remain separate receipts.

## Final review and browser gate — 2026-11-27

Reviewed source: `c5f99f5` plus the behavior-preserving simplification; corrected domain checkpoint **`a8c5e09`**. The final UI link correction and this evidence update are the subsequent shipping delta. Review run `mvp-two-bounded-20261127` retained five concrete findings. A fresh independent validator reproduced all five before correction and verified their fixes afterwards:

1. Monthly physical movements now preserve waste/loss and source-lot identity: 100 produced, 50 sold and 50 wasted cannot support another sale; revenue is 1000 PLN, not 2000.
2. All mapped production/preparation reservations enter the combined resource-capacity sweep, including equipment and roles absent from preparation definitions. Adjacent full-capacity 48-hour profiles remain unverified; non-overlapping profiles can qualify.
3. Preparation validation rejects fractional staffing/capacity, unknown resources, demand segments outside the operation, inconsistent units/measurement context, overlapping availability and dependency cycles. Required reservations also must finish by the declared replenishment readiness.
4. Fixed opening-WIP failures are attributed to people, machines or both by failed resource; historical timestamps and clipped labor exposure remain unchanged.
5. A time-based pool without an established profile allocation remains unverified instead of receiving a produced-piece ratio. No allocation API or inferred labor basis was introduced.

New tests were observed failing before each correction. The independent follow-up ran 39 affected tests and reported all five resolved, with no unapplied review residuals. Review coverage was source-led; no different-family CLI was available. The fresh validator was a separate agent context, not a claim of cross-model independence. Security inspection confirmed the refined v2 schema remains enforced at server save and run boundaries without changing owner permissions.

Final commands under Node **24.22.3** passed: lint, typecheck, **188 unit tests in 26 files**, five integration tests, production build, recipe production smoke, expanded scenario/comparison production smoke, and security/audit (zero vulnerabilities). The five-test integration, recipe smoke and security pass followed the domain review corrections; the final UI-only link change then passed 23 focused component tests, lint/typecheck, all 188 unit tests, a new production build and scenario HTTP smoke. Logs remain in `mvp-two-final/` above.

The UI finish review found a dead corrective anchor inside read-only comparison reports. Links now open the corresponding editable variant; a component regression was observed failing before the fix and passed afterwards. The actual rebuilt browser followed the incomplete variant's “Uzupełnij podstawę” link into its workspace and logged out successfully. The UI mechanical detector returned an empty findings array.

### Pipeline browser result: PASS

Driver: harness-exposed Playwright browser surface. Server: smoke-owned built application at `127.0.0.1:3198`, free port checked before launch. Final domain source `a8c5e09`; the corrective-link check used its rebuilt UI delta.

| Affected route | Result | Observed behavior |
|---|---|---|
| `/` | PASS | Root served and rendered |
| `/recipes` | PASS | Real synthetic owner login and publication catalog |
| `/investment-scenarios` | PASS | Weekly creation/save/run/reopen from the integrated pass; empty/new workspace and comparison selection |
| `/investment-scenarios/[scenarioKey]` | PASS | Historical v1/v2 readback, clone/save, keyboard Enter run, editable calendar/stale report, qualified month/outlay and source reasons |
| `/investment-scenarios/comparisons/[comparisonKey]` | PASS | Real recomputation of two saved revisions, immutable save/reopen, 60-month vs incomplete variant, corrective navigation and protected-data clearing on logout |

Final 390/768/1440 widths and 200% CSS zoom again matched document widths with no horizontal page overflow; screenshots above were refreshed. Reduced motion preserved all information. Keyboard Tab produced a visible focus indicator; keyboard Enter executed the run. No application page errors/new flow-attributable console errors were observed; an expired token from the prior disposable database produced the expected initial unauthorized request before fresh login. No external human verification was needed. No route was skipped. Browser harnesses were terminated after checks and their temporary databases removed; no watch process is left holding this session open.

No remaining review finding is accepted as deferred debt. Hosted PR/CI results belong to the shipping record, and actual-account/data release remains the repository/service owner's decision under P0.
