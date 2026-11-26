---
title: MVP-1 Connected Investment Scenario - Plan
type: feat
date: 2026-11-25
artifact_contract: ce-unified-plan/v1
product_contract_source: repository-capability-specifications
origin: docs/projects/investment-scenarios.md
execution: code
---

# MVP-1 Connected Investment Scenario - Plan

## Goal Capsule

- **Objective:** Właściciel planowanej piekarni może ocenić zadany dzień produkcji i jego warunki finansowe przed najmem i zakupem wyposażenia, rozpoznając wyniki policzone oraz brakujące podstawy decyzji.
- **Means:** Extend the existing application with a persisted investment-scenario flow and deterministic PRC/STK/ECO evaluation (KTD1–KTD8).
- **Authority:** `docs/product-plan.md#MVP-1` selects `docs/projects/investment-scenarios.md#task-inv-001`; its SCN/PRC/STK/ECO owners define behavior. `docs/decisions.md`, `docs/engineering-assurance.md`, `docs/design-system.md` and `docs/index.md` govern their respective boundaries. This plan adds implementation direction, not a replacement specification.
- **Execution profile:** One bounded connected increment, delivered through U1–U8. Use synthetic data for initial proof; preserve the current recipe integration and unrelated working-tree content.
- **Stop conditions:** Stop affected implementation on a canonical behavior conflict, unavailable recipe publication/scaling integration, unsafe persistence semantics, or inability to enforce resource ownership. Missing business inputs produce qualified partial results under R8, not a global implementation stop.
- **Completion ownership:** The implementer supplies code and verification receipts; the repository owner reviews delivery and decides release. The calling delivery workflow owns commits, PR publication and CI. Planning alone authorizes none of those actions.

---

## Product Contract

### Summary

MVP-1 łączy wybór opublikowanych receptur, źródłowe pomiary ręczne i zapis wariantu z przebiegiem zadanej kolejności oraz raportem zdolności, bilansów i ekonomii. Pierwszy wynik może być częściowy; potwierdzenie dochodu miesięcznego i zwrotu wymaga podstaw spoza demonstracji dnia.

### Problem Frame

Właściciel ocenia otwarcie małej piekarni przed podjęciem kosztownych zobowiązań. Same receptury i dodatnia marża nie pokazują, czy człowiek i wspólny piec przygotują zakładane ilości na czas. Pomiary z istniejącej piekarni mają kontekst, którego nie wolno ukryć przy przenoszeniu na inną skalę lub urządzenie.

### Actors

- A1. Właściciel wariantu wybiera receptury, dostarcza założenia, zapisuje, otwiera i uruchamia ocenę.
- A2. Dostawca pomiarów dostarcza źródło i kontekst; może być tą samą osobą co A1.
- A3. Właściciel-piekarz i osobny sprzedawca są rolami zasobów, nie nowymi kontami ani ewidencją obecności.

### Requirements

The following plan-local IDs index the canonical scope. Normative details remain at the cited capability owners; ranges are inclusive. Weekly/monthly extensions in those contracts are limited by `TASK-INV-001`, not silently declared delivered.

**Variant, provenance and lifecycle**

- R1. Wariant zachowuje wersje receptur, parametry produktów, źródła i kwalifikację każdej wartości bez zmiany danych rzeczywistych. Owner: SCN-REQ-001–002, SCN-REQ-006–007; SCN-AC-001–002, SCN-AC-005.
- R2. Zapisany wariant daje się ponownie otworzyć i uruchomić, a wynik wskazuje dokładne użyte wejścia również po ich późniejszej edycji. Owner: SCN-REQ-007–008; SCN-AC-002, SCN-AC-006, SCN-AC-021.

**Process and availability**

- R3. Ocena zadanej kolejności ujawnia terminy, oczekiwanie, równoczesne ograniczenia ludzi i urządzeń oraz właściwe okna technologiczne. Owner: SCN-REQ-003, SCN-REQ-010; PRC-REQ-001–003, PRC-REQ-005, PRC-REQ-007; SCN-AC-003, SCN-AC-008–009, SCN-AC-016; PRC-AC-001–004, PRC-AC-006, PRC-AC-008.
- R4. Raport oddziela dostępność właściciela i sprzedawcy od wymaganego nakładu oraz czasu pasywnego i pomocniczego. Owner: SCN-REQ-004–005, SCN-REQ-011; PRC-REQ-004–005; SCN-AC-004, SCN-AC-008; PRC-AC-001, PRC-AC-005–006.

**Quantities and finance**

- R5. Bilans zachowuje ilości, jednostki, gotowość i dopuszczenie do sprzedaży, ujawniając niedobory, przeniesienia i straty badanego dnia. Owner: SCN-REQ-012; STK-REQ-001–003, STK-REQ-007–008; SCN-AC-010; STK-AC-003, STK-AC-006, STK-AC-009 w zakresie ponowień izolowanego wariantu.
- R6. Ekonomia zachowuje historyczny skład i źródłowe koszty, licząc tę samą pracę raz i oddzielając podstawy wyniku. Owner: SCN-REQ-013; ECO-REQ-001, ECO-REQ-003–006; SCN-AC-011; ECO-AC-001–003, ECO-AC-006.
- R7. Raport oblicza wymaganą sprzedaż dla jawnego miksu, kosztów i strat oraz zestawia ją z ilościami gotowymi w terminie bez deklarowania popytu. Owner: SCN-REQ-014–015; ECO-REQ-007–009; SCN-AC-006; ECO-AC-004–006.
- R8. Wynik oddziela ocenę operacyjną, finansową i konkretne niezweryfikowane ograniczenia, zachowując poprawne wyniki częściowe. Owner: SCN-REQ-019, ECO-REQ-009; SCN-AC-006, SCN-AC-018, SCN-AC-021.

**Access, failures and interface**

- R9. Serwer kontroluje dostęp, poprawność, ponowienia i konflikty zapisu bez ujawnienia cudzych danych ani fałszywego sukcesu. Owner: SCN-REQ-020, STK-REQ-014, ECO-REQ-017; SCN-AC-017–018; STK-AC-009; ECO-AC-013; assurance `ass-access`/`ass-integrity`/`ass-recovery`.
- R10. Polski interfejs pozwala wprowadzić parametry oraz odczytać liczby, braki i błędy klawiaturą oraz na telefonie i tablecie. Owner: SCN-REQ-021, STK-REQ-016; SCN-AC-019; `docs/design-system.md#ui-accessibility`.

### Key Flows

- F1. A1 otwiera „Scenariusze inwestycyjne”, wybiera konkretne publikacje, dostarcza pomiary A2 i parametry, zapisuje i ponownie otwiera wariant. Covers R1–R2, R9–R10.
- F2. A1 uruchamia zapisaną wersję, odczytuje przebieg, bilans i ekonomię w tym samym raporcie. Covers R3–R8.
- F3. A1 zmienia wejścia, zachowuje rozpoznawalny dawny wynik i zapisuje nową wersję przed ponownym obliczeniem. Błąd lub odmowa nie tworzą nowego potwierdzonego wyniku. Covers R2, R8–R10.

### Acceptance Examples

- AE1. Covers F1–F2 / R1–R8. Pełny SCN-AC-021: publikacje A v1/B v1, A20/B12 i piec 20 dają oczekiwanie B 15 min, gotowość o 06:50 oraz 30 osobominut piekarza. ECO pokazuje 460−224=236−100−80=56 PLN przed obciążeniami i dochodem właściciela; netto miesięczne i zwrot są niezweryfikowane. Wszystkie źródła i wejścia przechodzą przez zapis i ponowny odczyt.
- AE2. Covers F2 / R7–R8. SCN-AC-006 i ECO-AC-004: zadane 20/10 PLN oraz budżet 24 000 PLN wymagają 2 400 szt./48 000 PLN; przebieg dostarczający 2 200 gotowych sztuk daje deficyt 200. Porównanie dotyczy tego samego jawnego okresu i nie potwierdza powtarzalnego miesiąca.
- AE3. Covers F3 / R2, R9–R10. SCN-AC-017–019: odmowa cudzej wersji, błąd zapisu/odczytu i zmiana wejść nie podmieniają podpisu starego wyniku; użytkownik widzi polski opis stanu.

### Scope Boundaries

- Zakres obejmuje cały `TASK-INV-001`, nie wszystkie zachowania późniejszych etapów obecne w tych samych specyfikacjach.
- Nie ma limitu jednego produktu ani sztywnego limitu dwóch produktów. AE1 jest minimalnym dowodem połączenia, nie specjalnym trybem obliczeń.
- Rejestrator OBS, rzeczywisty magazyn, POS, MRP, pełne grafiki, formalna obecność, optymalny solver, FER, mapa, AI i finansowanie rozruchu nie są poprzednikami tej ścieżki.
- Nie powstają zatwierdzone plany, fakty wykonania ani polecenia zakupów. Geometria nie jest wejściem obliczeń.
- Considered and not built: background job queue, automatic mutation retries and a global event ledger. The synchronous bounded evaluation has no external side effects; immutable saves and explicit retries under KTD4 close the applicable integrity gap. Reconsider if measured runtime or actual event integration requires them.

#### Deferred to Follow-Up Work

- `TASK-INV-002`: representative week, opening WIP continuation, richer queues and period-spanning balances. The current schema preserves explicit timestamps and boundary provenance without claiming that full flow.
- `TASK-INV-003–004`: validated month/replenishment/cash-flow qualification and investment payback. MVP-1 displays the relevant unverified conclusions under R8.
- `TASK-INV-005–006`: side-by-side recalculated variant comparison and growth alternatives.
- Unrelated legacy English navigation, global component cleanup and the stale stack/decision summaries outside the canonical owner are separate documentation/maintenance work.

---

## Planning Contract

### Evidence Baseline

- Inspected baseline: commit `65abf5ded40fda8c242ec7b6da97b8fcb24164ec` on `feat/mvp-zero-recipes`. The preexisting untracked `docs/ideation/` directory is user work.
- `package.json`, `src/app/(app)/`, `src/app/(payload)/` and `src/payload.config.ts` establish React 19.3.1, Next 16.4.6, Payload 3.94.2 and local SQLite. Root `AGENTS.md` has an older runtime description; `docs/index.md` points to the actual manifest.
- Recipe publication freezes JSON in `src/collections/recipes.ts`; `Publications` rejects user writes. `src/features/recipes/schema.ts` validates the frozen data and `scaling.ts` always computes from its base. Its target accepts any positive safe integer even though `Catalog.tsx` offers four presets.
- The recipe process currently contains free-text instructions, not structured timing or equipment. Scenario operations must be explicitly entered and linked to publication/step identity; no extraction of timings from prose is assumed.
- `Catalog.tsx` authenticates through Payload REST and retains older publication IDs. `src/features/hydration/hydration.actions.ts` shows a validated server function but no persistent actor authorization pattern to copy wholesale.
- `src/db/sqlite.ts` owns an enabled, dedicated-connection transaction boundary. `src/tests/recipes.integration.test.ts` contains contention, actual COMMIT-failure and independent-readback tests. Those are source evidence, not tests rerun during planning.
- `TASK-REC-005` records implemented behavior with verification in progress; `docs/verification/mvp-zero.md` and the linked browser receipt are the existing evidence pointers. Reprove this dependency in the connected demonstration rather than treating its status label as final approval.
- `docs/decisions.md#dec-001` is ACCEPTED; older OPEN summaries in other documents do not override it. DEC-002 explicitly excludes manual INV observations without an actual event stream.

### Assumptions

These are unvalidated agent defaults, not session-settled user decisions. They do not alter canonical requirements.

- AS1. Use existing `administrator` accounts as scenario-owner accounts for this increment. Each owns only their scenarios; another administrator, editor or baker has no scenario access. This avoids inventing an organization model or treating recipe-edit permission as financial-data permission. The repository owner may replace this default before implementation if a distinct owner role is required.
- AS2. The first evaluation surface edits one explicit dated interval, normally a day, with timezone and offset-qualified instants. The same calculation can evaluate a larger explicit interval needed by AE2, without claiming representative-week/month qualification or recurrence.
- AS3. No actual-account/data release is requested by this implementation plan. Synthetic proof is the initial delivery target; P0 release ownership and legal applicability remain explicit conditions of real use.

### Key Technical Decisions

- KTD1. **Keep one application and one owning function per domain rule.** Add `src/features/investment-scenarios/` for SCN orchestration, with pure PRC, STK and ECO modules under `src/features/process-execution/`, `src/features/stock-inventory/` and `src/features/economics-investment/`. R1–R10 govern behavior. This keeps reusable calculation ownership without introducing services, a solver or another source of truth.
- KTD2. **Use explicit structured scenario inputs and tagged evidence values.** Every source-bearing quantity, duration, capacity, price and cost carries measured/estimated/missing status, source/date/version, period, unit and relevant context. A measured operation includes recipe publication, batch scale, staffing, machine and conditions; applying it to a different context requires an explicit estimate with a reference to the original observation. Missing values are persisted as missing, not zero. Server validation rejects contradictory known data while permitting useful incomplete variants (R1, R3–R8).
- KTD3. **Persist immutable scenario revisions and immutable runs.** Two Payload collections, `scenario-revisions` and `scenario-runs`, store validated, versioned JSON plus indexed identity/ownership metadata. Revision fields include scenario key, revision number, previous revision, owner, save request key, content fingerprint and input schema version. A run references one revision, its fingerprint, engine version, exact input snapshot and output. Save server-resolved authorized publication snapshots with their IDs/version keys; never trust a client-supplied recipe copy. This append-only snapshot model is smaller than an event ledger and preserves R1–R2 without solving DEC-002.
- KTD4. **Serialize append checks and writes through the existing SQLite transaction adapter.** A save command carries an opaque request key and expected latest revision. Within one request-scoped transaction, authorize the owner, check replay identity, read the current head and append the next revision. Unique owner/scenario/revision and owner/request identities back the checks. Identical retry returns the existing receipt; the same key with different content conflicts. A stale expected revision conflicts; no silent overwrite or automatic retry. Run persistence follows the same receipt rule, keyed to the immutable revision and request identity. Return success only after COMMIT. Reuse `src/db/sqlite.ts`, not custom unlocked read-then-write logic (R2, R9).
- KTD5. **Use a deterministic serial schedule-generation evaluator, not optimization.** Validate dependency acyclicity and user-supplied priority order. For each ready operation, find its earliest feasible interval at or after its requested start and predecessor finish using already reserved role/equipment intervals; ties follow saved priority then stable operation ID. Intervals are half-open, so a resource released at 06:30 can be reused at 06:30. Reserve simultaneous demands together and include all active/auxiliary segments. A batch larger than known capacity is a conflict, not automatically split. Missing duration/capacity/conversion blocks certification of the affected branch, not unrelated known branches. Record causal waiting and missed deadlines, never a global-optimum claim (R3–R4).
- KTD6. **Keep phase duration, labor segments and resource occupation distinct.** Passive phases may contain explicitly timed active child operations; their dependency is the phase start plus the entered offset, not phase completion. Preserve declared phase boundaries and flag a child that cannot fit after resource waiting instead of silently extending the phase. Other dependencies may require a phase finish. Validate chronological consistency and labor segments independently. Check applicable wait windows against actual next start, with equality allowed. Unknown windows keep technology unverified even when machine scheduling succeeds (R3–R4).
- KTD7. **Evaluate quantities and costs with exact decimal arithmetic.** Reuse recipe scaling and DEC-001 rational mass rules; add zero-capable stock quantity parsing without weakening positive recipe-mass validation. Normalize g/kg exactly, keep pieces distinct, and require an explicit yield conversion for mass/pieces. Persist decimal strings, never BigInt JSON or floating-point money. ECO uses exact rational decimal calculation, PLN amounts and signed totals, rounding monetary report boundaries to 0.01 PLN half away from zero; unit prices/rates retain entered precision. Record this engineering rounding convention with the result version (R5–R7).
- KTD8. **Propagate independent qualifications through PRC → STK → ECO.** Each output carries known values, estimates and specific unmet prerequisites. STK consumes readiness, admitted quantities and time-bound movements before ECO recognizes hypothetical sales. ECO separately evaluates actual scenario totals and required sales from the entered mix/budget. A period-mismatched capacity comparison is unverified, not a numerical deficit. The first increment never certifies recurring month, owner-net goal or payback solely from a day (R5–R8).
- KTD9. **Put actor enforcement in the server service and collection boundary.** Next server functions obtain Payload authentication from request headers/cookies, validate commands and call the feature service. Every user Local API operation uses actor context and `overrideAccess: false`. Collection reads enforce AS1; direct REST/Admin create/update/delete of revisions/runs are denied. Only a server-created request context allows validated service append operations, with the same actor/ownership checks. GraphQL remains disabled. Owner, sequence, recipe snapshots and computed outputs are server-controlled (R9).
- KTD10. **Use a Polish feature workspace with an explicit saved-input/run boundary.** `/investment-scenarios` lists variants and offers creation; `/investment-scenarios/[scenarioKey]` contains parameters and report. Client feature state distinguishes loading, empty, draft, saving, saved, running, result, changed inputs, denied and error. Run the last confirmed revision; unsaved changes are labeled and cannot masquerade as a new saved run. Reuse `PageLayout`, `InputField`, `Button`, shared tokens and custom-media breakpoints (R2, R9–R10).

KTD3 and KTD5 are the consequential design choices. Event sourcing and a constraint solver were rejected because this task needs repeatable snapshots and evaluation of a supplied order, not actual-event replay or an optimal order. No competing mechanism survived the bounded scope strongly enough to require a bake-off.

### High-Level Technical Design

The following sketches map the architecture, data flow, protocol, lifecycle, decision branches and persistent shape governed by KTD1–KTD10. Arrows show ownership handoffs; they do not imply a new event bus.

**Architecture and data-flow sketch**

`Next pages + feature workspace` → `authenticated scenario server functions` → `scenario service` → `Payload revisions/runs`.

`authorized Publications snapshot + saved manual inputs` → `PRC chronological evaluation` → `STK availability/balance` → `ECO finance + required sales` → `version-bound report`.

PRC/STK/ECO are pure functions used by the service. None can write recipe, production, stock or workforce collections. Presentation state is not a calculation input.

**Persistent-shape sketch**

| Record | Identity | Stored body | Relations | Mutability |
|---|---|---|---|---|
| Scenario revision | Owner + scenario key + revision | Input schema version, fingerprint, full sourced inputs | Previous revision, publication IDs/version keys | Append only |
| Recipe selection | Product key within input | Frozen publication + target count + scaled requirements | Authorized publication | Frozen within revision |
| Operation | Operation key within input | Dependencies, phase/child link, priority, evidence, role/resource segments | Product and publication step | Frozen within revision |
| Stock movement | Movement key within input | Time, kind, signed direction, quantity, admission/expiry/provenance | Material/product/lot and source parts | Frozen within revision |
| Scenario run | Owner + request key | Engine version, input identity, outputs and qualifications | Exactly one revision | Append only |

**Save/run protocol sketch**

| Step | Save revision | Evaluate saved revision |
|---|---|---|
| 1 | Authenticate and validate command | Authenticate and authorize revision |
| 2 | Resolve publication IDs and validate snapshot/context | Load exact immutable input and engine version |
| 3 | Begin transaction; replay check and expected-head check | Compute PRC/STK/ECO without writes |
| 4 | Append revision under request identity | Begin transaction; replay check and append run |
| 5 | Commit; return confirmed revision | Commit; return confirmed run |

Authorization is repeated at the append boundary. Any failure before confirmed commit yields an error, not the step-5 receipt. A lost response after commit is recovered by repeating the same request identity (KTD4).

**Client lifecycle sketch**

| State | User/system event | Next state and retained data |
|---|---|---|
| Loading | Read succeeds with no records | Empty; offer create |
| Loading | Read denied/fails | Denied/error; no foreign data or empty-success message |
| Draft/changed inputs | Save | Saving; retain local input and prior confirmed identity |
| Saving | Commit receipt | Saved; bind confirmed revision |
| Saving | Conflict/write error | Changed inputs + error; retain prior confirmed revision/run |
| Saved | Run | Running on named revision |
| Running | Commit receipt | Result on named revision/run |
| Result | Edit any input | Changed inputs; old result remains labeled with its old revision |
| Running/loading | Switch variant or logout | Ignore obsolete responses; clear inaccessible data |

**Evaluation decision sketch**

1. Invalid structure, negative values, impossible identity or dependency cycle → reject the command with field-linked errors.
2. Missing evidence needed by one branch → retain its unverified reasons and evaluate independent branches.
3. Known resource demand exceeds capacity or cannot fit availability → report a conflict and affected readiness; do not invent a completion time.
4. Known resource fit with waiting → compare the applicable technology window, then pass readiness to STK.
5. Sale before readiness, without admission, beyond stock or beyond expiry → expose unmet sale quantity; only supported hypothetical sales reach ECO.
6. Missing costs or period qualifications → preserve computed components and withhold the dependent financial conclusion.

### Domain Calculation Boundaries

**PRC.** Inputs include stable phase/operation/product/resource keys, explicit timestamps and timezone, saved order, precedence edges, evidence-bearing duration and staffing segments, equipment quantities/units and availability, ready-by deadlines and applicable sourced windows. There is no automatic scaling of time by headcount. Compare simultaneous reservations, not only daily totals. A larger explicit interval under AS2 uses the same rules; beginning-before-interval passive input remains visible for PRC-AC-006 without claiming the full MVP-2 WIP workflow.

**STK.** Compute hypothetical balances from explicit opening material/WIP/finished lots, deliveries, recipe-scaled consumption, losses with reasons, readiness receipts, admitted returns, sales, transfers/carry and waste. Each movement has a stable identity; identical duplicates are counted once and conflicting duplicates are errors. Preserve source part identities when splitting/merging. Refunds have no quantity effect; inadmissible physical returns do not enter saleable stock. Reject over-issue without partial balance mutation. Unknown opening stock or missing conversion qualifies the material result independently of machine feasibility. Only admitted, usable stock at the sale time can cover demand (R5).

**ECO.** Cost rows identify category, historical ingredient/product reference, basis, period, gross/net basis, rate/quantity and source. Support ingredient, packaging, batch, measured/estimated energy, equipment, labor, rent and other fixed costs. Explicit zero is permitted; absence is not zero. Cost-basis alternatives are mutually exclusive for the same expense identity: a full unit-cost estimate may be used with disclosed basis, but not added to the same component costs again. Labor allocations split one identified cost pool and show unresolved allocation rather than guessing unique workers (R6).

For R7, sales mix is explicitly a mix of sold pieces. Compute required sold quantities from weighted contribution after production losses and the sourced period budget, then round to a whole-piece mix bundle and recompute produced quantities/costs so the displayed result covers the budget. Preserve the exact mix basis and disclose rounding. A positive budget with nonpositive contribution has no finite solution. A 100% loss cannot produce a finite sold quantity. Do not substitute the 6 000 PLN monthly net goal directly into a daily budget. A sourced total budget may support a conditional required-sales calculation even when its tax decomposition is missing; owner-net qualification remains separate.

ECO reports gross margin on its disclosed product-cost basis, contribution, fixed costs, operating remainder and cash surplus only from explicit cash receipts/payments. It shows contribution per piece/batch/person-hour/bottleneck minute with an identified denominator; missing or zero denominators yield a reason, not infinity. Planned staff cost, actual-time cost, employment cost, operation labor and owner economic value remain distinct categories; unused actual categories display “nie dotyczy / brak danych”, not invented actual observations. Owner economic value is shown without a second deduction from the same financial basis. AE1's 56 PLN is an operating remainder before owner charges/income, not verified cash surplus or owner profit.

### System-Wide Impact and Assurance

- **Data:** Recipe publications are internal/business-sensitive; scenario costs, assumptions and results are business-sensitive. Existing user account/session identifiers are personal. Resource roles contain no employee identities. Provenance fields should describe the source without collecting unnecessary names.
- **Actors and rights:** AS1 governs every list/detail/revision/run read and append. Anonymous, editor, baker and other-owner administrator requests deny. No scenario approval operation exists, and scenario access does not grant recipe publication rights.
- **Trust boundary:** Browser → authenticated server function → validated service → collection ACL/hooks → local SQLite. Server pages do not make action checks redundant. Direct REST reads are ownership-filtered; native writes deny; GraphQL stays disabled. Reject unknown/control fields and apply bounded text/array/request sizes without imposing a business one/two-product cap.
- **Integrity:** KTD3–KTD4 protect stale edits, duplicate saves and historical results. Server re-resolves publication access and rejects forged snapshots. No partial success is reported after an adapter failure. Run computations are deterministic and side-effect-free until a separate run append commits.
- **Observability:** Record operation type, sanitized error category, request/revision/run identity and engine version. Do not log credentials, full financial payloads, personal provenance or foreign resource existence. UI separates denied, validation, version conflict, persistence and source-read failures.
- **Recovery:** Additive migration registers only new collections/indexes and Payload relation changes. Preserve existing recipe rows/publications. Back up the stopped local database and required configuration under ADR-001; restore to an isolated nonpublic target and verify revision/run JSON, ownership and publication identity. No media is introduced. Production rollback uses the prior app and verified pre-migration backup; destructive down migration is test-only.
- **Risk ownership:** Implementer owns technical access/integrity evidence; repository/service owner owns deployment, retention, backup schedule and release; business owner validates input applicability and financial assumptions. Review date: 2026-11-25. No actual deployment approval or named legal approver is assumed.
- **Legal applicability:** Account/log/privacy assessment remains to be completed by the actual controller before real data. No employee attendance, payroll, monitoring, food-safety certification or external AI processing is introduced. Financial outputs are calculations on sourced assumptions, not validated tax advice.

### Risks and Dependencies

| Risk/dependency | Consequence | Treatment and evidence | Accountable owner |
|---|---|---|---|
| TASK-REC-005 verification still in progress | Fixture-only demo could hide broken catalog integration | U2/U8 use real authorized publications and scaling; preserve recipe regressions | Implementer |
| SQLite transaction/COMMIT behavior | False confirmation or duplicate revision | U2 migrated integration includes independent readback, contention and commit-failure receipt tests | Implementer |
| Cross-owner financial-data access | Disclosure through actions, REST or populated relations | U2 ownership matrix and deny tests for every exposed path | Implementer |
| Missing/changed measurement context | False target-machine capacity | U1/U3 reject unmarked reuse and preserve estimates/missing branches | Business owner + implementer |
| Day result interpreted as monthly net/payback | Misleading investment decision | U5/U7 enforce independent qualifications under R8 | Business owner + implementer |
| Rounding, units, mixed periods or tax bases | Incorrect money/capacity conclusion | U1/U4/U5 exact arithmetic and explicit basis tests | Implementer |
| Real-data P0 not approved | Synthetic delivery mistaken for release approval | U8 records actual-use gates and named release-owner handoff | Repository/service owner |

### Research Shaping the Design

- `docs/architecture/mvp-zero.md` constrains deployment and recovery to a persistent single-host local SQLite file; no new provider or framework migration is planned.
- Official Payload v3 docs: [Local API access control](https://github.com/payloadcms/payload/blob/v3.85.0/docs/local-api/access-control.mdx) and [transactions](https://github.com/payloadcms/payload/blob/v3.85.0/docs/database/transactions.mdx) require explicit user access enforcement and shared request transaction identity. These shape KTD4/KTD9. Context7's available version is 3.85.0, not installed 3.94.2; the repo adapter and its regression evidence remain essential for exact-version durability.
- Official Next [Server Function security](https://github.com/vercel/next.js/blob/v16.4.5/docs/01-app/03-api-reference/01-directives/use-server.mdx) and [data security](https://github.com/vercel/next.js/blob/v16.4.5/docs/01-app/02-guides/data-security.mdx) treat actions as independent untrusted entry points. This shapes KTD9; documentation is the adjacent available 16.4.5 version, while the manifest pins 16.4.6.

### Deferred Implementation Details

Final helper names, migration timestamp and generated schema files depend on implementation. The exact migration must be generated/reviewed against installed Payload, including its metadata/relationship tables. Runtime duration, database busy behavior and built HTTP action wiring require execution evidence; they are not claimed verified by static inspection.

---

## Implementation Units

### U1. Define sourced scenario inputs and calculation identities

**Goal:** Give the editor and server one validated input/result contract with explicit missing values.

**Requirements:** R1, R3–R10; F1–F3; KTD2, KTD6–KTD8.

**Dependencies:** None.

**Files:** Create `src/features/investment-scenarios/schema.ts`, `identity.ts`, `schema.test.ts`, `identity.test.ts`; create domain input/output types alongside `src/features/process-execution/schema.ts`, `src/features/stock-inventory/schema.ts`, `src/features/economics-investment/schema.ts`.

**Approach:**
1. Define the versioned contracts from the domain boundaries above, with stable operation/movement/cost identities and typed qualification reasons.
2. Reuse `snapshotSchema` and recipe precision without changing their positive-mass contract; define separate nonnegative inventory and signed financial representations.
3. Normalize units, exact instants and canonical content fingerprinting independently of presentation, request IDs and generated record metadata.

**Patterns to follow:** `src/features/recipes/schema.ts`, `precision.ts`; canonical terminology in `docs/domain/glossary.md`.

**Test scenarios:**
1. Preserve a measured time, estimated price, missing rent and explicit zero loss across schema serialization.
2. Reject negative time/quantity, staffing −1 or 1.5, contradictory availability, duplicate IDs with different content, dependency cycles and invalid unit combinations.
3. Preserve original context for a 20 kg/two-person/X measurement; reject its use as a measurement for one-person/Y without an explicit estimate or missing target time.
4. Accept known zero stock; reject a 0-quantity movement and a mass with more than three decimal places; normalize 1 kg to 1000 g without converting it to pieces.
5. Equal normalized inputs yield the same fingerprint after reload; changing a source, order, quantity or cost changes it.
6. Reject ambiguous local time without offset and contradictory offset/zone data; preserve an interval crossing midnight without restarting it.

**Verification:** Client and server can share a JSON-safe contract whose qualifiers survive round-trip and whose errors identify the affected field/identity.

### U2. Persist authorized immutable revisions and run receipts

**Goal:** Owners save/reopen versions safely, with no alternate API path bypassing ownership or integrity.

**Requirements:** R1–R2, R9; F1/F3; KTD3–KTD4, KTD9; AS1.

**Dependencies:** U1 and the existing publication/scaling code.

**Files:** Create `src/collections/investment-scenarios.ts`, `src/features/investment-scenarios/service.ts`, `access.ts`, `scenario.actions.ts`, `src/tests/investment-scenarios.integration.test.ts`; modify `src/payload.config.ts`, `src/migrations/index.ts`, `package.json`, `vitest.config.ts`; add the generated additive migration and schema snapshot in `src/migrations/`.

**Approach:**
1. Register append-only collections and unique indexes, with server-controlled metadata and protected JSON payloads.
2. Implement authenticated list/read/save and trusted run-append service operations under KTD4/KTD9; wire validated feature server functions to this service.
3. Resolve each publication using the actor, freeze it in the revision and calculate scaled requirements from its saved base.
4. Extend the integration script to discover both recipe and scenario integration files; retain a way to run the scenario file alone. Exclude both node:test database integration files from Vitest discovery in `vitest.config.ts`. Keep temporary target selection inside the integration tests, not dependent on an ambient production URI.

**Execution note:** Establish migrated database and failure-path integration evidence before treating server persistence as usable by the workspace.

**Patterns to follow:** `src/collections/recipes.ts` for ACL/hook boundaries; `src/db/sqlite.ts` for transaction ownership; `src/tests/recipes.integration.test.ts` for isolated migration, independent reads and restore.

**Test scenarios:**
1. Covers AE1/F1. Save A20/B12 using real publications; reopen the same sources, snapshots and scale. Publish recipe v2/edit ingredients and verify the stored v1 remains unchanged.
2. Anonymous, editor, baker and other-owner administrator cannot list/read/save/run another owner's data through Local API, REST or feature action; denied responses leak no snapshot/financial fields.
3. Forge owner/revision/snapshot/output fields and attempt native REST/Admin mutations; refuse without writes. GraphQL remains disabled.
4. Repeat an identical save key after losing its response: one revision and the same receipt. Reuse the key with different inputs: conflict.
5. Two saves with one expected revision cannot both append a successor; a failed contender does not prevent a subsequent valid independently durable write.
6. Inject failure after append and at COMMIT: no success receipt or partial record survives; confirmed earlier revisions remain readable.
7. Invalid/unreadable publication rejects the save without partial revision. Local API calls enforce actor access rather than implicit privileged defaults.
8. Migrate a populated MVP-0 copy; recipe values remain intact. Restore populated scenario revisions/runs to another database and verify identities, qualifiers and relations.

**Verification:** Migrated persistent records can be independently read after success, and retries/concurrent/failing writes preserve one valid history. Cross-interface denial is executable evidence, not a UI-only assertion.

### U3. Evaluate the supplied process order and shared capacity

**Goal:** Produce deterministic chronology, waiting and independent resource/technology qualifications.

**Requirements:** R3–R4, R8; KTD5–KTD6; PRC-AC-001–006, PRC-AC-008.

**Dependencies:** U1.

**Files:** Create `src/features/process-execution/evaluate.ts`, `evaluate.test.ts`; create `src/tests/fixtures/investment-scenarios.ts` for reusable sourced synthetic inputs.

**Approach:** Implement the evaluator and causal waiting records from KTD5/KTD6, leaving absent dependent outputs unknown and preserving independent known branches. Expose readiness and reservation/labor outputs for U4/U5.

**Patterns to follow:** Pure calculation separation in `src/features/recipes/scaling.ts`; avoid reusing `src/utils/schedule.utils.ts` as a resource-capacity engine without separate evidence.

**Test scenarios:**
1. Covers AE1. A20 occupies the oven 06:00–06:30, B12 waits from 06:15 and finishes 06:50; labor is 30 person-minutes, not 50 baking minutes.
2. Two 12-piece loads cannot occupy a 20-piece oven together; a 21-piece single load reports a conflict rather than an invented split.
3. Two active tasks need one baker each at 05:00; one available baker causes waiting/conflict even with a free seller or spare hours later.
4. A 45-minute passive phase containing a five-minute child task preserves the phase and charges only declared active labor; an impossible queued child remains a visible conflict.
5. A 30-minute maximum wait accepts exactly 30 and flags 45 as 15 over; missing window only unqualifies technology, not an otherwise known machine result.
6. Missing duration/capacity or kg/piece conversion yields the affected unknown readiness/capacity; known independent chronology remains available.
7. Labor segments of 10×1 plus 20×2 yield 30 elapsed minutes/50 person-minutes; declared 15-minute cleaning retains its resource occupation.
8. Explicit start before predecessor is reported as requested-order deviation with any adopted waiting; cycles reject. Passive intervals crossing midnight retain their original start.
9. Repeated inputs, reordered display rows or added presentation coordinates cannot change the calculation output.

**Verification:** The same saved inputs give identical domain outputs with no system clock, database or rendering dependency.

### U4. Balance hypothetical materials and ready products

**Goal:** Supply truthful time-dependent quantities and sales availability to the financial evaluation.

**Requirements:** R5, R8; KTD7–KTD8; STK-AC-003, STK-AC-006, STK-AC-009; SCN-AC-010.

**Dependencies:** U1, U3.

**Files:** Create `src/features/stock-inventory/evaluate.ts`, `quantity.ts`, `evaluate.test.ts`, `quantity.test.ts`; extend `src/tests/fixtures/investment-scenarios.ts`.

**Approach:** Apply the STK boundary to isolated time-ordered movements, recipe requirements and U3 readiness. Preserve unknown material availability without manufacturing zero consumption or stock.

**Patterns to follow:** Recipe rational helpers and frozen ingredient IDs, not live ingredient classification or rounded display values.

**Test scenarios:**
1. 20 kg opening −19.5 kg consumption −0.5 kg loss gives zero with the reason; another 1 kg issue fails atomically.
2. Unknown opening stock stays unknown; zero/negative movement rejects. 1000 g and 1 kg reconcile exactly, while mass/piece conversion requires an entered basis.
3. 100 ready/admitted at 09:00 divides into 80 sold, 10 carry, 10 waste; only 80 reach revenue. A requested sale of 20 at 08:00 is unmet.
4. A request for 110 from 100 available reports 10 unmet and never creates 110 units of revenue.
5. Identical movement ID/content applies once; conflicting content fails without partial balances, including after revision readback.
6. Physical inadmissible returns increase physical stock only; refunds do not change quantity; a later waste removes the returned stock once.
7. Splitting/merging conserves quantity and source-part references; expired/nonadmitted stock cannot satisfy sale. Missing expiry/admission basis leaves that availability unverified.
8. Carry/opening WIP retains source and original preparation context for future ECO handoff without certifying weekly replenishment.

**Verification:** Every reported end quantity reconciles to entered/scaled movements; no sale precedes supported readiness/admission.

### U5. Calculate sourced economics and conditional required sales

**Goal:** Convert supported quantities and costs into distinct financial components without overstating investment conclusions.

**Requirements:** R6–R8; KTD7–KTD8; ECO-AC-001–006, ECO-AC-013.

**Dependencies:** U1, U3–U4.

**Files:** Create `src/features/economics-investment/evaluate.ts`, `money.ts`, `required-sales.ts`, `evaluate.test.ts`, `money.test.ts`, `required-sales.test.ts`; extend shared scenario fixtures.

**Approach:** Implement ECO at its owning boundary, consume only supported U4 sales and expose each missing prerequisite. Keep money arithmetic exact, cost identities exclusive and contribution/budget period-aligned.

**Patterns to follow:** Rational calculation discipline in `src/features/recipes/precision.ts`; canonical ECO bases, not a duplicated financial calculation in the UI.

**Test scenarios:**
1. Covers AE1. A20/B12 at 20/5 PLN with full variable unit costs 10/2 PLN gives 460 revenue, 224 cost, 236 contribution and 56 after 100 day costs/80 seller cost; owner-net/month/payback remain unverified.
2. Covers AE2. 20 price/10 cost/24 000 budget/zero loss requires 2 400 sold and 48 000 revenue; same-period readiness of 2 200 gives deficit 200, with no demand forecast.
3. Sold mix 50/50, A20/10 without loss, B30/10 with 20% production loss and 2 200 budget gives sold 80/80, produced 80/100, revenue 4 000 and variable cost 1 800.
4. Positive budget with zero/negative contribution or 100% loss produces no finite requirement, never division by zero or negative sales. Whole-piece rounding recomputes cost coverage on non-divisible cases.
5. One 30-minute labor pool at 60 PLN/h split 50/50 gives 15+15 minutes and 15+15 PLN once; missing allocation shows unresolved exact allocation.
6. Ingredient 10 kg×4 plus packaging 5 plus estimated energy 2×1 gives 47 PLN; later prices and measured energy create new inputs without rewriting the prior basis.
7. Gross margin 140, contribution 100 and operating remainder 50 remain separate for ECO-AC-003; explicit cash receipts 180/payments 130 produce cash surplus 50 on a distinct basis.
8. Missing rent, energy rate, owner charges or seller cost preserves known contribution but withholds dependent conclusions. Mixed gross/net or daily/monthly bases require explicit reconciliation.
9. Owner economic work value is disclosed without duplicate deduction; absent actual-time/payroll data is not invented. A full unit-cost estimate and its component rows cannot double-charge the same expense.
10. Zero/missing person-hours or bottleneck minutes produce no finite ratio. Positive and negative half-cent results round symmetrically under KTD7.

**Verification:** Canonical numerical examples and partial-result cases reconcile from sourced rows; a positive contribution cannot become a blanket feasibility/net/payback verdict.

### U6. Connect saved inputs, evaluation and immutable result readback

**Goal:** One authenticated run consumes the saved revision and persists the combined report.

**Requirements:** R1–R9; F1–F3; AE1–AE3; KTD3–KTD4, KTD8–KTD9.

**Dependencies:** U2–U5.

**Files:** Create `src/features/investment-scenarios/evaluate.ts`, `evaluate.test.ts`; extend `service.ts`, `scenario.actions.ts`, `src/tests/investment-scenarios.integration.test.ts`, shared scenario fixtures.

**Approach:** Compose pure domain outputs, bind the result to its revision/fingerprint/engine version and use U2's run append receipt. Reauthorize publication dependencies at the run boundary, and refuse unavailable source access without exposing the saved snapshot. Preserve old reports under their original identities.

**Patterns to follow:** `Catalog.tsx` stale-response protection for the eventual client; persisted JSON validation from recipe publication tests.

**Test scenarios:**
1. Covers AE1/F1–F2. Create real A/B publications, save/reopen and run through PRC/STK/ECO; persisted readback retains the full expected chronology, money and qualification reasons.
2. Covers AE2. Produce 2 200 ready units from structured saved operations/resources in an explicit aligned interval and compare to required 2 400; a supplied fixture total alone does not prove the integration.
3. Covers AE3/F3. Edit/save a new revision after a run; the previous report still references the previous inputs and is not relabeled by the new form.
4. Run twice on identical inputs yields identical domain results; generated run timestamps/IDs may differ outside that result. Retry one request key returns its existing receipt.
5. Inject a run persistence failure and lose a successful response; neither case creates a fake confirmed result or duplicates under retry.
6. Deny unauthorized run/read and unavailable publication access before returning snapshots; malformed input and source-read errors leave the last confirmed state intact.
7. Compare recipe/ingredient and all available non-scenario collection state before/after; hypothetical runs mutate only scenario collections.

**Verification:** The connected demonstration uses the real catalog/publication path and durable database, not a hardcoded financial summary or independent calculator pages.

### U7. Deliver the Polish scenario workspace and report

**Goal:** Owners can complete F1–F3 with readable partial results and recoverable errors.

**Requirements:** R1–R10; AE1–AE3; KTD10; AS1–AS2.

**Dependencies:** U2, U6.

**Files:** Create `src/app/(app)/investment-scenarios/page.tsx`, `src/app/(app)/investment-scenarios/[scenarioKey]/page.tsx`, `src/features/investment-scenarios/components/ScenarioWorkspace.tsx`, `ScenarioInputs.tsx`, `ScenarioReport.tsx`, `ScenarioWorkspace.module.css`, `ScenarioWorkspace.test.tsx`; create `src/features/investment-scenarios/scenarioMachine.ts`, `scenarioMachine.test.ts`; modify `src/components/Header/index.tsx` and its navigation test where needed.

**Approach:**
1. Keep route pages thin and ownership-sensitive reads uncached across users; use the authenticated service for initial data and feature server functions for commands.
2. Group product/version selection, manual evidence, process order, resources/roles, stock/sales and cost assumptions into labeled feature sections. Allow adding/removing products rather than a two-product-only form.
3. Use an XState feature machine for KTD10 lifecycle and request generations; preserve local input on recoverable failures and clear protected data after logout/denial.
4. Present chronology as an accessible ordered list/table, alongside separate people/machines/technology/material qualifications and finance. Link each limitation to its source input.
5. Add a Polish navigation link and use existing styles/components. Reuse existing Payload login capability rather than introducing a second account store; the unauthenticated view can direct to `/recipes` login with an explicit return link.

**Patterns to follow:** `PageLayout`, `InputField`, `Button`, `src/styles.css`, `src/media-queries.css`, `Catalog.tsx` loading/login/error semantics and `src/features/bake-a-long/bakeAlongMachine.ts` machine placement.

**Test scenarios:**
1. Covers AE1/F1–F2. Select real publication IDs, enter source/context, save/reopen/run and display the exact joined outcome.
2. Covers AE3/F3. Edit after a result and see old revision labeling; failure/conflict leaves unsaved inputs and last confirmed identity visible without a success notice.
3. Missing cost/window/capacity displays Polish limitation text while known chronology/contribution remains readable.
4. Distinguish first-load empty, source-read error, denied, saving and running states; disable duplicate commands while keeping receipt-based recovery possible.
5. Late read/run responses after switching scenario or logging out cannot replace the active state or reveal old protected data.
6. Product addition supports at least three products; the reference roles expose separate availability/cost and 5–7 days/8–12 hours as availability, not required labor.
7. Labels, error links, status announcements and focus allow keyboard save/open/run; semantic report values remain understandable without color or motion.

**Verification:** Browser proof on actual changed screens at phone/tablet/desktop and high zoom exercises F1–F3; component tests alone do not establish visual/accessibility acceptance.

### U8. Close the connected proof and release evidence

**Goal:** Supply task-scoped acceptance receipts and preserve the distinction between synthetic delivery and actual-data release.

**Requirements:** R1–R10; AE1–AE3; `docs/projects/README.md#common-evidence`; assurance and design-system owners.

**Dependencies:** U1–U7.

**Files:** Extend `scripts/production-smoke.mjs` or add `scripts/investment-scenarios-smoke.mjs` with an explicit script entry in `package.json`; extend `src/tests/fixtures/restore-readback.ts` or add `src/tests/fixtures/scenario-restore-readback.ts`; create `docs/verification/mvp-one.md`, `docs/architecture/investment-scenarios.md`; update only the selected task section in `docs/projects/investment-scenarios.md` and relevant commands/route guidance in `docs/index.md`.

**Approach:** Connect U2/U6 integration into existing CI/check scripts, exercise built HTTP authentication/actions/REST and actual UI, then record requirement-level results. Extend populated recovery proof for the new records without replacing the recipe proof. Describe the AS1 role mapping, data model, migration and retry semantics. Attach evidence to the task; do not mark unrelated tasks or all ASS controls complete.

**Test scenarios:**
1. Covers AE1. Built-app authenticated save/reopen/run uses real publications and exact A/B chronology/money, with all missing-month qualifiers visible.
2. Covers AE3. Built HTTP requests deny anonymous/cross-owner reads and forged writes through all exposed scenario surfaces; error UI does not report success.
3. Additive migration and populated restore preserve recipe v1 plus scenario revision/run/source/ownership data; an injected migration failure leaves the source database unchanged.
4. Phone, tablet, desktop, high zoom, keyboard and reduced-motion checks preserve navigation/form/report meaning and visible focus.
5. Existing recipe publication/history/scaling, navigation and calculator regressions still pass after registration and shell changes.

**Verification:** Evidence names the actual SHA, environment, isolated target, commands, results and omissions. The task may claim delivery only to the extent supported by these receipts.

---

## Verification Contract

Implementation verification follows `docs/index.md` and the assurance policy. No application tests, build or runtime probes were executed to produce this plan.

| Check | Concrete entry point | Scope / required outcome |
|---|---|---|
| Reproducible environment | `.node-version`, lockfile install via `npm ci` | Installed manifest combination, no unreviewed dependency upgrades |
| Static checks | `npm run lint`, `npm run typecheck` | New domain/server/UI code and existing app compile cleanly |
| Unit/component checks | `npm run test` | U1/U3–U7 numerical, lifecycle, partial-result and UI behavior; neither node:test database integration file is discovered |
| Persistent integration | `npm run test:integration` after U2 script extension | Existing recipes and new `src/tests/investment-scenarios.integration.test.ts` actually execute under the intended node:test harness |
| Production build | `npm run build` | Native Next/Payload routes/actions and registered migrations build |
| Built HTTP smoke | `npm run test:production`, plus U8 scenario smoke entry if separate | Real authentication, action wiring, ownership-filtered REST, save/read/run and refusal paths |
| Dependency/security checks | `npm run security` | Applicable findings assessed with owner/justification/review date for any accepted deviation |
| Browser checks | U7/U8 real changed routes in the built app | AE1–AE3 and design-system mobile/tablet/desktop, keyboard/focus, high zoom and reduced-motion evidence |
| Recovery | Scenario integration + restore-readback fixture | Separate restored database reproduces frozen recipe/revision/run values and owner boundaries |
| Delivery receipt | `docs/verification/mvp-one.md` | Qualified REQ/AC → test/check → result/log, SHA/date/runtime/target and omissions |

All database tests create explicitly isolated OS-temporary targets with synthetic accounts/data and reject ambient/unknown production targets. Follow ADR-001 migration confirmation and backup requirements. A failed or skipped check is not a pass. Broader reruns are justified by new changes, failures or unresolved concerns, not repetition alone.

Real-account/data use requires P0 approval under `docs/engineering-assurance.md`, including reviewed threat/privacy scope, restore and release controls. P1 applies only if actual production events are introduced; this plan does not introduce them. Activated branch protection, tax assumptions and legal approval are not inferred from a green local run.

### Acceptance Trace

| Canonical acceptance scope from TASK-INV-001 | Owning proof units |
|---|---|
| SCN-AC-001–002, SCN-AC-005 | U1, U2, U6 |
| SCN-AC-003–004, SCN-AC-008–009, SCN-AC-016 | U3, U7 |
| SCN-AC-006 | U5, U6, U8 |
| SCN-AC-010 | U4, U6 |
| SCN-AC-011 | U5 |
| SCN-AC-017–019 | U2, U6–U8 |
| SCN-AC-021 | U2–U8, connected proof in U6/U8 |
| PRC-AC-001–006, PRC-AC-008 | U1, U3; applicable day windows only |
| STK-AC-003, STK-AC-006, STK-AC-009 | U2, U4, U6 |
| ECO-AC-001–006, ECO-AC-013 | U2, U5, U6–U8 |

Requirements without a distinct listed AC in the task remain covered by their owning R-ID/U-ID and feature-specific scenarios; the acceptance trace does not reduce the requirement scope.

---

## Definition of Done

- U1–U8 each satisfy their stated verification outcomes and feature-bearing test scenarios.
- AE1 executes from actual authorized published recipe selections through persisted inputs, reopen, constrained process, stock and economics. AE2 is derived from structured readiness inputs, not an injected capacity summary.
- Every canonical acceptance item in the trace has an actual result or an explicit unresolved failure; completion is not claimed over missing proof.
- Access, retries, stale versions, source failures, persistence failures and old-result labeling are verified across the real exposed interfaces.
- The new migration and restore preserve existing recipe history and new immutable scenario history. No simulation changes operational records.
- Actual Polish UI evidence covers the design-system acceptance boundary, and recipe/navigation regressions pass.
- Documentation describes the model, access default, recovery and qualification limits. Delivery state and evidence live only in `TASK-INV-001`; this plan has no execution lifecycle.
- Remove abandoned implementation attempts, temporary fixtures outside the intended synthetic test set and unused APIs/components before delivery. Preserve unrelated user work, including `docs/ideation/`.
- The release owner receives unresolved real-data gates and input-validity limitations. A synthetic demonstration does not certify capacity, customers, owner-net income, payback or legal compliance.
