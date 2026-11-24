# MVP-0 verification evidence

## Baseline — 2026-11-24

Initial branch: main at origin/main; no local-only commits. User work excluded: `docs/ideation/2026-11-17-agent-usable-documentation-ideation.html`.

`npm test`: 1 file / 3 hydration tests passed before changes. Before migration, Playwright visited all five routes at 1280×900 and 390×844 and captured full-page images under the session temporary directory, named `before-{home,hydration,bake-a-long,bake-history,profile}-{1280,390}.png`.

| Route | Decision | Baseline behavior |
|---|---|---|
| `/` | preserve | Fermentation defaults 23°C/75%: bulk 4.14h, proof 3.04h, total 7.18h; daily tips and modal |
| `/hydration` | preserve | 500g / 70%: 335g added water, starter calculation |
| `/bake-a-long` | preserve | XState schedule → dough → starter → generated; back/reset |
| `/bake-history` | preserve | Static sample history, visible work-in-progress banner |
| `/profile` | preserve | Static sample profile, hidden profile menu |

Browser baseline console contained development errors/warnings; these are not claimed clean. Target-stack hydration/navigation must be independently checked after migration.

## Precision

The new precision tests first failed because the implementation module did not exist. After implementation both tests passed, covering thousandths preservation, finer precision rejection, invalid masses and exact half ties upwards. No scaling/publication success is inferred from these leaf tests.

## Architecture spike

Node 24.22.3 was obtained through npm exec; installed machine default was 24.8.0 and is not the supported Payload runtime. Native Admin synthetic create/read passed, anonymous create returned 403. Scoped spike production build passed; production root returned 200. See `docs/architecture/mvp-zero.md` for its limited scope.

Initial target-stack dependency audit reported 13 vulnerabilities (2 critical, 4 high, 7 moderate). Remediation and applicability assessment remain required before shipping; this result is not a passed security gate.

## Route migration

Full application production build passed on Node 24.22.3 after removing the temporary spike TypeScript scope. A simultaneous typecheck initially failed because build regenerated `.next/types`; rerunning after build passed. Verification commands that share generated output must run serially.

Playwright production smoke visited all five preserved routes at desktop 1280 and phone 390 widths: all returned 200, and no page exceptions were observed. Screenshots named `after-*` were captured beside the baseline. Default fermentation/hydration values match baseline. Mock history/profile and wizard surfaces remain present. Further interaction/error and visual checks are required at the final browser gate.

## Persistent recipe and arithmetic checks

The unit suite now has 12 passing tests across five files. Publication/scaling tests first failed on absent modules, then passed. They cover DEC-001 half ties and rejection, portion consistency without tolerance, 10/15/20/30 presets, 10→30→10, starter contribution counted once, flour-type percentages, and explicit missing composition.

The real SQLite integration test passes on an owned OS-temporary database, with synthetic administrator/editor/baker accounts: publication/history, source edits, draft isolation, private audience, role escalation prevention, denied writes/read/mutation, export identity, restore readback, injected persistence failure and competing publications. A failed concurrent writer receives SQLITE_BUSY rather than a false success; successful versions remain unique and contiguous.

The injected failure initially exposed a partial publication: SQLite transactions are opt-in in this adapter. Adding `transactionOptions: {}` made publication and snapshot rollback together. This regression remains tested. The initial integration command also hung on Payload's development HMR websocket; `NODE_ENV=test` removed the development connection and the test exits successfully.

Fresh `npm ci` succeeded on Node 24.22.3. Lint, typecheck, all 12 unit tests and both isolated integration tests passed. The second integration test proves the migration wrapper refuses unconfirmed targets. A transactionally injected schema failure on the restored copy rolls back and preserves its historical snapshot. The generated initial Payload migration ran successfully against a fresh confirmed synthetic DB. `npm run security` reports zero dependency vulnerabilities and a passing limited tracked-secret-pattern scan.

Full production build passed after domain/catalog integration. Production `/recipes` login as a synthetic baker returned exactly the three publications, not the draft. Browser interactions verified all presets and 10→30→10, kg/% with simultaneous masses, missing-composition warning, empty search and injected HTTP 503 followed by successful retry. Screenshots at 390/768/1280 were captured; phone render was inspected for token consistency. A browser automation attempt initially used textbox rather than the semantic searchbox role and timed out; correcting the selector completed the interaction.

Dependency remediation upgraded Vitest to 5.1.1 and refreshed compatible dependencies. The Drizzle tooling's legacy esbuild loader now uses a patched esbuild through a scoped override. Installation reports **0 vulnerabilities**; integration verification exercises this dependency path. Lint identified three legacy `any` annotations in migrated wizard components; concrete XState types and a literal union now replace them without changing behavior.
