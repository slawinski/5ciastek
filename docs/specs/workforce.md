# Workforce

## Purpose and actors

Właściciel, piekarz i kierownik mają ustalić, kto, kiedy i na ile godzin przychodzi do pracy, a następnie porównać plan z indywidualnym wykonaniem. Osoba z odpowiednim uprawnieniem publikuje grafik lub koryguje obecność. Osoba odpowiedzialna za kadry/prawo ocenia zastosowanie przepisów; aplikacja nie nadaje sobie certyfikatu zgodności.

Jedna architektura obejmuje 1–N osób: jeden model Worker, ShiftPlan i WorkSession, interfejs/API, komponenty i reguły obliczeń. Właściciel pracujący sam jest konfiguracją obsady, nie osobnym trybem. Późniejszy solver pozostaje w OPT; podstawowy grafik i heurystyka wsteczna go nie wymagają.

Poza zakresem: pełne HRM/kadry, płace, ZUS, PPK, automatyczne zatwierdzanie nadgodzin, pełna obsługa absencji, automatyczne RCP, biometria, ocena dyscypliny i identyfikacja/ocena osób kamerami. AI może objaśniać wynik, nie podejmować samodzielnych decyzji kadrowych, odmów klientom ani zakupów.

## Data and authority

| Fakt / dane | Pola i jednostki biznesowe | Granica |
|---|---|---|
| Worker | Stabilny identyfikator, rola, dostępność, opcjonalne umiejętności, forma współpracy: właściciel/UoP/zlecenie/inne | Forma współpracy określa zastosowanie reguł prawnych, nie architekturę |
| ShiftPlan | Osoba, jednoznaczny początek/koniec, strefa zakładu, planowane przerwy i ich rodzaj, autor, wersja, historia, status draft/published/changed/cancelled | Planowana dostępność, nie obecność |
| WorkSession | Osoba, początek/koniec i przerwy, czas zajścia i zapisu, źródło, autor; korekta z powodem i poprzednią wartością | Indywidualny fakt operacyjny; nie automatycznie formalna ewidencja |
| Nieobecność do planowania | Osoba, przedział niedostępności, kategoria nieobecność/urlop | Minimalne dane dostępności, nie pełna dokumentacja kadrowa ani medyczna |
| LaborSegment | Operacja/partia, przedział, liczba osób, ewentualne jawne powiązania | Własność EVT; anonimowe osobominuty nie dowodzą tożsamości ani formalnych godzin |
| Wejście produkcyjne | Pozycja, identyfikator i wersja planu PLN, sztuki/SKU gdy dostępne, gotowość, receptura, kolejność/czasy, pomiar/estymacja/brak i źródło | Szkic może służyć oznaczonemu wariantowi; zatwierdzony plan jest odrębnym artefaktem |
| Ograniczenia | Role, umiejętności, przerwy/odpoczynek, zasoby i pojemności, bufory/rezerwy | Wspólne znaczenie przebiegu: PRC-REQ-001–PRC-REQ-005 |

Wyniki: grafik dnia/tygodnia i przegląd miesiąca; godziny na osobę i łączna dostępność w osobogodzinach; propozycja wsteczna; konflikty z przedziałem i przyczyną; indywidualne odchylenie plan/wykonanie i oznaczony eksport. Źródłem cen/stawek i reguł kosztowych jest ECO, nie drugi cennik w WRK. Nakładu i obecności nie dodaje się jako dwóch kosztów tej samej pracy ([ECO-REQ-001](economics-investment.md#eco-req-001)).

Typy biznesowe: osoba/zmiana/sesja mają stabilne identyfikatory; rola i umiejętności są wskazanymi kwalifikacjami, forma współpracy jest jawną kategorią; start/koniec to jednoznaczne chwile, dostępność/przerwa to przedział, długość jest nieujemnym czasem z jednostką, obsada jest całkowitą liczbą osób. Status i rodzaj przerwy są jawnymi kategoriami, autor jest identyfikatorem aktora, powód korekty jest tekstem. Nieznana kwalifikacja, reguła przerwy lub koniec nie stają się wartością 0. Nie ustanawia to nowego schematu technicznego.

## Lifecycle and invariants

Ręczny szkic grafiku jest publikowany przez uprawnionego człowieka. Późniejsza edycja zachowuje opublikowaną wersję i historię; zmiana/anulowanie pozostawia ślad zamiast wymazania planu. WorkSession powstaje oddzielnie, z korektami pod kontrolą dostępu i retencji. Plan i fakty nie nadpisują się wzajemnie.

Trzy przyrosty pozostają odrębne: podstawowy zapis/publikacja zmian, heurystyczny szacunek wsteczny i konflikty, następnie rekomendacje powiązane. Etap A rekomendacji używa zatwierdzonego planu, dostępności i jawnych estymacji. Etap B dodaje wykonanie i prognozę. Etap C dodaje adaptery maszyn, surowców i B2B. Nie ma cyklicznej blokady całym epikiem; brak adaptera ogranicza wniosek, nie udaje wykonalności.

## Requirements

### WRK-REQ-001

Gdy system zapisuje lub przedstawia planowaną dostępność, indywidualną obecność i nakład operacji, musi zachować je jako odrębne fakty ShiftPlan, WorkSession i LaborSegment. Nie może tworzyć indywidualnej ani formalnej ewidencji z samej anonimowej liczby osób ani automatycznie deduplikować anonimowych operacji za pomocą obecności.

### WRK-REQ-002

Gdy użytkownik tworzy obsadę lub dodaje/usuwa osobę z planu, system musi używać tej samej architektury, modeli, API i formularzy dla 1, 2, 5 i większej liczby osób, zachowując istniejący grafik bez migracji do innego trybu. Usunięcie z nowego planu nie usuwa historycznej publikacji.

### WRK-REQ-003

Gdy uprawniony użytkownik opisuje pracownika, system musi zachować identyfikator, rolę, dostępność, wskazane umiejętności i formę współpracy. Brak danych o wymaganej umiejętności lub nierozstrzygnięte zastosowanie ograniczenia musi być jawnie niezweryfikowane, nie domyślnie spełnione. Potwierdzony brak wymaganej kwalifikacji oznacza konflikt obsady. Norm pracownika nie wolno automatycznie zastosować do właściciela.

### WRK-REQ-004

Gdy użytkownik ręcznie układa zmiany i planowane przerwy, system musi zapisać przedziały i pokazać je w kalendarzu dziennym/tygodniowym oraz przeglądzie miesiąca, także przez północ, bez wymogu posiadania planu produkcji. Jeżeli powiązano partie/pozycje, muszą być widoczne przy zmianie.

### WRK-REQ-005

Gdy uprawniona osoba publikuje, zmienia lub anuluje grafik, system musi zachować wersję, autora i historię poprzedniej publikacji. Edycja, propozycja ani prognoza nie mogą same publikować grafiku; odmowa uprawnienia lub konflikt wersji nie może zmieniać dotychczasowej publikacji.

### WRK-REQ-006

Gdy system sumuje planowane godziny, musi pokazać wynik dla każdej osoby i łączną dostępność zespołu po uwzględnieniu zadanych przerw; nakładające się zmiany tej samej osoby nie mogą tworzyć dodatkowej dostępności. Czas pasywny procesu nie zwiększa roboczogodzin zgodnie z PRC-REQ-001/PRC-REQ-004.

### WRK-REQ-007

Gdy system przyjmuje lub oblicza czas zmiany/obecności, musi używać jednoznacznych chwil i pokazywać lokalną datę/godzinę w strefie zakładu, domyślnie Europe/Warsaw. Nieistniejąca godzina lokalna musi być odrzucona; powtórzona wymaga wyboru offsetu/wystąpienia. Zmiana strefy prezentacji nie może zmienić upływu czasu ani historii chwil.

### WRK-REQ-008

Gdy system porównuje plan i wykonanie, musi rozdzielić czas obecności od płatnej pracy i zastosować jawnie wskazany rodzaj/regułę przerwy. Nieznana reguła płatności przerwy nie może dawać pewnego wyniku płatnych godzin; sama długość przerwy nie ustanawia reguły prawa.

### WRK-REQ-009

Gdy piekarz uruchamia szacunek wsteczny, system musi wyznaczyć propozycję początku/końca od gotowości, etapów aktywnych/pasywnych, zasobów, dostępności, przerw i jawnych buforów według PRC-REQ-001–PRC-REQ-005. Wynik musi wskazywać źródła czasów i niezweryfikowane ograniczenia; heurystyka nie jest gwarantowanym harmonogramem.

### WRK-REQ-010

Gdy do szacunku brak czasu lub kontekstu, system musi wskazać niepełność zamiast przyjąć 0. Użytkownik może uzupełnić jawną estymację ze źródłem; wynik nie może przedstawiać jej jako pomiaru. Szkic planu musi pozostać oznaczonym wariantem zgodnie z PLN-REQ-005 i nie zmieniać opublikowanego grafiku.

### WRK-REQ-011

Gdy system sprawdza obsadę, musi wykazać nakładanie zmian osoby oraz brak równoczesnej obsady/umiejętności lub czasu do terminu z podaniem przedziału, wymagania i dostępności według PRC-REQ-002. Przerwa i niedostępność przecinająca operację nie są wolnym czasem; suma roboczogodzin nie zastępuje sprawdzenia równoczesności. Propozycja nie może być przedstawiona jako spełniająca znane, mające zastosowanie reguły odpoczynku, jeżeli je narusza.

### WRK-REQ-012

Gdy uprawniony użytkownik zapisuje rzeczywistą obecność, system musi zapisać WorkSession z początkiem/końcem i przerwami, czasem zdarzenia i zapisu, źródłem oraz autorem, niezależnie od planu. Otwarte lub brakujące zakończenie pozostawia czas niepełny, nie 0 ani automatyczne zakończenie z grafiku. Ujemny przedział lub przerwa poza sesją jest błędem zapisu.

### WRK-REQ-013

Gdy uprawniony użytkownik koryguje WorkSession, system musi wymagać powodu i zachować poprzednią wartość oraz kto/kiedy/dlaczego zmienił zapis w granicach retencji. Korekta nie może po cichu zmieniać historycznego grafiku ani anonimowego nakładu operacji.

### WRK-REQ-014

Gdy użytkownik odczytuje indywidualny czas, absencję lub eksport, system musi ograniczyć dostęp do właściwej roli i celu przetwarzania po stronie serwera. Nieobecności/urlopy mają zawierać tylko dane potrzebne planowaniu; brak uprawnienia oznacza odmowę bez ujawnienia danych innej osoby.

### WRK-REQ-015

Gdy system eksportuje zestawienie godzin, musi oznaczyć je jako operacyjne albo jako formalną ewidencję po odrębnej zakończonej weryfikacji prawnej i technicznej. Domyślną drogą jest eksport/integracja z zewnętrznymi kadrami; bez tej weryfikacji nie może użyć oznaczenia „ewidencja zgodna z Kodeksem pracy”.

### WRK-REQ-016

Gdy kierownik uruchamia podstawowe rekomendacje etapu A, system musi zestawić zatwierdzoną wersję planu i dostępność z jawnymi estymacjami operacji, pokazać propozycję zmian dla 1–N osób oraz przyczyny konfliktów. Musi zaproponować dodatkową obsadę, przesunięcie lub ograniczenie niepotwierdzonej produkcji, bez samodzielnej publikacji grafiku. Brak adapterów maszyn, materiałów i B2B musi być widoczny jako brak ich weryfikacji, nie blokada tego przyrostu.

### WRK-REQ-017

Gdy rekomendacja korzysta z zamówień i prognozy, system musi rozdzielić potwierdzone B2B od zamówień wstępnych i propozycji popytu. Nie może samodzielnie zmniejszać ani anulować potwierdzonych zamówień; konflikt wymaga ostrzeżenia oraz świadomego kontaktu/decyzji człowieka. Prognoza może zasilić najwyżej szkic, nie zmienić zatwierdzonego planu ani grafiku.

### WRK-REQ-018

Gdy człowiek akceptuje wybrany wariant do dalszej realizacji, system musi przekazać odbiorcom kosztów, MRP i harmonogramu identyfikator/wersję zatwierdzonego planu PLN oraz właściwe planowane godziny i ich pochodzenie, bez niezależnych kopii pozbawionych źródła. Wyjście nie wysyła zakupów ani nie zastępuje osobnej publikacji grafiku. Stawki, koszt pracodawcy i praca właściciela są rozliczane przez ECO-REQ-001, nie przez drugi model cen.

### WRK-REQ-019

Gdy dostępne jest wykonanie, system musi pokazać godziny planowane, rzeczywiste i odchylenie na wspólnej podstawie przerw oraz umożliwić użycie obserwacji do jawnej poprawy estymacji. Nie może automatycznie nadpisać historycznego grafiku, zatwierdzonego planu ani zamienić estymacji w pomiar.

### WRK-REQ-020

Przed użyciem grafiku z pracownikami system i odpowiedzialna osoba muszą mieć ocenione mające zastosowanie reguły formy współpracy: publikacji/przekazania grafiku, odpoczynku, przerw, norm czasu i ograniczeń nocnych. Formalne użycie ewidencji wymaga dodatkowo oceny zakresu danych (noc, nadgodziny, wolne, absencje) i sposobu przechowywania dokumentacji. Nierozstrzygnięte zastosowanie musi pozostać jawną bramką wydania, nie oznaczeniem zgodności; zwykły start/stop nie spełnia tej bramki.

### WRK-REQ-021

Gdy zapis, źródło rekomendacji lub odczyt zawiedzie, system musi pokazać błąd bez potwierdzenia sukcesu i bez częściowej zmiany publikacji. Ponowienia zapisu nie mogą dublować faktu; konflikt współbieżności musi pozostawić dotychczasową spójną wersję. Odczyt/propozycja nie mogą mutować danych domenowych.

### WRK-REQ-022

Gdy kierownik ocenia rezultat pracy zespołu, system musi udostępniać z podanym okresem i źródłem czas przygotowania grafiku, odchylenie godzin, mające zastosowanie nadgodziny, nakład na 100 sztuk, opóźnione wypieki, zlecenia odrzucone z braku zdolności i koszt pracy na SKU. Brak źródła lub uzgodnionej alokacji musi oznaczać brak/kwalifikację wskaźnika, nie 0 lub pewny koszt; definicja kosztu pozostaje w ECO-REQ-001.

### WRK-REQ-023

Gdy użytkownik zapisuje ręczną zmianę, system musi wymagać wskazania istniejącej osoby, jednoznacznego początku i końca późniejszego niż początek oraz planowanych przerw mieszczących się w zmianie. Błąd pola musi dać odmowę zapisu z nazwaniem przyczyny, bez częściowej zmiany grafiku; nieznanych osób ani ujemnego czasu nie wolno przedstawiać jako dostępnej obsady.

### WRK-REQ-024

Gdy użytkownik dołącza adapter etapu B lub C, system musi rozszerzyć wynik o pochodzące z niego wykonanie/prognozę albo ograniczenia maszyn, surowców lub zamówień, zachowując zakres i tożsamość wejść. Każdy niepodłączony lub niedostępny adapter pozostawia własny zakres niezweryfikowany; dostępność jednego nie potwierdza pozostałych. Rozszerzenie nie może samo zmieniać zatwierdzonego planu ani publikacji grafiku.

### WRK-REQ-025

Gdy uprawniony użytkownik rejestruje nieobecność lub urlop potrzebny planowaniu, system musi zachować osobę, kategorię i jednoznaczny przedział niedostępności oraz uwzględnić go w dostępności. Nie może tworzyć przepracowanego WorkSession z nieobecności ani wymagać nadmiarowych danych medycznych. Nieprawidłowy przedział lub brak uprawnienia musi dać odmowę bez częściowego zapisu.

## Acceptance criteria

### WRK-AC-001

Sprawdza WRK-REQ-001. Zapis 2 osób formujących przez 30 min daje w produkcji 60 osobominut, lecz nie tworzy dwóch indywidualnych WorkSession. Dwie anonimowe równoległe deklaracje po 1 osobie nie są dowodem dwóch unikalnych osób. Obecność 8 h nie jest dodawana jako drugi koszt tych samych operacji.

### WRK-AC-002

Sprawdza WRK-REQ-002, WRK-REQ-003, WRK-REQ-004, WRK-REQ-006. Kierownik tworzy tydzień dla właściciela, dodaje drugą, potem piątą osobę i usuwa jedną z nowego szkicu: te same formularze/API i reguły dostępu zachowują poprzedni grafik. Dwie nienakładające się zmiany po 8 h dają 16 osobogodzin. Widać początek/koniec, przerwy i powiązane pozycje, jeśli podane. Ręczny zapis bez planu produkcji działa w widoku dnia/tygodnia/miesiąca.

### WRK-AC-003

Sprawdza WRK-REQ-005. Po publikacji G/v1 edycja tworzy zmieniony szkic z historią; v1 jest nadal odczytywalna. Anulowanie pozostawia autora i poprzednią treść. Nieuprawniona publikacja oraz publikacja z nieaktualnej wersji są odrzucone bez zmiany G/v1. Sama rekomendacja nie tworzy publikacji.

### WRK-AC-004

Sprawdza WRK-REQ-007. Zmiana 22:00–06:00 Europe/Warsaw przed przerwami trwa: 2026-03-28/29 — 7 h; 2026-10-24/25 — 9 h; 2026-11-17/18 — 8 h. Dotyczy planu i WorkSession. Przełączenie prezentacji tych samych chwil na inną strefę nie zmienia upływu godzin.

### WRK-AC-005

Sprawdza WRK-REQ-007. Wpis 2026-03-29 02:30 Europe/Warsaw jest odrzucony jako nieistniejący. Dla 2026-10-25 02:30 system wymaga wyboru +02:00 albo +01:00; bez niego nie zapisuje pozornie jednoznacznego początku.

### WRK-AC-006

Sprawdza WRK-REQ-008, WRK-REQ-019. Przy jawnej testowej regule jednej 30-minutowej niepłatnej przerwy w obu zapisach plan 06:00–14:00 daje 7,5 h, wykonanie 06:15–14:30 daje 7,75 h, różnica +0,25 h. Obecność wynosi odpowiednio 8 i 8,25 h. Usunięcie informacji o płatności przerwy pozostawia płatne godziny niezweryfikowane, nie ustanawia automatycznej normy prawnej.

### WRK-AC-007

Sprawdza WRK-REQ-009. Gotowość 06:00, kolejno 30 min pracy 1 osoby, 60 min procesu pasywnego i 15 min pakowania tej osoby, bez innych ograniczeń: propozycja wskazuje 04:15 jako początek pierwszej czynności, 06:00 jako koniec i 45 osobominut aktywnych. Wynik jest oznaczony jako szacunek ze źródłami, nie gwarancja pracy ciągłej przez 105 min.

### WRK-AC-008

Sprawdza WRK-REQ-010. Po usunięciu czasu fermentacji z poprzedniego wejścia wynik wskazuje brak i nie podaje kompletnego początku zakładającego 0. Wpisanie estymacji 60 min z podanym źródłem przywraca szacunek oznaczony estymacją. Zmiana gotowości w szkicu P/v2 nie zmienia opublikowanego G/v1 ani zatwierdzonego P/v1.

### WRK-AC-009

Sprawdza WRK-REQ-003, WRK-REQ-006, WRK-REQ-011. Formowanie 05:00–05:30 wymaga 2 osób. Jedna osoba wolna przez 60 min nie wystarcza. Druga dostępna 05:00–05:30 usuwa konflikt liczby, ale dostępna od 05:30 — nie. Przerwa 05:10–05:20 daje konflikt. Brak kwalifikacji pozostaje niezweryfikowany. Dwa nakładające się wpisy tej samej osoby nie dają dwóch osób ani podwójnej dostępności.

Przy potwierdzonym braku wymaganej umiejętności drugiej osoby konflikt kwalifikacji pozostaje. Przy jawnie mającej zastosowanie testowej regule odpoczynku 10 h propozycja z przerwą między zmianami 8 h wskazuje naruszenie, nie rozwiązanie konfliktu; liczby te nie ustanawiają normy prawnej.

### WRK-AC-010

Sprawdza WRK-REQ-012, WRK-REQ-013. Ręczny zapis startu 06:15, wpisany 06:20, zachowuje obie chwile i autora. Bez końca sesja jest niepełna. Koniec wcześniejszy od startu lub przerwa poza sesją jest odrzucony. Uprawniona korekta końca 14:00 na 14:30 z powodem pozostawia obie wartości i kto/kiedy/dlaczego; korekta bez powodu lub uprawnienia jest odrzucona, grafik historyczny nie zmienia się.

### WRK-AC-011

Sprawdza WRK-REQ-014. Pracownik bez uprawnienia do danych kolegi próbuje odczytu jego godzin/absencji i eksportu: serwer odmawia bez ujawnienia danych. Uprawniony kierownik widzi potrzebną planowaniu niedostępność; formularz planowania nie wymaga nadmiarowego opisu medycznego.

### WRK-AC-012

Sprawdza WRK-REQ-015, WRK-REQ-020. Bez zakończonej weryfikacji eksport ma oznaczenie operacyjne i nie twierdzi zgodności z Kodeksem pracy. Ocena formalna wymienia osobno zastosowanie do UoP i właściciela, harmonogram/przekazanie, odpoczynek/przerwy/noc/nadgodziny/absencje oraz przechowywanie. Wskazówka źródłowa o typowym miesiącu harmonogramu i tygodniu wyprzedzenia wymaga oceny wyjątków; system nie narzuca jej automatycznie każdej osobie.

### WRK-AC-013

Sprawdza WRK-REQ-016. Dla zatwierdzonego P/v1, dostępności jednej osoby i źródłowych estymacji etap A działa bez adapterów OPT/STK/B2B. Pokazuje proponowane godziny i brak weryfikacji maszyn, surowców i zamówień. Przy niedoborze godzin proponuje obsadę, przesunięcie lub ograniczenie niepotwierdzonej części; nie publikuje zmian. Dodanie drugiej osoby wykorzystuje te same reguły.

### WRK-AC-014

Sprawdza WRK-REQ-017. Potwierdzone B2B wynosi 20 szt., prognoza proponuje 10. Rekomendacja zmniejszenia nie zmienia zamówienia, zatwierdzonego P/v1 ani G/v1; pokazuje ostrzeżenie i potrzebę świadomej decyzji/kontaktu. Wybranie prognozy może utworzyć tylko szkic wariantu.

### WRK-AC-015

Sprawdza WRK-REQ-018. Po zatwierdzeniu wybranego P/v2 koszt, MRP i harmonogram otrzymują P/v2 z ilościami i planowanymi godzinami/źródłem; nie dostają nieoznaczonego szkicu v3. Nie powstaje zamówienie do dostawcy ani publikacja G/v2. Nieuzgodniona alokacja współdzielonych anonimowych 30 min nie daje dokładnego kosztu na SKU, a stawka pochodzi z ECO.

### WRK-AC-016

Sprawdza WRK-REQ-019. Obserwowane pakowanie 20 min wobec estymacji 15 min daje odchylenie +5 min i wejście do jawnej aktualizacji estymacji. Nie zmienia starego G/v1 ani P/v1 i nie przemianowuje innych szacunków na pomiary.

### WRK-AC-017

Sprawdza WRK-REQ-021. Awaria zapisu grafiku lub korekty sesji pozostawia poprzedni spójny zapis i widoczny błąd, nie częściową publikację. Ponowienie tej samej czynności nie dubluje faktu. Awaria adaptera nie jest pustą listą konfliktów ani deklaracją pełnej wykonalności; odczyt i obliczenie propozycji nie zmieniają planu.

### WRK-AC-018

Sprawdza WRK-REQ-022. Dla oznaczonego tygodnia z 100 sztukami i uzgodnionymi 120 osobominutami wynik pokazuje 120 osobominut/100 sztuk. Dla braku czasu przygotowania, brakującej alokacji kosztu lub źródła odrzuconych zleceń wskazuje brak, nie 0. Nadgodziny właściciela bez mającej zastosowanie reguły nie są prezentowane jako formalne nadgodziny pracownicze.

### WRK-AC-019

Sprawdza WRK-REQ-023. Próby zapisu zmiany bez osoby, z nieistniejącym identyfikatorem osoby, 06:00–05:00 tego samego dnia albo z przerwą 14:15–14:30 poza zmianą 06:00–14:00 wskazują błędne pole i nie zmieniają grafiku. Poprawne 22:00–06:00 następnego dnia z przerwą wewnątrz przedziału zapisuje się jako zmiana nocna.

### WRK-AC-020

Sprawdza WRK-REQ-024. Etap A dla P/v1 rozszerzono o źródłowe wykonanie i prognozę: widać ich pochodzenie, propozycja ilości trafia co najwyżej do szkicu. Dołączenie adaptera maszyny ujawnia konflikt pieca; brak adaptera materiałów i awaria B2B pozostają oddzielnie niezweryfikowane. Wynik nie potwierdza pełnej wykonalności ani nie zmienia P/v1 i G/v1.

### WRK-AC-021

Sprawdza WRK-REQ-025, WRK-REQ-014. Kierownik z uprawnieniem wpisuje urlop osoby A na 2026-11-23 00:00–2026-11-24 00:00 Europe/Warsaw. Przedział jest niedostępny w planowaniu; nie powstaje WorkSession ani wymóg diagnozy/powodu medycznego. Odwrócony przedział i zapis przez osobę bez uprawnienia są odrzucone bez zmiany dostępności; nieuprawniony kolega nie odczytuje szczegółów.

## Dependencies and release conditions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | PRC-REQ-001–PRC-REQ-005 | Sekwencja, ludzie, okna, nakład i braki dla każdego szacunku; nie drugi model wykonania | start |
| contract-input | PLN-REQ-001, PLN-REQ-004, PLN-REQ-005 | Ilości, gotowość, wersja i szkic dla propozycji; nie warunek samego zapisu zmian | start |
| implementation-prerequisite | WRK-REQ-004, PLN-REQ-002 | Działające wejście grafiku i planu dla propozycji wstecznej | demonstration |
| implementation-prerequisite | WRK-REQ-004 | Dostępność dla konfliktów; propozycja wsteczna tylko jeżeli to ona jest analizowana | demonstration |
| implementation-prerequisite | PLN-REQ-001, WRK-REQ-004 | Zatwierdzony plan i dostępność dla etapu A, z jawnymi estymacjami | demonstration |
| optional-adapter | EVT-REQ-001 | Pomiary operacji poprawiają estymacje; nie blokują ręcznego grafiku | demonstration |
| optional-adapter | WRK-REQ-012, WRK-REQ-019 | Wykonanie dla porównań etapu B, nie dla etapu A | demonstration |
| contract-input | ECO-REQ-001 | Stawki, jawna alokacja, osobno koszt pracodawcy i własnej pracy; bez podwójnego liczenia | start |
| release-gate | WRK-REQ-020, [Engineering assurance](../engineering-assurance.md#rejestr-decyzji-prawnych) | Użycie z pracownikami: ocena formy współpracy; dane osobowe: cel, role, minimalizacja, retencja, eksport/żądania osoby; formalna ewidencja dodatkowo własna weryfikacja | release |
| release-gate | [Engineering assurance](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Dostęp serwera, historia, integralność/ponowienia, backup/restore i migracje danych trwałych, dowody testów z SHA, izolacja syntetycznych danych; bez nowych okresów retencji | release |
| release-gate | [Design system](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui) | Jeden kalendarz/komponenty na telefonie i tablecie, klawiatura/focus, loading/pusty/błąd, tekst zamiast samego koloru/ruchu | release |

Adaptery popytu/sprzedaży (DEM/SAL), maszyn/harmonogramu (OPT), materiałów/MRP (STK) i zamówień (B2B) rozszerzają etapy B/C, nie blokują podstawowego grafiku ani A. Dokładne powiązania określa [zadanie integracji i porównań](../projects/workforce.md#task-wrk-006); zakres danych i braki są określone w WRK-REQ-016–WRK-REQ-018. Przekazanie dostępności do CAPP nie wymaga ukończenia rekomendacji WRK. Formalny rejestr nie blokuje anonimowych ręcznych pomiarów scenariusza.

## Specification readiness

Przykłady nie są normami prawa ani dowodem wdrożenia. Odpowiedzialny domenowy musi jeszcze potwierdzić zastosowanie konkretnych reguł prawnych do form współpracy i rozstrzygnąć, czy formalny produkt pozostaje eksportem czy oficjalnym systemem ewidencji. Te bramki dotyczą rzeczywistego/formalnego użycia, nie syntetycznego pokazu. [DEC-002](../decisions.md#dec-002) dotyczy zależnego trwałego strumienia obserwacji, nie zostaje rozstrzygnięta modelem WorkSession. Umowy retencji i uprawnień pozostają pod polityką assurance; nie wymyślać domyślnych okresów ani gotowych certyfikacji.

Źródła do odrębnej oceny zastosowania prawa: [PIP — czas pracy](https://www.pip.gov.pl/dla-pracodawcow/porady-prawne/czas-pracy), [PIP — ewidencja a lista obecności](https://www.pip.gov.pl/dla-pracodawcow/pytania-i-odpowiedzi/jaka-jest-roznica-miedzy-ewidencja-czasu-pracy-a-lista-obecnosci), [rozporządzenie o dokumentacji pracowniczej, tekst jednolity 2026](https://eli.gov.pl/api/acts/DU/2026/474/text/O/D20260474.pdf). Odnośniki nie dowodzą aktualności oceny prawnej ani zgodności produktu.
