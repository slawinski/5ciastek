# Scenarios and comparison

## Purpose and actors

Właściciel planowanej piekarni definiuje warianty i podejmuje decyzję przed najmem oraz zakupem wyposażenia. Dostawca obserwacji istniejącej piekarni przekazuje kontekst pomiarów; może nim być właściciel. Piekarz i sprzedawca są rolami zasobów, nie obowiązkowymi kontami, ewidencją obecności ani listą płac. Wariant odniesienia obejmuje właściciela-piekarza i osobnego sprzedawcę. Nie istnieje jeszcze prognoza sprzedaży.

MVP-1 odpowiada na ograniczone, ale połączone pytanie inwestycyjne: ręcznie wprowadzone pomiary ze źródłem → zapis wariantu → ograniczony przebieg → zdolność i terminy → interpretacja finansowa z ograniczeniami. Nie narzuca limitu jednego produktu. MVP-2 rozszerza ten przepływ o realistyczny miks produktów, reprezentatywny tydzień, bilanse, okna przydatności, powtarzalność miesiąca, nakład i porównanie. Rejestrator, mapa, POS, MRP, pełny solver, model fermentacji i asystent nie są wspólną bramką tych wydań.

## Data and authority

Wejście: identyfikatory opublikowanych wersji receptur i skalowanie według [REC-REQ-001](recipes.md#rec-req-001) i [REC-REQ-002](recipes.md#rec-req-002); produkty, proporcje sprzedaży, ilości w g/kg/szt., ceny w PLN z podstawą kosztową, kalendarz produkcji i sprzedaży, wyposażenie z pojemnością/jednostką i dostępnością, dostępność ról w godzinach, kontekst czasów w minutach i osobominutach, stany początkowe, dostawy, straty, przydatność, koszty i jawne obciążenia właściciela. Źródło i zakres czasowy należą do wartości, nie tylko do całego raportu. Pomiary można dostarczyć ręcznie bez aplikacji rejestrującej. Dane z innej skali/maszyny nie stają się pomiarem docelowego zakładu.

Wyjście: zapisany wariant i identyfikacja wejść przebiegu, chronologia badanej kolejności, oczekiwanie/konflikty, ilości gotowe w terminie, wymagane godziny właściciela względem dostępności, wyniki ekonomiczne właściciela ECO oraz odrębne listy nieweryfikowalnych ograniczeń. Kg i sztuki nie są zamienne bez przeliczenia właściciela STK. Rysunek referencyjny (chleby, drożdżówki, croissanty, bagietki, bułki; miesiarka 40–60 l, retarder, garownia, piec 2–3 komory, konwekcyjny, stoły, regały, chłodzenie, laminacja) nie zatwierdza wydajności, lokalu ani obowiązku codziennej produkcji każdej kategorii.

## Lifecycle and boundaries

Właściciel przygotowuje wariant, zapisuje go, otwiera ponownie i uruchamia przebieg na określonych wejściach. Zmiana parametrów wymaga ponownego obliczenia; stary wynik pozostaje wynikiem dawnych wejść, nie aktualnego formularza. Porównanie wskazuje dokładnie porównywane wejścia i wyniki. Dane hipotetyczne nigdy nie stają się zatwierdzonym planem ani faktem wykonania. Braki pozwalają zachować wyniki częściowe, lecz nie pozwalają potwierdzić zależnego wniosku. Błąd zapisu/odczytu nie jest sukcesem.

Poza pierwszą oceną: fizyczne odległości, trasy, kongestia, dopasowanie lokalu i projekt budowlany; szczegółowe finansowanie/rozruch miesiąc po miesiącu, spłaty i sezonowość; automatyczne projektowanie optymalnego biznesu lub prognozowanie popytu; pełne operacyjne ERP, kadry, płace, księgowość, zakupy do dostawców; sensory, sterowanie, kamery i AI. Szerszy rozwój działającej firmy pozostaje osobnym zakresem, nie nową bramką otwarcia.

## Requirements

### SCN-REQ-001

System musi utrzymywać hipotetyczne wejścia i wyniki w izolacji od rzeczywistych receptur, partii, zapasów i grafików, z powtarzalnym wynikiem dla tych samych wersji danych, założeń i kolejności przebiegu. Każda użyta wartość musi pozostać rozpoznawalna jako zmierzona, oszacowana albo brakująca; brak nie może stać się nieoznaczonym zerem.

### SCN-REQ-002

Gdy właściciel definiuje wariant, system musi przyjąć wybrane wersje receptur, asortyment, proporcje sprzedaży, ilości, ceny i kalendarz produkcji/sprzedaży jako jawne parametry tego wariantu.

### SCN-REQ-003

Gdy właściciel zapisuje wyposażenie wariantu, system musi zachować pojemności z jednostkami i dostępność wspólnych urządzeń oraz stanowisk; brak pojemności musi pozostać brakiem w ocenie, nie nieograniczonym zasobem.

### SCN-REQ-004

System musi udostępnić wariant odniesienia z jednym właścicielem-piekarzem i jednym osobnym sprzedawcą, zachowując osobne godziny dostępności i koszty obu ról.

### SCN-REQ-005

System musi umożliwić zadanie dostępności właściciela 5–7 dni tygodniowo i 8–12 godzin dziennie jako parametrów, bez utożsamienia ich z obowiązkiem lub obliczonym zapotrzebowaniem pracy.

### SCN-REQ-006

Gdy dostawca obserwacji wprowadza pomiar ręcznie lub przez adapter, system musi zachować źródło, wersję receptury, wielkość partii, wyposażenie, obsadę, czynność i warunki pomiaru. Przeniesienie na inną skalę lub maszynę musi wskazać jawne założenie estymacji albo brak, bez automatycznego liniowego przeliczenia czasu według liczby osób.

### SCN-REQ-007

Po zapisaniu wariantu uprawniony właściciel musi móc otworzyć go ponownie z tymi samymi parametrami, źródłami i kwalifikacją braków, bez zmiany opublikowanych receptur.

### SCN-REQ-008

Gdy właściciel uruchamia wariant, system musi powiązać jego dane z ograniczonym przebiegiem, oceną podstawowej zdolności i wynikiem ekonomicznym w jednym czytelnym przepływie. Wynik musi wskazywać użyte wejścia; po ich edycji nie może udawać wyniku nowego wariantu bez ponownego obliczenia.

### SCN-REQ-009

Dla rozszerzonego przebiegu system musi przyjąć reprezentatywny tydzień z datami, przejściami przez północ i jawnymi stanami początkowymi, w tym procesami rozpoczętymi przed tygodniem oraz przydatnym przeniesionym zapasem.

### SCN-REQ-010

Wynik przebiegu musi prezentować chronologię zastosowanej kolejności, oczekiwanie, konflikty, gotowość ilości w terminach i wykorzystane ograniczenia zgodnie z [PRC-REQ-001](process-execution.md#prc-req-001), [PRC-REQ-002](process-execution.md#prc-req-002) i [PRC-REQ-003](process-execution.md#prc-req-003). Przygotowanie, czyszczenie, przezbrojenia i obsługa materiałów korzystają z jawnych czasów wejściowych, nie odległości na rysunku. Raport nie może przedstawiać badanej kolejności jako globalnego optimum.

### SCN-REQ-011

System musi pokazać faktycznie wymagane godziny pracy właściciela oraz porównanie z dostępnością danego wariantu, oddzielnie od godzin sprzedawcy i czasu pasywnego procesu.

### SCN-REQ-012

Gdy przebieg korzysta z bilansów, system musi pokazać wejścia i wyniki właściciela [STK-REQ-001](stock-inventory.md#stk-req-001), [STK-REQ-002](stock-inventory.md#stk-req-002), [STK-REQ-007](stock-inventory.md#stk-req-007) i [STK-REQ-008](stock-inventory.md#stk-req-008): surowce, dostawy, zużycie, straty, wyroby gotowe, sprzedaż, przeniesienie i odpad z przydatnością. Raport zachowuje kwalifikację dostępności i niezrealizowanej sprzedaży ze STK; bez odpowiedniego bilansu dostępność pozostaje niezweryfikowana.

### SCN-REQ-013

System musi zebrać jawne koszty składników, opakowań, energii, personelu, najmu i pozostałych wydatków oraz przekazać je do ekonomii z zachowaniem źródeł według [ECO-REQ-003](economics-investment.md#eco-req-003), [ECO-REQ-004](economics-investment.md#eco-req-004) i [ECO-REQ-005](economics-investment.md#eco-req-005). Rozliczenie nakładu operacji i kosztu obsady konsumuje jednego właściciela alokacji [ECO-REQ-001](economics-investment.md#eco-req-001).

### SCN-REQ-014

Raport celu 6 000 PLN netto miesięcznie musi wskazać przyjęte podatki i składki właściciela oraz kwalifikację wyniku [ECO-REQ-009](economics-investment.md#eco-req-009); bez tych założeń spełnienie celu pozostaje niezweryfikowane.

### SCN-REQ-015

Raport musi zestawić wymaganą sprzedaż z gotowymi w terminie ilościami badanego planu dla zadanych proporcji, cen i strat, konsumując [ECO-REQ-007](economics-investment.md#eco-req-007) i [ECO-REQ-008](economics-investment.md#eco-req-008). Musi oddzielnie pokazać marżę kontrybucyjną, wynik po kosztach stałych i nadwyżkę gotówkową według [ECO-REQ-006](economics-investment.md#eco-req-006), bez przedstawiania wymaganej sprzedaży jako prognozy lub dowodu istnienia klientów.

### SCN-REQ-016

Gdy raport przelicza tydzień na miesiąc, musi ujawnić kalendarz i założenia oraz kwalifikację według [ECO-REQ-002](economics-investment.md#eco-req-002). Bez rozliczenia uszczuplenia początkowego WIP/zapasu, odtworzenia i przypisanej pracy poza tygodniem nie może potwierdzić cyklicznej wykonalności, nadwyżki ani zwrotu. Nie wymaga identycznego stanu początku/końca ani szczegółowej symulacji miesiąca.

### SCN-REQ-017

Raport inwestycyjny musi zestawić jawnie wprowadzone wyposażenie, przygotowanie lokalu, kaucję i zapas początkowy oraz wynik prostego zwrotu według [ECO-REQ-012](economics-investment.md#eco-req-012), [ECO-REQ-013](economics-investment.md#eco-req-013) i [ECO-REQ-014](economics-investment.md#eco-req-014), z widoczną podstawą nakładu i nadwyżki po zapewnieniu dochodu właściciela. Raport zachowuje kwalifikację właściciela ekonomii, także brak potwierdzonego skończonego zwrotu i brak podwójnego potrącenia wydatku.

### SCN-REQ-018

Właściciel musi móc zestawić co najmniej dwa ręcznie zdefiniowane warianty z różnicami wejść, źródeł, dostępności, wymaganych godzin i ponownie obliczonych wyników, także gdy jeden wariant ma braki. Zmiany ilości, godzin personelu, cen, strat lub wyposażenia muszą być widoczne jako przyczyny różnic, nie ukryte wspólne ustawienia.

### SCN-REQ-019

Raport musi oddzielić ocenę operacyjną badanego planu, spełnienie celu finansowego i niezweryfikowane ograniczenia wraz z przyczynami. Brak ceny, najmu, okna technologicznego, pomiaru maszyny lub kwalifikacji powtarzalności musi ograniczyć odpowiedni wniosek, nie ukrywać poprawnych wyników częściowych ani tworzyć jednego bezwarunkowego werdyktu inwestycyjnego.

### SCN-REQ-020

Przy zapisie, odczycie i uruchomieniu system musi zweryfikować uprawnienie i poprawność wejść zgodnie z [polityką assurance](../engineering-assurance.md). Odmowa, nieprawidłowa jednostka/ilość, sprzeczne parametry lub błąd zapisu/odczytu muszą być widoczne bez fałszywego potwierdzenia i bez częściowej zmiany rzeczywistych danych. Ponowienie zapisu musi podlegać polityce integralności; nie wolno zbierać tożsamości pracowników tylko dla symulacji.

### SCN-REQ-021

System musi prezentować parametry, wyniki, braki i błędy po polsku zgodnie ze [słownikiem](../domain/glossary.md) i [design systemem](../design-system.md), z obsługą klawiatury, widocznym focusem i odczytem na telefonie/tablecie bez polegania wyłącznie na kolorze lub ruchu.

### SCN-REQ-022

Dla późniejszego rozwoju działającej firmy właściciel musi móc porównać warianty kolejnej osoby, zmiany, miesiarki, retardera, pieca, drugiego sklepu i zwiększenia B2B. Raport musi zachować źródła liczb i rozróżniać wariant pesymistyczny, bazowy i optymistyczny z przedziałem niepewności oraz wynikami CAPEX/OPEX, cash flow i progu rentowności według [ECO-REQ-016](economics-investment.md#eco-req-016). Nie wolno przedstawiać estymacji LLM jako wyliczenia. Ocena trafności wymaga porównania z późniejszym wynikiem rzeczywistym, nie samego demo.

## Acceptance criteria

Liczby poza celem właściciela i zakresem jego dostępności są ilustracyjne, nie cenami, regułami podatkowymi ani zatwierdzoną precyzją mas.

### SCN-AC-001

Sprawdza [SCN-REQ-001](#scn-req-001). Dla zapisanych wejść v1 z czasem zmierzonym, ceną oszacowaną i brakującym najmem dwa uruchomienia dają te same wyniki i kwalifikacje. Porównanie rzeczywistych receptur, partii, zapasów i grafików przed/po wykazuje brak zmian.

### SCN-AC-002

Sprawdza [SCN-REQ-002](#scn-req-002), [SCN-REQ-007](#scn-req-007). Właściciel zapisuje receptury v1 chleba i bułek, proporcje 60/40, ilości 60/40 szt., ceny 20/2 PLN i kalendarz. Po ponownym otwarciu odczytuje dokładnie te parametry i źródła; późniejsza publikacja receptury v2 nie podmienia wskazanej v1.

### SCN-AC-003

Sprawdza [SCN-REQ-003](#scn-req-003), [SCN-REQ-010](#scn-req-010). Dla pieca 20 szt. i wsadów 12+12 szt. w tym samym czasie raport ujawnia oczekiwanie lub niespełniony termin. Po usunięciu pojemności wskazuje niezweryfikowaną zdolność, nie 24 szt. ani nieskończoność.

### SCN-AC-004

Sprawdza [SCN-REQ-004](#scn-req-004), [SCN-REQ-005](#scn-req-005), [SCN-REQ-011](#scn-req-011). Wariant A ma dostępność właściciela 5×8=40 h, B 7×12=84 h; sprzedawca ma osobno 35 h i koszt. Przy obliczonych 38 h właściciela w A raport pokazuje 38/40, nie 84 ani obowiązek pracy 40 h. Godziny sprzedawcy nie zwiększają dostępności piekarza.

### SCN-AC-005

Sprawdza [SCN-REQ-006](#scn-req-006). Dostawca wpisuje 30 min mieszania partii 20 kg przez dwie osoby na maszynie X z datą i wersją receptury. Wariant jednej osoby na Y pokazuje przyjętą estymację ze źródłem albo brak czasu; nie przyjmuje sam 15 lub 60 min jako pomiaru Y.

### SCN-AC-006

Sprawdza [SCN-REQ-008](#scn-req-008), [SCN-REQ-014](#scn-req-014), [SCN-REQ-015](#scn-req-015). W jednym przepływie właściciel zapisuje ręczne pomiary ze źródłem, role, ograniczenia i koszty, uruchamia ograniczony plan dostarczający 2 200 szt. w terminie i odczytuje ECO: przy cenie 20 PLN, koszcie zmiennym 10 PLN i budżecie stałym z celem właściciela 24 000 PLN potrzeba 2 400 sprzedanych szt./48 000 PLN. Raport wskazuje deficyt 200 szt. tego planu i brak dowodu popytu. Edycja ilości nie zmienia podpisu starego wyniku; nowy wynik wymaga przeliczenia. Rejestrator nie uczestniczy w tej demonstracji.

### SCN-AC-007

Sprawdza [SCN-REQ-009](#scn-req-009), [SCN-REQ-016](#scn-req-016). Fermentacja rozpoczęta w niedzielę przed badanym tygodniem i przydatne 10 szt. z poprzedniego dnia są widocznymi wejściami poniedziałku. Miesiąc z 22 dniami sprzedaży pokazuje 22, nie ukryte 20 dni z czterech tygodni.

### SCN-AC-008

Sprawdza [SCN-REQ-010](#scn-req-010), [SCN-REQ-011](#scn-req-011). Dwie czynności tej samej osoby przez te same 30 min dają konflikt lub jawne oczekiwanie według PRC; dwie godziny pasywnej fermentacji nie dodają dwóch godzin pracy tej osoby. Raport ujawnia czasy przygotowania i czyszczenia, a nie opis „globalnie optymalny”.

### SCN-AC-009

Sprawdza [SCN-REQ-010](#scn-req-010), [SCN-REQ-019](#scn-req-019). Dostawca wskazuje źródłowe okno maksymalnie 30 min od gotowości półproduktu. Start następnej operacji po 45 min pokazuje naruszenie PRC. Usunięcie okna daje „wykonalność technologiczna niezweryfikowana”, nie nieograniczone czekanie; model predykcyjnej fermentacji nie jest wymagany.

### SCN-AC-010

Sprawdza [SCN-REQ-012](#scn-req-012). Wynik STK dla 20 kg − 19,5 kg zużycia − 0,5 kg straty pokazuje 0 kg. Ze 100 gotowych szt. 80 sprzedano, 10 przeniesiono i 10 odpisano: raport nie nalicza przychodu od 20 niesprzedanych. Przy żądaniu 110 szt. ujawnia brak zamiast dodatkowego przychodu.

### SCN-AC-011

Sprawdza [SCN-REQ-013](#scn-req-013). Dla 30 min współdzielonej pracy jednej osoby z podziałem 50/50 raport przyjmuje ECO 15+15 osobominut, nie 30+30 i drugi koszt obecności. Bez podziału wskazuje nieuzgodnioną alokację, zachowując znany nakład.

### SCN-AC-012

Sprawdza [SCN-REQ-014](#scn-req-014), [SCN-REQ-015](#scn-req-015), [SCN-REQ-016](#scn-req-016), [SCN-REQ-017](#scn-req-017). Przy zakwalifikowanej przez ECO powtarzalności, 40 000 PLN wpływów, 30 000 PLN pozostałych wydatków (w tym sprzedawca), jawnym założeniu 2 000 PLN obciążeń ponad 6 000 PLN netto właściciela oraz braku zmian zapasu/innych przepływów raport pokazuje 2 000 PLN nadwyżki i 120 000/2 000=60 miesięcy prostego zwrotu. Oddziela marżę, wynik po stałych kosztach i gotówkę; 2 000 PLN nie jest regułą podatkową. Nakład zawiera ujawnione pozycje wyposażenia, lokalu, kaucji i zapasu bez ponownego odjęcia.

### SCN-AC-013

Sprawdza [SCN-REQ-014](#scn-req-014), [SCN-REQ-017](#scn-req-017), [SCN-REQ-019](#scn-req-019). Przy 35 000 PLN wpływów i pozostałych wejściach z SCN-AC-012 nadwyżka wynosi −3 000 PLN: brak potwierdzonego skończonego zwrotu. Przy nadwyżce 0 wynik także nie jest skończony. Bez obciążeń właściciela cel netto i zwrot pozostają niezweryfikowane, nie wyliczone z zera.

### SCN-AC-014

Sprawdza [SCN-REQ-016](#scn-req-016), [SCN-REQ-019](#scn-req-019). Tydzień zużywa 10 kg otwierającego WIP bez odtworzenia. Raport może pokazać wynik tego tygodnia, ale nie potwierdza cyklicznej nadwyżki/zwrotu przez mnożenie. Po uwzględnieniu przez ECO odtworzenia i przypisanej pracy poza tygodniem przedstawia nową kwalifikację; nie wymusza identycznych stanów granicznych.

### SCN-AC-015

Sprawdza [SCN-REQ-018](#scn-req-018), [SCN-REQ-019](#scn-req-019). Właściciel porównuje A (40 h, kompletny najem) i B (84 h, brak najmu) po zmianie ceny i pieca. Raport pokazuje zmienione wejścia, wymagane godziny, osobne oceny operacyjne i finansowe oraz brak kwalifikacji finansowej B; nie ukrywa B ani nie nazywa go optymalnym biznesem.

### SCN-AC-016

Sprawdza [SCN-REQ-001](#scn-req-001), [SCN-REQ-010](#scn-req-010). Dwa identyczne przebiegi z innym szablonem położenia symbolu pieca dają te same czasy, ilości i wyniki, bez modyfikacji domeny rzeczywistej.

### SCN-AC-017

Sprawdza [SCN-REQ-020](#scn-req-020). Użytkownik bez uprawnień próbuje otworzyć lub zmienić cudzy wariant: otrzymuje odmowę, bez ujawnienia chronionych danych i bez zmiany stanu. Błąd zapisu po stronie źródła nie daje komunikatu sukcesu; ponowienie podlega kontroli integralności właściciela polityki.

### SCN-AC-018

Sprawdza [SCN-REQ-020](#scn-req-020), [SCN-REQ-019](#scn-req-019). Dla ujemnej planowanej ilości lub niezgodnych jednostek pojemności formularz wskazuje błędne wejście zamiast wiarygodnego wyniku. Błąd odczytu wariantu jest widoczny, a poprzedni wynik nie jest podpisany jako nowy. Brak najmu pozostaje brakiem, lecz poprawna chronologia jest dostępna.

### SCN-AC-019

Sprawdza [SCN-REQ-021](#scn-req-021). Na telefonie/tablecie użytkownik odczytuje po polsku liczby i „brak danych”; klawiaturą z widocznym focusem otwiera wariant i raport. Wyłączenie koloru/ruchu nie usuwa treści ani znaczenia błędu.

### SCN-AC-020

Sprawdza [SCN-REQ-022](#scn-req-022), [SCN-REQ-018](#scn-req-018). Dla działającej piekarni właściciel zestawia dwa wykonalne warianty: dodatkową osobę i piec. W każdej wersji pesymistycznej/bazowej/optymistycznej odczytuje cytowane wejścia, przedział niepewności, CAPEX/OPEX, cash flow i próg rentowności od ECO. Bez późniejszego pomiaru raport nie deklaruje empirycznej trafności; tekst asystenta nie zastępuje wyliczeń.

### SCN-AC-021

Sprawdza [SCN-REQ-002](#scn-req-002), [SCN-REQ-003](#scn-req-003), [SCN-REQ-004](#scn-req-004), [SCN-REQ-006](#scn-req-006), [SCN-REQ-007](#scn-req-007), [SCN-REQ-008](#scn-req-008), [SCN-REQ-010](#scn-req-010), [SCN-REQ-011](#scn-req-011), [SCN-REQ-013](#scn-req-013), [SCN-REQ-015](#scn-req-015), [SCN-REQ-019](#scn-req-019). Właściciel ręcznie wpisuje pochodzące z istniejącej piekarni pomiary dla receptur A v1 i B v1 z datą, skalą i maszyną: A ma 20 szt., B 12 szt.; praca piekarza A 05:45–06:00, B 06:00–06:15. Jawne czasy wypieku bez ciągłego zajęcia człowieka wynoszą A 30 min, B 20 min. W wariancie piec mieści 20 szt., A piecze się 06:00–06:30, B jest gotowe do wsadu 06:15 z ręcznie dostarczonym oknem maksymalnie 45 min ze źródłem. Właściciel zapisuje i ponownie otwiera ten wariant z osobnym sprzedawcą 07:00–15:00. Przebieg wykazuje czekanie B 15 min i wypiek 06:30–06:50, a nie jednoczesny wsad 32 szt.; znana praca piekarza to 30 min, nie 50 min pasywnego wypieku. Dla jawnie założonej sprzedaży całości po gotowości, cen A/B 20/5 PLN i pełnych kosztów zmiennych 10/2 PLN za sztukę wynik ECO daje 460 PLN przychodu, 224 PLN kosztu zmiennego i 236 PLN wkładu. Przy osobno przypisanych kosztach dnia 100 PLN oraz sprzedawcy 80 PLN pokazuje 56 PLN przed obciążeniami/dochodem właściciela. Brak kwalifikacji miesiąca i podatków pozostawia cel 6 000 PLN netto oraz zwrot niezweryfikowane. Raport wskazuje zakres podanych pomiarów i nie udaje potwierdzenia całej wydajności zakładu ani popytu. Demonstracja nie używa rejestratora ani limitu jednego produktu; liczby i technologia są przykładowe.

## Dependencies and readiness

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | REC-REQ-001, REC-REQ-002 | Wersje i skalowanie jako wejścia; brak zgody na edycję historii | start |
| contract-input | PRC-REQ-001, PRC-REQ-002, PRC-REQ-003 | Wspólna semantyka wykonania i ręcznie dostarczone okna | start |
| contract-input | STK-REQ-001, STK-REQ-002, ECO-REQ-001, ECO-REQ-002 | Bilanse i ekonomia; kwalifikacja właściwych wniosków | start |
| implementation-prerequisite | SCN-REQ-007, SCN-REQ-008, SCN-REQ-010, SCN-REQ-013 | Połączone zapisane wejścia, ograniczony przebieg/zdolność i ekonomia do demonstracji MVP-1 | demonstration |
| implementation-prerequisite | SCN-REQ-009, SCN-REQ-012, SCN-REQ-016, SCN-REQ-017, SCN-REQ-018 | Pełne mieszane porównanie MVP-2 wymaga właściwych bilansów, okien, kwalifikacji i ekonomii | demonstration |
| optional-adapter | EVT-REQ-001, WRK-REQ-001, PLN-REQ-001 | Rejestrator, dostępność operacyjna i plan; nie blokują ręcznych źródłowych pomiarów | demonstration |
| optional-adapter | MAP-REQ-003 | Mapa nie zastępuje raportu i nie blokuje oceny liczbowej | demonstration |
| release-gate | SCN-REQ-020, SCN-REQ-021 | Assurance i UI według danych/ryzyka; syntetyczne demo nie potwierdza wydania na rzeczywistych danych | release |

Trwałe obliczenia mas zależne od nierozstrzygniętej precyzji wymagają DEC-001; integracja trwałego strumienia wymaga DEC-002 na granicy współbieżności/odtwarzania. Izolowane demonstracje ich nie rozstrzygają. Konwencja kolejności i mechanizm przebiegu są przedmiotem planu implementacji, nie wyborem algorytmu w tej specyfikacji. Brak kosztu/okna/pomiaru to brak konkretnego wejścia, nie globalna decyzja o cenie lub technologii. Gotowość dokumentu nie oznacza implementacji ani empirycznej wiarygodności.
