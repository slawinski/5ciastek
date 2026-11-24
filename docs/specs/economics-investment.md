# ECO — Economics and investment

## Purpose and scope

Właściciel ocenia koszt SKU, warunki osiągnięcia dochodu i inwestycję; osoba uprawniona do rozliczeń dostarcza historyczne ceny i uzgodnienia. Model scenariusza obejmuje właściciela-piekarza i osobnego sprzedawcę, cel 6 000 PLN netto miesięcznie oraz jawne koszty ich pracy. Dostępność 5–7 dni/tydzień i 8–12 godzin/dzień nie stanowi niejawnego obowiązku pracy w maksimum. Wynik dotyczy zadanych cen, miksu, strat i badanego planu, nie dowodzi istnienia klientów.

Zdolność obejmuje śledzalne rzeczywiste rozliczenie wybranego SKU i wyniku piekarni oraz hipotetyczne koszty, wymaganą sprzedaż, kalendarz, nakład i prosty zwrot. Scenariusz nie wymaga gotowego POS, prognozy, pełnego magazynu, płac ani księgowości. Szersze scenariusze rozwoju firmy zachowują CAPEX/OPEX, przepływy pieniężne i niepewność; nie są warunkiem pierwszej oceny przed otwarciem. Szczegółowy rozruch/finansowanie miesiąc po miesiącu nie należy do uproszczonego normalnego miesiąca i prostego zwrotu.

## Inputs and outputs

Wejścia mają źródło, datę/wersję, okres i jednostkę: historyczny skład receptury, ceny składników (PLN/kg, PLN/g), opakowania (PLN/szt.), koszty zmienne partii (PLN/partię), sprzedaż/rabaty/refundy i kanały, uzysk/odpad, osobominuty i stawki (PLN/osobogodzinę), energia (kWh i PLN/kWh) lub jawna metoda estymacji, użycie urządzeń, najem i inne stałe koszty (PLN/miesiąc). Nakład operacyjny, indywidualny czas WorkSession, planowany koszt obsady i rzeczywisty koszt zatrudnienia są różnymi wejściami.

Wariant dostarcza ceny i proporcje produktów z określoną podstawą miksu, planowane ilości gotowe na czas, reguły strat, kalendarz produkcji/sprzedaży, wpływy i wydatki pieniężne, podatki/składki i sposób zapewnienia celu netto, wydatki początkowe oraz bilans graniczny STK. Wynik zachowuje rozróżnienie danych zmierzonych, oszacowanych i brakujących z [SCN-REQ-001](scenarios-comparison.md#scn-req-001). Kwoty muszą mieć jawną podstawę brutto/netto i okres; system nie może mieszać podstaw bez jawnego uzgodnienia ani zgadywać podatku. Nieznany najem, cena, stawka czy składka nie oznacza zera.

Wyjścia: źródłowe pozycje kosztów, marża brutto według pokazanej podstawy, marża kontrybucyjna, wynik po kosztach stałych, wynik całej piekarni i osobno nadwyżka gotówkowa; wkład na sztukę/partię/osobogodzinę/minutę wąskiego gardła; wymagana sprzedaż i porównanie z dostępną zdolnością; kwalifikacja dochodu netto, powtarzalności i prosty zwrot w miesiącach. Zestawienie pokazuje zakres dat, założenia i ograniczenia, nie tylko końcową liczbę.

## Lifecycle and invariants

Użytkownik wprowadza dane, system oblicza policzalne składniki, wskazuje braki i udostępnia wynik z podstawą. Uzupełnienie lub zmiana założeń tworzy wynik dla nowych wejść, nie przepisuje historycznych cen ani dawnego rozliczenia. Zapis/odczyt wariantów jest własnością SCN. Rzeczywista księgowość jest źródłem porównania, nie automatycznie wynikiem tego kalkulatora. Zestawienie godzin nie tworzy płacy, a wynik scenariusza nie zmienia cen, zamówień ani grafików.

## Requirements

### ECO-REQ-001

Przy rozliczeniu pracy system musi użyć jawnie uzgodnionej podstawy i alokacji, która liczy tę samą pracę w wyniku piekarni raz. Nakład operacji, indywidualny WorkSession i koszt obsady nie mogą być dodane jako trzy koszty tej samej pracy. Współdzielony nakład wymaga jawnego podziału; brak podziału musi oznaczyć koszt jako nieuzgodniony lub estymowany. Suma workerCount na równoległych operacjach nie określa unikalnych osób; system nie może deduplikować anonimowych pracowników przez domysł.

### ECO-REQ-002

Przed potwierdzeniem powtarzalnego miesiąca, miesięcznej nadwyżki lub zwrotu system musi uwzględnić netto zużycie zapasów otwarcia i WIP, uzupełnienie oraz przypisywalną pracę i koszty przygotowania poza badanym tygodniem. Musi uzgodnić skutki zmian zapasu i innych przepływów pieniężnych dla nadwyżki. Jeśli nie da się tego rozliczyć z dostarczonych danych, odpowiednie wnioski o powtarzalności, nadwyżce i zwrocie muszą pozostać jawnie niezweryfikowane mimo dodatniego wyniku samego tygodnia. Nie wymaga to identycznych stanów początkowych/końcowych ani symulacji każdego dnia pełnego miesiąca.

### ECO-REQ-003

Przy wycenie SKU system musi zachować cenę zakupu, ilość, jednostkę, datę i źródło każdej pozycji kosztu składników, opakowań i kosztu zmiennego partii. Skład i klasyfikację musi pobrać z [REC-REQ-001](recipes.md#rec-req-001), nie bieżącego surowca. Nowa cena lub klasyfikacja nie może zmienić historycznego rozliczenia; brak ceny musi pozostać wskazanym brakiem.

### ECO-REQ-004

Przy kalkulacji energii i kosztu użycia urządzenia system musi ujawnić metodę i podstawę: pomiar albo estymację z zadanych parametrów, czasu i stawki. Po dostarczeniu pomiaru musi umożliwić porównanie/aktualizację metodyki bez przedstawiania wcześniejszego szacunku jako pomiaru i bez ukrycia zmiany podstawy.

### ECO-REQ-005

W raporcie pracy system musi osobno pokazać planowany koszt obsady, koszt rzeczywistego indywidualnego czasu, roboczogodziny operacyjne, koszt etatów i ekonomiczną wartość pracy właściciela. Porównanie plan/wykonanie musi stosować ten sam zakres i ujawnione stawki. Praca właściciela nie może być uznana za darmową tylko dlatego, że nie jest wypłatą pracowniczą; jej koszt ekonomiczny i wypłata/dochodowy cel nie mogą podwójnie obciążyć tej samej podstawy wyniku.

### ECO-REQ-006

Dla wskazanego SKU/partii/okresu system musi oddzielić marżę brutto według ujawnionych kosztów, marżę kontrybucyjną (przychód minus wskazane koszty zmienne), koszty stałe, wynik piekarni po tych kosztach i nadwyżkę gotówkową według wpływów/wydatków. Musi wykazać źródła oraz wkład na sztukę, partię, osobogodzinę i minutę wskazanego wąskiego gardła; nieznany albo zerowy mianownik nie może dać pozornie dokładnego wskaźnika.

### ECO-REQ-007

Dla jawnych proporcji produktów, cen, kosztów i strat system musi wyznaczyć sprzedaż potrzebną do pokrycia kosztów i celu właściciela. Wynik musi zawierać sprzedane sztuki i przychód oraz ilość produkcji wymaganą przez założoną stratę. Gdy wkład z zadanego miksu nie pozwala pokryć dodatniego budżetu, system musi wskazać brak skończonego rozwiązania zamiast dzielić przez zero lub podać ujemną liczbę sprzedaży. Ceny około 18–20 PLN mogą być wejściem, nie uniwersalną regułą.

### ECO-REQ-008

Po wyznaczeniu wymaganej sprzedaży system musi zestawić ją z ilością wyrobów gotowych i dopuszczonych w terminach badanego planu według [STK-REQ-008](stock-inventory.md#stk-req-008). Przekroczenie zdolności oznacza niespełnienie warunków tego planu, nie niedobór klientów; nawet wystarczająca zdolność nie potwierdza popytu.

### ECO-REQ-009

Przy ocenie 6 000 PLN netto miesięcznie dla właściciela system musi ujawnić zastosowane podatki/składki, podstawę rozliczenia i koszt osobnego sprzedawcy. Brak obciążeń właściciela lub istotnego kosztu operacyjnego musi pozostawić spełnienie celu netto niezweryfikowane, bez podstawienia zera. Dodatnia marża nie jest potwierdzeniem celu ani wykonalności planu.

### ECO-REQ-010

Przy przeliczeniu tygodnia na miesiąc system musi pokazać kalendarz dni produkcji i sprzedaży oraz zastosowane przeliczniki, uwzględniając [ECO-REQ-002](#eco-req-002). Nie może utożsamiać miesiąca z czterema tygodniami lub 20 dniami sprzedaży bez takiego jawnego założenia odpowiadającego kalendarzowi.

### ECO-REQ-011

Przy zmianie rabatów, niesprzedanych ilości, cen surowców albo cen sprzedaży system musi pokazać wpływ na koszt/wkład i wynik dla tego samego zakresu z ujawnionymi zmianami. Wyroby niesprzedane lub niedostępne nie tworzą przychodu; ich koszty i odpad nie mogą znikać z analizy.

### ECO-REQ-012

Przy zestawieniu nakładu początkowego system musi wykazać jawnie wprowadzone wyposażenie, przygotowanie lokalu, kaucję i zapas początkowy z kwotą, źródłem oraz brakami. Nie może wymyślać kwot ani traktować kaucji/zapasu jako automatycznie identycznych z kosztem zużycia miesiąca.

### ECO-REQ-013

Przy obliczeniu prostego zwrotu system musi podzielić jawny nakład przez dodatnią, wyznaczoną i zakwalifikowaną do powtarzania miesięczną nadwyżkę gotówkową po zapewnieniu dochodu właściciela. Ten sam wydatek nie może być drugi raz odjęty jako nakład i bieżący wydatek tego samego okresu; faktyczne późniejsze uzupełnienie zapasu jest odrębnym przepływem. Wynik musi ujawnić założenie powtarzalności, bez obietnicy sezonowości, rozruchu czy przyszłego rynku.

### ECO-REQ-014

Przy niedodatniej lub niewyznaczonej nadwyżce system nie może przedstawić skończonego zwrotu jako potwierdzonego wyniku. Musi rozróżnić brak skończonego zwrotu przy znanej niedodatniej nadwyżce od niezweryfikowanego zwrotu przy brakach kosztów, nakładu lub kwalifikacji powtarzalności.

### ECO-REQ-015

W analizie rzeczywistych wspólnych zakupów system musi wykazać współwystępowanie produktów w koszyku i wkład koszyka na wskazanych transakcjach. Przy ocenie produktu przyciągającego klientów musi odróżnić założenie o jego wpływie od zaobserwowanego wspólnego zakupu; sam związek nie dowodzi przyczynowego wzrostu sprzedaży.

### ECO-REQ-016

W scenariuszu rozwoju działającej firmy system musi obliczyć CAPEX, OPEX, przepływy pieniężne i próg rentowności dla jawnego horyzontu oraz zestawić wariant pesymistyczny, bazowy i optymistyczny z zakresem niepewności wynikającym ze wskazanych zmiennych/założeń. Brak podstaw zakresu musi oznaczyć niepewność jako niewyznaczoną, nie statystycznie potwierdzoną. Wyniki pochodzą ze sprawdzalnych obliczeń, nie estymacji tekstowych LLM; porównanie wariantów i obsługa pytań pozostają u SCN/AST.

### ECO-REQ-017

Przy zapisaniu danych kosztowych lub odczycie wrażliwego wyniku system musi zastosować uprawnienia z [assurance](../engineering-assurance.md#artefakty-przed-implementacją). Odmowa, błąd zapisu/odczytu lub konflikt wersji nie mogą być pokazane jako sukces ani zmienić ostatniego potwierdzonego rozliczenia. Brak, estymacja, błąd i liczba muszą być odróżnialne tekstowo w polskim interfejsie zgodnym z [design systemem](../design-system.md#3-zasady-budowy-i-rozwijania-biblioteki).

### ECO-REQ-018

Przy weryfikacji rzeczywistego rozliczenia system musi umożliwić porównanie wyniku z księgowością dla tego samego okresu i podstawy oraz pokazać różnicę z nieuzgodnionymi pozycjami. Wkład na roboczogodzinę musi mieć wskazany nakład i stawkę/podstawę, nie anonimową sumę równoległych workerCount uznaną za etaty.

## Acceptance criteria

### ECO-AC-001

Dotyczy [ECO-REQ-001](#eco-req-001), [ECO-REQ-005](#eco-req-005). Jedna osoba pracowała 30 minut za 60 PLN/osobogodzinę, podział na dwie partie wynosi 50/50. Raport alokuje 15+15 osobominut, 15+15 PLN, razem 30 PLN, a nie 30+30 minut ani dodatkowe 30 PLN za obecność. Bez podziału raport pokazuje koszt nieuzgodniony/estymowany; dwa anonimowe workerCount nie tworzą dwóch imiennych etatów.

### ECO-AC-002

Dotyczy [ECO-REQ-003](#eco-req-003), [ECO-REQ-004](#eco-req-004). Rozliczenie v1 zawiera 10 kg surowca po 4 PLN/kg ze wskazanej dostawy = 40 PLN oraz opakowania 5 PLN i energię oszacowaną 2 kWh × 1 PLN/kWh = 2 PLN. Późniejsza cena 6 PLN/kg i zmiana klasyfikacji nie zmieniają 40 PLN ani historycznego składu. Pomiar 3 kWh tworzy porównanie 3 PLN wobec estymacji 2 PLN, nie przepisuje starego szacunku jako pomiaru. Brak stawki daje brak kosztu energii, nie 0 PLN.

### ECO-AC-003

Dotyczy [ECO-REQ-006](#eco-req-006), [ECO-REQ-011](#eco-req-011). Dla partii 10 sprzedanych sztuk przychód wynosi 200 PLN; jawna podstawa marży brutto obejmuje 60 PLN kosztu wyrobu, pozostałe koszty zmienne 40 PLN, stałe 50 PLN. Raport pokazuje marżę brutto 140 PLN, wkład 100 PLN (10 PLN/szt.), wynik po stałych 50 PLN, nie „zysk 140”. Przy 2 osobogodzinach i 20 minutach pieca wkład wynosi 50 PLN/osobogodzinę i 5 PLN/minutę pieca. Przy wpływach 180 PLN i wydatkach 130 PLN nadwyżka wynosi 50 PLN ze wskazaniem odrębnej podstawy; nie jest automatycznie marżą. Rabat 20 PLN zmniejsza przychód/wkład do 180/80 PLN przy niezmienionych pozostałych wejściach.

### ECO-AC-004

Dotyczy [ECO-REQ-007](#eco-req-007), [ECO-REQ-008](#eco-req-008). Cena 20 PLN/szt., koszt zmienny 10 PLN/sprzedaną sztukę przy jawnie zerowej stracie i budżet stały z kosztem celu właściciela 24 000 PLN wymagają 2 400 sprzedanych sztuk i 48 000 PLN przychodu. Badany plan z 2 200 gotowymi w terminie sztukami nie spełnia warunku. Raport nie twierdzi, że istnieje popyt na 2 400, ani że 2 400 jest możliwe w tym planie. Przy cenie równej kosztowi zmiennemu raport wskazuje brak skończonego rozwiązania dla dodatniego budżetu.

### ECO-AC-005

Dotyczy [ECO-REQ-007](#eco-req-007), [ECO-REQ-011](#eco-req-011). Miks ilości sprzedanych A/B=50/50: A ma cenę 20 PLN i koszt 10 PLN za każdą wyprodukowaną sztukę bez straty, B cenę 30 PLN i koszt 10 PLN za wyprodukowaną sztukę, z 20% produkcji niesprzedanej i odpisanej. Dla budżetu 2 200 PLN potrzeba 80 sprzedanych A i 80 sprzedanych B: produkcja A=80, B=100, przychód 4 000 PLN, koszt zmienny 1 800 PLN, wkład 2 200 PLN. Raport nie liczy 20 odpisanych B jako przychodu i ujawnia podstawę proporcji; nie stosuje bez wyjaśnienia średniej marży ignorującej stratę.

### ECO-AC-006

Dotyczy [ECO-REQ-005](#eco-req-005), [ECO-REQ-009](#eco-req-009). Wariant właściciela-piekarza ma osobnego sprzedawcę z ujawnionym kosztem i 6 000 PLN celu netto. Usunięcie najmu albo założeń podatków/składek pozostawia policzalny wkład, lecz cel netto jest niezweryfikowany. Nie podstawia się 0 PLN ani darmowej pracy właściciela; ujawniona wartość ekonomiczna pracy nie staje się drugim potrąceniem tego samego kosztu.

### ECO-AC-007

Dotyczy [ECO-REQ-010](#eco-req-010), [ECO-REQ-002](#eco-req-002). Dla jawnie rozliczonej powtarzalności i 100 sprzedanych sztuk/dzień kalendarz 22 dni sprzedaży daje 2 200 sztuk/miesiąc, nie 2 000. Raport pokazuje dni produkcji/sprzedaży i nie nazywa czterech pięciodniowych tygodni tym samym miesiącem.

### ECO-AC-008

Dotyczy [ECO-REQ-002](#eco-req-002). Tydzień zużywa 10 kg WIP otwarcia, którego nie uzupełniono, a przygotowanie przed tygodniem nie ma czasu/kosztu w danych. Dodatni wynik tygodnia pozostaje widoczny, ale powtarzalny miesiąc, nadwyżka i zwrot są niezweryfikowane. W drugim przebiegu otwarcie 10 kg, zużycie 10 kg i uzupełnienie 6 kg dają zamknięcie 6 kg. Użytkownik rozlicza dodatkowe 4 kg przygotowane poza tygodniem przed kolejnym otwarciem: 4 kg × 4 PLN/kg = 16 PLN materiału i 20 minut × 60 PLN/osobogodzinę = 20 PLN pracy. Przy uwzględnieniu tych dodatkowych 36 PLN raz, znanych kosztów pozostałych 6 kg oraz terminu/dostępności przygotowania, kwalifikacja może być spełniona mimo różnicy stanów 4 kg. Brak czasu, kosztu lub wykonalności tego uzupełnienia nadal pozostawia ją niezweryfikowaną. System nie żąda identycznego zamknięcia ani pełnego miesięcznego przebiegu.

### ECO-AC-009

Dotyczy [ECO-REQ-009](#eco-req-009), [ECO-REQ-012](#eco-req-012), [ECO-REQ-013](#eco-req-013). Przy zakwalifikowanej powtarzalności, braku zmian zapasu/innych przepływów, 40 000 PLN wpływów, 30 000 PLN innych wydatków operacyjnych (w tym sprzedawca), jawnych 2 000 PLN obciążeń właściciela i 6 000 PLN jego dochodu pozostaje 2 000 PLN/miesiąc. Nakład: wyposażenie 80 000, przygotowanie 20 000, kaucja 10 000, zapas początkowy 10 000 PLN daje 120 000 PLN i prosty zwrot 60 miesięcy. Nakład zapasu nie jest drugi raz tym samym wydatkiem miesięcznym; późniejsze rzeczywiste uzupełnianie jest rozliczone odrębnie. Kwota 2 000 PLN obciążeń jest wyłącznie założeniem przykładu, nie prawem podatkowym.

### ECO-AC-010

Dotyczy [ECO-REQ-014](#eco-req-014). Po zmianie wpływów z ECO-AC-009 na 35 000 PLN nadwyżka wynosi −3 000 PLN i raport nie pokazuje skończonego zwrotu. Przy nadwyżce 0 wynik również nie ma skończonego zwrotu. Przy brakującej kaucji lub składkach raport wskazuje niewyznaczony/niezweryfikowany wynik i konkretny brak, nie 60 miesięcy ani zerowy brakujący koszt.

### ECO-AC-011

Dotyczy [ECO-REQ-015](#eco-req-015). W 10 wskazanych koszykach 4 zawierają A i B; raport pokazuje 4 wspólne zakupy i ich wkład z pozycji kosztowych. Nazwanie A produktem przyciągającym wymaga ujawnienia tego jako założenia; raport nie przekształca 4 współwystąpień w dowód czterech dodatkowych klientów.

### ECO-AC-012

Dotyczy [ECO-REQ-016](#eco-req-016). Dla dodatkowego urządzenia CAPEX=12 000 PLN i okresu 3 miesięcy użytkownik zadaje warianty miesięcznych wpływów 9/10/11 tys. PLN i OPEX 8 tys. PLN (pesymistyczny/bazowy/optymistyczny). Raport pokazuje miesięczne saldo +1/+2/+3 tys., sumę po nakładzie za 3 miesiące −9/−6/−3 tys. PLN oraz próg pokrycia OPEX 8 tys. PLN/miesiąc przy zadanych stałych kosztach. Zakres salda +1–3 tys. jest zakresem tych założeń, nie przedziałem ufności. Bez podstawy skrajnych wartości pokazuje niewyznaczoną niepewność. Ten przepływ rozwoju nie blokuje prostego zwrotu przed otwarciem.

### ECO-AC-013

Dotyczy [ECO-REQ-017](#eco-req-017). Osoba bez prawa edycji cen próbuje zmienić historyczne rozliczenie; system odmawia bez zmiany. Przy błędzie zapisu, odczytu lub konflikcie wersji uprawniony użytkownik widzi odpowiedni stan i ostatni potwierdzony zakres, nie nowy „zapisany” wynik; brak najmu jest opisany tekstowo, nie tylko kolorem.

### ECO-AC-014

Dotyczy [ECO-REQ-018](#eco-req-018), [ECO-REQ-006](#eco-req-006). Dla tej samej podstawy i miesiąca rozliczenie wynosi 1 000 PLN, księgowość 1 100 PLN; raport pokazuje różnicę 100 PLN i nieuzgodnioną pozycję, nie automatycznie „błąd księgowości”. Nieznany nakład lub 0 osobogodzin nie daje skończonego wkładu na roboczogodzinę.

### ECO-AC-015

Dotyczy [ECO-REQ-005](#eco-req-005), [ECO-REQ-001](#eco-req-001). Dla tego samego tygodnia plan sprzedawcy wynosi 10 godzin po 30 PLN/osobogodzinę, a potwierdzony indywidualny czas 12 godzin po tej samej stawce. Raport porównuje 300 PLN planu z 360 PLN wykonania i różnicą +60 PLN. Osobno pokazuje 8 roboczogodzin operacyjnych oraz wskazany koszt etatu; przy wybranej podstawie 360 PLN nie dodaje ani 300 PLN planu, ani 8 godzin operacyjnych, ani kosztu tego samego etatu jako kolejnej płacy. Dla 5 godzin pracy właściciela po zadanej stawce ekonomicznej 60 PLN/osobogodzinę pokazuje wartość 300 PLN, nie 0 PLN; nie przedstawia jej jako wypłaty ani samodzielnego dowodu spełnienia miesięcznego celu netto.

## Dependencies and readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [REC-REQ-001](recipes.md#rec-req-001), [REC-REQ-002](recipes.md#rec-req-002) | Historyczny skład, klasyfikacja i skala; nie bieżąca cena zastępująca historię | start |
| contract-input | [WRK-REQ-001](workforce.md#wrk-req-001) | Rozdział planu obsady, indywidualnego czasu i anonimowego nakładu | start |
| contract-input | [PRC-REQ-001](process-execution.md#prc-req-001), [PRC-REQ-002](process-execution.md#prc-req-002) | Czasy i ograniczenia badanego planu; bez wymagania pełnego solvera | demonstration |
| contract-input | [STK-REQ-007](stock-inventory.md#stk-req-007), [STK-REQ-008](stock-inventory.md#stk-req-008) | Bilans granicy i gotowość do sprzedaży dla kwalifikacji wyniku | demonstration |
| implementation-prerequisite | [ECO-REQ-002](#eco-req-002), [ECO-REQ-009](#eco-req-009), [ECO-REQ-010](#eco-req-010) | Potwierdzony zwrot wymaga działającej kwalifikacji nadwyżki, netto i kalendarza dla tego wariantu | demonstration |
| optional-adapter | [SAL-REQ-006](sales-returns.md#sal-req-006), [EVT-REQ-001](production-records.md#evt-req-001) | Rzeczywiste rozliczenie wymaga użytych źródeł wykonania/sprzedaży; nie są obowiązkowym źródłem wariantu ręcznego | demonstration |
| contract-input | [SCN-REQ-001](scenarios-comparison.md#scn-req-001) | Izolowane, wersjonowane dane, zapis/odczyt i kwalifikacja porównań; AST jedynie konsumuje sprawdzalne liczby | start |
| release-gate | [Assurance](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania), [design system](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui) | Dostęp do wrażliwych danych, walidacja, historia i dowody z SHA, bez domniemania wdrożonych kontroli | release |

Gotowość liczbowa wymaga rzeczywistych wejść konkretnego wariantu: ceny, koszty, podatki/składki, kalendarz i rozliczenie granicy. To nie globalne domyślne parametry. [DEC-001](../decisions.md) blokuje zależne utrwalanie mas, a [DEC-002](../decisions.md) zależny odczyt/korekty strumienia; przykłady ich nie rozstrzygają. Brak założeń wzrostu ogranicza ECO-REQ-016, nie uruchamia obowiązku modelowania finansowania otwarcia. Dokument nie potwierdza dokładności empirycznej ani implementacji kalkulatora.
