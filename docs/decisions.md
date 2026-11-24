# Decyzje kontraktowe

Właściciel repozytorium musi wyznaczyć decydenta domenowego dla każdej nadal otwartej decyzji. DEC-001 została zatwierdzona przez użytkownika; pozostałe pytania pozostają otwarte. Specyfikacje określają wymagane zachowanie, a sekcje zadań w projektach są jedynym miejscem śledzenia wykonania. Status w tym rejestrze dotyczy **decyzji**, nie zadań.

Przykład liczbowy ani przygotowany zestaw danych testowych nie rozstrzygają polityki biznesowej. Otwarta decyzja blokuje tylko wskazaną, zależną od niej część implementacji. Nie blokuje dokumentacji, niepowiązanych funkcji ani demonstracji obliczeń na dokładnych liczbach.

## DEC-001

**ACCEPTED — 2026-11-24, user-approved.** Użytkownik zatwierdził regułę po przedstawieniu alternatywy całych gramów i jej kosztu: utraty składników poniżej 1 g. Masy receptury i składników zapisuje się w gramach z precyzją 0,001 g. Dokładniejsze wejście jest odrzucane, bez cichej konwersji. Skalowanie i wkład zakwasu liczy się bez zaokrągleń pośrednich, zawsze z opublikowanej bazy. Na granicach stałej precyzji wynik zaokrągla się do najbliższej 0,001 g; dokładne połowy w górę. Pomocniczą podaną masę porcji porównuje się z sumą mas / N po tym samym zaokrągleniu, bez dodatkowej tolerancji. Zaokrąglenie prezentacji nie zmienia zapisu. Historyczna publikacja zachowuje oryginalne masy i kompozycję.

**Przykłady wiążące:** publikacja 500 + 350 + 10 = 860 g; 4000 / 5 = 800 g, więc 750 g jest sprzeczne. Wejście 1,2345 g jest odrzucane, 1,235 g zachowane; obliczone 1,2345 g na granicy daje 1,235 g, a 0,0005 g daje 0,001 g. Dla N=3 i 1 g porcja wynosi po zaokrągleniu 0,333 g: 0,333 g jest zgodne, 0,334 g nie. Skalowanie 10→30→10 z tej samej bazy odtwarza identyczne wyniki. 1 kg zakwasu 100% wnosi dokładnie 500 g mąki i 500 g wody, raz; 1 g zakwasu z proporcją mąka:woda 1:2 wnosi bez pośredniego zaokrąglenia 1/3 g mąki i 2/3 g wody. Odczyt v1 po edycji surowca zachowuje jej wcześniejsze wartości. 3120 g = 3,12 kg; zmiana jednostki nie zmienia masy źródłowej.

**Właściciel i dotknięte wymagania:** [REC-REQ-001](specs/recipes.md#rec-req-001)–REC-REQ-003 oraz REC-REQ-008–011; REC-AC-001–005, REC-AC-010–014. Decyzja dotyczy także zależnych mas utrwalanych lub używanych przez EVT-REQ-002–003/011–012, STK-REQ-001/004/007–009, PLN-REQ-002–003, SCN-REQ-002/007/012 i ECO-REQ-003/007, ale tylko tam, gdzie dana funkcja rzeczywiście korzysta z takiej masy. Samo formatowanie ani obserwacja ograniczona do liczby sztuk lub osób nie tworzą tej zależności.

**Najwcześniejsza bramka:** [TASK-REC-003](projects/recipes.md#task-rec-003) przed wyborem trwałej reprezentacji mas i walidacji zgodności przy publikacji; [TASK-REC-005](projects/recipes.md#task-rec-005) przed zależnymi obliczeniami dla danych ogólnych lub utrwalanych. Kolejne zadania — [TASK-OBS-001](projects/production-recording.md#task-obs-001), [TASK-OBS-002](projects/production-recording.md#task-obs-002), [TASK-OBS-003](projects/production-recording.md#task-obs-003), [TASK-OBS-005](projects/production-recording.md#task-obs-005), [TASK-OPS-003](projects/operational-balances.md#task-ops-003), [TASK-PLN-001](projects/production-planning.md#task-pln-001), [TASK-INV-001](projects/investment-scenarios.md#task-inv-001) i ich rozszerzenia — są objęte bramką wyłącznie na wskazanej granicy zależnego zapisu lub obliczenia. Odczyt istniejącej publikacji i demonstracja dokładnej arytmetyki nie rozstrzygają tej decyzji za zespół realizujący zadanie.

**Już wiążące ograniczenia:** masy są podawane w g; wymagane są kompletne dodatnie masy i dodatni całkowity uzysk `N`. Masa porcji wynika z sumy mas podzielonej przez `N`, a sprzeczne źródła wartości nie mogą przejść publikacji. Skalowanie korzysta z bazy, sumuje masy przed zaokrągleniem prezentacji i zachowuje wynik przy zmianie 10 → 30 → 10. Sposób prezentacji nie zmienia wartości źródłowych. Wkład mąki, wody i rodzajów mąki z zakwasu jest uwzględniany raz; brak kompozycji wyklucza pozornie dokładne procenty. Zmiana surowca nie zmienia historycznych wartości opublikowanej receptury.

Czytelne formatowanie g/kg i organizacja kalkulatora są wyborami inżynierskimi w granicach przyjętej reguły.

**Warunek rozstrzygnięcia:** zatwierdzona reguła precyzji na poszczególnych granicach i porównywania zgodności, z przykładami publikacji, wielokrotnego skalowania, kompozycji zakwasu, odczytu historii i konwersji. Dotknięte wymagania i kryteria akceptacji trzeba zaktualizować przed implementacją zależnego zapisu trwałego.

**Identyfikatory historyczne:** #14 REQ-02/03/09, AC-08/AC-YIELD-01; #17 REQ-02–05/09–12, AC-01–05/09–11; #14/#17 AC-HIST-01. Zachowuje je [rejestr pokrycia źródeł](migrations/spec-library/coverage.md); GitHub nie jest bieżącym źródłem wymagań.

## DEC-002

**OPEN — tożsamość i podział strumieni, zakres `sequence` oraz spójne odtwarzanie.** Należy ustalić, co wyznacza strumień i zakres jego `sequence`, jak porządkować zdarzenia oraz obsługiwać zależności między strumieniami przy wspólnych zasobach, transferach i korektach. Odbiorca musi móc rozpoznać spójny punkt odtworzenia. Nie wybrano strumienia globalnego ani strumieni wydzielanych według partii. Decydenta dla wspólnego kontraktu EVT i jego odbiorców wyznacza właściciel repozytorium.

**Właściciel i dotknięte wymagania:** [EVT-REQ-001](specs/production-records.md#evt-req-001)–EVT-REQ-002, EVT-REQ-004/008–009/011/013; EVT-AC-001–003/006/008/010–015/019; MAP-REQ-003/012–013/018 / MAP-AC-003/011–012/016. STK-REQ-004 oraz zależne integracje OPT/FER/QLT/OPS/AST są objęte decyzją tylko wtedy, gdy korzystają z tej kolejności zdarzeń trwałych. Nie dotyczy ona automatycznie wszystkich widoków ani modelu `WorkSession` wyłącznie z powodu jego nazwy.

**Najwcześniejsza bramka:** [TASK-OBS-001](projects/production-recording.md#task-obs-001) przed implementacją trwałej koperty, porządku i współbieżności zdarzeń; [TASK-OBS-002](projects/production-recording.md#task-obs-002) przy korektach i odtwarzaniu; [TASK-OBS-003](projects/production-recording.md#task-obs-003) przy ruchach ilościowych; [TASK-OBS-004](projects/production-recording.md#task-obs-004) przy faktach dotyczących wspólnych zasobów; [TASK-MAP-002](projects/flow-map.md#task-map-002) przy danych bieżących i wznowieniu połączenia; [TASK-MAP-003](projects/flow-map.md#task-map-003) przy odtwarzaniu historii; [TASK-ASS-004](projects/engineering-assurance.md#task-ass-004) przy dowodach zachowania zależnego zapisu trwałego podczas awarii. Pozostałe zadania są objęte bramką tylko przy faktycznie zależnej integracji. Izolowany, wersjonowany zestaw danych testowych w [TASK-MAP-001](projects/flow-map.md#task-map-001) oraz ręcznie dostarczone pomiary INV nie są blokowane, lecz nie zamykają decyzji.

**Już wiążące ograniczenia:** wersjonowana koperta zachowuje tożsamość zdarzenia oraz pola `occurredAt`, `recordedAt`, `source`, `actor` i jednoznaczne `sequence` w obrębie strumienia. Przejścia są atomowe, ponowienia nie dublują skutków, a partie zachowują odrębność. Równoważne dane ręczne i symulowane po wskazanej normalizacji dają tę samą projekcję; dane syntetyczne pozostają odizolowane. Korekta waliduje wszystkie zależności i atomowo przelicza wynik albo jest odrzucana, bez cichego przesuwania innych faktów. Po wznowieniu połączenia odbiorca odtwarza spójny obraz stanu bez powielania transferów. Potwierdzenie aktualności źródła nie jest tym samym co wiek ostatniego zdarzenia.

Wybory inżynierskie obejmują transport, przekazywanie obrazu stanu, okresowe odświeżanie, opcjonalne SSE, kolejki i organizację kodu projekcji. Interwał odświeżania i próg nieaktualności muszą być jawne. Te wybory nie mogą samodzielnie ustanawiać podziału strumieni ani nowej polityki rozstrzygania konfliktów.

**Warunek rozstrzygnięcia:** przyjęta semantyka strumieni, współbieżności między strumieniami i odtwarzania, z rozpisanymi przypadkami dwóch urządzeń, ruchów ilościowych, wspólnych zasobów, korekt i wznowienia połączenia. Dotknięte wymagania i kryteria akceptacji trzeba zaktualizować przed zależną implementacją.

**Identyfikatory historyczne:** #18 REQ-04/12/14, AC-02/08/AC-CONTRACT-01/02 i nienumerowana koperta; #30 REQ-01, AC-01/02/AC-CONTRACT-01; #34/#37/#42 REQ-01–03/AC-01–03. Prezentacja bieżących ilości i zajętości nadal wymaga działających producentów tych faktów; samo rozstrzygnięcie decyzji nie wystarcza.

## DEC-003

**OPEN — zaawansowana kompozycja wspólnego ciasta.** Źródło #3 nie rozstrzyga sposobu uzyskania pełnego składu produktów ze wspólnej bazy i dodatków, znaczenia zaawansowanej hydracji ani podziału uzysku. Właścicielem jest [REC-REQ-013](specs/recipes.md#rec-req-013) / REC-AC-015; decydent pozostaje do wyznaczenia.

[TASK-REC-006](projects/recipes.md#task-rec-006) służy wyjaśnieniu tych reguł i może się rozpocząć bez rozstrzygnięcia. Produktowe rozszerzenie w [TASK-REC-008](projects/recipes.md#task-rec-008) wymaga przyjętej reguły i nowych, dokładnych kryteriów akceptacji przed zależną implementacją. Decyzja nie blokuje samodzielnych wariantów MVP-0 ani zapisu obserwowanego uzysku EVT-REQ-012.

Już obowiązują pełny historyczny odczyt, brak podwójnego liczenia masy i zakaz domyślania się brakującej kompozycji. Rozstrzygnięcie wymaga zaakceptowanego, rozpisanego przykładu dwóch produktów, obejmującego cykl życia, zatwierdzanie, jednostki i obsługę brakujących danych. Nie wolno wybierać dziedziczenia tylko po to, by zadeklarować gotowość implementacji.

## DEC-004

**OPEN — rozpoznanie tego samego zobowiązania między kanałami B2B.** [B2B-REQ-006](specs/b2b-orders.md#b2b-req-006) / B2B-AC-005/008 określają ponowienia oraz ochronę niezależnych zamówień o identycznej treści. Źródło nie rozstrzyga jednak, jak uzgodnić tożsamość zamówienia przekazanego formularzem i e-mailem bez wspólnego identyfikatora. Decydent pozostaje do wyznaczenia.

Decyzja blokuje implementację trwałego przyjmowania zamówień z rozpoznawaniem duplikatów między kanałami w [TASK-B2B-002](projects/b2b-orders.md#task-b2b-002), nie samo ręczne utworzenie szkicu w [TASK-B2B-001](projects/b2b-orders.md#task-b2b-001). Sposób zapewnienia idempotencji po stronie dostawcy lub API przy znanej tożsamości jest wyborem inżynierskim, a nie przedmiotem nowej decyzji biznesowej.

Rozstrzygnięcie musi obejmować tę samą wiadomość i jej ponowienie, formularz oraz e-mail dotyczące jednego zamówienia, dwa niezależne zamówienia po 30 sztuk i zmienioną wersję. Przy nierozpoznanej tożsamości potrzebne jest rozstrzygnięcie człowieka. Nie przyjęto reguły automatycznego wykrywania duplikatów na podstawie podobieństwa treści.

## DEC-005

**OPEN — częściowe wydania i zmiany po produkcji lub wydaniu.** [B2B-REQ-003](specs/b2b-orders.md#b2b-req-003)/006/008, B2B-AC-005/006 nie określają warunków zmiany i anulacji po produkcji lub wydaniu ani sposobu zamknięcia pozostałych 2 sztuk z zamówionych 30 po wydaniu 28. Decydent pozostaje do wyznaczenia.

W [TASK-B2B-002](projects/b2b-orders.md#task-b2b-002) decyzja blokuje wyłącznie te przejścia i zamknięcie pozostałej ilości, nie podstawowe potwierdzenie zamówienia. Już obowiązują historia z autorem i powodem, ponowna weryfikacja zmian, zachowanie zamówionych 30 sztuk obok faktycznie wydanych 28 oraz zakaz automatycznego zmniejszania potwierdzonych ilości. Anulacja nie cofa fizycznego wydania.

Rozstrzygnięcie wymaga wskazania dozwolonych i niedozwolonych przejść, ról, zasad zatwierdzania i zachowania historii oraz konkretnych przypadków wydania częściowego i zmiany po wydaniu. Nie przyjęto domyślnej polityki anulacji.

## Request-classification

Każdy z poniższych 18 wniosków został oceniony osobno. Nazwy są **historycznymi identyfikatorami propozycji**, a nie celami bieżących zależności. Sam wniosek nie oznacza konieczności utworzenia globalnej decyzji blokującej produkt.

Wybór pozostawiony planowaniu wymaga jawnego rozstrzygnięcia i dowodu w planie danego zadania. Warunek dotyczący danych wejściowych lub dopuszczenia do użycia wymaga rzeczywistych źródeł i odpowiedniej zgody przed konkretnym zastosowaniem. Klasyfikacja nie usuwa zatwierdzonego wyniku biznesowego ani nie zastępuje brakującej wartości przyjętym założeniem.

| Historyczny identyfikator propozycji | Klasyfikacja i uzasadnienie | Zadanie i moment wymagający rozstrzygnięcia lub weryfikacji |
|---|---|---|
| DEM-DATA | Planowanie określa sposób kwalifikacji źródeł. Oznaczenie okresów ocenzurowanych, cech i nieznanej utraconej sprzedaży jest już wymagane przez DEM-REQ-001; nie brakuje nowej polityki biznesowej. | TASK-DEM-001 przed dopuszczeniem użycia na rzeczywistych danych. |
| DEM-BASE | Planowanie wybiera i dokumentuje metodę doboru porównywalnych dni, średnią lub medianę, ocenę wystarczalności historii i sposób wyznaczania przedziału niepewności. Źródło dopuszcza alternatywy; przykład nie narzuca jednej metody. | TASK-DEM-002 przed obliczeniem i demonstracją; metoda musi być odtwarzalna i przejrzana przez odbiorcę. |
| DEM-EVAL | Planowanie ustala regułę oceny, podziały danych i sposób ich traktowania; wagi kosztów i historia są wejściami. Już obowiązują zakaz użycia przyszłych informacji, odrębny zbiór testowy i pozostawienie metody bazowej, jeśli kandydat nie wykazał przewagi. | TASK-DEM-004 przed oceną, wyborem modelu i dopuszczeniem do użycia; brak kosztów ogranicza ocenę ekonomiczną. |
| OPT-SOLVE | Planowanie określa jawną funkcję celu, priorytety, wagi, algorytm i limit czasu obliczeń. Znaczenie obserwowalnych wyników, w tym braku rozstrzygnięcia, określa już OPT-REQ-005; nie jest to brakująca polityka. | TASK-OPT-001/002/004 przed demonstracją optymalizacji z określonym zakresem weryfikacji; nie wolno wymyślać norm nadgodzin. |
| OPT-ACTUAL | Planowanie ustala przypisanie danych, a wejścia wymagają kwalifikacji. Tożsamość wersji i jawny mianownik wskaźników określają już OPT-REQ-007/008. | TASK-OPT-003 przed porównaniem rzeczywistego wykonania; DEC-002 pozostaje odrębną bramką strumienia. |
| FER-JUDGMENT | Jest to warunek oceny danych i dopuszczenia do użycia: piekarz lub procedura dostarczają definicję gotowości i skalę wad. Nie przyjmuje się jednego globalnego progu. | TASK-FER-001/002 przed oceną rzeczywistego wyniku i walidacją. |
| FER-MODEL | Planowanie wybiera model bazowy, wymagany kontekst i sposób wyznaczania niepewności. Profile kalibracji i alarmowania oraz kryteria trafności są wejściami wymagającymi weryfikacji. Ostrzeganie o ograniczeniach i zakaz automatycznej decyzji o bezpieczeństwie już obowiązują. | TASK-FER-002 przed prognozą, demonstracją i dopuszczeniem do użycia na podstawie wyników empirycznych. |
| QLT-PROCEDURE | Jest to warunek dotyczący danych wejściowych i dopuszczenia do użycia. Wybrane urządzenie, procedura zakładu, zakresy, odbiorca alarmu, ważność kalibracji, ręczne zamknięcie działania i uprawnienia wymagają zatwierdzenia dla wdrożenia. Polityka już zabrania pozornego zatwierdzenia. | TASK-QLT-001/002 i TASK-ASS-008 przed demonstracją sprzętu i rzeczywistym wdrożeniem. |
| QLT-VISION | Opcjonalne wdrożenie wymaga wykazania wartości oraz odrębnej oceny prawa i prywatności. Nie jest to brak w definicji podstawowego zachowania produktu. | TASK-QLT-003/TASK-ASS-008 przed opcjonalnym wdrożeniem. |
| B2B-IDENTITY | Rzeczywisty, nierozstrzygnięty wybór biznesowy dotyczy rozpoznania tej samej tożsamości między kanałami, poza ponowieniem zamówienia o znanym identyfikatorze. | DEC-004; TASK-B2B-002 przed rozpoczęciem zależnej implementacji. |
| B2B-LIFECYCLE | Rzeczywisty, nierozstrzygnięty wybór dotyczy częściowego zamknięcia oraz zmian i anulacji po produkcji lub wydaniu. Zwykła historia i ponowna weryfikacja są już określone. | DEC-005; TASK-B2B-002 przed implementacją dotkniętych przejść. |
| B2B-COMMERCIAL | Cena, minimalna ilość zamówienia (MOQ), termin i dane kontrahenta pochodzą z umowy. Planowanie określa wymagane pola i format eksportu dla odbiorcy. Walidacja i historia są już określone; nie przyjmuje się nowej polityki podatkowej ani warunków za klienta. | TASK-B2B-001/002 przed walidacją i przygotowaniem dokumentów dla wybranej umowy. |
| B2B-METRICS | Planowanie określa początek i koniec pomiaru czasu obsługi oraz rejestr pomyłek. Podstawę marży i terminowości określają już B2B-REQ-009 oraz ECO. | TASK-B2B-003 przed przedstawieniem wskaźników jako zmierzonych. |
| AST-QUESTIONS | Planowanie obejmuje wybór przez właściciela trzech dokładnych pytań, miar, okresów i oczekiwanych odpowiedzi. Obsługa niejednoznaczności i cytowanie źródeł są już określone; nie brakuje globalnej polityki. | TASK-AST-002/005 przed demonstracją spełnienia kryteriów akceptacji. |
| AST-ACCESS | Wybór dostawcy należy do planowania i decyzji inżynierskich. Rzeczywiste uprawnienia, reguły redakcji danych, warunki przetwarzania przez dostawcę, retencja i ocena prawna podlegają istniejącej polityce; nie tworzą automatycznie nowej DEC. | TASK-AST-001/002, TASK-ASS-005/008 przed dostępem do danych i rzeczywistym przekazaniem ich na zewnątrz. |
| AST-ACTIONS | Planowanie określa zweryfikowany i autoryzowany sposób przekazania propozycji do właściciela danego obszaru. Zakaz samodzielnej zmiany danych przez asystenta już obowiązuje. | TASK-AST-003 przed włączeniem wybranego działania. |
| AST-VALUE | Planowanie określa porównywalne czynności, metodę oceny i podstawę kosztów. Wykazanie efektu wymaga rzeczywistych pomiarów. Nie przyjęto progu oszczędności. | TASK-AST-004 przed deklaracją efektu empirycznego. |
| GROWTH | Planowanie wybiera metodę, a horyzont, terminy przepływów, niepewność i wykonalność wymagają źródłowych wejść. Pełne wymagane wyniki określają już ECO-REQ-016/AC-012 i SCN-REQ-022/AC-020; nie ograniczają się one do izolacji SCN. | TASK-INV-006, TASK-AST-005 przed pełnym porównaniem rozwoju, nie przed oceną otwarcia. |

Brakujące ceny, najem, podatki, okna, pomiary i horyzont nie stają się zerem ani nową globalną DEC. Autoryzacja, zatwierdzenie bezpieczeństwa przez człowieka, zachowanie pochodzenia danych, zakaz użycia przyszłych informacji i jawna obsługa błędów źródeł pozostają wiążące niezależnie od wyborów inżynierskich. Metoda bazowa pozostaje w użyciu, jeśli kandydat nie wykazał przewagi.
