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
