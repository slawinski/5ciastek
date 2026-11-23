# OPT — Harmonogram solvera

Owner [OPT](../specs/optimization.md), constraints [PRC](../specs/process-execution.md). [Common evidence](README.md#common-evidence). Solver ograniczeń obowiązkowy; OR-Tools jest przykładem, nie wybranym pakietem. Nie LLM.

### TASK-OPT-001

**Cel/przepływ:** planista wybiera ręczny plan/dostępność dla chleba i drożdżówek,1/2 pracowników i pieca; solver przedstawia wersjonowaną propozycję lub precise conflicts/qualifications. **Coverage:** OPT-REQ-001–005 / OPT-AC-001–005. Inputs: wersje/termimy/operacje/skills/przerwy i applicable rest, jednostki capacity/temperatures/setup/night/windows. Nie potrzebuje DEM/B2B/WRK-recommender ani actual recorder.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](workforce.md#task-wrk-001) | Operational manual inputs dla connected demo, fixture wcześniej | demonstration |
| contract-input | [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [PRC-REQ-002](../specs/process-execution.md#prc-req-002), [PRC-REQ-003](../specs/process-execution.md#prc-req-003), [REC-REQ-001](../specs/recipes.md#rec-req-001) | Jeden model czasu/zasobów/okien i wersji | start |
| optional-adapter | [DEM-REQ-009](../specs/demand.md#dem-req-009), [B2B-REQ-007](../specs/b2b-orders.md#b2b-req-007), [WRK-REQ-024](../specs/workforce.md#wrk-req-024) | Wybrane rozszerzenia | demonstration |
| release-gate | [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Real-day validation przed operational feasibility claim | release |

**State:** not-started. **Decision gates:** cel/priorities/weights jawne w bounded planie i danych; outcome feasible/infeasible/unresolved/proven optimum już określony, nie nowa DEC. **Readiness:** wybrać funkcję celu i source inputs, nie zmyślać dopuszczalnych overtime ani global optimum. **Proof:**concurrent skills conflict;24/20 splits,240→180° setup15min,overnight10h occupancy nie600labor;missing capacity/windows unverified;interrupted search unresolved nie infeasible/optimal. Evidence: brak.

### TASK-OPT-002

**Cel/przepływ:** uprawniony planista przesuwa operację w Gantt, widzi conflict, przelicza i przyjmuje nową propozycję do szkicu, zachowując wcześniej accepted version. **Coverage:** OPT-REQ-006, OPT-REQ-010 / OPT-AC-006, OPT-AC-010. Inputs: source versions/constraints; bez zmian shifts/orders/actual occupancy.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPT-001](#task-opt-001), [TASK-PLN-001](production-planning.md#task-pln-001) | Działający wynik i jawny draft handoff | demonstration |
| release-gate | [OPT-REQ-010](../specs/optimization.md#opt-req-010), [TASK-REC-007](recipes.md#task-rec-007) | Uprawnienia i czytelna oś/lista/conflicts | release |

**State:** not-started. **Decision gates:** brak nowej, nie zgadywać solve status. **Readiness:** contract known, providers absent evidence. **Proof:**move second oven load overlap →resource/operations/interval/capacity;missing availability nie empty success;denied edit;accepted draft nie grafiki/redukcja50confirmed/B2B/occupancy. Evidence: brak.

### TASK-OPT-003

**Cel/przepływ:** właściciel czyta wykorzystanie/wąskie gardła i wersjonowane plan–actual czasy/zasoby/osobominuty oraz scoped KPI. **Coverage:** OPT-REQ-007–008 / OPT-AC-007–008. Inputs: availability denominator, plan-operation/batch mapping, actual facts; brak mapowania to unverified comparison, nie arbitralny match.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPT-001](#task-opt-001) | Planned schedule do integracji | demonstration |
| implementation-prerequisite | [TASK-OBS-001](production-recording.md#task-obs-001), [TASK-OBS-004](production-recording.md#task-obs-004) | Tylko actual time/resource comparison w release, fixture wcześniej | release |
| optional-adapter | [MAP-REQ-015](../specs/flow-map-demo.md#map-req-015), [MAP-REQ-016](../specs/flow-map-demo.md#map-req-016) | Planned load/bottlenecks/availability bez faktycznej occupancy | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004) | Actual event integrity, time/source scope | release |

**State:** not-started. **Decision gate:** DEC-002 przy persistent actual consumption. **Readiness:** mapping/denominator w planie/danych, nie global DEC. **Proof:**360/480=75%planned,120idle nie actual;30planned vs80actual person-min, +10duration;08:00→08:10late10;missing actuals nie0 i KPI overtime/idle/lateness/oven/hours z podstawą. Evidence: brak.

### TASK-OPT-004

**Cel/przepływ:** właściciel porównuje dodatkowego piekarza, inną zmianę, drugą miesiarkę, większą chłodnię i inną kolejność, zachowując wersje/oryginał. **Coverage:** OPT-REQ-009 / OPT-AC-009; inputs shared SCN isolation, nie automatyczny design biznesu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPT-001](#task-opt-001) | Rzeczywisty wynik solvera dla wariantów | demonstration |
| contract-input | [SCN-REQ-001](../specs/scenarios-comparison.md#scn-req-001) | Izolowane i odtwarzalne dane | start |
| release-gate | [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Dowody, qualified labels, permission/UI | release |

**State:** not-started. **Decision gates:** brak nowej. **Readiness:** inputs/objective jawne; advanced comparison nie bramka early INV. **Proof:**5rodzin wariantów/1,2,5osób same availability semantics;różnice celu/conflicts bez obietnicy poprawy, oryginał i actual unchanged. Evidence: brak.
