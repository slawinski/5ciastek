# KoPieC OS — Workforce Planning

**Status:** plan domeny. Nie oznacza, że funkcja istnieje ani że ewidencja czasu pracy jest prawnie zgodna.

## Cel

System ma odpowiadać na pytanie: **kto, kiedy i na ile godzin musi przyjść do pracy, aby zaplanowana produkcja była gotowa na czas?**

**Jedna architektura, 1–N osób.** System musi działać dla jednej osoby, dwóch osób i większego zespołu. Praca właściciela w pojedynkę jest tylko konfiguracją grafiku z jedną osobą — nie wymaga osobnego modułu, trybu ani zestawu reguł obliczeniowych. Rozróżnienie formy współpracy ma znaczenie dla wymagań prawnych i ewidencji, ale nie dla podstawowego mechanizmu planowania.

## Wymagania skalowalności organizacyjnej

- Jeden model danych `Worker`, `ShiftPlan` i `WorkSession`; nie tworzyć odrębnych kolekcji dla właściciela pracującego samodzielnie.
- Jeden interfejs i jedno API do planowania zmian niezależnie od liczby osób. Dodanie kolejnych pracowników nie może wymagać migracji do innego trybu.
- Jeden algorytm propozycji grafiku i wyznaczania potrzebnej obsady. Liczba dostępnych osób jest parametrem wejściowym.
- Wymagania prawne zależne od formy zatrudnienia są regułami przypisanymi do osoby lub umowy, a nie odrębną architekturą planowania.
- Testy regresji: 1, 2 i 5 osób. Należy zweryfikować także równoczesne zapotrzebowanie na kilka osób, zmiany nocne oraz konflikt dostępności.

## Trzy odrębne fakty

| Typ | Znaczenie | Źródło |
|---|---|---|
| `ShiftPlan` | Plan: kto ma pracować oraz początek i koniec zmiany | Kierownik / właściciel, później rekomendacja planera |
| `WorkSession` | Wykonanie: rzeczywiste godziny pracy/obecności osoby; przerwy i korekty | Ręczne zdarzenia, później ewentualne RCP |
| `LaborSegment` | Nakład pracy nad konkretną operacją / partią; liczba osób × czas | Moduł produkcji #18 |

**Nie sumować `LaborSegment` jako formalnej ewidencji czasu pracy.** Jedna osoba może obsługiwać kilka równoległych partii i zadań. Zapisy `LaborSegment` mogą nie zawierać identyfikatorów osób, nie uwzględniają całej pracy, przerw, urlopów ani innych obowiązków. Czas właściciela i pracowników także ma inne znaczenie prawne.

## Proces planowania

1. Ustal planowaną ilość sztuk w ręcznym planie (#33); #17 wyłącznie przelicza masy. Prognoza popytu (#6) i zamówienia (#11) mogą dostarczyć propozycje wejścia, ale nie zastępują zatwierdzenia konkretnej wersji planu.
2. Zbuduj zapotrzebowanie na etapy produkcji i aktywny czas ludzi, z oznaczeniem źródła czasów: szacunek / pomiar (#14, #18).
3. Ustal datę i godzinę gotowości pieczywa. Uwzględnij etapy pasywne, chłodzenie, rezerwy, stanowiska i piec.
4. Wyznacz wstępne godziny rozpoczęcia i zakończenia pracy dla dostępnych osób. Planowanie wstecz wykorzystuje te same dane i zasady przy każdej liczbie osób. Gdy ograniczeń nie można jeszcze zweryfikować bez CAPP, oznacz wynik jako szacunek.
5. Sprawdź dostępność osób, umiejętności, przerwy, czas odpoczynku oraz zasoby. Zgłoś braki, nie ukrywaj ich.
6. Wybierz i zatwierdź konkretną wersję planu produkcji (#33). Odbiorcom rozliczeń, MRP i harmonogramu przekazuj jej identyfikator i wersję. Grafik ma osobną publikację (#27); zatwierdzenie ilości nie tworzy wykonanych partii, nie potwierdza wykonalności zasobów, nie wysyła zakupów ani nie publikuje automatycznie grafiku.
7. Rejestruj wykonanie oddzielnie. Analizuj odchylenia, ale nie nadpisuj historycznego grafiku.

## Integracje i źródło prawdy

| System | Przekazuje do Workforce Planning | Otrzymuje z Workforce Planning |
|---|---|---|
| Katalog receptur #14–#17 | Produkty, masy i wstępne etapy | Docelowe ilości do skalowania |
| Ręczny plan produkcji #33 | Pozycje, terminy gotowości, identyfikator i zatwierdzona wersja | Jawnie wybrany wariant do zatwierdzenia; szkic nie zastępuje wersji zatwierdzonej |
| Produkcja #3, #18–#19 | Czas aktywny, wynik operacji, odchylenia | Dostępnych pracowników/zmiany |
| Sprzedaż i prognoza #4, #6 | Oczekiwane ilości i godziny sprzedaży | Ostrzeżenia o niewystarczającej zdolności |
| CAPP #7 | Zapotrzebowanie na czas, umiejętności i maszyny | Zasoby ludzkie i ograniczenia czasu |
| Zakupy #9 | Dostępność surowców | Zatwierdzony plan do zapotrzebowania MRP |
| Zamówienia B2B #11 | Potwierdzone ilości i terminy | Flaga wykonalności; nie automatyczna anulacja zamówienia |
| Koszty #5 | Stawki kosztowe i reguły kalkulacji | Planowane/faktyczne godziny; rozróżnienie pracy właściciela |

**Priorytet danych:** potwierdzone zamówienia nie mogą zostać zmniejszone przez samą rekomendację. Niepotwierdzone zamówienia i prognoza mogą być przedmiotem propozycji ograniczenia, zaakceptowanej przez człowieka.

## Dostarczanie etapami

**M1: ręczny grafik (#27).** Jeden kalendarz dla 1–N osób, planowane godziny, zmiany nocne i prosty plan wsteczny od godziny gotowości produktu. Bez osobnego trybu jednoosobowego, bez HRM i bez pełnego solwera.

#27 jest zakresem nadrzędnym dla #38 (zapis/publikacja grafiku), #39 (szacunek początku) i #40 (konflikt obsady). Nie wymaga CAPP #7 ani integracji #29. Pozycje pochodzą z #33; do szacunku można użyć jawnie oznaczonego szkicu, ale nie przedstawiać go jako zatwierdzonej produkcji. Brakujące czasy pozostają estymacją, nie zerem ani gwarancją wykonalności (#27 AC-06/AC-07). Przed użyciem z pracownikami obowiązują mające zastosowanie warunki #28/#23.

**M1: rejestr pracy (#28).** Osobne dane `WorkSession` i porównanie z grafikiem. Najpierw rejestr operacyjny i eksport; formalna ewidencja pracownicza wymaga weryfikacji.

**M2/M3: integracja i rekomendacje (#29).** Zapotrzebowanie na pracę z produkcji i zamówień; ostrzeżenia, propozycje obsady i ograniczenia nowych zamówień. W miarę potrzeb optymalizator #7.

| Etap integracji | Wejście i granica zależności |
|---|---|
| A — podstawowe ostrzeżenia i propozycja obsady | Zatwierdzony plan #33 + dostępność #27 + jawne estymacje operacji. Możliwy bez adapterów #7/#9/#11; maszyny, surowce i zamówienia pozostają jawnie niezweryfikowane (#29 AC-DEP-01). Nie publikuje automatycznie grafiku. |
| B — porównania i prognoza | #28 dodaje wykonanie, #6 prognozę. Prognoza może zmienić najwyżej szkic, nie zatwierdzony plan ani grafik (#29, przyrostowe zależności). |
| C — rozszerzone ograniczenia | #7 dodaje maszyny/ograniczenia, #9 surowce, #11 zamówienia. To adaptery rozszerzające wycinek A, nie warunki rozpoczęcia podstawowego zapisu planu. Ich brak nie oznacza potwierdzenia pełnej wykonalności (#29 AC-DEP-01). |

Nie sumować obecności `WorkSession` i nakładu operacji jako dwóch kosztów tej samej pracy. Anonimowa współdzielona praca wymaga jawnego podziału przed dokładną alokacją kosztu (#5 AC-LAB-01, #43 AC-01/AC-02). Pojęcia wyjaśnia [słownik](domain/glossary.md), a obliczenia czasu, przerw i nakładu — [przykłady referencyjne](reference-examples.md). Reguły formy powiązań określają [zasady specyfikacji](specification-style.md#znaczenie-powiązań); wejście do dokumentacji znajduje się w [indeksie](index.md).

## Bezpieczeństwo i prawo

- Widoczność danych osobowych, grafiki oraz indywidualny czas pracy wymagają właściwych ról i polityki retencji (Issues #21, #23).
- Warunki publikacji grafiku, minimalne okresy odpoczynku, ewidencja i obowiązki pracodawcy zależą od stosunku prawnego i systemu czasu pracy. Nie przenoś automatycznie norm dla pracowników na właściciela.
- Dokumenty z KoPieC OS **nie mogą być oznaczane jako zgodne z wymaganiami prawa pracy bez weryfikacji**.
- Rzeczywiste zdarzenia muszą mieć źródło, autora i możliwość kontrolowanej korekty zgodnie z #22 i #24.
- Dane z kamer nie mogą automatycznie służyć do identyfikacji lub oceny pracy osób; przed takim rozwiązaniem potrzebna jest osobna analiza prawa (#23).

Źródła: [PIP — czas pracy](https://www.pip.gov.pl/dla-pracodawcow/porady-prawne/czas-pracy), [PIP — ewidencja vs lista obecności](https://www.pip.gov.pl/dla-pracodawcow/pytania-i-odpowiedzi/jaka-jest-roznica-miedzy-ewidencja-czasu-pracy-a-lista-obecnosci), [rozporządzenie w sprawie dokumentacji pracowniczej](https://eli.gov.pl/api/acts/DU/2026/474/text/O/D20260474.pdf).

**Powiązane Issues:** #26 (epik), #27 (grafik; dzieci #38–#40), #28 (czas), #29 (integracja), #33 (plan produkcji), #17 (skalowanie), #7 (CAPP).
