# PLN — Zapis i zatwierdzanie produkcji

Owner: [PLN](../specs/production-plans.md). [Common task/evidence contract](README.md#task-contract).

### TASK-PLN-001

**Cel/przepływ:** piekarz wybiera publikację, 20 sztuk i jednoznaczny termin; zapisuje/otwiera szkic z masami; kierownik zatwierdza P/v1; szkic v2=30 nie zmienia odbiorcy v1; zatwierdzenie v2 zachowuje historię v1.

**Coverage:** PLN-REQ-001–004, PLN-REQ-007–008 / PLN-AC-001–003, PLN-AC-006–007. Inputs: plan/line IDs, publication, positive integer szt, g/kg, plant timezone/ready instant. Bez solvera, shift publish, WorkSession, partii lub purchase dispatch.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-005](recipes.md#task-rec-005) | Działające wybieranie wersji i skali dla operational save | demonstration |
| contract-input | [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [REC-REQ-001](../specs/recipes.md#rec-req-001) | Approval identity ≠ wykonanie | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Permissions/history/retry/conflict/restore/UI | release |

**State:** not-started. **Decision gate:** DEC-001 przed zależnym trwałym skalowaniem/masami. **Readiness:** contract specified; input provider i dane bez dowodu. **Proof:** exact roundtrip/source version, zero/fraction/unpublished/DST ambiguous rejected, immutable approved20 vs draft30; failed source/save/read-only no mutation, unauthorized/concurrent approval no partial success; no shifts/purchases/execution. Evidence: brak.

### TASK-PLN-002

**Cel/przepływ:** kierownik przyjmuje datowaną propozycję do szkicu, ogląda analizę oznaczonego szkicu, odrębnie zatwierdza i przekazuje planId/version/pozycje do konsumenta. Eksport wymagający SKU z brakującym mapowaniem wskazuje linię i nie zgłasza pełnego sukcesu; MRP nie dostaje szkicu.

**Coverage:** PLN-REQ-004–008 / PLN-AC-002, PLN-AC-004–007. Inputs: proposal provenance/version, quantities/deadlines, SKU mappings. Bez automatycznej akceptacji/zakupów/zmian lub nowego rachunku.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](#task-pln-001) | Istniejący save/approval przed realnym handoff | demonstration |
| optional-adapter | [DEM-REQ-009](../specs/demand.md#dem-req-009), [OPT-REQ-010](../specs/optimization.md#opt-req-010), [WRK-REQ-018](../specs/workforce.md#wrk-req-018), [B2B-REQ-007](../specs/b2b-orders.md#b2b-req-007) | Fixture proposal wystarcza bez całych producentów | demonstration |
| optional-adapter | [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [ECO-REQ-005](../specs/economics-investment.md#eco-req-005) | Approved version receiver MRP/cost | demonstration |
| release-gate | [PLN-REQ-007](../specs/production-plans.md#pln-req-007), [PLN-REQ-008](../specs/production-plans.md#pln-req-008) | Access/provenance/source/error i wspólne UI/assurance | release |

**State:** not-started. **Decision gate:** DEC-001 tylko użyta persisted mass. **Readiness:** handoff contract complete, real adapters osobno. **Proof:** forecast30 nie zmienia approved20 bez wyboru/zatwierdzenia; receiver trzyma v1 do v2approved; brak SKU drugiej linii nie full success; receiver failure nie approval; brak auto grafiku/purchase/B2B. Evidence: brak.
