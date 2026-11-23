# OBS — Rejestracja rzeczywistej produkcji

Właściciel [EVT](../specs/production-records.md), wspólne [PRC](../specs/process-execution.md)/[STK](../specs/stock-inventory.md)/[ECO](../specs/economics-investment.md). [Wspólna forma/dowody](README.md#task-contract). Niezależny projekt, nie bramka ręcznego INV.

### TASK-OBS-001

**Cel/przepływ:** piekarz tworzy partię z publikacji, zapisuje kontekst, na telefonie/tablecie prowadzi autoliza → bulk ze składaniem → formowanie, zmienia obsadę i ponownie otwiera kartę/historię. Minimalny UI i rzeczywisty zapis razem, nie API-only ani cały epik.

**Coverage:** EVT-REQ-001, EVT-REQ-003–010, EVT-REQ-014–015 (brak fikcyjnych danych); EVT-AC-001–009, EVT-AC-012, EVT-AC-016; PRC-REQ-001, PRC-REQ-004, PRC-REQ-006–007 / PRC-AC-001, PRC-AC-005, PRC-AC-007–008; WRK-REQ-001 / WRK-AC-001. Inputs: wersja/skala, plan-version jeśli realizowany, batch/activity/actor/source/schema/occurredAt/recordedAt/sequence, kontekst pomiar/estymacja/brak, anonimowe counts. Nieplanowany etap z nazwą; aktywne default1, passive0 dozwolone. Bez payroll, kamery, solvera i wymyślonych ilości/zajęć. Fakt odchylenia pozostaje faktem, nie kasowanym przez plan.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-003](recipes.md#task-rec-003) | Trwała niezmienna wersja receptury do realnej partii | demonstration |
| contract-input | [REC-REQ-002](../specs/recipes.md#rec-req-002), [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [WRK-REQ-001](../specs/workforce.md#wrk-req-001), [ECO-REQ-001](../specs/economics-investment.md#eco-req-001) | Skala/czas, rozdział faktów i alokacja bez drugiego silnika | start |
| optional-adapter | [MAP-REQ-003](../specs/flow-map-demo.md#map-req-003), [PLN-REQ-001](../specs/production-plans.md#pln-req-001) | Mapa i wskazana wersja planu, nie wspólne bramki | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-REC-007](recipes.md#task-rec-007) | P1, tożsamości tylko z celem/prawem, UI | release |

**State:** blocked. **Decision gates:** DEC-002 start trwałej koperty/order/concurrency; DEC-001 dla trwałej masy partii. **Readiness:** fixture/karta może być demonstrowana, nie live persistence. **Proof:** 08:00/08:05, atomowe przejście08:45, autoliza45min/0 stałej pracy, folding5 nie kończy bulk, 10×1+20×2=50; stop bez startu/ujemny odrzucone; retry i dwa urządzenia nie dublują; A/B/noce120min; normalized manual/sim projection, reopening bez side effects; brak źródła nie pusty sukces, brak qty/occupancy nie0; odmowy i telefon/tablet. Evidence: brak.

### TASK-OBS-002

**Cel/przepływ:** uprawniony korektor wskazuje wpis, expected version/powód/przed-po, otrzymuje atomowo nową projekcję czasu/nakładu albo konflikt z ID i niezmienioną spójną historię. Waliduje wszystkie zależności istniejące w chwili wdrożenia, bez cichego przesuwania faktów.

**Coverage:** EVT-REQ-001–002, EVT-REQ-007–009, EVT-REQ-015 / EVT-AC-006, EVT-AC-008, EVT-AC-014–015, EVT-AC-019 (rozszerzenie zasobowe); PRC-REQ-006 / PRC-AC-007. Inputs: event/version/autor/powód, istniejące segmenty i fakty. Bez kasowania, automatycznej naprawy, zmian WorkSession/grafiku lub bezterminowej retencji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](#task-obs-001) | Pierwsza korekta czasu/nakładu, nie oczekiwanie na przyszłe ilości/zasoby | demonstration |
| contract-input | [STK-REQ-001](../specs/stock-inventory.md#stk-req-001), [PRC-REQ-002](../specs/process-execution.md#prc-req-002) | Walidacja każdej już istniejącej zależności odpowiedniego typu | start |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004), [TASK-ASS-003](engineering-assurance.md#task-ass-003) | Failure/restart/audit i pełna zależność typu korekty | release |

**State:** blocked. **Decision gates:** DEC-002 trwałe version/concurrency/replay; DEC-001 dodatkowo poprawiane masy. **Readiness:** reguła atomowości kompletna, brak decyzji/implementacji. **Proof:** 11:40–12:10×2 →12:00 =20min/40person-min, before/after; denied/brak powodu/end<start/dependent segment/stale version bez zmian. Jeśli qty/resource istnieją: niższa ilość konflikt later transfer, zwolnienie10:40 konflikt B10:30, żaden odbiorca nie częściowo zmieniony; restart ta sama projekcja. Evidence: brak.

### TASK-OBS-003

**Cel/przepływ:** operator na karcie potwierdza transfer/stratę, dzieli lub łączy źródła i odczytuje bilans/pochodzenie. W tym przepływie wdraża przyjęcie/konwersje STK, nie czeka na całe FEFO/MRP.

**Coverage:** EVT-REQ-001–002, EVT-REQ-007–009, EVT-REQ-011, EVT-REQ-015 / EVT-AC-006, EVT-AC-008, EVT-AC-010–012, EVT-AC-015; STK-REQ-001, STK-REQ-004 / STK-AC-003, STK-AC-009. Inputs: batch/part/from/to/quantity/unit, loss place/reason, source/actor/time, jawna konwersja i opening. Nieznane opening wymaga uzupełnienia, nie0.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](#task-obs-001) | Event/batch/card | demonstration |
| implementation-prerequisite | [TASK-OBS-002](#task-obs-002) | Wspólne korekty przed udostępnieniem korekt ilości; ten task dodaje wszystkie qty dependencies, bez odwrotnej krawędzi | release |
| optional-adapter | [MAP-REQ-008](../specs/flow-map-demo.md#map-req-008) | Konsument rzeczywistych transferów | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004) | P1, denied/write/retry/balance/recovery evidence | release |

**State:** blocked. **Decision gates:** DEC-001 masa/konwersje, DEC-002 ordered movement. **Readiness:** exact acceptance known, trwałe granice nierozstrzygnięte. **Proof:** 20−0,5−19,5=0, następne1/zero/negative/unknown-state odrzucone; event raz;12+8 izolowane, merge oba ID, kg≠szt bez konwersji; start nie ruch; failure nie sukces; zmniejszenie masy invalidating later fact atomowo odrzucone. Evidence: brak.

### TASK-OBS-004

**Cel/przepływ:** operator jawnie zajmuje/zwalnia piec i czyta potwierdzoną occupancy lub brak/konflikt. W tym bounded flow dostarcza równoczesną walidację PRC, nie zależy od pełnego solvera ani grafiku.

**Coverage:** EVT-REQ-001–002, EVT-REQ-007–009, EVT-REQ-013, EVT-REQ-015 / EVT-AC-006, EVT-AC-008, EVT-AC-012–013, EVT-AC-019; PRC-REQ-002, PRC-REQ-006 / PRC-AC-003, PRC-AC-007. Inputs: resource/batch/activity, times/actor/source, known capacity/occupancy ze wspólną jednostką lub jawny brak. Plan/start/config nie dowodzą faktycznego zajęcia; bez telemetry/sterowania.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](#task-obs-001) | Działający zapis/card | demonstration |
| implementation-prerequisite | [TASK-OBS-002](#task-obs-002) | Wspólna korekta, ten przyrost dodaje resource-dependency replay, nie odwrotnie | release |
| optional-adapter | [MAP-REQ-015](../specs/flow-map-demo.md#map-req-015), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Live consumer/oddzielne planned load | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004) | P1 concurrent resource and recovery proof | release |

**State:** blocked. **Decision gate:** DEC-002 shared-resource ordering/replay. **Readiness:** kontrakt known, trwała współbieżność nieustalona. **Proof:** 12+12 na20 nie oba zatwierdzone; targeted release idempotent; unknown capacity unverified; failure/start/plan nie tworzą occupancy; korekta A release10:40 invalidates B10:30 → conflict z ID i stara projekcja, nie wymazanie obserwacji odchylenia. Evidence: brak.

### TASK-OBS-005

**Cel/przepływ:** operator zapisuje uzysk i straty zmiany; analityk porównuje plan/wykonanie, trzy najdłuższe czynności i kwalifikowane wskaźniki użyteczności.

**Coverage:** EVT-REQ-003, EVT-REQ-006, EVT-REQ-010–012, EVT-REQ-016 / EVT-AC-005, EVT-AC-009–011, EVT-AC-017–018; STK-REQ-001–002, ECO-REQ-001 jako kontrakty. Inputs: planned/observed szt/masy, resztki/dzielenie/formowanie/po wypieku, causes/units/source/allocation; period/expected-entry denominator/entry-time definition z użytkownikiem. Bez wymyślonej telemetry/progów KPI lub advanced wspólnego ciasta REC-REQ-013.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-003](#task-obs-003) | Pełny observed shift quantity/loss report z aktywnościami | demonstration |
| implementation-prerequisite | [TASK-OBS-002](#task-obs-002) | Corrected history użyta w raporcie | release |
| optional-adapter | [SCN-REQ-006](../specs/scenarios-comparison.md#scn-req-006), [PLN-REQ-001](../specs/production-plans.md#pln-req-001) | Sourced observation eksport i jawny plan-version | demonstration |

**State:** not-started. **Decision gates:** DEC-001/002 tylko dependent persisted masses/history, metryka wpisów jest scoped planning input. **Readiness:** contract known, real reports potrzebują źródeł. **Proof:**20 przed/19 po/1waste,0,2kg resztki i0,1kg dzielenia nie fikcyjne sztuki/saleable; longest30/20/10 z30/20/10/5;60person-min/100=1h/100;2/10missing=20%, brak czasu wpisu nie0; nie zmieniać receptury. Evidence: brak.
