# INV — Scenariusze inwestycji i rozwoju

Wspólny przepływ, nie sześć odłączonych warstw. Właściciele: [SCN](../specs/scenarios-comparison.md), [PRC](../specs/process-execution.md), [STK](../specs/stock-inventory.md), [ECO](../specs/economics-investment.md). [Task/evidence contract](README.md#task-contract) obowiązuje każdy przyrost.

### TASK-INV-001

**Cel/przepływ (MVP-1):** właściciel wybiera ograniczony zestaw produktów i wersje receptur, ręcznie wpisuje źródłowe czasy/obsadę/maszynę/skalę, dostępność właściciela-piekarza i osobnego sprzedawcy, podstawowe zasoby i koszty; zapisuje/otwiera; uruchamia zadaną kolejność; odczytuje terminy, konflikty/zdolność i warunkową interpretację finansową. Pełny SCN-AC-021 jest minimalnym połączonym przykładem dwuproduktowym, nie limitem jednego produktu ani oddzielnymi formularzami/kalkulatorem.

**Coverage:** SCN-REQ-001–008, SCN-REQ-010–015, SCN-REQ-019–021; SCN-AC-001–006, SCN-AC-008–011, SCN-AC-016–019, SCN-AC-021. PRC-REQ-001–005, PRC-REQ-007 / PRC-AC-001–006, PRC-AC-008 (okna tylko właściwe temu przebiegowi); STK-REQ-001–003, STK-REQ-007–008, STK-REQ-014, STK-REQ-016 / STK-AC-003, STK-AC-006, STK-AC-009; ECO-REQ-001, ECO-REQ-003–009, ECO-REQ-017 / ECO-AC-001–006, ECO-AC-013. Szerszy tydzień/miesiąc z tych samych kontraktów nie jest deklarowany dostarczonym przez dzień.

**Inputs/exclusions:** 5–7 dni i 8–12 h są dostępnością; 6 000 PLN netto wymaga jawnych obciążeń. Ceny/straty/najem/okna mają źródło albo status brak/estymacja. Brak początkowej prognozy popytu. Bez rejestratora, live stock, pełnych grafików, formalnej obecności, optymalnego solvera, predictive FER, mapy i finansowania rozruchu. Niepotwierdzony miesiąc/odtworzenie nie blokuje częściowej oceny dnia, ale nie daje cyklicznego dochodu/zwrotu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-005](recipes.md#task-rec-005) | Działające wersje/skalowanie dla połączonej demonstracji z katalogiem; fixture nie dowodzi integracji | demonstration |
| contract-input | [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [STK-REQ-008](../specs/stock-inventory.md#stk-req-008), [ECO-REQ-001](../specs/economics-investment.md#eco-req-001) | Bounded zachowania PRC/STK/ECO implementowane w tym samym przepływie; bez fikcyjnych wzajemnych poprzedników | start |
| optional-adapter | [EVT-REQ-010](../specs/production-records.md#evt-req-010), [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [WRK-REQ-003](../specs/workforce.md#wrk-req-003), [MAP-REQ-003](../specs/flow-map-demo.md#map-req-003) | Import obserwacji, plan/dostępność i mapa; ręczne źródła wystarczają | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Dane/ryzyko wariantu, izolacja, access/error/readback, UI | release |

**State:** not-started. **Decision gates:** DEC-001 przed zależną trwałą reprezentacją/obliczeniami mas; DEC-002 nie dotyczy ręcznych pomiarów bez strumienia. **Readiness:** kontrakty i qualified demo określone; źródłowe dane/implementacje niezweryfikowane. **Proof:** SCN-AC-021: A20/B12, piec20, B czeka15 min, wypiek do06:50; 30 min pracy nie 50 min pasywnego pieca; 460−224=236−100−80=56 przed właścicielem. Brak miesiąca/podatków → netto/zwrot niezweryfikowane. Osobno 2 400/48 000 wymagane wobec 2 200 gotowych → deficyt200, nie prognoza popytu. Powtarzalny reopen/isolation, brak kontekstu/pojemności/okna, access/write failure i zmiana wejść bez podmiany starego wyniku. Evidence: brak.

### TASK-INV-002

**Cel/przepływ (MVP-2):** właściciel rozszerza zapisany wariant o realistyczny miks, reprezentatywny tydzień, noce/WIP otwarcia, dostawy i zapasy; uruchamia kolejki z ręcznymi oknami; odczytuje bilanse, terminy i oddzielne ograniczenia ludzi/maszyn/technologii/wyrobów oraz ekonomię.

**Coverage:** SCN-REQ-002–003, SCN-REQ-006–013, SCN-REQ-015, SCN-REQ-019 / SCN-AC-002–003, SCN-AC-005, SCN-AC-007–011, SCN-AC-018, SCN-AC-021; PRC-REQ-001–008 / PRC-AC-002–009 (REQ-006/AC-007 nonmutation obserwacji, nie producent EVT); STK-REQ-001–004, STK-REQ-006–008, STK-REQ-014, STK-REQ-016 / STK-AC-003–004, STK-AC-006, STK-AC-009–010; ECO-REQ-007–008, ECO-REQ-011 / ECO-AC-004–005.

**Inputs/exclusions:** źródła dat/jednostek/okien, pochodzenie WIP i użyteczność przeniesień. Bez obowiązku live magazynu/POS/MRP/CAPP/FER. Brak okna kwalifikuje technologię zamiast unlimited wait; badany porządek nie jest optimum.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-001](#task-inv-001) | Rozszerzenie tego samego zapisu/przebiegu/ekonomii | demonstration |
| contract-input | [PRC-REQ-003](../specs/process-execution.md#prc-req-003), [STK-REQ-007](../specs/stock-inventory.md#stk-req-007) | Okna ze źródłem i kontynuacja stanów granicznych | start |
| optional-adapter | [FER-REQ-006](../specs/fermentation.md#fer-req-006), [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [EVT-REQ-011](../specs/production-records.md#evt-req-011) | Późniejsze dane operacyjne, nie wspólne bramki | demonstration |
| release-gate | [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020), [SCN-REQ-021](../specs/scenarios-comparison.md#scn-req-021) | Izolacja, uprawnienia, błędy i UI z dowodami | release |

**State:** not-started. **Decision gates:** DEC-001 na zależnych trwałych ilościach; okna są wejściami, nie nową decyzją globalną. **Readiness:** kontrakt określony; implementacja/dane tygodnia wymagają dowodów. **Proof:** 12+12>20; czekanie45 wobec limit30 narusza o15, dokładne30 dozwolone; brak limitu → technologia unverified; 20−19,5−0,5=0; 100=80 sprzedanych+10carry+10waste, brak przychodu od20. WIP niedzieli widoczne w poniedziałek; miks80A/80B sprzedaży z100B produkcji daje4000−1800=2200. Evidence: brak.

### TASK-INV-003

**Cel/przepływ:** właściciel dostarcza rzeczywisty kalendarz miesiąca i uzgadnia graniczne zapasy/WIP, odtworzenie, pracę/koszty poza tygodniem i przepływy; odczytuje niezależnie kwalifikowany wynik miesięczny/netto/gotówkę, zapisuje/otwiera.

**Coverage:** SCN-REQ-009, SCN-REQ-012–016, SCN-REQ-019 / SCN-AC-006–007, SCN-AC-010–014, SCN-AC-018; ECO-REQ-001–002, ECO-REQ-005–011, ECO-REQ-017 / ECO-AC-001, ECO-AC-003–008, ECO-AC-013; STK-REQ-007 / STK-AC-010. Bez identycznego closing/opening, pełnego miesięcznego silnika lub rzeczywistej księgowości.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-002](#task-inv-002) | Dane tygodnia i granicy, podstawowa ekonomia odziedziczona | demonstration |
| contract-input | [ECO-REQ-002](../specs/economics-investment.md#eco-req-002), [STK-REQ-007](../specs/stock-inventory.md#stk-req-007) | Net depletion, replenishment i przypisanie pracy/kosztów raz | start |
| optional-adapter | [SAL-REQ-006](../specs/sales-returns.md#sal-req-006), [WRK-REQ-012](../specs/workforce.md#wrk-req-012) | Importy rzeczywistych miar tylko jeśli użyte | demonstration |
| release-gate | [ECO-REQ-009](../specs/economics-investment.md#eco-req-009), [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020) | Obciążenia/prywatność/źródła przed potwierdzonym wynikiem | release |

**State:** not-started. **Decision gates:** DEC-001 tylko zależna trwała masa. **Readiness:** brak najmu/podatków/pracy to ograniczenia wejść, nie globalne decyzje lub obowiązek uzyskania pełnych danych przed partial demo. **Proof:** 22×100=2200 nie2000; zużycie10kg WIP bez odtworzenia → recurring unverified. Nierówna granica10→6 może kwalifikować po uwzględnieniu4kg×4PLN+20min×60PLN/h=36PLN, czasu/zasobów i kosztu pozostałego odtworzenia raz. Brak pracy poza tygodniem nadal unverified. Evidence: brak.

### TASK-INV-004

**Cel/przepływ:** właściciel podaje nakłady na sprzęt/lokal/kaucję/zapas, zapisuje i odczytuje prosty zwrot z kwalifikowanej nadwyżki po dochodzie właściciela albo brak potwierdzenia.

**Coverage:** SCN-REQ-013–017, SCN-REQ-019 / SCN-AC-011–014, SCN-AC-018; ECO-REQ-002, ECO-REQ-009, ECO-REQ-012–014, ECO-REQ-017 / ECO-AC-006, ECO-AC-008–010, ECO-AC-013. Bez kredytów/spłat/rozruchu/ramp/AI.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-003](#task-inv-003) | Działająca kwalifikacja miesiąca/nadwyżki; dane niepełne dają ograniczony wynik | demonstration |
| contract-input | [ECO-REQ-012](../specs/economics-investment.md#eco-req-012), [ECO-REQ-013](../specs/economics-investment.md#eco-req-013) | Źródła nakładu i brak podwójnego wydatku | start |
| release-gate | [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020) | Kontrolowany zapis/readback i źródła | release |

**State:** not-started. **Decision gates:** brak nowej decyzji, podatki/kaucja to źródłowe wejścia. **Readiness:** kontrakt znany, dane/wykonanie niepotwierdzone. **Proof:** 40000−30000−2000−6000=2000; 80000+20000+10000+10000=120000 /2000=60m przy recurring qualification;35000 → −3000, zero → brak skończonego; brak kaucji/burdens nie0. Zapasu nie odjąć dwa razy, późniejsze replenishment nie darmowe. Evidence: brak.

### TASK-INV-005

**Cel/przepływ:** właściciel tworzy dwa warianty, zmienia ilości/godziny/ceny/straty/maszyny, ponownie uruchamia wspólny przebieg/ekonomię i porównuje założenia, zdolność, godziny/netto/nadwyżkę/zwrot i braki. Pełne MVP-2 integruje przyrosty, nie zastępuje kalkulacji makietą.

**Coverage:** SCN-REQ-001–021 / SCN-AC-001–019, SCN-AC-021 jako dowód integracyjny; primary SCN-REQ-018–019. Właściciele PRC/STK/ECO zachowują swoje reguły. Inputs: dwa zapisane komplety, bez automatycznego szukania optimum/popytu/geometrycznej symulacji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-004](#task-inv-004) | Pełne wyjścia rozszerzeń do pełnego porównania MVP-2, nie projektu widoku | demonstration |
| contract-input | [SCN-REQ-018](../specs/scenarios-comparison.md#scn-req-018), [ECO-REQ-002](../specs/economics-investment.md#eco-req-002) | Porównanie i zachowane kwalifikacje | start |
| optional-adapter | [MAP-REQ-003](../specs/flow-map-demo.md#map-req-003), [DEM-REQ-006](../specs/demand.md#dem-req-006), [OPT-REQ-009](../specs/optimization.md#opt-req-009) | Prezentacja/źródła/rozszerzenia, nie bramki bazowego porównania | demonstration |
| release-gate | [SCN-REQ-019](../specs/scenarios-comparison.md#scn-req-019), [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020) | Widoczne źródła, braki i kontrolowany dostęp | release |

**State:** not-started. **Decision gates:** tylko odziedziczone zależne granice DEC-001/002, nie nowa globalna polityka wariantu. **Readiness:** scope specified, pełne demo wymaga wyników przyrostów. **Proof:** A40h i B84h zachowują różne dostępności, wymagane godziny osobno; brak B rent nie usuwa B i nie udaje netto; te same wejścia = ten sam wynik bez rzeczywistych mutacji; layout nie zmienia liczb, marża nie dowodzi dochodu/zdolności/popytu. Evidence: brak.

### TASK-INV-006

**Cel/przepływ (niezależny rozwój działającej firmy):** właściciel zapisuje/otwiera i porównuje co najmniej dwa technologicznie wykonalne warianty spośród osoby, zmiany, miesiarki, retardera, pieca, drugiego sklepu i wzrostu B2B. Dla jawnego horyzontu/czasów przepływów określa pesymistyczne/bazowe/optymistyczne założenia, CAPEX/OPEX, cash flow, próg i zakres niepewności; późniejsze wyniki służą ocenie trafności. Wszystkie siedem rodzin musi dać się zdefiniować, nie każdy wariant musi poprawiać wynik.

**Coverage:** SCN-REQ-001, SCN-REQ-006, SCN-REQ-018–020, SCN-REQ-022 / SCN-AC-001, SCN-AC-005, SCN-AC-015, SCN-AC-017, SCN-AC-020; ECO-REQ-001–002, ECO-REQ-006, ECO-REQ-009, ECO-REQ-016–017 / ECO-AC-001, ECO-AC-003, ECO-AC-006, ECO-AC-008, ECO-AC-012–013; AST-REQ-008 / AST-AC-007 consumer contract. Bez LLM jako kalkulatora, zmian realnych cen/obsady/zamówień i bez nowej bramki finansowania otwarcia.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-005](#task-inv-005) | Wspólne działające porównanie, uzupełnione o szerszy ECO cash flow | demonstration |
| contract-input | [ECO-REQ-016](../specs/economics-investment.md#eco-req-016), [SCN-REQ-022](../specs/scenarios-comparison.md#scn-req-022) | Horyzont/timing/zmienne/niepewność jawne, nie tylko izolacja | start |
| optional-adapter | [TASK-AST-005](owner-assistant.md#task-ast-005), [OPT-REQ-009](../specs/optimization.md#opt-req-009), [DEM-REQ-006](../specs/demand.md#dem-req-006), [B2B-REQ-009](../specs/b2b-orders.md#b2b-req-009) | Wyłącznie wybrany odbiorca/dane; bez reverse blockerów | demonstration |
| release-gate | [SCN-REQ-020](../specs/scenarios-comparison.md#scn-req-020), [ECO-REQ-016](../specs/economics-investment.md#eco-req-016) | Access, qualification i rzeczywisty follow-up przed empirical accuracy | release |

**State:** not-started. **Decision gates:** horyzont/timing/wartości i metoda przedziałów to planowanie/wejścia, nie nowa DEC, zob. [classification](../decisions.md#request-classification). **Readiness:** owner outcomes kompletne; dane i plan obliczeń wymagane do wybranego demo. **Proof:** CAPEX12k, wpływy9/10/11k, OPEX8k,3m → miesięcznie1/2/3k, skumulowane−9/−6/−3k, próg8k; zakres nie jest confidence interval. Dwa feasible, trzeci z brakami nie zaliczony; porównanie późniejszych actuals przed trafnością. Evidence: brak.
