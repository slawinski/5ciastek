# INV — Scenariusze inwestycji i rozwoju

Wspólny przepływ, nie sześć odłączonych warstw. Właściciele: [SCN](../specs/scenarios-comparison.md), [PRC](../specs/process-execution.md), [STK](../specs/stock-inventory.md), [ECO](../specs/economics-investment.md). [Task/evidence contract](README.md#task-contract) obowiązuje każdy przyrost.

### TASK-INV-001

**Cel/przepływ (MVP-1):** właściciel wybiera ograniczony zestaw produktów i wersje receptur, ręcznie wpisuje źródłowe czasy/obsadę/maszynę/skalę, dostępność właściciela-piekarza i osobnego sprzedawcy, podstawowe zasoby i koszty; zapisuje/otwiera; uruchamia zadaną kolejność; odczytuje terminy, konflikty/zdolność i warunkową interpretację finansową. Pełny SCN-AC-021 jest minimalnym połączonym przykładem dwuproduktowym, nie limitem jednego produktu ani oddzielnymi formularzami/kalkulatorem.

**Coverage:** SCN-REQ-001–008, SCN-REQ-010–015, SCN-REQ-019–021; SCN-AC-001–006, SCN-AC-008–011, SCN-AC-016–019, SCN-AC-021. PRC-REQ-001–005, PRC-REQ-007 / PRC-AC-001–006, PRC-AC-008 (okna tylko właściwe temu przebiegowi); STK-REQ-001–003, STK-REQ-007–008, STK-REQ-014, STK-REQ-016 / STK-AC-003, STK-AC-006, STK-AC-009; ECO-REQ-001, ECO-REQ-003–009, ECO-REQ-017 / ECO-AC-001–006, ECO-AC-013. Szerszy tydzień/miesiąc z tych samych kontraktów nie jest deklarowany dostarczonym przez dzień.

**Inputs/exclusions:** 5–7 dni i 8–12 h są dostępnością; 6 000 PLN netto wymaga jawnych obciążeń. Ceny, straty, najem i okna mają źródło albo status brak/estymacja. Brak początkowej prognozy popytu. Bez rejestratora, bieżących rzeczywistych stanów magazynowych, pełnych grafików, formalnej obecności, optymalnego solvera, prognostycznego FER, mapy i finansowania rozruchu. Niepotwierdzony miesiąc lub odtworzenie zapasu nie blokuje częściowej oceny dnia, ale nie daje cyklicznego dochodu lub zwrotu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-005](recipes.md#task-rec-005) | Działające wersje/skalowanie dla połączonej demonstracji z katalogiem; fixture nie dowodzi integracji | demonstration |
| contract-input | [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [STK-REQ-008](../specs/stock-inventory.md#stk-req-008), [ECO-REQ-001](../specs/economics-investment.md#eco-req-001) | Ograniczony zakres zachowań PRC/STK/ECO implementowany w tym samym przepływie; bez fikcyjnych wzajemnych poprzedników | start |
| optional-adapter | [EVT-REQ-010](../specs/production-records.md#evt-req-010), [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [WRK-REQ-003](../specs/workforce.md#wrk-req-003), [MAP-REQ-003](../specs/flow-map-demo.md#map-req-003) | Import obserwacji, plan/dostępność i mapa; ręczne źródła wystarczają | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Dane i ryzyko wariantu, izolacja, dostęp, błędy, ponowny odczyt i UI | release |

**State:** not-started. **Decision gates:** DEC-001 przed zależną trwałą reprezentacją i obliczeniami mas; DEC-002 nie dotyczy ręcznych pomiarów bez strumienia. **Readiness:** kontrakty i demonstracja z jawnymi kwalifikacjami określone; dane źródłowe i implementacje niezweryfikowane. **Proof:** SCN-AC-021: A20/B12, piec 20, B czeka 15 min, wypiek do 06:50; 30 min pracy nie oznacza 50 min pasywnego zajęcia pieca; 460−224=236−100−80=56 przed obciążeniami i dochodem właściciela. Brak kwalifikacji miesiąca lub podatków pozostawia netto i zwrot niezweryfikowane. Osobno wymagane 2 400/48 000 wobec 2 200 gotowych daje deficyt 200, nie prognozę popytu. Sprawdzić powtarzalne ponowne otwarcie i izolację, brak kontekstu, pojemności lub okna, odmowę dostępu, błąd zapisu i zmianę wejść bez podmiany starego wyniku. Dowody: brak.

### TASK-INV-002

**Cel/przepływ (MVP-2):** właściciel rozszerza zapisany wariant o realistyczny miks, reprezentatywny tydzień, noce/WIP otwarcia, dostawy i zapasy; uruchamia kolejki z ręcznymi oknami; odczytuje bilanse, terminy i oddzielne ograniczenia ludzi/maszyn/technologii/wyrobów oraz ekonomię.

**Coverage:** SCN-REQ-002–003, SCN-REQ-006–013, SCN-REQ-015, SCN-REQ-019 / SCN-AC-002–003, SCN-AC-005, SCN-AC-007–011, SCN-AC-018, SCN-AC-021; PRC-REQ-001–008 / PRC-AC-002–009 (REQ-006/AC-007: brak modyfikacji obserwacji, nie producent EVT); STK-REQ-001–004, STK-REQ-006–008, STK-REQ-014, STK-REQ-016 / STK-AC-003–004, STK-AC-006, STK-AC-009–010; ECO-REQ-007–008, ECO-REQ-011 / ECO-AC-004–005.

**Inputs/exclusions:** źródła dat, jednostek i okien, pochodzenie WIP i użyteczność przeniesień. Bez obowiązku bieżącego rzeczywistego magazynu/POS/MRP/CAPP/FER. Brak okna ogranicza kwalifikację technologii zamiast dopuszczać nieograniczone oczekiwanie; badana kolejność nie jest optimum.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-001](#task-inv-001) | Rozszerzenie tego samego zapisu/przebiegu/ekonomii | demonstration |
| contract-input | [PRC-REQ-003](../specs/process-execution.md#prc-req-003), [STK-REQ-007](../specs/stock-inventory.md#stk-req-007) | Okna ze źródłem i kontynuacja stanów granicznych | start |
| optional-adapter | [FER-REQ-006](../specs/fermentation.md#fer-req-006), [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [EVT-REQ-011](../specs/production-records.md#evt-req-011) | Późniejsze dane operacyjne, nie wspólne bramki | demonstration |
| release-gate | [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020), [SCN-REQ-021](../specs/scenarios-comparison.md#scn-req-021) | Izolacja, uprawnienia, błędy i UI z dowodami | release |

**State:** not-started. **Decision gates:** DEC-001 na zależnych trwałych ilościach; okna są wejściami, nie nową decyzją globalną. **Readiness:** kontrakt określony; implementacja i dane tygodnia wymagają dowodów. **Proof:** 12+12>20; oczekiwanie 45 wobec limitu 30 narusza go o 15, dokładne 30 jest dozwolone; brak limitu pozostawia technologię niezweryfikowaną. 20−19,5−0,5=0; 100=80 sprzedanych+10 przeniesionych+10 odpadu, bez przychodu od 20. WIP z niedzieli jest widoczne w poniedziałek; miks sprzedaży 80 A/80 B przy produkcji 100 B daje 4000−1800=2200. Dowody: brak.

### TASK-INV-003

**Cel/przepływ:** właściciel dostarcza rzeczywisty kalendarz miesiąca i uzgadnia graniczne zapasy/WIP, odtworzenie, pracę/koszty poza tygodniem i przepływy; odczytuje niezależnie kwalifikowany wynik miesięczny/netto/gotówkę, zapisuje/otwiera.

**Coverage:** SCN-REQ-009, SCN-REQ-012–016, SCN-REQ-019 / SCN-AC-006–007, SCN-AC-010–014, SCN-AC-018; ECO-REQ-001–002, ECO-REQ-005–011, ECO-REQ-017 / ECO-AC-001, ECO-AC-003–008, ECO-AC-013; STK-REQ-007 / STK-AC-010. Bez identycznego stanu zamknięcia i otwarcia, pełnego miesięcznego silnika lub rzeczywistej księgowości.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-002](#task-inv-002) | Dane tygodnia i granicy, podstawowa ekonomia odziedziczona | demonstration |
| contract-input | [ECO-REQ-002](../specs/economics-investment.md#eco-req-002), [STK-REQ-007](../specs/stock-inventory.md#stk-req-007) | Zużycie netto zapasu, uzupełnienie i przypisanie pracy oraz kosztów raz | start |
| optional-adapter | [SAL-REQ-006](../specs/sales-returns.md#sal-req-006), [WRK-REQ-012](../specs/workforce.md#wrk-req-012) | Importy rzeczywistych miar tylko jeśli użyte | demonstration |
| release-gate | [ECO-REQ-009](../specs/economics-investment.md#eco-req-009), [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020) | Obciążenia/prywatność/źródła przed potwierdzonym wynikiem | release |

**State:** not-started. **Decision gates:** DEC-001 tylko zależna trwała masa. **Readiness:** brak najmu, podatków lub pracy to ograniczenia wejść, nie globalne decyzje lub obowiązek uzyskania pełnych danych przed częściową demonstracją. **Proof:** 22×100=2200, nie 2000; zużycie 10 kg WIP bez odtworzenia pozostawia powtarzalność niezweryfikowaną. Nierówne stany graniczne 10→6 mogą spełnić kwalifikację po jednokrotnym uwzględnieniu 4 kg×4 PLN+20 min×60 PLN/h=36 PLN, czasu i zasobów oraz kosztu pozostałego odtworzenia. Brak danych o pracy poza tygodniem nadal pozostawia kwalifikację niezweryfikowaną. Dowody: brak.

### TASK-INV-004

**Cel/przepływ:** właściciel podaje nakłady na sprzęt/lokal/kaucję/zapas, zapisuje i odczytuje prosty zwrot z kwalifikowanej nadwyżki po dochodzie właściciela albo brak potwierdzenia.

**Coverage:** SCN-REQ-013–017, SCN-REQ-019 / SCN-AC-011–014, SCN-AC-018; ECO-REQ-002, ECO-REQ-009, ECO-REQ-012–014, ECO-REQ-017 / ECO-AC-006, ECO-AC-008–010, ECO-AC-013. Bez kredytów, spłat, rozruchu, stopniowego dochodzenia do docelowej skali i AI.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-003](#task-inv-003) | Działająca kwalifikacja miesiąca/nadwyżki; dane niepełne dają ograniczony wynik | demonstration |
| contract-input | [ECO-REQ-012](../specs/economics-investment.md#eco-req-012), [ECO-REQ-013](../specs/economics-investment.md#eco-req-013) | Źródła nakładu i brak podwójnego wydatku | start |
| release-gate | [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020) | Kontrolowany zapis, ponowny odczyt i źródła | release |

**State:** not-started. **Decision gates:** brak nowej decyzji, podatki i kaucja to źródłowe wejścia. **Readiness:** kontrakt znany, dane i wykonanie niepotwierdzone. **Proof:** 40000−30000−2000−6000=2000; 80000+20000+10000+10000=120000 /2000=60 miesięcy przy spełnionej kwalifikacji powtarzalności. Wpływy 35000 dają −3000, zero nadwyżki oznacza brak skończonego zwrotu; brak kaucji lub obciążeń nie oznacza 0. Zapasu nie odlicza się dwa razy, późniejsze uzupełnienie nie jest darmowe. Dowody: brak.

### TASK-INV-005

**Cel/przepływ:** właściciel tworzy dwa warianty, zmienia ilości/godziny/ceny/straty/maszyny, ponownie uruchamia wspólny przebieg/ekonomię i porównuje założenia, zdolność, godziny/netto/nadwyżkę/zwrot i braki. Pełne MVP-2 integruje przyrosty, nie zastępuje kalkulacji makietą.

**Coverage:** SCN-REQ-001–021 / SCN-AC-001–019, SCN-AC-021 jako dowód integracyjny; główny zakres SCN-REQ-018–019. Właściciele PRC/STK/ECO zachowują swoje reguły. Wejścia: dwa zapisane komplety, bez automatycznego szukania optimum lub popytu ani geometrycznej symulacji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-004](#task-inv-004) | Pełne wyjścia rozszerzeń do pełnego porównania MVP-2, nie projektu widoku | demonstration |
| contract-input | [SCN-REQ-018](../specs/scenarios-comparison.md#scn-req-018), [ECO-REQ-002](../specs/economics-investment.md#eco-req-002) | Porównanie i zachowane kwalifikacje | start |
| optional-adapter | [MAP-REQ-003](../specs/flow-map-demo.md#map-req-003), [DEM-REQ-006](../specs/demand.md#dem-req-006), [OPT-REQ-009](../specs/optimization.md#opt-req-009) | Prezentacja/źródła/rozszerzenia, nie bramki bazowego porównania | demonstration |
| release-gate | [SCN-REQ-019](../specs/scenarios-comparison.md#scn-req-019), [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020) | Widoczne źródła, braki i kontrolowany dostęp | release |

**State:** not-started. **Decision gates:** tylko odziedziczone zależne granice DEC-001/002, nie nowa globalna polityka wariantu. **Readiness:** zakres określony, pełna demonstracja wymaga wyników przyrostów. **Proof:** A 40 h i B 84 h zachowują różne dostępności, wymagane godziny są podane osobno; brak najmu B nie usuwa B i nie udaje wyniku netto. Te same wejścia dają ten sam wynik bez modyfikacji rzeczywistych danych; układ widoku nie zmienia liczb, marża nie dowodzi dochodu, zdolności ani popytu. Dowody: brak.

### TASK-INV-006

**Cel/przepływ (niezależny rozwój działającej firmy):** właściciel zapisuje, otwiera i porównuje co najmniej dwa technologicznie wykonalne warianty spośród osoby, zmiany, miesiarki, retardera, pieca, drugiego sklepu i wzrostu B2B. Dla jawnego horyzontu i terminów przepływów określa pesymistyczne, bazowe i optymistyczne założenia, CAPEX/OPEX, przepływy pieniężne, próg rentowności i zakres niepewności; późniejsze wyniki służą ocenie trafności. Wszystkie siedem rodzin musi dać się zdefiniować, nie każdy wariant musi poprawiać wynik.

**Coverage:** SCN-REQ-001, SCN-REQ-006, SCN-REQ-018–020, SCN-REQ-022 / SCN-AC-001, SCN-AC-005, SCN-AC-015, SCN-AC-017, SCN-AC-020; ECO-REQ-001–002, ECO-REQ-006, ECO-REQ-009, ECO-REQ-016–017 / ECO-AC-001, ECO-AC-003, ECO-AC-006, ECO-AC-008, ECO-AC-012–013; AST-REQ-008 / AST-AC-007 jako kontrakt odbiorcy. Bez LLM jako kalkulatora, zmian rzeczywistych cen, obsady lub zamówień i bez nowej bramki finansowania otwarcia.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-005](#task-inv-005) | Wspólne działające porównanie, uzupełnione o szersze przepływy pieniężne ECO | demonstration |
| contract-input | [ECO-REQ-016](../specs/economics-investment.md#eco-req-016), [SCN-REQ-022](../specs/scenarios-comparison.md#scn-req-022) | Jawne horyzont, terminy przepływów, zmienne i niepewność, nie tylko izolacja | start |
| optional-adapter | [TASK-AST-005](owner-assistant.md#task-ast-005), [OPT-REQ-009](../specs/optimization.md#opt-req-009), [DEM-REQ-006](../specs/demand.md#dem-req-006), [B2B-REQ-009](../specs/b2b-orders.md#b2b-req-009) | Wyłącznie wybrany odbiorca lub dane; bez zależności blokujących w przeciwnym kierunku | demonstration |
| release-gate | [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020), [ECO-REQ-016](../specs/economics-investment.md#eco-req-016) | Dostęp, kwalifikacja i późniejszy rzeczywisty pomiar przed deklaracją empirycznej trafności | release |

**State:** not-started. **Decision gates:** horyzont, terminy przepływów, wartości i metoda przedziałów należą do planowania i wejść, nie stanowią nowej DEC, zob. [classification](../decisions.md#request-classification). **Readiness:** rezultaty właścicieli kontraktów kompletne; dane i plan obliczeń wymagane do wybranej demonstracji. **Proof:** CAPEX 12 tys., wpływy 9/10/11 tys., OPEX 8 tys., okres 3 miesięcy daje miesięcznie 1/2/3 tys., skumulowane −9/−6/−3 tys., próg 8 tys.; zakres nie jest przedziałem ufności. Dwa warianty są wykonalne, trzeci z brakami nie jest zaliczony; ocena trafności wymaga porównania z późniejszym wykonaniem. Dowody: brak.
