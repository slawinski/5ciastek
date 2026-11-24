---
title: "Repository Spec Library - Plan"
type: refactor
date: 2026-11-21
artifact_contract: ce-unified-plan/v1
product_contract_source: approved-scope-and-source-inventory
execution: code
---

# Repository Spec Library - Plan

## Goal Capsule

- **Objective:** Maintainers can select a bounded product task, find its complete business rules and genuine prerequisites locally, and tell what evidence would establish completion without reconstructing GitHub history.
- **Means:** Curated capability specifications and repository-only delivery records, joined by clause-level migration traceability (KTD1–KTD5).
- **Authority:** The approved migration scope governs this change. Preserve accepted source behavior except for the explicit release and review corrections in R7–R10. After migration, canonical specifications own behavior, project records own delivery state, and GitHub issues are historical sources.
- **Execution profile:** Repository documentation/planning implementation only. No application behavior, dependencies, scripts, installed controls or CI changes. This plan uses `execution: code` because its deliverables change repository-owned contracts and agent guidance.
- **Finish ownership:** A subsequent authorized executor authors and verifies U1–U8 and may deliver a PR within its caller's authority. The caller owns merge authorization and the gated postmerge retirement in R12. Neither authoring nor PR delivery waits for merge permission.
- **Stop conditions:** Stop an affected unit for an uncovered source obligation, contradictory shared ownership or a proposed change to a settled decision. Record genuine product unknowns against affected future tasks rather than inventing answers or blocking unrelated documentation.

---

## Product Contract

### Summary

Replace issue-led requirements and delivery tracking with a coherent repository library of Polish business specifications and bounded local tasks. Preserve all accepted capability scope, including later operational and growth work. Reconcile the offered product-plan draft with the investment-first release sequence and provide verifiable migration destinations for all 50 source issues.

### Problem Frame

The current reading route makes issue bodies authoritative while local references summarize selected contracts. The offered product-plan draft still describes 43 issues and a mandatory measurement-first sequence, although the captured inventory contains 50 issues and the approved direction has changed. Broad epics, implementation children, shared rules and historical comments have different levels of detail. An implementer cannot reliably infer completeness, actual blockers or implemented behavior from issue titles, checkboxes or release labels.

### Requirements

**Authority and preservation**

- R1. Repository capability specifications must be the authoritative business/UI requirements, with repository project/task files as the sole delivery tracker.
- R2. Every source issue, normative source block, requirement, AC and meaningful control must have a canonical destination or an explicit justified disposition, including obligations outside numbered REQ/AC lists.
- R3. Specifications must be curated by capability and shared business contract rather than by issue boundaries; each shared rule must have one normative owner.
- R4. Business requirements, examples and UI wording must be Polish, with English engineering guidance and stable identifiers; no translated requirement mirrors may be introduced.

**Specification and task quality**

- R5. All capability specifications must meet the same BA-level completeness/testability bar: actors, scope, inputs/outputs and units, source authority, lifecycle, atomic conditions/results, invariants, relevant access/errors/bounds, concrete examples, typed dependencies and explicit decisions.
- R6. Project files must provide bounded end-to-end tasks with stable IDs, covered canonical REQ/AC IDs, typed dependencies, decision/readiness state and completion evidence, distinguishing specification readiness from implementation completion.

**Release and scenario corrections**

- R7. Delivery must start with MVP-0 recipes, then MVP-1 as a small connected investment scenario with manually supplied sourced measurements, basic resource constraints and economics, then MVP-2 as realistic mixed-product comparison with repeatability and usable windows; recorder, operations and optimization/growth are independent projects rather than compulsory release buckets.
- R8. Scenario requirements must preserve the owner-baker plus separate salesperson, the 6,000 PLN net monthly owner target under explicit tax/contribution assumptions, configurable 5–7 days/week and 8–12 hours/day availability, and measured/estimated/missing provenance without inventing demand, prices, rent or other scenario inputs.
- R9. Recurring month, surplus and payback conclusions must account for opening WIP/stock depletion, replenishment and attributable outside-week work, or remain explicitly unverified; identical opening/closing stock and a detailed month-by-month simulation are not required.
- R10. Applicable intermediate-product usable/max-wait windows must be manually supplied with provenance and enforced at queued transitions, or technological feasibility must remain explicitly unverified; predictive fermentation is not a prerequisite.
- R11. Persistent mass precision and event-stream partition/order semantics must remain genuine named open decisions with affected future tasks blocked at the relevant boundary, without turning numeric examples into policy.

**Delivery boundary**

- R12. Historical GitHub issues must be retired with verified replacement links and migration notes only after replacements merge into the default branch; closure must not claim feature completion.
- R13. Application source, scripts, dependencies, build tooling and CI must remain outside this change, while existing design/assurance obligations and tracked CE artifacts are preserved.
- R14. The offered `docs/index.md` and `docs/product-plan.md` may be reconciled; excluded ideation HTML and the deliberately absent narrow plan must remain untouched, and unrelated commit `d169fe4` must not enter this branch's delivery.

### Key Decisions

- **Local authority and tracking.** Governs R1, R6. (session-settled: user-directed — chosen over issue authority or synchronized trackers: requirements and delivery must be usable from the repository alone.)
- **Curated specifications.** Governs R2, R3, R5. (session-settled: user-approved — chosen over one-issue-one-file conversion: capability boundaries and equal quality matter more than source layout.)
- **One language per purpose.** Governs R4. (session-settled: user-approved — chosen over independent translated mirrors: avoid divergent requirements.)
- **Investment-first releases.** Governs R7, R8. (session-settled: user-approved — chosen over five fixed sequential buckets: a sourced manual scenario can answer the investment question before a full recorder.)
- **Qualification rather than fabricated certainty.** Governs R9–R11. (session-settled: user-approved — chosen over assuming repeatable weeks or automatically valid waiting times: conclusions must expose the limits of supplied evidence.)
- **Postmerge issue retirement.** Governs R12. (session-settled: user-directed — chosen over closing against an unmerged commit or leaving historical issues as active planning: replacement authority must be available on the default branch first.)

### Scope Boundaries

All 50 captured sources, #1–#43 and #45–#51, are in scope, including accepted later capabilities. #44 is a PR, not a missing issue. Old stage labels, repeated boilerplate and superseded historical descriptions may be consolidated only with explicit disposition and retained meaningful obligations.

The initial scenario does not simulate physical distance, congestion or premises fit. It does not require detailed opening-month financing, a full monthly ramp, sensors, AI, an automatic optimizer, POS or a complete operational recorder. These boundaries do not remove accepted later fermentation, quality, B2B, forecasting, optimization or assistant scope from the library.

No new PM framework, requirements compiler, runtime mechanism or committed validation/test framework is part of this change. Temporary document validators are sufficient. Existing legal/security policy is preserved and referenced, not reinterpreted as installed enforcement or a certification.

#### Deferred to Follow-Up Work

Application implementation, architecture spike, stack migration and installation of assurance controls are future repository tasks, not deliverables of this documentation migration. R12 is a caller-owned gated finish after merge, not a prerequisite for local authoring or PR delivery. This planning run authorizes only the plan artifact and its review.

### Acceptance Examples

- AE1. **Covers R2, R3.** A source block containing both physical-return balance and refund behavior maps to separate stock and sales requirements. Its coverage row names both destinations and the controls, not merely issue #4 or a spec filename.
- AE2. **Covers R6, R7, R11.** The small scenario task can use manually supplied measured operation times without the recorder application. A future persistent recipe-publication task remains blocked on mass precision, while a synthetic catalog demonstration does not falsely close that decision.
- AE3. **Covers R9.** A week consumes 10 kg of opening WIP that its scheduled work never replenishes. Multiplying its sales and apparent surplus by a monthly calendar cannot establish recurring feasibility or payback until replenishment and attributable work/cost are included or the recurring conclusions are marked unverified.
- AE4. **Covers R10.** An illustrative intermediate is usable for at most 30 minutes after readiness, with that window supplied by a named source. A resource queue starting the next operation after 45 minutes fails the supplied constraint; absent a window, the result says technological feasibility is unverified rather than assuming unlimited waiting.
- AE5. **Covers R12.** A delivered, unmerged documentation PR has complete replacement links but no issue closures. After authorized merge and default-branch link verification, the caller may close historical issues with a migration-only note, leaving product tasks unimplemented unless separately proved.

---

## Planning Contract

### Key Technical Decisions

- KTD1. **Sixteen capability owners, with existing policies retained.** Use the exact registry below; architecture and release-control work belongs in engineering project tasks rather than a seventeenth artificial business domain. This instantiates R1–R5. (session-settled: user-approved — chosen over mirroring source issues: a small capability library exposes shared ownership.)
- KTD2. **Conventions first, five disjoint authoring groups, one integration owner.** U1 establishes IDs and shared boundaries; U2–U6 write exclusive specs and scratch task/trace packets; U7 integrates project files and migration proof; U8 switches authority routes. This implements R2, R3, R6 without concurrent writes to shared files.
- KTD3. **One portfolio, project-local task sections.** Keep `docs/product-plan.md` as the sole portfolio overview. Keep task state in project files, not the overview, specs, this plan or GitHub. No one-file-per-task mechanism is needed.
- KTD4. **Immutable migration evidence, normalized clause mapping.** Preserve the captured JSON as `docs/migrations/spec-library/source-baseline.json`, then record source-block mappings in `coverage.md`. Raw evidence is historical, never a second spec. The archive makes long comment bodies and source hashes auditable without depending on this machine's temporary files.
- KTD5. **Separate documentation completion, product state and retirement.** Record document verification in `verification.md` and the pending postmerge handoff in `retirement.md`; keep product task evidence independent. This implements R6, R12, R13 without claiming unrun tests or completed remote actions.

No bake-off is needed: curation, local authority and repository tracking are settled. The remaining choices are file placement and authoring integration, cheaply reviewable before application implementation.

### Assumptions

The sixteen-file registry and project/task layout below are planning choices, not newly confirmed business boundaries. They are sufficient defaults for execution; change a boundary only with explicit source-coverage and link updates, and do not expand accepted behavior. Full source-block extraction is implementation work in U1–U7, not an accomplished result of this plan. Targeted source bodies and repository owners ground the plan, but planning has not audited every comment clause or inspected product implementation for completion.

The existing policy prose contains Polish passages. Preserve their meaning and policy ownership; use English for new engineering instructions and the changed agent route. A wholesale translation of policy prose is unnecessary.

### File Ownership and Canonical Registry

All capability files live under `docs/specs/`. The filename and spec prefix below are fixed integration interfaces. They are not release assignments.

| Prefix | File | Normative ownership | Principal source issues | Unit |
|---|---|---|---|---|
| REC | `recipes.md` | Ingredients, complete recipe variants, draft/publication/history, catalog, scaling and baker percentages | #3, #14, #15, #17 | U2 |
| EVT | `production-records.md` | Observed batches/events, envelope/provenance, recorder UI, actual resource facts, corrections and projection reconstruction | #3, #18, #19, #34–#37 | U2 |
| PRC | `process-execution.md` | Shared process transition/constraint semantics, active/passive/auxiliary time, queues, role/resource contention, supplied intermediate windows | #7, #18, #30, #47; approved corrections | U3 |
| PLN | `production-plans.md` | Saved draft/approved plan versions, acceptance of proposals, downstream version identity | #33; inputs from #6, #7, #9, #11, #29 | U3 |
| WRK | `workforce.md` | 1–N availability, published shifts, individual attendance, DST/breaks, backward proposals and workforce integrations | #26–#29, #38–#40 | U3 |
| STK | `stock-inventory.md` | Shared conservation/units, physical versus saleable stock, WIP/carryover/usability, FEFO, MRP and purchasing approval | #4, #9, #35, #48 | U4 |
| SAL | `sales-returns.md` | Stable SKU/imports, sales channels, refunds versus confirmed physical returns, stockout and sales reports | #4; #11, #48 | U4 |
| ECO | `economics-investment.md` | Shared costing/allocation, historical prices, owner income, required sales, calendar/recurrence qualification, CAPEX and payback | #5, #12, #49, #50; #1 investment contract | U4 |
| SCN | `scenarios-comparison.md` | Saved hypothetical inputs/provenance, isolated runs, comparison and qualified reporting, growth variants | #1, #12, #45–#51 | U5 |
| MAP | `flow-map-demo.md` | Deterministic demo controls, one renderer/list, presentation layout, demo/live freshness and scoped aggregates | #30–#32, #41–#43 | U5 |
| DEM | `demand.md` | Censored sales, baseline forecast, walk-forward validation, uncertainty and human corrections | #6 | U6 |
| OPT | `optimization.md` | CAPP objective, solver-based search, conflict reporting, manual replanning and plan/actual comparison | #7 | U6 |
| FER | `fermentation.md` | Fermentation observations, baseline/calibration, readiness forecast and uncertainty, baker validation | #8 | U6 |
| QLT | `quality-monitoring.md` | Device/quality records, alarms, maintenance, corrective actions and procedure-linked human approval | #10 | U6 |
| B2B | `b2b-orders.md` | Draft/verification/confirmation/production/dispatch, duplicate/cancellation history, capacity qualification and documents | #11 | U6 |
| AST | `owner-assistant.md` | Read-only dashboard, cited natural-language answers, verified calculations, sensitive-data redaction and human approval boundaries | #12 | U6 |

`docs/engineering-assurance.md` remains the owner of security, integrity/recovery, privacy/legal and release policy (#20–#24). `docs/design-system.md` remains the UI/design/accessibility owner (#25). Assign stable local control anchors to migrated controls where none exist. Do not create duplicate assurance or UI specs.

### IDs, Authoring Bar and Integration Boundaries

U1 publishes these conventions in `docs/specs/README.md` and the writing guide before parallel authors begin:

1. Spec identity is the registered prefix. Normative statements use `PREFIX-REQ-NNN`, AC use `PREFIX-AC-NNN`, examples use `PREFIX-EX-NNN`, and decisions use `DEC-NNN` in `docs/decisions.md`. Use explicit ASCII headings such as `### REC-REQ-001` so links remain stable. Allocate monotonically within a prefix, never recycle or renumber, and qualify all references. Retired/split IDs keep a destination note.
2. Every AC names the exact requirements it tests, concrete input/state, action and observable result. Each example links its governing REQ/AC. Numbers are illustrative unless explicitly approved parameters. No generic "works correctly" criteria or requirement tables that merely rename source headings.
3. Each capability states its actors, outputs and units, lifecycle transitions, invariants and source authority before atomic rules. Record applicable permissions, invalid inputs, missing/stale data, retries/conflicts and relevant error outcomes. A genuinely inapplicable field gets a short reason, not filler. Later projects meet the same bar as the next release.
4. Shared policy links replace repeated boilerplate only after every meaningful control is accounted for. Separate technical proposals from mandatory business outcomes. Optional source suggestions remain optional; unchosen database, rounding or stream algorithms remain decisions.
5. Dependency records name type, local target ID, scope, condition and phase (`start`, `demonstration` or `release`). Types retain the existing meanings: `parent`, `contract-input`, `implementation-prerequisite`, `optional-adapter`, `release-gate`. Only genuine implementation prerequisites form the blocking task DAG. Decisions are explicit additional gates, not fabricated predecessor tasks.
6. Future task IDs use `TASK-PROJECT-NNN` and ASCII task headings. Project keys are registered in the project table below. IDs stay stable after moving a task between release outcomes; retain its original identity and redirect its old location. A task contains goal/actor, bounded flow, REQ/AC coverage, inputs, exclusions, typed dependencies, decision gates, implementation state, readiness assessment, and evidence references.
7. Implementation state is `not-started`, `in-progress`, `blocked` or `done`; readiness separately states satisfied and unsatisfied conditions for start/demo/release. Initial state is `not-started` unless repository evidence supports another state. `done` requires artifact/PR/commit identity, relevant check results and date; source issue state and documentation approval are not proof. `blocked` cites an actual unmet prerequisite/decision. An unchecked implementation inventory is not a finding that every feature is absent.
8. Specification readiness records whether the contract is complete and which decisions remain open. A well-specified task may still be blocked; a synthetic demonstration is not real-data release approval. The overview projects outcomes and links task owners without mirroring mutable task status.

Reserve these shared requirement IDs in U1's registry; each owning unit authors their full normative text. Consumers may cite these IDs before final prose integration, but may not duplicate or change their meaning.

| Reserved owner ID | Boundary consumers must use |
|---|---|
| REC-REQ-001 | Published recipe composition, classification and quantities are frozen historical input |
| REC-REQ-002 | Scaling derives from complete base masses and positive integer yield without cumulative rounding |
| PRC-REQ-001 | Legal process sequencing and active/passive/auxiliary time semantics shared by actual and hypothetical execution |
| PRC-REQ-002 | Concurrent roles/availability and known resource capacities constrain the stated execution order |
| PRC-REQ-003 | Supplied intermediate usable/max-wait windows constrain queued transitions; missing applicable windows limit conclusions |
| EVT-REQ-001 | Versioned event envelope and observed provenance, with stream semantics gated by DEC-002 |
| EVT-REQ-002 | Authorized correction validates all dependencies and changes projections atomically or rejects without partial effects |
| STK-REQ-001 | Conservation and explicit unit conversion across movements, splits/merges, WIP and stock |
| STK-REQ-002 | Physical receipt does not imply saleability; refunds alone are not stock movements |
| ECO-REQ-001 | Shared labor allocation and cost sources never count the same work twice |
| ECO-REQ-002 | Recurring-month/surplus/payback qualification accounts for boundary depletion, replenishment and attributable outside-week work |
| SCN-REQ-001 | Hypothetical data remains isolated, reproducible and distinguishable as measured, estimated or missing |
| PLN-REQ-001 | Approval exposes an immutable plan version and does not create execution or publish shifts/purchases |
| WRK-REQ-001 | Availability/shift plans, individual WorkSession and anonymous LaborSegment are distinct facts |

EVT owns recorded fact acceptance and correction, not a second stock conservation law. PRC owns transition constraints, not the event transport or persistent stream partition. STK owns quantity and usability accounting, while ECO owns the economic qualification of recurrence and SCN presents that qualification. MAP/demo and OPT consume these owners rather than creating another execution model. A confirmed actual event remains an observation even when it reveals deviation from a planned constraint; hypothetical validity is not a license to erase observed facts.

### Source Coverage Protocol

`source-baseline.json` is copied from the supplied capture, preserving full issue bodies and comment records. Verify the set is exactly #1–#43 and #45–#51 and retain capture provenance, issue URL/update time, comment identity and content hashes. The supplied `issues/NN.md` files are convenient body views; comments must be read from the JSON. Do not claim a body-only extraction includes comments.

The ledger uses one row per meaningful source block, subdivided where a block holds independent obligations. A source key includes issue number, `body` or comment identity, heading path, occurrence/paragraph or list-item ordinal, legacy REQ/AC when present, a short identifying quote and a content hash. This distinguishes repeated local IDs and unnumbered controls. Map all original numbered IDs even when they are duplicate projections of a parent contract.

Each row records source role (`current`, `historical`, `proposal`), disposition (`preserved`, `split`, `consolidated`, `superseded` or `non-normative`), exact canonical owner/REQ/AC or task/control ID, rationale and review result. A split names all destinations. Consolidation points to the governing shared owner. Archived old descriptions are compared for meaningful surviving obligations, not reactivated as current instructions. Their historical disposition must explain why a difference is superseded or already preserved.

Create independent coverage rows for the approved changes: repository authority, investment-first releases, manual measurements without recorder dependency, week-boundary qualification and supplied intermediate windows. These are approved amendments, not claims that the old issues already explicitly required them. Product-plan R1–R32, A1–A2, F1–F4 and AE1–AE11 map to canonical destinations with their contextual qualifiers preserved; identical clauses in #1 may consolidate rather than become duplicate rules.

Before accepting any authoring packet, compare its assigned full source blocks with its destinations. An ID count or one row per issue is insufficient. Final reconciliation accounts for every source block, including goals, task lists, dependencies, unnumbered rules, controls, MVP/KPI/DoD obligations and comments. Harmless repeated navigation/history prose may get an explicit non-normative disposition. Preserve the economic value/cost-of-adoption obligation once in project selection guidance rather than copying it into sixteen specs.

One unit owns extraction keys and complete body/comment accounting for each source record. Other units read the same source where needed and submit destination mappings against those keys, without allocating competing keys. U1 publishes this assignment with the conventions checkpoint:

| Extraction owner | Complete source records | Count |
|---|---|---|
| U2 | #3, #14, #15, #17, #18, #19, #34–#37 | 10 |
| U3 | #26–#29, #33, #38–#40 | 8 |
| U4 | #4, #5, #9, #48–#50 | 6 |
| U5 | #30–#32, #41–#43, #45–#47, #51 | 10 |
| U6 | #6–#8, #10–#12 | 6 |
| U7 | #1, #2, #13, #16, #20–#25 | 10 |

An extraction packet retains blocks destined for another unit as explicit outgoing handoffs. U7 reconciles each handoff against the receiving spec/task, including all source records it extracts itself. The offered product-plan R/A/F/AE mapping belongs to U5; the approved-scope amendments and final cross-source reconciliation belong to U7.

### Project Layout and Minimum Task Partition

Each path below is exclusively owned by U7. Create bounded tasks for the named slices, splitting further where source behavior cannot be demonstrated together. Do not collapse a whole broad epic into one fake implementation-ready task.

| Project key | File under `docs/projects/` | Minimum covered slices and boundaries |
|---|---|---|
| REC | `recipes.md` | Architecture spike/ADR (#13), behavior-preserving stack migration with route matrix (#16), recipe publication/history (#14), catalog (#15), scaling (#17), applicable UI/assurance delivery tasks |
| INV | `investment-scenarios.md` | MVP-1 connected manual-input bounded run/product set plus capacity and economics, without a mandated single-product limit; MVP-2 realistic mixed products, weekly stock/WIP and windows, calendar/recurrence, startup/payback, two-variant comparison; #45–#51 are scope inputs, not forced six-task topology |
| OBS | `production-recording.md` | Activity/worker segments with minimal recorder UI, quantity/split/loss, actual occupancy, correction/replay; #18/#19/#34–#37 |
| PLN | `production-planning.md` | Saved plan versions/approval and explicit proposal handoff; #33 |
| WRK | `workforce.md` | Manual shifts, backward estimate, concurrent conflicts, individual attendance/export, basic recommendations then optional integrations; #26–#29/#38–#40 |
| OPS | `operational-balances.md` | Sales/imports/returns/stockout, traceable actual SKU costing, stock/FEFO, approved-plan MRP and purchasing approval; #4/#5/#9 |
| MAP | `flow-map.md` | Deterministic fixture/demo controls, renderer/list, presentation layout, demo/live freshness, aggregates without double counting; #30–#32/#41–#43 |
| DEM | `demand.md` | Censored-data preparation, baseline/recommendation approval, walk-forward comparison, conditional ML evaluation; #6 |
| OPT | `optimization.md` | Bounded solver schedule, conflicts/manual replanning, utilization and plan/actual comparison, optional adapters; #7 |
| FER | `fermentation.md` | Contextual observations, temperature/time history, baseline/calibration, forecast/uncertainty verification; #8 |
| QLT | `quality-monitoring.md` | One-device logs/alarms/corrective action, procedure-linked review, later optional vision with separate gates; #10 |
| B2B | `b2b-orders.md` | Form/manual verification, lifecycle/dispatch/history, capacity adapters, commercial exports; #11 |
| AST | `owner-assistant.md` | Read-only dashboard/three cited operational questions, bounded AI access/redaction, human-approved actions, growth scenarios consuming SCN/ECO; #12 |
| ASS | `engineering-assurance.md` | Bounded risk-based access, integrity/recovery, privacy/legal and release-evidence work from #2/#20–#25; shared policy remains the owner, not a second implementation claim |

Project REC retains the approved future architecture direction without choosing versions/database now or migrating code. The #2 model obligations must be assigned to bounded engineering/data tasks and affected consumers, including resource/recipe/plan/event distinctions. Do not force a global company schema before the recipe catalog. U2–U6 use unit-local provisional task labels in scratch packets and nominate the destination project. U7 alone allocates stable task numbers within each project and replaces provisional cross-packet references, preventing competing INV or cross-domain task IDs. No provisional label survives in canonical task dependencies or coverage rows.

MVP-1 must be an end-to-end investment question, not disconnected forms followed by a calculator. Its task packet must identify the chosen bounded run, sourced timings, owner/salesperson roles, basic contention/capacity, a financial interpretation and visible qualifications. In MVP-2, product mix, representative-week balances, repeatability and relevant windows extend the same owners. Full weekly/monthly recurring conclusions remain gated by ECO-REQ-002. No source release label can silently restore the old recorder-first dependency chain.

### Dependency and State Sketches

Authoring dependencies are `U1 -> {U2, U3, U4, U5, U6} -> U7 -> U8`. U2–U6 may run in parallel after the conventions checkpoint. Cross-group proposals use scratch packets; integration owns all shared prose and project records. A packet missing coverage proof is returned to its owner rather than silently repaired by another author.

Product dependency sketch: architecture decision precedes migration, which precedes dependent recipe delivery. Recipes/scaling supply the scenario contract. Manually sourced measurements supply its data independently of OBS. Basic process/resource/stock/economic tasks connect before the corresponding INV demonstration. Recorder, map, POS, forecasting and full CAPP are optional adapters unless a particular operational slice actually consumes their implementation. The extended mixed-product demonstration depends on the connected scenario and its relevant balance/window/recurrence slices, not every later project.

Task state sketch: `not-started -> in-progress -> done`; an unmet actual prerequisite can place a task in `blocked`, which returns to `not-started` or `in-progress` when resolved. Completion requires evidence under R6; document readiness has no transition that implies `done`. A task can be start-ready while demo/release gates remain unsatisfied.

Retirement protocol sketch: local replacements verified -> PR delivered -> authorized default-branch merge -> default-branch links/source-drift rechecked -> migration notes and closures by caller -> retirement receipts recorded. Before merge, the last three steps remain pending. Read-only drift checks may require amendments before closure; no GitHub status synchronization graph is introduced.

### Decisions and Risks

- **DEC-001 — persistent mass precision/rounding.** Migrate the existing open question, affected legacy IDs and binding constraints from `docs/decisions.md`. REC publication consistency and dependent persisted calculations cannot be called start-ready at that boundary. UI formatting/exact-number demonstrations do not settle it. The repository owner still must name the domain decider.
- **DEC-002 — stream identity/sequence/replay meaning.** Preserve the existing open question and affected event/correction/live consumers. Envelope identity and within-stream ordering remain required, but neither global nor per-batch partition is invented. Isolated versioned fixtures do not prove persistent concurrency/live readiness. The repository owner still must name the domain decider.
- **Scenario data gaps** are input qualification, not global product decisions. Missing rent, market demand, owner contributions, time-window provenance or target-machine measurements restrict the corresponding conclusion. Do not replace them with zero or promise empirical accuracy.
- **Coverage loss** is the primary migration risk. KTD4 and source-block review preserve controls hidden outside numbered AC, including later capability obligations. Conflicting current comments are recorded for affected-task decisions; archival boilerplate alone does not create a conflict.
- **Authority drift** affects agents and maintainers across the repo. U8 must reconcile live authority statements and stale 43-issue/release claims without rewriting protected historical CE artifacts into new contracts.

### Sources and Existing Patterns

Use `docs/specification-style.md` for atomic Polish behavior and typed relationships, `docs/domain/glossary.md` for concept distinctions, `docs/reference-examples.md` for numeric oracles, and `docs/workforce-planning.md` for existing workforce obligations. `docs/design-system.md` and `docs/engineering-assurance.md` retain policy ownership. `AGENTS.md`, `docs/index.md` and the offered `docs/product-plan.md` are integration targets.

The supplied migration evidence bundle is named `spec-library-migration-20261121`, with `approved-scope.md`, `baseline.json` and `issues/NN.md`. Its external temporary location is an execution input supplied by the caller, not a portable repository link. U1 creates the durable local source archive before source-dependent parallel work. Historical GitHub URLs remain provenance links, not ongoing requirement or task authority. The earlier narrow plans are not sources for this broader migration.

---

## Implementation Units

### U1. Establish conventions and durable source baseline

**Goal:** Give every author stable boundaries and the same complete historical input before concurrent work begins.

**Requirements:** R2–R6, R11, R13, R14; KTD1, KTD2, KTD4.

**Dependencies:** None. Confirm branch `docs/repository-spec-library` is based on `5577440` and preserve offered/excluded work.

**Exclusive files:** `docs/specs/README.md`, `docs/specification-style.md`, `docs/migrations/spec-library/source-baseline.json`.

**Approach:**
1. Preserve the full supplied baseline and verify inventory/body/comment integrity, including whether capture metadata needs a provenance note in the registry.
2. Publish the registry, reserved IDs, authoring quality bar, task/dependency conventions and authority distinctions from KTD1–KTD4.
3. Publish the Source Coverage Protocol's extraction-owner assignment and provisional-task handoff convention. Cross-owned issues retain the assigned extraction owner and explicit destination handoffs.

**Execution note:** Land the shared-conventions checkpoint before starting disjoint authoring groups. A later caller may commit it if authorized; this plan run performs no Git writes.

**Document scenarios:**
- Inventory contains exactly 50 expected issue IDs and full original comment bodies; any missing/truncated record blocks acceptance of the baseline.
- A duplicate issue-local `REQ-01` resolves through its source key to a qualified destination; an unnumbered event-envelope rule also gets a source key.
- A contributor can identify the sole owner of shared process, stock and cost rules and distinguish a task prerequisite from a contract input.

**Verification:** Source archive matches capture content/hashes, conventions resolve all allocated identities, and the diff touches only the exclusive files.

### U2. Author recipes and observed production contracts

**Goal:** Preserve recipe/catalog/scaling behavior and the complete observed-production lifecycle without conflating observations with plans or hypothetical runs.

**Requirements:** R2–R5, R8, R11, R13; KTD1, KTD2.

**Dependencies:** U1.

**Exclusive files:** `docs/specs/recipes.md`, `docs/specs/production-records.md`. Exclusive scratch packets: `u2-coverage.md`, `u2-tasks.md` in the executor's temporary workspace; do not commit scratch.

**Approach:**
1. Read full assigned bodies/comments for #3/#14/#15/#17/#18/#19/#34–#37 and relevant consumers. Extract source blocks before rewriting.
2. Author REC and EVT, citing PRC/STK/ECO reserved owners for shared rules. Retain complete variants, frozen composition, baker-percentage mass visibility, actor/source identity, atomic transitions, correction history, real transfer/occupancy facts and recorder errors.
3. Supply project task proposals, DEC-001/DEC-002 impact mappings and source-block proof. Retain explicit target-stack requirements as future task constraints rather than changing the current stack.

**Document scenarios:**
- 4,000 g / 5 pieces gives 800 g; presets produce 8/12/16/24 kg; 10 -> 30 -> 10 is stable, and conflicting 750 g does not silently change the recipe.
- A 1 kg starter at 100% hydration contributes 0.5 kg flour once; unknown composition cannot produce exact percentages. Later ingredient edits cannot alter published v1.
- Ten minutes with one person plus twenty with two gives 50 person-minutes; folding inside passive fermentation does not end that phase.
- Repeated commands do not duplicate facts, unauthorized writes fail, and a correction invalidating later quantity/resource facts is rejected atomically or recalculates all valid dependencies.
- Starting an activity alone proves neither a transfer nor machine occupancy; observed deviation is not erased by a hypothetical constraint.

**Verification:** Each assigned source block is accounted for, shared-owner links resolve after integration, and proposed tasks identify the correct open-decision boundaries.

### U3. Author shared execution, plans and workforce

**Goal:** Establish the reusable process constraints and keep production approval, availability and individual attendance distinct.

**Requirements:** R2–R5, R7–R11; KTD1, KTD2.

**Dependencies:** U1.

**Exclusive files:** `docs/specs/process-execution.md`, `docs/specs/production-plans.md`, `docs/specs/workforce.md`. Scratch: `u3-coverage.md`, `u3-tasks.md`.

**Approach:**
1. Extract shared constraints from #7/#18/#30/#47, full plan #33 and workforce #26–#29/#38–#40, including `docs/workforce-planning.md`.
2. Author PRC/PLN/WRK with explicit lifecycle and boundary semantics. Preserve concurrent staffing, skills qualification, capacity units, auxiliary work, overnight work and human approval.
3. Make R10 normative in PRC and qualify missing windows without requiring FER. Preserve 1–N behavior, role-specific legal applicability, breaks, DST and staged adapter integration.

**Document scenarios:**
- Two simultaneous jobs requiring one baker conflict despite spare hours later; passive fermentation does not consume continuous baker time.
- Concurrent 12 + 12 pieces exceed a 20-piece oven; unknown capacity remains unverified, not unlimited.
- Covers AE4. Waiting 45 minutes violates the supplied 30-minute window; absent an applicable window, technological feasibility is unverified.
- Approved plan v1 of 20 pieces remains the consumer input while v2 of 30 is a draft; approval does not publish shifts or dispatch purchases.
- 1, 2 and 5 people use one model; Europe/Warsaw overnight DST examples retain 7/9-hour elapsed durations and ordinary nights 8 hours before breaks.
- A 06:00 readiness estimate with 30 active + 60 passive + 15 active minutes starts at 04:15 with 45 active person-minutes for one person; missing passive time is not zero.

**Verification:** Source blocks and existing workforce-guide obligations have destinations; PRC ownership prevents solver/demo/scenario duplicates; WRK task proposals separate start/demo/release gates.

### U4. Author stock, sales and economics

**Goal:** Define shared quantity and money rules usable by actual operations and hypothetical scenarios without double counting or unsupported recurrence claims.

**Requirements:** R2–R5, R8, R9, R11; KTD1, KTD2.

**Dependencies:** U1.

**Exclusive files:** `docs/specs/stock-inventory.md`, `docs/specs/sales-returns.md`, `docs/specs/economics-investment.md`. Scratch: `u4-coverage.md`, `u4-tasks.md`.

**Approach:**
1. Extract #4/#5/#9/#35/#48–#50 and the economic/stock parts of #1/#12. Preserve historical prices, energy methodology, channel/discount/waste analysis, MRP version changes, FEFO and human purchasing approval.
2. Place stock conservation and physical/saleable distinctions in STK; SAL owns commercial recording/refunds and cites STK. ECO owns labor allocation and all shared economic distinctions.
3. Make R9 normative in ECO with a STK boundary-state input contract. Specify qualification of replenishment, inventory/cash changes and attributable work outside the week without imposing identical end/start stocks or full monthly simulation.

**Document scenarios:**
- 10 opening + 20 production - 15 gross sales = 15 pieces; two physically received unsaleable returns give physical 17/saleable 15, then their waste returns physical stock to 15 once. Refund alone causes no movement.
- 20 kg - 19.5 kg use - 0.5 kg loss = 0; a later extra withdrawal is not valid known stock. Unknown kg-to-piece conversion is not invented.
- Shared 30 minutes at 50/50 allocates 15 + 15 person-minutes and does not add a second attendance cost; missing split is not exact costing.
- Price 20, variable cost 10 and fixed/owner budget 24,000 PLN require 2,400 sold pieces/48,000 PLN revenue; capacity of 2,200 ready pieces cannot satisfy that plan and does not prove demand.
- 40,000 - 30,000 - 2,000 assumed owner burdens - 6,000 owner income = 2,000 surplus; 120,000 / 2,000 = 60 months. At 35,000 receipts surplus is -3,000 and finite payback is not confirmed.
- Covers AE3. Net opening-WIP depletion without replenishment invalidates recurring qualification, while a documented non-identical boundary with accounted replenishment/work may qualify. A 22-selling-day calendar is not silently 20 days.

**Verification:** Numeric examples reconcile units and cost bases, no unknown price becomes zero, and source-block mapping covers operational as well as investment scope.

### U5. Author hypothetical scenarios and map/demo

**Goal:** Specify isolated investment/comparison flows and presentation/demo consumers without introducing another production model.

**Requirements:** R2–R5, R7–R10; KTD1, KTD2.

**Dependencies:** U1.

**Exclusive files:** `docs/specs/scenarios-comparison.md`, `docs/specs/flow-map-demo.md`. Scratch: `u5-coverage.md`, `u5-tasks.md`.

**Approach:**
1. Extract #1/#45–#51, the scenario portions of #12, #30–#32/#41–#43 and the offered product-plan R/A/F/AE contract. Consume PRC/STK/ECO/EVT rather than restating their rules.
2. Preserve source/scale/machine provenance, saved/reopened variants, repeatability/isolation, limited conclusions and the difference between tested sequence and global optimum.
3. Preserve fixture/demo controls, projection equivalence, one renderer/list, eight-stage/two-batch branching example, separate layout, mobile/keyboard/reduced-motion, stale-source handling and nonduplicated aggregates.
4. Propose distinct connected MVP-1 and extended MVP-2 task outcomes under R7, alongside optional map/demo delivery.

**Document scenarios:**
- Separate owner/salesperson hours remain visible; 5 x 8 = 40 hours and 7 x 12 = 84 are availability inputs, not interchangeable requirements to work.
- A measurement by two people on different equipment remains contextual evidence, not an automatically halved one-person target-machine duration.
- Identical inputs repeat results and do not mutate actual recipes, batches, stock or shifts; moving a map node changes neither time nor quantities.
- Four hours of fermentation with successful source checks is fresh despite no events; source failure is visible and reconnect avoids duplicate transfers. Paused virtual time is not a live failure.
- A missing rent/window/recurrence qualification affects the corresponding financial/technological conclusion without hiding valid partial results or proving demand.
- A fixture proves renderer/demo behavior, not live quantities/occupancy, solved stream ordering or business model accuracy.

**Verification:** All investment R1–R32/F1–F4/AE1–AE11 have contextual destinations, map/demo does not subsume the economic engine, and the recorder is not a mandatory scenario prerequisite.

### U6. Author independent follow-on capabilities

**Goal:** Give every accepted later capability the same testable business depth as the next release, without binding them into giant follow-on gates.

**Requirements:** R2–R5, R7, R13; KTD1, KTD2.

**Dependencies:** U1.

**Exclusive files:** `docs/specs/demand.md`, `docs/specs/optimization.md`, `docs/specs/fermentation.md`, `docs/specs/quality-monitoring.md`, `docs/specs/b2b-orders.md`, `docs/specs/owner-assistant.md`. Scratch: `u6-coverage.md`, `u6-tasks.md`.

**Approach:**
1. Read full bodies/comments for #6–#8/#10–#12 and their referenced integration rules. Expand broad accepted outcomes into atomic conditions and AC without inventing product policies.
2. Author independent DEM/OPT/FER/QLT/B2B/AST specs using the same R5 checklist. Make unavailable information a named affected-task decision when it changes behavior; do not mark a vague epic ready by adding a template.
3. Preserve source-specific controls: leakage-free evaluation, baseline fallback, solver rather than LLM scheduling, fermentation uncertainty/baker validation, sensor/network/calibration failures, human food-safety decisions, confirmed-order protection, AI redaction and human approval.
4. Split growth variants from assistant orchestration: SCN/ECO own reusable scenario/money behavior while AST owns questions, sources and permissions. Preserve wider growth cash-flow/uncertainty scope as follow-on tasks, not a new opening-month prerequisite.

**Document scenarios:**
- Sales censored by stockout are not treated as full demand; walk-forward validation excludes future data and a candidate without demonstrated advantage retains baseline behavior.
- A manual approved plan/availability can feed bounded CAPP without B2B/#29; proposed changes do not silently publish shifts or reduce confirmed orders.
- A fermentation forecast with insufficient context exposes uncertainty; a warmer-than-planned retarder produces an alert, not automatic food-safety approval.
- Loss of sensor/network or invalid measurement is distinguishable from an acceptable temperature; corrective actions identify a responsible human and procedure/evidence gates.
- A B2B draft supports manual verification without optimization adapters, labels missing capacity verification and retains cancellation/duplicate history through dispatch.
- Three operational assistant questions cite data/date/assumptions, denied sensitive data stays denied, and LLM text is not a financial calculation or authority to modify prices/orders/schedules.

**Verification:** Every source TODO, KPI/DoD obligation and meaningful control has a destination or justified consolidation; later specs are not placeholders and no empirical accuracy is claimed without future evidence.

### U7. Integrate portfolio, task DAG and migration proof

**Goal:** Make the library actionable through one release overview, local tasks and complete cross-source coverage.

**Requirements:** R1–R12; KTD3–KTD5.

**Dependencies:** U2–U6, including accepted source-block/task packets.

**Exclusive files:** `docs/product-plan.md`; all fourteen project files listed in Project Layout; `docs/projects/README.md`; `docs/decisions.md`; `docs/migrations/spec-library/coverage.md`, `docs/migrations/spec-library/retirement.md`, `docs/migrations/spec-library/verification.md`.

**Approach:**
1. Extract #1/#2/#13/#16/#20–#25 and all unallocated shared/source comments. Reconcile the draft rather than preserving stale 43-issue, "no MVP-2 issues" or mandatory recorder-first claims.
2. Integrate packets into bounded local tasks and the portfolio using KTD3. Preserve #13/#16 architecture/migration work, #2 data-model obligations and all risk-based delivery controls as future tasks with proper evidence conditions.
3. Migrate DEC-001/DEC-002 with exact affected canonical IDs/tasks and explicit decision ownership still to be assigned by the repository owner.
4. Consolidate the ledger and compare every source block to canonical text/tasks. Record approved supersessions of release labels and boilerplate with reasons. Reconcile cross-owned sources exactly once.
5. Document the R12 caller-owned retirement protocol and per-issue replacement links, leaving remote actions pending. Reserve exact policy-control anchor targets in the integration packet for U8 to create, and populate document verification with actual checks only.

**Document scenarios:**
- Covers AE1, AE2. Every old ID resolves, source splits name all owners, and true blockers form an acyclic graph while optional adapters/contract references may cross-link without becoming blockers.
- MVP-1 has a connected manually sourced flow and MVP-2 extends it to realistic mixed products; OBS/full CAPP/POS/demand/FER are not automatic gates.
- Every #1–#43/#45–#51 record and every investment R/A/F/AE maps to a destination or justified disposition. A missing unnumbered control fails proof even if all 50 issue IDs appear.
- Future tasks without implementation evidence remain `not-started` or specifically blocked; ready documentation never marks a feature done.
- Covers AE5. Retirement is pending before merge and closure wording says requirements/tracking migrated, not feature implemented.

**Verification:** Existing project/spec/decision references resolve, the blocking DAG has no cycle, all coverage rows have reviewed dispositions, and project status/evidence are honest. Policy-control links awaiting U8 are enumerated as reserved targets, not reported as resolved. Complete reference proof and final verification-record acceptance follow U8's authority-switch handoff.

### U8. Switch authority routes and verify the assembled repository

**Goal:** Make the local library the working entry point while preserving engineering policy, historical artifacts and excluded work.

**Requirements:** R1–R6, R11–R14; KTD5.

**Dependencies:** U7.

**Exclusive files:** `AGENTS.md`, `docs/index.md`, `docs/domain/glossary.md`, `docs/reference-examples.md`, `docs/workforce-planning.md`, `docs/design-system.md`, `docs/engineering-assurance.md`, `.github/ISSUE_TEMPLATE/implementation.md`.

**Approach:**
1. Change the live reading route to portfolio -> bounded local task -> canonical spec/decision/policy. Make the GitHub template direct new work to repository tasks rather than establish a second active tracker.
2. Repoint glossary/examples to canonical IDs. Keep their derived role. Replace the old workforce guide's normative duplication with a concise link/compatibility entry point after mapping every retained obligation to WRK or its shared owners.
3. Preserve policy ownership and meaningful controls from #20–#25, creating the exact stable control anchors reserved in U7's integration packet. Reconcile old stage references by applicability to data/risk, not by assuming "M1" still means recorder-first MVP-1.
4. Check current maintenance versus future target-stack guidance without changing dependencies or choosing versions. Preserve tracked CE artifacts as history rather than rewriting their old authority statements.
5. Run the assembled document checks and update U7's verification record through an explicit integration handoff; U8 reports results to U7's owner instead of concurrently editing that file.

**Document scenarios:**
- Starting at AGENTS/index reaches a local bounded task and one normative owner without fetching issue history; historical GitHub links are clearly provenance.
- All example REQ/AC links and policy control anchors resolve, including DST, scaling, returns, correction and allocation examples.
- Live guidance no longer says issues are authoritative or 43 are complete; historical CE artifacts remain intact and are not treated as current authority.
- The absent narrow plan stays absent, ideation HTML is unmodified, and application/tooling/dependency/CI files have no changes.

**Verification:** The complete Verification Contract passes and final diff review confirms the intended documentation-only allowlist. No app tests/build are represented as run by this migration.

---

## Verification Contract

These are document checks for the subsequent implementation, not tests run during planning. The repository's `npm run test` and `npm run build` check product code and are not required evidence for this prose/data-only change. There is no installed documentation validator or `release:validate` command established by this plan.

| Check | Required proof | Failure condition |
|---|---|---|
| Source integrity | Exact 50-ID set, body/comment completeness, stored hashes and identity metadata matched against supplied baseline | Missing/truncated body or comment, untracked amendment or wrong source role |
| Block coverage | Review every full source block against exact canonical REQ/AC/task/control or justified disposition; include approved-scope amendments and draft R/A/F/AE mapping | ID totals pass but meaning/control/example/dependency is lost |
| Spec quality | Apply R5 to all sixteen owners, including later capabilities, with source comparison and concrete outcomes | Template-only epic, invented policy, omitted access/error/lifecycle case or unequal abstraction |
| Stable references | Resolve all local Markdown files/fragments, qualified IDs, task coverage and decision impacts; preserve existing incoming entry points | Broken anchor, duplicate/recycled ID, dangling source mapping or conflicting owner |
| Dependency validation | Build task prerequisite graph from implementation-prerequisite edges only; check target existence, scope/phase and acyclicity; inspect parent/input/adapter/gate classifications | Cycle, blanket epic blocker, synthetic demo treated as live proof or recorder dependency restored |
| Numeric oracles | Independently recompute U2–U5 examples using explicit units, inputs and assumptions; compare with canonical AC | Arithmetic mismatch, double-counted flour/labor/returns, hidden 4-week month, finite unsupported payback |
| Scenario qualification | Review opening/closing WIP/stock, replenishment, attributable outside-week work and supplied intermediate windows against output qualification | Recurring conclusion from depletion or technological feasibility from unlimited unknown waiting |
| Authority/status | Follow AGENTS/index/task/spec route and inspect all mutable product/task claims | GitHub remains a live tracker, policy becomes proof of enforcement, doc readiness becomes shipped behavior |
| Protected scope | Compare final changed paths and baseline user work against R13/R14 | App/tooling/CI edit, lost tracked CE artifact, modified excluded HTML, restored deleted plan or unrelated planning commit |
| Retirement gate | Verify pending handoff and replacement links locally; postmerge caller later verifies default-branch resolution and drift | Any premerge GitHub write or closure/merge claimed without receipt |

Temporary validators may parse IDs, local anchors, graph edges and coverage keys. Keep their source/output in the executor's scratch workspace, report their limitations, and commit only the durable verification summary. Manual semantic comparison remains necessary: a parser cannot prove that a rewritten business rule preserved every qualifier. No committed new test framework is needed.

Each authoring unit submits its exclusive-file list, source blocks reviewed, mapping rows, proposed task slices, unresolved decisions and numeric/edge-case results. The integration owner accepts or returns the packet before declaring aggregate checks complete. After cross-reference integration, run one final reference/DAG pass and inspect remaining semantic gaps rather than repeating product test suites.

---

## Definition of Done

- U1–U8 produce the registered sixteen equally complete capability specifications, retained policy owners, one portfolio overview and bounded repository project/task records.
- Every source issue and meaningful block/legacy ID/control has reviewed traceability. No accepted operational or growth capability disappears behind a release relabeling.
- The connected MVP-1 and extended MVP-2 reflect R7–R10 normatively, including explicit partial/unverified results where data is missing.
- Shared process, stock and cost behavior each has one owner. Actual observation, approved plan, hypothetical execution, anonymous effort and individual attendance retain their distinct authority and lifecycle.
- DEC-001/DEC-002 stay open with precise impacts; local documentation can be accepted while affected future implementation tasks remain blocked.
- All applicable document checks pass with actual evidence and limitations recorded. No runtime accuracy, compliance, installed controls or product completion is inferred from this migration.
- Live agent/index/template/reference guidance resolves to local authority. Protected CE artifacts, excluded HTML and deliberately absent old plan are preserved as required by R14.
- Remove abandoned draft alternatives and temporary validation artifacts from the proposed diff. Keep only intended repository deliverables and historical source evidence.
- PR delivery, when separately authorized, contains only this migration's intended work. Merge and R12 retirement remain explicit caller-owned pending obligations until authorized actions and receipts exist; their pending state does not prevent acceptance of the locally authored migration or its PR delivery.
