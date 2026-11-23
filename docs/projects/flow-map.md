# MAP — Mapa, demo i aktualność

Owner [MAP](../specs/flow-map-demo.md); EVT dostarcza fakty, PRC/STK/ECO reguły. [Common task/evidence contract](README.md#task-contract). Geometria nie jest symulatorem lokalu ani drugim rendererem.

### TASK-MAP-001

**Cel/przepływ:** demonstrator wybiera A/B/C/D/seed, start/pause/step/restart i pobiera/otwiera versioned JSON; fixture → geometria → jeden renderer/lista pokazuje etapy, branching i prawdziwe transfery. End-to-end fixture flow obejmuje sterowanie, jedną geometrię i dostępny renderer/listę razem, nie UI-only. Live backend niepotrzebny.

**Coverage:** MAP-REQ-001–011, MAP-REQ-014, MAP-REQ-016–017 / MAP-AC-001–010, MAP-AC-013, MAP-AC-015; PRC-REQ-001–005, PRC-REQ-007, STK-REQ-001, ECO-REQ-001 jako wspólne contracts. Inputs: versioned ordered fixture, seed/explicit events, stable IDs/units. Brak actual IDs/writes, solvera, drag/drop, fizycznych tras i własnego silnika produkcji; graph library optional.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [EVT-REQ-001](../specs/production-records.md#evt-req-001), [EVT-REQ-009](../specs/production-records.md#evt-req-009), [PRC-REQ-001](../specs/process-execution.md#prc-req-001) | Normalized projection, nie wymaganie trwałego producenta/DEC resolution | start |
| optional-adapter | [TASK-MAP-002](#task-map-002), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Live i planowane obciążenie nie blokują demo | demonstration |
| release-gate | [TASK-REC-007](recipes.md#task-rec-007), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Demo isolation, source label, UI/no false motion evidence | release |

**State:** not-started. **Decision gates:** fixture nie rozstrzyga DEC-001/002; żadna nie blokuje exact isolated demo. **Readiness:** contracts defined, fixture implementation absent proof. **Proof:**8+etapów/2roots/2batches/branch/merge/multiple rows, stable layout po status update, one-event step,1×/60×identical outcomes/manual-sim equivalent,2templates same domain result;15+15labor,passive brak points;zoom/pan/details/path/filters/keyboard/list/reduced-motion/mobile;oddzielna animacja, nie pełny rerender grafu każdej klatki. Evidence: brak.

### TASK-MAP-002

**Cel/przepływ:** uprawniony użytkownik wybiera actual source, czyta fakt/aktualność i scoped aggregates, traci połączenie, widzi timestamped historical snapshot i wraca bez podwójnego transferu. Rozróżnia crew deklarowane, unikalne osoby, maszyny i plan-dependent delays.

**Coverage:** MAP-REQ-003, MAP-REQ-007–008, MAP-REQ-010–017 / MAP-AC-003, MAP-AC-007–015. Inputs: refresh interval/stale threshold jawne u adaptera, source confirmation ≠ event age; plan/version tylko dla porównania opóźnień. Brak obowiązku SSE/WebSocket, tożsamości/kamery lub nieudowodnionej telemetry.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-MAP-001](#task-map-001), [TASK-OBS-001](production-recording.md#task-obs-001) | Istniejący renderer i actual activity source | demonstration |
| implementation-prerequisite | [TASK-OBS-003](production-recording.md#task-obs-003) | Tylko live quantity/transfer/loss claims | demonstration |
| implementation-prerequisite | [TASK-OBS-004](production-recording.md#task-obs-004) | Tylko live machine occupancy claims | demonstration |
| implementation-prerequisite | [TASK-OBS-002](production-recording.md#task-obs-002) | Tylko corrected-history consumer | demonstration |
| optional-adapter | [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [WRK-REQ-012](../specs/workforce.md#wrk-req-012), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Delay/unique people/planned load tylko ich źródła, nie anonymous baseline | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | P1 i scoped privacy/access | release |

**State:** blocked. **Decision gate:** DEC-002 trwałe ordering/concurrency/reconnect. **Readiness:** fixture demo nie live readiness. **Proof:**4hferment ze skutecznym source check fresh, failure od razu, threshold expiry stale, pause demo nie failure; reconnect bez replayT;start nie transfer/oven;1+1anonymous nie2unique;missing plan nie0delay;allocation missing nie exact costs;denied source no leaks. Evidence: brak.

### TASK-MAP-003

**Cel/przepływ:** uprawniony wybiera historyczną zmianę/okres i read-only odtwarza ją w tym samym rendererze/listach z historyczną etykietą, bez zmiany źródła i nigdy LIVE.

**Coverage:** MAP-REQ-018 / MAP-AC-016. Inputs: recorded history/projection/version/period; nie obowiązkowe wcześniejsze MVP gate.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-MAP-001](#task-map-001), [TASK-OBS-002](production-recording.md#task-obs-002) | Istniejący renderer i odtwarzalna recorded/corrected historia; live mode nie potrzebny | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [EVT-REQ-009](../specs/production-records.md#evt-req-009) | History access/retention/source nonmutation | release |

**State:** blocked. **Decision gate:** DEC-002 persistent replay semantics. **Readiness:** contract preserved, decyzja/actual records unverified. **Proof:**same historical projection/read-only/period visible/reopen no movement side effects/access denial. Evidence: brak.
