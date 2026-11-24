# KoPieC OS — planowanie pracy zespołu

Ten dokument jest pochodnym przewodnikiem zgodności pojęć i dawnych odnośników, nie drugą specyfikacją ani rejestrem realizacji. Zacznij od [portfela](product-plan.md), wybierz ograniczone zadanie w [projekcie WRK](projects/workforce.md), a następnie przeczytaj wskazane wymagania i kryteria w [kanonicznej specyfikacji WRK](specs/workforce.md). Zapis dokumentacji nie dowodzi działania funkcji ani zgodności ewidencji z prawem.

## Cel

Pytanie biznesowe pozostaje to samo: **kto, kiedy i na ile godzin ma przyjść, aby produkcja była gotowa na czas?** [WRK-REQ-002](specs/workforce.md#wrk-req-002) określa jedną architekturę, model Worker/ShiftPlan/WorkSession, interfejs, API i reguły dla 1–N osób. Właściciel pracujący sam jest konfiguracją obsady, nie oddzielnym trybem. [WRK-AC-002](specs/workforce.md#wrk-ac-002) zachowuje sprawdzenie 1, 2 i 5 osób; noce i równoczesność sprawdzają [WRK-AC-004](specs/workforce.md#wrk-ac-004) oraz [WRK-AC-009](specs/workforce.md#wrk-ac-009).

## Trzy odrębne fakty

| Fakt | Znaczenie i właściciel |
|---|---|
| `ShiftPlan` | Planowana dostępność i przerwy osoby, z osobną publikacją, wersją i historią: [WRK-REQ-004](specs/workforce.md#wrk-req-004), [WRK-REQ-005](specs/workforce.md#wrk-req-005). Nie dowodzi obecności. |
| `WorkSession` | Rzeczywista obecność, przerwy i kontrolowane korekty: [WRK-REQ-012](specs/workforce.md#wrk-req-012), [WRK-REQ-013](specs/workforce.md#wrk-req-013). Nie jest automatycznie czasem płatnym ani formalną ewidencją. |
| `LaborSegment` | Nakład konkretnej operacji: czas × liczba osób, zapisany przez [EVT-REQ-005](specs/production-records.md#evt-req-005). Może być anonimowy; nie dowodzi tożsamości ani unikalnej liczby osób. |

[WRK-REQ-001](specs/workforce.md#wrk-req-001) zabrania utożsamiania tych faktów. Równoległa praca nad partiami nie tworzy automatycznie indywidualnej ewidencji; anonimowe odcinki nie obejmują całej pracy, przerw, urlopów ani innych obowiązków. [ECO-REQ-001](specs/economics-investment.md#eco-req-001) jest jedynym właścicielem alokacji: obecności i operacji nie dodaje się jako dwóch kosztów tej samej pracy. Dokładny podział współdzielonych 30 minut wymaga jawnej alokacji; przykład 50/50 daje 15 + 15, nie 30 + 30 osobominut ([ECO-AC-001](specs/economics-investment.md#eco-ac-001)).

## Plan produkcji i przepływ propozycji

Zapisany plan i jego zatwierdzona wersja należą do [PLN-REQ-001](specs/production-plans.md#pln-req-001), nie do REC. [REC-REQ-002](specs/recipes.md#rec-req-002) przelicza masy; [REC-REQ-012](specs/recipes.md#rec-req-012) nie zapisuje ani nie zatwierdza planu. Pozycje i jednoznaczne terminy zachowuje [PLN-REQ-002](specs/production-plans.md#pln-req-002). Zatwierdzenie następcy, a nie samo utworzenie szkicu, zastępuje poprzednią wersję ([PLN-AC-002](specs/production-plans.md#pln-ac-002)).

| Potrzeba | Kanoniczny kontrakt i granica |
|---|---|
| Ustalenie etapów, gotowości i godzin rozpoczęcia | [WRK-REQ-009](specs/workforce.md#wrk-req-009), [WRK-REQ-010](specs/workforce.md#wrk-req-010) odsyłają do wspólnego [PRC](specs/process-execution.md): czasy aktywne/pasywne, chłodzenie, pakowanie, bufory, stanowiska, piec, dostępność i zadane okna. Pomiar, estymacja i brak zachowują źródło. Brak czasu nie jest zerem; heurystyka nie gwarantuje wykonalności. |
| Ręczny grafik i konflikty | [WRK-REQ-004](specs/workforce.md#wrk-req-004) działa bez planu produkcji; [WRK-REQ-011](specs/workforce.md#wrk-req-011) sprawdza przedziały, równoczesną obsadę, umiejętności, przerwy i mający zastosowanie odpoczynek. Suma godzin nie zastępuje równoczesności. |
| Etap A rekomendacji | [WRK-REQ-016](specs/workforce.md#wrk-req-016), [WRK-AC-013](specs/workforce.md#wrk-ac-013): zatwierdzony plan PLN, dostępność i jawne estymacje wystarczają do podstawowych ostrzeżeń/propozycji. Bez adapterów maszyn, surowców i B2B te zakresy pozostają niezweryfikowane. Nie ma automatycznej publikacji grafiku. |
| Etapy B/C | [WRK-REQ-024](specs/workforce.md#wrk-req-024), [WRK-AC-020](specs/workforce.md#wrk-ac-020): wykonanie i prognoza rozszerzają B; maszyny/harmonogram OPT, materiały/MRP STK i B2B rozszerzają C. To przyrosty, nie warunki podstawowego zapisu grafiku ani całe obowiązkowe wydania MVP. |
| Akceptacja i przekazanie | [WRK-REQ-017](specs/workforce.md#wrk-req-017), [WRK-REQ-018](specs/workforce.md#wrk-req-018): prognoza może zasilić szkic po wyborze człowieka, nie zmienić zatwierdzonego planu/grafiku. Rekomendacja nie zmniejsza ani nie anuluje potwierdzonego B2B. Odbiorcy kosztów, MRP i harmonogramu dostają identyfikator/wersję zatwierdzonego PLN oraz źródło godzin; nie powstaje wysłany zakup ani opublikowany grafik. |
| Obserwacje i koszty | [WRK-REQ-019](specs/workforce.md#wrk-req-019) porównuje plan i wykonanie oraz pozwala jawnie poprawić estymacje bez nadpisywania historii. Stawki, koszt pracodawcy i ekonomiczna wartość pracy właściciela należą do [ECO](specs/economics-investment.md#eco-req-005); pomiary operacji do [EVT-REQ-010](specs/production-records.md#evt-req-010). |

Dokładne zależności, fazy i dowody dostarczenia określają wyłącznie [zadania WRK](projects/workforce.md). Ręczny scenariusz inwestycyjny ze źródłowymi pomiarami nie wymaga pełnego rejestratora, rekomendacji ani formalnej ewidencji. [Słownik](domain/glossary.md), [przykłady czasu i nakładu](reference-examples.md) oraz [znaczenie powiązań](specification-style.md#znaczenie-powiązań) pomagają czytać kontrakt, nie zmieniają go.

## Bezpieczeństwo i prawo

[WRK-REQ-007](specs/workforce.md#wrk-req-007) i [WRK-REQ-008](specs/workforce.md#wrk-req-008) rozdzielają jednoznaczne chwile, czas rzeczywisty, obecność i płatność przerw. Przykładowa 30-minutowa przerwa nie ustanawia normy prawnej. [WRK-REQ-014](specs/workforce.md#wrk-req-014) oraz polityki [dostępu](engineering-assurance.md#ass-access) i [prywatności](engineering-assurance.md#ass-privacy) określają role, minimalizację i retencję. Rzeczywiste fakty i korekty zachowują źródło, autora i historię w granicach retencji; błędy, ponowienia i współbieżność podlegają [WRK-REQ-021](specs/workforce.md#wrk-req-021) i [integralności](engineering-assurance.md#ass-integrity).

[WRK-REQ-020](specs/workforce.md#wrk-req-020) i [polityka prawna](engineering-assurance.md#ass-legal) wymagają oceny formy współpracy, systemu czasu pracy i wyjątków przed użyciem z pracownikami: publikacji/przekazania grafiku, odpoczynku, przerw, norm i pracy nocnej. Nie stosuje się automatycznie norm pracowniczych do właściciela. Domyślnie powstają dane operacyjne i eksport do zewnętrznych kadr. Formalna ewidencja wymaga dodatkowej weryfikacji zakresu danych, nadgodzin, dni wolnych, absencji i przechowywania; bez niej nie wolno oznaczać dokumentów jako zgodnych z Kodeksem pracy ([WRK-REQ-015](specs/workforce.md#wrk-req-015), [WRK-AC-012](specs/workforce.md#wrk-ac-012)). Kamery nie uprawniają do identyfikacji lub oceny osób bez osobnej uprzedniej oceny prawa i prywatności.

Źródła do tej oceny zachowuje [WRK — źródła prawne](specs/workforce.md#specification-readiness): PIP i przepisy dokumentacji pracowniczej. Sam odnośnik ani poprawny start/stop nie dowodzą zgodności. Ten przewodnik zastępuje dawny opis oparty na #26–#29/#33/#38–#40; ich pochodzenie zachowuje [rejestr migracji](migrations/spec-library/coverage.md), nie drugi aktywny harmonogram realizacji.
