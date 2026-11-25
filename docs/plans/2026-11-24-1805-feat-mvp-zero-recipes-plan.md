---
title: MVP-0 Recipes - Plan
type: feat
date: 2026-11-24
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-plan-bootstrap
execution: code
---

# MVP-0 Recipes - Plan

## Goal Capsule

- Objective: Uprawniony redaktor publikuje recepturę, a piekarz znajduje ją i odczytuje niezmienne historyczne ilości dla wybranego uzysku.
- Means: Shared Next.js App Router/Payload application, frozen recipe publications and exact scaling (KTD1–KTD4).
- Authority: `docs/product-plan.md` MVP-0 → TASK-REC-001–005/007 in `docs/projects/recipes.md` → `docs/specs/recipes.md` → approved DEC-001, `docs/design-system.md`, `docs/engineering-assurance.md`.
- Execution: implementation and local verification return to LFG, which owns simplification, review, browser verification, commits, push, open PR and CI decision. No merge.
- Stop conditions: invalidated approved precision policy, unavailable required workflow reference, failed implementation prerequisite or unresolvable verification failure.

---

## Product Contract

### Summary

MVP-0 dostarcza publikację, historię, katalog i skalowanie receptur w docelowej aplikacji Next.js/Payload. Migracja zachowuje istniejące trasy i motyw.

### Problem Frame

Piekarz potrzebuje pełnego składu i procesu, których późniejsza edycja surowca nie zmieni. Obecna aplikacja zawiera kalkulatory domowe i demonstracyjne widoki, ale nie ma trwałej publikacji receptur ani autoryzowanego katalogu.

### Requirements

**Precision and publication**

- R1. Zapisywane masy receptury i składników są wyrażone w g z precyzją 0,001 g; wejście dokładniejsze jest odrzucane, bez cichej konwersji. Na granicach stałej precyzji zaokrąglenie jest do najbliższej 0,001 g, dokładne połowy w górę.
- R2. Obliczenia skalowania i wkładu zakwasu nie zaokrąglają wyników pośrednich i zawsze korzystają z opublikowanej bazy. Pomocnicza masa porcji musi po tym samym zaokrągleniu równać się sumie składników / N, bez dodatkowej tolerancji; prezentacja nie zmienia zapisu.
- R3. Redaktor zapisuje szkic i jawnie publikuje pełną samodzielną recepturę według REC-REQ-001–006/014–015 i REC-AC-001–007. Historia zachowuje masy, kompozycję, klasyfikację, nazwy i stabilne relacje; błędna publikacja niczego nie zatwierdza.

**Catalog and scaling**

- R4. Zalogowany piekarz przegląda wyłącznie dostępne publikacje, filtruje nazwę i odczytuje wersję, proces oraz masy; błąd pobrania ma ponowienie odrębne od pustego wyniku (REC-REQ-007 / REC-AC-008–009).
- R5. Katalog umożliwia presety 10/15/20/30 szt. oraz g/kg/% z równoczesnymi masami, pełną podstawą mąki i jawnymi brakami kompozycji (REC-REQ-008–012 / REC-AC-010–014). Odczyt i przeliczenia niczego nie zapisują.

**Migration and assurance**

- R6. Wszystkie istniejące trasy `/`, `/hydration`, `/bake-a-long`, `/bake-history`, `/profile`, ich kalkulacje i nawigacja pozostają dostępne zgodnie z macierzą przed/po TASK-REC-002. Tokeny i CSS Modules pozostają zgodne z TASK-REC-007.
- R7. Serwer odmawia nieuprawnionej edycji, publikacji i odczytu prywatnych danych przez każdy udostępniony interfejs; implementacja i dowody respektują granice P0 z `docs/engineering-assurance.md`.
- R8. Weryfikacja obejmuje lockfile install, lint, types, unit/integration tests, production build/start, przeglądarkę i skany bezpieczeństwa, z rzeczywistymi wynikami i jawnymi brakami.

### Key Decisions

- **DEC-001: precision preserving sub-gram ingredients** (session-settled: user-approved — chosen over whole-gram precision: preserve sub-gram ingredients). Governs R1, R2, R3, R5. User approved the complete rounding, rejection, consistency and history policy after seeing the alternative.

### Actors

- A1. Administrator: zarządza syntetycznymi kontami i rolami, surowcami oraz recepturami.
- A2. Redaktor: edytuje surowce/szkice, publikuje i odczytuje historię oraz eksport.
- A3. Piekarz: odczytuje dostępne publikacje i skaluje, bez prawa zapisu szkiców.
- A4. Osoba niezalogowana: korzysta ze starych publicznych kalkulatorów, bez dostępu do prywatnych receptur.

### Scope Boundaries

Pełny MVP-0 obejmuje TASK-REC-001–005/007. Nie obejmuje rejestratora produkcji, zapisu planu, AI, cen, symulacji, zaawansowanych wariantów ani zmiany charakteru wizualnego. DEC-002/003 pozostają poza zakresem.

### Acceptance Examples

- AE1. Covers R1–R3: 500 + 350 + 10 g daje 860 g; 4000/5 daje 800 g, a wejście 750 g odmawia publikacji. 1,2345 g jest odrzucone; 1,235 g jest zachowane. Wynik 0,0005 g na granicy obliczenia daje 0,001 g.
- AE2. Covers R2, R5: REC-AC-010 daje 8/12/16/24 kg; 10→30→10 daje identyczne masy. 3120 g = 3,12 kg.
- AE3. Covers R2, R3, R5: 1 kg zakwasu 100% wnosi 0,5 kg mąki i 0,5 kg wody, raz. Zmiana bieżącego surowca nie zmienia v1; nieznany wkład nie staje się zerem.
- AE4. Covers R3, R7: brak sesji lub rola piekarza odmawia zapisu bez zmiany danych; nowy szkic nie zastępuje v1. Eksport zachowuje jednostki i relacje.
- AE5. Covers R4: trzy publikacje i szkic dają trzy pozycje, filtr ma trafienie/pusty stan, a awaria ma błąd i skuteczne ponowienie.

---

## Planning Contract

### Key Technical Decisions

- KTD1. **Pin a supported stable Next/Payload combination.** Registry evidence on 2026-11-24: Payload and `@payloadcms/next` 3.94.2, Next 16.4.6, React 19.3.1. Payload requires Node ^22.23.5 / ^24.22.3 / >=26.13.1. Use a supported runtime for all target-stack checks. Context7 main docs describe Payload 4 prerelease requirements, so verify v3 package contracts rather than copying main blindly.
- KTD2. **SQLite on a persistent single-node host.** The official SQLite adapter avoids a service prerequisite for this bounded app. Store DB outside source control, provide explicit isolated synthetic targets and controlled migration/backup/restore. Serverless ephemeral disk is unsupported by this deployment choice. PostgreSQL remains the alternative for multiple instances, not an additional adapter now.
- KTD3. **Store canonical gram decimals as text and calculate rationally.** Parse decimal strings into integer thousandths and use rational arithmetic for division and starter contributions; round only at R1/R2 boundaries. JSON exports retain gram strings, avoiding binary float ambiguity. This instantiates R1/R2 (session-settled: user-approved — chosen over whole-gram precision: preserve sub-gram ingredients).
- KTD4. **Separate mutable drafts from immutable publication snapshots.** Payload owns users, ingredients and recipe editing. Publication copies all calculation inputs and process into a read-only snapshot with stable recipe/version identity inside one transaction. A unique identity prevents races from overwriting history. Readers never hydrate snapshots from current ingredients. Payload hooks must validate all exposed writes, not only the admin form.
- KTD5. **Preserve feature modules during routing migration.** App routes delegate to existing feature components; retain Query and XState. Replace TanStack server functions with validated Next server functions and keep query-option wrappers in client-safe modules. Preserve initial SSR data with Query hydration where applicable. Remove only routing/runtime dependencies made unused by migration.
- KTD6. **Explicit actor boundaries.** Payload roles are administrator/editor/baker; role assignment is administrator-only. User-facing Local API calls carry actor and `overrideAccess: false`. Disable GraphQL if unused, then test REST, Local API and any custom/server-action boundaries. Catalog uses authenticated server-side reads and native admin remains the editing UI.

### High-Level Technical Design

Component sketch: Browser → Next `(app)` route → authenticated catalog service → Payload Local API → SQLite. Admin browser → Next `(payload)` → Payload collection access/validation/hooks → same SQLite. Pure recipe arithmetic consumes only a frozen snapshot and selected T/unit.

Publication protocol sketch: authenticate actor → validate full draft and referenced ingredients → capture complete snapshot → atomically assign immutable version → return confirmed write. Failure at validation or persistence returns error; the last publication remains readable.

Lifecycle sketch: incomplete draft → valid draft → publication v1; subsequent edits create mutable draft state → publication v2. Both v1 and v2 remain addressable; catalog chooses the latest authorized publication, never the current draft.

Calculation data-flow sketch: frozen gram strings → exact rational base and starter contributions → T/N multiplication → boundary rounding / display formatting. No formatted result feeds another calculation.

### Assumptions

- The autonomous implementation grant includes accepting the technical ADR after the bounded spike has supplied compatibility/access/build evidence; it does not approve real-data deployment or legal applicability.
- Verification uses synthetic users and recipes in explicitly isolated DBs. Actual controller, hosting, retention, RPO/RTO and production release decisions require the owner's deployment context.
- New business/UI copy is Polish. Existing English route copy is preserved during behavior-preserving migration.
- No native subagent tool is exposed in this harness; research and specialist passes run inline with their prompt assets. No institutional solutions or CE packs were found.

### System-Wide Impact and Risks

Routing changes affect every old screen and server function. Characterize calculator output and wizard transitions before migration and capture mobile/desktop references. The history/profile mock surfaces remain mocks. Hydration's current input-validation error path must remain visible.

Recipe data is internal/business-sensitive; account email and credentials are personal data. Attackers include anonymous callers and authenticated readers attempting writes or draft/history disclosure. Server schemas, collection ACLs, role-field ACLs, transaction boundaries, session protection and denial tests address those paths. Owner: repository owner for deployment decisions; implementation agent for synthetic evidence dated 2026-11-24. Production privacy/retention review remains an actual-use gate.

SQLite backup must include DB plus required configuration and any enabled media. Omit media upload from MVP-0 because images are optional; no file restore claim is needed for absent uploads. Restore into a separate nonpublic target and read v1 values/relationships back. Never reset or migrate an unknown/default production target. Concurrent publication and failed persistence must preserve previous snapshots.

### Sources and Research

- Existing patterns: `src/components/PageLayout/index.tsx`, `src/components/InputField/index.tsx`, `src/components/Button/index.tsx`, `src/styles.css`, `postcss.config.js`.
- Behavior trace: `src/routes/index.tsx` prefetches tips/default results; `src/features/fermentation/calculateFermentationTimes.ts` validates Zod and applies schedule decay; `src/features/hydration/calculateHydration.ts` delegates validated arithmetic. `src/features/bake-a-long/bakeAlongMachine.ts` owns four states and reset. History/profile components contain static mock data.
- Official integration: https://payloadcms.com/docs/getting-started/installation and https://payloadcms.com/docs/local-api/access-control (Context7 plus npm registry compatibility evidence).
- Next root layouts/client boundaries/server functions: https://nextjs.org/docs/app/guides/migrating/app-router-migration (Context7).
- No consequential unresolved mechanism survived research: separate immutable snapshots best fit explicit historical reads; SQLite fits a single-host synthetic delivery. A mechanism bake-off is unnecessary.

---

## Implementation Units

### U1. Record precision policy and architecture baseline

**Goal:** Resolve DEC-001 and establish pre-migration behavior and architecture proof.
**Requirements:** R1, R2, R6–R8; TASK-REC-001/007.
**Dependencies:** None.
**Files:** `docs/decisions.md`, `docs/specs/recipes.md`, affected index/portfolio references, `docs/architecture/mvp-zero.md`, `docs/verification/mvp-zero.md`, `src/features/recipes/precision.test.ts`, existing calculator/wizard tests.
**Approach:** Update canonical policy/examples and only dependent stale OPEN statements. Capture route matrix and visual references before views change. Select and prove KTD1/KTD2 with a bounded native admin/API spike before approving the ADR and proceeding to U2.
**Patterns:** Existing specification language and canonical task ownership.
**Test scenarios:**
1. AE1 precision/half ties and finer-input rejection.
2. Current fermentation/hydration defaults, invalid input and Bake Along forward/back/reset behavior are characterized.
3. Admin can add a synthetic recipe and frontend/server can read a permitted publication; anonymous write denies.
**Verification:** Recorded runtime/version proof, approved technical ADR, route matrix and visual baseline; no invented real-data approval.

### U2. Migrate existing routes and server boundaries

**Goal:** Preserve old user flows on Next App Router.
**Requirements:** R6, R8; TASK-REC-002/007.
**Dependencies:** U1 architecture proof.
**Files:** `src/app/(app)/`, `src/app/(payload)/`, existing route/feature server modules, `src/components/Header/index.tsx`, `next.config.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `src/tests/migration.test.ts`.
**Approach:** Follow KTD5, reusing existing components and CSS; add only the client/server boundaries required by Next. Inventory and remove obsolete TanStack runtime entry points after all routes work.
**Test scenarios:**
1. Every route in R6 loads and navigation preserves the destination.
2. Default and changed calculator inputs retain characterized output; failed calculation is a visible error with recovery.
3. Wizard transitions, generated schedule, back and reset retain behavior.
**Verification:** Production build/start, all route smoke checks and before/after mobile/desktop comparisons pass without unhandled hydration errors.

### U3. Persist authorized recipes and frozen publications

**Goal:** Deliver draft editing, publication, history, ingredient identity and export.
**Requirements:** R1–R3, R7; REC-AC-001–007/014.
**Dependencies:** U2.
**Files:** `src/payload.config.ts`, `src/collections/`, `src/features/recipes/schema.ts`, `src/features/recipes/publication.ts`, `src/features/recipes/publication.test.ts`, `src/tests/recipes.integration.test.ts`, `src/migrations/`.
**Approach:** Apply KTD3/KTD4/KTD6. Native Admin edits structured ingredients, masses, yield, description and ordered process. Central server validation freezes resolved source values and checks consistency before commit. A complete variant marker distinguishes standalone recipes from additions-only drafts.
**Test scenarios:**
1. AE1/AE3/AE4 including v1→draft→v2 and renamed/reclassified ingredient retains old values and relations.
2. Reject zero/negative/non-numeric/finer mass, missing/fractional yield, additions-only variant and inconsistent portion input; incomplete drafts remain editable.
3. Readers cannot write, publish, read drafts or protected history; invalid session and anonymous REST/Local API deny.
4. Failed and competing publication attempts cannot mutate v1 or create conflicting version identity.
5. Export preserves exact gram strings, units and ingredient IDs; editor name search and historical version read work.
**Verification:** Real isolated DB integration tests prove persistence, permissions and historical snapshots, not mocked repository calls.

### U4. Connect catalog and deterministic scaling

**Goal:** Give bakers the complete read/filter/detail/scale flow.
**Requirements:** R1, R2, R4, R5, R7; REC-AC-008–014.
**Dependencies:** U3.
**Files:** `src/app/(app)/recipes/`, `src/features/recipes/components/`, `src/features/recipes/scaling.ts`, `src/features/recipes/scaling.test.ts`, catalog interaction tests.
**Approach:** Read authorized snapshots only, reuse PageLayout/InputField/Button and existing tokens. Keep feature tables within recipes. Percent mode separates total flour/type breakdown from weighing ingredients and exposes missing composition.
**Test scenarios:**
1. AE2 presets and repeated selection, conversion, exact starter contributions and historical read.
2. AE5 filter/list/detail, ordered process, empty/error/retry behavior.
3. REC-AC-012 flour split and REC-AC-013 no double weighing; REC-AC-014 missing composition suppresses exact percentages/hydration while retaining known masses.
4. Unit/T changes produce no database writes or version changes.
**Verification:** Connected browser flow with synthetic publication, keyboard/focus, phone/tablet/desktop, zoom and reduced motion; no redesign.

### U5. Recovery, reproducible verification and delivery evidence

**Goal:** Make the target stack repeatably verifiable and document actual results.
**Requirements:** R7, R8; scoped P0 assurance.
**Dependencies:** U3, U4.
**Files:** `scripts/`, `.github/workflows/`, `.env.example`, `.gitignore`, `docs/verification/mvp-zero.md`, `docs/architecture/mvp-zero.md`, `docs/index.md`, `docs/projects/recipes.md`, assurance task evidence where applicable.
**Approach:** Install supported runtime/dependencies, add meaningful lint/types/security checks and CI with least privilege. Explicit synthetic DB guards protect tests/migrations. Exercise backup/restore and record deployment/rollback instructions. Preserve `docs/ideation/` user work and exclude it from commits.
**Test scenarios:**
1. Fresh lockfile install, lint, types, tests, build and start pass on recorded supported Node.
2. Unknown/production/ambiguous destructive test targets refuse before mutation; controlled migration failure leaves another DB intact.
3. Isolated restore reads exact v1 masses, frozen starter composition and relationships after later source edits.
4. Dependency/secret scans report actual findings and disposition; CI identifies tested SHA and skips truthfully.
**Verification:** Sanitized evidence and current task-state receipts, followed by LFG simplification/review/browser/PR/CI. Actual-account release remains subject to owner privacy and deployment approvals.

---

## Verification Contract

Existing command `npm run test` provides baseline product tests. The implementation adds `npm run lint`, `npm run typecheck`, `npm run test:integration`, and security verification commands, documents their exact behavior, and runs each on the supported runtime. `npm run build` and `npm run start` become Next production commands. Lockfile installation must be exercised with `npm ci`.

Unit evidence maps R1/R2/R5 to precision/scaling tests; integration evidence maps R3/R7 to persistent authorization/publication/history/export tests. Browser evidence maps R4/R6 to real route and catalog interactions, including retrieval failure/retry. Screenshots compare preserved screens and verify the new catalog across required viewports. Recovery evidence uses a separate confirmed test destination and checks historical readback.

Security evidence includes dependency audit, secret scan, API denials and role escalation attempts. Record failures and later corrections rather than erasing failed runs. Production rule enforcement is reported only if activation and failing-check denial are actually verified; green CI alone is insufficient.

---

## Definition of Done

All implementation units have their specified executable or visual evidence. DEC-001 and affected specs agree; accepted ADR precedes migration; all original routes remain reachable. Recipe publication, immutable history, export, access denial, catalog and every scaling preset work against a real isolated DB.

Lint, types, tests, production build/start, browser verification and applicable security checks pass or expose a genuine unresolved gate. Abandoned experiments and unused migration runtime code are removed. Task delivery states link actual evidence. User-owned `docs/ideation/` remains uncommitted. LFG owns final reviewed commits, push, open PR and CI-decided state; no merge and no claim of actual-data release approval.
