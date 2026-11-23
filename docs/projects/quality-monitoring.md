# QLT — Urządzenia, alarmy i decyzja człowieka

Owner [QLT](../specs/quality-monitoring.md). [Common evidence](README.md#common-evidence). Actual zakładowa procedura/threshold profile to kwalifikacja użycia, nie wymyślona polityka globalna.

### TASK-QLT-001

**Cel/przepływ:** operator monitoruje jedno krytyczne urządzenie wybrane analizą ryzyka, rozpoznaje sensor/network/calibration/range alarm, zapisuje przegląd/czyszczenie/naprawę/działanie z człowiekiem/dowodem i wiąże partię. **Coverage:** QLT-REQ-001–005, QLT-REQ-008 / QLT-AC-001–003, QLT-AC-004 (batch), QLT-AC-006. Inputs: rzeczywisty device/source, timestamps/°C/quality, selected procedure/version/alarm timing/recipient/calibration validity. Bez CV/AI/CAPP i HACCP certification.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001) | Product/batch identity bez whole schema gate | start |
| release-gate | [TASK-ASS-008](engineering-assurance.md#task-ass-008), [QLT-REQ-007](../specs/quality-monitoring.md#qlt-req-007) | Real device/fault/manual procedure evidence, human rights before release | release |

**State:** not-started. **Decision gates:** device/procedure profiles inputs before hardware demo, no global DEC. **Readiness:** fixture możliwy, actual hardware/procedure unverified. **Proof:**no green last-good after failure;four failure types separate;duplicate source once;ack≠remedy;maintenance/action author/time/evidence;unknown batch not guessed;denied approval/timeout nie success. Evidence: brak.

### TASK-QLT-002

**Cel/przepływ:** odpowiedzialny za bezpieczeństwo żywności czyta kompletny procedure-linked report i jawnie zapisuje decyzję po próbach awarii/manual procedure. **Coverage:** QLT-REQ-006–007 / QLT-AC-004 (review), QLT-AC-005. Inputs: actual approved procedure/role/version/closure rules; no automatic safety decision from data/AI/report completeness.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-QLT-001](#task-qlt-001) | Real log/alarm/action report | demonstration |
| release-gate | [TASK-ASS-008](engineering-assurance.md#task-ass-008), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | HACCP/traceability applicability, actual procedure/human approval; not certificate | release |

**State:** not-started. **Decision gates:** existing legal/procedure qualifications and appointed domain approver, not invented thresholds/global DEC. **Readiness:** contract specified, procedure/fault evidence absent. **Proof:**network08:00–08:20,invalid reading/calibration/manual trials;detect08:03 from08:00=3min;data-loss/loss/document completeness, no fictitious recovered samples;decision person/version/date and denied approval. Evidence: brak.

### TASK-QLT-003

**Cel/przepływ:** reviewer opcjonalnie porównuje crust color/size/shape/scoring z zatwierdzoną referencją i czyta auxiliary quality differences. **Coverage:** QLT-REQ-009 / QLT-AC-007. Inputs: selected image scope/human reference; monitoring działa bez CV. Bez worker identification/evaluation i autonomous safety.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| optional-adapter | [QLT-REQ-009](../specs/quality-monitoring.md#qlt-req-009) | Camera source, osobny scope selection | demonstration |
| release-gate | [TASK-ASS-008](engineering-assurance.md#task-ass-008), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Osobny value/necessity/proportionality/privacy/legal approval przed deployment | release |

**State:** not-started. **Decision gates:** optional adoption i legal review, nie global blocker innych QLT. **Readiness:** value/reference/permission inputs unverified. **Proof:**camera off log/alarms nadal działają;auxiliary incision difference nie approval;no deployment without distinct review, no workers assessed. Evidence: brak.
