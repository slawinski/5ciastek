# OPS — Bilans i ekonomia rzeczywistej działalności

Owners [SAL](../specs/sales-returns.md), [STK](../specs/stock-inventory.md), [ECO](../specs/economics-investment.md). [Task/evidence contract](README.md#task-contract). Cały projekt OPS nie jest bramką ręcznego INV.

### TASK-OPS-001

**Cel/przepływ:** operator mapuje stabilne SKU, importuje jedno źródło API/webhook albo CSV dla lokalizacji i tygodnia, rozpoznaje pozycje przyjęte, powtórzone, błędne i konflikty; osobno zapisuje refund, fizyczny zwrot, odpad i niedostępność oraz odczytuje kompletność dzienną, godzinową i tygodniową. Ograniczony przepływ obejmuje przyjmowanie użytych ruchów, nie oczekiwanie na cały magazyn.

**Coverage:** SAL-REQ-001–008 / SAL-AC-001–006; STK-REQ-001–004, STK-REQ-014, STK-REQ-016 / STK-AC-001–003, STK-AC-009, STK-AC-011. Wejścia: tożsamość transakcji źródłowej i znaczenie brutto/netto, strefa czasu, lokalizacja, sztuki, PLN i kanał, stan otwarcia, rzeczywista produkcja, ruchy i godziny handlowe. Nie zgadywać rozdziału wartości netto, utraconego popytu ani tożsamości klienta.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [STK-REQ-001](../specs/stock-inventory.md#stk-req-001), [SAL-REQ-002](../specs/sales-returns.md#sal-req-002), [REC-REQ-001](../specs/recipes.md#rec-req-001) | Wybrana tożsamość źródła i wspólna walidacja przyjęcia do bilansu wdrożone w przepływie | start |
| optional-adapter | [EVT-REQ-011](../specs/production-records.md#evt-req-011), [B2B-REQ-008](../specs/b2b-orders.md#b2b-req-008) | Źródło rzeczywistych danych tylko wtedy, gdy wybrane; ręczne zgodne fakty dozwolone | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Minimalizacja, uprawnienia oraz dowody błędu źródła i ponowienia | release |

**State:** not-started. **Decision gates:** DEC-001 dla utrwalanej masy, DEC-002 tylko dla adaptera zdarzeń. **Readiness:** wybrać źródło, tożsamość i konwersje przed implementacją; kontrakt znany. **Proof:** 10+20−15=15; zwrot 2 daje stan fizyczny 17 i sprzedawalny 15, odpis odpadu sprowadza stan do 15 raz, refund nie tworzy ruchu. Duplikat liczony raz; 2 h niedostępności; 80% kompletnych dni z widocznymi lukami; odmowa lub błąd nie oznaczają sukcesu. Dowody: brak.

### TASK-OPS-002

**Cel/przepływ:** właściciel prześledza koszt rzeczywistego SKU: historyczną recepturę i ceny, ilości, sprzedaż, pracę i jej podział, opakowania, energię, marże, koszty stałe i gotówkę oraz porównanie z księgowością i planem oraz wykonaniem pracy według tej samej podstawy i okresu.

**Coverage:** ECO-REQ-001, ECO-REQ-003–006, ECO-REQ-011, ECO-REQ-017–018 / ECO-AC-001–003, ECO-AC-006, ECO-AC-013–015. Wejścia: historyczne dostawy, stawki i metoda wyliczenia energii, uzgodniona alokacja i księgowość. Praca właściciela nie jest darmowa; wartość ekonomiczna nie jest automatycznie wypłatą pieniężną. Bez własnej księgowości lub naliczania płac.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPS-001](#task-ops-001) | Rzeczywiste ilości i handel dla wybranego SKU albo niezależnie dostarczone zgodne źródło rzeczywiste; nie wszystkie OPS/OBS | demonstration |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [ECO-REQ-001](../specs/economics-investment.md#eco-req-001), [WRK-REQ-001](../specs/workforce.md#wrk-req-001) | Historyczne wartości i brak podwójnej pracy | start |
| optional-adapter | [EVT-REQ-006](../specs/production-records.md#evt-req-006), [WRK-REQ-012](../specs/workforce.md#wrk-req-012) | Rzeczywiste operacje i obecność tylko użyte w wybranej wycenie | demonstration |
| release-gate | [ECO-REQ-017](../specs/economics-investment.md#eco-req-017) | Wrażliwe ceny i raport; brak fałszywego sukcesu | release |

**State:** not-started. **Decision gates:** DEC-001/002 wyłącznie dla zależnych trwałych integracji. **Readiness:** dokładność wymaga źródeł, alokacji i podstawy dla tego samego okresu. **Proof:** 30 min podzielone 50/50 daje 15+15 osobominut i 30 PLN przy 60 PLN/h, nie drugi koszt WorkSession; historyczne 40 PLN pozostaje zachowane, 2 oszacowane wobec 3 zmierzonych kWh są rozróżnione. Marża brutto 140, wkład 100, wynik po stałych 50 i gotówka mają odrębne podstawy; różnica wobec księgowości wynosi 100. Planowane 300 wobec rzeczywistych 360 daje +60, praca właściciela 5 h×60=300 wartości, nie wypłaty ani pracy darmowej. Dowody: brak.

### TASK-OPS-003

**Cel/przepływ:** magazynier przyjmuje partię magazynową, zapisuje użycie, stratę lub transfer, wybiera dopuszczony materiał według FEFO i śledzi źródła oraz stany; właściciel odczytuje krótkie terminy przydatności, niedobory, wartość zapasu, odpisy i nakład pracy przy zakupach.

**Coverage:** STK-REQ-001–006, STK-REQ-013–016 / STK-AC-001–005, STK-AC-009–011. Wejścia: partia magazynowa, składnik, lokalizacja, termin przydatności i cena, tożsamość i czas ruchu, jawna konwersja jednostek, stan dopuszczenia do użycia i próg alertu. Brak progu nie usuwa znanej daty przydatności. Bez solvera, prognozy lub MRP jako warunków rozpoczęcia.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [STK-REQ-004](../specs/stock-inventory.md#stk-req-004) | Receptury, tożsamość ruchu i jednostki | start |
| optional-adapter | [EVT-REQ-011](../specs/production-records.md#evt-req-011) | Rejestrator nie jest obowiązkowym źródłem przyjęć magazynowych | demonstration |
| release-gate | [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Historia, migracja, odtworzenie i dostęp | release |

**State:** blocked. **Decision gate:** DEC-001 trwała masa i zgodność; DEC-002 tylko dla zależnych zdarzeń. **Readiness:** możliwy zestaw testowy, granica trwałej masy pozostaje otwarta. **Proof:** 20−19,5−0,5=0, nadmiarowe wydanie odrzucone; 12+8 zachowuje tożsamość, łączenie zachowuje pochodzenie, kg nie oznacza sztuki. FEFO wybiera 5 z A i 1 z B, wykluczając przeterminowane C; brak ceny lub czasu nie daje KPI 0. Sprawdzić błędy źródła, ponowienia i konflikty. Dowody: brak.

### TASK-OPS-004

**Cel/przepływ:** właściciel wybiera zatwierdzony plan P i wersję, wylicza MRP z receptury i dopuszczonego zapasu, uzysku, strat, zapasu bezpieczeństwa, MOQ i czasu dostawy, porównuje oferty, widzi różnicę po nowej zatwierdzonej wersji i jawnie akceptuje zakup z historią, bez automatycznej wysyłki lub przyjęcia dostawy.

**Coverage:** STK-REQ-009–016 / STK-AC-007–009, STK-AC-011. Wejścia: wersje zapasu i źródeł, datowane oferty i ograniczenia dostawcy, wymagane terminy oraz założenia zapasu bezpieczeństwa i uzysku. Szkic lub prognoza nie są zatwierdzonym planem.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPS-003](#task-ops-003), [TASK-PLN-001](production-planning.md#task-pln-001) | Dopuszczony zapas i zatwierdzony plan; ręczny plan wystarcza | demonstration |
| optional-adapter | [WRK-REQ-018](../specs/workforce.md#wrk-req-018), [OPT-REQ-010](../specs/optimization.md#opt-req-010) | Przekazują zatwierdzoną tożsamość, nie automatyczne zakupy | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [STK-REQ-014](../specs/stock-inventory.md#stk-req-014) | Uprawniona akceptacja i integralność | release |

**State:** not-started. **Decision gates:** DEC-001 przy utrwalanej ilości; wartości dostawcy są danymi używanymi podczas działania. **Readiness:** kontrakt znany, brak danych liczbowych i dostawców danych. **Proof:** v1=10 kg nie zmienia się przez szkic, zatwierdzona v2 daje 15 i różnicę +5; 15−4+1=12 zapotrzebowania, wielokrotność 5 kg daje zamówienie 15, dostawa za 3 dni przy potrzebie za 2 nie spełnia terminu. Zachowana historia cen i odmowa nieuprawnionego zatwierdzenia; zatwierdzenie nie oznacza przyjęcia ani wysyłki. Dowody: brak.

### TASK-OPS-005

**Cel/przepływ:** właściciel wybiera okres rzeczywistych transakcji i produkty, śledzi koszyki, koszty i rabaty oraz odczytuje wspólny wkład z ujawnioną hipotezą przyciągania klientów, nie wnioskiem przyczynowym z korelacji.

**Coverage:** ECO-REQ-015, ECO-REQ-017 / ECO-AC-011, ECO-AC-013. Wejścia: tożsamość koszyka i rzeczywisty okres źródłowy, bez konieczności identyfikacji klienta.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPS-001](#task-ops-001), [TASK-OPS-002](#task-ops-002) | Transakcje z koszykiem i śledzalne koszty | demonstration |
| contract-input | [SAL-REQ-001](../specs/sales-returns.md#sal-req-001), [ECO-REQ-006](../specs/economics-investment.md#eco-req-006) | Jednostki/źródła/marża | start |
| release-gate | [ECO-REQ-017](../specs/economics-investment.md#eco-req-017) | Ochrona rzeczywistych raportów | release |

**State:** not-started. **Decision gates:** brak nowej. **Readiness:** potrzebne rzeczywiste dane koszyków; kontrakt określony. **Proof:** 4/10 koszyków z A+B i wkład z pozycji nie oznaczają 4 dodatkowych klientów; brak kosztu lub źródła nie oznacza 0; sprawdzić odmowę dostępu. Dowody: brak.
