# ASS — Engineering assurance delivery

Existing [assurance policy](../engineering-assurance.md) owns controls; [design system](../design-system.md) owns UI. Tasks below deliver bounded evidence/controls, not a seventeenth spec or a claim of installed CI/compliance. [Common task/evidence contract](README.md#task-contract). P0 before actual accounts/data, P1 before actual event recording, P2 before the particular high-risk use, not mandatory giant release buckets.

## Source-control-ownership

| Historical source | Existing owner / bounded delivery |
|---|---|
| #20 NFR-01–07 / risk matrix / proportionality / DoD | [Artifacts](../engineering-assurance.md#artefakty-przed-implementacją), [levels](../engineering-assurance.md#poziomy-wdrożenia), [nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki); TASK-ASS-001 and the scoped tasks below |
| #21 SEC-01–05 / AC-01–06 / API surfaces/session/secrets | [Feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji); TASK-ASS-002 |
| #22 REL-01–06 / AC-01–07 / AC-CORR-01–02 | [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki), [feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji); TASK-ASS-003/004; REC-REQ-001 and EVT-REQ-002 own domain outcomes |
| #23 LAW-01–05 / AC-01–05 / worker/time/AI/camera controls | [Legal register](../engineering-assurance.md#rejestr-decyzji-prawnych), [feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji); TASK-ASS-005/008 |
| #24 GATE-01–05 / AC-01–06 / AC-ENFORCE-01–02 | [Release criteria](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania); TASK-ASS-006 |
| #25 UI-01–05 / AC-01–06 | [Component rules](../design-system.md#3-zasady-budowy-i-rozwijania-biblioteki), [UI criteria](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui); [TASK-REC-007](recipes.md#task-rec-007) and each changed-screen proof |

## Data-boundaries

Source #2 is delivered incrementally, not a global company schema gate. Recipe/ingredient/publication/scaling data belongs to TASK-REC-003/005. Resource configuration/source/unit/availability is implemented with TASK-INV-001 or TASK-OBS-004, actual occupancy only OBS. ProductionPlan/version belongs to TASK-PLN-001; ShiftPlan/WorkSession/anonymous LaborSegment to TASK-WRK-001/004 and TASK-OBS-001. Ingredient lots/stock/sale/loss/stockout belong to TASK-OPS-001/003, historical prices/costs to TASK-OPS-002, B2B identity to TASK-B2B-001/002. Their stable identifiers, units, event/entry timestamps, version and provenance are required consumer data contracts, not mandated tables/endpoints. TASK-ASS-007 demonstrates the chosen batch lineage when its sources exist. Architecture/ADR and behavior-preserving UI migration stay TASK-REC-001/002. U8 updates old guide routes; it does not relocate approved plan storage into scaling.

### TASK-ASS-001

**Actor/goal/flow:** implementer and owner select one bounded feature, classify data/owners/actors/trust, review threats and risk, map requirement → threat → test/evidence → owner, and choose proportionate P0/P1/P2 controls before coding. Adapt regression baseline, recovery, destructive-operation safety, change history and dependency provenance practices, not wholesale infrastructure. **Coverage:** #20 proportionality/workstreams/NFR-01–07/DoD; #2 process/data/API/observability planning. Inputs: selected capability/task; exclusions: ISO/OWASP certification/full HA/global schema. Process map includes preparation, ferment, divide, shape, cool, bake, package, deliver, sell, loss.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [Policy artifacts](../engineering-assurance.md#artefakty-przed-implementacją) | Data class, owners, read/write/approve rights, trust/validation, error/retry/partial success, persistence recovery, legal reviewer | start |
| release-gate | [Policy release](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Reviewed matrix/risks/owner/date, exceptions and applicability, not certification | release |

**State:** not-started. **Readiness:** process applicable now; selected feature implementation not inventoried. **Decision gates:** none beyond actual selected domain decisions. **Proof:** feature-specific matrix and executable P0 work, P1 failure and P2 camera/food/AI boundaries; source law states confirmed/analysis/not applicable, no fake compliance. Evidence: none.

### TASK-ASS-002

**Actor/goal/flow:** administrator/editor/baker/unauthenticated actor exercise one recipe's edit/publish/unpublish/history/private-read API paths; authorized succeeds and denied cannot bypass UI/server. **Coverage:** #21 TODO1–9, SEC-01–05, AC-01–06; #20 NFR-01/03/06. Inputs: threat model with users/assets/attackers/flows/entry points/risks/controls and actor matrix. Test every available REST/GraphQL/server action/Local API surface, including Local API access override with explicit server actor authorization (`overrideAccess: false` with user context or equivalent tested mechanism). Sessions/cookies/CSRF, input sizes/server validation and login rate limits must fit chosen operations; secrets outside repo/log/frontend; sensitive personal logs prohibited. Select applicable ASVS, security update/vulnerability response; not full pentest/multitenant IAM/certification.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-001](recipes.md#task-rec-001), [Feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji) | Chosen trust/API boundary, matrix can precede code | start |
| release-gate | [REC-REQ-006](../specs/recipes.md#rec-req-006) | Real endpoints must exist for actual denial evidence, not whole catalog as start blocker | release |

**State:** not-started. **Readiness:** matrix/threat work can start; real API tests pending actual endpoints. **Decision gates:** none invented; access matrix scoped under policy. **Proof:**anon no create/edit/publish;readonly baker publication notdraft/admin;direct API deny;Local API no bypass;bad token/no session/wrong role no leak;threat owner/open risks/date;all actual surfaces and input/session/secrets checks. Evidence: none.

### TASK-ASS-003

**Actor/goal/flow:** recovery owner backs up one recipe dataset/media, tests controlled migration on a copy, injects failure, restores to separate nonpublic isolated DB and checks frozen versions/relationships. **Coverage:** #22 P0/REL-01–03/06, AC-01–04/07; #24 GATE-04/05 and migration-isolation AC. Include DB/files scope/owner/frequency, RPO/RTO after operational analysis not invented SLA, backup before migration/rollback, test-production separation; destructive reset/migration refuses production/unknown/unconfirmed target. Logs omit secrets/sensitive data. UI never success before server confirms.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki) | Full frozen values not only ingredient IDs; procedures may be prepared before delivery | start |
| release-gate | [TASK-REC-003](recipes.md#task-rec-003) | Actual dataset/DB/media needed for restore proof, not a reciprocal implementation edge | release |

**State:** not-started. **Readiness:** policy known, operational analysis/actual drill unverified. **Decision gates:** DEC-001 only dependent mass representation. **Proof:**v1 survives draft/source edit, restore recipes/ingredients/relations/history+files;production/ambiguous reset refuses before mutation;write failure visible;isolated migration failure leaves other DB untouched;restore result owner/date/code SHA, dump success alone insufficient. Evidence: none.

### TASK-ASS-004

**Actor/goal/flow:** operator on two devices records a bounded batch, experiences timeout/network loss/restart during active fermentation, safely retries or uses documented manual fallback and sees one coherent history; corrector updates with reason or receives atomic dependency conflict. **Coverage:** #22 P1/REL-04–05/AC-05–06/AC-CORR-01–02; #20 NFR-02/04; #24 P1. Domain acceptance owned by EVT, not repeated here. Include server-clock/correction semantics while retaining occurredAt≠recordedAt, error monitoring, no unbounded audit retention or false success; no multi-region/100%uptime promise.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](production-recording.md#task-obs-001), [TASK-OBS-002](production-recording.md#task-obs-002) | Actual event/correction paths for authoritative fault demonstration; procedures earlier | demonstration |
| contract-input | [EVT-REQ-002](../specs/production-records.md#evt-req-002), [EVT-REQ-008](../specs/production-records.md#evt-req-008) | Atomic correction/idempotency/concurrency | start |
| release-gate | [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki) | Recovery/failure/manual-procedure evidence before actual recorder release | release |

**State:** blocked. **Decision gate:** DEC-002 persistent stream semantics; DEC-001 only corrected masses. **Readiness:** faults specified, persistent contracts unresolved. **Proof:**same start once,two devices no contradictory state;late-entry two times;30min×2→20min/40person-min same card/map history;later transfer/segment/resource conflict atomic;network/restart no fictitious confirmations, no ignored already-existing dependencies. Evidence: none.

### TASK-ASS-005

**Actor/goal/flow:** responsible data/legal reviewer inventories one actual deployment's fields/receivers, sets purpose/legal basis/minimum/access/retention/security/subject-information/request handling, tests authorized export/removal/anonymization without blindly deleting legally retained records and records review status/evidence/date. **Coverage:** #23 P0/LAW-01–05/AC-01–03; worker scheduling/individual-time/HR-document applicability and applicable rest/time sources; #20 NFR-06. Include controllers/processors/required agreements, accounts/logs/audit/events, minimal counts unless identities justified. Technical history is not forever personal retention. Rule/document version identifiable when audit needs it. Review on new data/device/recipient, including AI. Not legal opinion/certificate, no invented retention or universal labor norm.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [Legal register](../engineering-assurance.md#rejestr-decyzji-prawnych), [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Source/scope/application/owner/measure/evidence/status/review date | start |
| release-gate | [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki) | No personal collection before review, purpose/minimum/rights verified for chosen deployment | release |

**State:** not-started. **Readiness:** fields/deployment/qualified reviewer still needed. **Decision gates:** legal and runtime qualifications under existing policy, not product-wide defaults. **Proof:**every initial personal field basis/access/retention,identify anonymous alternatives,no collecting employee identity for speculative ML,formal attendance not inferred from operational sessions/LaborSegment;actual subject/export/removal tests with legal retention boundaries. Evidence: none.

### TASK-ASS-006

**Actor/goal/flow:** release owner runs repeatable target-stack install-from-lockfile/lint/types/unit/build/smoke in isolated targets, records SHA/environment/date/scope/results/omissions, activates main ruleset/protection with concrete required checks and demonstrates ordinary merge is blocked by a failing check on current SHA, without merging test PR. **Coverage:** #24 TODO/P0/P1/GATE-01–05/AC-01–06/AC-ENFORCE-01–02, #20 NFR-05. Review CI token permissions, dependency/lock provenance, secrets/known-vulnerability scans and proportionate response (not every warning an automatic blocker); sanitized reports/no actual customer-worker data; immutable previous failures/omissions and owner/justification/review-date deviations. Release checklist: restore/migration/smoke/rollback/decision owner. No heavyweight copied capsule/hash-ledger framework.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-001](recipes.md#task-rec-001), [Policy release](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Stage-specific commands/check names, scopes/threats before actual activation | start |
| release-gate | [TASK-ASS-003](#task-ass-003), [TASK-ASS-002](#task-ass-002) | Real-data release needs restore/access evidence; synthetic docs/PoC not proof | release |
| release-gate | [Policy release](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Actual checks + repo permissions/plan/ruleset activation required for enforcement; lack of activation blocks this control | release |

**State:** not-started. **Readiness:** commands/checks/ruleset/permission evidence unverified, no installed-gate claim. **Decision gates:** no fabricated domain decision; activation feasibility an actual future release qualification. **Proof:**failed type/test PR normal merge denied, fixed checks bound currentSHA;ruleset ID/config/bypass/exceptions and attempt report;login/deny/publication/history/scaling/validation;domain regressions physical returns/frozen starter/correction/no double labor/DST/source freshness as changed scope requires;deterministic isolated fixture,truthful live/sim/no stale motion,SCN operative/financial/unknown distinctions. Skipped/no-result≠pass;executable checks not markdown-only where testable. Evidence: none.

### TASK-ASS-007

**Actor/goal/flow:** operator/analyst follows one real batch from raw lot/supplier through immutable recipe/scaling, approved plan and independent shift, recorded operations/resource/loss, ready output/sales and traceable cost; identifies the single source of each fact and completeness gaps. **Coverage:** #2 entities/process map/API/observability/KPI/DoD/AC-DOM-01; #23 traceability when used for that purpose. This is later integration proof, not a global data-model-first gate or another source-of-truth engine. API/data contracts and minimal error observability must be documented alongside each selected producer. POS/accounting/sensor adapters prefer existing integrations; source-specific offline/manual/recovery behavior is planned at its actual boundary, not a new blanket offline application mandate.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-003](production-recording.md#task-obs-003), [TASK-OPS-002](operational-balances.md#task-ops-002), [TASK-OPS-003](operational-balances.md#task-ops-003), [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](workforce.md#task-wrk-001) | Full single-batch lineage demonstration only; their own starts independent | demonstration |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001), [WRK-REQ-001](../specs/workforce.md#wrk-req-001), [STK-REQ-004](../specs/stock-inventory.md#stk-req-004), [ECO-REQ-003](../specs/economics-investment.md#eco-req-003) | Stable IDs/units/times/versions/prices/provenance, plan≠actual≠scenario, geometry not facts | start |
| optional-adapter | [B2B-REQ-007](../specs/b2b-orders.md#b2b-req-007), [QLT-REQ-005](../specs/quality-monitoring.md#qlt-req-005) | Order/device lineage only when included in chosen example | demonstration |

**State:** not-started. **Readiness:** source contracts known, combined real facts not inventoried. **Decision gates:** DEC-001/002 at actual storage/replay boundaries. **Proof:**one batch raw/work/cost/output links and completeness/correctness metric;plan→scale→shift→actual single owner each without #7/#11/#29 cyclic start;missings visible, versioned contract/API and scoped error logs, ADR reference;no automatic plan creation by scaler. Evidence: none.

### TASK-ASS-008

**Actor/goal/flow:** food-safety/privacy/AI responsible reviewer selects one high-risk use, maps it to actual plant procedure/legal sources, records responsible human, version/approval/retention and evidence, exercises fault/manual fallback and admits or refuses that particular use. **Coverage:** #20 P2/NFR-07/DoD; #23 HACCP/traceability/worker-camera/AI/LAW-03–05/AC-04–05; #10 procedure/network/calibration/manual-test controls; #12 bounded AI disclosure. Assess camera purpose/necessity/proportionality/information/access/retention/DPIA where applicable; employee identification/evaluation never enabled merely because technically possible. Human counts alone where identity unnecessary. Operational app ≠ legally required plant procedure; sensor/AI estimate ≠ approved HACCP result, automation cannot decide worker appraisal/food safety. Review new device/data/receiver. Separate value review for optional CV; not certification.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [Legal register](../engineering-assurance.md#rejestr-decyzji-prawnych), [Feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji) | Actual procedure/application and appointed responsible domain reviewer | start |
| release-gate | [QLT-REQ-006](../specs/quality-monitoring.md#qlt-req-006), [QLT-REQ-007](../specs/quality-monitoring.md#qlt-req-007) | Only selected food/device use needs its real report/fault tests, not every other P2 module | release |
| release-gate | [AST-REQ-005](../specs/owner-assistant.md#ast-req-005), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Only selected real AI disclosure needs filtered/redacted payload/processing approval | release |

**State:** not-started. **Readiness:** per-deployment procedures/approver/input profiles pending, no invented universal policy. **Decision gates:** actual legal/procedure review, not a new global product DEC. **Proof:**camera use blocked until confirmed legal/organizational actions;procedure/document version/human approver path,network/bad reading/calibration/manual trial evidence;AI redaction failure no send;technical pass alone never compliance/safety approval. Evidence: none.
