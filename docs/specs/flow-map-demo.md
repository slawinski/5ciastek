# Flow map and demo

## Purpose and actors

Piekarz i właściciel oglądają proces, partie i zasoby; demonstrator odtwarza przykładowe sytuacje. Mapa jest tylko do odczytu. Ten sam renderer i alternatywna lista konsumują jedną projekcję dla SYMULACJI oraz LIVE. Układ dostarcza wyłącznie geometrię, nie drugi renderer/listę ani model produkcji. Demo jest opcjonalnym narzędziem testów i prezentacji, nie pełną ekonomią firmy ani warunkiem scenariusza inwestycyjnego.

## Data and authority

Wejścia: wersjonowana topologia ze stabilnymi ID etapów/operacji, skierowane transfery, rozgałęzienia, złączenia i wspólne zasoby; wersja układu/szablonu; projekcja według [EVT-REQ-001](production-records.md#evt-req-001); przykładowy przebieg według [PRC-REQ-001](process-execution.md#prc-req-001), [PRC-REQ-002](process-execution.md#prc-req-002), [PRC-REQ-003](process-execution.md#prc-req-003); ilości i przeliczenia według [STK-REQ-001](stock-inventory.md#stk-req-001). Demo nie definiuje nowej semantyki zdarzeń ani przeliczenia kg na sztuki.

Fixture deklaruje schemaVersion i kolejność; zdarzenia zachowują eventId, scenarioId (metadane demo, nie wymóg API produkcji), batchId, type, occurredAt, sequence, source=simulation, payload i wspólną kopertę EVT. Obejmuje batch_created, activity_started, activity_completed (nie osobny „stop”), quantity_moved, loss_recorded, resource_reserved i resource_released; przy zmianie obsady/korekcie także worker_count_changed i event_corrected według EVT. Resource_reserved w tej projekcji oznacza potwierdzone zajęcie wykonawcze, nie plan. Partie mają stabilne ID, recepturę/produkt, kg, planowane sztuki, status, etap i historię.

Wyjście projekcji obejmuje nodeId, activeBatchIds, status, quantityWithUnit, capacity, workerCount, duration, source i asOf oraz kierunek i ilość/jednostkę transferu. Rozróżnia brak danych, potwierdzone zero i wynik oszacowany. Źródło rzeczywiste może pochodzić z ręcznych zdarzeń; nie wymaga czujników. Nieobecność transferu lub faktu zajęcia nie jest dowodem ich wystąpienia.

## Lifecycle and boundaries

Demo: wybór scenariusza → ustalony początek → uruchomienie/pauza/krok → zakończenie lub restart. Zegar jest wirtualny. LIVE: oczekiwanie na źródło → potwierdzony odczyt → błąd/nieaktualność z historycznym snapshotem → spójne wznowienie. Czas ostatniego zdarzenia nie jest czasem potwierdzenia źródła. Przełączenie źródła zmienia oznaczenie i zakres metryk, nie ich właściciela. Korekty pochodzą z EVT, nie z edycji na mapie.

REPLAY wcześniej zapisanej zmiany pozostaje przyjętym dalszym zakresem odczytu bez modyfikacji danych; nie jest obowiązkową bramką demo, LIVE ani inwestycji. Nie obejmuje edytora drag-and-drop, zapisu ręcznych pozycji, dodawania urządzeń na płótno, importu rzutu, ścian/drzwi, metrów, tras, kongestii, dopasowania lokalu, SCADA, sterowania, automatycznej identyfikacji pracowników, kamer, AI, fizycznego digital twin, prognozy popytu ani solvera CAPP. Inspiracja czytelnością map fabrycznych nie upoważnia do kopiowania cudzej grafiki/UI.

## Requirements

### MAP-REQ-001

Dla tych samych danych, wersji, ustawień i seed albo w pełni zadanego zestawu zdarzeń demo musi wytworzyć tę samą uporządkowaną sekwencję i wyniki, oznaczając każde zdarzenie jako simulation. Musi umożliwić pobranie wersjonowanego fixture JSON i ponowne odtworzenie bez znajomości silnika przez renderer. Dane/identyfikatory demo nie mogą zanieczyścić rejestru produkcyjnego ani rzeczywistych partii; obowiązuje izolacja [SCN-REQ-001](scenarios-comparison.md#scn-req-001).

### MAP-REQ-002

Demonstrator musi móc wybrać scenariusz, uruchomić go, zatrzymać zegar wirtualny pauzą, wykonać jedno zaplanowane zdarzenie krokiem i wrócić restartem do ustalonego początku. Zmiana prędkości (np. 1×/10×/60×) musi zmieniać tempo prezentacji, nie kolejność, ilości lub czasy domenowe wyniku.

### MAP-REQ-003

Renderer i lista muszą konsumować tę samą wersjonowaną projekcję niezależnie od źródła. Dla równoważnych danych manual/simulation po normalizacji tożsamości i metadanych źródła/czasu zapisu muszą pokazywać te same stany, bilans i osobominuty. Brak backendu live nie może blokować zgodnego fixture; demo nie implementuje ręcznego rejestratora.

### MAP-REQ-004

Demo musi udostępnić jawnie przykładowe scenariusze: pojedynczy chleb od surowców przez mieszanie, autolizę, fermentację, dzielenie, formowanie, garowanie, piec i chłodzenie do sklepu; co najmniej dwie partie ze wspólnym piecem i oczekiwaniem; stratę z drogą do odpadu; przerwę/brak obsady z trwającym etapem pasywnym i czekającą pracą aktywną. Brak wejścia musi dać niezweryfikowane ograniczenie, nie fikcyjną przepustowość; reguły wykonania i bilansu pozostają u PRC/STK.

### MAP-REQ-005

Układ musi wyznaczać deterministyczne położenia i geometrię skierowanych krawędzi z wersjonowanej topologii lub stałego szablonu, obsługując wiele korzeni, grupy/strefy, wiele rzędów, rozgałęzienia, złączenia i równoległe drogi wynikające z procesu. Nie może wymuszać jednego łańcucha wszystkich produktów. Kierunki i przebieg połączeń muszą być czytelne, bez zbędnych przecięć tam, gdzie pozwala topologia.

### MAP-REQ-006

Aktualizacja statusu, liczników lub wieku zdarzenia nie może zmieniać pozycji ani geometrii połączeń. Ta sama topologia i wersja układu muszą być wspólne dla demo/live. Zmiana szablonu prezentacji nie może zmieniać czasów, pojemności, ilości ani innych wyników produkcyjnych.

### MAP-REQ-007

Węzeł musi pokazać nazwę, stabilny identyfikator, stan idle/active/waiting/blocked/complete/unknown, liczbę aktywnych partii i ilość z jednostką według projekcji. Dostępne czas trwania/estymowany czas pozostały, obsada i zajętość muszą zachować kwalifikację źródła; brak jest nieznany, nie zero. Aktualizacja jednej partii nie może zmienić innej.

### MAP-REQ-008

Animacja kierunkowa może odpowiadać tylko potwierdzonemu transferowi lub jednoznacznie oznaczonemu modelowi symulacji. Pasywna fermentacja i bezczynność nie mogą tworzyć fikcyjnych punktów transportu. Ilość na krawędzi musi mieć jednostkę; przepływ kg/h lub szt./h wymaga wiarygodnego okna pomiaru, bez którego system pokazuje brak pomiaru.

### MAP-REQ-009

Użytkownik musi móc powiększać, przesuwać i dopasować widok oraz otworzyć szczegóły węzła (partie, ilości, czasy, błędy, źródło), drogę partii i filtr partii/produktu/zmiany. Te czynności nie mogą edytować domeny ani układu; mapa nie udostępnia drag-and-drop, zmiany połączeń lub zapisu pozycji.

### MAP-REQ-010

Mapa musi zachować te same liczby i znaczenie stanów w alternatywnej liście, przy zatrzymaniu ruchu i prefers-reduced-motion. Klawiatura z widocznym focusem, telefon, tablet, desktop i powiększenie muszą pozwalać odczytać dane bez polegania wyłącznie na kolorze lub ruchu. Legenda rozróżnia aktywny, oczekujący, zablokowany, nieznany, ukończony i symulowany stan według [design systemu](../design-system.md); obowiązuje web brutalism i reużycie wspólnych komponentów.

### MAP-REQ-011

Interfejs musi stale pokazywać źródło, wersję/czas projekcji i odrębnie czas ostatniego zdarzenia oraz ostatniego potwierdzonego odczytu źródła. Bez danych rzeczywistych nie może oznaczać symulacji jako LIVE ani mieszać demo i rzeczywistości w jednej nieoznaczonej metryce produkcyjnej.

### MAP-REQ-012

Nieudany odczyt musi natychmiast ujawnić błąd źródła; przekroczenie jawnego progu aktualności adaptera bez potwierdzenia musi oznaczyć stale/unknown. Zachowany snapshot musi mieć historyczny czas i nie może udawać bieżących transferów. Poprawne odczyty podczas ciszy zdarzeń utrzymują aktualność; pauza demo nie jest awarią LIVE.

### MAP-REQ-013

Po powrocie źródła system musi odtworzyć spójny snapshot bez ponownej animacji już przetworzonych transferów. Rzeczywiste aktywności, ilości/straty, zajętość i korekty muszą pochodzić z obsługujących je faktów EVT, nie z samego start/stop. Transport live może zacząć od snapshotu/odświeżania; SSE/WebSocket nie są obowiązkowe bez uzasadnienia potrzebą opóźnień.

### MAP-REQ-014

Dashboard musi rozdzielić ilości kg/szt., liczbę partii w toku, produkcję, zadeklarowaną obsadę operacji i unikalne osoby ustalone z wiarygodnego źródła z deduplikacją. Suma anonimowych workerCount nie może zostać podpisana jako liczba obecnych ludzi. Dane imienne WorkSession wolno konsumować tylko przy uprawnieniach; widok nie ujawnia tożsamości ani obrazów pracowników. Anonimowe segmenty, dostępność i obecność zachowują rozróżnienie [WRK-REQ-001](workforce.md#wrk-req-001).

### MAP-REQ-015

Gdy dashboard pokazuje aktywne maszyny, oczekiwanie/wąskie gardła i opóźnienia, musi wskazać rzeczywisty fakt zajęcia, zakres/okno pomiaru i zatwierdzony plan potrzebny do porównania opóźnienia. Planowane obciążenie pozostaje osobno oznaczone; bez źródła zajęcia lub planu system pokazuje odpowiednio brak danych lub brak porównania, nie aktywność i zero opóźnienia.

### MAP-REQ-016

Jeżeli dashboard prezentuje nakład lub koszt współdzielonej pracy, musi konsumować [ECO-REQ-001](economics-investment.md#eco-req-001), zachowując jawny podział i kwalifikację nieuzgodnionego kosztu. Agregat obsady/obecności nie stanowi dokładnej alokacji ani miesięcznego rachunku ekonomicznego.

### MAP-REQ-017

Przy odczycie chronionego źródła serwer musi egzekwować uprawnienia według [assurance](../engineering-assurance.md); odmowa nie może ujawnić danych ani zmienić stanu domeny. Błędy źródła i uprawnień muszą być odróżnione od pustego stanu. Dla trwałych danych stosuje się politykę walidacji, idempotencji, współbieżności, historii, backupu, migracji i retencji; sam widok nie dodaje zapisu, nowej retencji ani deklaracji zgodności prawnej.

### MAP-REQ-018

W dalszym zakresie REPLAY użytkownik musi móc odtworzyć wcześniej zarejestrowaną zmianę w tym samym widoku bez zmieniania danych źródłowych, z oznaczeniem odtwarzanego okresu zamiast LIVE. Ten zakres nie jest warunkiem ukończenia wcześniejszych wycinków.

## Acceptance criteria

### MAP-AC-001

Sprawdza [MAP-REQ-001](#map-req-001), [MAP-REQ-003](#map-req-003). Dwa odtworzenia fixture tej samej wersji/seed dają identyczną sekwencję i wyniki; pobrany JSON otwiera renderer bez wiedzy o silniku. Każde zdarzenie ma simulation i nieprodukcyjne ID. Snapshot rzeczywistych partii i zdarzeń przed/po jest niezmieniony.

### MAP-AC-002

Sprawdza [MAP-REQ-002](#map-req-002), [MAP-REQ-011](#map-req-011). Przy wirtualnym czasie 08:00 pauza zatrzymuje czas i stan bez utraty liczb; krok stosuje dokładnie następne zdarzenie, restart odtwarza ustalony początek. Odtworzenie 1× i 60× zachowuje kolejność, ilości i czasy domenowe; oznaczenie SYMULACJA pozostaje widoczne.

### MAP-AC-003

Sprawdza [MAP-REQ-003](#map-req-003), [MAP-REQ-016](#map-req-016). Równoważna para fixture manual/simulation po normalizacji ID i metadanych daje identyczne stany i bilans. Dla 30 min pracy jednej osoby współdzielonej 50/50 projekcja pokazuje 15+15 osobominut; bez podziału nie daje dokładnego kosztu. Fermentacja pasywna nie zajmuje stale tej osoby.

### MAP-AC-004

Sprawdza [MAP-REQ-004](#map-req-004). Demonstrator odtwarza A (pełna ścieżka chleba), B (partie z różnym startem, piec 20 szt., wsady 12+12 i oczekiwanie), C (20 kg wejścia, strata 0,5 kg, 19,5 kg pozostałości i droga do odpadu), D (brak obsady: pasywny etap trwa, aktywny czeka). Brak pojemności w B daje niezweryfikowaną zdolność zamiast fikcyjnego wyniku. Wszystkie czasy są podpisane jako przykładowe.

### MAP-AC-005

Sprawdza [MAP-REQ-005](#map-req-005), [MAP-REQ-006](#map-req-006). Fixture ma co najmniej 8 etapów, dwa korzenie surowców, złączenie, rozgałęzienie do sklepu/odpadu i dwie równoległe partie. Dwa otwarcia tej samej topologii/wersji dają ten sam wielorzędowy układ stref i czytelne kierunki. Zmiana liczby przy piecu nie przesuwa pieca ani krawędzi. Demo i LIVE tej topologii wykorzystują ten sam wynik układu.

### MAP-AC-006

Sprawdza [MAP-REQ-006](#map-req-006), [MAP-REQ-009](#map-req-009). Dwa szablony tej samej topologii mają inne położenia, ale identyczne zdarzenia/czasy/ilości. Zoom, pan i dopasowanie nie zmieniają domeny; nie ma edytora, przycisku zapisu pozycji ani drag-and-drop.

### MAP-AC-007

Sprawdza [MAP-REQ-007](#map-req-007), [MAP-REQ-009](#map-req-009). Activity_started A zmienia tylko A; B zachowuje swój stan. Filtr A pokazuje jej drogę i szczegóły z ilością/jednostką, źródłem i błędami; filtr produktu/zmiany nie przepisuje danych. Brak czasu zakończenia nie tworzy odliczania 0 ani nie usuwa znanej ilości.

### MAP-AC-008

Sprawdza [MAP-REQ-008](#map-req-008). Quantity_moved prowadzi oznaczony ruch od źródła do celu i pokazuje ilość. Cztery godziny fermentacji bez transferu oraz bezczynny węzeł nie generują punktów. Bez okna pomiarowego ilość pozostaje dostępna, lecz kg/h pokazuje brak pomiaru, nie 0.

### MAP-AC-009

Sprawdza [MAP-REQ-010](#map-req-010). Użytkownik klawiaturą z widocznym focusem otwiera węzeł, drogę partii i listę. Na desktopie/tablecie oraz telefonie i przy powiększeniu odczytuje te same stany i liczby co diagram. Zatrzymanie ruchu i prefers-reduced-motion wyłączają punkty, nie informacje; legenda i błąd pozostają zrozumiałe bez koloru.

### MAP-AC-010

Sprawdza [MAP-REQ-011](#map-req-011), [MAP-REQ-012](#map-req-012). Przy ostatnim zdarzeniu 08:00, czterogodzinnej fermentacji i poprawnym odczycie o 12:00 źródło jest aktualne; widoczne są oba czasy. Wybór demo nie podpisuje fixture jako LIVE ani nie dodaje jego produkcji do rzeczywistej metryki.

### MAP-AC-011

Sprawdza [MAP-REQ-012](#map-req-012), [MAP-REQ-013](#map-req-013). Dla przykładowego jawnego progu adaptera 60 s błąd odczytu jest widoczny od razu, a po 61 s bez potwierdzenia snapshot jest historyczny/stale z czasem i bez bieżącego ruchu. Po wznowieniu spójny snapshot zawiera transfer T jeden raz i nie animuje go ponownie. Pauza demo nie wywołuje awarii LIVE. Wartość 60 s nie ustanawia globalnego progu.

### MAP-AC-012

Sprawdza [MAP-REQ-013](#map-req-013), [MAP-REQ-015](#map-req-015). Źródło live dostarcza wyłącznie start/stop: widoczne są aktywności, ale brak transferów i brak źródła rzeczywistego zajęcia pieca. Sam plan rezerwacji nie włącza wskaźnika faktycznego zajęcia. Po dołączeniu potwierdzonych faktów EVT pojawiają się tylko odpowiadające im dane; korekta używa aktualnej projekcji EVT.

### MAP-AC-013

Sprawdza [MAP-REQ-014](#map-req-014), [MAP-REQ-016](#map-req-016). Dwie równoległe anonimowe operacje workerCount=1 pokazują sumę deklaracji obsady z zastrzeżeniem, nie „2 obecne osoby”. Kg i sztuki oraz liczba partii są osobnymi metrykami. Brak podziału wspólnej pracy daje koszt nieuzgodniony; widok nie ujawnia nazwisk ani obrazów.

### MAP-AC-014

Sprawdza [MAP-REQ-015](#map-req-015). Bez faktu zajęcia i zatwierdzonego planu dashboard pokazuje brak danych o aktywności maszyny i brak porównania opóźnienia. Dodanie zatwierdzonego planu umożliwia porównanie wyłącznie dla jego wersji, ale nie tworzy faktu zajęcia. Zmiana filtrów zachowuje widoczny zakres agregacji i oczekiwania.

### MAP-AC-015

Sprawdza [MAP-REQ-017](#map-req-017). Użytkownik bez uprawnienia do źródła otrzymuje odmowę bez ujawnienia projekcji i bez zmiany domeny. Uprawniony użytkownik dla pustego źródła widzi pusty stan; błąd źródła nie udaje zera ani sukcesu. Dostęp do WorkSession wymaga odrębnego uprawnienia i nie dodaje tożsamości do mapy.

### MAP-AC-016

Sprawdza [MAP-REQ-018](#map-req-018). W późniejszym REPLAY użytkownik odtwarza zapisaną zmianę z oznaczonym okresem historycznym; stan rzeczywistych rekordów przed/po jest identyczny i nagłówek nie brzmi LIVE. Brak REPLAY nie blokuje wykonania MAP-AC-001–015.

## Dependencies and readiness

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | EVT-REQ-001, EVT-REQ-002 | Koperta, projekcja i korekty; nie drugi model animacji | start |
| contract-input | PRC-REQ-001, PRC-REQ-002, PRC-REQ-003, STK-REQ-001 | Semantyka i jednostki wspólne z rzeczywistością | start |
| implementation-prerequisite | MAP-REQ-001, MAP-REQ-005 | Fixture i jedyna geometria dla demonstracji renderera/listy | demonstration |
| implementation-prerequisite | MAP-REQ-003, MAP-REQ-013 | Renderer i źródło odpowiednich rzeczywistych faktów tylko dla używanego zakresu LIVE | demonstration |
| contract-input | WRK-REQ-001, ECO-REQ-001, PLN-REQ-001 | Rozróżnienie obecności, nakładu, kosztu i zatwierdzonego planu; plan tylko dla opóźnień | start |
| optional-adapter | PLN-REQ-001 | Planowane obciążenie oznaczone osobno, nie bramka demo | demonstration |
| release-gate | MAP-REQ-011, MAP-REQ-012, MAP-REQ-017 | Źródło/aktualność/zakres, ochrona pracowników i polityka kontroli dla rzeczywistych danych | release |
| release-gate | MAP-REQ-010 | Wspólny design system i dostępność UI | release |

DEC-002 pozostaje otwarta na trwałej granicy kolejności/współbieżności/replay; fixture nie ustanawia partycji globalnej ani per-partia. DEC-001 dotyczy zależnych trwałych mas. Wybór biblioteki grafu jest propozycją techniczną, nie wymaganiem instalacji. Topologia, geometria i stan pozostają rozdzielone; zachowany źródłowy cel wydajności oznacza brak przebudowy całego grafu co klatkę animacji (oddzielna warstwa animacji), nie wybór silnika/biblioteki. Dowód płynnego demo i testy z identyfikatorem kodu nie dowodzą poprawności rzeczywistych ilości, zajętości ani modelu biznesu. Wymagane kontrole błędów, odmowy, izolacji i trwałości zgodnie z assurance są pracą wydania, nie zainstalowanym mechanizmem deklarowanym przez dokument.
