# Przykłady referencyjne domen

To pochodne przykłady do czytania razem z kanonicznym właścicielem kontraktu, nie nowe wymagania, wykonywalne zestawy testowe ani dowód wdrożenia. Każdy odnośnik wskazuje kwalifikowane REQ/AC. Tabele są niezależne: nie tworzą jednej scenariuszowej bazy danych. Zacznij od [portfela](product-plan.md) i [ograniczonego zadania](projects/README.md); zobacz też [słownik](domain/glossary.md), [zasady specyfikacji](specification-style.md) i [decyzje](decisions.md). GitHub zachowuje wyłącznie pochodzenie historyczne.

## Receptury, skalowanie i procenty piekarskie

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| Baza: mąka 2000 g, woda 1560 g, sól 40 g, ziarna 400 g; uzysk 5 szt. | Suma 4000 g; 4000 / 5 = 800 g ciasta na porcję. Wprowadzone niezależnie 750 g jest sprzeczne. | Masa porcji nie zastępuje uzysku ani nie zmienia po cichu mas składników. | [REC-REQ-002](specs/recipes.md#rec-req-002), [REC-AC-002](specs/recipes.md#rec-ac-002), [REC-AC-010](specs/recipes.md#rec-ac-010) |
| Ta baza → 10 szt., współczynnik 2 | Mąka/woda/sól/ziarna: 4000/3120/80/800 g; razem 8 kg. Woda: 3120 g = 3,12 kg. | Zmiana jednostki jest prezentacją. | [REC-AC-010](specs/recipes.md#rec-ac-010) |
| Ta baza → 15 szt., współczynnik 3 | 6000/4680/120/1200 g; razem 12 kg. | Ten sam przelicznik dla każdej pozycji. | [REC-AC-010](specs/recipes.md#rec-ac-010) |
| Ta baza → 20 szt., współczynnik 4 | 8000/6240/160/1600 g; razem 16 kg. | Nie jest to zapis planu PLN. | [REC-AC-010](specs/recipes.md#rec-ac-010), [REC-REQ-012](specs/recipes.md#rec-req-012) |
| Ta baza → 30 szt., współczynnik 6 | 12000/9360/240/2400 g; razem 24 kg. | Wynik kalkulatora nie zatwierdza produkcji. | [REC-AC-010](specs/recipes.md#rec-ac-010), [REC-REQ-012](specs/recipes.md#rec-req-012) |
| Ta baza w trybie % przy dowolnym presecie | Mąka 100%, woda 78%, sól 2%, ziarna 20%; jednocześnie rzeczywiste masy, łączna mąka w kg i masa ciasta. | Procenty odnoszą się do całej mąki, nie do masy partii. | [REC-REQ-009](specs/recipes.md#rec-req-009), [REC-REQ-010](specs/recipes.md#rec-req-010), [REC-AC-011](specs/recipes.md#rec-ac-011) |
| 20 szt. × 800 g; mąka 8 kg, udział typów 80%/20% | Pszenna 6,4 kg, żytnia 1,6 kg; suma mąk 100% i 8 kg, ciasto 16 kg. Każdy typ ma osobny wiersz z procentem i masą. | Mąka łącznie nie jest masą całego ciasta. | [REC-AC-012](specs/recipes.md#rec-ac-012) |
| 2 kg mąki osobno + 1 kg zakwasu o hydracji 100% | Zakwas wnosi 0,5 kg mąki i 0,5 kg wody; mąka łącznie 2,5 kg. Do odważenia 2 kg mąki i 1 kg zakwasu, bez dodatkowego ważenia 0,5 kg mąki. | Rozłożenie składu do mianownika nie dodaje drugi raz masy do partii. | [REC-AC-013](specs/recipes.md#rec-ac-013) |
| Zakwas bez danych o mące/wodzie; albo niepoprawny uzysk/masy | Jawny brak danych do dokładnych procentów; błędne wejście nie powoduje dzielenia przez zero. | Nie uzupełniać składu przypuszczeniem. Konkretna treść komunikatu nie jest ustalona przez te AC. | [REC-AC-014](specs/recipes.md#rec-ac-014) |
| Presety 10 → 30 → 10 | Końcowe masy i procenty identyczne z początkowym 10; rekord i wersja źródłowa bez zmiany. | Bez narastania zaokrągleń; przykład nie ustala precyzji zapisu. | [REC-AC-011](specs/recipes.md#rec-ac-011) |
| Po publikacji v1 zmienia się bieżący skład/klasyfikacja zakwasu | Historyczne masy, podstawa mąki i procenty v1 pozostają takie same; nowa publikacja jawnie przyjmuje nowe wartości. | Historyczny skład pochodzi z wersji, nie bieżącego surowca. | [REC-REQ-001](specs/recipes.md#rec-req-001), [REC-AC-004](specs/recipes.md#rec-ac-004) |

## Nakład operacji i alokacja pracy

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| Formowanie 11:40–12:10, 2 osoby | 30 minut operacji × 2 = 60 osobominut. | Nie oznacza automatycznego dopisania godzin do indywidualnej ewidencji. | [EVT-AC-004](specs/production-records.md#evt-ac-004), [WRK-AC-001](specs/workforce.md#wrk-ac-001) |
| Pierwsze 10 min × 1 osoba, kolejne 20 min × 2 | 10 + 40 = 50 osobominut; pasywny odcinek z obsadą 0 daje 0. | Zmiana obsady zachowuje poprzedni odcinek. | [EVT-REQ-005](specs/production-records.md#evt-req-005), [EVT-AC-004](specs/production-records.md#evt-ac-004) |
| Jedna osoba, 30 min współdzielone między dwie partie, jawny podział 50/50 | 15 + 15 osobominut do alokacji, nie 30 + 30. | Bez podziału koszt/nakład pozostaje nieuzgodniony lub estymowany; nie dodawać WorkSession jako kolejnego kosztu tej samej pracy. | [ECO-REQ-001](specs/economics-investment.md#eco-req-001), [ECO-AC-001](specs/economics-investment.md#eco-ac-001), [MAP-AC-003](specs/flow-map-demo.md#map-ac-003) |
| Dwie równoległe anonimowe operacje, każda workerCount=1 | Zadeklarowana obsada operacji z zastrzeżeniem lub brak liczby unikalnych osób. | Nie dowodzi obecności 2 różnych osób; anonimowych odcinków nie deduplikować automatycznie. | [EVT-AC-005](specs/production-records.md#evt-ac-005), [MAP-AC-013](specs/flow-map-demo.md#map-ac-013) |

## Czas indywidualny, noce i przerwy

| Wejście w Europe/Warsaw | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| 2026-03-28 22:00 → 2026-03-29 06:00 | 7 rzeczywistych godzin: 21:00 → 04:00 UTC. | Przed przerwami; lokalna tarcza zegara nie mierzy czasu rzeczywistego. | [WRK-REQ-007](specs/workforce.md#wrk-req-007), [WRK-AC-004](specs/workforce.md#wrk-ac-004) |
| 2026-10-24 22:00 → 2026-10-25 06:00 | 9 rzeczywistych godzin: 20:00 → 05:00 UTC. | Przed przerwami; godzina powtórzona wymaga wyboru offsetu/wystąpienia. | [WRK-AC-004](specs/workforce.md#wrk-ac-004), [WRK-AC-005](specs/workforce.md#wrk-ac-005) |
| 2026-11-17 22:00 → 2026-11-18 06:00 | 8 rzeczywistych godzin: 21:00 → 05:00 UTC. | Przed przerwami; nieistniejącą lokalną godzinę należy odrzucić. | [WRK-AC-004](specs/workforce.md#wrk-ac-004), [WRK-AC-005](specs/workforce.md#wrk-ac-005) |
| Plan 06:00–14:00, wykonanie 06:15–14:30; **założona reguła testowa:** jedna niepłatna przerwa 30 min w obu | Plan 8 − 0,5 = 7,5 h; wykonanie 8,25 − 0,5 = 7,75 h; różnica +0,25 h. | **Założenie testowe, nie uniwersalna norma prawa pracy.** Reguły zależą od stosunku prawnego i wymagają weryfikacji. | [WRK-REQ-008](specs/workforce.md#wrk-req-008), [WRK-AC-006](specs/workforce.md#wrk-ac-006) |

## Równoważność projekcji i aktualność źródła

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| Równoważne zdarzenia manual / simulation; normalizacja identyfikatorów i metadanych źródła/czasu zapisu | Te same stany, bilans/ilości i osobominuty we wspólnej projekcji. | Normalizacja porównania nie usuwa semantycznych czasów zajścia ani kolejności. Demo ma izolowane identyfikatory i nie zapisuje do produkcji. | [EVT-REQ-009](specs/production-records.md#evt-req-009), [EVT-AC-008](specs/production-records.md#evt-ac-008), [MAP-AC-001](specs/flow-map-demo.md#map-ac-001) |
| 4 godziny fermentacji bez zdarzenia, poprawne odczyty źródła | Źródło aktualne; widoczny wiek ostatniego zdarzenia. | Cisza procesu nie jest awarią ani podstawą fikcyjnego transferu. | [MAP-AC-010](specs/flow-map-demo.md#map-ac-010) |
| Awaria odczytu; potem przekroczenie jawnego progu adaptera | Problem oznaczony od razu; po progu dane nie są bieżące. | Ewentualny obraz stanu jest historyczny z czasem, bez nowych transferów. Tabela nie ustala wartości progu. | [MAP-REQ-012](specs/flow-map-demo.md#map-req-012), [MAP-AC-011](specs/flow-map-demo.md#map-ac-011) |
| Powrót połączenia; osobno pauza demo | Odtworzenie aktualnego obrazu stanu bez ponownego odgrywania przetworzonych zdarzeń/transferów. Pauza zatrzymuje zegar wirtualny. | Pauza demo nie udaje awarii danych rzeczywistych; dane demo nie wchodzą do metryk produkcyjnych. | [MAP-REQ-013](specs/flow-map-demo.md#map-req-013), [MAP-AC-002](specs/flow-map-demo.md#map-ac-002), [MAP-AC-011](specs/flow-map-demo.md#map-ac-011) |

[TASK-MAP-001](projects/flow-map.md#task-map-001) może demonstrować kontrakt EVT na izolowanym zestawie MAP bez działającego źródła rzeczywistego. [TASK-MAP-002](projects/flow-map.md#task-map-002) wymaga producentów faktów tylko w używanym zakresie danych rzeczywistych: aktywności EVT, ilości [EVT-REQ-011](specs/production-records.md#evt-req-011) i zajętości [EVT-REQ-013](specs/production-records.md#evt-req-013). Demonstracja nie potwierdza ich implementacji. [DEC-001](decisions.md#dec-001) i [DEC-002](decisions.md#dec-002) pozostają OPEN na granicach trwałej masy oraz tożsamości, kolejności i odtwarzania strumienia; zestaw przykładowy nie wybiera ich rozwiązania.

## Ilości, jednostki i zasoby

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| 20 kg, strata 0,5 kg, transfer 19,5 kg | 20 − 0,5 − 19,5 = 0 kg, widoczny powód straty; kolejny transfer 1 kg odrzucony. | Nieznana ilość nie jest zerem. | [STK-REQ-001](specs/stock-inventory.md#stk-req-001), [EVT-AC-010](specs/production-records.md#evt-ac-010) |
| Partia 20 szt. → wsady 12 i 8 szt. | Suma 20, zachowane pochodzenie; zmiana A nie przesuwa B. | Łączenie źródeł zachowuje oba identyfikatory pochodzenia. | [EVT-AC-011](specs/production-records.md#evt-ac-011), [STK-AC-004](specs/stock-inventory.md#stk-ac-004) |
| Ponowienie eventId; start pieca bez transferu; 1 kg jako 1 szt. bez konwersji | Brak drugiego odjęcia, brak animacji transferu ze startu; konwersja odrzucona. | Nie utożsamiać masy z liczbą sztuk. | [EVT-AC-010](specs/production-records.md#evt-ac-010), [EVT-AC-011](specs/production-records.md#evt-ac-011), [EVT-AC-012](specs/production-records.md#evt-ac-012) |
| Piec 20 szt., jednoczesne przydziały 12 + 12 | 24 > 20: nie można zatwierdzić obu. | Znana pojemność w tej samej jednostce; brak pojemności oznacza niezweryfikowane ograniczenie. | [EVT-AC-013](specs/production-records.md#evt-ac-013), [PRC-REQ-002](specs/process-execution.md#prc-req-002) |
| Zwolnienie 12 szt.; ponowienie; sam plan zajęcia | Tylko właściwy zasób zmienia zajętość, bez podwójnego zwolnienia; sam plan nie dowodzi pracy maszyny. | Bez potwierdzonego zajęcia widoczny brak danych, nie aktywna maszyna. | [EVT-AC-013](specs/production-records.md#evt-ac-013), [MAP-AC-012](specs/flow-map-demo.md#map-ac-012) |

## Korekty i zależności

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| Formowanie 11:40–12:10, 2 osoby; uprawniona korekta końca na 12:00 | 20 min × 2 = 40 osobominut; wcześniejsza wartość w audycie. | Korekta z powodem i autorem, nie ciche nadpisanie. | [EVT-REQ-002](specs/production-records.md#evt-req-002), [EVT-AC-014](specs/production-records.md#evt-ac-014) |
| Koniec przed początkiem/zależnym segmentem; albo ilość unieważniająca późniejszy transfer | Odrzucenie bez częściowej zmiany projekcji; konflikt ilości wskazuje identyfikator. Równoczesna korekta nie nadpisuje nowszej wersji. | Nie przesuwać automatycznie zależnych zdarzeń ani zatwierdzonego grafiku. Wszystkie istniejące zależności podlegają walidacji. | [EVT-REQ-002](specs/production-records.md#evt-req-002), [EVT-AC-015](specs/production-records.md#evt-ac-015), [EVT-AC-019](specs/production-records.md#evt-ac-019) |

## Plan, wersja zatwierdzona i wykonanie

| Wejście | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| Szkic: 20 szt. z receptury v1, gotowość następnego dnia 06:00 Europe/Warsaw | Ponowne otwarcie zachowuje dane i przeliczone masy. | Wersja receptury i wersja planu to osobne tożsamości. | [PLN-AC-001](specs/production-plans.md#pln-ac-001) |
| Zatwierdzony plan v1: 20 szt.; szkic planu v2: 30 szt. | Odbiorcy nadal dostają 20 z v1. Dopiero zatwierdzenie v2 udostępnia 30 i zastępuje v1. | Nie tworzy partii, nie potwierdza wykonalności, nie wysyła zakupów ani nie publikuje grafiku. | [PLN-REQ-001](specs/production-plans.md#pln-req-001), [PLN-AC-002](specs/production-plans.md#pln-ac-002) |
| 0 szt., nieopublikowana receptura, niejednoznaczny termin; ponowienia/równoczesne zatwierdzenia | Błędne wejścia odrzucone; bez drugiej wersji z ponowienia ani dwóch sprzecznych aktualnych wersji. Odmowa pozostawia plan. | Brak zapisu nie może być sukcesem. | [PLN-AC-003](specs/production-plans.md#pln-ac-003), [PLN-AC-006](specs/production-plans.md#pln-ac-006), [PLN-AC-007](specs/production-plans.md#pln-ac-007) |
| Etap A: zatwierdzony PLN, dostępność WRK, jawne estymacje; bez OPT/STK/B2B | Ostrzeżenia i propozycja obsady działają, ale maszyny/surowce/zamówienia są jawnie niezweryfikowane. | Nie publikuje automatycznie grafiku; brak adaptera nie oznacza pełnej wykonalności. | [WRK-REQ-016](specs/workforce.md#wrk-req-016), [WRK-AC-013](specs/workforce.md#wrk-ac-013) |

## Sprzedaż, stan fizyczny i zwroty

| Wejście dla jednego SKU, lokalizacji, okresu i jednostki | Oczekiwana obserwacja | Zastrzeżenie | Kanoniczny właściciel / AC |
|---|---|---|---|
| Stan 10, przyjęta produkcja 20, wydania sprzedaży 15 | 10 + 20 − 15 = 15 szt. | Wydania brutto; zwroty są osobnymi ruchami. | [STK-REQ-001](specs/stock-inventory.md#stk-req-001), [STK-AC-001](specs/stock-inventory.md#stk-ac-001) |
| Z 15 szt. przyjęto fizycznie 2 niesprzedawalne zwroty | Fizyczny 17, dostępny do sprzedaży 15. Odpis 2 → fizyczny 15. | Odpad odejmowany raz, bez drugiego pomniejszenia sprzedaży; dopuszczenie do sprzedaży według procedury zakładu. | [STK-REQ-002](specs/stock-inventory.md#stk-req-002), [STK-AC-002](specs/stock-inventory.md#stk-ac-002), [SAL-AC-002](specs/sales-returns.md#sal-ac-002) |
| Sam refund; ponowiony import zwrotu | Refund nie zmienia fizycznego stanu; ponowienie nie dodaje ruchu ponownie. | Zwrot pieniędzy nie jest fizycznym przyjęciem produktu. | [STK-AC-002](specs/stock-inventory.md#stk-ac-002), [SAL-AC-002](specs/sales-returns.md#sal-ac-002) |

## Polskie stany interfejsu

Zachowano teksty wskazane w dawnych AC, z odnośnikami do kanonicznych właścicieli zachowania. Odrębnie oznaczono propozycje **ilustracyjne, nieprzyjęte jako obowiązujące brzmienie UI**. Tabela jest pochodna: nie zastępuje kanonicznego kontraktu ani nie stanowi zlecenia tłumaczenia aplikacji. [Design system](design-system.md#ui-accessibility) pozostaje właścicielem zasad komponentów i dostępności.

| Stan / wejście | Tekst lub obserwacja | Kwalifikacja | Kanoniczny właściciel / AC |
|---|---|---|---|
| Uruchomiono autolizę partii A | `Autoliza trwa` i czas od startu | Tekst przejęty z historycznego AC; kanoniczny kontrakt wymaga tekstowego stanu „trwa” i czasu od startu. Nie pokazywać zatwierdzenia, jeśli zapis się nie udał. | [EVT-REQ-014](specs/production-records.md#evt-req-014), [EVT-AC-016](specs/production-records.md#evt-ac-016) |
| Całe demo mapy | `SYMULACJA` stale widoczna | Oznaczenie wymagane przez kanoniczny AC, nie etykieta LIVE. | [MAP-REQ-011](specs/flow-map-demo.md#map-req-011), [MAP-AC-002](specs/flow-map-demo.md#map-ac-002) |
| Utrata źródła | `brak aktualnych danych` | Tekst przejęty z historycznego AC; kanoniczny kontrakt wymaga jawnego błędu/nieaktualności. Cisza przy poprawnych odczytach to inny przypadek. | [MAP-AC-010](specs/flow-map-demo.md#map-ac-010), [MAP-AC-011](specs/flow-map-demo.md#map-ac-011) |
| Ładowanie / pusty filtr katalogu | Np. `Ładowanie receptur…` / `Brak receptur dla tego wyszukiwania` | Ilustracyjne brzmienie. Ładowanie tam, gdzie dotyczy; pusty stan bez błędu aplikacji. | [ui-accessibility](design-system.md#ui-accessibility), [REC-AC-008](specs/recipes.md#rec-ac-008) |
| Błąd pobierania / zapisu | Np. `Nie udało się pobrać receptur. Spróbuj ponownie.` / `Nie zapisano zakończenia operacji.` | Ilustracyjne brzmienie. Umożliwić ponowienie odczytu; nie potwierdzać nieudanego zapisu. | [REC-AC-009](specs/recipes.md#rec-ac-009), [EVT-AC-016](specs/production-records.md#evt-ac-016) |
| Klawiatura, widoczny fokus, stan nieaktywny, ograniczony ruch, alternatywna lista | Np. dostępna nazwa kontrolki `Pokaż listę etapów` | Ilustracyjne brzmienie. Stany i ilości czytelne bez ruchu; nie polegać wyłącznie na kolorze. | [ui-accessibility](design-system.md#ui-accessibility), [MAP-AC-009](specs/flow-map-demo.md#map-ac-009) |
