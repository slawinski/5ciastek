# OBS — Rejestracja rzeczywistej produkcji

Właściciel [EVT](../specs/production-records.md), wspólne [PRC](../specs/process-execution.md)/[STK](../specs/stock-inventory.md)/[ECO](../specs/economics-investment.md). [Wspólna forma/dowody](README.md#task-contract). Niezależny projekt, nie bramka ręcznego INV.

### TASK-OBS-001

**Cel/przepływ:** piekarz tworzy partię z publikacji, zapisuje kontekst, na telefonie lub tablecie prowadzi autolizę → fermentację w masie ze składaniem → formowanie, zmienia obsadę i ponownie otwiera kartę oraz historię. Minimalny UI i rzeczywisty zapis są dostarczane razem, nie samo API ani cały epik.

**Coverage:** EVT-REQ-001, EVT-REQ-003–010, EVT-REQ-014–015 (brak fikcyjnych danych); EVT-AC-001–009, EVT-AC-012, EVT-AC-016; PRC-REQ-001, PRC-REQ-004, PRC-REQ-006–007 / PRC-AC-001, PRC-AC-005, PRC-AC-007–008; WRK-REQ-001 / WRK-AC-001. Wejścia: wersja i skala, wersja planu, jeśli jest realizowany, partia, aktywność, aktor, źródło, schemat oraz occurredAt/recordedAt/sequence, kontekst pomiar/estymacja/brak i anonimowe liczby osób. Nieplanowany etap ma nazwę; domyślna obsada aktywnej czynności wynosi 1, pasywna obsada 0 jest dozwolona. Bez naliczania płac, kamery, solvera i wymyślonych ilości lub zajęć zasobów. Fakt odchylenia pozostaje faktem, nie jest kasowany przez plan.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-003](recipes.md#task-rec-003) | Trwała niezmienna wersja receptury do realnej partii | demonstration |
| contract-input | [REC-REQ-002](../specs/recipes.md#rec-req-002), [PRC-REQ-001](../specs/process-execution.md#prc-req-001), [WRK-REQ-001](../specs/workforce.md#wrk-req-001), [ECO-REQ-001](../specs/economics-investment.md#eco-req-001) | Skala/czas, rozdział faktów i alokacja bez drugiego silnika | start |
| optional-adapter | [MAP-REQ-003](../specs/flow-map-demo.md#map-req-003), [PLN-REQ-001](../specs/production-plans.md#pln-req-001) | Mapa i wskazana wersja planu, nie wspólne bramki | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-REC-007](recipes.md#task-rec-007) | P1, tożsamości tylko z celem/prawem, UI | release |

**State:** blocked. **Decision gates:** DEC-002 przed rozpoczęciem trwałej koperty, kolejności i współbieżności; DEC-001 dla trwałej masy partii. **Readiness:** można demonstrować zestaw testowy i kartę, nie trwały zapis rzeczywistych danych. **Proof:** czasy 08:00/08:05 są rozróżnione, przejście o 08:45 jest atomowe, autoliza trwa 45 min przy 0 stałej pracy, składanie przez 5 min nie kończy fermentacji w masie, 10×1+20×2=50 osobominut. Stop bez startu i ujemny czas są odrzucone; ponowienia i dwa urządzenia nie dublują faktów. Partie A/B są niezależne, przebieg nocny trwa 120 min; znormalizowana projekcja danych ręcznych i symulowanych jest równoważna, ponowne otwarcie nie wywołuje skutków ubocznych. Brak źródła nie daje pustego sukcesu, brak ilości lub zajęcia nie oznacza 0; sprawdzić odmowy oraz telefon i tablet. Dowody: brak.

### TASK-OBS-002

**Cel/przepływ:** uprawniony korektor wskazuje wpis, oczekiwaną wersję, powód i wartości przed oraz po zmianie; otrzymuje atomowo nową projekcję czasu i nakładu albo konflikt z ID oraz niezmienioną spójną historię. Waliduje wszystkie zależności istniejące w chwili wdrożenia, bez cichego przesuwania faktów.

**Coverage:** EVT-REQ-001–002, EVT-REQ-007–009, EVT-REQ-015 / EVT-AC-006, EVT-AC-008, EVT-AC-014–015, EVT-AC-019 (rozszerzenie zasobowe); PRC-REQ-006 / PRC-AC-007. Wejścia: zdarzenie, wersja, autor i powód, istniejące odcinki i fakty. Bez kasowania, automatycznej naprawy, zmian WorkSession lub grafiku ani bezterminowej retencji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](#task-obs-001) | Pierwsza korekta czasu/nakładu, nie oczekiwanie na przyszłe ilości/zasoby | demonstration |
| contract-input | [STK-REQ-001](../specs/stock-inventory.md#stk-req-001), [PRC-REQ-002](../specs/process-execution.md#prc-req-002) | Walidacja każdej już istniejącej zależności odpowiedniego typu | start |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004), [TASK-ASS-003](engineering-assurance.md#task-ass-003) | Awarie, restart, audyt i pełne zależności danego typu korekty | release |

**State:** blocked. **Decision gates:** DEC-002 trwałe wersjonowanie, współbieżność i odtwarzanie; DEC-001 dodatkowo dla poprawianych mas. **Readiness:** reguła atomowości kompletna, brak decyzji i implementacji. **Proof:** 11:40–12:10×2 po zmianie końca na 12:00 daje 20 min/40 osobominut z wartościami przed i po. Odmowa, brak powodu, koniec przed początkiem, zależny odcinek lub nieaktualna wersja pozostawiają dane bez zmian. Jeśli ilości lub zasoby istnieją: niższa ilość powoduje konflikt z późniejszym transferem, zwolnienie o 10:40 konflikt z B o 10:30; żaden odbiorca nie jest częściowo zmieniony. Restart odtwarza tę samą projekcję. Dowody: brak.

### TASK-OBS-003

**Cel/przepływ:** operator na karcie potwierdza transfer/stratę, dzieli lub łączy źródła i odczytuje bilans/pochodzenie. W tym przepływie wdraża przyjęcie/konwersje STK, nie czeka na całe FEFO/MRP.

**Coverage:** EVT-REQ-001–002, EVT-REQ-007–009, EVT-REQ-011, EVT-REQ-015 / EVT-AC-006, EVT-AC-008, EVT-AC-010–012, EVT-AC-015; STK-REQ-001, STK-REQ-004 / STK-AC-003, STK-AC-009. Wejścia: partia, część, źródło i cel ruchu, ilość i jednostka, miejsce i powód straty, źródło danych, aktor i czas, jawna konwersja i stan otwarcia. Nieznany stan otwarcia wymaga uzupełnienia, nie oznacza 0.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](#task-obs-001) | Zdarzenie, partia i karta | demonstration |
| implementation-prerequisite | [TASK-OBS-002](#task-obs-002) | Wspólne korekty przed udostępnieniem korekt ilości; to zadanie dodaje wszystkie zależności ilościowe, bez odwrotnej krawędzi | release |
| optional-adapter | [MAP-REQ-008](../specs/flow-map-demo.md#map-req-008) | Konsument rzeczywistych transferów | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004) | P1 oraz dowody odmowy, zapisu, ponowienia, bilansu i odtworzenia | release |

**State:** blocked. **Decision gates:** DEC-001 masa i konwersje, DEC-002 uporządkowanie ruchów. **Readiness:** dokładne warunki przyjęcia znane, trwałe granice nierozstrzygnięte. **Proof:** 20−0,5−19,5=0, następne wydanie 1, ilość zerowa, ujemna lub ruch z nieznanego stanu są odrzucone; zdarzenie działa raz. Podział 12+8 jest izolowany, łączenie zachowuje oba ID, kg nie oznacza sztuk bez konwersji; start nie jest ruchem, awaria nie jest sukcesem, zmniejszenie masy unieważniające późniejszy fakt jest atomowo odrzucone. Dowody: brak.

### TASK-OBS-004

**Cel/przepływ:** operator jawnie zajmuje i zwalnia piec oraz odczytuje potwierdzone zajęcie albo brak danych lub konflikt. W tym ograniczonym przepływie dostarcza walidację równoczesności PRC, bez zależności od pełnego solvera lub grafiku.

**Coverage:** EVT-REQ-001–002, EVT-REQ-007–009, EVT-REQ-013, EVT-REQ-015 / EVT-AC-006, EVT-AC-008, EVT-AC-012–013, EVT-AC-019; PRC-REQ-002, PRC-REQ-006 / PRC-AC-003, PRC-AC-007. Wejścia: zasób, partia i aktywność, czasy, aktor i źródło, znana pojemność i zajęcie we wspólnej jednostce albo jawny brak. Plan, start i konfiguracja nie dowodzą faktycznego zajęcia; bez telemetrii lub sterowania.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](#task-obs-001) | Działający zapis i karta | demonstration |
| implementation-prerequisite | [TASK-OBS-002](#task-obs-002) | Wspólna korekta; ten przyrost dodaje odtwarzanie zależności zasobowych, nie odwrotnie | release |
| optional-adapter | [MAP-REQ-015](../specs/flow-map-demo.md#map-req-015), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Odbiorca danych rzeczywistych i oddzielne planowane obciążenie | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004) | P1 oraz dowody współbieżnego dostępu do zasobu i odtworzenia | release |

**State:** blocked. **Decision gate:** DEC-002 kolejność i odtwarzanie dla wspólnego zasobu. **Readiness:** kontrakt znany, trwała współbieżność nieustalona. **Proof:** przydziały 12+12 przy pojemności 20 nie są oba zatwierdzone; zwolnienie wskazanego zajęcia jest idempotentne, nieznana pojemność pozostaje niezweryfikowana, awaria, start i plan nie tworzą zajęcia. Korekta zwolnienia A na 10:40 unieważnia B o 10:30, co daje konflikt z ID i zachowanie starej projekcji, nie wymazanie obserwacji odchylenia. Dowody: brak.

### TASK-OBS-005

**Cel/przepływ:** operator zapisuje uzysk i straty zmiany; analityk porównuje plan/wykonanie, trzy najdłuższe czynności i kwalifikowane wskaźniki użyteczności.

**Coverage:** EVT-REQ-003, EVT-REQ-006, EVT-REQ-010–012, EVT-REQ-016 / EVT-AC-005, EVT-AC-009–011, EVT-AC-017–018; STK-REQ-001–002, ECO-REQ-001 jako kontrakty. Wejścia: planowane i zaobserwowane sztuki i masy, resztki, straty przy dzieleniu, formowaniu i po wypieku, przyczyny, jednostki, źródło i alokacja; okres, mianownik oczekiwanych wpisów i definicja czasu wpisu uzgodnione z użytkownikiem. Bez wymyślonej telemetrii, progów KPI lub zaawansowanego wspólnego ciasta REC-REQ-013.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-003](#task-obs-003) | Pełny raport zaobserwowanych ilości i strat zmiany z aktywnościami | demonstration |
| implementation-prerequisite | [TASK-OBS-002](#task-obs-002) | Skorygowana historia użyta w raporcie | release |
| optional-adapter | [SCN-REQ-006](../specs/scenarios-comparison.md#scn-req-006), [PLN-REQ-001](../specs/production-plans.md#pln-req-001) | Eksport obserwacji ze źródłem i jawna wersja planu | demonstration |

**State:** not-started. **Decision gates:** DEC-001/002 tylko dla zależnych utrwalanych mas i historii, metryka wpisów jest wejściem planowania dla określonego zakresu. **Readiness:** kontrakt znany, rzeczywiste raporty potrzebują źródeł. **Proof:** 20 przed wypiekiem, 19 po i 1 odpadu, 0,2 kg resztki i 0,1 kg straty przy dzieleniu nie tworzą fikcyjnych sztuk ani stanu sprzedawalnego; najdłuższe czynności to 30/20/10 z 30/20/10/5. Nakład 60 osobominut/100 sztuk daje 1 h/100 sztuk; 2/10 brakujących wpisów daje 20%, brak czasu wpisu nie oznacza 0. Receptura pozostaje bez zmian. Dowody: brak.
