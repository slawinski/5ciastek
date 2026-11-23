# PLN — Zapis i zatwierdzanie produkcji

Owner: [PLN](../specs/production-plans.md). [Common task/evidence contract](README.md#task-contract).

### TASK-PLN-001

**Cel/przepływ:** piekarz wybiera publikację, 20 sztuk i jednoznaczny termin; zapisuje/otwiera szkic z masami; kierownik zatwierdza P/v1; szkic v2=30 nie zmienia odbiorcy v1; zatwierdzenie v2 zachowuje historię v1.

**Coverage:** PLN-REQ-001–004, PLN-REQ-007–008 / PLN-AC-001–003, PLN-AC-006–007. Wejścia: identyfikatory planu i pozycji, publikacja, dodatnia całkowita liczba sztuk, g/kg, strefa czasu zakładu i jednoznaczna chwila gotowości. Bez solvera, publikacji grafiku, WorkSession, partii lub wysyłki zakupu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-005](recipes.md#task-rec-005) | Działające wybieranie wersji i skali do operacyjnego zapisu | demonstration |
| contract-input | [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [REC-REQ-001](../specs/recipes.md#rec-req-001) | Tożsamość zatwierdzenia nie oznacza wykonania | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Uprawnienia, historia, ponowienia, konflikty, odtworzenie i UI | release |

**State:** not-started. **Decision gate:** DEC-001 przed zależnym trwałym skalowaniem/masami. **Readiness:** kontrakt określony; brak dowodu dostawcy danych wejściowych i samych danych. **Proof:** dokładny zapis i ponowny odczyt oraz zachowanie wersji źródłowej; zero, ułamek, nieopublikowana receptura i niejednoznaczny czas zmiany DST są odrzucane. Zatwierdzone 20 pozostaje niezmienne wobec szkicu 30; błąd źródła lub zapisu i widok tylko do odczytu nie zmieniają danych, nieuprawnione lub równoczesne zatwierdzenie nie daje częściowego sukcesu. Nie powstają grafiki, zakupy ani wykonanie. Dowody: brak.

### TASK-PLN-002

**Cel/przepływ:** kierownik przyjmuje datowaną propozycję do szkicu, ogląda analizę oznaczonego szkicu, odrębnie zatwierdza i przekazuje planId, wersję i pozycje do odbiorcy. Eksport wymagający SKU z brakującym mapowaniem wskazuje pozycję i nie zgłasza pełnego sukcesu; MRP nie dostaje szkicu.

**Coverage:** PLN-REQ-004–008 / PLN-AC-002, PLN-AC-004–007. Wejścia: pochodzenie i wersja propozycji, ilości i terminy, mapowania SKU. Bez automatycznej akceptacji, zakupów lub zmian ani nowego rachunku.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](#task-pln-001) | Istniejący zapis i zatwierdzanie przed rzeczywistym przekazaniem | demonstration |
| optional-adapter | [DEM-REQ-009](../specs/demand.md#dem-req-009), [OPT-REQ-010](../specs/optimization.md#opt-req-010), [WRK-REQ-018](../specs/workforce.md#wrk-req-018), [B2B-REQ-007](../specs/b2b-orders.md#b2b-req-007) | Testowa propozycja wystarcza bez pełnych implementacji producentów | demonstration |
| optional-adapter | [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [ECO-REQ-005](../specs/economics-investment.md#eco-req-005) | Odbiorca zatwierdzonej wersji do MRP lub kosztów | demonstration |
| release-gate | [PLN-REQ-007](../specs/production-plans.md#pln-req-007), [PLN-REQ-008](../specs/production-plans.md#pln-req-008) | Dostęp, pochodzenie, źródło i błędy oraz wspólne zasady UI i zapewnienia jakości inżynierskiej | release |

**State:** not-started. **Decision gate:** DEC-001 tylko dla użytej utrwalanej masy. **Readiness:** kontrakt przekazania kompletny, rzeczywiste adaptery osobno. **Proof:** prognoza 30 nie zmienia zatwierdzonych 20 bez wyboru i zatwierdzenia; odbiorca zachowuje v1 do zatwierdzenia v2. Brak SKU drugiej pozycji nie daje pełnego sukcesu; awaria odbiorcy nie oznacza zatwierdzenia, nie ma automatycznej zmiany grafiku, zakupu ani B2B. Dowody: brak.
