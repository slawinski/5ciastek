# DEM — Prognoza popytu i rekomendacja ilości

## Purpose-and-scope

Właściciel lub uprawniony planista ogranicza odpady i utraconą sprzedaż. Analityk porównuje metody; osoba przyjmująca propozycję odpowiada za przekazanie jej do planowania. Prognoza nie dowodzi popytu na nowy lokal i nie zastępuje warunkowego rachunku wymaganej sprzedaży w ECO. Jest niezależnym późniejszym przyrostem, nie warunkiem scenariusza inwestycyjnego.

## Inputs-and-outputs

Wejścia: godzinowe szeregi SAL według stabilnego SKU, daty i lokalnej strefy czasu, sztuki sprzedaży, okresy niedostępności, odpady oraz cechy: dzień tygodnia, sezon, święta, pogoda, promocje i wydarzenia lokalne. Każda cecha ma źródło i moment dostępności; faktyczna pogoda po dniu prognozy nie jest prognozą pogody znaną wcześniej. Koszty strat i niedostępności pochodzą z jawnych założeń oraz ECO, w PLN na właściwą jednostkę. Brak cechy, obserwacji lub kosztu nie oznacza zera.

Wyjścia: datowana rekomendacja sztuk SKU, metoda i zakres historii, przedział niepewności, proponowane partie i godziny wypieku/gotowości; panel prognoza–sprzedaż–stockout–odpady oraz wynik porównania metod. Czas stockout podaje się w minutach/godzinach; odpady w sztukach i PLN, wkład do zysku w PLN. Masy składników wylicza wyłącznie [REC-REQ-002](recipes.md#rec-req-002).

## Lifecycle-and-invariants

Dane źródłowe → kwalifikacja okresów → baseline → ocena → propozycja → korekta człowieka → przyjęcie do szkicu PLN. Przyjęcie nie jest zatwierdzeniem planu. Zachowuje się wersję prognozy, pierwotny wynik, korektę i jej uzasadnienie, aby późniejszy wynik porównać z oboma. Brak historii może uniemożliwić wyliczenie baseline, ale nie uprawnia do wymyślenia popytu. Nowe dane/korekty źródeł wymagają nowego datowanego przeliczenia, nie cichego przepisania dawnego wyniku.

## Requirements

### DEM-REQ-001
System musi przygotować godzinowy szereg SKU z cechami i pochodzeniem danych, ujawniając braki oraz okresy niedostępności. Sprzedaży podczas stockout nie może oznaczyć jako pełnego zaobserwowanego popytu; nieznana utracona sprzedaż pozostaje nieznana.

### DEM-REQ-002
System musi wyliczać baseline średniej albo mediany podobnych dni tygodnia i warunków według jawnie wybranej metody oraz pokazać wybrane dni. Gdy brak wystarczających porównywalnych danych według zatwierdzonej reguły doboru, musi wskazać brak podstaw, a nie zwrócić pozornie pewną liczbę.

### DEM-REQ-003
Analityk musi móc ocenić metodę przez walk-forward oraz odrębny zbiór testowy. Dla każdego punktu prognozy system musi ograniczyć uczenie, dobór parametrów i cechy do informacji dostępnych przed tym punktem; wynik musi ujawniać granice podziału i okres oceny.

### DEM-REQ-004
System musi porównywać rekomendacje według kosztu odpadów i niedostępności z jawnymi założeniami ECO, obok błędu prognozy. Błąd na niewyczerpanym zapasie musi być odróżniony od okresów ocenzurowanych; MAE/MAPE nie mogą samodzielnie dowodzić poprawy decyzji biznesowej. Nieznany koszt ogranicza ocenę ekonomiczną.

### DEM-REQ-005
System może zastosować dodatkowy model statystyczny lub ML dopiero po kwalifikacji historii i wykazaniu przewagi nad baseline na danych produkcyjnych zgodnie z przyjętym kryterium oceny. Bez takiego dowodu musi pozostać baseline; brak kwalifikacji baseline pozostaje widoczny.

### DEM-REQ-006
System musi pokazać dla dnia/SKU zalecane sztuki, przedział niepewności, partie i godziny jako propozycję, z metodą, datą danych i ograniczeniami. Nie może przedstawiać proponowanych godzin jako potwierdzonej zdolności zasobów.

### DEM-REQ-007
Przy żądaniu skalowania rekomendowanych dodatnich całkowitych sztuk system musi przekazać ilość do REC-REQ-002 i wskazać używaną opublikowaną wersję receptury. Zerowe zapotrzebowanie oznacza brak partii do skalowania; niepoprawna ilość lub brak mapowania SKU do receptury musi zatrzymać ten handoff z opisem przyczyny, bez własnego przelicznika składników.

### DEM-REQ-008
Uprawniony planista musi móc skorygować propozycję z uzasadnieniem. System musi zachować oryginał, korektę, autora i czas oraz porównać ich wyniki z późniejszą sprzedażą, stockout i odpadami.

### DEM-REQ-009
Przyjęcie propozycji przez uprawnioną osobę musi przekazać ilości i terminy do szkicu PLN według [PLN-REQ-001](production-plans.md#pln-req-001). Samo prognozowanie ani adapter obsady nie może publikować grafiku, zatwierdzać planu lub zmieniać potwierdzonych zamówień. Osobie bez prawa korekty/przyjęcia system musi odmówić zmiany.

### DEM-REQ-010
Panel oceny musi zestawić prognozę, sprzedaż, czas stockout, ilość i wartość odpadów oraz wkład do zysku dla tego samego SKU/okresu. Musi pokazać brakujące źródła i podstawę kosztów, aby brak danych nie wyglądał jak brak strat.

## Acceptance-criteria

Liczby poniżej są przykładami, nie parametrami wdrożenia.

### DEM-AC-001
Dotyczy [DEM-REQ-001](#dem-req-001). Dla SKU A sprzedano 20 szt. do 10:00, a 10:00–12:00 trwał stockout. Po przygotowaniu szeregu system pokazuje 20 szt. sprzedaży i 120 min niedostępności; nie pokazuje „popyt = 20” ani zera utraconej sprzedaży. Brak pogody jest oznaczony jako brak cechy.

### DEM-AC-002
Dotyczy [DEM-REQ-002](#dem-req-002). Dla wybranej mediany trzy porównywalne poniedziałki bez stockout mają 10, 14, 18 szt. Wynik wynosi 14 szt. i wskazuje te dni. Po wykluczeniu wszystkich dni według zatwierdzonej reguły system pokazuje brak podstaw, nie 0 szt. Wariant średniej musi jawnie wskazać inną wybraną metodę.

### DEM-AC-003
Dotyczy [DEM-REQ-003](#dem-req-003). Prognoza na 15 czerwca powstaje ze stanem informacji do 14 czerwca. Sprzedaż z 15 czerwca i znana dopiero wtedy pogoda nie trafiają do jej uczenia ani doboru parametrów. Raport rozdziela kolejne okna walk-forward od odłożonego testu; dopisanie danych z 16 czerwca nie zmienia historycznego wejścia tej prognozy.

### DEM-AC-004
Dotyczy [DEM-REQ-004](#dem-req-004). Przy podanych kosztach 2 PLN/szt. odpadu i 5 PLN/szt. niedostępności wariant X z 3 odpadami i 2 utraconymi sztukami daje 16 PLN, a Y z 5 odpadami i 0 utraconymi daje 10 PLN. Raport pokazuje obie składowe i założenie utraconych sztuk. Przy nieznanej liczbie utraconych sztuk nie przedstawia 16 PLN jako dokładnej obserwacji. Błąd prognozy liczy osobno dla okresów nieocenzurowanych.

### DEM-AC-005
Dotyczy [DEM-REQ-005](#dem-req-005). Kandydat ma niższy MAE, ale nie wykazał przewagi według zatwierdzonego kryterium kosztowego w ocenie produkcyjnej. Przy wyborze metody pozostaje baseline z uzasadnieniem. Zbyt krótka historia nie uruchamia automatycznie ML.

### DEM-AC-006
Dotyczy [DEM-REQ-006](#dem-req-006), [DEM-REQ-007](#dem-req-007). Propozycja A: 30 szt., przedział 24–36, dwie partie po 15 gotowe o 06:00 i 09:00. Widok nazywa je propozycją bez potwierdzenia zasobów. Skalowanie przekazuje 30 do REC-REQ-002 dla wskazanej wersji; 0 nie tworzy partii, 2,5 szt. i brak receptury dają jawny błąd handoffu.

### DEM-AC-007
Dotyczy [DEM-REQ-008](#dem-req-008), [DEM-REQ-010](#dem-req-010). Planista zmienia 30 na 34 z powodem „lokalne wydarzenie”. Po dniu z 31 sprzedanymi, 3 odpadami i 0 min stockout panel zachowuje prognozę 30, korektę 34 i wynik 31/3/0; koszt odpadów i wkład do zysku odsyłają do podstaw ECO albo pokazują brak kosztu.

### DEM-AC-008
Dotyczy [DEM-REQ-009](#dem-req-009). Przyjęcie 34 szt. tworzy/zmienia szkic PLN, nie zatwierdzoną wersję. Przy wyłączonym adapterze WRK baseline nadal działa. Próba przyjęcia przez użytkownika tylko do odczytu kończy się odmową; grafiki i potwierdzone B2B pozostają bez zmian.

## Dependencies-and-decisions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | DEM-REQ-001; [STK-REQ-002](stock-inventory.md#stk-req-002) | SAL dostarcza sprzedaż/niedostępność; fizyczne zwroty nie są automatycznie popytem | start |
| implementation-prerequisite | DEM-REQ-001 | Wiarygodny producent danych sprzedaż/stockout dla oceny na rzeczywistych danych; nie cały moduł OPS | release |
| contract-input | [ECO-REQ-001](economics-investment.md#eco-req-001) | Podstawa kosztów funkcji celu, bez drugiego modelu finansowego | demonstration |
| implementation-prerequisite | [REC-REQ-002](recipes.md#rec-req-002), [PLN-REQ-001](production-plans.md#pln-req-001) | Tylko wykonywalne przekazanie do skalowania/szkicu, nie samo wyliczenie baseline | demonstration |
| optional-adapter | [WRK-REQ-001](workforce.md#wrk-req-001) | Ilości i gotowość do rekomendacji obsady; brak adaptera nie blokuje baseline | demonstration |
| release-gate | [assurance](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Dostęp do rzeczywistych danych i dowody oceny bez leakage | release |

Do rozstrzygnięcia produktowego przed oceną/wyborem metody: reguła podobieństwa dni, średnia czy mediana, minimalna adekwatna historia, poziom i metoda przedziału niepewności, sposób oceny popytu ocenzurowanego oraz kryterium przewagi przy kosztach niedostępności. Nie ustalono progów jakości ani wag kosztowych; U7 ma zarejestrować te decyzje z wyznaczonym decydentem, nie uznać modelu za gotowy do wydania. Konkretne koszty/pogoda są danymi, nie globalnymi decyzjami.
