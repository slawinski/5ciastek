# WRK — Planowanie i wykonanie pracy

Owner [WRK](../specs/workforce.md), shared [PRC](../specs/process-execution.md). [Task/evidence contract](README.md#task-contract). Jeden model 1–N; ShiftPlan, WorkSession i LaborSegment są różnymi faktami. Prawna kwalifikacja realnego użycia według WRK-REQ-020, nie wymyślonych norm.

### TASK-WRK-001

**Cel/przepływ:** kierownik wprowadza osoby/role/dostępność, ręcznie zapisuje zmiany/przerwy, ogląda dzień/tydzień/miesiąc, publikuje G/v1 i zmienia/anuluje z zachowaniem starej historii. 1→2→5 nie wymaga osobnego modelu/API/UI.

**Coverage:** WRK-REQ-001–008, WRK-REQ-014, WRK-REQ-020–021, WRK-REQ-023 / WRK-AC-001–006, WRK-AC-011–012, WRK-AC-017, WRK-AC-019. Inputs: worker relation/role, timezone/offset, availability, breaks/payment applicability. Bez PLN/OPT/DEM/rekomendacji jako warunków zapisu, bez rejestrowania obecności lub payroll.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-002](recipes.md#task-rec-002) | Macierz Bake Along przed reuse workforce, nie wymóg pełnej migracji i nie domniemanie wykonalności | start |
| optional-adapter | [PLN-REQ-002](../specs/production-plans.md#pln-req-002) | Wyświetlenie ręcznie dostarczonego planu | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Prawo/prywatność przed realnymi pracownikami | release |

**State:** not-started. **Decision gates:** brak globalnej decyzji; legal applicability/pay rules to release inputs. **Readiness:** kontrakt kompletny, dane/normy/implementation proof brak. **Proof:** 1/2/5 i usunięcie osoby nie zmienia G/v1; noce DST7/9h i zwykła8h przed przerwami; ambiguous/nonexistent time nie zgadywany; overlapping shifts nie zwiększają dostępności; invalid worker/time/break, denied/stale/retry/save failure. Evidence: brak.

### TASK-WRK-002

**Cel/przepływ:** piekarz wybiera pozycję/wersję planu, źródłowe kolejności/czasy/bufory i dostępność; odczytuje szacunkowy start/koniec; usuwa czas i widzi brak; jawnie uzupełnia estymację bez publikacji grafiku.

**Coverage:** WRK-REQ-009–010, WRK-REQ-021 / WRK-AC-007–008, WRK-AC-017; PRC-REQ-001, PRC-REQ-004–005 / PRC-AC-001, PRC-AC-005–006; PLN-REQ-005 / PLN-AC-004. Bez gwarancji nieweryfikowanych maszyn/materiałów.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](#task-wrk-001) | Operational selection i istniejąca dostępność; ręczny grafik nie ma zależności odwrotnej | demonstration |
| contract-input | [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [PRC-REQ-005](../specs/process-execution.md#prc-req-005) | Pasywne/aktywne/pomocnicze i brakujące czasy | start |
| optional-adapter | [EVT-REQ-010](../specs/production-records.md#evt-req-010), [OPT-REQ-006](../specs/optimization.md#opt-req-006) | Ręczne estymacje wystarczają | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Stosowne employee/privacy/UI/access/error evidence | release |

**State:** not-started. **Decision gates:** DEC-001/002 tylko zależne persisted mass/event adapters. **Readiness:** known time source required per run, brak nie0. **Proof:**06:00−30−60−15=04:15 i45person-min, nie105; noce/bufory, brak passive nie0; draft nie zmienia P/v1/G/v1; no machine/material certainty. Evidence: brak.

### TASK-WRK-003

**Cel/przepływ:** kierownik sprawdza ręcznie zadane równoczesne operacje względem zmian/przerw/skills, czyta konflikt z przedziałem i próbuje drugiej osoby teraz lub później. Nie myli sumy godzin z równoczesną dostępnością.

**Coverage:** WRK-REQ-003, WRK-REQ-005–006, WRK-REQ-011, WRK-REQ-021 / WRK-AC-003, WRK-AC-009, WRK-AC-017; PRC-REQ-002, PRC-REQ-005 / PRC-AC-002–003. Machine example kontrakt, nie drugi planner.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-001](#task-wrk-001) | Zapisana dostępność przed tym operational demo | demonstration |
| implementation-prerequisite | [TASK-WRK-002](#task-wrk-002) | Tylko jeśli przedział pochodzi z jego propozycji, nie manual interval | demonstration |
| optional-adapter | [OPT-REQ-002](../specs/optimization.md#opt-req-002), [WRK-REQ-024](../specs/workforce.md#wrk-req-024) | Dodatkowe machine/integrated constraints | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Właściwy odpoczynek/prawa/UI na danych ludzi | release |

**State:** not-started. **Decision gates:** brak nowej globalnej decyzji. **Readiness:** contract specified, źródła do potwierdzenia. **Proof:**2×30≠1×60; późna osoba nie usuwa wczesnego konfliktu; przerwa przecina interval, overlap worker nie doubles; unknown skill unverified vs known missing conflict; test norm10h/gap8h nie uniwersalne prawo; no auto publish. Evidence: brak.

### TASK-WRK-004

**Cel/przepływ:** uprawniony zapisuje rzeczywistą indywidualną sesję/przerwę, porównuje z planem, koryguje z powodem/historią i eksportuje operacyjnie do zewnętrznych kadr; niepełna sesja pozostaje niepełna. Minimalna nieobecność/urlop zmienia dostępność, nie tworzy payroll/HRM.

**Coverage:** WRK-REQ-001, WRK-REQ-007–008, WRK-REQ-012–015, WRK-REQ-019–021, WRK-REQ-025 / WRK-AC-001, WRK-AC-004–006, WRK-AC-010–012, WRK-AC-016–017, WRK-AC-021. Inputs: individual identity/relationship, happened/entered times, breaks/payment rules; LaborSegment nie tworzy WorkSession i nie jest drugim kosztem ECO.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-001](#task-wrk-001) | Tylko plan-vs-actual demonstration; ręczna obecność niezależna | demonstration |
| contract-input | [ECO-REQ-001](../specs/economics-investment.md#eco-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001) | Rozdział faktów/kosztu, nie cały recorder | start |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [WRK-REQ-014](../specs/workforce.md#wrk-req-014), [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Cel/retencja/prawa; formalna ewidencja wyłącznie po odrębnym potwierdzeniu | release |

**State:** not-started. **Decision gates:** domyślnie eksport operacyjny; formal scope to kwalifikacja wydania, nie domyślnie system formalny. DEC-002 tylko shared stream jeśli użyty. **Readiness:** operational contract specified, real legal inputs absent. **Proof:** open/missing end/invalid breaks, DST7/9/8h,7,5 vs7,75=+0,25h według podanych reguł; before/after/author/time/reason, denied colleague/export, brak automatycznej deduplikacji anonymous labor. Evidence: brak.

### TASK-WRK-005

**Cel/przepływ:** kierownik zestawia P/v1/dostępność/estymacje, rozpoznaje shortage i wybiera propozycję zwiększenia obsady/przesunięcia/ograniczenia niepotwierdzonych ilości do szkicu; zatwierdza/publikuje oddzielnie u właścicieli.

**Coverage:** WRK-REQ-002–003, WRK-REQ-005–006, WRK-REQ-009–011, WRK-REQ-016–018, WRK-REQ-021 / WRK-AC-002–003, WRK-AC-007–009, WRK-AC-013–015, WRK-AC-017; PLN-REQ-001, PLN-REQ-004–006 / PLN-AC-002, PLN-AC-004–005; PRC-REQ-001–005 inputs. Nie wymaga wszystkich adapterów ani full solvera.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](#task-wrk-001), [TASK-WRK-002](#task-wrk-002), [TASK-WRK-003](#task-wrk-003) | Podstawowa operational integracja A | demonstration |
| optional-adapter | [OPT-REQ-002](../specs/optimization.md#opt-req-002), [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [B2B-REQ-005](../specs/b2b-orders.md#b2b-req-005), [DEM-REQ-009](../specs/demand.md#dem-req-009), [ECO-REQ-005](../specs/economics-investment.md#eco-req-005) | Brak adaptera jawnie kwalifikuje tylko jego wynik | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Ludzie/legal/privacy/human acceptance | release |

**State:** not-started. **Decision gates:** brak nowej. **Readiness:** stage A contract available, implementacje brak dowodu. **Proof:** 1/2 ludzi ta sama logika, passive nie aktywne; confirmed B2B chronione jeśli dostarczone; brak machine/material/order adapter unverified; planId/version, brak auto grafiku/purchase i double costs. Evidence: brak.

### TASK-WRK-006

**Cel/przepływ:** kierownik dołącza do podstawowej oceny jeden wybrany actual/forecast adapter, ogląda odchylenie i świadomie poprawia przyszłą estymację; dołącza wybrane ograniczenie maszyny/materiału/B2B i widzi jego zakres. Jedna demonstracja nie dowodzi wszystkich adapterów; przed implementacją wybrać jeden bounded wariant i osobne dowody pozostałych.

**Coverage:** WRK-REQ-017–019, WRK-REQ-021, WRK-REQ-024 / WRK-AC-014–017, WRK-AC-020; PLN-REQ-004–006 / PLN-AC-002, PLN-AC-004–005. Inputs: dane z wersją/date/scope, shared costs bez własnego katalogu stawek.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-005](#task-wrk-005) | Istniejący wynik A dla integracji | demonstration |
| implementation-prerequisite | [TASK-WRK-004](#task-wrk-004) | Wyłącznie adapter individual actual attendance; manual/EVT operation time nie wymaga go | demonstration |
| optional-adapter | [EVT-REQ-010](../specs/production-records.md#evt-req-010), [DEM-REQ-009](../specs/demand.md#dem-req-009), [OPT-REQ-002](../specs/optimization.md#opt-req-002), [STK-REQ-009](../specs/stock-inventory.md#stk-req-009), [B2B-REQ-004](../specs/b2b-orders.md#b2b-req-004), [ECO-REQ-005](../specs/economics-investment.md#eco-req-005) | Real producer potrzebny tylko wybranemu real adapter demo, nie wszystkim naraz | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Stosowne source/privacy/error evidence | release |

**State:** not-started. **Decision gates:** DEC-002 tylko persistent event consumer. **Readiness:** kontrakt znany, adapter/dane muszą być wybrane i zweryfikowane. **Proof:**20actual vs15estimate=+5 bez przepisywania P/v1/G/v1; forecast max draft; machine conflict nie potwierdza stock; B2B failure nie empty success; confirmed quantities nie zmniejszone, brak stawki nie0. Evidence: brak.

### TASK-WRK-007

**Cel/przepływ:** kierownik wybiera tydzień źródłowych planów/wykonania/ilości, odczytuje kalendarz i wszystkie siedem KPI lub ich kwalifikacje. To integracyjny DoD rodzica, nie warunek startu dzieci ani nowy silnik raportowy.

**Coverage:** WRK-REQ-022 / WRK-AC-018; proof consumes WRK-REQ-002, WRK-REQ-004, WRK-REQ-009, WRK-REQ-011–012, WRK-REQ-016, WRK-REQ-020 / WRK-AC-002, WRK-AC-007, WRK-AC-009–010, WRK-AC-012–013. Inputs: okres, źródła godzin/ilości/stawek/kosztów/order lateness, norma overtime jeśli applicable.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-WRK-004](#task-wrk-004), [TASK-WRK-005](#task-wrk-005) | Pełny parent demonstration, nie pojedyncze KPI fixture | demonstration |
| optional-adapter | [ECO-REQ-005](../specs/economics-investment.md#eco-req-005), [ECO-REQ-018](../specs/economics-investment.md#eco-req-018), [B2B-REQ-009](../specs/b2b-orders.md#b2b-req-009), [EVT-REQ-016](../specs/production-records.md#evt-req-016) | Rzeczywiste koszty/późne wypieki/odrzucone zlecenia; absent → missing | demonstration |
| release-gate | [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Prawidłowa norma/ochrona osobowego raportu | release |

**State:** not-started. **Decision gates:** brak nowej, metric denominator/source is qualified input. **Readiness:** KPI specified, real data missing. **Proof:**7 KPI,120person-min/100szt=120person-min per100; missing ≠0; nieuzgodniona praca nie exact cost; 1/2/5, tydzień/noce/shortages/corrections; formalna ewidencja odrębna. Evidence: brak.
