# B2B — Zamówienia gastronomii i hurtu

## Purpose-and-scope

Kontrahent przekazuje zamówienie; operator sprzedaży sprawdza treść i warunki; uprawniona osoba potwierdza zobowiązanie; produkcja otrzymuje zatwierdzone ilości; osoba wydająca rejestruje wydanie. Właściciel ocenia marżę i terminowość klienta. Celem jest mniej przepisywania i pomyłek bez ukrywania nieweryfikowanej zdolności dostawy. Pierwszy przepływ to formularz, ręczna weryfikacja, potwierdzenie i wydanie z historią. Nie wymaga AI, pełnego solvera ani wspólnego rekomendatora obsady. Nie obejmuje własnej księgowości ani automatycznego zmniejszania istniejących zobowiązań.

## Inputs-and-outputs

Wejście: źródło formularza/e-maila, identyfikacja kontrahenta i niezbędne dane kontaktowe, SKU, ilość z jednostką handlową, zamówiona data/godzina dostawy lub odbioru ze strefą, warunki kontraktu (cena w PLN z określoną podstawą netto/brutto, minimalna ilość i okres obowiązywania), historia zmian. Brak kontraktowej ceny lub MOQ nie oznacza ceny 0 ani braku minimum. Przeliczenie jednostek wymaga jawnego przelicznika właściciela STK; przykłady w sztukach nie nakazują sprzedaży wyłącznie w sztukach.

Ocena zdolności otrzymuje ilości/terminy zleceń, dostępność ludzi i kwalifikacje WRK, harmonogram OPT oraz surowce STK. Każde źródło ma datę/wersję i zakres sprawdzenia. Wyjście: stan zamówienia, walidacja, historia weryfikacji/akceptacji, pełna lub częściowa ocena zdolności, szkic ilości PLN, lista kompletacyjna, dokument wydania, dane do zewnętrznego fakturowania i raport klienta. Dokumenty odwołują się do wersji zamówienia i rzeczywistego wydania; format i obowiązki dokumentowe wymagają uzgodnienia, nie są tu interpretacją prawa podatkowego.

## Lifecycle-and-invariants

Szkic (draft) → weryfikacja → potwierdzenie → produkcja → wydanie. Błąd walidacji zatrzymuje potwierdzenie i pozostawia edytowalny szkic/weryfikację. Weryfikacja ma wynik, autora i zakres, także gdy jest ręczna. Zmiana danych istotnych dla zobowiązania wymaga ponownej weryfikacji zmienionego zakresu, nie dziedziczy starego potwierdzenia. Anulacja jest zapisem historii, nie usunięciem zamówienia. Reguły częściowych wydań i zmian po wydaniu wymagają decyzji przed wdrożeniem tej granicy; nie wolno uznać wydania za cofnięte samym anulowaniem.

Potwierdzone ilości pozostają zobowiązaniem; rekomendacja może ograniczać wyłącznie nowe niepotwierdzone ilości. Potwierdzenie B2B nie zatwierdza planu PLN, nie publikuje grafiku i nie dowodzi fizycznego ruchu zapasu. Zwroty/refundy pozostają u SAL/STK. Ponowne przyjęcie tego samego zamówienia nie tworzy drugiego zobowiązania.

## Requirements

### B2B-REQ-001
System musi umożliwić zapis szkicu z formularza oraz przyjęcie treści e-maila do weryfikacji z zachowaniem źródła. Opcjonalna ekstrakcja AI może tylko zaproponować pola; nie może sama potwierdzić zamówienia ani zastąpić sprawdzenia operatora.

### B2B-REQ-002
Przed potwierdzeniem system musi zweryfikować datę, SKU, ilości, ceny kontraktowe, MOQ i wymagane dane kontrahenta względem właściwych warunków. Niepoprawne lub nieznane wartości musi wskazać przy danej pozycji/polu, bez cichego przyjęcia innego SKU, ceny lub terminu.

### B2B-REQ-003
System musi rozróżnić szkic, weryfikację, potwierdzenie, produkcję i wydanie oraz zapisać autora, czas i wynik akceptacji przejścia. Sam zapis szkicu, wyliczenie zdolności lub ekstrakcja treści nie mogą zmienić stanu na potwierdzony.

### B2B-REQ-004
Przy ocenie zdolności system musi pokazać osobno sprawdzenie ludzi/grafików WRK, produkcji OPT i surowców STK. Gdy źródło jest brakujące, nieaktualne wobec zmienionego zamówienia lub niezweryfikowane, musi pokazać „wykonalność niezweryfikowana”, zakres braków i umożliwić udokumentowaną decyzję uprawnionej osoby. Nie może nazywać tej decyzji automatycznie sprawdzoną zdolnością.

### B2B-REQ-005
Przy braku zdolności system musi ostrzec o ograniczeniu i może zaproponować ograniczenie nowych niepotwierdzonych ilości. Nie może automatycznie redukować potwierdzonych zleceń, nawet gdy rekomendacja popytu lub obsady wskazuje mniej dostępnej zdolności.

### B2B-REQ-006
System musi zachować historię zmian i anulacji z autorem, czasem i powodem oraz odrzucać duplikaty według uzgodnionej tożsamości źródła/zamówienia. Powtórzenie tego samego wejścia musi wskazać istniejące zamówienie, nie tworzyć kolejnego zobowiązania ani kasować historii wcześniejszej akceptacji.

### B2B-REQ-007
System musi przekazać zatwierdzone ilości i terminy jako wejście szkicu [PLN-REQ-001](production-plans.md#pln-req-001), z tożsamością zamówienia i jego wersji. Nie może uznać tego przekazania za zatwierdzenie planu lub powód do automatycznej zmiany grafiku. Brak adaptera wspólnych rekomendacji WRK nie może blokować szkicu i ręcznej weryfikacji B2B.

### B2B-REQ-008
System musi umożliwić kompletację i zapis wydania względem potwierdzonego zamówienia oraz wygenerować listę kompletacyjną, dokument wydania i dane do zewnętrznego fakturowania z pochodzeniem pozycji i ilości. Nierozstrzygnięta różnica między zamówieniem a wydaniem musi być widoczna, nie ukryta przez przepisanie ilości zamówionej.

### B2B-REQ-009
System musi przedstawić marżę i terminowość per klient oraz czas obsługi, pomyłki, opóźnienia i marżę kanału B2B dla wskazanego okresu. Marża musi korzystać z kosztów ECO, a nie nowego rachunku w B2B; brak kosztów lub rzeczywistej daty wydania musi ograniczać odpowiedni wynik, nie dawać zera kosztu ani „na czas”.

### B2B-REQ-010
System musi egzekwować osobno uprawnienia do odczytu danych kontrahenta/warunków, edycji, potwierdzania i wydania. Nieudany zapis nie może wyglądać jak potwierdzona akceptacja. Dane kontaktowe i przekazanie e-maila/AI podlegają minimalizacji, ochronie i retencji z istniejącej polityki, nie bezterminowej archiwizacji całej korespondencji.

## Acceptance-criteria

### B2B-AC-001
Dotyczy [B2B-REQ-001](#b2b-req-001), [B2B-REQ-003](#b2b-req-003). Formularz kontrahenta K tworzy szkic 30 szt. A na 06:00. E-mail przepisany ręcznie albo przez opcjonalną ekstrakcję daje pola do weryfikacji z odnośnikiem do źródła; żaden z tych zapisów nie potwierdza zamówienia. Operator przechodzi przez weryfikację, a uprawniony zatwierdzający pozostawia autora/czas akceptacji.

### B2B-AC-002
Dotyczy [B2B-REQ-002](#b2b-req-002). Umowa K dla A w danym terminie określa 8 PLN netto/szt. i MOQ 20 szt. Szkic 10 szt. za 7 PLN z nieznanym SKU B nie przechodzi potwierdzenia: system wskazuje MOQ, rozbieżną cenę i SKU. Poprawienie na 30 szt. A za 8 PLN oraz prawidłową datę i komplet danych K pozwala zakończyć walidację. Ujemna ilość lub data nierozpoznawalna pozostaje błędem, nie automatyczną korektą.

### B2B-AC-003
Dotyczy [B2B-REQ-004](#b2b-req-004), [B2B-REQ-007](#b2b-req-007). Przy wyłączonych OPT/STK i adapterze rekomendacji WRK operator nadal zapisuje szkic i ręczną weryfikację 30 szt. System pokazuje brak oceny produkcji i surowców oraz „wykonalność niezweryfikowana”. Uprawniony człowiek zapisuje decyzję i jej podstawę; wynik nie staje się automatycznie zweryfikowany. Potwierdzone 30 szt. trafia do szkicu PLN, nie zatwierdzonego planu.

### B2B-AC-004
Dotyczy [B2B-REQ-004](#b2b-req-004), [B2B-REQ-005](#b2b-req-005). Potwierdzono już 50 szt.; nowy szkic opiewa na 30, a udokumentowana pozostała zdolność wynosi 20. Ostrzeżenie proponuje najwyżej 20 nowych sztuk, pozostawiając 50 potwierdzonych bez zmiany. Po zmianie terminu ocena wykonana dla starego terminu nie jest oznaczona jako aktualna.

### B2B-AC-005
Dotyczy [B2B-REQ-003](#b2b-req-003), [B2B-REQ-006](#b2b-req-006). Ponowne dostarczenie tego samego źródłowego zamówienia K/123 wskazuje istniejący zapis. Zmiana 30 na 35 szt. zachowuje poprzednią akceptację i wymaga weryfikacji nowej ilości. Anulacja z powodem pozostaje w historii, a nie usuwa K/123. Nie traktuje się dwóch różnych zamówień tego samego klienta jako duplikatu tylko dlatego, że mają po 30 szt.

### B2B-AC-006
Dotyczy [B2B-REQ-008](#b2b-req-008). Dla potwierdzonych 30 szt. w produkcji kompletacja wskazuje 30; zapis wydania 28 ujawnia różnicę 2 szt. Dokument wydania i eksport odwołują się do faktycznych 28 i wersji zamówienia, nie przepisują historycznego 30 na 28. Sposób zamknięcia pozostałych 2 wymaga przyjętej decyzji o wydaniach częściowych.

### B2B-AC-007
Dotyczy [B2B-REQ-009](#b2b-req-009). Zamówienie miało termin 06:00, wydanie 06:15: raport pokazuje 15 min opóźnienia. Przychód 240 PLN i zgodna podstawa kosztów ECO 150 PLN dają 90 PLN marży według tej podstawy. Bez kosztu marża pozostaje niewyliczona; bez daty wydania terminowość jest nieznana. Raport wskazuje daty i klienta zamiast agregatu bez okresu.

### B2B-AC-008
Dotyczy [B2B-REQ-010](#b2b-req-010). Użytkownik z prawem szkicu, bez prawa potwierdzania, nie potwierdza K/123 i nie odczytuje zastrzeżonych warunków innego klienta. Timeout akceptacji nie pokazuje sukcesu; ponowienie według uzgodnionej tożsamości nie tworzy drugiego zamówienia. Eksport nie ujawnia zbędnej korespondencji ani kontaktów osobie bez uprawnienia.

## Dependencies-and-decisions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [REC-REQ-001](recipes.md#rec-req-001), [STK-REQ-001](stock-inventory.md#stk-req-001) | SKU i jawne jednostki/przeliczenia; katalog, nie cały system firmy | start |
| implementation-prerequisite | B2B-REQ-002/003 | Formularz, warunki kontrahenta i uprawnione ręczne potwierdzenie dla przepływu podstawowego | demonstration |
| contract-input | [ECO-REQ-001](economics-investment.md#eco-req-001), [STK-REQ-002](stock-inventory.md#stk-req-002) | Właściciele kosztu, sprzedaży i skutków fizycznego wydania; nie drugi model w B2B | start |
| implementation-prerequisite | [PLN-REQ-001](production-plans.md#pln-req-001) | Tylko demonstracja rzeczywistego przekazania potwierdzonych ilości do szkicu | demonstration |
| implementation-prerequisite | [OPT-REQ-001](optimization.md#opt-req-001), [WRK-REQ-001](workforce.md#wrk-req-001), STK-REQ-001 | Pełna automatyczna ocena odpowiednio produkcji, ludzi i surowców; nie szkic/ręczna weryfikacja | release |
| optional-adapter | WRK-REQ-001, [AST-REQ-006](owner-assistant.md#ast-req-006) | Wspólne rekomendacje obsady i ekstrakcja AI, bez warunku startu | demonstration |
| release-gate | [assurance](../engineering-assurance.md#artefakty-przed-implementacją) | Ochrona kontaktów, warunków handlowych, eksportów i akceptacji | release |

Otwarte [DEC-004](../decisions.md#dec-004) i [DEC-005](../decisions.md#dec-005) dotyczą odpowiednio rozpoznawania tego samego zamówienia między formularzem i e-mailem oraz częściowego zamknięcia i zmian lub anulacji po produkcji albo wydaniu. Blokują wyłącznie zależną implementację tych granic, nie sam szkic i ręczną weryfikację. Ponowienia przy znanej tożsamości, uprawnienia, historia i ponowna weryfikacja zmian po potwierdzeniu nadal podlegają określonym wymaganiom.

Według [klasyfikacji wyborów i warunków użycia](../decisions.md#request-classification) wymagane pola kontrahenta, dokumentów i eksportu, sposób interpretacji warunków oraz definicje czasu obsługi i rejestru pomyłek doprecyzowuje plan zadania. Konkretny kontrakt dostarcza cenę i minimum; nie wolno zastępować brakującej reguły interpretacji ani wartości domyślnym założeniem. Nie przyjęto polityki terminów, podatku VAT, MOQ ani anulacji za klienta.
