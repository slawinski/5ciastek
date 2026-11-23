# FER — Obserwacje i prognoza fermentacji

## Purpose-and-scope

Piekarz zapisuje kontekst i ocenia ciasto; osoba kalibrująca model porównuje prognozę z nowymi partiami; właściciel ocenia jakość i koszt pomiarów. Celem jest powtarzalność i przewidywane okno kontroli, nie automatyczne stwierdzenie gotowości lub bezpieczeństwa żywności. Pierwszy przepływ obejmuje historię jednej partii i okno kontroli. FER nie jest warunkiem scenariusza inwestycyjnego ani ręcznie dostarczonych okien PRC.

## Inputs-and-outputs

Kontekst pochodzi z zamrożonej wersji receptury REC i obserwacji partii EVT: typ mąki, hydracja (% z podaną podstawą), inoculum/udział zakwasu (% i podstawa), sól (masa lub % z podstawą), temperatura ciasta/otoczenia/urządzenia w °C z rozróżnieniem miejsca pomiaru, historia zakwasu. Historia zawiera dostępne dane dokarmień/aktywności z datami i źródłem; brak nie jest domyślną dojrzałością startera. Serie temperatury mają czas/strefę, źródło i jednostkę. Etapy bulk (fermentacja w masie), proof (rozrost) i retard (chłodzenie) mają rzeczywiste granice czasu i kontekst partii.

Opcjonalne wejścia: pH (bez jednostki), kwasowość z metodą i jednostką, wilgotność (%) i dane aktywności startera. Wynik partii: rzeczywisty czas w minutach/godzinach, ekspansja z podstawą odniesienia, objętość z jednostką, zdjęcie miękiszu, ocena piekarza i autor/czas oceny. Prognoza ma wersję modelu, datę danych, przewidywany czas/okno gotowości, przedział niepewności i zalecenie kontroli ciasta. Brak zdjęcia/oceny nie staje się wynikiem „dobry”.

## Lifecycle-and-invariants

Zapis kontekstu → obserwacje etapów → prognoza kontroli → kontrola piekarza → rzeczywisty wynik → kalibracja kolejnej wersji → ocena na nowych partiach. Dane użyte do kalibracji nie są dowodem trafności na nowych partiach. Zmiana receptury katalogowej nie przepisuje historii partii. Korekty faktów podlegają EVT-REQ-002, nie lokalnemu nadpisaniu w FER. Czujnik dostarcza obserwacji, nie decyzji człowieka.

## Requirements

### FER-REQ-001
System musi zapisać kontekst fermentacji partii z wersją receptury, mąką, hydracją, temperaturą, inoculum, solą i historią zakwasu. Brakujące pola oraz niejednoznaczne podstawy procentów musi ujawnić przed użyciem w modelu, bez zgadywania składu.

### FER-REQ-002
System musi przedstawić czasową historię temperatur i etapów bulk/proof/retard z rozróżnieniem pomiaru ciasta oraz urządzenia. Błędny czas, brak jednostki lub przerwa w pomiarach nie mogą zostać pokazane jako ciągła poprawna obserwacja; źródłowe braki pozostają widoczne.

### FER-REQ-003
System musi umożliwić dołączenie dostępnych pH, kwasowości, wilgotności i aktywności startera z metodą/jednostką, gdy potrzebna. Ich brak nie może sam blokować historii temperatury i czasu; nie może też być zastąpiony zerem w prognozie.

### FER-REQ-004
Uprawniony piekarz musi móc powiązać wynik z partią: rzeczywisty czas, ekspansję, objętość, zdjęcie miękiszu i własną ocenę. System musi wskazać brakujące obserwacje oraz autora/czas oceny i nie może zastąpić oceny człowieka oceną modelu.

### FER-REQ-005
System musi zapewnić prosty baseline regułowy lub kinetyczny temperatura–czas z jawnymi założeniami oraz kalibrację parametrów na własnych partiach. Każda oceniana prognoza musi wskazać wersję modelu i zbiór kalibracyjny, aby wynik był odtwarzalny.

### FER-REQ-006
Przy prognozie system musi pokazać przewidywany czas gotowości, przedział niepewności i rekomendowane okno kontroli. Gdy kontekst lub pomiary nie uzasadniają pewnej prognozy, musi ostrzec o ograniczeniu, wskazać brak i nie przedstawiać punktowej godziny jako potwierdzonej gotowości.

### FER-REQ-007
System musi alarmować o odchyleniu od dostarczonych założeń, np. temperaturze retardera wyższej niż planowana. Alarm ani prognoza nie mogą automatycznie zatwierdzić gotowości lub bezpieczeństwa partii; decyzję podejmuje człowiek zgodnie z właściwą procedurą.

### FER-REQ-008
Osoba oceniająca model musi otrzymać udokumentowany błąd czasu na nowych partiach względem kontroli doświadczonego piekarza i rzeczywistych wypieków. Raport musi rozdzielić kalibrację od oceny, pokazać zakres danych, wadliwe wypieki, stabilność jakości i koszt czujników; bez wyników nie może deklarować empirycznej trafności.

### FER-REQ-009
System musi odmówić zapisu lub zmiany oceny/kalibracji osobie bez stosownego uprawnienia. Przeliczenie po zmianie modelu musi utworzyć rozróżnialny wynik, a nie nadpisać prognozę, względem której oceniono piekarza.

## Acceptance-criteria

### FER-AC-001
Dotyczy [FER-REQ-001](#fer-req-001). Partia P używa REC v1, mąki żytniej, hydracji 80% względem mąki, soli 2% względem mąki i inoculum 20% z podaną podstawą. Zapis zachowuje te podstawy i historię dokarmienia z datą. Edycja REC v2 ich nie zmienia. Wpis „zakwas 20%” bez podstawy pokazuje niejednoznaczność, nie domyślną ilość mąki zakwasowej.

### FER-AC-002
Dotyczy [FER-REQ-002](#fer-req-002), [FER-REQ-003](#fer-req-003). Dla bulk 08:00–12:00 z temperaturami ciasta 24°C i 25°C oraz retard 20:00–06:00 z temperaturą urządzenia 4°C historia zachowuje przejście przez noc i rozróżnia źródła. Luka 09:00–10:00 nie jest linią potwierdzonych pomiarów. Brak pH nie blokuje widoku; wpis pH 4,2 pozostaje opcjonalnym pomiarem, nie temperaturą. Nieoznaczona jednostka kwasowości jest brakiem kwalifikacji tej obserwacji.

### FER-AC-003
Dotyczy [FER-REQ-004](#fer-req-004). Piekarz zapisuje dla P 240 min bulk, wzrost objętości z 1 do 1,8 l, zdjęcie miękiszu i ocenę. Widok wskazuje autora/czas, 0,8 l przyrostu i podstawę ekspansji. Dla partii bez oceny pokazuje „brak oceny”, nie „model zatwierdził”.

### FER-AC-004
Dotyczy [FER-REQ-005](#fer-req-005), [FER-REQ-008](#fer-req-008). Model v1 skalibrowany na P1–P10 przewiduje P11 na 12:00, piekarz stwierdza gotowość o 12:20. Raport pokazuje błąd 20 min i P11 jako nową partię; nie wlicza P1–P10 do dowodu oceny na nowych partiach. Nieznany koszt czujników jest brakiem, nie 0 PLN.

### FER-AC-005
Dotyczy [FER-REQ-006](#fer-req-006). Prognoza P wskazuje okno kontroli 11:30–12:30 i niepewność według wybranej metody. Po utracie historii temperatur i bez historii startera pokazuje oba ograniczenia i ostrzeżenie o niewystarczających danych zamiast pewnego „gotowe 12:00”. Przykładowe okno nie ustanawia wymaganego pokrycia statystycznego.

### FER-AC-006
Dotyczy [FER-REQ-007](#fer-req-007). Plan retardera wynosi 4°C; pomiar 9°C narusza dostarczoną dla przykładu regułę alarmową. System pokazuje odchylenie z czasem i partią. Nie zwalnia partii, nie oznacza jej bezpieczną i nie podejmuje automatycznie decyzji o odrzucie.

### FER-AC-007
Dotyczy [FER-REQ-009](#fer-req-009). Użytkownik bez prawa kalibracji nie zmienia parametrów. Uprawniona osoba tworzy v2 i przelicza P11; prognoza v1 użyta w FER-AC-004 pozostaje dostępna obok v2, a nie zostaje zastąpiona „trafniejszą” godziną po poznaniu wyniku.

## Dependencies-and-decisions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [REC-REQ-001](recipes.md#rec-req-001), [EVT-REQ-001](production-records.md#evt-req-001), [EVT-REQ-002](production-records.md#evt-req-002) | Wersja receptury, kontekst i poprawiane obserwacje | start |
| implementation-prerequisite | FER-REQ-004 | Dostępne obserwacje własnych rzeczywistych partii i ocena piekarza do kalibracji/walidacji; nie cały backlog OBS | release |
| optional-adapter | [OPT-REQ-004](optimization.md#opt-req-004) | Późniejsze użycie prognoz w CAPP, nie warunek historii | demonstration |
| contract-input | [PRC-REQ-003](process-execution.md#prc-req-003) | Ręczne okna nadal wystarczają scenariuszom bez FER | start |
| release-gate | [assurance](../engineering-assurance.md#kontrole-zależne-od-funkcji) | Zatwierdzenie procedury, jeśli użycie w kontroli jakości/bezpieczeństwa, ochrona zdjęć; DEC-002 przy trwałym strumieniu | release |

Zgodnie z [klasyfikacją wyborów i warunków użycia](../decisions.md#request-classification) plan zadania określa minimalny kontekst modelu, sposób wyznaczania niepewności i ocenę trafności na nowych partiach. Definicja oceny gotowości przez piekarza, skala wad i stabilności oraz profile kalibracji i reguły alarmowania wymagają właściwych danych i zatwierdzenia dla danego zastosowania. Te wybory i warunki nie tworzą nowej globalnej decyzji blokującej produkt, ale muszą być ustalone przed odpowiednią prognozą, oceną lub dopuszczeniem do rzeczywistego użycia.

[DEC-002](../decisions.md#dec-002) dotyczy wyłącznie zależnej integracji trwałego strumienia obserwacji i korekt. Nie ustalono uniwersalnego progu temperatury, tolerancji błędu ani liczby partii. Konkretne receptury, przebiegi i kalibracje są danymi. Nie dodano automatycznej decyzji HACCP ani nowego algorytmu mikrobiologicznego.
