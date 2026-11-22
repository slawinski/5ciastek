# Production plans

## Purpose and boundary

Piekarz lub kierownik zapisuje ilości i terminy gotowości, następnie uprawniona osoba zatwierdza konkretną wersję do dalszych obliczeń. Właścicielem tego artefaktu jest PLN, nie kalkulator receptury, prognoza, optymalizator ani grafik.

Plan produkcji nie jest `ProductionBatch`, `ShiftPlan` ani scenariuszem inwestycyjnym. Zatwierdzenie ilości nie potwierdza wykonalności, nie tworzy wykonania, nie zmienia potwierdzonych B2B, nie wysyła zakupów i nie publikuje grafiku. Solver i prognoza są poza podstawowym zapisem planu.

## Data and lifecycle

Plan ma stabilną tożsamość i wersję. Pozycja ma stabilny identyfikator, opublikowaną wersję receptury, dodatnią całkowitą liczbę sztuk, termin gotowości jako jednoznaczną chwilę w strefie zakładu oraz SKU, jeżeli istnieje mapowanie. Masy w jednostkach receptury pochodzą wyłącznie ze [skalowania REC-REQ-002](recipes.md#rec-req-002); opublikowany skład jest historyczny zgodnie z [REC-REQ-001](recipes.md#rec-req-001). Nie pobierać aktualnej receptury w miejsce wybranej wersji.

Typy biznesowe: identyfikatory planu/pozycji/receptury/SKU są stabilnymi identyfikatorami, nie nazwami wyświetlanymi; numer wersji jest liczbą całkowitą, liczba sztuk dodatnią liczbą całkowitą, masa liczbą z jawną jednostką, termin jednoznaczną chwilą ze strefą prezentacji. Brak SKU jest jawnym brakiem mapowania, nie pustym zastępczym identyfikatorem. To kontrakt znaczenia danych, nie projekt schematu przechowywania.

Cykl: szkic → zatwierdzona wersja → wersja zastąpiona dopiero po zatwierdzeniu następcy. Zmiana zatwierdzonego planu tworzy nowy szkic; jego samo istnienie nie zastępuje poprzedniej wersji. Autor i historia pozwalają odtworzyć zmianę. Propozycja wejściowa pozostaje propozycją do jawnej akceptacji. Wynik udostępniany odbiorcy zawiera identyfikator planu, wersję i pochodzenie pozycji, a nie bezimienną kopię ilości.

## Requirements

### PLN-REQ-001

Gdy uprawniony użytkownik zatwierdza wskazaną wersję, system musi udostępnić niezmienną zatwierdzoną treść tej wersji. Samo zatwierdzenie nie może tworzyć wykonanej partii, publikować grafiku zmian ani wysyłać zakupu; nie stanowi potwierdzenia wykonalności zasobów.

### PLN-REQ-002

Gdy użytkownik zapisuje lub otwiera szkic, system musi zachować pozycje z ich stabilną tożsamością, wybraną opublikowaną wersją receptury, liczbą sztuk, terminem i przeliczonymi masami. Edycja zatwierdzonej treści musi tworzyć nowy szkic, pozostawiając historię odczytywalną.

### PLN-REQ-003

Gdy system przyjmuje pozycję, musi odrzucić niedodatnią lub niecałkowitą liczbę sztuk, nieopublikowaną recepturę oraz niejednoznaczny albo nieistniejący termin lokalny. Musi wskazać błędne pole bez zapisania pozornie poprawnej wersji. Brak źródła receptury lub przeliczenia musi być widocznym błędem, nie masą 0.

### PLN-REQ-004

Gdy zatwierdzono następcę, system musi oznaczyć poprzednią wersję jako zastąpioną i wskazać jedną aktualną zatwierdzoną wersję odbiorcom. Każdy przekazany zestaw danych musi zachować identyfikator i wersję planu; szkic następcy nie może zmienić danych dotychczasowego odbiorcy.

### PLN-REQ-005

Gdy użytkownik lub adapter przedstawia prognozę, rekomendację obsady albo wynik optymalizacji, system musi wymagać jawnego wyboru do szkicu. Nie może traktować propozycji, wyniku kalkulatora ani szkicu jako zatwierdzonego planu; analiza szkicu musi być oznaczona jako wariant szkicowy.

### PLN-REQ-006

Gdy odbiorca wymaga SKU, system musi zablokować eksport pozycji bez mapowania SKU i wskazać brakującą pozycję. Brak SKU nie uprawnia do wymyślenia mapowania ani do przedstawienia częściowego eksportu jako pełnego sukcesu. MRP otrzymuje wyłącznie wersję zatwierdzoną; analiza grafiku może odrębnie użyć oznaczonego szkicu.

### PLN-REQ-007

Gdy następuje zapis lub zatwierdzenie, system musi sprawdzić uprawnienie po stronie serwera i odmówić bez zmiany stanu przy braku dostępu. Ponowienie tego samego zatwierdzenia nie może utworzyć drugiej wersji; konkurencyjne zatwierdzenia nie mogą ustanowić dwóch sprzecznych wersji aktualnych.

### PLN-REQ-008

Gdy zapis, odczyt źródła lub zatwierdzenie kończy się błędem, system musi pokazać błąd i zachować dotychczasową zatwierdzoną wersję bez częściowej publikacji. Widok odczytu nie może zmieniać danych domenowych; brak potwierdzenia zapisu nie może być prezentowany jako sukces.

## Acceptance criteria

### PLN-AC-001

Sprawdza PLN-REQ-002. Piekarz zapisuje 20 sztuk z opublikowanej receptury v1 na 2026-11-22 06:00 Europe/Warsaw. Ponowne otwarcie pokazuje te same identyfikatory pozycji, recepturę, termin, ilość i masy; późniejsza publikacja receptury v2 nie zmienia tego wejścia.

### PLN-AC-002

Sprawdza PLN-REQ-001, PLN-REQ-002, PLN-REQ-004. Zatwierdzono plan P/v1 z 20 sztukami. Edycja do 30 tworzy szkic P/v2: odbiorca nadal dostaje P/v1 i 20. Dopiero zatwierdzenie P/v2 udostępnia 30 i oznacza v1 jako zastąpioną, nadal odczytywalną. Nie powstają partia wykonana, opublikowany grafik ani wysłany zakup.

### PLN-AC-003

Sprawdza PLN-REQ-003. Próby zapisu 0, −1 lub 1,5 szt., receptury szkicowej, 2026-03-29 02:30 Europe/Warsaw albo 2026-10-25 02:30 bez wskazania wystąpienia są odrzucone z identyfikacją pola. Awaria źródła skalowania nie daje 0 kg ani komunikatu zapisu kompletnego planu.

### PLN-AC-004

Sprawdza PLN-REQ-005. Prognoza proponuje 30 zamiast zatwierdzonych 20. Bez wyboru człowieka nie zmienia planu. Po wyborze tworzy wejście szkicu, oznaczone jako szkic w analizie wstecznej; odbiorca MRP nadal czyta zatwierdzone 20.

### PLN-AC-005

Sprawdza PLN-REQ-006. Plan ma dwie pozycje, tylko pierwsza ma SKU. Eksport wymagający SKU wskazuje drugą pozycję jako blokadę i nie potwierdza pełnego eksportu. Po jawnym uzupełnieniu mapowania odbiorca dostaje pozycje wraz z P/v1; eksport szkicu do MRP jest odrzucony.

### PLN-AC-006

Sprawdza PLN-REQ-007. Użytkownik bez prawa zatwierdzania dostaje odmowę także przy bezpośrednim wywołaniu zapisu. Dwukrotne ponowienie tego samego zatwierdzenia pozostawia jedną wersję. Równoczesne zatwierdzenia różnych treści oparte na tej samej poprzedniej wersji kończą się jedną aktualną wersją i jawnym konfliktem drugiej próby.

### PLN-AC-007

Sprawdza PLN-REQ-008. Przy zatwierdzonej P/v1 symulowany błąd zapisu v2 pozostawia P/v1 aktualną, nie publikuje części pozycji v2 i pokazuje błąd. Awaria odczytu nie jest pustym planem ani sukcesem. Ponowne otwarcie widoku tylko do odczytu nie tworzy wersji.

## Dependencies and readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | REC-REQ-001, REC-REQ-002 | Publikacja i skalowanie jako semantyka pozycji | start |
| implementation-prerequisite | REC-REQ-001, REC-REQ-002 | Działająca publikacja/skalowanie dla rzeczywistego zapisu planu z receptury; nie cały projekt produkcji | demonstration |
| contract-input | PRC-REQ-001, PRC-REQ-002, PRC-REQ-003 | Wyłącznie gdy odbiorca ocenia wykonalność; aprobata ilości jej nie zastępuje | demonstration |
| optional-adapter | WRK-REQ-016 | Wybór propozycji obsady; brak rekomendacji nie blokuje zapisu | demonstration |
| release-gate | [Engineering assurance](../engineering-assurance.md#nieprzekraczalne-warunki) | Serwerowy dostęp, trwały zapis, historia, backup/restore, migracje, retencja oraz dowody z wersją kodu według danych i ryzyka | release |
| release-gate | [Design system](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui) | Formularz na telefonie/tablecie, klawiatura, focus, błędy bez samego koloru/ruchu | release |

Gotowość kontraktu nie dowodzi działania zapisu. DEC-001 pozostaje bramką zależnych utrwalanych przeliczeń mas; przykład 20 sztuk nie ustala zaokrągleń. Brak integracji prognozy, B2B, MRP lub CAPP nie jest blokadą startu podstawowego planu. Nie ustalono tutaj nowych okresów retencji ani deklaracji zgodności.
