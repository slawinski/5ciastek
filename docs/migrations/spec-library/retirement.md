# Historical issue retirement handoff

## Gate

**PENDING — no issue has been commented on, closed or otherwise mutated by this migration.** No merge or automatic-merge authorization is implied. Local authoring and delivery of a PR do not wait for retirement. Replacements must first be reviewed, merged into the default branch by an authorized actor, and verified there. A branch URL or an unmerged commit does not satisfy this gate.

The [archive](source-baseline.json) is historical: 50 issues (#1–43, #45–51), 44 full comments; #44 is a PR. The [coverage ledger](coverage.md) explains clause-level replacements; the table below is the **retirement index**, not proof that every source clause was preserved or a duplicate task tracker. Product implementation evidence remains only in project task sections. Do not tick original product checkboxes or mark their product work completed because requirements moved.

## Verification-process

The caller/repository owner appoints the retirement actor. Before each closure that actor must:

1. Record the authorized merge PR and main merge SHA, actor and verification date. Verify that the replacement files and anchors are actually present on main, including U8 authority routes/policy anchors and final document verification. Preserve the source archive rather than rewriting it to match later changes.
2. Re-read the issue body, full comments and metadata using read-only GitHub access. Compare identities/body/comment hashes and update times with `source-baseline.json`. The capture has no capture timestamp and some comments have no update timestamp; do not invent either. Check additions, edits and newly accepted decisions, not merely issue state or total count.
3. If there is source drift, stop that affected closure, record the drift, and reconcile accepted new scope into local owners/tasks/coverage through normal review before proceeding. New issues outside the captured 50 require separate triage, not silent retirement under this batch. Unchanged issues may proceed only after their own checks.
4. Verify **every relevant replacement link and fragment** on the default branch, including the spec, project tasks, decisions and applicable policy. The local links below are candidates; form public links with `https://github.com/slawinski/5ciastek/blob/main/` plus their repo path and fragment only after verified merge. Do not claim an HTTP verification from a local link check.
5. Post a migration-only note listing the verified source-specific links, then close with the repository's **not planned / moved / superseded** interpretation (GitHub `not_planned` when applicable), not `completed`. If the interface offers only misleading completion semantics, resolve the retirement procedure with the caller instead of inventing feature completion.
6. Record the posted note URL, close event/reason, actor, date, observed main SHA, source-drift comparison and link-verification result as a retirement receipt. Re-read to verify publication. Do not maintain a second blocker graph or synchronize mutable product statuses to GitHub.

Suggested Polish note (fill only after verification):

> Wymagania i śledzenie realizacji tego zgłoszenia zostały przeniesione do repozytorium i zastąpione przez: [zweryfikowane specyfikacje, zadania, decyzje i polityki]. Zmiana została scalona do `main` w [PR/SHA]; odnośniki i zmiany źródła sprawdzono [data]. Zamykamy historyczne zgłoszenie jako przeniesione/zastąpione, **nie jako potwierdzenie implementacji funkcji**. Stan i dowody wykonania znajdują się wyłącznie w sekcjach zadań projektu. Pierwotne opisy i komentarze zachowuje archiwum migracji.

## Replacement-index

All rows inherit the gate above; no per-row mutable product status is stored here. Links are repo-relative and locally verifiable; **default-branch merge/public resolution remains unverified**. For a split source, include all applicable links in the actual note, not just the first file.

| Historical issue | Replacement links (specification and delivery) |
|---|---|
| #1 | [Portfolio](../../product-plan.md), [project registry](../../projects/README.md), [SCN](../../specs/scenarios-comparison.md), [INV](../../projects/investment-scenarios.md), [decisions](../../decisions.md) |
| #2 | [Data boundaries](../../projects/engineering-assurance.md#data-boundaries), [lineage task](../../projects/engineering-assurance.md#task-ass-007), [architecture](../../projects/recipes.md#task-rec-001), [migration](../../projects/recipes.md#task-rec-002) |
| #3 | [REC](../../specs/recipes.md), [EVT](../../specs/production-records.md), [OBS](../../projects/production-recording.md), [advanced-variant discovery](../../projects/recipes.md#task-rec-006), [gated advanced-variant delivery](../../projects/recipes.md#task-rec-008), [PLN](../../specs/production-plans.md) |
| #4 | [SAL](../../specs/sales-returns.md), [STK](../../specs/stock-inventory.md), [sales balance](../../projects/operational-balances.md#task-ops-001) |
| #5 | [ECO](../../specs/economics-investment.md), [actual SKU cost](../../projects/operational-balances.md#task-ops-002), [baskets](../../projects/operational-balances.md#task-ops-005) |
| #6 | [DEM](../../specs/demand.md), [DEM tasks](../../projects/demand.md), [PLN](../../specs/production-plans.md) |
| #7 | [OPT](../../specs/optimization.md), [PRC](../../specs/process-execution.md), [OPT tasks](../../projects/optimization.md) |
| #8 | [FER](../../specs/fermentation.md), [FER tasks](../../projects/fermentation.md) |
| #9 | [STK](../../specs/stock-inventory.md), [stock/FEFO](../../projects/operational-balances.md#task-ops-003), [approved-plan purchasing](../../projects/operational-balances.md#task-ops-004) |
| #10 | [QLT](../../specs/quality-monitoring.md), [QLT tasks](../../projects/quality-monitoring.md), [high-risk review](../../projects/engineering-assurance.md#task-ass-008) |
| #11 | [B2B](../../specs/b2b-orders.md), [B2B tasks](../../projects/b2b-orders.md), [DEC-004](../../decisions.md#dec-004), [DEC-005](../../decisions.md#dec-005) |
| #12 | [AST](../../specs/owner-assistant.md), [AST tasks](../../projects/owner-assistant.md), [growth](../../projects/investment-scenarios.md#task-inv-006), [SCN growth](../../specs/scenarios-comparison.md#scn-req-022), [ECO growth](../../specs/economics-investment.md#eco-req-016) |
| #13 | [Architecture spike and ADR](../../projects/recipes.md#task-rec-001) |
| #14 | [REC](../../specs/recipes.md), [publication/history](../../projects/recipes.md#task-rec-003), [DEC-001](../../decisions.md#dec-001) |
| #15 | [Catalog contract](../../specs/recipes.md#rec-req-007), [catalog task](../../projects/recipes.md#task-rec-004), [UI delivery](../../projects/recipes.md#task-rec-007) |
| #16 | [Behavior-preserving migration](../../projects/recipes.md#task-rec-002), [UI delivery](../../projects/recipes.md#task-rec-007) |
| #17 | [Scaling contract](../../specs/recipes.md#rec-req-002), [scaling task](../../projects/recipes.md#task-rec-005), [DEC-001](../../decisions.md#dec-001) |
| #18 | [EVT](../../specs/production-records.md), [PRC](../../specs/process-execution.md), [OBS](../../projects/production-recording.md), [DEC-002](../../decisions.md#dec-002) |
| #19 | [Recorder UI contract](../../specs/production-records.md#evt-req-014), [activity recorder](../../projects/production-recording.md#task-obs-001), [quantity](../../projects/production-recording.md#task-obs-003), [occupancy](../../projects/production-recording.md#task-obs-004), [correction](../../projects/production-recording.md#task-obs-002) |
| #20 | [Assurance policy](../../engineering-assurance.md), [risk/task ownership](../../projects/engineering-assurance.md#source-control-ownership), [risk matrix](../../projects/engineering-assurance.md#task-ass-001) |
| #21 | [Access policy](../../engineering-assurance.md#kontrole-zależne-od-funkcji), [access delivery](../../projects/engineering-assurance.md#task-ass-002) |
| #22 | [Integrity/recovery policy](../../engineering-assurance.md#nieprzekraczalne-warunki), [P0 recovery](../../projects/engineering-assurance.md#task-ass-003), [P1 integrity](../../projects/engineering-assurance.md#task-ass-004), [EVT corrections](../../specs/production-records.md#evt-req-002) |
| #23 | [Legal/privacy policy](../../engineering-assurance.md#rejestr-decyzji-prawnych), [privacy delivery](../../projects/engineering-assurance.md#task-ass-005), [high-risk delivery](../../projects/engineering-assurance.md#task-ass-008) |
| #24 | [Release policy](../../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania), [release evidence/enforcement delivery](../../projects/engineering-assurance.md#task-ass-006) |
| #25 | [Design system](../../design-system.md), [UI delivery](../../projects/recipes.md#task-rec-007), [migration](../../projects/recipes.md#task-rec-002) |
| #26 | [WRK](../../specs/workforce.md), [WRK tasks](../../projects/workforce.md), [KPI/parent proof](../../projects/workforce.md#task-wrk-007) |
| #27 | [WRK](../../specs/workforce.md), [manual shifts](../../projects/workforce.md#task-wrk-001), [backward estimate](../../projects/workforce.md#task-wrk-002), [concurrent staffing](../../projects/workforce.md#task-wrk-003) |
| #28 | [Individual time contract](../../specs/workforce.md#wrk-req-012), [attendance/export](../../projects/workforce.md#task-wrk-004), [legal applicability](../../specs/workforce.md#wrk-req-020) |
| #29 | [Recommendations](../../specs/workforce.md#wrk-req-016), [basic integration](../../projects/workforce.md#task-wrk-005), [comparison/adapters](../../projects/workforce.md#task-wrk-006), [PLN](../../specs/production-plans.md) |
| #30 | [MAP/demo](../../specs/flow-map-demo.md), [PRC](../../specs/process-execution.md), [fixture-to-map task](../../projects/flow-map.md#task-map-001) |
| #31 | [MAP](../../specs/flow-map-demo.md), [MAP tasks](../../projects/flow-map.md), [historical replay](../../projects/flow-map.md#task-map-003) |
| #32 | [Sole layout contract](../../specs/flow-map-demo.md#map-req-005), [layout invariants](../../specs/flow-map-demo.md#map-req-006), [fixture/geometry/renderer flow](../../projects/flow-map.md#task-map-001) |
| #33 | [PLN](../../specs/production-plans.md), [saved plan](../../projects/production-planning.md#task-pln-001), [proposal handoff](../../projects/production-planning.md#task-pln-002) |
| #34 | [EVT activity](../../specs/production-records.md#evt-req-004), [labor segments](../../specs/production-records.md#evt-req-005), [activity task](../../projects/production-recording.md#task-obs-001) |
| #35 | [EVT movements](../../specs/production-records.md#evt-req-011), [STK conservation](../../specs/stock-inventory.md#stk-req-001), [quantity task](../../projects/production-recording.md#task-obs-003) |
| #36 | [EVT occupancy](../../specs/production-records.md#evt-req-013), [PRC capacity](../../specs/process-execution.md#prc-req-002), [resource task](../../projects/production-recording.md#task-obs-004) |
| #37 | [EVT correction](../../specs/production-records.md#evt-req-002), [correction/replay task](../../projects/production-recording.md#task-obs-002), [DEC-002](../../decisions.md#dec-002) |
| #38 | [Manual shift contract](../../specs/workforce.md#wrk-req-004), [manual shift task](../../projects/workforce.md#task-wrk-001) |
| #39 | [Backward estimate contract](../../specs/workforce.md#wrk-req-009), [backward task](../../projects/workforce.md#task-wrk-002) |
| #40 | [Concurrent staffing contract](../../specs/workforce.md#wrk-req-011), [conflict task](../../projects/workforce.md#task-wrk-003) |
| #41 | [Shared renderer](../../specs/flow-map-demo.md#map-req-003), [fixture/renderer/list task](../../projects/flow-map.md#task-map-001) |
| #42 | [Source freshness](../../specs/flow-map-demo.md#map-req-012), [reconnect](../../specs/flow-map-demo.md#map-req-013), [live task](../../projects/flow-map.md#task-map-002) |
| #43 | [Aggregates](../../specs/flow-map-demo.md#map-req-014), [machine/plan scope](../../specs/flow-map-demo.md#map-req-015), [allocation](../../specs/flow-map-demo.md#map-req-016), [live dashboard task](../../projects/flow-map.md#task-map-002) |
| #45 | [SCN](../../specs/scenarios-comparison.md), [INV tasks](../../projects/investment-scenarios.md), [investment-first portfolio](../../product-plan.md#mvp-1) |
| #46 | [SCN inputs/save](../../specs/scenarios-comparison.md#scn-req-007), [connected scenario](../../projects/investment-scenarios.md#task-inv-001) |
| #47 | [PRC](../../specs/process-execution.md), [SCN run](../../specs/scenarios-comparison.md#scn-req-010), [connected scenario](../../projects/investment-scenarios.md#task-inv-001), [mixed week/windows](../../projects/investment-scenarios.md#task-inv-002) |
| #48 | [STK](../../specs/stock-inventory.md#stk-req-007), [SCN balances](../../specs/scenarios-comparison.md#scn-req-012), [mixed week](../../projects/investment-scenarios.md#task-inv-002) |
| #49 | [ECO](../../specs/economics-investment.md), [SCN finance](../../specs/scenarios-comparison.md#scn-req-015), [connected economics](../../projects/investment-scenarios.md#task-inv-001), [recurrence](../../projects/investment-scenarios.md#task-inv-003) |
| #50 | [ECO outlay/payback](../../specs/economics-investment.md#eco-req-012), [SCN investment](../../specs/scenarios-comparison.md#scn-req-017), [startup/payback task](../../projects/investment-scenarios.md#task-inv-004) |
| #51 | [SCN comparison](../../specs/scenarios-comparison.md#scn-req-018), [qualified results](../../specs/scenarios-comparison.md#scn-req-019), [two-variant task](../../projects/investment-scenarios.md#task-inv-005) |

## Receipts

Authorized merge: **not observed**. Main replacement verification: **not performed**. Fresh GitHub source-drift verification: **not performed**. Retirement actor: **not yet appointed**. Posted notes/closures: **none**. These pending receipts do not block local documentation authoring or separately authorized PR delivery.
