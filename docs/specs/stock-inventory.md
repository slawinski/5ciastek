# STK — Stock and inventory

## Purpose and scope

Właściciel, magazynier lub uprawniony pracownik uzgadnia ilości surowców, półproduktów (WIP) i wyrobów. Właściciel wariantu inwestycyjnego stosuje ten sam bilans do jawnie zadanych danych. Celem jest zapewnienie materiału do planu bez fikcyjnej dostępności, nadmiernych zapasów i strat.

Zakres operacyjny obejmuje partie, FEFO, alerty i propozycje zakupów z zatwierdzonego planu. Zakres scenariusza obejmuje zadane stany, dostawy, zużycie, gotowość, przeniesienie i odpad; nie wymaga pełnego magazynu, POS, MRP ani rzeczywistych zakupów. Zapis faktów produkcyjnych należy do [EVT](production-records.md#evt-req-001), ograniczenia procesu do [PRC](process-execution.md#prc-req-001), handel do [SAL](sales-returns.md), a kwalifikacja powtarzalności miesiąca do [ECO](economics-investment.md#eco-req-002).

## Inputs and outputs

Wejście stanowi wskazany SKU/składnik/półprodukt, partia i jej pochodzenie, lokalizacja, okres z jawnymi granicami czasu i strefą, ilość i jednostka (g, kg lub szt.), czas ruchu, jego identyfikator, typ i kierunek. Dodatkowe dane to dostawca i jego partia, data przydatności, dopuszczenie do użycia/sprzedaży, historyczna cena zakupu, wersja receptury, uzysk, strata z powodem, terminy dostaw, zapas bezpieczeństwa, minimalna ilość zamówienia i czas dostawy. Nieznana wartość pozostaje brakiem; zero oznacza znane zero.

Wyjście to bilans ruchów i stan końcowy w tej samej jednostce, rozdział fizyczny/dopuszczony/niedopuszczony, pochodzenie części, dostępność w czasie, niedobory i przyczyny strat. Dla MRP wynikiem jest kalkulacja zapotrzebowania z wersją planu, różnica względem poprzedniej kalkulacji i propozycja zakupów. Dla granicy tygodnia wynikiem jest ilościowy stan surowców, WIP i wyrobów na wejściu/wyjściu oraz zużycie zapasu wejściowego i uzupełnienia, nie sama suma sprzedanych sztuk.

Źródłem rzeczywistych stanów są przyjęcia, potwierdzone ruchy i jawne korekty, nie start operacji, prognoza ani animacja. Scenariusz oznacza źródło każdego wejścia jako zmierzone, oszacowane albo brakujące zgodnie z [SCN-REQ-001](scenarios-comparison.md#scn-req-001). Ceny i ilości zachowują źródło i datę; późniejszy odczyt nie udaje aktualnej inwentaryzacji.

## Lifecycle and invariants

Materiał przechodzi przez przyjęcie, dostępność lub odrębny stan niedopuszczony, zużycie/transfer, WIP, gotowy wyrób oraz wydanie, przeniesienie albo odpad. Przyjęcie fizyczne nie stanowi dopuszczenia. Podział/łączenie nie tworzy materiału. Korekty wykonania podlegają [EVT-REQ-002](production-records.md#evt-req-002). Propozycja zakupów przechodzi do akceptacji człowieka; zatwierdzenie planu nie jest zakupem, a zatwierdzenie zakupu nie jest przyjęciem dostawy.

## Requirements

### STK-REQ-001

Przy każdym bilansie system musi zachować ilość dla tej samej jednostki, lokalizacji i okresu: stan początkowy + produkcja przyjęta + dostawy + fizyczne zwroty klientów + transfery przychodzące − wydania sprzedaży brutto − odpady − zwroty dostawcom − transfery wychodzące ± jawne korekty = stan końcowy. Dla surowców i WIP wydanie do produkcji jest zużyciem/transferem, nie dodatkową stratą. Podział musi zachować sumę ilości i identyfikatory części; łączenie musi zachować wszystkie źródła. Przeliczenie jednostek musi mieć jawną podstawę, a kg→szt. wymaga danych uzysku/konwersji, nie utożsamienia 1 kg z 1 sztuką.

### STK-REQ-002

Po potwierdzeniu fizycznego zwrotu system musi zwiększyć stan fizyczny, a stan dostępny do sprzedaży zwiększyć tylko o ilość dopuszczoną według procedury zakładu. Sam refund nie może zmienić stanu. Zwrot niesprzedawalny pozostaje odrębny do odpisu; odpis musi odjąć go dokładnie raz. Zwrot do dostawcy jest wydaniem.

### STK-REQ-003

Przy próbie ruchu system musi odrzucić ilość niedodatnią, brak wymaganej konwersji lub wydanie przekraczające znany stan, pokazując przyczynę bez częściowej zmiany bilansu. Przy nieznanym stanie system musi żądać jawnego uzupełnienia zamiast przyjąć zero lub nieograniczony zapas.

### STK-REQ-004

Przy przyjęciu lub odtworzeniu ruchu system musi rozpoznać jego unikalny identyfikator, czas, typ, ilość i kierunek tak, aby ponowienie nie zmieniło stanu drugi raz. Dwie sprzeczne treści pod tą samą tożsamością nie mogą być przedstawione jako dwa poprawne ruchy; konflikt musi być widoczny do uzgodnienia. Reguły strumienia faktów pozostają u EVT, bez ustalenia tutaj partycjonowania.

### STK-REQ-005

Przy rejestracji partii magazynowej system musi udostępnić stan według składnika, partii, jednostki i lokalizacji z dostawcą, terminem przydatności i historyczną ceną. Ruchy muszą umożliwić prześledzenie partii dostawcy do zużytej partii produkcyjnej; brak pochodzenia musi być widoczny, nie zastąpiony bieżącą dostawą.

### STK-REQ-006

Przy wskazaniu materiału do zużycia system musi stosować FEFO wśród partii dopuszczonych do użycia w wymaganym terminie. Partia przeterminowana lub niedopuszczona nie może pokrywać zapotrzebowania; brak daty lub reguły przydatności musi ograniczyć potwierdzenie dostępności zamiast zakładać bezterminową przydatność.

### STK-REQ-007

W bilansie wariantu system musi ujawnić stany początkowe surowców, WIP i wyrobów, zadane dostawy, zużycie recepturowe, straty z powodami oraz przeniesienia przez północ i granice okresu. Wynik musi zachować terminy gotowości i zadaną przydatność, tak aby materiał zużyty z zapasu otwarcia i jego uzupełnienie dały się przekazać do ECO-REQ-002. Praca przygotowująca WIP przed tygodniem pozostaje jawnym wejściem procesu/kosztu, nie bezpłatnym źródłem.

### STK-REQ-008

Przy modelowanej sprzedaży system musi ograniczyć wydanie do wyrobów gotowych i dopuszczonych w danym okresie sprzedaży. Ilość zakładana ponad dostępność musi pozostać widocznym brakiem; wyrób niesprzedany musi pozostać zapasem, przeniesieniem lub odpadem, nie przychodem.

### STK-REQ-009

Na żądanie kalkulacji MRP system musi wyznaczyć zapotrzebowanie z receptur i identyfikatora niezmiennej zatwierdzonej wersji planu zgodnie z [PLN-REQ-001](production-plans.md#pln-req-001). Szkic, sama prognoza popytu lub niezatwierdzona rekomendacja obsady nie mogą zmienić listy zatwierdzonej do realizacji.

### STK-REQ-010

Po otrzymaniu nowej zatwierdzonej wersji planu system musi pokazać różnicę zapotrzebowania względem poprzedniej kalkulacji, zachowując odwołania do obu wersji. Przekazanie przez integrację obsady jest dopuszczalnym adapterem, nie jedynym źródłem zatwierdzonego planu.

### STK-REQ-011

Przy tworzeniu propozycji zakupów system musi skorygować zapotrzebowanie o dostępny zapas, uzysk, resztki/straty, jawny zapas bezpieczeństwa, minimalne ilości zamówienia i czas dostawy. Wynik musi wskazać niedobór, ilość proponowaną i termin, którego dostawca nie może dotrzymać; nieznane parametry muszą być oznaczone jako ograniczenie kompletności propozycji.

### STK-REQ-012

Przy przeglądzie propozycji system musi umożliwić właścicielowi lub uprawnionej osobie porównanie ofert i terminów oraz akceptację zakupu z historią zmian i cen. Bez tej akceptacji nie może powstać zakup do realizacji; propozycja nie może być automatycznie wysłana do dostawcy. Dane symulacji nigdy nie stanowią rzeczywistego zlecenia zakupu.

### STK-REQ-013

Dla wskazanego planu i okresu system musi pokazać alerty brakujących surowców oraz krótkich terminów przydatności według jawnego progu ostrzegania. Bez podanego progu system musi ujawnić brak podstawy alertu „krótki termin”, nadal pokazując znane daty.

### STK-REQ-014

Przy zapisie, korekcie lub zatwierdzeniu system musi sprawdzić uprawnienie aktora zgodnie z [polityką assurance](../engineering-assurance.md#nieprzekraczalne-warunki). Odmowa, błąd odczytu/zapisu albo konflikt wersji musi pozostawić ostatni potwierdzony stan bez komunikatu powodzenia; widok musi odróżnić brak danych od znanego zera.

### STK-REQ-015

Na żądanie właściciela zestawienie magazynowe za wskazany okres musi pokazać liczbę braków, wartość zapasu na znanych cenach, odpisy przeterminowane i czas pracy przy zakupach. Brak ceny lub pomiaru czasu musi oznaczać niepełny wskaźnik, nie zerową wartość KPI.

### STK-REQ-016

Przy prezentacji bilansu, braków lub błędów system musi stosować [design system](../design-system.md#3-zasady-budowy-i-rozwijania-biblioteki) i polski tekst, tak aby stan liczbowy, brak danych i błąd były czytelne bez samego koloru lub ruchu.

## Acceptance criteria

### STK-AC-001

Dotyczy [STK-REQ-001](#stk-req-001). Dla jednego SKU, lokalizacji i dnia użytkownik rozlicza 10 szt. otwarcia, 20 szt. przyjętej produkcji i 15 szt. wydań brutto. Wynik wynosi 15 szt.; żaden składnik nie jest liczony jako sprzedaż netto po zwrotach.

### STK-AC-002

Dotyczy [STK-REQ-002](#stk-req-002), [STK-REQ-004](#stk-req-004). Ze stanu 15 fizycznych/sprzedawalnych sztuk pracownik przyjmuje 2 niesprzedawalne zwroty: wynik to fizyczne 17, sprzedawalne 15 i niedopuszczone 2. Ponowny import tego przyjęcia nie zmienia wyniku. Odpis tych 2 daje fizyczne 15/sprzedawalne 15; osobny refund bez przyjęcia nie zmienia żadnego stanu.

### STK-AC-003

Dotyczy [STK-REQ-001](#stk-req-001), [STK-REQ-003](#stk-req-003), [STK-REQ-007](#stk-req-007). Dla 20 kg system przyjmuje zużycie 19,5 kg i stratę 0,5 kg z powodem „rozlanie”; pokazuje 0 kg i powód. Dodatkowe wydanie 1 kg jest odrzucone bez zmiany zera. Przy nieznanym stanie zamiast tego żąda jego uzupełnienia; ruch 0 kg lub −1 kg jest odrzucony.

### STK-AC-004

Dotyczy [STK-REQ-001](#stk-req-001), [STK-REQ-003](#stk-req-003). Podział partii 20 szt. na A=12 i B=8 zachowuje pochodzenie obu części; wydanie 2 z A pozostawia A=10 i B=8. Połączenie dwóch źródeł zachowuje oba ich ID. Próba zapisania 1 kg jako 1 szt. bez podstawy konwersji jest odrzucona; 1000 g z jawnym przeliczeniem daje 1 kg, nie dodatkowy materiał.

### STK-AC-005

Dotyczy [STK-REQ-005](#stk-req-005), [STK-REQ-006](#stk-req-006), [STK-REQ-013](#stk-req-013). W dniu 10 czerwca partia A=5 kg ma termin 11 czerwca, B=7 kg termin 15 czerwca, C=3 kg termin 9 czerwca. Dla zużycia 6 kg tego dnia system wskazuje A=5 i B=1, nie C. Przy progu ostrzegania 2 dni pokazuje krótki termin A. Raport zużycia zachowuje dostawcę i cenę każdej partii; usunięcie daty B oznacza niezweryfikowaną przydatność B, nie datę z A.

### STK-AC-006

Dotyczy [STK-REQ-007](#stk-req-007), [STK-REQ-008](#stk-req-008). Ze 100 szt. gotowych o 09:00 model sprzedaje 80 po 09:00, przenosi 10 przydatnych do następnego dnia i odpisuje 10 z powodem. Wynik pokazuje te trzy grupy; do ekonomii trafia sprzedaż 80. Próba sprzedaży 20 o 08:00 daje brak 20, nie przychód. Dostawa i przeniesienie mają własne jawne czasy.

### STK-AC-007

Dotyczy [STK-REQ-009](#stk-req-009), [STK-REQ-010](#stk-req-010). Plan v1 zatwierdzono na 20 szt., receptura zużywa 0,5 kg/szt.; MRP pokazuje 10 kg. Szkic v2=30 szt. i zmiana prognozy nie zmieniają zatwierdzonej listy. Po zatwierdzeniu v2 MRP pokazuje 15 kg, różnicę +5 kg i oba odwołania, także gdy użytkownik przekazał plan ręcznie bez integracji obsady.

### STK-AC-008

Dotyczy [STK-REQ-011](#stk-req-011), [STK-REQ-012](#stk-req-012). Jawne zapotrzebowanie 15 kg, używalny stan 4 kg i zapas bezpieczeństwa 1 kg dają potrzebę zakupu 12 kg; przy zamówieniach w wielokrotnościach 5 kg i minimum 5 kg propozycja wynosi 15 kg. Dostawa za 3 dni przy potrzebie za 2 dni jest oznaczona jako spóźniona. Porównanie dwóch ofert nie wysyła żadnej; osoba bez prawa akceptacji nie zatwierdza. Po akceptacji właściciela istnieje historia kwoty i aktora, ale nie fikcyjne przyjęcie towaru.

### STK-AC-009

Dotyczy [STK-REQ-004](#stk-req-004), [STK-REQ-014](#stk-req-014). Ponowienie identycznego ruchu nie zmienia wyniku; ten sam ID z inną ilością pokazuje konflikt. Przy braku uprawnienia, awarii zapisu lub nieaktualnej wersji edycji stan pozostaje ostatnim potwierdzonym, a użytkownik widzi odmowę/błąd/konflikt, nie sukces ani stan 0.

### STK-AC-010

Dotyczy [STK-REQ-007](#stk-req-007), [STK-REQ-015](#stk-req-015). Tydzień otwiera 10 kg WIP przygotowanego w niedzielę; cały WIP zużyto, końcowy wynosi 0. Raport przekazuje ECO ubytek 10 kg, źródło przygotowania i brak uzupełnienia. Nie ukrywa go w produkcji tygodnia. Zapas bez ceny jest pokazany ilościowo z niepełną wyceną, nie jako zapas o wartości 0 PLN.

### STK-AC-011

Dotyczy [STK-REQ-013](#stk-req-013), [STK-REQ-015](#stk-req-015), [STK-REQ-016](#stk-req-016). Właściciel otwiera zestawienie: 2 niedobory, zapas 10 kg po 4 PLN/kg, odpis przeterminowany 1 kg po tej samej cenie i 30 minut pracy zakupowej. Raport pokazuje 2, 40 PLN, 1 kg/4 PLN i 30 minut. Usunięcie ceny lub czasu daje tekstowy brak odpowiedniego KPI. Bez progu krótkiego terminu nadal widać daty i tekst o brakującej podstawie alertu; po wyłączeniu kolorów liczba 0, brak i błąd pozostają rozróżnialne.

## Dependencies and readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [REC-REQ-001](recipes.md#rec-req-001), [REC-REQ-002](recipes.md#rec-req-002) | Historyczna receptura, skala i jednostki dla zużycia/MRP; nie pełny rejestr produkcji | start |
| contract-input | [PRC-REQ-003](process-execution.md#prc-req-003) | Okna używalności WIP; brak ogranicza kwalifikację, nie tworzy nieskończonej trwałości | demonstration |
| contract-input | [PLN-REQ-001](production-plans.md#pln-req-001) | MRP wymaga ID zatwierdzonej wersji, scenariusz nie musi zatwierdzać rzeczywistych zakupów | start |
| contract-input | [EVT-REQ-001](production-records.md#evt-req-001), [EVT-REQ-002](production-records.md#evt-req-002) | Rzeczywiste ruchy i korekty, gdy użyto tego źródła | release |
| optional-adapter | [WRK-REQ-001](workforce.md#wrk-req-001) | Integracja obsady przekazuje zatwierdzony plan, nie zastępuje jego właściciela | demonstration |
| contract-input | [SCN-REQ-001](scenarios-comparison.md#scn-req-001) | Jawne izolowane wejścia wariantu zamiast gotowych integracji magazynu/POS | demonstration |
| release-gate | [Assurance](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania), [design system](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui) | Dostęp, walidacja, historia, współbieżność, odtworzenie i dowody według danych/ryzyka; nie dowód zainstalowania kontroli | release |

Kontrakt nie ustala precyzji utrwalanych mas ([DEC-001](../decisions.md)) ani kolejności strumienia faktów ([DEC-002](../decisions.md)). Te decyzje blokują zależny zapis/odtwarzanie, nie izolowane przykłady liczbowe. Progi alertów, konwersje, daty i parametry dostaw są wejściami konkretnego zastosowania. Gotowość dokumentu nie potwierdza wdrożenia magazynu ani zakupów.
