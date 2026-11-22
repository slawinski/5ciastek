# SAL — Sales and returns

## Purpose and scope

Sprzedawca lub uprawniony operator importu rejestruje sprzedaż sklepową/B2B; właściciel odczytuje sprzedaż, braki, rabaty i odpad. Celem jest odróżnienie niskiej sprzedaży od ograniczonej dostępności, nie odgadnięcie utraconego popytu. Zdolność obejmuje rzeczywisty raport dzienny SKU i analizę tygodnia. Prognozowanie należy do DEM; wymagana sprzedaż wariantu do [ECO-REQ-007](economics-investment.md#eco-req-007). Gotowy POS i historia sprzedaży nie są warunkiem scenariusza inwestycyjnego.

## Inputs and outputs

Wejście: stabilny SKU, lokalizacja, tożsamość źródła i pozycji transakcji, data/godzina ze strefą, liczba sztuk, cena PLN/szt., kwota i podstawa rabatu, refund, potwierdzenie fizycznego przyjęcia zwrotu oraz kanał sklep/B2B. Import pochodzi z API/webhooku POS albo CSV; wybór jednej ścieżki nie nakazuje wdrożenia wszystkich. Źródło musi ujawnić, czy dostarcza wydania brutto czy wartości już pomniejszone o zwroty. Zapas, gotowość i dopuszczenie do sprzedaży mają właściciela [STK](stock-inventory.md#stk-req-001).

Wyjście: pozycje sprzedaży z rabatami/refundami, rozliczenie importu, dane do bilansu STK, godzina wyprzedania i okresy braku w godzinach handlowych, liczby niesprzedanych/uszkodzonych/przecenionych sztuk z powodami, raport dzienny oraz godzinowy z dniem tygodnia i sezonem. Raport pokazuje okres, lokalizację i kompletność źródeł. Nieznana dostępność lub luka w imporcie nie oznacza zerowej sprzedaży/popytu.

## Lifecycle and invariants

Pozycja jest odebrana, przypisana do SKU i uzgodniona albo pozostaje błędna/nieuzgodniona. Powtórzenie nie tworzy drugiej transakcji. Sprzedaż, refund i fizyczny zwrot są odrębnymi faktami powiązanymi ze źródłem; zmiana nazwy produktu nie zmienia SKU ani historii. Uzgodniony raport jest odczytem wskazanych źródeł, nie zgodą na zmianę zatwierdzonych zamówień B2B. Korekta zachowuje wcześniejsze źródło i powód według [assurance](../engineering-assurance.md#kontrole-zależne-od-funkcji).

## Requirements

### SAL-REQ-001

Przy przyjęciu sprzedaży system musi przypisać pozycję do stabilnego SKU i lokalizacji z datą/godziną, liczbą sztuk, ceną, rabatem, zwrotami oraz kanałem sklep/B2B. Nieznane SKU lub brak wymaganej jednostki musi pozostawić pozycję nieuzgodnioną z czytelną przyczyną, bez przypisania do podobnej nazwy produktu.

### SAL-REQ-002

Przy ponowieniu importu system musi rozpoznać tę samą pozycję źródła i nie dodać jej drugi raz. Wynik importu musi rozróżniać pozycje przyjęte, powtórzone i błędne; sprzeczna treść tej samej pozycji musi być konfliktem do uzgodnienia, nie kolejną sprzedażą.

### SAL-REQ-003

Przy obsłudze zwrotu system musi rozdzielić refund handlowy od potwierdzonego przyjęcia fizycznego według [STK-REQ-002](stock-inventory.md#stk-req-002). Dla źródła netto system musi ujawnić sposób uzgodnienia z wydaniami brutto i oddzielnymi zwrotami; nie może pomniejszyć tej samej sprzedaży o ten sam zwrot drugi raz. Brak rozdziału musi oznaczać nieuzgodniony bilans, nie dokładny wynik.

### SAL-REQ-004

Dla SKU i lokalizacji system musi zapisać godzinę wyprzedania oraz przedziały niedostępności w godzinach handlowych na podstawie jawnych danych dostępności. Powtórzenie tego samego stanu nie tworzy kolejnego początku braku; uzupełnienie kończy przedział. Brak danych dostępności musi być oznaczony jako nieznany, nie jako pełna dostępność.

### SAL-REQ-005

Przy rozliczeniu dnia system musi wykazać niesprzedane, uszkodzone i przecenione sztuki z przyczynami. Przecena nie może sama stanowić odpadu, a niesprzedany wyrób nie może sam stanowić sprzedaży; ruchy odpadu i zapasu pozostają zgodne z [STK-REQ-001](stock-inventory.md#stk-req-001).

### SAL-REQ-006

Na żądanie raportu system musi pokazać dziennie per SKU produkcję przyjętą, wydania sprzedaży, zwroty, stockout, odpad i pozostałość z uzgodnieniem do STK oraz sprzedaż godzinową z dniem tygodnia, sezonem i kanałem. Dla wybranego tygodnia musi odróżnić dzień niskiej sprzedaży przy znanej dostępności od dnia ograniczonego stockoutem, nie nazywając sprzedaży pełnym popytem.

### SAL-REQ-007

Przy pomiarze jakości danych system musi pokazać odsetek dni z pełnym bilansem SKU, udział strat z jawnym mianownikiem i czas braku w godzinach handlowych. Niepełny dzień lub nieznana dostępność musi być widocznym ograniczeniem wskaźnika, nie dniem z zerową stratą/brakiem.

### SAL-REQ-008

Przy imporcie lub odczycie analitycznym system musi ograniczyć dane klientów do celu i uprawnień zgodnie z [assurance](../engineering-assurance.md#kontrole-zależne-od-funkcji); raport SKU nie wymaga identyfikacji klienta. Odmowa dostępu nie może ujawnić danych ani zmienić sprzedaży. Błąd źródła/zapisu musi być widoczny bez fałszywego sukcesu lub zastąpienia ostatnich danych zerem.

## Acceptance criteria

### SAL-AC-001

Dotyczy [SAL-REQ-001](#sal-req-001), [SAL-REQ-002](#sal-req-002). Operator importuje CSV: źródło P, pozycja 7, SKU CH, sklep A, 10:00, 3 szt., 20 PLN/szt., rabat 10%, kanał sklep. Raport pokazuje 3 szt. i 54 PLN po rabacie z danymi źródła. Powtórzenie pliku nie dodaje sztuk/kwoty; ta sama pozycja z 4 szt. daje konflikt. Nieznany SKU nie tworzy nowego produktu po nazwie i jest pokazany jako błąd uzgodnienia.

### SAL-AC-002

Dotyczy [SAL-REQ-003](#sal-req-003). Źródło pokazuje 15 wydań brutto, refund za 2 i fizyczne przyjęcie tych 2 niesprzedawalnych sztuk. Raport nie zamienia wydań w 13 do bilansu STK: [STK-AC-002](stock-inventory.md#stk-ac-002) daje fizyczne 17/sprzedawalne 15 ze stanu 15. Dla importu netto 13 z jawnym rozdziałem na 15 i 2 wynik jest ten sam; bez rozdziału raport oznacza bilans nieuzgodniony. Sam refund nie tworzy przyjęcia, a ponowny import nie ponawia refundu ani ruchu.

### SAL-AC-003

Dotyczy [SAL-REQ-004](#sal-req-004), [SAL-REQ-006](#sal-req-006). Sklep działa 08:00–16:00, CH wyprzedano o 12:00, uzupełniono o 14:00. Raport pokazuje 2 godziny braku, jeden początek mimo ponownego odczytu zera o 13:00 i dzień z ograniczoną dostępnością. Dzień z tą samą liczbą sprzedaży i pełną znaną dostępnością ma inną kwalifikację; dzień bez danych dostępności ma stan „brak danych”, nie „brak stockoutu”.

### SAL-AC-004

Dotyczy [SAL-REQ-005](#sal-req-005), [SAL-REQ-006](#sal-req-006). Z 20 gotowych sztuk sprzedano 12 po cenie regularnej i 3 po przecenie, pozostało 5, w tym 2 uszkodzone do odpisu. Raport pokazuje sprzedaż 15, przecenę 3 z powodem, odpad 2 z powodem i końcowe 3, nie sprzedaż 18 ani odpad 5. Widok godzinowy rozdziela kanał sklep i B2B, a filtr tygodnia/sezonu nie zmienia bilansu źródłowego.

### SAL-AC-005

Dotyczy [SAL-REQ-007](#sal-req-007). Dla 5 dni jednego SKU 4 mają pełny bilans, jeden ma lukę importu. Raport pokazuje kompletność 80%, wskazuje brakujący dzień, udział strat np. 2/20 przyjętych sztuk = 10% dla wskazanego kompletnego zakresu i stockout 120 minut z SAL-AC-003. Nie wypełnia luki zerami.

### SAL-AC-006

Dotyczy [SAL-REQ-008](#sal-req-008). Osoba bez uprawnienia próbuje importować i otworzyć raport z danymi klienta: oba żądania kończą się odmową bez zapisu/ujawnienia. Uprawniony właściciel widzi agregaty SKU bez tożsamości klientów. Awaria POS lub zapisu importu daje komunikat błędu i zakres ostatnich potwierdzonych danych, nie potwierdzenie importu ani zerowy utarg.

## Dependencies and readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [STK-REQ-001](stock-inventory.md#stk-req-001), [STK-REQ-002](stock-inventory.md#stk-req-002), [STK-REQ-004](stock-inventory.md#stk-req-004) | Wydania brutto, przyjęcia i deduplikacja ruchów; SAL nie ustanawia drugiego bilansu | start |
| implementation-prerequisite | [STK-REQ-001](stock-inventory.md#stk-req-001) | Uzgadnianie rzeczywistego stanu w demonstracji bilansu wymaga obsługi użytych ruchów, nie całego magazynu/MRP | demonstration |
| contract-input | [REC-REQ-001](recipes.md#rec-req-001) | Powiązanie stabilnego SKU z wersją produktu, nie bieżącą nazwą | start |
| optional-adapter | [EVT-REQ-001](production-records.md#evt-req-001) | Przyjęta rzeczywista produkcja, gdy zasilana rejestratorem; dopuszczalne jawne źródło wejścia | demonstration |
| release-gate | [Assurance](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania), [design system](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui) | Dostęp, minimalizacja klientów, walidacja, idempotencja, historia, błędy i dowody według ryzyka | release |

POS/API/webhook/CSV jest kontraktem wejściowym SAL-REQ-001/002, nie blokadą ekonomii scenariusza. Szczegóły wybranego źródła, jego tożsamości pozycji i reprezentacji netto wymagają sprawdzenia przed użyciem na danych rzeczywistych; brak informacji blokuje uzgodnienie tego źródła. Precyzja mas i strumień faktów pozostają decyzjami właścicieli, gdy adapter ich używa. Ten dokument nie potwierdza działania importu, ochrony danych ani raportów.
