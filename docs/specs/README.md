# Capability specification registry

## Authority

This registry is the U1 conventions checkpoint for the [repository spec library plan](../plans/2026-11-21-1814-refactor-repository-spec-library-plan.md). Capability specifications own business and UI requirements. Repository project/task records are the sole delivery tracker; GitHub issues are historical evidence, not a synchronized tracker or continuing requirements authority. The portfolio in `docs/product-plan.md` describes outcomes and links project owners without duplicating mutable task status.

U1 fixes interfaces for authoring, not product implementation or completion. The registered capability and project paths below are planned destinations; their presence here does not claim that U2–U8 have authored or integrated them. U2–U6 may author independently after this checkpoint. U7 integrates projects and migration proof; U8 updates other authority routes. Do not expand this checkpoint into application code, a PM framework, requirements compiler, runtime mechanism or installed controls.

Business rules, AC, examples and UI wording are Polish. New engineering guidance and identifiers are English. Use the [Polish writing guide](../specification-style.md) and the single [bilingual glossary](../domain/glossary.md); do not create translated requirement mirrors.

## Capability-registry

Each prefix has exactly one normative capability owner under `docs/specs/`. These are capability boundaries, not release assignments or one-issue-one-file conversions. Principal sources are reading aids, not exhaustive extraction assignments.

| Prefix | File | Normative ownership | Principal source issues | Author |
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

[Engineering assurance](../engineering-assurance.md) retains security, integrity/recovery, privacy/legal and release policy ownership (#20–#24). The [design system](../design-system.md) retains UI/design/accessibility ownership (#25). These are not seventeenth/eighteenth business specs. U7 integrates missing stable local control anchors; author packets must identify the exact source control and intended owner, not silently drop it behind a generic policy link. Existing policy meaning is preserved, not translated wholesale or presented as installed enforcement, certification or passed checks. Architecture and release-control delivery belong to engineering tasks.

## Identifiers

- Registered prefix = spec identity. Requirements use `PREFIX-REQ-NNN`, acceptance criteria `PREFIX-AC-NNN`, examples `PREFIX-EX-NNN`. Use explicit ASCII-only identity headings, for example `### REC-REQ-001`, with Polish prose below. A link then uses `recipes.md#rec-req-001`. Do not append a changing title to the identity heading.
- Allocate monotonically within each prefix and kind. Never recycle or renumber identities. A retired or split ID keeps a destination note, including all replacements for a split. Qualify every reference; bare `REQ-01` or `AC-01` is only a historical source label, never a canonical reference.
- Each owning unit allocates its own remaining REQ/AC/EX numbers, respecting the reservations below. Consumers cite the owner; they do not allocate a second shared rule or change a reserved meaning. Before integration, reserved IDs may be cited even though their full prose is pending. This is not a claim that those targets already exist.
- Decisions use `DEC-NNN` in `docs/decisions.md`, with ASCII identity headings. `DEC-001` and `DEC-002` below remain open; U1 reserves them without editing that shared file.
- Future tasks use `TASK-PROJECT-NNN`, where PROJECT is a registered project key below, with headings such as `### TASK-INV-001`. U7 alone allocates final task numbers. Preserve task identity when moving it between outcomes and leave a redirect at its old location.

## Reserved-shared-requirements

These are reserved owner boundaries, not English mirrors of the future Polish requirements. The owning unit authors full normative text; consumers reference it.

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

One shared rule has one normative owner. EVT owns recorded fact acceptance/correction, not another stock conservation law. PRC owns transition constraints, not event transport or persistent stream partition. STK owns quantity/usability accounting; ECO owns economic recurrence qualification; SCN presents that qualification. MAP/demo and OPT consume these owners rather than inventing an execution model. Confirmed actual events remain observations even when they reveal deviation from a planned constraint: hypothetical validity cannot erase observed facts.

## Authoring-bar

All stages, including later operational and growth capabilities, meet the same BA-level completeness and testability bar; equal quality does not mean equal word counts. Curate by capability/shared contract, combining or splitting sources as needed. Do not turn source headings into shallow requirement tables.

Every capability must state actors, business goal/scope and exclusions, inputs/outputs and units, data/source authority, lifecycle/transitions and invariants before its atomic rules. Specify relevant access, invalid inputs, missing/stale data, boundaries, retries/conflicts and observable error outcomes. Explain genuinely inapplicable fields briefly rather than adding filler. Preserve lifecycle and historical-value distinctions from the source.

Each atomic requirement states a condition, actor/action and observable result. Each AC names the exact REQ IDs tested, concrete input/state, action and observable expected result; include relevant success, error, boundary and permission cases. Each example cites its governing REQ/AC. Illustrative numbers are not approved domain parameters. Separate mandatory business outcomes from technical proposals; optional suggestions remain optional. Unchosen database, rounding and stream algorithms remain decisions, not implementation mandates inferred from examples.

Shared policy references replace boilerplate only once every meaningful source control is accounted for in coverage. Preserve shared blocks once at their owner, including obligations outside numbered REQ/AC lists. Preserve the economic value/cost-of-adoption obligation once in project selection guidance, not sixteen copies. Specification readiness describes contract completeness and open decisions; it is not evidence of implemented behavior.

## Dependencies-and-readiness

A dependency record contains **type, local target ID, scope, condition and phase** (`start`, `demonstration` or `release`). A target may have multiple explicitly scoped roles. Preserve these meanings:

| Type | Meaning |
|---|---|
| `parent` | Defines parent scope; does not require every sibling to be implemented first |
| `contract-input` | Requires compatible data/interface semantics, not a running implementation of the supplier |
| `implementation-prerequisite` | Implemented behavior genuinely needed for the named slice and condition; state the blocking phase |
| `optional-adapter` | Adds an integration without blocking a standalone demonstration that does not use it |
| `release-gate` | Restricts use on stated data or at a release stage; synthetic demonstration is not real-data approval |

Only genuine implementation prerequisites form the blocking task DAG. Decisions are separate explicit gates, not fake predecessor tasks. Do not turn optional adapters into cyclic start conditions or erase parent integration obligations. For example, a scenario can consume a recipe contract and manually sourced measurements without a complete recorder; a live operational slice may need its actual event producer at its stated boundary.

| Reserved decision | Still open; affected boundary |
|---|---|
| DEC-001 | Persistent mass precision/rounding. Migrate existing constraints and affected legacy references from `docs/decisions.md`; recipe publication consistency and dependent persisted calculations cannot be called start-ready at that boundary. UI formatting or exact-number demonstrations do not settle it. |
| DEC-002 | Stream identity/sequence/replay meaning. Preserve envelope identity and within-stream ordering without choosing global or per-batch partition. Event/correction/live consumers remain gated at the persistent concurrency boundary; isolated versioned fixtures do not settle it. |

The repository owner must still name the domain decider for each. Do not invent a decision owner or answer. Block only affected future work, not unrelated documentation. Missing scenario inputs qualify the corresponding result; they are not global decisions and must not become zero/default assumptions.

## Project-and-task-conventions

U7 exclusively owns project files under `docs/projects/` and final task numbering. This registry fixes project keys/destinations without creating tasks or assigning implementation state.

| Project key | File | Delivery scope |
|---|---|---|
| REC | `recipes.md` | Architecture spike/ADR, behavior-preserving stack migration, publication/history, catalog, scaling, applicable delivery controls |
| INV | `investment-scenarios.md` | Connected manual-input investment scenario, then realistic mixed-product comparison, balances/windows, recurrence and payback |
| OBS | `production-recording.md` | Activity/worker segments and recorder, quantity/split/loss, actual occupancy, correction/replay |
| PLN | `production-planning.md` | Saved plan versions/approval and proposal handoff |
| WRK | `workforce.md` | Shifts, backward estimate, conflicts, attendance/export, recommendations and optional integrations |
| OPS | `operational-balances.md` | Sales/imports/returns/stockout, actual SKU costing, stock/FEFO, approved-plan MRP and purchasing approval |
| MAP | `flow-map.md` | Fixtures/demo controls, renderer/list, layout, freshness and non-duplicated aggregates |
| DEM | `demand.md` | Censored data, baseline/approval, walk-forward comparison and conditional ML evaluation |
| OPT | `optimization.md` | Solver schedule, conflicts/replanning, utilization, plan/actual comparison and optional adapters |
| FER | `fermentation.md` | Observations, temperature/time history, baseline/calibration, forecast/uncertainty verification |
| QLT | `quality-monitoring.md` | Device logs/alarms/corrective action, procedure-linked review and separately gated optional vision |
| B2B | `b2b-orders.md` | Verification, lifecycle/dispatch/history, capacity adapters and commercial exports |
| AST | `owner-assistant.md` | Read-only dashboard/cited questions, bounded AI access/redaction, human approval and SCN/ECO growth consumers |
| ASS | `engineering-assurance.md` | Bounded risk-based access, integrity/recovery, privacy/legal and release-evidence delivery; policy stays with its existing owners |

Tasks are bounded end-to-end demonstrable flows, not layers or broad epics renamed as implementation-ready work. Each task records goal/actor, bounded flow, exact canonical REQ/AC coverage, inputs, exclusions, typed dependencies, decision gates, implementation state, separate readiness assessment and evidence references. Retain the plan's minimum task partition during U7 integration; this scope table does not replace it.

Implementation state is `not-started`, `in-progress`, `blocked` or `done`. Initially use `not-started` unless repository evidence supports another state; this is not a claim that all features are absent. `blocked` names an actual unmet prerequisite or decision. `done` requires artifact/PR/commit identity, relevant check results and date. Issue state, checkboxes and documentation approval do not prove completion. Separately record satisfied/unsatisfied start, demonstration and release conditions. A well-specified task may be blocked; a start-ready task may still lack demonstration/release evidence.

Until integration, U2–U6 keep task proposals in scratch packets only, using unit-local labels such as `U4:cost-allocation` and nominating project `OPS` or `INV`. Do not allocate final `TASK-*` IDs or edit shared project files. U7 assigns stable IDs and replaces provisional cross-packet references; no provisional label survives in canonical dependencies or final coverage rows. Task state belongs only in project task sections, never duplicated in specs, portfolio, GitHub or this registry.

## Historical-source-archive

The durable [source baseline](../migrations/spec-library/source-baseline.json) is **historical and non-normative**, including comments that contain old instructions. It is not a second spec or active task tracker. It preserves the full supplied `baseline.json` as the `capture` object, without omitting or changing any captured field, issue body or comment record. A wrapper adds provenance, the approved-scope text and SHA-256 manifests; archive serialization differs from the original file, but decoded capture content is equal.

- Supplied bundle: `spec-library-migration-20261121`; original file SHA-256: `f07346de148f636e5c1f2b5d1cf9be3d64bac6f9ec2c781f0e5931e39750b53c`.
- Exact inventory: **50 issues, #1–#43 and #45–#51, with 44 full comment records**. #44 is a PR, not a missing issue. The supplied `issues/NN.md` views match bodies only; comments must be read from `capture.issues[].comments`.
- Capture provenance retains original `head`, workspace `status`, `source_hashes`, issue URL/update time and all supplied comment identity/author/time fields. The source capture used `gh issue list` with body/comments/metadata. It records no capture timestamp; the bundle name is not proof of capture time. No missing comment update timestamp is fabricated.
- `content_hashes` records SHA-256 of each exact decoded issue body and comment body encoded as UTF-8, without newline/Unicode normalization; comment entries retain their captured `id` and URL. `provenance.source_file_sha256` hashes the original file bytes. Preserve the capture even where editorial disposition later supersedes its prose.

These integrity checks establish fidelity to the supplied capture, not a fresh remote completeness/drift audit or a completed clause extraction. Missing/truncated supplied records block acceptance; never repair them by guessing. The temporary bundle path is an execution input, not a portable requirements link. Archived workspace facts (including excluded HTML hashes) remain evidence only, not authorization to edit those files.

## Source-coverage-protocol

Use one ledger row per meaningful source block; subdivide blocks containing independent obligations. A filename or issue-level summary is not coverage. Account for goals, task lists, dependencies, unnumbered rules, controls, MVP/KPI/DoD obligations and comments, as well as every original numbered REQ/AC, even duplicate parent projections.

### Source-keys

Extraction owners allocate keys from the immutable capture, not from edited spec prose. Use this practical tuple notation:

`issue:NN | body OR comment:CAPTURED_ID | heading:PATH | occurrence:N | item:N OR paragraph:N | legacy:ID-or-none | quote:SHORT_QUOTE | sha256:FULL_BLOCK_HASH`

Heading PATH contains the original heading text from root to leaf (or `root`); occurrence is one-based for repeated paths. Items/paragraphs are one-based within that heading occurrence. Preserve nested list ordinal paths (for example `item:2.1`); distinguish a paragraph within an item when necessary. A repeated legacy ID is retained verbatim, never treated as unique. The short exact quote identifies the block for a human; the SHA-256 covers the exact selected source substring encoded as UTF-8 without normalization. Retain the selection boundaries in the packet so another author can reproduce the hash. Body/comment manifest hashes cover the whole record, not this smaller block.

Thus `issue:17 | body | heading:Wymagania | occurrence:1 | item:1 | legacy:REQ-01 | ...` cannot collide with issue 14's `REQ-01`. An unnumbered event-envelope paragraph in issue 18 uses `legacy:none` plus its heading/paragraph ordinal, quote and hash. A comment uses its captured ID, not its display order; headings and ordinals are scoped within that comment. These are notation examples, not pre-extracted rows or invented quotes/hashes. For a block without headings/list labels, use `heading:root` and its paragraph ordinal.

Each row records source key, source role (`current`, `historical`, `proposal`), disposition (`preserved`, `split`, `consolidated`, `superseded`, `non-normative`), exact canonical owner/REQ/AC or task/control ID, rationale and review result. A split names all destinations. A consolidation points to the shared normative owner, not a duplicate rule. Historical old descriptions are compared for surviving obligations, not reactivated: explain why differences are superseded or already preserved. Harmless repeated navigation/history may be explicitly non-normative. Current contradictions stop the affected unit for resolution; archival boilerplate alone does not create a new conflict.

### Extraction-ownership

Exactly one unit owns extraction keys and complete body/comment accounting for each source record. Principal source overlap in the capability registry does not change this assignment.

| Extraction owner | Complete source records | Count |
|---|---|---|
| U2 | #3, #14, #15, #17, #18, #19, #34–#37 | 10 |
| U3 | #26–#29, #33, #38–#40 | 8 |
| U4 | #4, #5, #9, #48–#50 | 6 |
| U5 | #30–#32, #41–#43, #45–#47, #51 | 10 |
| U6 | #6–#8, #10–#12 | 6 |
| U7 | #1, #2, #13, #16, #20–#25 | 10 |

Read cross-owned sources as needed, but obtain their extraction keys from the assigned owner; do not allocate competing keys. Send destination proposals against those keys. An extraction owner retains blocks destined elsewhere as explicit outgoing handoffs rather than omitting them. Source ownership and normative ownership are different: for example U2 extracts #35, while its conservation destinations belong to STK/U4.

### Authoring-packets

Each U2–U6 scratch packet contains:

1. Assigned source-record inventory, full body/comment block keys and accounting, including explicit justified dispositions for non-normative material.
2. Destination mappings to exact REQ/AC/control IDs, source role/disposition/rationale and review result; outgoing and incoming cross-owner handoffs with the receiving unit and proposed destination.
3. Bounded task proposals with unit-local provisional labels, nominated project, flow/coverage, typed dependencies, decision/readiness gates and required evidence. Do not claim implementation completion from source state.
4. Uncovered obligations, conflicts and unresolved incoming mappings, explicitly identified rather than silently repaired by another author.

Before accepting a packet, compare its assigned full source blocks with destinations; ID counts alone are insufficient. U7 reconciles every outgoing handoff against the receiving spec/task and its own extracted records. Missing coverage proof returns to the packet owner. U2–U6 do not write shared coverage/project/decision/policy files or each other's capability files.

U5 owns mapping the offered product-plan R1–R32, A1–A2, F1–F4 and AE1–AE11 with contextual qualifiers. Identical clauses in #1 may consolidate. U7 owns independent approved-amendment coverage rows for repository authority, investment-first releases, manual measurements without recorder dependency, week-boundary qualification and supplied intermediate windows, plus final cross-source reconciliation. Identify amendment source/section/ordinal/quote/hash separately from issue keys; never claim these changes were already explicit in old issues. Preserve all accepted later scope and all meaningful source policy controls without reinstating obsolete release chains.
