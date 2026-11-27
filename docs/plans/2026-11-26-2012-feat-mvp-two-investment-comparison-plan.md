---
title: "MVP-2 Investment Comparison - Plan"
type: feat
date: 2026-11-26
artifact_contract: ce-unified-plan/v1
product_contract_source: repository-capability-specifications
execution: code
---
# MVP-2 Investment Comparison - Plan

## Goal Capsule

- **Objective:** Właściciel może ocenić i porównać co najmniej dwa zapisane warianty otwarcia piekarni na podstawie reprezentatywnego tygodnia, kwalifikowanego miesiąca i jawnego nakładu.
- **Means:** Extend the existing investment workspace and pure PRC/STK/ECO evaluators, with versioned saved inputs and pinned comparison runs (KTD1–KTD9).
- **Authority:** `docs/product-plan.md#MVP-2` → `docs/projects/investment-scenarios.md#task-inv-002` through `#task-inv-005` → canonical SCN/PRC/STK/ECO requirements and acceptance criteria → `docs/decisions.md`, `docs/design-system.md`, `docs/engineering-assurance.md`. The canonical specifications govern behavior if this plan disagrees.
- **Execution profile:** Deep, cross-domain implementation in the current Next.js App Router/Payload application. Eight dependency-ordered units; the caller owns implementation, review and publication. This artifact carries decisions, not task progress.
- **Stop conditions:** Stop the affected work if the persisted MVP-1 protocol cannot be preserved, a canonical contract is contradicted, or a destructive data conversion becomes necessary without an approved recovery path. Missing scenario prices, windows or tax assumptions produce qualified partial results under R7, rather than stopping implementation.
- **Delivery owner:** The implementing agent produces verification receipts; the repository/service owner decides deployment and actual-data release under assurance. Only the INV task sections record delivery state.

---

## Product Contract

### Summary

Rozszerzenie obejmuje cały MVP-2: miks i tydzień z nocą, WIP, zapasami i oknami; kwalifikację miesiąca; nakład i prosty zwrot; porównanie zapisanych wariantów. Użytkownik nadal przechodzi przez ręczne źródłowe wejścia, zapis, ponowne otwarcie i obliczenie. Raport pokazuje wyniki częściowe oraz przyczyny ograniczenia każdego zależnego wniosku.

### Problem Frame

Ocena jednego dnia nie wystarcza do decyzji przed najmem i zakupem wyposażenia. Dodatni tydzień może zużywać wcześniej przygotowany zapas, pomijać pracę poza badanym okresem albo nie odpowiadać kalendarzowi miesiąca. Sama marża nie dowodzi dochodu właściciela, powtarzalnej nadwyżki ani zwrotu.

### Requirements

**Tydzien, proces i zapas — TASK-INV-002**

- R1. Wariant musi zachować realistyczny miks produktów, wiele partii tego samego produktu, datowany tydzień i źródła wejść. Obowiązują SCN-REQ-002–003, SCN-REQ-006–009 i SCN-REQ-013.
- R2. Przebieg musi kontynuować wejściowy WIP przez noc i granice okresu, zachowując zadaną kolejność oraz odrębne oceny ludzi, maszyn i technologii. Obowiązują PRC-REQ-001–008 oraz SCN-REQ-010–011; obsługa rzeczywistych poleceń EVT nie wchodzi do tego przyrostu.
- R3. Przejście po kolejce musi sprawdzić właściwe źródłowe okno użycia lub maksymalnego oczekiwania półproduktu. Brak okna pozostawia technologię niezweryfikowaną zgodnie z PRC-REQ-003 i SCN-REQ-019.
- R4. Bilans musi zachować surowce, dostawy, WIP, gotowe wyroby, przydatność, dopuszczenie, sprzedaż, przeniesienia i odpady w czasie. Obowiązują STK-REQ-001–004, STK-REQ-006–008 oraz SCN-REQ-012; do ECO trafia wyłącznie sprzedaż pokryta gotowym dopuszczonym wyrobem.

**Miesiac i inwestycja — TASK-INV-003–004**

- R5. Miesiąc musi wynikać z jawnego kalendarza produkcji i sprzedaży oraz rozliczenia zapasu otwarcia, odtworzenia i przypisanej pracy/kosztów poza tygodniem. Kwalifikację określają ECO-REQ-002, ECO-REQ-010 i SCN-REQ-016, bez wymogu identycznych stanów granicznych ani pełnej symulacji miesiąca.
- R6. Ekonomia musi rozdzielić marżę, wynik operacyjny, cel netto właściciela i nadwyżkę gotówkową, stosując jedną podstawę alokacji pracy i ujawnione obciążenia. Obowiązują ECO-REQ-001, ECO-REQ-003–011 i SCN-REQ-013–015.
- R7. Nakład i prosty zwrot muszą zachować źródła oraz kwalifikacje ECO-REQ-012–014 i SCN-REQ-017. Brak danych, znana niedodatnia nadwyżka i dodatnia zakwalifikowana nadwyżka muszą dawać rozróżnialne wyniki.

**Porownanie i wspolny przeplyw — TASK-INV-005**

- R8. Właściciel musi móc zapisać, ponownie obliczyć i porównać co najmniej dwa ręcznie zdefiniowane warianty, także wariant z brakami. Różnice wejść, źródeł, dostępności, wymaganych godzin i wyników podlegają SCN-REQ-018–019.
- R9. Zapis, odczyt, uruchomienie i porównanie muszą zachować izolację, dokładną tożsamość wejść i uprawnienia właściciela. Obowiązują SCN-REQ-001, SCN-REQ-007–008, SCN-REQ-020, STK-REQ-014 i ECO-REQ-017.
- R10. Cały zmieniony przepływ musi być czytelny po polsku na telefonie, tablecie i komputerze oraz dostępny klawiaturą. Obowiązują SCN-REQ-021, STK-REQ-016, ECO-REQ-017 i `docs/design-system.md#ui-accessibility`.

### Key Flows

- F1. **Tydzień:** właściciel otwiera wariant → dodaje partie, WIP i źródłowe ograniczenia → zapisuje → ponownie otwiera → uruchamia → odczytuje chronologię, bilanse i ekonomię (R1–R4, R6, R9–R10).
- F2. **Miesiąc:** właściciel przypisuje dni produkcji/sprzedaży → uzgadnia ubytek i odtworzenie zapasu oraz pracę poza tygodniem → zapisuje i uruchamia → odczytuje odrębne kwalifikacje miesiąca, netto i gotówki (R5–R6, R9–R10).
- F3. **Inwestycja i porównanie:** właściciel dodaje nakład → zapisuje i uruchamia A oraz B → wybiera konkretne wyniki → zapisuje porównanie → ponownie otwiera różnice i braki bez zmiany historycznych wejść (R7–R10).

### Acceptance Examples

These linked examples select required executable demonstrations; canonical ACs remain authoritative.

| Example | Covers | Observable result |
|---|---|---|
| AE1 | R1–R3; PRC-AC-003–004, PRC-AC-009, SCN-AC-007–009 | 12+12 exceeds oven capacity 20; waiting 45 against 30 reveals 15 minutes of violation, equality at 30 passes, missing window qualifies only technology. Sunday 22:00–Monday 06:00 remains 8 h total, 2 h before and 6 h inside the week. |
| AE2 | R4; STK-AC-003–004, STK-AC-006, STK-AC-009–010, SCN-AC-010 | 20−19.5−0.5 kg=0. From 100 ready pieces, 80 sold, 10 carried and 10 wasted produce revenue for 80 only. A sale before readiness remains unmet. |
| AE3 | R5–R6; ECO-AC-005, ECO-AC-007–008 | Sold A/B 80/80 with 100 B produced yields 4000−1800=2200 PLN contribution. Calendar 22×100 gives 2200 pieces, not 2000. WIP 10→6 can qualify with the remaining 4 kg, 20 min and 36 PLN reconciled once, alongside known cost of the other 6 kg and feasible preparation. |
| AE4 | R6–R7; ECO-AC-009–010, SCN-AC-012–014 | Qualified 40000−30000−2000−6000=2000 PLN/month and initial 120000 PLN give 60 months. Receipts 35000 give −3000; zero gives no finite return; missing deposit/charges/replenishment leaves the dependent result unverified. |
| AE5 | R8–R10; SCN-AC-001–006, SCN-AC-011, SCN-AC-015–019, SCN-AC-021 | A 40 h and B 84 h retain distinct availability and required hours. Missing rent in B remains visible. Reopen preserves both input/run identities; MVP-1 A20/B12 still yields 15 min waiting, 06:50 finish, 30 baker person-minutes and 56 PLN before owner income/charges. |

### Scope Boundaries

All four tasks are required for full MVP-2; completing the week alone does not complete this plan. TASK-INV-001 is the implemented baseline and its unresolved release approvals remain caller-owned.

No mandatory OBS/EVT producer, POS, MRP, full CAPP, FER prediction, MAP, DEM, OPT solver, AI, payroll or accounting integration is added. Manual sourced inputs satisfy the contracts. No demand forecast, global optimum, physical layout/congestion, financing/loan schedule, seasonality or month-by-month startup model is claimed.

**Considered and not built:** A background job system and a general event-sourcing platform would add persistence and recovery machinery without a traced need in this bounded deterministic workflow. Reconsider only if measured representative-week workloads cannot fit the existing command lifecycle. A full monthly simulator is unnecessary under R5; use the explicit reconciliation in KTD6. Neither omission reduces the four required task outcomes.

### Deferred to Follow-Up Work

TASK-INV-006 owns later growth options and horizon-based pessimistic/base/optimistic cash flows. Operational imports and broad shared-editor cleanup remain separate work. Do not modify user-owned `docs/ideation/` while executing this plan.

---

## Planning Contract

### Existing Behavior and Evidence

The current application uses Next.js 16.4.6, Payload/SQLite 3.94.2, React 19.3.1, TanStack Query 5, XState 5 and Zod 4 (`package.json`). Vite is test support. `docs/index.md` and the installed manifest describe the migrated application; older stack descriptions do not justify changing runtime.

The source trace establishes these boundaries:

| Trigger / owner | Current behavior | Consequence for this change |
|---|---|---|
| Workspace edit/save/run | `ScenarioWorkspace.tsx` and `scenarioMachine.ts` distinguish unsaved edits, confirmed revisions and historical reports; request generations discard obsolete responses. | Extend this lifecycle rather than creating a separate calculator. |
| Save in `service.ts` | Authenticates owner, checks request-key replay and expected head, resolves frozen publications, appends inside the dedicated SQLite transaction and acknowledges after COMMIT. | Versioned inputs and comparisons use the same trust/receipt boundary. |
| Run in `service.ts` | Reads an authorized saved revision, evaluates, stores exact input/output and engine identity; replay checks immutable revision/fingerprint. | Old replay must return the old receipt before a new evaluator can reinterpret its inputs. |
| `process-execution/evaluate.ts` | Priority then stable ID selects ready dependencies; explicit resources reserve simultaneous capacity. Starts can precede the interval, but operations must finish by its end. Labor totals currently include complete reservation duration. | Opening and closing WIP need explicit continuation and clipped labor, not just a longer date range. |
| `investment-scenarios/evaluate.ts` | Scales once per product target and consumes all ingredients from the first matching material lot at the first operation. | Weekly batches, WIP substitution and FEFO need a deliberate recipe-coverage boundary. |
| `stock-inventory/evaluate.ts` | Tracks portions and timed sales; FEFO applies inside a lot. `carry` currently subtracts stock, and the final saleable view uses the latest movement time. | Add period-boundary inventory projections and explicit carry destinations; do not use the current final totals as a monthly reconciliation. |
| `economics-investment/evaluate.ts` | Exact arithmetic and qualified cost bases exist; owner-net and payback are always unverified. Costed production uses product target. | Reuse arithmetic/allocation, add actual batch totals and separate monthly qualification. |
| `report-schema.ts`, collection JSON validators | Input schema and report engine are hard-coded to version 1. | New fields require version-aware persisted readers as well as editors and evaluators. |

Existing unit tests cover queue limits, cross-midnight passive work, exact money, stock portions, missing inputs and stale responses. `src/tests/investment-scenarios.integration.test.ts` covers frozen publications, append/retry/conflict, injected append and real COMMIT failures, independent reads and fresh-process restore. These are source-inspected baselines, not a claim that tests passed for MVP-2.

### Key Technical Decisions

- KTD1. **Keep the existing ownership and composition boundaries.** SCN owns input identity, persistence and orchestration; PRC owns time/resources/windows; STK owns quantities/admission; ECO owns cost, month and payback qualification. Reuse the current pure evaluator pipeline and server actions for R1–R9. A parallel weekly calculator would duplicate these rules.
- KTD2. **Add a version-2 input and report without rewriting version 1.** Preserve version-1 schema/engine readers and stored fingerprints. New drafts use v2; converting v1 creates a new revision with explicitly missing new fields, never backfills historical JSON. Existing saved v1 reports remain displayable; rerunning v1 uses its frozen v1 evaluator, while extending to MVP-2 requires a v2 revision. Bump the new engine to `investment-scenario/2`, dispatch by input/engine version, and validate matching input/report/envelope versions. Request-key replay is resolved before evaluation and cannot silently select a different engine. This is cheaper and safer than a destructive backfill (R9).
- KTD3. **Separate product identity from production-batch identity.** V2 products retain publication, price, cost and sold-mix identity; batches carry their own target, operation graph, material/WIP coverage and finished lots. Bind operations and ready lots to batches; aggregate sales and required sales by product. Validate batch targets against ready-lot totals and observation context against that batch, not the whole week's product sum. Count production cost and contribution-per-batch from actual batch records (R1, R4, R6).
- KTD4. **Continue the supplied schedule; do not optimize it.** Preserve priority/dependency ordering and deterministic ID tie breaks. Opening WIP records fixed pre-period stage history, current progress, source, quantity and known/missing earlier labor; it does not replay already consumed ingredients or invent a new midnight start. Reservations crossing a boundary retain their full history while labor/occupancy reports split before/inside/after the interval. Closing unfinished stages produce closing WIP, not ready sales. Windows are scoped to a batch/transition, identify their reference predecessor/readiness instant, carry source/unit, and can express use-from/use-until or maximum waiting. Check the selected window after actual queueing; resolve multiple applicable restrictions by their intersection, not an arbitrary last entry (R2–R3).
- KTD5. **Allocate material before deriving supported output.** For each batch, retain the scaled frozen recipe requirement and the portion supplied by source WIP with explicit conversion/coverage. Never subtract the whole recipe again for ingredients already embodied in opening WIP. Select eligible material lots FEFO across lots, then stable lot ID; split consumption into stable `recipe:` identities per batch/ingredient/source lot. Evaluate at actual consumption times with known availability, admission and expiry. If material coverage fails, qualify that batch and prevent its dependent finished output from covering verified sales; preserve the provisional machine chronology. No silent rescheduling or purchases are introduced. STK emits physical and usable opening/closing quantities, movements and source-part depletion. V2 carry is a same-lot boundary continuation or an explicit balanced transfer, not disappearance (R4).
- KTD6. **Use an explicit calendar and replenishment ledger, not week×4.** A month contains dated production and sales entries mapped to representative-week day profiles, plus disclosed exceptions with sourced estimates. Sum production, sales, labor and variable costs using their respective mappings; monthly fixed costs occur once. Preserve production-only/sales-only days and unequal counts. Reconcile opening depletion, replacement and closing stock by item/unit/source with preparation entries containing quantities, prior in-week coverage references, material costs, labor, equipment, source and completion deadline. Walk mapped dates in order with a compact boundary-stock ledger: count month-opening quantities once, introduce only dated production/replenishment, and preserve readiness, expiry and admission of carry. A representative day's opening lot is not a fresh opening on every mapped date. Missing coverage or inconsistent profile transitions leave the dependent monthly quantities and repeatability unverified. This reconciliation does not schedule every operation of the month. Reuse PRC to check outside-week preparation against supplied availability and any overlapping reservations. A mapped cycle references its reconciliation entries once; do not multiply a monthly preparation entry by every sale day. Unknown residuals or resources qualify repeatability as unverified. Net drawdown can be replenished between periods without equal week-end stocks (R5–R6).
- KTD7. **Calculate independent qualifications over one identified cash/cost ledger.** Keep observed-week figures and modeled-month figures separate. Each result carries value, basis, period and a qualification with reasons; operational domains, repeatability, owner-net and recurring cash are independent. Use exact money helpers. Initial outlay, accrual cost and cash entries link a stable expense identity with a period and treatment so a payment is counted once per cash-flow scope. The monthly cash bridge reconciles supported-sales receipts, operating payments, inventory changes, owner charges and the 6000 PLN owner-income provision. When an aggregate cash input is used, require a sourced reconciliation to its included entries rather than adding both. Owner economic value remains disclosed separately from the same owner's income provision. CAPEX categories are equipment, premises preparation, deposit and initial stock; unknown is not zero. Payback uses qualified positive monthly cash after the owner provision, with distinct `unverified`, `no-finite-payback` and `calculated` outcomes (R6–R7).
- KTD8. **Pin comparisons to immutable saved runs.** Add an append-only `scenario-comparisons` collection with owner, request identity, comparison identity, ordered run relationships, fingerprint and versioned JSON manifest. A save requires at least two distinct scenario keys, each with an authorized v2 run matched to its revision/fingerprint. Runs are recomputed through the common v2 engine before initial comparison selection; opening a saved comparison reads those exact runs, never “latest.” The manifest records selection/order and identity, not a second copy of financial calculations. Compare by product/resource/cost identities, show additions/removals, provenance-only changes, periods, units and qualifications; suppress numerical deltas for unlike bases. Missing-data variants remain selectable. A new comparison is a new immutable record (R8–R9).
- KTD9. **Extend the trusted append protocol and feature UI.** Keep administrator-as-owner mapping and owner-filtered reads; deny anonymous/editor/baker and cross-owner access. Validate commands and persisted JSON on the server, including every comparison run relationship. Thread the active request through nested Payload operations with `overrideAccess: false`. Keep commit-confirmed receipts and stable retries with no automatic write retry. Reuse the generation/logout protections in every comparison load/save. Build feature-local week, month, investment and comparison controls using existing shared primitives and CSS Modules; render source explanations near affected results, with full snapshots still available (R9–R10).

Payload's official Local API access guidance confirms that user calls must explicitly enable access enforcement. Its transaction guidance says shared `req` preserves context but does not itself enable SQLite transactions. Therefore KTD9 retains the configured dedicated-connection adapter in `src/db/sqlite.ts` and requires real failure/commit evidence, rather than relying on framework defaults. Documentation: https://payloadcms.com/docs/local-api/access-control and https://payloadcms.com/docs/database/transactions. Context7 material tracks current main, not a guaranteed 3.94.2-specific reference; the installed adapter/config and existing integration tests are the compatibility evidence.

### High-Level Technical Design

The following sketches describe ownership, data flow, protocol, lifecycle and qualification gates. They complement KTD1–KTD9; they do not introduce a second owner for business rules.

**Component relationships and data flow**

| Stage | Receives from | Sends to |
|---|---|---|
| Workspace / comparison UI | Authorized pages/actions, current draft or pinned history | Validated save/run/compare commands |
| SCN service | Authenticated command, immutable revision/publications | PRC batch graph and resources; saved receipt |
| PRC | Batch graph, WIP history and sourced windows | Chronology, reservations, readiness and qualifications to SCN/STK/ECO |
| STK | PRC chronology, recipe coverage, lots and movements | Supported sales and stock boundary/depletion ledger to ECO |
| ECO week/month/investment | STK ledger, PRC labor, calendar, costs and outlay | Versioned qualified report to SCN persistence |
| Comparison reader | Authorized manifest and exact saved reports | Source differences, comparable deltas and separate qualifications to UI |

**Save/run/comparison protocol**

1. Authenticate and validate the command; keep its request identity across an uncertain response.
2. Resolve identical replay to its confirmed receipt; reject changed content under the same identity.
3. Authorize referenced publications/revisions/runs and bind exact fingerprints.
4. Evaluate the saved input for a new run, or validate pinned inputs for a comparison.
5. Append through the active request transaction and acknowledge only after COMMIT.
6. Render the returned identity; a failed append leaves prior confirmed history visible with an error.

**Workspace lifecycle**

| State | Event | Next state / visible result |
|---|---|---|
| Saved / result | Edit week, month or outlay | Changed; prior result retains its old revision label |
| Changed | Save | Saving; wait for receipt |
| Saving | Confirm / fail | Saved / changed with unsaved draft |
| Saved | Run | Running; pinned revision |
| Running | Confirm / fail | Result / saved with previous confirmed report |
| Comparison selection | Save selection / reopen | Pending receipt / exact persisted run pair |
| Any protected view | Logout / obsolete response | Protected state cleared; obsolete response ignored |

**Qualification gates**

| Dependent claim | Required evidence | Missing or failed evidence |
|---|---|---|
| People/machine feasibility | PRC simultaneous demands and capacities | Separate domain reasons, not a single verdict |
| Technology | Applicable sourced transition windows | Unverified when absent; explicit violation when exceeded |
| Material-supported sales | STK availability, admission, expiry and recipe/WIP coverage | Unmet quantities; dependent output not verified |
| Repeatable month | Calendar mappings and reconciled feasible replenishment | Week remains visible; recurring claims unverified |
| Owner-net / recurring cash | Qualified month, relevant operating costs, seller and owner-charge/provision basis | Preserve contribution; dependent monthly result unverified |
| Finite payback | Complete initial outlay and qualified positive recurring cash | Known nonpositive: no finite payback; missing basis: unverified |

### Assumptions and Deferred Implementation Details

- AS1. Saved comparisons are an immutable selection history, not mutable named dashboards. This makes reopening reproducible without introducing another edit-concurrency protocol.
- AS2. Month mapping uses explicit representative-day profiles and sourced exceptions. A day without a suitable profile remains unverified until the user supplies one; it is never silently converted into an average day.
- AS3. Opening WIP may lack earlier labor/cost. The week can still show its known continuation, while month qualification waits for the missing reconciliation under R5.
- Exact helper names, final UI grouping and generated migration timestamp are implementation details. The v2 shape, ledger ownership, version compatibility and qualification behavior are settled by KTD2–KTD8.
- No new dependency, runtime migration, public agent surface or external service is required. No bake-off is needed: the local immutable protocol and canonical owners resolve the consequential boundaries; the monthly simulator alternative is excluded by the simpler sufficient reconciliation in KTD6.

### System-Wide Impact and Assurance

Financial inputs, recipe snapshots and comparisons are business-sensitive; accounts/session identifiers are personal. Anonymous bakery roles remain capacities, not employee identities. The owner mapping and collection/server-action boundaries remain those documented in `docs/architecture/investment-scenarios.md`.

| Threat / consequence | Required control and evidence | Accountable owner |
|---|---|---|
| Cross-owner run references reveal finances | Authorize every selected run and relationship expansion; direct REST/action denial without protected data | Implementer; repository owner reviews |
| v2 parser breaks historical v1 readback | Frozen readers/engine dispatch and populated-history integration tests | Implementer |
| WIP or carry creates free material/work | Coverage conservation and boundary/preparation tests AE1–AE3 | PRC/STK/ECO implementer; domain owner validates real inputs |
| Duplicate preparation or initial stock inflates surplus/payback | Identity-linked ledger reconciliation, AE3–AE4 and aggregate-versus-itemized cases | ECO implementer; owner supplies financial basis |
| Failed COMMIT shown as saved comparison | Active-request append, independent connection readback, injected hook/commit failures and same-key retry | Service implementer |
| Schema addition or rollback loses history | Additive migration, populated v1/v2 restore drill and prior-app/verified-backup rollback instructions | Repository/service owner |
| Incomplete calendar implies false repeatability | Date/profile validation and independent unverified qualifications | ECO implementer |

Actual accounts/data require P0 approval. P1 applies if actual production events are introduced, which this scope does not require; P2 follows actual higher-risk use. The repository owner retains privacy, retention, deployment and applicable legal/financial review decisions. Manual windows and hypothetical economics do not establish food-safety, tax, demand or release approval.

---

## Implementation Units

### U1. Introduce versioned MVP-2 contracts and preserve history

**Goal:** Establish v2 batch/WIP/calendar/ledger contracts while keeping v1 saved data readable and replayable.

**Requirements:** R1–R9; KTD1–KTD3, KTD6–KTD8; SCN-AC-001–002, SCN-AC-017–018.

**Dependencies:** Existing TASK-INV-001 implementation.

**Files:** Modify `src/features/investment-scenarios/schema.ts`, `report-schema.ts`, `values.ts`, `service.ts`, `scenario.actions.ts`, `src/features/process-execution/schema.ts`, `src/features/stock-inventory/schema.ts`, `src/features/economics-investment/schema.ts`, `src/collections/investment-scenarios.ts`; create feature-local `legacy-v1.ts` and `upgrade.ts`; extend `schema.test.ts` and `src/tests/investment-scenarios.integration.test.ts`.

**Approach:**
1. Preserve v1 validators and evaluator behavior behind versioned dispatch; keep frozen v1 dependencies isolated from subsequent semantic changes.
2. Define v2 batch/product/operation references, opening and closing WIP, applicable windows, calendar profile mappings, reconciliation entries, outlay and typed result qualifications per KTD2–KTD7.
3. Validate all cross-references, dimensions, dates/zone offsets, costs/periods and unknown-versus-zero representations. Preserve existing bounded input validation without introducing an arbitrary one-product or one-day cap.
4. Make v1→v2 conversion a new editable draft and new append, with missing new financial fields explicit. Use stored schema/engine identity at all read/list/action boundaries and check envelope/body consistency.

**Execution note:** Characterize stored v1 JSON and retry behavior before changing the parsers.

**Patterns to follow:** `savedInputSchema`, `runBodySchema`, `fingerprint`, existing immutable collection JSON validation and `service.ts` transaction receipts.

**Test scenarios:**
- Read a populated v1 revision/run after adding v2 support: exact historical report, fingerprint and sources remain unchanged.
- Convert v1 to v2, save and reopen: original v1 is intact and new monthly fields remain explicitly missing.
- Retry an old v1 run key after v2 is installed: return the original run without invoking a different engine.
- Reject duplicate batch IDs, a ready lot from another batch, unknown references, wrong envelope/schema pair and invalid zone offsets with field-specific errors.

**Verification:** Both input/report versions round-trip through authorized server reads; old history remains usable before any v2 result is claimed.

### U2. Continue weekly WIP, reservations and transition windows

**Goal:** Evaluate representative-week processes across both boundaries with truthful labor and technology results.

**Requirements:** R2–R3; F1; AE1; KTD3–KTD4; PRC-AC-001–009 and SCN-AC-003–005, SCN-AC-007–009.

**Dependencies:** U1.

**Files:** Modify `src/features/process-execution/schema.ts`, `evaluate.ts`, `evaluate.test.ts`, `src/features/investment-scenarios/schema.ts`, `report-schema.ts`; extend `src/tests/fixtures/investment-scenarios.ts`.

**Approach:**
1. Extend v2 scheduling with fixed opening stage history and explicit continuation; retain the existing deterministic supplied-order policy.
2. Split reservation/labor exposure by interval and retain stages unfinished at close as WIP.
3. Evaluate transition-specific use/wait restrictions after queue placement and emit structured evidence for checked, violated and unknown domains.

**Patterns to follow:** Existing exact capacity comparisons, reservation segment checks, passive phase children and wait-window equality tests.

**Test scenarios:**
- Covers AE1. Sunday 22:00→Monday 06:00 preserves 8/2/6 h and does not add passive baker labor or a midnight restart.
- A 30-minute active reservation straddling the week boundary counts only its overlapping labor inside, with the remainder disclosed outside.
- Covers AE1. Queue start 05:45 against readiness 05:00 and a 30-minute window gives +15; 05:30 passes; absent or inapplicable windows leave only technology unverified.
- Two applicable windows use their intersection; a contradictory window or unknown reference gives an input error rather than selecting one silently.
- A passive stage unfinished at close remains WIP; a completed output's missing capacity or staff does not become unlimited feasibility.
- Confirmed observation fixtures remain unchanged when hypothetical evaluation flags a deviation; no EVT writer is introduced.

**Verification:** Chronology, interval labor, reservations and qualifications support AE1 without changing v1 reference results.

### U3. Connect batch recipe coverage to conserved weekly inventory

**Goal:** Produce time-qualified material, WIP and finished-stock balances that support only available sales.

**Requirements:** R1, R4, R6; F1; AE2–AE3; KTD3, KTD5; STK-AC-003–004, STK-AC-006, STK-AC-009–010; ECO-AC-005.

**Dependencies:** U1, U2.

**Files:** Modify `src/features/investment-scenarios/evaluate.ts`, `evaluate.test.ts`, `src/features/stock-inventory/evaluate.ts`, `schema.ts`, `evaluate.test.ts`, `src/features/economics-investment/evaluate.ts`, `evaluate.test.ts`, `src/features/investment-scenarios/report-schema.ts`; create `src/features/stock-inventory/recipe-coverage.ts` and `recipe-coverage.test.ts`.

**Approach:**
1. Scale frozen recipes per batch and reconcile opening WIP coverage before allocating residual ingredients under KTD5.
2. Allocate FEFO across eligible lots at actual consumption times with deterministic movement identities and source-part conservation.
3. Carry material qualification into dependent finished output and sales while retaining provisional process chronology.
4. Emit boundary snapshots at interval start/end with opening depletion and replenishment traces; retain v2 carry quantities or balanced destinations. Cost all produced batches, including unsold/waste quantities.

**Patterns to follow:** Existing stock portion provenance/expiry logic, exact quantity conversion and full-unit-versus-component validation.

**Test scenarios:**
- Covers AE2. 20−19.5−0.5 kg=0; an additional issue is rejected without changing the balance.
- Two eligible lots cover a batch in FEFO order across lot IDs; an earlier-expiring but late-delivered lot cannot cover earlier consumption.
- Opening WIP covering a known ingredient portion reduces residual recipe demand by that portion exactly once; missing conversion/coverage leaves material qualification unverified.
- Covers AE2. 100 ready pieces become 80 sales+10 carry+10 waste; next-day opening retains the usable carry, not zero or duplicate production.
- A stock shortage prevents the dependent batch from supporting verified sales; another adequately supplied product remains independently usable.
- Repeating identical movement IDs has no second effect; changed content conflicts. Split/merge retains sources, and expiry is evaluated at period close even with no late movements.
- Covers AE3. Multiple batches of B totaling 100 produced and 80 sold retain the 1800 PLN A/B cost and 2200 PLN contribution.

**Verification:** Stock boundary/depletion output is sufficient input for U5; sales, costs and quantities reconcile without touching operational collections.

### U4. Deliver the saved weekly workflow in the existing workspace

**Goal:** Let the owner enter, reopen and evaluate the complete TASK-INV-002 week through Polish controls.

**Requirements:** R1–R4, R6, R9–R10; F1; AE1–AE2, AE5; KTD1–KTD5, KTD9.

**Dependencies:** U1–U3.

**Files:** Modify `src/features/investment-scenarios/components/ScenarioInputs.tsx`, `ScenarioWorkspace.tsx`, `ScenarioReport.tsx`, `ScenarioWorkspace.module.css`, `ScenarioWorkspace.test.tsx`, `src/features/investment-scenarios/validation.ts`, `validation.test.ts`, `scenario.actions.ts`, `service.ts`, `reference.ts`; create feature-local `components/ScenarioWeekInputs.tsx` and `ScenarioWeekInputs.test.tsx`; extend `src/tests/investment-scenarios.integration.test.ts`.

**Approach:**
1. Add batch and opening-WIP controls with sourced times, window applicability, resources, lots and timed deliveries/sales. Extend existing primitives; avoid forcing users to edit raw JSON for the new flow.
2. Display dated chronology, boundary stock, unsupported sales and separate domain reasons, with input links and source context.
3. Preserve save/run/reopen, historical version selection, request keys and stale-response/logout handling. Keep the small synthetic MVP-1 reference and add a clearly labeled weekly example.

**Patterns to follow:** Existing shared `InputField`, `Button`, `PageLayout`, error-focus links and confirmed revision/run labels.

**Test scenarios:**
- Covers AE1–AE2. Enter and save a multi-day mixed week with Sunday WIP, deliveries and carry; reopening shows the exact sources and a persisted server-computed report.
- Add two batches of the same publication and a third product without changing prior batch context.
- A wrong unit/window reference focuses the corresponding Polish input; a missing window is accepted as missing and produces a qualified result.
- Save conflict/source failure preserves edits and prior report; a late response after navigation/logout cannot restore protected data.

**Verification:** TASK-INV-002 can be demonstrated through the real workspace/actions/database, including phone/tablet keyboard-readable results and no operational writes.

### U5. Qualify calendar months and replenishment economics

**Goal:** Turn the saved week into a sourced monthly assessment with independently qualified repeatability, owner-net and cash.

**Requirements:** R5–R6, R9–R10; F2; AE3–AE4; KTD6–KTD7, KTD9; SCN-AC-006–007, SCN-AC-011–014; ECO-AC-001, ECO-AC-003–008, ECO-AC-013.

**Dependencies:** U4.

**Files:** Create `src/features/economics-investment/month.ts`, `month.test.ts`, `src/features/investment-scenarios/components/ScenarioMonthInputs.tsx`, `ScenarioMonthInputs.test.tsx`; modify `src/features/economics-investment/schema.ts`, `evaluate.ts`, `src/features/investment-scenarios/schema.ts`, `evaluate.ts`, `report-schema.ts`, `components/ScenarioInputs.tsx`, `components/ScenarioReport.tsx`, `components/ScenarioWorkspace.test.tsx`; extend `src/tests/investment-scenarios.integration.test.ts`.

**Approach:**
1. Implement explicit date/profile mapping, date-ordered boundary reconciliation and aggregation under KTD6, with separate production, sales and preparation scopes.
2. Reconcile STK depletion and preparation quantities/costs, checking preparation with PRC resources and deadlines. Carry known/missing earlier WIP labor into qualification.
3. Build the KTD7 monthly cash bridge, explicit owner-charge/net provision and required-sales comparison for the matching period; retain the week figures alongside month results.
4. Expose calendar, reconciliation rows, factors and independent qualifications in the editor/report, persisted through existing v2 revisions/runs.

**Execution note:** Implement the numeric acceptance examples first; a “month complete” checkbox is not evidence of qualification.

**Patterns to follow:** `required-sales.ts`, rational money helpers, source-period validation and one-pool labor allocation.

**Test scenarios:**
- Covers AE3. 22 mapped sales days×100=2200; distinct production-only and sales-only dates use distinct factors and monthly rent occurs once.
- With only 100 usable month-opening pieces and no dated production/replenishment, mapping 22 sales-only days of 100 pieces cannot qualify 2200 sales. Adding dated replenishment covers only subsequent eligible dates; expired or not-yet-ready carry cannot cover an earlier sale.
- Covers AE3. WIP 10→0 with unknown preparation time/cost retains positive week results but unverified repeatability/net-dependent cash.
- Covers AE3. WIP 10→6 plus feasible 4 kg outside-week preparation costs 16+20=36 PLN once; known preparation of the other 6 kg is also covered.
- Missing preparation labor, conflicting resource availability or missed replenishment deadline keeps repeatability unverified despite known material cost.
- Duplicate reconciliation identity or overlapping cost/cash inclusion cannot double-count the same preparation; changes in stock/cash are explicitly bridged.
- Unknown rent or owner charges preserves contribution but not qualified owner-net. Seller labor and owner economic disclosure are not deducted twice.
- Reopen the month through the database and server action: mappings, source rows and qualifications equal the saved run, while editing the calendar makes it stale.

**Verification:** TASK-INV-003 passes its quantified examples in pure and persisted tests without simulating every day or requiring equal boundary stocks.

### U6. Add initial outlay and qualified simple payback

**Goal:** Show saved CAPEX/outlay and truthful payback from the qualified month.

**Requirements:** R6–R7, R9–R10; F3; AE4; KTD7, KTD9; SCN-AC-012–014; ECO-AC-006, ECO-AC-008–010, ECO-AC-013.

**Dependencies:** U5.

**Files:** Create `src/features/economics-investment/investment.ts`, `investment.test.ts`, `src/features/investment-scenarios/components/ScenarioInvestmentInputs.tsx`, `ScenarioInvestmentInputs.test.tsx`; modify `src/features/economics-investment/schema.ts`, `evaluate.ts`, `src/features/investment-scenarios/report-schema.ts`, `components/ScenarioInputs.tsx`, `components/ScenarioReport.tsx`; extend `src/tests/investment-scenarios.integration.test.ts`.

**Approach:**
1. Add the four initial outlay categories and their source/missing representation under KTD7.
2. Link expense treatments to monthly reconciliation so initial stock/deposit are not automatically monthly expenses and later replenishment remains a separate payment.
3. Persist the calculated months or typed reason for no confirmed finite return and display its underlying monthly qualification.

**Patterns to follow:** Exact signed money, no-finite-solution result modeling and source disclosure in existing economics output.

**Test scenarios:**
- Covers AE4. 80000+20000+10000+10000=120000; qualified post-owner cash 2000 gives 60 months.
- Covers AE4. Cash −3000 or 0 yields no finite payback; missing deposit, taxes or repeatability yields unverified instead.
- Initial stock paid once is not deducted again from the same monthly cash scope; a later 4 kg replacement remains a real separate cost/payment.
- An aggregate operating-payment input already containing seller or replenishment costs does not add those rows again; inconsistent reconciliation remains unverified.
- Save/reopen retains every outlay source and typed result; changing a source requires a new run.

**Verification:** TASK-INV-004 has persisted positive, zero, negative and incomplete demonstrations; no illustrative owner-charge figure becomes a tax default.

### U7. Save and reopen comparisons of recomputed variants

**Goal:** Deliver TASK-INV-005 over the actual week/month/investment pipeline, including variants with gaps.

**Requirements:** R8–R10; F3; AE5; KTD2, KTD8–KTD9; SCN-REQ-001–021 with SCN-AC-001–019 and SCN-AC-021 as integration coverage.

**Dependencies:** U6.

**Files:** Create `src/features/investment-scenarios/comparison.ts`, `comparison.test.ts`, `components/ScenarioComparison.tsx`, `components/ScenarioComparison.test.tsx`, `src/app/(app)/investment-scenarios/comparisons/[comparisonKey]/page.tsx`; modify `src/features/investment-scenarios/service.ts`, `scenario.actions.ts`, `access.ts`, `components/ScenarioWorkspace.tsx`, `components/ScenarioWorkspace.test.tsx`, `components/ScenarioWorkspace.module.css`, `src/collections/investment-scenarios.ts`, `src/payload.config.ts`, `payload-types.ts`; add a generated additive migration/snapshot in `src/migrations/` and register it in `src/migrations/index.ts`; extend `src/tests/investment-scenarios.integration.test.ts` and `src/tests/fixtures/scenario-restore-readback.ts`.

**Approach:**
1. Add KTD8's manifest schema, collection, owner-filtered reads and trusted append hooks with unique owner/request and comparison identities.
2. Let the owner create another variant from saved inputs under a new scenario key and request identity, changing quantities, hours, prices, losses and machines without modifying A.
3. Recompute each chosen saved revision through the common v2 run command, then save the ordered authorized run references and selection fingerprint. An unconfirmed run prevents the manifest save, preserving the selection for retry.
4. Build a pure difference projection and a feature-local accessible comparison view; label historical input/engine identities and unlike periods/bases. Reopen the manifest directly through the authenticated route.
5. Generate and inspect only the additive comparison-table/relationship migration and update Payload types; preserve recipe and v1/v2 scenario rows.

**Patterns to follow:** Existing append authority, unique composite indexes, actor-bound Local API and generation-based protected-state clearing.

**Test scenarios:**
- Covers AE5. Save/recompute A40 h and B84 h with changed price, loss and oven; missing rent B remains visible beside operational results and distinct required labor.
- Reopen a saved comparison after either variant has a newer revision: the selected old runs remain unchanged and the new revisions are not silently substituted.
- Same request/content returns the same manifest; changed selected runs under that key conflict. A failed COMMIT produces no success or partial manifest.
- Another owner's run, anonymous/editor/baker actor, forged trusted context or unauthorized relationship expansion is denied without protected output.
- Unlike units/period bases are labeled non-comparable rather than subtracted; provenance-only changes remain visible. Non-PLN financial inputs are rejected at validation, without adding multi-currency support.
- Populated v1/v2 history survives migration and fresh-process restore together with the manifest and cross-owner denial.
- Logout during comparison read/save clears both variants and ignores late responses.

**Verification:** A saved comparison is reproducible from two server-persisted v2 runs and cannot be replaced by fixture-only or mocked calculation output.

### U8. Complete integrated acceptance and delivery evidence

**Goal:** Supply reproducible evidence for all four tasks and preserve existing recipe/MVP-1 behavior.

**Requirements:** R1–R10; F1–F3; AE1–AE5; all task coverage inherited from `docs/projects/investment-scenarios.md#task-inv-002` through `#task-inv-005`.

**Dependencies:** U1–U7.

**Files:** Extend `scripts/investment-scenarios-smoke.ts`, `src/tests/investment-scenarios.integration.test.ts`, `src/tests/fixtures/scenario-restore-readback.ts`; add representative fixtures in `src/tests/fixtures/investment-scenarios.ts`; update `docs/architecture/investment-scenarios.md`, `docs/index.md`, `docs/projects/investment-scenarios.md`; create `docs/verification/mvp-two.md`.

**Approach:**
1. Extend the isolated built-server smoke to authenticated v2 save/read/run/compare, owner-filtered REST and forged append denial. Retain the recipe and MVP-1 baseline.
2. Exercise AE1–AE5 through genuine publications and persisted inputs, with paired complete/incomplete runs and operational before/after comparisons.
3. Capture changed-screen visual and accessibility evidence with source SHA, environment, exact checks, observed results and omissions. Record migration/restore/rollback evidence for populated history.
4. Document v2 ownership, conversion, ledger semantics, comparison paths and recovery. Update only the four INV task sections with actual delivery evidence; do not claim unrelated project completion.

**Patterns to follow:** Existing temporary-database production smoke, real COMMIT failure tests, fresh-process restore and `docs/verification/mvp-one.md` receipt shape.

**Test scenarios:**
- Covers AE1–AE5. Authenticated browser/action flow saves two mixed weeks, qualifies a month, computes outlay/payback, saves comparison and reopens its exact results.
- Remove the WIP preparation cost or rent from one variant and rerun: only the dependent qualifications change; complete chronology remains visible.
- Repeat identical v2 inputs with a different presentation layout: numbers and sources are identical, with no changes to recipes/publications/operational state.
- Verify invalid units, access denial, failed reads/writes and uncertain confirmations in the actual built action boundary, not just component mocks.
- Check phone/tablet/desktop, high zoom, keyboard/focus, readable sources and errors without color, and reduced motion; capture only synthetic data.

**Verification:** Evidence maps every bounded task contract to tests or actual UI checks and explicitly identifies remaining actual-data release decisions.

---

## Verification Contract

Commands below are execution-time checks, not results from planning. Use Node from `.node-version`, the lockfile, explicit environment configuration and the existing isolated database safeguards.

| Check | Scope / expected evidence |
|---|---|
| `npm ci` | Reproducible dependency installation against the recorded manifest/lockfile. |
| `npm run lint` | Changed domain, action, collection, script and UI code follows repository rules. |
| `npm run typecheck` | v1/v2 unions, report readers and generated Payload types agree. |
| `npm run test` | Pure PRC/STK/ECO examples, schema compatibility, component lifecycle and comparison projection regressions. |
| `npm run test:integration` | Existing recipe plus expanded scenario SQLite suites; populated migration, access, identity, concurrency, failure and restore evidence. |
| `npm run build` | Production App Router/Payload bundle remains buildable. |
| `npm run test:production` | Built recipe/history/scaling/auth baseline is preserved. |
| `npm run test:scenarios:production` | Extended built authenticated scenario and comparison actions/REST use a fresh synthetic temporary database. |
| `npm run security` | Existing repository checks and audit assessed against assurance, with explicit owned deviations where applicable. |
| Live browser review | F1–F3 with synthetic data at phone/tablet/desktop and high zoom, keyboard/focus and text-only states. |

Use targeted tests while implementing a unit, then complete the repository gates once the integrated feature is ready. Keep failures and skipped checks in the receipt. No `release:validate` script exists in the manifest; do not invent a successful gate under that name.

### Requirement and Task Evidence Map

| Task | Required scope and canonical coverage | Units / proof |
|---|---|---|
| TASK-INV-002 | SCN-REQ-002–003, 006–013, 015, 019; PRC-REQ-001–008; STK-REQ-001–004, 006–008, 014, 016; ECO-REQ-007–008, 011 | U1–U4, U8; AE1–AE3 plus all task-listed ACs, including no modification of observed facts in PRC-AC-007. |
| TASK-INV-003 | SCN-REQ-009, 012–016, 019; ECO-REQ-001–002, 005–011, 017; STK-REQ-007 | U5, U8; AE3–AE4, calendar factors, boundary replenishment, allocation, owner-net and cash basis. |
| TASK-INV-004 | SCN-REQ-013–017, 019; ECO-REQ-002, 009, 012–014, 017 | U6, U8; AE4 with positive, zero, negative and missing-input persisted cases. |
| TASK-INV-005 | SCN-REQ-001–021 and SCN-AC-001–019, SCN-AC-021; inherited PRC/STK/ECO owners | U7–U8 plus preceding units; AE5, genuine two-variant recomputation and saved comparison. |

The inclusive, prefix-qualified coverage lists and AC lists in the canonical task sections remain the checklist source; this map assigns implementation ownership, not replacement criteria. `docs/verification/mvp-two.md` records REQ/AC → named test/check → log/artifact → observed result with SHA/date/environment. Review the full task-listed coverage before declaring any task done.

---

## Definition of Done

- U1–U8 meet their stated observable verification outcomes; no active unit is substituted with a static mockup.
- TASK-INV-002, TASK-INV-003, TASK-INV-004 and TASK-INV-005 each have canonical REQ/AC evidence from the connected persisted workflow.
- Version-1 data remains readable and deterministic; version-2 source snapshots, qualification reasons and saved comparison identities survive reopening and restore.
- Numerical examples and required failure/access paths pass the Verification Contract, including the actual built server boundary and changed screens.
- Changed code is reviewed and abandoned-attempt code is removed; user-owned work is preserved.
- Architecture/recovery and task evidence are updated, with only actual observed results reported. Actual-data release and repository enforcement approvals are identified separately under existing assurance.
