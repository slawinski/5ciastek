# AST — Asystent właściciela

Owner [AST](../specs/owner-assistant.md). [Common evidence](README.md#common-evidence). Liczby pochodzą z funkcji właścicieli, nie LLM; odmowa dostępu obejmuje również cytaty, agregaty i eksport.

### TASK-AST-001

**Cel/przepływ:** właściciel otwiera dzienny panel tylko do odczytu i sprawdza źródło, datę i założenia każdej dostępnej miary sprzedaży, odpadów, niedostępności, marży, pracy, nadgodzin i wykorzystania sprzętu. **Coverage:** AST-REQ-001, AST-REQ-004–005 / AST-AC-001, AST-AC-004–005 (filtrowanie odczytu). Bez wymagania wszystkich DEM/OPT/B2B/AI jako warunków blokujących; brak nie oznacza 0.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [SAL-REQ-006](../specs/sales-returns.md#sal-req-006), [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [EVT-REQ-006](../specs/production-records.md#evt-req-006), [WRK-REQ-022](../specs/workforce.md#wrk-req-022), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Tylko prezentowane miary; zgodne wejścia ze źródłem do zestawu testowego, rzeczywisty producent konieczny do każdego twierdzenia o wykonaniu | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Macierz dostępu, agregaty, retencja i minimalizacja | release |

**State:** not-started. **Decision gates:** konfiguracja dostawcy i dostępu podlega istniejącej polityce, nie nowej globalnej DEC. **Readiness:** określić wybrane miary i źródła przed implementacją; brak dowodu rzeczywistego źródła. **Proof:** 100 sprzedanych sztuk, 10 odpadów, 60 min niedostępności i 12 h pracy mają źródło i datę; brak marży lub wykorzystania nie oznacza 0. Planowane 75% nie oznacza wykonania; przy awarii AI panel działa, a odmowa dostępu do cytatów nie ujawnia danych. Dowody: brak.

### TASK-AST-002

**Cel/przepływ:** właściciel zadaje trzy wybrane pytania o sprzedaż, odpady i rentowność; otrzymuje liczby ze sprawdzalnych funkcji, cytaty, daty i założenia po filtrowaniu uprawnień i redakcji przed AI albo jawny brak danych lub prośbę o doprecyzowanie. **Coverage:** AST-REQ-002–006 / AST-AC-002–005. Wejścia: dokładne trzy przypadki, miara i okres wybrane z właścicielem, sprawdzalne funkcje źródłowe, wybrany dostawca AI, warunki przetwarzania, dostęp i klasy redakcji. Są to wybory planowania, konfiguracji działania i wydania, nie brakujące globalne zasady biznesowe. Bez modyfikacji danych, autonomicznych narzędzi lub ujawnienia surowych danych na prośbę modelu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [SAL-REQ-006](../specs/sales-returns.md#sal-req-006) | Implementować sprawdzalne źródła wybranych pytań, nie wszystkie operacyjne epiki | demonstration |
| optional-adapter | [DEM-REQ-006](../specs/demand.md#dem-req-006), [OPT-REQ-007](../specs/optimization.md#opt-req-007), [B2B-REQ-009](../specs/b2b-orders.md#b2b-req-009) | Rozszerzone pytania tylko wtedy, gdy zostały wybrane | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-008](engineering-assurance.md#task-ass-008), [AST-REQ-005](../specs/owner-assistant.md#ast-req-005), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Ocena ujawnienia, przetwarzania i retencji oraz zaobserwowana redakcja wysyłanej treści przed rzeczywistym przekazaniem do AI | release |

**State:** not-started. **Decision gates:** brak nowej DEC, właściciel wybiera brzmienie pytań, którego AC nie narzucają. **Readiness:** dowody danych, przypadków i zatwierdzeń dostawcy wymagane we właściwej fazie. **Proof:** 3 przypadki źródłowe: 1000 PLN przychodu, 10 odpadów o wartości 20 PLN i 400 wkładu, bez wymyślonych wyników finansowych; nieznany koszt lub okres ogranicza odpowiedź. Przechwycona treść wychodząca nie ujawnia płac ani kontaktów, nieudana redakcja blokuje wysyłkę; awaria źródła lub dostawcy jest widoczna, lokalny wynik z kwalifikacją pozostaje dostępny. Dowody: brak.

### TASK-AST-003

**Cel/przepływ:** właściciel ogląda dokładną różnicę ceny, zamówienia lub harmonogramu i jawnie przekazuje propozycję do autoryzowanej akceptacji właściciela domeny; sama odpowiedź nic nie zmienia. **Coverage:** AST-REQ-007 / AST-AC-006. To późniejsze przekazanie, nie rozszerzenie pierwszego wydania tylko do odczytu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [B2B-REQ-003](../specs/b2b-orders.md#b2b-req-003), [ECO-REQ-017](../specs/economics-investment.md#eco-req-017) | Walidacja, uprawnienia i zatwierdzenie odpowiedniego właściciela, nie nowy silnik polityki cenowej | start |
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001) | Tylko rzeczywiste przekazanie działania dotyczącego planu; przekazanie zamówienia lub ceny wymaga wybranego przepływu odpowiedniego właściciela, nie wszystkich naraz | demonstration |
| release-gate | [AST-REQ-007](../specs/owner-assistant.md#ast-req-007), [TASK-ASS-002](engineering-assurance.md#task-ass-002) | Dokładne upoważnienie człowieka bez obchodzenia kontroli | release |

**State:** not-started. **Decision gates:** przepływ jest wybierany w planie dla każdego działania, nie przez globalną DEC. **Readiness:** dowody przepływu właściciela i walidacji potrzebne przed włączeniem wybranego działania. **Proof:** propozycja 8→9 pozostawia ceny, zamówienia i harmonogram bez zmian; osoba bez prawa zatwierdzania nie obchodzi kontroli, rzeczywista akceptacja obejmuje dokładnie wskazaną różnicę. Dowody: brak.

### TASK-AST-004

**Cel/przepływ:** właściciel lub analityk porównuje rzeczywistą pracę administracyjną z asystentem i bez niego, koszt zapytania i koszt miesięczny oraz poprawność odpowiedzi w zadeklarowanym okresie. **Coverage:** AST-REQ-009 / AST-AC-008. Wejścia: porównywalny punkt odniesienia, obserwacje i zweryfikowane oczekiwane odpowiedzi; bez wygenerowanych oszczędności godzin lub arbitralnego progu ROI.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [AST-REQ-009](../specs/owner-assistant.md#ast-req-009) | Zapisane przed pomiarem porównywalne czynności, okres i podstawa kosztów w planie pomiaru | start |
| release-gate | [AST-REQ-009](../specs/owner-assistant.md#ast-req-009) | Twierdzenia empiryczne dopiero po rzeczywistych pomiarach | release |

**State:** not-started. **Decision gates:** metoda porównania należy do planu, nie globalnej DEC. **Readiness:** brak dowodów planu i danych pomiaru. **Proof:** 12−8=4 h/miesiąc; 120 PLN/miesiąc oraz osobno koszt zapytania. Brak porównywalnego punktu odniesienia nie pozwala deklarować oszczędności; trafność scenariuszy można ocenić tylko po uzyskaniu późniejszych wyników rzeczywistych. Dowody: brak.

### TASK-AST-005

**Cel/przepływ:** właściciel pyta o zapisane warianty rozwoju z określoną kwalifikacją i śledzi cytowane liczby do SCN/ECO, porównując co najmniej dwa wykonalne warianty oraz trzy przypadki ekonomiczne i niepewność. **Coverage:** AST-REQ-008 / AST-AC-007. Bez nowego modelu finansowego AST i bez wymagania pełnego asystenta dla wczesnego INV.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-006](investment-scenarios.md#task-inv-006), [TASK-AST-002](#task-ast-002) | Pełna odpowiedź o rozwoju oparta na źródłach oraz istniejąca obsługa uprawnień i redakcji | demonstration |
| contract-input | [SCN-REQ-022](../specs/scenarios-comparison.md#scn-req-022), [ECO-REQ-016](../specs/economics-investment.md#eco-req-016) | Horyzont, gotówka, niepewność i siedem rodzin, nie sama izolacja | start |
| release-gate | [AST-REQ-005](../specs/owner-assistant.md#ast-req-005), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Te same bramki dostępu i przekazania danych do AI co przy pytaniach | release |

**State:** not-started. **Decision gates:** brak nowej; brzmienie rozszerzonych pytań wybierane w planie. **Readiness:** potrzebne wspólne wyniki i zatwierdzenia, kontrakt znany. **Proof:** wariant osoby i miesiarki jest wykonalny, niezweryfikowany drugi sklep nie liczy się do 2; CAPEX/OPEX, przepływy pieniężne, próg rentowności, niepewność i 3 przypadki pozostają zachowane. Cytaty prowadzą do sprawdzalnych funkcji, bez modyfikacji danych. Dowody: brak.
