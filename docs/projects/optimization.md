# OPT — Harmonogram solvera

Owner [OPT](../specs/optimization.md), constraints [PRC](../specs/process-execution.md). [Common evidence](README.md#common-evidence). Solver ograniczeń obowiązkowy; OR-Tools jest przykładem, nie wybranym pakietem. Nie LLM.

### TASK-OPT-001

**Cel/przepływ:** planista wybiera ręczny plan i dostępność dla chleba i drożdżówek, 1/2 pracowników i pieca; solver przedstawia wersjonowaną propozycję albo precyzyjne konflikty i kwalifikacje wyniku. **Coverage:** OPT-REQ-001–005 / OPT-AC-001–005. Wejścia: wersje, terminy, operacje, umiejętności, przerwy i mający zastosowanie odpoczynek, pojemności z jednostkami, temperatury, przezbrojenia, przebieg nocny i okna technologiczne. Bez wymagania DEM, B2B, rekomendatora WRK ani rejestratora rzeczywistej produkcji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](workforce.md#task-wrk-001) | Ręczne dane operacyjne do połączonej demonstracji; wcześniej możliwy zestaw testowy | demonstration |
| contract-input | [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [PRC-REQ-002](../specs/process-execution.md#prc-req-002), [PRC-REQ-003](../specs/process-execution.md#prc-req-003), [REC-REQ-001](../specs/recipes.md#rec-req-001) | Jeden model czasu/zasobów/okien i wersji | start |
| optional-adapter | [DEM-REQ-009](../specs/demand.md#dem-req-009), [B2B-REQ-007](../specs/b2b-orders.md#b2b-req-007), [WRK-REQ-024](../specs/workforce.md#wrk-req-024) | Wybrane rozszerzenia | demonstration |
| release-gate | [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Weryfikacja na rzeczywistym dniu przed deklaracją wykonalności operacyjnej | release |

**State:** not-started. **Decision gates:** cel, priorytety i wagi są jawne w ograniczonym planie zadania i danych; wyniki feasible/infeasible/unresolved/proven optimum są już określone, nie stanowią nowej DEC. **Readiness:** wybrać funkcję celu i wejścia źródłowe, nie wymyślać dopuszczalnych nadgodzin ani globalnego optimum. **Proof:** konflikt równoczesnego zapotrzebowania na umiejętności; 24 przy pojemności 20 wymaga podziału, 240→180° uwzględnia przezbrojenie 15 min, nocne zajęcie przez 10 h nie oznacza 600 osobominut pracy. Brak pojemności lub okien pozostawia zakres niezweryfikowany; przerwane szukanie daje unresolved, nie infeasible/optimal. Dowody: brak.

### TASK-OPT-002

**Cel/przepływ:** uprawniony planista przesuwa operację na wykresie Gantta, widzi konflikt, przelicza i przyjmuje nową propozycję do szkicu, zachowując wcześniej zaakceptowaną wersję. **Coverage:** OPT-REQ-006, OPT-REQ-010 / OPT-AC-006, OPT-AC-010. Wejścia: wersje źródeł i ograniczenia; bez zmian grafików, zamówień lub rzeczywistego zajęcia zasobów.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPT-001](#task-opt-001), [TASK-PLN-001](production-planning.md#task-pln-001) | Działający wynik i jawne przekazanie do szkicu | demonstration |
| release-gate | [OPT-REQ-010](../specs/optimization.md#opt-req-010), [TASK-REC-007](recipes.md#task-rec-007) | Uprawnienia i czytelna oś czasu, lista oraz konflikty | release |

**State:** not-started. **Decision gates:** brak nowej, nie zgadywać statusu solvera. **Readiness:** kontrakt znany, brak dowodów działania dostawców danych. **Proof:** przesunięcie drugiego wsadu pieca na czas pierwszego ujawnia zasób, operacje, przedział i pojemność; brak dostępności nie daje pustego wyniku oznaczającego sukces. Sprawdzić odmowę edycji; przyjęty szkic nie zmienia grafików, nie redukuje 50 potwierdzonych sztuk B2B ani nie zmienia zajęcia zasobów. Dowody: brak.

### TASK-OPT-003

**Cel/przepływ:** właściciel odczytuje wykorzystanie, wąskie gardła, wersjonowane porównanie plan–wykonanie dla czasów, zasobów i osobominut oraz KPI dla określonego zakresu. **Coverage:** OPT-REQ-007–008 / OPT-AC-007–008. Wejścia: mianownik dostępności, mapowanie operacji planu do partii i rzeczywiste fakty; brak mapowania oznacza niezweryfikowane porównanie, nie arbitralne dopasowanie.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPT-001](#task-opt-001) | Planowany harmonogram do integracji | demonstration |
| implementation-prerequisite | [TASK-OBS-001](production-recording.md#task-obs-001), [TASK-OBS-004](production-recording.md#task-obs-004) | Tylko porównanie rzeczywistych czasów i zasobów przy wydaniu; wcześniej możliwy zestaw testowy | release |
| optional-adapter | [MAP-REQ-015](../specs/flow-map-demo.md#map-req-015), [MAP-REQ-016](../specs/flow-map-demo.md#map-req-016) | Planowane obciążenie, wąskie gardła i dostępność bez faktycznego zajęcia zasobów | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004) | Integralność rzeczywistych zdarzeń, zakres czasu i źródła | release |

**State:** not-started. **Decision gate:** DEC-002 przy trwałym odbiorze rzeczywistych danych. **Readiness:** mapowanie i mianownik należą do planu i danych, nie globalnej DEC. **Proof:** 360/480=75% planowanego wykorzystania i 120 min bezczynności nie są wykonaniem; plan 30 min jednej osoby i wykonanie 40 min dwóch osób dają odpowiednio 30 i 80 osobominut oraz osobno +10 min czasu trwania. 08:00→08:10 oznacza spóźnienie 10 min; brak wykonania nie oznacza 0, a KPI nadgodzin, bezczynności, spóźnień, wykorzystania pieca i roboczogodzin mają podaną podstawę. Dowody: brak.

### TASK-OPT-004

**Cel/przepływ:** właściciel porównuje dodatkowego piekarza, inną zmianę, drugą miesiarkę, większą chłodnię i inną kolejność, zachowując wersje i oryginał. **Coverage:** OPT-REQ-009 / OPT-AC-009; wejścia podlegają wspólnej izolacji SCN, nie oznacza to automatycznego projektowania działalności.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPT-001](#task-opt-001) | Rzeczywisty wynik solvera dla wariantów | demonstration |
| contract-input | [SCN-REQ-001](../specs/scenarios-comparison.md#scn-req-001) | Izolowane i odtwarzalne dane | start |
| release-gate | [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Dowody, oznaczenia kwalifikacji, uprawnienia i UI | release |

**State:** not-started. **Decision gates:** brak nowej. **Readiness:** wejścia i cel są jawne; zaawansowane porównanie nie jest bramką wczesnego INV. **Proof:** 5 rodzin wariantów oraz 1,2,5 osób zachowują to samo znaczenie dostępności; różnice celu i konfliktów są widoczne bez obietnicy poprawy, oryginał i wykonanie pozostają bez zmian. Dowody: brak.
