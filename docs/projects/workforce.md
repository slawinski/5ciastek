# WRK — Planowanie i wykonanie pracy

Owner [WRK](../specs/workforce.md), shared [PRC](../specs/process-execution.md). [Task/evidence contract](README.md#task-contract). Jeden model 1–N; ShiftPlan, WorkSession i LaborSegment są różnymi faktami. Prawna kwalifikacja realnego użycia według WRK-REQ-020, nie wymyślonych norm.

### TASK-WRK-001

**Cel/przepływ:** kierownik wprowadza osoby/role/dostępność, ręcznie zapisuje zmiany/przerwy, ogląda dzień/tydzień/miesiąc, publikuje G/v1 i zmienia/anuluje z zachowaniem starej historii. 1→2→5 nie wymaga osobnego modelu/API/UI.

**Coverage:** WRK-REQ-001–008, WRK-REQ-014, WRK-REQ-020–021, WRK-REQ-023 / WRK-AC-001–006, WRK-AC-011–012, WRK-AC-017, WRK-AC-019. Wejścia: forma współpracy i rola osoby, strefa czasu i offset, dostępność, przerwy i stosowane reguły ich płatności. Bez PLN/OPT/DEM/rekomendacji jako warunków zapisu, bez rejestrowania obecności lub naliczania płac.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-002](recipes.md#task-rec-002) | Macierz Bake Along przed ponownym użyciem do planowania pracy, nie wymóg pełnej migracji i nie domniemanie wykonalności | start |
| optional-adapter | [PLN-REQ-002](../specs/production-plans.md#pln-req-002) | Wyświetlenie ręcznie dostarczonego planu | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Prawo/prywatność przed realnymi pracownikami | release |

**State:** not-started. **Decision gates:** brak globalnej decyzji; zastosowanie prawa i reguły płatności są wejściami do wydania. **Readiness:** kontrakt kompletny, brak danych, norm i dowodu implementacji. **Proof:** 1/2/5 osób i usunięcie osoby nie zmienia G/v1; noce DST trwają 7/9 h, a zwykła noc 8 h przed przerwami. Niejednoznacznego lub nieistniejącego czasu nie zgaduje się, nakładające się zmiany nie zwiększają dostępności. Sprawdzić niepoprawną osobę, czas i przerwę, odmowę, nieaktualną wersję, ponowienie i błąd zapisu. Dowody: brak.

### TASK-WRK-002

**Cel/przepływ:** piekarz wybiera pozycję/wersję planu, źródłowe kolejności/czasy/bufory i dostępność; odczytuje szacunkowy start/koniec; usuwa czas i widzi brak; jawnie uzupełnia estymację bez publikacji grafiku.

**Coverage:** WRK-REQ-009–010, WRK-REQ-021 / WRK-AC-007–008, WRK-AC-017; PRC-REQ-001, PRC-REQ-004–005 / PRC-AC-001, PRC-AC-005–006; PLN-REQ-005 / PLN-AC-004. Bez gwarancji nieweryfikowanych maszyn/materiałów.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](#task-wrk-001) | Wybór w działającym przepływie i istniejąca dostępność; ręczny grafik nie ma zależności odwrotnej | demonstration |
| contract-input | [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [PRC-REQ-005](../specs/process-execution.md#prc-req-005) | Pasywne/aktywne/pomocnicze i brakujące czasy | start |
| optional-adapter | [EVT-REQ-010](../specs/production-records.md#evt-req-010), [OPT-REQ-006](../specs/optimization.md#opt-req-006) | Ręczne estymacje wystarczają | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Stosowne dowody dotyczące pracowników, prywatności, UI, dostępu i błędów | release |

**State:** not-started. **Decision gates:** DEC-001/002 tylko dla zależnych adapterów utrwalanych mas lub zdarzeń. **Readiness:** znane źródło czasu wymagane dla każdego przebiegu, brak nie oznacza 0. **Proof:** 06:00−30−60−15=04:15 i 45 osobominut, nie 105; uwzględnione noce i bufory, brak czasu pasywnego nie oznacza 0. Szkic nie zmienia P/v1/G/v1; wynik nie potwierdza dostępności maszyn lub materiałów. Dowody: brak.

### TASK-WRK-003

**Cel/przepływ:** kierownik sprawdza ręcznie zadane równoczesne operacje względem zmian, przerw i umiejętności, odczytuje konflikt z przedziałem i próbuje drugiej osoby teraz lub później. Nie myli sumy godzin z równoczesną dostępnością.

**Coverage:** WRK-REQ-003, WRK-REQ-005–006, WRK-REQ-011, WRK-REQ-021 / WRK-AC-003, WRK-AC-009, WRK-AC-017; PRC-REQ-002, PRC-REQ-005 / PRC-AC-002–003. Przykład maszyny jest kontraktem, nie drugim mechanizmem planowania.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-001](#task-wrk-001) | Zapisana dostępność przed tą demonstracją operacyjną | demonstration |
| implementation-prerequisite | [TASK-WRK-002](#task-wrk-002) | Tylko jeśli przedział pochodzi z jego propozycji, nie dla przedziału ręcznego | demonstration |
| optional-adapter | [OPT-REQ-002](../specs/optimization.md#opt-req-002), [WRK-REQ-024](../specs/workforce.md#wrk-req-024) | Dodatkowe ograniczenia maszyn i integracji | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Właściwy odpoczynek/prawa/UI na danych ludzi | release |

**State:** not-started. **Decision gates:** brak nowej globalnej decyzji. **Readiness:** kontrakt określony, źródła do potwierdzenia. **Proof:** 2×30≠1×60; osoba dostępna później nie usuwa wcześniejszego konfliktu, przerwa przecina przedział, nakładające się zmiany osoby nie podwajają dostępności. Nieznana umiejętność pozostaje niezweryfikowana, potwierdzony brak oznacza konflikt; testowa norma 10 h i odstęp 8 h nie są uniwersalnym prawem. Brak automatycznej publikacji. Dowody: brak.

### TASK-WRK-004

**Cel/przepływ:** uprawniony użytkownik zapisuje rzeczywistą indywidualną sesję i przerwę, porównuje je z planem, koryguje z powodem i historią oraz eksportuje operacyjnie do zewnętrznych kadr; niepełna sesja pozostaje niepełna. Minimalny zapis nieobecności lub urlopu zmienia dostępność, nie tworzy systemu płac ani HRM.

**Coverage:** WRK-REQ-001, WRK-REQ-007–008, WRK-REQ-012–015, WRK-REQ-019–021, WRK-REQ-025 / WRK-AC-001, WRK-AC-004–006, WRK-AC-010–012, WRK-AC-016–017, WRK-AC-021. Wejścia: tożsamość osoby i forma współpracy, czasy zajścia i zapisu, przerwy i reguły płatności; LaborSegment nie tworzy WorkSession i nie jest drugim kosztem ECO.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-001](#task-wrk-001) | Tylko demonstracja porównania plan–wykonanie; ręczna obecność jest niezależna | demonstration |
| contract-input | [ECO-REQ-001](../specs/economics-investment.md#eco-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001) | Rozdział faktów i kosztu, nie cały rejestrator | start |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [WRK-REQ-014](../specs/workforce.md#wrk-req-014), [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Cel/retencja/prawa; formalna ewidencja wyłącznie po odrębnym potwierdzeniu | release |

**State:** not-started. **Decision gates:** domyślnie eksport operacyjny; zakres formalny jest kwalifikacją wydania, nie domyślnym systemem formalnym. DEC-002 tylko dla wspólnego strumienia, jeśli użyty. **Readiness:** kontrakt operacyjny określony, brak rzeczywistych wejść prawnych. **Proof:** sprawdzić sesję otwartą, brak końca i niepoprawne przerwy, DST 7/9/8 h, 7,5 wobec 7,75=+0,25 h według podanych reguł; wartości przed i po, autora, czas i powód. Odmowa obejmuje dane kolegi i eksport; brak automatycznej deduplikacji anonimowego nakładu pracy. Dowody: brak.

### TASK-WRK-005

**Cel/przepływ:** kierownik zestawia P/v1, dostępność i estymacje, rozpoznaje niedobór i wybiera propozycję zwiększenia obsady, przesunięcia lub ograniczenia niepotwierdzonych ilości do szkicu; zatwierdza i publikuje oddzielnie u właścicieli.

**Coverage:** WRK-REQ-002–003, WRK-REQ-005–006, WRK-REQ-009–011, WRK-REQ-016–018, WRK-REQ-021 / WRK-AC-002–003, WRK-AC-007–009, WRK-AC-013–015, WRK-AC-017; PLN-REQ-001, PLN-REQ-004–006 / PLN-AC-002, PLN-AC-004–005; PRC-REQ-001–005 jako wejścia. Nie wymaga wszystkich adapterów ani pełnego solvera.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](#task-wrk-001), [TASK-WRK-002](#task-wrk-002), [TASK-WRK-003](#task-wrk-003) | Podstawowa integracja operacyjna etapu A | demonstration |
| optional-adapter | [OPT-REQ-002](../specs/optimization.md#opt-req-002), [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [B2B-REQ-005](../specs/b2b-orders.md#b2b-req-005), [DEM-REQ-009](../specs/demand.md#dem-req-009), [ECO-REQ-005](../specs/economics-investment.md#eco-req-005) | Brak adaptera jawnie kwalifikuje tylko jego wynik | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Ludzie, prawo, prywatność i akceptacja człowieka | release |

**State:** not-started. **Decision gates:** brak nowej. **Readiness:** kontrakt etapu A dostępny, brak dowodu implementacji. **Proof:** 1/2 osób korzysta z tej samej logiki, czas pasywny nie jest aktywny; potwierdzone B2B są chronione, jeśli dostarczone. Brak adaptera maszyn, materiałów lub zamówień pozostawia jego zakres niezweryfikowany; planId i wersja są zachowane, bez automatycznego grafiku, zakupu i podwójnych kosztów. Dowody: brak.

### TASK-WRK-006

**Cel/przepływ:** kierownik dołącza do podstawowej oceny jeden wybrany adapter wykonania lub prognozy, ogląda odchylenie i świadomie poprawia przyszłą estymację; dołącza wybrane ograniczenie maszyny, materiału lub B2B i widzi jego zakres. Jedna demonstracja nie dowodzi wszystkich adapterów; przed implementacją wybrać jeden ograniczony wariant i osobne dowody pozostałych.

**Coverage:** WRK-REQ-017–019, WRK-REQ-021, WRK-REQ-024 / WRK-AC-014–017, WRK-AC-020; PLN-REQ-004–006 / PLN-AC-002, PLN-AC-004–005. Wejścia: dane z wersją, datą i zakresem, wspólne koszty bez własnego katalogu stawek.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-005](#task-wrk-005) | Istniejący wynik A dla integracji | demonstration |
| implementation-prerequisite | [TASK-WRK-004](#task-wrk-004) | Wyłącznie adapter rzeczywistej indywidualnej obecności; ręczny czas operacji lub czas EVT go nie wymaga | demonstration |
| optional-adapter | [EVT-REQ-010](../specs/production-records.md#evt-req-010), [DEM-REQ-009](../specs/demand.md#dem-req-009), [OPT-REQ-002](../specs/optimization.md#opt-req-002), [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [B2B-REQ-004](../specs/b2b-orders.md#b2b-req-004), [ECO-REQ-005](../specs/economics-investment.md#eco-req-005) | Rzeczywisty producent potrzebny tylko do demonstracji wybranego rzeczywistego adaptera, nie wszystkich naraz | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Stosowne dowody źródła, prywatności i błędów | release |

**State:** not-started. **Decision gates:** DEC-002 tylko dla trwałego odbiorcy zdarzeń. **Readiness:** kontrakt znany, adapter i dane muszą być wybrane i zweryfikowane. **Proof:** 20 rzeczywistych wobec 15 oszacowanych daje +5 bez przepisywania P/v1/G/v1; prognoza zasila najwyżej szkic. Konflikt maszyny nie potwierdza zapasu, awaria B2B nie daje pustego sukcesu, potwierdzone ilości nie są zmniejszane, brak stawki nie oznacza 0. Dowody: brak.

### TASK-WRK-007

**Cel/przepływ:** kierownik wybiera tydzień źródłowych planów/wykonania/ilości, odczytuje kalendarz i wszystkie siedem KPI lub ich kwalifikacje. To integracyjny DoD rodzica, nie warunek startu dzieci ani nowy silnik raportowy.

**Coverage:** WRK-REQ-022 / WRK-AC-018; dowód korzysta z WRK-REQ-002, WRK-REQ-004, WRK-REQ-009, WRK-REQ-011–012, WRK-REQ-016, WRK-REQ-020 / WRK-AC-002, WRK-AC-007, WRK-AC-009–010, WRK-AC-012–013. Wejścia: okres, źródła godzin, ilości, stawek, kosztów i opóźnień zamówień, norma nadgodzin, jeśli ma zastosowanie.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-004](#task-wrk-004), [TASK-WRK-005](#task-wrk-005) | Pełna demonstracja rodzica, nie pojedynczy testowy KPI | demonstration |
| optional-adapter | [ECO-REQ-005](../specs/economics-investment.md#eco-req-005), [ECO-REQ-018](../specs/economics-investment.md#eco-req-018), [B2B-REQ-009](../specs/b2b-orders.md#b2b-req-009), [EVT-REQ-016](../specs/production-records.md#evt-req-016) | Rzeczywiste koszty, późne wypieki i odrzucone zlecenia; nieobecne źródło oznacza brak danych | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Prawidłowa norma/ochrona osobowego raportu | release |

**State:** not-started. **Decision gates:** brak nowej, mianownik i źródło metryki są wejściami z określoną kwalifikacją. **Readiness:** KPI określone, brak rzeczywistych danych. **Proof:** 7 KPI, 120 osobominut/100 szt.=120 osobominut na 100; brak nie oznacza 0, nieuzgodniona praca nie daje dokładnego kosztu. Sprawdzić 1/2/5 osób, tydzień, noce, niedobory i korekty; formalna ewidencja pozostaje odrębna. Dowody: brak.
