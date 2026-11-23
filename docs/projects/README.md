# Project delivery records

Start with the [portfolio](../product-plan.md), choose one task section below, then read its registered capability REQ/AC, [decisions](../decisions.md) and applicable policy. These project sections are the **only mutable task-state homes**. Neither this directory index nor the portfolio mirrors implementation statuses.

| Key | Project | Contract owners |
|---|---|---|
| REC | [Recipes](recipes.md) | REC; architecture/migration and UI delivery |
| INV | [Investment scenarios](investment-scenarios.md) | SCN, PRC, STK, ECO |
| OBS | [Production recording](production-recording.md) | EVT, PRC |
| PLN | [Production planning](production-planning.md) | PLN |
| WRK | [Workforce](workforce.md) | WRK, PRC |
| OPS | [Operational balances](operational-balances.md) | SAL, STK, ECO |
| MAP | [Flow map](flow-map.md) | MAP, EVT projection |
| DEM | [Demand](demand.md) | DEM |
| OPT | [Optimization](optimization.md) | OPT, PRC |
| FER | [Fermentation](fermentation.md) | FER |
| QLT | [Quality monitoring](quality-monitoring.md) | QLT |
| B2B | [B2B orders](b2b-orders.md) | B2B |
| AST | [Owner assistant](owner-assistant.md) | AST; SCN/ECO consumers |
| ASS | [Engineering assurance](engineering-assurance.md) | Existing assurance/design policies, not new capability owners |

## Task-contract

Coverage ranges in task sections are inclusive and **prefix-qualified**; resolve each ID at its ASCII heading in the [capability registry](../specs/README.md#capability-registry). Coverage denotes future implementation/proof responsibility, not product completion. Shared requirements may be exercised by several consumers but retain one normative owner. Engineering controls are linked to their existing policy owner and a bounded delivery task, not duplicated as a business spec.

Each task states actor/goal/flow, coverage, inputs/exclusions, typed dependencies, decision gates, implementation state, readiness and required proof. A task's entire flow includes relevant readback, errors and permissions, not just a UI/database layer. Before coding, inspect actual implementation and write its bounded technical plan. Quantitative test inputs are illustrative unless the spec explicitly says otherwise.

Dependency tables use `Type | Target | Scope / condition | Phase`. `parent` defines scope; `contract-input` defines semantics, not provider implementation; `optional-adapter` adds only a selected integration. Only `implementation-prerequisite` edges form the implementation DAG, including narrowly conditional edges at their named phase. A decision gate is separate, not a predecessor task. `release-gate` restricts the named real-data/risk boundary and never retroactively forbids an isolated fixture. A manual source can satisfy an input contract without the supplier application.

## Common-evidence

All task sections inherit this evidence contract; it is not a second task status. **Evidence references: none supplied** unless that section links independent evidence. No implementation inventory was performed in this documentation migration. Initially `not-started` is an evidence default; `blocked` is used only for a named open decision at the task's implementation boundary. Other prerequisites/readiness are explicitly scoped, not assumed delivered.

For completion attach artifact/PR/commit SHA, date, exact REQ/AC results, relevant functional/permission/error tests and skipped checks. Prove source/write failures are visible, denied access does not mutate/expose data and retries/concurrent writes preserve the contract where applicable. UI proof includes keyboard/focus, text states, mobile/desktop and production tablet, reduced motion where relevant. Record data class, actor read/write/approval rights, trust/validation boundary, persistence migration/recovery and required legal review. Real-data release requires risk-proportional [assurance](../engineering-assurance.md#artefakty-przed-implementacją) and [UI](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui) evidence, not merely a synthetic demonstration. Unknown prices, legal applicability, thresholds or source values remain qualified inputs, never invented defaults.

`done` requires those receipts. A spec or documentation check is not an application test. Pending postmerge [retirement](../migrations/spec-library/retirement.md) does not block authoring/PR delivery. Policy refinements awaiting U8 are explicitly reserved in [coverage](../migrations/spec-library/coverage.md#policy-handoff), not falsely resolved links.
