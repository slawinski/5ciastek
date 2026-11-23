# MAP — Mapa, demo i aktualność

Owner [MAP](../specs/flow-map-demo.md); EVT dostarcza fakty, PRC/STK/ECO reguły. [Common task/evidence contract](README.md#task-contract). Geometria nie jest symulatorem lokalu ani drugim rendererem.

### TASK-MAP-001

**Cel/przepływ:** demonstrator wybiera A/B/C/D i seed, uruchamia przebieg, zatrzymuje go pauzą, wykonuje krok lub restart oraz pobiera i otwiera wersjonowany JSON. Zestaw testowy → geometria → jeden renderer i lista pokazują etapy, rozgałęzienia i transfery potwierdzone w danych. Pełny przepływ testowy obejmuje razem sterowanie, jedną geometrię oraz dostępny renderer i listę, nie sam UI. Backend danych rzeczywistych nie jest potrzebny.

**Coverage:** MAP-REQ-001–011, MAP-REQ-014, MAP-REQ-016–017 / MAP-AC-001–010, MAP-AC-013, MAP-AC-015; PRC-REQ-001–005, PRC-REQ-007, STK-REQ-001, ECO-REQ-001 jako wspólne kontrakty. Wejścia: wersjonowany uporządkowany zestaw testowy, seed lub jawne zdarzenia, stabilne identyfikatory i jednostki. Bez rzeczywistych identyfikatorów i zapisów produkcyjnych, solvera, przeciągania i upuszczania, fizycznych tras i własnego silnika produkcji; biblioteka grafu opcjonalna.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [EVT-REQ-001](../specs/production-records.md#evt-req-001), [EVT-REQ-009](../specs/production-records.md#evt-req-009), [PRC-REQ-001](../specs/process-execution.md#prc-req-001) | Znormalizowana projekcja, nie wymaganie trwałego producenta ani rozstrzygnięcia DEC | start |
| optional-adapter | [TASK-MAP-002](#task-map-002), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Dane rzeczywiste i planowane obciążenie nie blokują demo | demonstration |
| release-gate | [TASK-REC-007](recipes.md#task-rec-007), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Izolacja demo, oznaczenie źródła, dowody UI i braku fikcyjnego ruchu | release |

**State:** not-started. **Decision gates:** zestaw testowy nie rozstrzyga DEC-001/002; żadna nie blokuje dokładnego izolowanego demo. **Readiness:** kontrakty określone, brak dowodu implementacji zestawu testowego. **Proof:** 8+ etapów, 2 korzenie, 2 partie, rozgałęzienie, złączenie i wiele rzędów; układ pozostaje stabilny po aktualizacji stanu, krok wykonuje jedno zdarzenie. Prędkości 1×/60× dają identyczne wyniki, dane ręczne i symulowane są równoważne, 2 szablony dają ten sam wynik domenowy; nakład wynosi 15+15 osobominut, etap pasywny nie tworzy punktów ruchu. Sprawdzić powiększanie, przesuwanie, szczegóły, drogę, filtry, klawiaturę, listę, ograniczenie ruchu i telefon; animacja jest oddzielna, bez pełnego renderowania grafu w każdej klatce. Dowody: brak.

### TASK-MAP-002

**Cel/przepływ:** uprawniony użytkownik wybiera rzeczywiste źródło, odczytuje fakty, aktualność i agregaty dla określonego zakresu, traci połączenie, widzi historyczny obraz stanu ze znacznikiem czasu i wraca bez podwójnego transferu. Rozróżnia deklarowaną obsadę, unikalne osoby, maszyny i opóźnienia zależne od planu.

**Coverage:** MAP-REQ-003, MAP-REQ-007–008, MAP-REQ-010–017 / MAP-AC-003, MAP-AC-007–015. Wejścia: interwał odświeżania i próg nieaktualności jawne u adaptera; potwierdzenie źródła nie jest wiekiem zdarzenia. Plan i wersja są potrzebne tylko do porównania opóźnień. Bez obowiązku SSE/WebSocket, tożsamości lub kamery ani nieudowodnionej telemetrii.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-MAP-001](#task-map-001), [TASK-OBS-001](production-recording.md#task-obs-001) | Istniejący renderer i źródło rzeczywistych aktywności | demonstration |
| implementation-prerequisite | [TASK-OBS-003](production-recording.md#task-obs-003) | Tylko twierdzenia o rzeczywistych ilościach, transferach i stratach | demonstration |
| implementation-prerequisite | [TASK-OBS-004](production-recording.md#task-obs-004) | Tylko twierdzenia o rzeczywistym zajęciu maszyn | demonstration |
| implementation-prerequisite | [TASK-OBS-002](production-recording.md#task-obs-002) | Tylko odbiorca skorygowanej historii | demonstration |
| optional-adapter | [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [WRK-REQ-012](../specs/workforce.md#wrk-req-012), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Opóźnienia, unikalne osoby i planowane obciążenie wymagają tylko swoich źródeł, nie anonimowego wariantu podstawowego | demonstration |
| release-gate | [TASK-ASS-004](engineering-assurance.md#task-ass-004), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | P1 oraz prywatność i dostęp we właściwym zakresie | release |

**State:** blocked. **Decision gate:** DEC-002 trwała kolejność, współbieżność i wznowienie połączenia. **Readiness:** demo na danych testowych nie dowodzi gotowości do danych rzeczywistych. **Proof:** 4 h fermentacji z poprawnym sprawdzeniem źródła zachowuje aktualność, błąd jest widoczny od razu, przekroczenie progu oznacza nieaktualność, pauza demo nie oznacza awarii. Wznowienie nie odtwarza transferu T ponownie; start nie oznacza transferu ani zajęcia pieca. 1+1 anonimowych deklaracji nie oznacza 2 unikalnych osób; brak planu nie oznacza 0 opóźnienia, brak alokacji nie daje dokładnych kosztów, odmowa dostępu do źródła nie ujawnia danych. Dowody: brak.

### TASK-MAP-003

**Cel/przepływ:** uprawniony użytkownik wybiera historyczną zmianę lub okres i odtwarza je tylko do odczytu w tym samym rendererze i listach z historyczną etykietą, bez zmiany źródła i nigdy jako LIVE.

**Coverage:** MAP-REQ-018 / MAP-AC-016. Wejścia: zapisana historia, projekcja, wersja i okres; nie jest to obowiązkowa bramka wcześniejszego MVP.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-MAP-001](#task-map-001), [TASK-OBS-002](production-recording.md#task-obs-002) | Istniejący renderer i odtwarzalna zapisana lub skorygowana historia; tryb danych rzeczywistych na bieżąco nie jest potrzebny | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [EVT-REQ-009](../specs/production-records.md#evt-req-009) | Dostęp do historii, retencja i brak modyfikacji źródła | release |

**State:** blocked. **Decision gate:** DEC-002 semantyka odtwarzania trwałych danych. **Readiness:** kontrakt zachowany, decyzja i rzeczywiste zapisy niezweryfikowane. **Proof:** ta sama projekcja historyczna, tylko odczyt i widoczny okres; ponowne otwarcie nie wywołuje ruchów, brak uprawnień skutkuje odmową dostępu. Dowody: brak.
