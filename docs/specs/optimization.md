# OPT — Solver harmonogramu i zdolności

## Purpose-and-scope

Planista wyznacza wykonalny harmonogram, ograniczając nadgodziny, bezczynność, spóźnienia i przeciążenia wąskich gardeł. Piekarz przegląda plan i zgłasza korekty; właściciel porównuje warianty zasobów. To pełny CAPP z solverem ograniczeń, nie LLM i nie wymagany poprzednik ręcznego planowania ani inwestycyjnego sprawdzenia zadanej kolejności. OR-Tools CP-SAT pozostaje przykładem, nie wybranym narzędziem.

## Inputs-and-outputs

Wejściem są wersja planu PLN (SKU, całkowite sztuki/partie, terminy), opublikowane receptury i sieć operacji, planowana dostępność/zmiany/kwalifikacje WRK, ograniczenia odpoczynku i przerw, gdy dotyczą danej osoby, oraz zasoby: stanowiska, miesiarki, piece, koszyki, chłodnie. Pojemność ma jednostkę (np. szt., kg, miejsca), temperatura °C, czas datę/strefę i minuty trwania, praca osobominuty/roboczogodziny. Źródło czasów, pojemności, okien i kwalifikacji pozostaje widoczne. Brak nie jest zerem ani nieskończoną pojemnością.

Wyjściem jest wersjonowana propozycja kolejności, obsady i rezerwacji czasu, lista konfliktów i niezweryfikowanych ograniczeń, wykorzystanie zasobów, plan–wykonanie i warianty porównawcze. Fakt zajęcia urządzenia pochodzi z EVT, nigdy z rezerwacji OPT.

## Lifecycle-and-invariants

Wybór wejść → szukanie harmonogramu → wykonalna propozycja albo konflikty/niezweryfikowane granice → ręczna edycja → ponowne przeliczenie → przyjęcie do szkicu PLN → odrębne zatwierdzenie PLN. Edytowana propozycja nie dziedziczy potwierdzenia wykonalności sprzed edycji. Wykonanie rzeczywiste może odchylać się od planu; jego faktów nie wolno usuwać, aby uzyskać zgodność.

## Requirements

### OPT-REQ-001
System musi przyjąć ręcznie zadane ilości i terminy PLN oraz dostępność i kwalifikacje WRK bez prognozy DEM, B2B i wspólnych rekomendacji obsady. Musi wskazać wersje wejściowe i brakujące ograniczenia.

### OPT-REQ-002
Przy szukaniu harmonogramu system musi stosować [PRC-REQ-001](process-execution.md#prc-req-001), [PRC-REQ-002](process-execution.md#prc-req-002) i [PRC-REQ-003](process-execution.md#prc-req-003). Sieć zależności, czas aktywny/pasywny/pomocniczy, umiejętności i jednoczesna dostępność nie mogą mieć drugiej interpretacji w OPT. Brak odpowiedniej kwalifikacji lub obsady musi być jawnym konfliktem.

### OPT-REQ-003
Solver musi uwzględnić pojemności, podział na wsady, różne temperatury oraz czyszczenie/przezbrojenie według wejściowych ograniczeń PRC. Nie może uznać planu z pominiętym wymaganym czasem pomocniczym za wykonalny.

### OPT-REQ-004
System musi harmonogramować fermentację i retard przez noc oraz granice zmian według PRC. Nie może przyciąć pasywnego etapu do końca zmiany ani przypisać ciągłej pracy człowieka do całej fazy pasywnej bez takiej potrzeby w danych operacji.

### OPT-REQ-005
System musi użyć solvera ograniczeń do znalezienia wykonalnego planu i oceny jawnej funkcji celu. Musi rozróżnić znaleziony wykonalny wynik, udowodniony brak wykonalności, brak rozstrzygnięcia oraz dowód optymalności, jeśli go uzyskano. Nie może nazywać pierwszego rozwiązania globalnym optimum ani przekazać obliczania harmonogramu do LLM.

### OPT-REQ-006
System musi pokazać oś czasu/Gantta i konflikty z operacją, zasobem, przedziałem oraz naruszonym ograniczeniem. Po ręcznej zmianie uprawnionego planisty musi ponownie ocenić konflikty; brak wyniku lub niepełne dane nie mogą być pokazane jako „brak konfliktów”.

### OPT-REQ-007
System musi obliczyć wykorzystanie i bezczynność zasobu względem jawnego okresu jego dostępności, wskazać wąskie gardła i rozdzielić planowane obciążenie od obserwowanego. Odbiorca mapy musi dostać takie samo rozróżnienie.

### OPT-REQ-008
System musi porównać planowane czasy/zasoby z zapisami partii i osobominutami EVT, zachowując tożsamość planu i partii. Brak rzeczywistych zdarzeń oznacza brak porównania, nie zerowe wykonanie. Raport musi uwzględnić nadgodziny, bezczynność, spóźnienia, wykorzystanie pieca i roboczogodziny z ujawnioną podstawą.

### OPT-REQ-009
Uprawniony użytkownik musi móc porównać wariant dodatkowego piekarza, innej zmiany, drugiej miesiarki, większej chłodni i innej kolejności operacji, korzystając z tych samych właścicieli PRC/SCN. Ten sam model obsady musi obsłużyć 1, 2 i więcej osób, bez oddzielnych reguł dla dwuosobowej piekarni.

### OPT-REQ-010
System musi ograniczyć zmianę propozycji do uprawnionego planisty i przekazać przyjętą propozycję do PLN-REQ-001. Nie może sam publikować grafiku, zatwierdzać planu, zmieniać faktycznego zajęcia zasobów ani automatycznie redukować potwierdzonych zamówień B2B. Ponowne przeliczenie dla innych wejść musi ujawnić nowy zakres, nie podmienić przyjętej wersji bez decyzji człowieka.

## Acceptance-criteria

Przykładowe czasy i pojemności nie ustanawiają technologii zakładu.

### OPT-AC-001
Dotyczy [OPT-REQ-001](#opt-req-001). Przy wyłączonych DEM/B2B/rekomendacjach WRK planista podaje chleb i drożdżówki na jedną zmianę, jeden piec oraz ręczny grafik jednej osoby. System uruchamia harmonogramowanie, podaje wersję PLN/WRK i wskazuje brak okna technologicznego, jeśli nie zostało dostarczone, zamiast blokady z powodu nieobecnego B2B.

### OPT-AC-002
Dotyczy [OPT-REQ-002](#opt-req-002). Dwie operacje 06:00–06:20 wymagają każda jednego wykwalifikowanego piekarza, a dostępny jest jeden. Solver rozdziela je albo zgłasza konflikt; wolne godziny po 08:00 nie usuwają konfliktu 06:00. Druga dostępna osoba bez wymaganej umiejętności nie rozwiązuje tego konfliktu. Naruszenie dostarczonego okna PRC 30 min przez oczekiwanie 45 min pozostaje widoczne.

### OPT-AC-003
Dotyczy [OPT-REQ-003](#opt-req-003). Pojemność pieca 20 szt., zlecenie 24 szt. wymaga co najmniej dwóch wsadów. Po wsadzie 240°C, przed 180°C, wejście wymaga 15 min przezbrojenia/czyszczenia. Propozycja nie nakłada wsadów ponad 20 szt. i uwzględnia 15 min; przy braku pojemności oznacza tę granicę jako niezweryfikowaną.

### OPT-AC-004
Dotyczy [OPT-REQ-004](#opt-req-004). Retard zaczyna się 20:00, trwa 10 h i rezerwuje miejsce w chłodni. Wynik kończy go o 06:00 następnego dnia przy odpowiednio podanej strefie, utrzymuje rezerwację nocą i nie dopisuje 600 osobominut ciągłej pracy piekarza. Osobno zaplanowane składanie nadal wymaga obsady.

### OPT-AC-005
Dotyczy [OPT-REQ-005](#opt-req-005). Dla terminu niemożliwego przy jawnych ograniczeniach raport pokazuje brak wykonalności tylko z dowodem solvera. Przerwane szukanie bez takiego dowodu pokazuje brak rozstrzygnięcia. Znalezione rozwiązanie o 30 min nadgodzin bez dowodu optimum opisuje się jako wykonalne, nie optymalne; wynik LLM nie jest harmonogramem solvera.

### OPT-AC-006
Dotyczy [OPT-REQ-006](#opt-req-006). Planista przesuwa drugi wsad na czas pierwszego. Na osi czasu i liście pojawia się piec, oba wsady, okres przeciążenia i ograniczenie pojemności; po przeliczeniu rozwiązany konflikt znika tylko w nowej propozycji. Wyłączenie źródła dostępności daje brak weryfikacji, nie pustą listę oznaczającą sukces.

### OPT-AC-007
Dotyczy [OPT-REQ-007](#opt-req-007). W podanym oknie dostępności pieca 480 min plan zajmuje 360 min: widok pokazuje planowane 75% i 120 min bezczynności. Bez zdarzenia zajęcia EVT mapa nie pokazuje „piec rzeczywiście zajęty”. Brak okna dostępności nie daje procentu z domyślnej doby.

### OPT-AC-008
Dotyczy [OPT-REQ-008](#opt-req-008). Operacja planowana na 30 min jednej osoby ma wykonanie 40 min dwóch osób: raport pokazuje 30 planowanych i 80 rzeczywistych osobominut oraz +10 min trwania, a nie 40 osobominut. Dla partii bez zdarzeń pokazuje brak danych; termin 08:00 i rzeczywista gotowość 08:10 dają 10 min spóźnienia.

### OPT-AC-009
Dotyczy [OPT-REQ-009](#opt-req-009). Z tego samego wejścia użytkownik tworzy pięć wariantów zmieniających osobno obsadę, zmianę, miesiarkę, chłodnię i kolejność. Wyniki pokazują zmienione założenie oraz różnicę konfliktów i celu, bez obietnicy poprawy każdego wariantu. Obsada 1, 2 i 5 osób przechodzi przez ten sam kontrakt dostępności.

### OPT-AC-010
Dotyczy [OPT-REQ-010](#opt-req-010). Użytkownik tylko do odczytu nie zapisuje przesunięcia. Uprawniony planista przyjmuje propozycję: zmienia się szkic PLN, a opublikowany grafik, potwierdzone 50 szt. B2B i rzeczywiste zajęcie pieca nie zmieniają się. Nowe przeliczenie z planem v2 nie nadpisuje zaakceptowanego wejścia v1.

## Dependencies-and-decisions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | PRC-REQ-001/002/003 | Jedyny model wykonania i okien | start |
| implementation-prerequisite | [PLN-REQ-001](production-plans.md#pln-req-001), [WRK-REQ-001](workforce.md#wrk-req-001) | Ręczny plan i dostępność dla operacyjnego ograniczonego harmonogramu; fixture może dowieść kontraktu, nie integracji | demonstration |
| contract-input | [REC-REQ-001](recipes.md#rec-req-001) | Wersja receptury i zależności operacji | start |
| implementation-prerequisite | [EVT-REQ-001](production-records.md#evt-req-001) | Tylko rzeczywiste porównanie plan–wykonanie, nie szukanie planu | release |
| optional-adapter | [DEM-REQ-009](demand.md#dem-req-009), [B2B-REQ-007](b2b-orders.md#b2b-req-007), WRK-REQ-001 | Popyt, zamówienia i wspólne rekomendacje, bez wspólnej blokady startu | demonstration |
| optional-adapter | [SCN-REQ-001](scenarios-comparison.md#scn-req-001), OPT-REQ-007 | Izolowane warianty i odbiorca MAP, bez drugiego silnika procesu | demonstration |
| release-gate | [assurance](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Dowód na rzeczywistym dniu i kontroli dostępu; DEC-002 tylko przy trwałym odbiorze zdarzeń | release |

Do decyzji przed kwalifikacją optymalizacji: priorytety/wagi celu i postępowanie przy braku rozstrzygnięcia solvera. Nie wybrano arbitralnego limitu szukania ani dopuszczalnych nadgodzin. Ograniczenia prawne WRK stosuje się zgodnie z rolą, nie wymyśla tutaj. Przed porównaniem rzeczywistym potrzebne jest uzgodnione przypisanie plan–partia oraz decyzja DEC-002 na granicy strumienia. Braki pojemności/okien są kwalifikacją konkretnego wejścia, nie powodem wymagania całego FER lub B2B.
