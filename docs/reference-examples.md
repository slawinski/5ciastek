# Przykłady referencyjne domen

To pochodne przykłady do czytania razem z [właścicielem kontraktu](index.md), nie nowe wymagania, wykonywalne fixture ani dowód wdrożenia. Każde wskazanie AC jest kwalifikowane numerem Issue. Tabele są niezależne: nie tworzą jednej scenariuszowej bazy danych. Zobacz [słownik](domain/glossary.md), [zasady specyfikacji](specification-style.md) i [otwarte decyzje](decisions.md).

## Receptury, skalowanie i procenty piekarskie

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| Baza: mąka 2000 g, woda 1560 g, sól 40 g, ziarna 400 g; uzysk 5 szt. | Suma 4000 g; 4000 / 5 = 800 g ciasta na porcję. Wprowadzone niezależnie 750 g jest sprzeczne. | Masa porcji nie zastępuje uzysku ani nie zmienia po cichu mas składników. | [#14](https://github.com/slawinski/5ciastek/issues/14) AC-08, AC-YIELD-01; [#17](https://github.com/slawinski/5ciastek/issues/17) AC-01, AC-08 |
| Ta baza → 10 szt., współczynnik 2 | Mąka/woda/sól/ziarna: 4000/3120/80/800 g; razem 8 kg. Woda: 3120 g = 3,12 kg. | Zmiana jednostki jest prezentacją. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-01, AC-03 |
| Ta baza → 15 szt., współczynnik 3 | 6000/4680/120/1200 g; razem 12 kg. | Ten sam przelicznik dla każdej pozycji. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-02, tabela danych referencyjnych |
| Ta baza → 20 szt., współczynnik 4 | 8000/6240/160/1600 g; razem 16 kg. | Nie jest to zapis planu #33. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-02, tabela danych referencyjnych |
| Ta baza → 30 szt., współczynnik 6 | 12000/9360/240/2400 g; razem 24 kg. | Wynik kalkulatora nie zatwierdza produkcji. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-02, tabela danych referencyjnych |
| Ta baza w trybie % przy dowolnym presecie | Mąka 100%, woda 78%, sól 2%, ziarna 20%; jednocześnie rzeczywiste masy, łączna mąka w kg i masa ciasta. | Procenty odnoszą się do całej mąki, nie do masy partii. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-04, AC-09 oraz REQ-09–REQ-11 |
| 20 szt. × 800 g; mąka 8 kg, udział typów 80%/20% | Pszenna 6,4 kg, żytnia 1,6 kg; suma mąk 100% i 8 kg, ciasto 16 kg. Każdy typ ma osobny wiersz z procentem i masą. | Mąka łącznie nie jest masą całego ciasta. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-09 |
| 2 kg mąki osobno + 1 kg zakwasu o hydracji 100% | Zakwas wnosi 0,5 kg mąki i 0,5 kg wody; mąka łącznie 2,5 kg. Do odważenia 2 kg mąki i 1 kg zakwasu, bez dodatkowego ważenia 0,5 kg mąki. | Rozłożenie składu do mianownika nie dodaje drugi raz masy do partii. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-10 |
| Zakwas bez danych o mące/wodzie; albo niepoprawny uzysk/masy | Jawny brak danych do dokładnych procentów; błędne wejście nie powoduje dzielenia przez zero. | Nie uzupełniać składu przypuszczeniem. Konkretna treść komunikatu nie jest ustalona przez te AC. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-07, AC-08 |
| Presety 10 → 30 → 10 | Końcowe masy i procenty identyczne z początkowym 10; rekord i wersja źródłowa bez zmiany. | Bez narastania zaokrągleń; przykład nie ustala precyzji zapisu. | [#17](https://github.com/slawinski/5ciastek/issues/17) AC-05, AC-06, AC-11 |
| Po publikacji v1 zmienia się bieżący skład/klasyfikacja zakwasu | Historyczne masy, podstawa mąki i procenty v1 pozostają takie same; nowa publikacja jawnie przyjmuje nowe wartości. | Historyczny skład pochodzi z wersji, nie bieżącego surowca. | [#14](https://github.com/slawinski/5ciastek/issues/14) AC-HIST-01; [#17](https://github.com/slawinski/5ciastek/issues/17) AC-HIST-01 |

## Nakład operacji i alokacja pracy

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| Formowanie 11:40–12:10, 2 osoby | 30 minut operacji × 2 = 60 osobominut. | Nie oznacza automatycznego dopisania godzin do indywidualnej ewidencji. | [#18](https://github.com/slawinski/5ciastek/issues/18) AC-04; [#28](https://github.com/slawinski/5ciastek/issues/28) AC-02 |
| Pierwsze 10 min × 1 osoba, kolejne 20 min × 2 | 10 + 40 = 50 osobominut; pasywny odcinek z obsadą 0 daje 0. | Zmiana obsady zachowuje poprzedni odcinek. | [#18](https://github.com/slawinski/5ciastek/issues/18) AC-05; [#34](https://github.com/slawinski/5ciastek/issues/34) AC-02 |
| Jedna osoba, 30 min współdzielone między dwie partie, jawny podział 50/50 | 15 + 15 osobominut do alokacji, nie 30 + 30. | Bez podziału koszt/nakład pozostaje nieuzgodniony lub estymowany; nie dodawać `WorkSession` jako kolejnego kosztu tej samej pracy. | [#5](https://github.com/slawinski/5ciastek/issues/5) AC-LAB-01 i reguły alokacji; [#43](https://github.com/slawinski/5ciastek/issues/43) AC-02 |
| Dwie równoległe anonimowe operacje, każda `workerCount=1` | Zadeklarowana obsada operacji z zastrzeżeniem lub brak liczby unikalnych osób. | Nie dowodzi obecności 2 różnych osób; anonimowych odcinków nie deduplikować automatycznie. | [#18](https://github.com/slawinski/5ciastek/issues/18) AC-LAB-01; [#43](https://github.com/slawinski/5ciastek/issues/43) AC-01 |

## Czas indywidualny, noce i przerwy

| Wejście w Europe/Warsaw | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| 2026-03-28 22:00 → 2026-03-29 06:00 | 7 rzeczywistych godzin: 21:00 → 04:00 UTC. | Przed przerwami; lokalna tarcza zegara nie mierzy czasu rzeczywistego. | [#28](https://github.com/slawinski/5ciastek/issues/28) AC-DST-01; [#27](https://github.com/slawinski/5ciastek/issues/27) AC-04 |
| 2026-10-24 22:00 → 2026-10-25 06:00 | 9 rzeczywistych godzin: 20:00 → 05:00 UTC. | Przed przerwami; godzina powtórzona wymaga wyboru offsetu/wystąpienia. | [#28](https://github.com/slawinski/5ciastek/issues/28) AC-DST-02 i reguły czasu |
| 2026-11-17 22:00 → 2026-11-18 06:00 | 8 rzeczywistych godzin: 21:00 → 05:00 UTC. | Przed przerwami; nieistniejącą lokalną godzinę należy odrzucić. | [#28](https://github.com/slawinski/5ciastek/issues/28) AC-DST-03 i reguły czasu; [#27](https://github.com/slawinski/5ciastek/issues/27) AC-04 |
| Plan 06:00–14:00, wykonanie 06:15–14:30; **założona reguła testowa:** jedna niepłatna przerwa 30 min w obu | Plan 8 − 0,5 = 7,5 h; wykonanie 8,25 − 0,5 = 7,75 h; różnica +0,25 h. | **Założenie testowe, nie uniwersalna norma prawa pracy.** Reguły zależą od stosunku prawnego i wymagają weryfikacji. | [#28](https://github.com/slawinski/5ciastek/issues/28) AC-BREAK-01 |

## Równoważność projekcji i aktualność źródła

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| Równoważne zdarzenia `manual` / `simulation`; normalizacja identyfikatorów i metadanych źródła/czasu zapisu | Te same stany, bilans/ilości i osobominuty we wspólnej projekcji. | Normalizacja porównania nie usuwa semantycznych czasów zajścia ani kolejności. Demo ma izolowane identyfikatory i nie zapisuje do produkcji. | [#18](https://github.com/slawinski/5ciastek/issues/18) AC-CONTRACT-01; [#30](https://github.com/slawinski/5ciastek/issues/30) AC-CONTRACT-01, AC-06 |
| 4 godziny fermentacji bez zdarzenia, poprawne odczyty źródła | Źródło aktualne; widoczny wiek ostatniego zdarzenia. | Cisza procesu nie jest awarią ani podstawą fikcyjnego transferu. | [#42](https://github.com/slawinski/5ciastek/issues/42) AC-01 |
| Awaria odczytu; potem przekroczenie jawnego progu adaptera | Problem oznaczony od razu; po progu dane nie są bieżące. | Ewentualny snapshot jest historyczny z czasem, bez nowych transferów. Tabela nie ustala wartości progu. | [#42](https://github.com/slawinski/5ciastek/issues/42) AC-02 i REQ-02 |
| Powrót połączenia; osobno pauza demo | Odtworzenie aktualnego snapshotu bez ponownego odgrywania przetworzonych zdarzeń/transferów. Pauza zatrzymuje zegar wirtualny. | Pauza demo nie udaje awarii live; dane demo nie wchodzą do metryk produkcyjnych. | [#42](https://github.com/slawinski/5ciastek/issues/42) AC-03 i REQ-03 |

Demo #41/#42 może korzystać z kontraktu #18 i fixture #30 bez backendu live. Adapter aktywności live wymaga #34; rzeczywiste ilości i zajętość wymagają odpowiednio #35/#36. To rozróżnienie demonstracji od gotowych źródeł i warunków wydania, nie potwierdzenie ich implementacji (#42, sekcja zależności).

## Ilości, jednostki i zasoby

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| 20 kg, strata 0,5 kg, transfer 19,5 kg | 20 − 0,5 − 19,5 = 0 kg, widoczny powód straty; kolejny transfer 1 kg odrzucony. | Nieznana ilość nie jest zerem. | [#35](https://github.com/slawinski/5ciastek/issues/35) AC-01 i REQ-02 |
| Partia 20 szt. → wsady 12 i 8 szt. | Suma 20, zachowane pochodzenie; zmiana A nie przesuwa B. | Łączenie źródeł zachowuje oba identyfikatory pochodzenia. | [#35](https://github.com/slawinski/5ciastek/issues/35) AC-02, AC-04 |
| Ponowienie `eventId`; start pieca bez transferu; 1 kg jako 1 szt. bez konwersji | Brak drugiego odjęcia, brak animacji transferu ze startu; konwersja odrzucona. | Nie utożsamiać masy z liczbą sztuk. | [#35](https://github.com/slawinski/5ciastek/issues/35) AC-03, AC-04 |
| Piec 20 szt., jednoczesne przydziały 12 + 12 | 24 > 20: nie można zatwierdzić obu. | Znana pojemność w tej samej jednostce; brak pojemności oznacza niezweryfikowane ograniczenie. | [#36](https://github.com/slawinski/5ciastek/issues/36) AC-01 i REQ-02 |
| Zwolnienie 12 szt.; ponowienie; sam plan zajęcia | Tylko właściwy zasób zmienia zajętość, bez podwójnego zwolnienia; sam plan nie dowodzi pracy maszyny. | Bez potwierdzonego zajęcia widoczny brak danych, nie aktywna maszyna. | [#36](https://github.com/slawinski/5ciastek/issues/36) AC-02, AC-03 |

## Korekty i zależności

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| Formowanie 11:40–12:10, 2 osoby; uprawniona korekta końca na 12:00 | 20 min × 2 = 40 osobominut; wcześniejsza wartość w audycie. | Korekta z powodem i autorem, nie ciche nadpisanie. | [#37](https://github.com/slawinski/5ciastek/issues/37) AC-01 i dane wejściowe |
| Koniec przed początkiem/zależnym segmentem; albo ilość unieważniająca późniejszy transfer | Odrzucenie bez częściowej zmiany projekcji; konflikt ilości wskazuje identyfikator. Równoczesna korekta nie nadpisuje nowszej wersji. | Nie przesuwać automatycznie zależnych zdarzeń ani zatwierdzonego grafiku. | [#37](https://github.com/slawinski/5ciastek/issues/37) AC-02, AC-03 i REQ-02 |

## Plan, wersja zatwierdzona i wykonanie

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| Szkic: 20 szt. z receptury v1, gotowość następnego dnia 06:00 Europe/Warsaw | Ponowne otwarcie zachowuje dane i przeliczone masy. | Wersja receptury i wersja planu to osobne tożsamości. | [#33](https://github.com/slawinski/5ciastek/issues/33) AC-01 |
| Zatwierdzony plan v1: 20 szt.; szkic planu v2: 30 szt. | Odbiorcy nadal dostają 20 z v1. Dopiero zatwierdzenie v2 udostępnia 30 i zastępuje v1. | Nie tworzy partii, nie potwierdza wykonalności, nie wysyła zakupów ani nie publikuje grafiku. | [#33](https://github.com/slawinski/5ciastek/issues/33) AC-02, REQ-04 i wyłączenia |
| 0 szt., nieopublikowana receptura, niejednoznaczny termin; ponowienia/równoczesne zatwierdzenia | Błędne wejścia odrzucone; bez drugiej wersji z ponowienia ani dwóch sprzecznych aktualnych wersji. Odmowa pozostawia plan. | Brak zapisu nie może być sukcesem. | [#33](https://github.com/slawinski/5ciastek/issues/33) AC-03, AC-04 |
| Etap A: zatwierdzony #33, dostępność #27, jawne estymacje; bez #7/#9/#11 | Ostrzeżenia i propozycja obsady działają, ale maszyny/surowce/zamówienia są jawnie niezweryfikowane. | Nie publikuje automatycznie grafiku; brak adaptera nie oznacza pełnej wykonalności. | [#29](https://github.com/slawinski/5ciastek/issues/29) AC-DEP-01 |

## Sprzedaż, stan fizyczny i zwroty

| Wejście dla jednego SKU, lokalizacji, okresu i jednostki | Oczekiwana obserwacja | Zastrzeżenie | Właściciel / źródło AC |
|---|---|---|---|
| Stan 10, przyjęta produkcja 20, wydania sprzedaży 15 | 10 + 20 − 15 = 15 szt. | Wydania brutto; zwroty są osobnymi ruchami. | [#4](https://github.com/slawinski/5ciastek/issues/4) AC-BAL-01 i reguły bilansu |
| Z 15 szt. przyjęto fizycznie 2 niesprzedawalne zwroty | Fizyczny 17, dostępny do sprzedaży 15. Odpis 2 → fizyczny 15. | Odpad odejmowany raz, bez drugiego pomniejszenia sprzedaży; dopuszczenie do sprzedaży według procedury zakładu. | [#4](https://github.com/slawinski/5ciastek/issues/4) AC-BAL-02 |
| Sam refund; ponowiony import zwrotu | Refund nie zmienia fizycznego stanu; ponowienie nie dodaje ruchu ponownie. | Zwrot pieniędzy nie jest fizycznym przyjęciem produktu. | [#4](https://github.com/slawinski/5ciastek/issues/4) AC-BAL-03 |

## Polskie stany interfejsu

Teksty oznaczone **literalny AC** są już wskazane w źródle. Wszystkie pozostałe propozycje poniżej są **wyłącznie ilustracyjne, nieprzyjęte jako obowiązujące brzmienie UI**. Nie stanowią zlecenia tłumaczenia aplikacji. [Design system](design-system.md) pozostaje źródłem zasad komponentów i dostępności.

| Stan / wejście | Tekst lub obserwacja | Kwalifikacja | Właściciel / źródło AC |
|---|---|---|---|
| Uruchomiono autolizę partii A | `Autoliza trwa` i czas od startu | **Literalny AC**; nie pokazywać zatwierdzenia, jeśli zapis się nie udał. | [#19](https://github.com/slawinski/5ciastek/issues/19) AC-01, AC-08 |
| Całe demo mapy | `SYMULACJA` stale widoczna | **Literalny AC**, nie etykieta live. | [#31](https://github.com/slawinski/5ciastek/issues/31) AC-07 |
| Utrata źródła | `brak aktualnych danych` | **Literalny AC**; cisza przy poprawnych odczytach to inny przypadek. | [#31](https://github.com/slawinski/5ciastek/issues/31) AC-06; [#42](https://github.com/slawinski/5ciastek/issues/42) AC-01–AC-03 |
| Ładowanie / pusty filtr katalogu | Np. `Ładowanie receptur…` / `Brak receptur dla tego wyszukiwania` | **Ilustracyjne, nieprzyjęte brzmienie.** Loading tam, gdzie dotyczy; pusty stan bez błędu aplikacji. | [#25](https://github.com/slawinski/5ciastek/issues/25) AC-05; [#15](https://github.com/slawinski/5ciastek/issues/15) AC-03 |
| Błąd pobierania / zapisu | Np. `Nie udało się pobrać receptur. Spróbuj ponownie.` / `Nie zapisano zakończenia operacji.` | **Ilustracyjne, nieprzyjęte brzmienie.** Umożliwić ponowienie odczytu; nie potwierdzać nieudanego zapisu. | [#15](https://github.com/slawinski/5ciastek/issues/15) AC-06; [#19](https://github.com/slawinski/5ciastek/issues/19) AC-08 |
| Klawiatura, focus, disabled, ograniczony ruch, alternatywna lista | Np. dostępna nazwa kontrolki `Pokaż listę etapów` | **Ilustracyjne, nieprzyjęte brzmienie.** Stany i ilości czytelne bez ruchu; nie polegać wyłącznie na kolorze. | [#25](https://github.com/slawinski/5ciastek/issues/25) AC-05, AC-06; [#31](https://github.com/slawinski/5ciastek/issues/31) AC-08, AC-09 |
