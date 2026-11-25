# Plan produktu KoPieC OS

## Purpose

Właściciel ocenia warunki otwarcia małej piekarni przed najmem i zakupem wyposażenia. Dalsze projekty mają zwiększać marżę i powtarzalność jakości oraz ograniczać straty, braki, nadgodziny i operacyjną pracę właściciela. To jeden portfel rezultatów, nie drugi rejestr wykonania.

Wymagania biznesowe i interfejsu określa [16 specyfikacji](specs/README.md#capability-registry), wykonanie jest śledzone w sekcjach zadań w [projektach](projects/README.md), a otwarte wybory biznesowe opisuje [rejestr decyzji](decisions.md). GitHub i [archiwum 50 źródeł](migrations/spec-library/source-baseline.json) są materiałem historycznym. [Rejestr pokrycia źródeł](migrations/spec-library/coverage.md) wyjaśnia migrację wymagań, nie potwierdza implementacji. Polski jest językiem biznesu i interfejsu; angielski służy identyfikatorom i wytycznym inżynierskim.

## MVP-0

**Następny rezultat: receptury.** Uprawniony redaktor publikuje pełną recepturę v1. Piekarz znajduje ją, odczytuje proces i przelicza ilości na 10/15/20/30 sztuk w g, kg i procentach piekarskich, z jednoczesnym odczytem mas. Nowy szkic i zmiana surowca nie zmieniają v1. Brak kompozycji zakwasu pozostaje widoczny. Sekwencja 10 → 30 → 10 nie kumuluje błędów.

[REC](projects/recipes.md) obejmuje próbę architektury i ADR, migrację zachowującą zachowanie i wygląd, publikację z historycznym składem, katalog oraz skalowanie. Wspólny projekt Next.js App Router/Payload z SQLite określa [ADR-001](architecture/mvp-zero.md). Pełny model firmy, rejestrator i symulator nie należą do MVP-0. Zatwierdzona [DEC-001](decisions.md#dec-001) ustala regułę 0,001 g; nie jest zgodą na wydanie na rzeczywistych danych.

## MVP-1

**Mały, połączony scenariusz inwestycyjny**, [TASK-INV-001](projects/investment-scenarios.md#task-inv-001), prowadzi od wersji receptur i ręcznie dostarczonych pomiarów ze źródłem przez zapis i ponowne otwarcie wariantu do oceny zadanej kolejności pracy. Uwzględnia podstawową dostępność ludzi i pojemność urządzeń, pokazuje gotowość wyrobów i zdolność produkcyjną, a następnie przedstawia interpretację finansową z jawnymi ograniczeniami. Nie narzuca limitu jednego produktu. [SCN-AC-021](specs/scenarios-comparison.md#scn-ac-021) pokazuje konkretny dwuproduktowy dzień, wspólny piec i wynik 56 PLN przed zapewnieniem dochodu właściciela i pokryciem jego obciążeń.

Wariant odniesienia obejmuje właściciela-piekarza i osobnego sprzedawcę, z odrębnymi godzinami i kosztami. Cel wynosi 6 000 PLN netto miesięcznie przy jawnych założeniach podatków i składek. Dostępność 5–7 dni tygodniowo i 8–12 godzin dziennie jest konfigurowalna; nie oznacza wymaganego czasu pracy. Pomiary z dostępnej istniejącej piekarni zachowują kontekst skali, obsady, maszyny i warunków. Przeniesienie ich na inną maszynę jest estymacją, nie pomiarem docelowego urządzenia. Nie ma prognozy sprzedaży: obliczenie sprzedaży wymaganej nie dowodzi istnienia klientów.

Pierwsza demonstracja może dać użyteczny wynik częściowy. Jeśli nie zweryfikowano założeń dotyczących miesiąca, odtworzenia zapasu lub obciążeń właściciela, odpowiednie wnioski o celu netto, nadwyżce i zwrocie pozostają niezweryfikowane. Pierwszy przepływ nie wymaga wdrożenia wszystkich przyszłych funkcji finansowych, MRP ani planowanych integracji. **OBS nie jest warunkiem jego dostarczenia:** pomiary można wprowadzić ręcznie. Także mapa, POS, formalna ewidencja obecności, DEM, pełny CAPP, FER i AI nie są wymaganymi poprzednikami tej ścieżki.

## MVP-2

[INV](projects/investment-scenarios.md) rozszerza ten sam przepływ kolejno o:

1. Realistyczny miks produktów i reprezentatywny tydzień: pracę przez noc, kolejki, wspólne zasoby, surowce, produkcję w toku (WIP), gotowe wyroby, sprzedaż ograniczoną gotowością, przeniesienia zapasu i odpady.
2. Ręcznie podane okna użyteczności lub maksymalnego oczekiwania półproduktów, ze wskazaniem ich pochodzenia. Przejście do następnej operacji po oczekiwaniu w kolejce musi spełniać właściwe okno; naruszenie pozostaje widoczne w wyniku. Bez właściwego okna wykonalność technologiczna pozostaje niezweryfikowana. Model predykcyjny FER nie jest wymagany.
3. Kalendarz produkcji i sprzedaży oraz ocenę powtarzalności miesiąca. Obejmuje ona zużycie netto zapasu i WIP otwarcia, ich odtworzenie oraz przypisaną pracę i koszty poza badanym tygodniem. Bez ich rozliczenia cykliczna wykonalność, nadwyżka i zwrot pozostają niezweryfikowane. Nie wymaga się równych stanów początku i końca ani symulacji każdego dnia miesiąca.
4. Jawne nakłady na wyposażenie, lokal, kaucję i zapas. Prosty zwrot można potwierdzić wyłącznie dla dodatniej nadwyżki po zapewnieniu dochodu właściciela, po zweryfikowaniu podstaw jej wyliczenia i warunków powtarzania. Tego samego wydatku nie odlicza się dwukrotnie.
5. Co najmniej dwa ręcznie określone i ponownie przeliczone warianty. Porównanie pokazuje różnice założeń, godzin, wykonalności, finansów i brakujących danych. Badana kolejność nie jest globalnym optimum.

Odległości fizyczne, kongestia, dopasowanie lokalu, projekt budowlany, szczegółowe finansowanie i rozruch miesiąc po miesiącu oraz sezonowość nie należą do tej początkowej oceny. Rysunek asortymentu i wyposażenia jest materiałem odniesienia, nie zatwierdzeniem wydajności ani obowiązkiem wypiekania każdej kategorii codziennie.

## Independent-projects

Nie ma obowiązkowych dużych wydań MVP-3/MVP-4, które trzeba ukończyć kolejno w całości. Wszystkie zdolności pozostają zaplanowane; niezależne przyrosty wybiera się według dostępnych danych i wartości biznesowej.

| Projekt | Rezultat i granica |
|---|---|
| [OBS](projects/production-recording.md) | Ręczna rejestracja partii, etapów i obsady na mobilnej karcie, następnie korekty, ilości, straty i faktyczne zajęcia zasobów. Sam start operacji nie jest transferem ani zajęciem zasobu. |
| [PLN](projects/production-planning.md) | Szkic i niezmienna zatwierdzona wersja ilości oraz terminów, z jawnym przyjęciem propozycji. Zatwierdzenie nie tworzy wykonania, nie publikuje grafiku zmian i nie uruchamia zakupów. |
| [WRK](projects/workforce.md) | Jeden model dla 1–N osób: grafik, szacunki wsteczne, konflikty równoczesnej obsady oraz odrębny rejestr indywidualnej obecności i eksport danych. Rekomendacje i integracje są dodawane przyrostowo. |
| [OPS](projects/operational-balances.md) | Sprzedaż, zwroty, niedostępność towaru i tygodniowy bilans, śledzalny koszt SKU, FEFO oraz MRP z zatwierdzonego planu i ręczna akceptacja zakupów. |
| [MAP](projects/flow-map.md) | Deterministyczny zestaw danych testowych i sterowanie odtwarzaniem, jeden mechanizm rysowania mapy i jedna alternatywna lista oraz geometria służąca prezentacji. Później dochodzą dane rzeczywiste, ocena aktualności, agregaty i odtwarzanie historii. |
| [DEM](projects/demand.md) | Dane ocenzurowane, metoda bazowa, korekty i przekazanie propozycji. Ocena krocząca w kolejnych oknach czasowych korzysta wyłącznie z wcześniejszych danych; dodatkowo pozostaje osobny test. ML dopiero po wykazaniu przewagi nad metodą bazową. |
| [OPT](projects/optimization.md) | Harmonogram wyznaczany przez solver ograniczeń, konflikty na osi Gantta i ręczna akceptacja; wykorzystanie zasobów, porównanie planu z wykonaniem i warianty. Obliczeń harmonogramu nie wykonuje LLM. |
| [FER](projects/fermentation.md) | Kontekst i historia fermentacji, model bazowy, kalibracja, niepewność i ocena nowych partii przez piekarza. |
| [QLT](projects/quality-monitoring.md) | Jedno krytyczne urządzenie, alarmy, usterki i działania korygujące; raport powiązany z procedurą i decyzja człowieka. Opcjonalna analiza obrazu (CV) wymaga odrębnych warunków dopuszczenia. |
| [B2B](projects/b2b-orders.md) | Formularz lub e-mail i ręczna weryfikacja, następnie historia, produkcja, wydanie i dokumenty. Później dochodzą pełne integracje oceny zdolności i raport klienta. |
| [AST](projects/owner-assistant.md) | Pulpit tylko do odczytu i trzy pytania z odpowiedziami opartymi na źródłach, redakcja danych wrażliwych przed przekazaniem do AI, późniejsze zatwierdzane przekazanie propozycji i pomiar efektów. |
| [INV — rozwój](projects/investment-scenarios.md#task-inv-006) | Warianty dodatkowej osoby, zmiany, miesiarki, retardera, pieca, drugiego sklepu i B2B: CAPEX/OPEX, przepływy pieniężne z horyzontem oceny, próg rentowności i trzy zakresy założeń. Porównanie obejmuje co najmniej dwa wykonalne warianty i nie jest warunkiem oceny otwarcia. |
| [ASS](projects/engineering-assurance.md) | Dostęp, integralność i odtwarzanie danych, prywatność i prawo oraz dowody weryfikacji i egzekwowanie warunków wydania odpowiednio do ryzyka. To wymagania przekrojowe, nie końcowy moduł ani deklaracja certyfikacji. |

## Selection-guidance

Przed wyborem przyrostu porównaj koszt stworzenia, utrzymania i szkolenia z mierzalną oszczędnością czasu, unikniętymi stratami lub wzrostem wkładu kontrybucyjnego bądź marży. Wskaż dane potrzebne do pomiaru, okres i podstawę porównania oraz warunki ukończenia (DoD). Nie zbieraj danych bez zastosowania. Preferuj proste, odwracalne rozwiązanie użyteczne dla pracownika.

Brak docelowych procentów oszczędności i terminów jest celowy: wynik ma pochodzić z danych, nie z deklaracji. Jest to jeden wspólny obowiązek przy wyborze projektów, nie wymóg budowy szesnastu osobnych kalkulatorów zwrotu z inwestycji (ROI).

## Delivery-guidance

Wybierz zadanie o ograniczonym zakresie, przeczytaj jego REQ/AC, decyzje i politykę, sprawdź rzeczywisty kod oraz zależności, a następnie przygotuj plan techniczny i dowody akceptacji. Dostarcz i poddaj przeglądowi jeden przyrost. Bieżący stan wykonania zapisuje się wyłącznie w sekcji zadania. Domyślny `not-started` oznacza brak niezależnego dowodu ukończenia, a nie dowód braku jakiegokolwiek kodu. Gotowość specyfikacji nie oznacza ukończenia funkcji.

Rodzic, kontrakt wejściowy i opcjonalna integracja nie tworzą zbiorczej blokady. Tylko zależności `implementation-prerequisite` tworzą acykliczny graf wykonania (DAG); decyzje i `release-gate` ograniczają wskazaną fazę. Wczesny zestaw danych testowych nie zwalnia z kontroli P0 przed użyciem rzeczywistych kont i danych. P1 dochodzi przy rzeczywistych zdarzeniach produkcyjnych, a P2 przy odpowiednim zastosowaniu wysokiego ryzyka. Właścicielami pozostają [polityka zapewnienia jakości i bezpieczeństwa](engineering-assurance.md) oraz [system projektowania interfejsu](design-system.md). Opis nie dowodzi działania kontroli.

[Wycofanie historycznych zgłoszeń](migrations/spec-library/retirement.md) pozostaje w stanie `PENDING` do zweryfikowanego scalenia do `main` oraz sprawdzenia zmian źródeł i odnośników. Nie blokuje lokalnego opracowania dokumentów ani dostarczenia PR. Migracja wymagań nie upoważnia do zamknięcia źródłowych zgłoszeń jako wykonanych funkcji.
