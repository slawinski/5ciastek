---
title: "Agent-ready repository and issue specifications - Plan"
type: refactor
date: 2026-11-17
created_at: "2026-11-17T17:35:22+01:00"
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-ideate-plus-user-approved-scope
execution: code
---

# Agent-ready repository and issue specifications - Plan

## Goal Capsule

- **Objective:** A fresh implementation agent can identify the effective bakery rules, choose a bounded task, and explain its completion evidence without reconstructing amendment history or inventing policy.
- **Means:** Consolidate existing specifications in place and provide a short shared reading route, terminology, examples and typed relationships (KTD1–KTD6).
- **Authority:** The approved scope in this contract governs the refactor. Existing issue contracts remain behavioral authority; each topic has the explicit source owner described in KTD1. New docs are user-approved shared derived references and engineering policy, published as pinned snapshots while their repository PR is pending. Examples cannot amend issue behavior.
- **Execution profile:** Repository documentation refactor on `docs/agent-ready-specifications`, based on `d88cadc8154cd6815fdc69853b80bc082392b7da`. Documentation verification precedes any remote publication. This plan authorizes no product implementation.
- **Finishing owner:** The later orchestrator owns the pushed documentation commit, open PR, authorized GitHub body updates and exact-body readback under KTD7. All six directions, including issue synchronization, must complete in that execution run with the PR pending. LFG authorizes push/open PR, not merge.
- **Stop conditions:** Stop an affected edit on an unresolved behavioral conflict, lost identifier/control, changed upstream body, unavailable history provenance, or unverifiable published body. Evidence invalidating a settled decision must be returned as `settled-decision-invalidated`, naming the decision and evidence.

---

## Product Contract

### Summary

Implement all six approved directions embedded in this contract across repository guidance and the 43 existing GitHub specifications.
Keep domain authority in its existing issue/document homes, make current rules readable without appendices, and synchronize issues using verified immutable pushed-commit references while the documentation PR remains pending.

### Problem Frame

The backlog contains useful REQ/AC identifiers and bounded children, but current rules are spread across original sections and dated clarifications.
`docs/workforce-planning.md` attributes the saved manual production plan to #17, although #33 owns it.
The starter README, tool-specific mandates and target migration backlog do not give an agent a consistent current-versus-target reading route.
This creates repeated interpretation work and risks weakening controls or implementing the wrong capability.

### Requirements

**Authority and preservation**

- R1. Audit and synchronize all existing specifications #1–#43 and affected repository docs; preserve every issue-local REQ/AC identifier and its behavioral meaning.
- R2. Consolidate accepted amendments into effective sections in each issue, retaining linked history and an explicit source owner for shared rules.
- R3. Preserve every security/legal control, exclusion, release condition, existing parent/child relationship and unchecked completion obligation; document changes are not evidence that product controls work.

**Language and navigation**

- R4. Keep Polish authoritative for business specifications and application UI, English for engineering guidance and identifiers, and a single bilingual concept glossary.
- R5. Give agents one short entry point with current/target applicability, accurate commands and links to existing policies instead of copied policy frameworks.

**Examples and implementation boundaries**

- R6. Publish separate per-domain reference tables derived from cited acceptance criteria, including literal Polish UI examples where relevant, without adding a test platform or translating application code.
- R7. Type task relationships as parent feature, contract input, implementation prerequisite, optional adapter or release gate, with conditions that distinguish starting, demonstrating and releasing a capability.
- R8. Define a task as one bounded, coherent, independently demonstrable capability; keep atomic requirements without using literal verb count to split tasks.
- R9. Record unresolved precision and stream-order domain decisions explicitly, separating them from engineering discretion and limiting their blocking effect to affected implementations.

**Verification and publication**

- R10. Verify local Markdown targets/anchors, source-to-example/glossary consistency, issue-local identifier and semantic preservation, and the absence of contradictory live appendices.
- R11. Publish issue changes through the later orchestrator with fresh concurrency checks, exact-body verification and live repository links under KTD7.

### Success Criteria

A cold reader starting at `AGENTS.md` can explain why maintenance uses TanStack, why only #13/#16 select and perform migration, why #17 is not a saved plan, and which child belongs to #18/#27/#31.
The same reader can distinguish a synthetic demo from a real-data release, anonymous person-minutes from individual attendance, and an unresolved domain choice from an implementation detail.
Every original issue has a reviewed disposition and preserved qualified identifiers; every modified issue has a verified published body before synchronization is reported complete.

### Scope Boundaries

In scope: the six ranked ideas only; existing issue bodies #1–#43; `README.md`, new `AGENTS.md`, thin `GEMINI.md`, new `docs/index.md`, `docs/specification-style.md`, `docs/workforce-planning.md`, `.github/ISSUE_TEMPLATE/implementation.md`, new `docs/domain/glossary.md`, new `docs/reference-examples.md`, and new `docs/decisions.md`.
`docs/engineering-assurance.md` and `docs/design-system.md` remain governing policies; edit them only if an actual cross-reference/applicability correction is needed to deliver R2/R3/R5.
Existing subordinate design/responsive documents may receive a short authority pointer when their current presentation conflicts with the selected owner; do not rewrite their design content.

Excluded: wholesale backlog relocation, independent English mirrors, new instruction frameworks, compilers, lockfiles, schemas, reverse-impact graph tooling, mandatory receipts/task capsules, new slicing/ownership bureaucracy, separate counterexample packs or UI-translation initiatives, language benchmarks, new product/API code, migrations, CI/ruleset activation, new test infrastructure, legal determinations and invented precision/order policy.
Do not create issues, change issue states/labels/milestones/native parents, close checklists, or infer feature completion from editorial cleanup.
Preserve the untracked user-owned origin HTML unchanged and do not stage it.
The accepted six directions and their boundaries are embedded in this contract; the HTML path is provenance only. No staged document may require that HTML to be shipped or link to it as a repository target.

#### Deferred to Follow-Up Work

Actual UI translation, executable fixtures with their relevant implementation slices, #13/#16 migration work, and delivery of controls in #20–#24 remain their existing backlog work.
They are not prerequisites for this documentation refactor.

### Acceptance Examples

- AE1. Covers R1–R3. After consolidating #17, `REQ-09`–`REQ-12`, `AC-09`–`AC-11` and `AC-HIST-01` remain under the same issue, with unchanged meaning and no competing percentage-mode addendum.
- AE2. Covers R5/R7. A reader can select #41/#42 demo work using the #18 contract and a #30 fixture without claiming live quantities before #35 or actual occupancy before #36.
- AE3. Covers R4/R6/R9. The 30-minute unpaid-break example is labeled a test assumption, not labor-law policy, and no glossary/table invents a persisted mass precision or stream partition.
- AE4. Covers R10/R11. If a maintainer edits #28 after preparation, the publisher does not overwrite it; that issue is reconciled against a fresh body while already verified independent updates remain recorded.

---

## Planning Contract

### Key Technical Decisions

- KTD1. **Keep rule ownership where it already lives; consolidate each body in place.** Governed by R1–R3 and the source-owner table below. (session-settled: user-approved — chosen over chronological appendices: agents need one current reading rather than historical reconciliation.)
- KTD2. **Use one bilingual glossary, not translated requirement mirrors.** Governed by R4/R6. Keep the glossary's definitions in Polish with English identities and short English distinctions as needed. (session-settled: user-approved — chosen over wholesale English translation or two editable mirrors: preserve owner-reviewable meaning without translation drift.)
- KTD3. **Use a thin `AGENTS.md` and `GEMINI.md` pointer.** Governed by R5. `docs/index.md` owns the reading route and current engineering guidance; domain, design and assurance policies retain their own homes. (session-settled: user-approved — chosen over a duplicated instruction framework: avoid independently drifting mandates.)
- KTD4. **Use Markdown reference tables with issue-qualified AC citations.** Governed by R6/R10. Each row has input, observation, qualification, owner and source AC; fixtures are future implementation work. (session-settled: user-approved — chosen over a new test platform: reuse the backlog's existing evidence.)
- KTD5. **Add the five relationship meanings to the existing template and issue dependency sections.** Governed by R7/R8. Parentage is scope, contract input is an agreed interface, prerequisite is implemented behavior needed for the stated slice, optional adapter expands a slice, and release gate constrains its use on specified data/stage. One target may have several explicitly scoped roles. (session-settled: user-approved — chosen over flat ambiguous links: preserve incremental starts without hiding release conditions.)
- KTD6. **Keep precision and ordering open in `docs/decisions.md`.** Governed by R9. Use question, affected qualified IDs, currently binding constraints, decision owner, affected work and permitted discretion; do not label proposals accepted. (session-settled: user-approved — chosen over invented policy: cross-consumer meaning needs an explicit domain decision.)
- KTD7. **Publish issue references to verified immutable pushed documentation commits with the PR pending.** Governed by R11. Use full commit-SHA file/anchor URLs as durable version-specific references and include the actual PR URL in each affected issue's shared-reference section. Existing issue contracts remain behavioral authority; the new shared references/policy are user-approved and pending repository merge. Neither merge nor postmerge link rewriting is required. (session-settled: user-directed — chosen over merge-first publication: push/open-PR authority must suffice to complete all six directions, including issue synchronization, in the execution run.)
- KTD8. **Verify documents and publication outcomes without adding prose tests.** Governed by R10. Use a temporary deterministic check plus semantic review, retaining only the verification outcome in normal PR evidence rather than a new committed checking platform.

### Source Owners and Reading Route

| Subject | Authoritative home | Consumers and boundary |
|---|---|---|
| Current engineering setup and commands | `package.json` for actual scripts; `docs/index.md` for guidance | `README.md` and `AGENTS.md` link here; #13 chooses target architecture, #16 performs migration |
| Specification form and language policy | `docs/specification-style.md` | Existing template and issue bodies link instead of copying full policies |
| Design/UI system | `docs/design-system.md`, #25 | `docs/design_system/neo_brutalist_spec.md` is supporting detail, not a competing token authority |
| Assurance policy | `docs/engineering-assurance.md`, #20–#24 for delivery requirements | Do not present planned checks as installed controls |
| Recipe versions and frozen ingredient composition | #14 | #15/#17/#22 and costing consume published historical values |
| Scaling | #17 | Takes quantities; does not save/approve a production plan |
| Production plan and approved versions | #33 | #27/#29/#7/#9 consume identity and version; approval is not execution or feasibility |
| Production events and projection contract | #18; implementation children #34–#37 | #19 writes, #30 emits isolated equivalents, #31 reads; actual transfer/occupancy needs its own fact |
| Workforce planning and individual time | #26/#27/#28/#29; `docs/workforce-planning.md` explains the domain | #38–#40 implement bounded #27 capabilities; `ShiftPlan`, `WorkSession`, `LaborSegment` remain distinct |
| Map presentation and layout | #31, children #41–#43; #32 owns geometry | Layout never changes production results; #32 does not implement a second renderer/list |
| Sales balance and cost allocation | #4 and #5 respectively | Keep physical returns/refunds distinct and anonymous labor unallocated without explicit split |
| Concept lookup, examples and unresolved decisions | `docs/domain/glossary.md`, `docs/reference-examples.md`, `docs/decisions.md` | Derived references cite the rule owner; none silently supersedes an issue AC |

Until the repository PR is merged, KTD7's pinned snapshots expose these user-approved shared references and engineering policies to issue readers.
Each affected issue's shared-reference section states in Polish that the issue's effective requirements apply now, identifies the pinned documentation revision, and discloses the actual pending PR URL.
The pending state describes repository integration, not whether the consolidated issue instructions are effective; do not present old and revised issue rules as two competing alternatives.

An explicit owner is a source document/issue, not a newly invented person or approval committee.
Keep existing named decision owners; where no person is assigned, record the repository owner as the party who must designate the domain decision-maker.
If owner text and an accepted clarification disagree, fold the clarification into the owner only where its acceptance is evidenced by the existing approved body/history.
A genuinely incompatible business rule is an affected-edit blocker, not permission to choose a convenient interpretation.

The reading route is: project entry → `docs/index.md` → selected child issue → only its contract owners, applicable policy and cited examples.
Preserve useful GEMINI engineering constraints by moving each unique rule to that shared guidance or its existing owner before replacing GEMINI with a pointer.
Resolve its generic-versus-feature component placement using the existing distinction in `docs/design-system.md`; do not delete validation, accessibility, typing or security guidance by accident.

### High-Level Technical Design

**Reference topology**

| Reader entry | Directed reference | Result |
|---|---|---|
| `README.md` / `AGENTS.md` | `docs/index.md` | Current stack, task applicability and existing commands |
| `GEMINI.md` | `AGENTS.md` | Same engineering entry, no independent mandate set |
| Selected implementation issue | Parent + contract owner + applicable policy | Local requirements remain executable without reading all 43 issues |
| Glossary/example/decision row | Qualified issue and stable REQ/AC | Derived meaning stays traceable |
| Effective issue body | Linked pre-edit history | Provenance is available without being a second live rule set |

**Publication protocol and lifecycle (KTD7)**

| Phase | Required condition | Action and terminal condition |
|---|---|---|
| Prepare | Fresh #1–#43 bodies, comments/history, metadata and native parents captured privately | Produce candidate bodies and a preservation/disposition ledger outside the committed backlog; no remote mutation |
| Review | Candidate docs and all bodies satisfy R1–R10 | Review semantic diffs, controls and local links; unresolved conflict holds its affected batch |
| Repository delivery | Orchestrator has push/open-PR authority | Push the checked documentation commit and open its PR without merging; record the full commit SHA and actual PR URL |
| Commit-target preflight | Pushed documentation revision is remotely accessible | Verify every new `blob/<full-commit-SHA>/...` file/anchor target and its linked local-document closure at that revision; verify the PR URL before any issue edits |
| Body preflight | Candidate shared-reference section names the verified revision and pending PR | Reread each issue body immediately before its write; retain effective issue authority and the durable pinned references |
| Publish and verify | Fresh body equals the recorded baseline byte-for-byte | Apply that candidate body only, reread and compare exact body text, then record verified outcome |
| Conflict or partial failure | Changed body, inaccessible target or unequal readback | Stop that issue and dependent cross-reference edits, preserve original/candidate/actual text, report residuals; do not force overwrite or roll back unrelated verified edits |
| Reconcile | All intended updates verified | Audit all 43 dispositions, linked owners, parent references, history links, pinned targets and pending-PR disclosures; complete synchronization without merging |

The immediate pre-write body comparison reduces concurrency risk but is not a claim of atomic GitHub compare-and-swap.
An unexpected post-write value is a conflict requiring reconciliation, never a successful publication.
Do not blindly restore an old snapshot after a failure: it may erase someone else's intervening edit.
Do not use moving branch links or absent `main` targets for new documentation references.
Pinned snapshots remain valid provenance after merge and need not be rewritten; the PR URL provides integration visibility without becoming a competing behavioral specification.
If docs change after the verified push but before publication, push the corrected revision and reverify the affected pinned targets/candidates before editing issues.
If a later correction affects already published references, reconcile only those issue references with fresh concurrency checks; never silently substitute a different revision.

**Preservation data flow**

| Stage | Input | Output |
|---|---|---|
| Inventory | Original body + comments/history + native parent | Qualified ID occurrence list, effective rule/control/exclusion map and baseline body |
| Consolidate | Accepted changes + explicit owner | One effective body with stable IDs and linked historical provenance |
| Check | Original and candidate | Exact ID-set comparison plus semantic disposition for every original normative paragraph, including unnumbered rules |
| Publish | Checked candidate + fresh unchanged body | Exact readback equality or a named unresolved publication conflict |

### Consolidation Rules

Use `(issue number, identifier)` as identity, not an unqualified `AC-01` across the backlog.
Preserve spellings, suffixes and meaning of all `REQ-*` and `AC-*`, including `AC-HIST-*`, `AC-DEP-*`, `AC-CONTRACT-*`, `AC-ENFORCE-*` and other named families.
Apply the same preservation review to `NFR-*`, `SEC-*`, `REL-*`, `LAW-*`, `GATE-*`, `UI-*`, formulas, literal messages, permissions and exclusions.
Keep AC checkbox state and existing task links unless an explicit noneditorial change has separate authority.
Do not renumber, transfer IDs to another issue, or replace their statements with a bare link.

Move amendments into their governing sections and merge split lists such as #16/#17's “additional requirements/criteria” while keeping each original ID.
Separate binding recipe/history behavior from #14's proposed storage model.
Keep proposed implementation alternatives explicitly provisional rather than turning them into requirements.
Eliminate competing dated “Doprecyzowanie”/“additional” instruction layers after their content is accounted for.

History must remain accessible: use a stable pre-edit GitHub issue revision/permalink when available.
If no stable revision URL is accessible, the later publisher may create one clearly labeled historical comment containing the exact pre-edit body, then link its comment permalink from the effective body.
Only this narrowly scoped provenance comment is permitted in addition to body edits; no status or policy discussions are added.
If neither route is authorized/available, block publication rather than invent a revision URL or commit all issue snapshots into the repository.
Historical content must say that it is superseded and not current instructions.
Existing comments with consequential decisions must be linked and incorporated only when accepted; proposals and unresolved discussion remain proposals/open decisions.

### Assumptions

- The 43 issue bodies read on 2026-11-17 remain the editorial starting set; U1 must refresh their comments/history and metadata before edits because this plan does not freeze remote content.
- The orchestrator can push the checked documentation commit and open its PR before issue publication; KTD7 requires verification of these remote targets, not merge authority.
- Temporary preservation/checking output can live in the executor's private working area and normal PR evidence; it need not become a new repository framework.
- No repository strategy/concepts document, CE config, stored solutions or configured packs were present to add a conflicting authority.

### Research and Conflict Findings

The local branch and `origin/main` both resolved to `d88cadc8154cd6815fdc69853b80bc082392b7da`.
GitHub returned exactly 43 issues, #1–#43; native sub-issue reads confirmed #18 → #34–#37, #27 → #38–#40 and #31 → #41–#43.
The current #1 wording that its roadmap checklist is not native sub-issues needs clarification: the checklist itself is not native hierarchy, but native parent/child relationships now exist.
This is stale presentation to repair, not a reason to rebuild the hierarchy.

The inspected sources establish the #17/#33 ownership drift, #14 historical-composition amendments, #24 ruleset-enforcement requirement, #28 exact DST examples and #42 quiet-source distinction.
No evidence invalidates the six settled choices.
No runtime behavior needs probing for this refactor; manifest reads establish the command inventory, not command success.
External library research adds no decision-relevant evidence to this business-rule documentation work.
The approach needs no bake-off: the user settled the competing mechanisms, and publication ordering can be resolved from target-link availability without developing alternative architectures.

---

## Implementation Units

### U1. Establish complete editorial baselines and preservation coverage

**Goal:** Make every source rule accountable before any rewrite.

**Requirements:** R1–R3, R10/R11; KTD1/KTD8.

**Dependencies:** None.

**Files:** Existing policy/docs/template and `package.json`; temporary off-repository issue baselines and ledger, no committed backlog mirror. The source-path provenance in the Appendix may be consulted locally if available, but this plan's embedded contract is sufficient without shipping that input.

**Approach:**
1. Refresh #1–#43 bodies, comments/history, `updatedAt`, URLs and native parent relationships; distinguish accepted decisions from suggestions.
2. Record each qualified identifier and every unnumbered rule, control, exclusion, formula, example and current checklist state with its candidate destination.
3. Assign each issue a disposition: body synchronization required, reference/dependency-only update, or verified no change with a specific reason. Every issue must be assessed; do not manufacture rewrites for already adequate prose.
4. Identify provenance routes and conflicting meanings before editing shared source-owner sections.

**Patterns to follow:** Existing stable identifiers and native children; policy proportionality in `docs/engineering-assurance.md`.

**Test expectation:** none — documentation inventory has no product behavior to test.

**Verification:** All 43 issues appear once in the disposition ledger, all original normative content has a destination, and no conflict is silently resolved. The origin remains byte-identical and untracked.

### U2. Establish the shared entry route and task-writing contract

**Goal:** Let agents find the right current guidance and interpret task relationships.

**Requirements:** R3–R5, R7/R8; KTD2/KTD3/KTD5.

**Dependencies:** U1.

**Files:** Modify `README.md`, `GEMINI.md`, `docs/specification-style.md`, `.github/ISSUE_TEMPLATE/implementation.md`; create `AGENTS.md`, `docs/index.md`. Conditional pointer-only corrections in `docs/engineering-assurance.md`, `docs/design-system.md`, `docs/design_system/neo_brutalist_spec.md`, `docs/RESPONSIVE_SYSTEM.md` if U1 establishes a competing authority.

**Approach:**
1. Replace starter tutorial prose with project purpose and accurate setup/command references; move unique useful engineering mandates into `docs/index.md` or their existing policy owner before slimming GEMINI.
2. Keep `AGENTS.md` short enough to scan at entry: current stack, task-specific authority route, current-versus-migration applicability, and links. Keep GEMINI as a pointer to it.
3. Put Polish business/UI and English engineering/identifier language rules in `docs/specification-style.md`; link the glossary/examples/decisions as forthcoming U3 deliverables within the same documentation change.
4. Replace “one issue = one behavior” guidance with R8 while retaining atomic REQ and observable AC guidance. Add typed relationship fields with scope/condition to the existing template, preserving its assurance, UI and release obligations.

**Patterns to follow:** Existing distinction between epic narrative and implementation specifications; generic/feature component distinction in `docs/design-system.md`.

**Test expectation:** none — prose/navigation changes do not warrant automated product tests.

**Verification:** Cold-read AE2 and the success criteria; `GEMINI.md` has no competing stack mandate. Current command claims match `package.json`, including build-before-production-start, and no installed lint/typecheck/security gate is claimed.

### U3. Publish concept distinctions, domain examples and open decisions

**Goal:** Make shared terminology and numerical evidence reusable without changing domain policy.

**Requirements:** R2/R4/R6/R9/R10; KTD1/KTD2/KTD4/KTD6.

**Dependencies:** U1, U2's reference conventions.

**Files:** Create `docs/domain/glossary.md`, `docs/reference-examples.md`, `docs/decisions.md`; modify `docs/workforce-planning.md` and its index references.

**Approach:**
1. Define Polish terms and English identities for `ProductionPlan` and its approved version, `ShiftPlan`, `WorkSession`, `ProductionBatch`, phase/task, `LaborSegment`, recipe version, ingredient composition, SKU, physical/saleable stock, event/projection, planned versus actual resource reservation, and source freshness versus event age. Mark identities as terms, not mandated new schemas.
2. Use the minimum examples in the source table below, with separate domain tables rather than a combined end-to-end fixture.
3. Correct the workforce manual-plan owner to #33 and its incremental #27/#7/#29 routes using KTD1; preserve its 1–N architecture and all legal/privacy qualifications.
4. Record persisted/calculation mass precision and stream partition/order guarantees as open decisions. Name affected #14/#17 and #18/#30/#34/#37/#42 identifiers from the refreshed source, required decision owner and earliest affected implementation. Keep display formatting/queue internals delegated where they do not alter these contracts.

**Patterns to follow:** Exact AC examples in #17/#28/#34/#42 and domain distinctions already in `docs/workforce-planning.md`.

**Test expectation:** none — verify arithmetic and citations, not new prose tests.

**Verification:** Every glossary distinction and example cites an existing source; AE3 holds. Missing starter composition is not converted into false percentage precision, and stream order is not silently made global or per batch.

### U4. Consolidate roadmap, recipe and planning integration specifications

**Goal:** Make current foundation and integration rules readable in their existing issues.

**Requirements:** R1–R3/R7/R8/R10; KTD1/KTD5.

**Dependencies:** U1–U3.

**Files:** Candidate GitHub bodies #1–#17 and #33; no corresponding backlog files added to the repository.

**Approach:**
1. Consolidate roadmap/architecture and recipe/quantity addenda in #1–#3/#13–#17/#33, separating target migration, approved historical recipe values, scaling and saved plans.
2. Consolidate #4/#5 balance/returns and explicit cost-allocation rules; preserve #6/#7/#9/#11 incremental adapters and approval boundaries.
3. Assess #8/#10/#12 for owner/dependency references and retained exclusions, with no speculative functional expansion.
4. Apply KTD5 without turning optional forecasting/CAPP/B2B/#29 integrations into cyclic start prerequisites; retain epic-level presentation where appropriate.

**Patterns to follow:** Existing #33 plan/version boundary and #13 → #16 → #14 → #15/#17 migration route.

**Test expectation:** none — candidate issue prose only.

**Verification:** AE1; #4 `AC-BAL-*`, #5 `AC-LAB-01`, #14/#15/#17 `AC-HIST-*`, #16 `AC-MIG-01` and all other baseline IDs survive. Forecast, plan, schedule and execution retain different owners; #33 does not claim resource feasibility.

### U5. Consolidate production, workforce and map specifications

**Goal:** Align functional parents, children and data consumers without changing capabilities.

**Requirements:** R1–R3/R6–R10; KTD1/KTD4/KTD5/KTD6.

**Dependencies:** U1–U3; coordinate shared references with U4.

**Files:** Candidate GitHub bodies #18/#19, #26–#32 and #34–#43; supporting corrections to `docs/workforce-planning.md` only if U3 references need adjustment.

**Approach:**
1. Fold #18/#19 event, labor, correction and live-fact amendments into their effective sections; preserve #34–#37 child boundaries and IDs.
2. Consolidate #26–#29 workforce/plan/source rules and #38–#40 references; distinguish planned availability, operational attendance and allocated person-minutes.
3. Consolidate #30–#32/#41–#43 projection, layout/renderer, source freshness and aggregation rules. Preserve incremental demo/live capability and explicit unknown values.
4. Retain native parentage and every integration AC under its original issue even when another owner supplies the rule. Parent AC remain integration obligations, not new duplicate implementations.

**Patterns to follow:** Existing native children; #18 `AC-CONTRACT-*`, #28 `AC-DST-*`/`AC-BREAK-*`, #32 `AC-BOUNDARY-01`, #42 source semantics.

**Test expectation:** none — semantic and link review of documentation.

**Verification:** AE2/AE3; start/stop is not transfer/occupancy, layout never changes quantities/time, and anonymous counts never imply unique people. #42 demo can be prepared without a live backend; complete live quantities/resources depend on #35/#36.

### U6. Preserve assurance and design controls across the synchronized backlog

**Goal:** Keep all release, security, legal and design obligations effective after consolidation.

**Requirements:** R1–R3/R5/R7/R10; KTD1/KTD5/KTD8.

**Dependencies:** U2–U5.

**Files:** Candidate GitHub bodies #20–#25; review all U4/U5 candidate controls against `docs/engineering-assurance.md` and `docs/design-system.md`; conditional source-pointer corrections only.

**Approach:**
1. Consolidate #22 correction/history and #24 ruleset-enforcement amendments into the appropriate existing sections.
2. Preserve every NFR/SEC/REL/LAW/GATE/UI ID, AC, release stage, legal limitation, retention qualification and data-isolation control across all issue groups.
3. Keep P0 for real accounts/data distinct from synthetic PoC, P1 for M1 integrity, and P2/high-risk review. Preserve actual enforcement as required work, not merely green CI.
4. Replace duplicated generic policy text only where a specific live source link retains the obligation and local applicability; keep issue-specific controls and evidence requirements explicit.

**Patterns to follow:** Proportional assurance policy and existing #24 enforcement AC; Payload Admin styling exception in #25.

**Test expectation:** none — no controls are implemented by this unit.

**Verification:** Every baseline security/legal/exclusion paragraph has a reviewed destination; retained links do not weaken applicability. No sentence declares certification, law compliance or activated CI/rulesets as the result of this edit.

### U7. Verify repository documents and all candidate issue bodies

**Goal:** Catch broken references and changed meaning before publication.

**Requirements:** R1–R10; KTD8.

**Dependencies:** U2–U6.

**Files:** All modified/new Markdown documents and template; temporary check outputs, original/candidate issue bodies and preservation ledger.

**Approach:** Apply the Verification Contract to the complete candidate set, fixing errors in their owning sections. Keep per-issue dispositions for all 43, including justified no-op cases, in normal review evidence rather than creating a permanent repository backlog mirror.

**Test expectation:** none — temporary document checks and human/agent semantic review are adequate for this change.

**Verification:** No missing local targets/anchors, missing/renamed qualified IDs, unaccounted original rules, contradictory live appendices, unexplained reference differences or invented decisions remain. Cold-read success criteria pass.

### U8. Deliver repository docs and synchronize GitHub through the orchestrator

**Goal:** Publish the checked effective instructions with working links and verifiable remote bodies.

**Requirements:** R1–R3/R10/R11; KTD7.

**Dependencies:** U7; orchestrator push/open-PR and issue-mutation authority, remotely accessible pinned documentation targets, and the actual PR URL. No merge authority or merged targets are required.

**Files:** Published repository documentation from U2/U3/U6; existing GitHub issue bodies from U4–U6 and narrowly permitted history comments under the Consolidation Rules.

**Approach:**
1. Push the checked documentation revision and open its PR without merging, then execute KTD7's commit-target and body preflights.
2. Publish source owners before consumer body batches, using pinned commit references and a shared-reference section with the actual pending PR URL. Preserve GitHub metadata/native relationships and issue checklist state.
3. Reconcile changed sources and rerun affected preservation checks rather than overwriting them. Retain original/candidate/readback evidence until all intended bodies are verified.
4. Complete all six directions, including issue synchronization, in this execution run and report the open PR alongside verified publication outcomes.

**Test expectation:** none — exact readback, concurrency and link checks replace product tests.

**Verification:** AE4; all 43 dispositions reconcile, all intended writes match candidate bodies exactly, and each history link resolves. Every new documentation target resolves at its recorded full pushed commit SHA, including linked document targets/anchors; each affected shared-reference section includes the actual pending PR URL and unambiguous issue authority. The PR remains open, pinned links remain valid, and no merge or postmerge rewrite is required. Any residual issue is reported by number; partial publication is not called complete.

---

## Verification Contract

### Current Repository Commands

The manifest currently defines the following commands; their existence is not evidence they have been run or passed.

| Script | Current purpose | Applicability to this refactor |
|---|---|---|
| `npm run dev` | Vite development server, port 3000 | Document as current local workflow |
| `npm run build` | Vite production build | Document as build prerequisite for production start |
| `npm run start` | Node entry at `.output/server/index.mjs` | Document as production start, not first-time dev setup |
| `npm run serve` | Vite preview | Distinguish preview from development/production start |
| `npm run test` | `vitest run` | Existing product tests; no new tests required for this prose-only change |

No `lint`, `typecheck`, security-gate or `release:validate` npm script is present.
Do not add or claim them in this refactor; their future delivery remains #24.
No application build/runtime/browser suite is required for unchanged product code.

### Deterministic Document Checks

Use an existing available Markdown-aware checker or a temporary scratch checker; do not add dependencies, package scripts or a checking framework to the repository.
The implementation result must identify the checker/version or temporary procedure, reviewed revision, scanned files, outcomes and any deliberately excluded links.

1. Scan changed Markdown, the template, and local Markdown documents that link to changed paths/headings. Parse inline/reference links and images outside code fences, including fragment-only links.
2. Resolve paths relative to the containing document, percent-decode URL paths/fragments, verify file existence and anchor targets, and handle GitHub heading slug punctuation/Unicode/duplicate suffixes. Match explicit anchors if present. Report each failure as source file, target and reason; uncertainty is unresolved, not a pass.
   Validate against the intended shipped file set as well as the local filesystem: an untracked or deliberately unstaged file cannot satisfy a staged document's dependency. Source-path provenance in code form is not a navigable dependency.
3. Classify placeholders in the unfilled issue template and literal issue references separately from real Markdown links. Do not treat a template slot as a live URL.
4. Compare original/candidate qualified REQ/AC sets exactly; compare additional named control families and repeated ID occurrences. An original repeated heading/reference is not a second requirement; preserve all distinct meanings if one ID occurs in several normative statements.
5. Use the U1 ledger to account for every original normative paragraph, including unnumbered source ownership, formula, access rule, exclusion and release gate. ID equality alone cannot establish semantic equivalence.
6. Search candidates for dated clarification/additional-rule headings and compare all surviving occurrences semantically. No contradictory live layer may remain; a marked, linked historical record is permitted.
7. Verify every glossary/example citation exists under its owning issue and agrees with its AC. Recompute exact example arithmetic from its stated inputs without deciding new precision/order policy.
8. Before remote issue edits, verify every new documentation URL against the full pushed commit SHA, including file contents, anchors and the linked local-document closure at that revision. Verify the actual open PR URL and pending-merge disclosure separately. Do not substitute moving branch links or require `main` availability. Pinned links are durable provenance and remain valid after merge without rewriting. Verify issue/history links separately; external legal URLs are retained provenance, not newly certified legal advice.

### Minimum Reference Coverage

| Domain table | Required source | Expected observation and qualification |
|---|---|---|
| Scaling and percentage presentation | #17 `AC-01`–`AC-11`; #14/#17 `AC-HIST-01` | 5 × 800 g = 4000 g baseline; 10/15/20/30 → 8/12/16/24 kg; 10 → 30 → 10 invariant; starter flour counted once; historical composition unchanged |
| Production labor and allocation | #18 `AC-04`/`AC-05`; #34 `AC-02`; #5 `AC-LAB-01`; #43 `AC-01`/`AC-02` | 30 × 2 = 60 person-minutes; 10 × 1 + 20 × 2 = 50; 30 minutes split 50/50 = 15 + 15, not 30 + 30; anonymous counts do not prove unique people |
| Workforce time and breaks | #28 `AC-DST-01`–`AC-DST-03`, `AC-BREAK-01`; #27 `AC-04` | Warsaw nights 2026-03-28/29 = 7 h, 2026-10-24/25 = 9 h, 2026-11-17/18 = 8 h; test break yields 7.5/7.75 h and +0.25 h, not a universal legal rule |
| Event projection and source freshness | #18/#30 `AC-CONTRACT-01`; #42 `AC-01`–`AC-03` | Equivalent normalized manual/simulation events project equally; four quiet hours with successful reads remain current; loss/reconnect never invents/replays duplicate transfers |
| Quantity/resource/correction distinctions | #35 `AC-01`–`AC-04`; #36 `AC-01`–`AC-03`; #37 `AC-01`–`AC-03` | 20 − 0.5 − 19.5 = 0 kg; no implicit kg/piece conversion; 12 + 12 exceeds capacity 20; correction to 20 min × 2 = 40 person-minutes or rejection on dependent conflict |
| Plan versus execution | #33 `AC-01`–`AC-04`; #29 `AC-DEP-01` | Approved v1 remains input while v2 is draft; no automatic batch creation, feasibility claim, purchase sending or schedule publication |
| Stock balance and physical returns | #4 `AC-BAL-01`–`AC-BAL-03` | 10 + 20 − 15 = 15; two nonsaleable physical returns give physical 17/saleable 15, disposal returns physical to 15; refund alone changes no physical stock |

Add a short literal Polish UI-state subsection linked to relevant #15/#19/#25/#31/#42 AC: for example `Autoliza trwa` (#19 `AC-01`), `SYMULACJA` (#31 `AC-07`) and `brak aktualnych danych` (#31 `AC-06`).
Where a source requires a loading/empty/error/accessibility state without exact wording, label any proposed Polish wording as illustrative rather than silently binding new acceptance copy.
This is documentation of UI expectations, not application translation work.

### Semantic Review and Failure Scenarios

- Covers AE1. Move additional #17 criteria into the main lists: every identifier and the simultaneous percentage/mass/flour-total requirement still exists under #17.
- Covers AE2. Trace #41/#42 fixture demonstration, partial live activity, and full quantity/resource support: each has explicit contract/prerequisite/release distinctions.
- Covers AE3. Review #28 examples and the open precision/order records: none closes an undecided policy or removes a legal qualification.
- Covers AE4. Compare a changed remote body against its baseline: skip publication of that candidate until reconciled; preserve verified independent results.
- Review a simulated failed readback as a publication scenario: report the actual mismatch rather than claiming success or blindly restoring stale content.
- Trace publication with the PR still pending: verified pinned targets permit completing issue synchronization without merge, while an inaccessible commit target blocks its affected issue edit before mutation.
- Review a shipped checkout without the untracked origin HTML: the embedded six-direction contract remains sufficient, and no staged document contains a navigable link or required input dependency on that file.
- Follow the cold reading route from both AGENTS and GEMINI; verify neither requires an agent to read the full backlog to find a selected child's applicable source owners.

---

## Definition of Done

- All six approved ideas map to active work: idea 1 → U1/U4–U8; idea 2 → U2/U3; idea 3 → U2; idea 4 → U3/U7; idea 5 → U2/U4–U6; idea 6 → U3/U5.
- U1–U7 satisfy their local verification outcomes and all deterministic/semantic checks in the Verification Contract.
- Every issue #1–#43 has a reviewed disposition, with qualified ID/control/exclusion preservation and no contradictory effective appendix.
- Source owners and existing functional parents/children remain identifiable; no backlog relocation or invented dependency cycle is introduced.
- Open domain decisions remain explicitly unresolved and block only the behavior that depends on them.
- U8 satisfies KTD7 in the same execution run: checked docs are pushed with an open PR, all intended issue writes have exact-body readback, and pinned targets plus pending-PR disclosures are verified. No merge or removal/rewrite of pinned references is required; otherwise the orchestrator reports the specific outstanding issue numbers and publication state.
- The origin HTML remains unchanged and unstaged. No product code, new prose tests, unwanted generated tools, temporary snapshots or abandoned checking experiments enter the repository diff.
- No staged document relies on the origin HTML being shipped; source-path provenance is non-navigable and the accepted six directions are embedded in this plan.
- Documentation changes do not claim deployed features, active gates, passed product tests, legal certification or automatic approval authority.

---

## Appendix

### Sources

- Source-path provenance only: `docs/ideation/2026-11-17-agent-usable-documentation-ideation.html` is user-owned, untracked input preserved unstaged. Its six accepted directions are embedded in R1–R9 and KTD1–KTD6: effective-rule consolidation, audience-specific language/glossary, thin agent entry, reusable domain examples, typed dependencies and explicit unresolved domain decisions. Scope Boundaries records the exclusions. Implementation does not require this file in a shipped checkout.
- [Specification rules](../specification-style.md), [implementation template](../../.github/ISSUE_TEMPLATE/implementation.md), [workforce domain](../workforce-planning.md), [assurance policy](../engineering-assurance.md), [design system](../design-system.md), [current commands](../../package.json), [current tool guidance](../../GEMINI.md) and [project entry](../../README.md).
- [Roadmap #1](https://github.com/slawinski/5ciastek/issues/1), [architecture #2](https://github.com/slawinski/5ciastek/issues/2), and existing issue bodies #3–#43 in the same repository. U4/U5/U6 partition the complete 43-issue set without requiring a second backlog store.
- [Recipe model #14](https://github.com/slawinski/5ciastek/issues/14), [scaling #17](https://github.com/slawinski/5ciastek/issues/17), [event owner #18](https://github.com/slawinski/5ciastek/issues/18), [release enforcement #24](https://github.com/slawinski/5ciastek/issues/24), [DST/breaks #28](https://github.com/slawinski/5ciastek/issues/28), [saved plan #33](https://github.com/slawinski/5ciastek/issues/33), [source freshness #42](https://github.com/slawinski/5ciastek/issues/42).

### Unresolved Implementation Dependencies

No domain decision blocks starting the documentation refactor.
Persisted mass precision and stream partition/order remain open product-contract decisions to record, not solve, in U3.
Remote publication depends on orchestrator push/open-PR and issue-mutation authority, accessible history provenance, unchanged/freshly reconciled bodies, verified immutable pushed-commit targets and the actual pending PR URL. Merge is neither authorized by LFG nor a dependency; inability to meet the stated preflight conditions blocks the affected publication, not unrelated local consolidation.
