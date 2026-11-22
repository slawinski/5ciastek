# Process execution

## Purpose and boundary

Wspólny kontrakt przebiegu procesu pozwala piekarzowi, planiście i właścicielowi ocenić podaną kolejność pracy bez tworzenia odrębnych reguł w symulatorze, optymalizatorze i rejestrze wykonania. Dotyczy procesów rzeczywistych i hipotetycznych; nie utożsamia ich źródeł prawdy. Nie nakazuje nowego silnika, algorytmu optymalizacji ani transportu zdarzeń.

Poza zakresem: przewidywanie fermentacji jako warunek uruchomienia, geometria lokalu, odległości, trasy, zatłoczenie, automatyczne sterowanie maszynami oraz uznawanie animacji za wykonanie. Bilans i przydatność zapasu należą do [STK-REQ-001](stock-inventory.md#stk-req-001), koszty do [ECO-REQ-001](economics-investment.md#eco-req-001), koperta i korekty faktów do [EVT-REQ-001](production-records.md#evt-req-001) i [EVT-REQ-002](production-records.md#evt-req-002).

## Inputs and outputs

Wejście obejmuje stabilne identyfikatory etapów, operacji, partii i zasobów; zależności i dozwolone odgałęzienia; jednoznaczne chwile; nieujemne czasy w minutach; obsadę jako nieujemną całkowitą liczbę osób i wymagane role/umiejętności; przedziały dostępności; pojemności jako ilości z jednostką (np. szt., kg, miejsca). Czas aktywny, pasywny i pomocniczy mają oddzielne wartości oraz źródło: pomiar z kontekstem, estymacja albo brak. Kontekst pomiaru obejmuje wersję receptury, wielkość partii, wyposażenie, obsadę i warunki obserwacji; przeniesienie na inną skalę nie staje się pomiarem.

Ręczne okno półproduktu zawiera jego zakres zastosowania, punkt odniesienia (np. gotowość), dopuszczalny okres użycia/maksymalnego oczekiwania, jednostkę i pochodzenie. Brak okna nie jest nieskończonością. Wynik podaje przyjętą kolejność, chwile, kolejki, obciążenia, konflikty oraz osobno zakresy sprawdzone i niezweryfikowane: ludzie, maszyny, technologia i materiały. Nieznane ograniczenie nie jest dowodem naruszenia znanego ograniczenia.

## Lifecycle and authority

Planowany przebieg przechodzi od wejścia przez ocenę do wyniku; oczekiwanie na poprzednik, człowieka lub urządzenie jest widoczne. Etap technologiczny może trwać przez noc, kilka zmian i granicę tygodnia. Operacja aktywna może wystąpić wewnątrz etapu pasywnego bez jego zakończenia. Początkowe WIP jest stanem wejściowym z pochodzeniem, nie nową pracą rozpoczętą w analizowanym tygodniu.

Walidacja polecenia start/stop, przejścia lub korekty nie jest usuwaniem obserwacji. Nieprawidłowe polecenie jest odrzucane przez właściciela zapisu; już potwierdzony fakt rzeczywisty pozostaje obserwacją, także gdy ujawnia odstępstwo od planu lub limitu. Zmiana historii wymaga jawnej korekty EVT. Ocena hipotetyczna nie może wymazać rzeczywistego zdarzenia, przesunąć jego czasu ani stworzyć zajęcia urządzenia z samej rezerwacji planowanej.

## Requirements

### PRC-REQ-001

Gdy odbiorca ocenia przejście procesu, system musi zachować podane zależności, kolejność i czasy aktywne/pasywne/pomocnicze, wskazując niedozwolony start przed wymaganym poprzednikiem zamiast uznania go za legalną kolejność. Czas pasywny nie oznacza ciągłego zajęcia człowieka; jawne czynności obsługi wewnątrz niego pozostają pracą.

### PRC-REQ-002

Gdy w podanym przedziale operacje konkurują o ludzi lub zasoby, system musi porównać równoczesne wymagania z dostępnością ról/umiejętności i znanymi pojemnościami we wspólnej jednostce. Musi ujawnić konflikt albo przyjęte oczekiwanie i jego wpływ na termin; suma godzin później nie zastępuje jednoczesnej obsady. Nieznana pojemność lub kwalifikacja pozostawia dany zakres niezweryfikowany.

### PRC-REQ-003

Gdy przejście po kolejce dotyczy półproduktu z mającym zastosowanie ręcznie dostarczonym oknem użycia lub maksymalnego oczekiwania, system musi sprawdzić czas przejścia względem tego okna i pokazać naruszenie wraz z limitem i źródłem. Przy braku właściwego okna musi oznaczyć wykonalność technologiczną jako niezweryfikowaną, niezależnie od wyniku sprawdzenia maszyny. Nie wymaga prognozy fermentacji.

### PRC-REQ-004

Gdy system przedstawia czas procesu i nakład pracy, musi podać oddzielnie czas trwania oraz sumę czasu odcinków pomnożonego przez obsadę, w osobominutach lub osobogodzinach. Pomocnicze przygotowanie, rozgrzewanie, czyszczenie, przezbrojenie, pakowanie, przekazanie materiału i rezerwy wskazane na wejściu nie mogą znikać z przebiegu; zajmują człowieka lub urządzenie tylko według zadeklarowanej obsługi.

### PRC-REQ-005

Gdy brak czasu, jednostki, konwersji, źródła lub kontekstu potrzebnego do danej oceny, system musi wskazać konkretny brak i ograniczyć wniosek. Nie może zastąpić braku zerem, domyślną pojemnością ani fikcyjną przepustowością. Ujemny czas, ujemna lub niecałkowita obsada i sprzeczne przedziały muszą dać błąd wejścia, nie pozornie poprawny wynik.

### PRC-REQ-006

Gdy ocena potwierdzonych faktów wykryje odstępstwo od ograniczenia, system musi zachować fakt i przedstawić odstępstwo. Odrębna walidacja nowego polecenia musi odrzucić zakończenie bez rozpoczęcia lub ujemny czas bez częściowego przejścia; nie może po cichu przesuwać innych faktów. Akceptacja i korekta zapisu pozostają w EVT, nie w symulatorze.

### PRC-REQ-007

Gdy odbiorca prezentuje przebieg, system musi zachować rozdział planowanego zajęcia i rzeczywistego zajęcia potwierdzonego faktem. Zmiana współrzędnych węzła prezentacji nie może zmienić czasu, kolejki ani wyniku ilościowego procesu.

### PRC-REQ-008

Gdy oceniany przedział zaczyna się w trakcie procesu, system musi kontynuować podany stan wejściowy WIP i jego historię czasową zamiast tworzyć nowy start na granicy dnia, zmiany lub tygodnia. Musi zachować rozróżnienie czasu przypadającego wewnątrz i poza ocenianym przedziałem; nieznany wcześniejszy nakład pozostaje nieznany. Kwalifikacja powtarzalności ekonomicznej należy do ECO-REQ-002.

## Acceptance criteria

### PRC-AC-001

Sprawdza PRC-REQ-001, PRC-REQ-004. Dla autolizy 08:00–08:45 i bulk 08:45–11:30, ze składaniem 09:30–09:35 przez 1 osobę, odczyt pokazuje 45 min autolizy i nadal trwający bulk podczas składania. Nakład składania wynosi 5 osobominut, nie 165. Przejście końca autolizy i początku bulk ma tę samą chwilę.

### PRC-AC-002

Sprawdza PRC-REQ-002. Dwie czynności 05:00–05:30 wymagają po 1 piekarzu. Dostępny jest jeden piekarz, także z wolną godziną o 08:00. Ocena wskazuje konflikt o 05:00 albo jawne przesunięcie/kolejkę z nowym terminem, nie pełną równoczesną wykonalność. Dodanie sprzedawcy bez wymaganej umiejętności nie rozwiązuje konfliktu piekarza.

### PRC-AC-003

Sprawdza PRC-REQ-002, PRC-REQ-005. Dwa wsady po 12 szt. konkurują o piec 20 szt.: wynik ujawnia oczekiwanie lub spóźnienie, nigdy jednoczesne 24 szt. Przy nieznanej pojemności wynik mówi „pojemność niezweryfikowana”; dla pojemności w kg i wsadów w szt. bez konwersji wskazuje brak konwersji, nie porównuje samych liczb.

### PRC-AC-004

Sprawdza PRC-REQ-003. Półprodukt jest gotowy o 05:00, dostarczony przez piekarza limit użycia wynosi 30 min od gotowości. Kolejka daje start 05:45: wynik wskazuje przekroczenie o 15 min i źródło limitu. Start 05:30 spełnia maksymalny limit. Bez właściwego limitu identyczna kolejka pozostawia technologię niezweryfikowaną, a nie fałszywie „maszyna niewykonalna” ani „technologia poprawna”.

### PRC-AC-005

Sprawdza PRC-REQ-004. Formowanie przez 10 min z 1 osobą, potem 20 min z 2 osobami daje 30 min czasu operacji i 50 osobominut; stałe 2 osoby przez 30 min dają 60 osobominut. Jawne 15 min czyszczenia po operacji pozostaje na osi czasu i zajmuje wskazanego pracownika/zasób.

### PRC-AC-006

Sprawdza PRC-REQ-001, PRC-REQ-005. Proces rozpoczęty w niedzielę przed analizowanym tygodniem jest wejściowym WIP; pasywny etap trwa przez północ bez obciążenia ciągłą pracą. Usunięcie czasu tego etapu daje niepełny przebieg, nie 0 min. Próba aktywnej operacji przed wymaganym poprzednikiem ujawnia naruszenie zależności.

Jawna obsada 0 na pasywnym etapie oznacza brak ciągłej obsługi, nie zakaz osobnych czynności. Obsada −1 lub 1,5 daje błąd wejścia, nie ujemny ani ułamkowy nakład osób.

### PRC-AC-007

Sprawdza PRC-REQ-006. Polecenie zakończenia nieistniejącej aktywności lub zakończenia o 07:50 po starcie 08:00 jest odrzucone bez częściowego przejścia. Oddzielnie: potwierdzona obserwacja rozpoczęcia po 45 min przy limicie 30 min pozostaje w historii z odchyleniem; ocena hipotetyczna nie usuwa jej i nie zmienia czasu na 30 min.

### PRC-AC-008

Sprawdza PRC-REQ-007. Dla identycznych wejść przesunięcie symbolu pieca na mapie pozostawia czasy i ilości identyczne. Planowane zajęcie 06:00–07:00 bez faktu wykonania nie jest prezentowane jako potwierdzona praca pieca.

### PRC-AC-009

Sprawdza PRC-REQ-008. Dla tygodnia od poniedziałku 2026-11-23 00:00 Europe/Warsaw wejściowy półprodukt ma pasywny etap od niedzieli 22:00 do poniedziałku 06:00. Wynik zachowuje start w niedzielę: 8 h etapu łącznie, 6 h wewnątrz tygodnia i 2 h przed nim, bez nowego startu o północy. Nieznana wcześniejsza praca przygotowawcza jest wskazana jako brak, nie 0 h ani dowód powtarzalnego tygodnia.

## Dependencies and readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | REC-REQ-001, REC-REQ-002 | Zamrożona receptura i skalowane ilości, gdy przebieg używa receptury | start |
| contract-input | WRK-REQ-001, WRK-REQ-007 | Dostępność i jednoznaczny czas, gdy ocena dotyczy osób | start |
| contract-input | EVT-REQ-001, EVT-REQ-002 | Obserwacje/korekty, gdy odbiorca czyta wykonanie; nie wymaga kompletnego rejestratora do ręcznych pomiarów scenariusza | start |
| contract-input | STK-REQ-001, STK-REQ-002 | Bilans i przydatność materiału; sam przebieg nie poświadcza zasobu zapasu | demonstration |
| release-gate | [Engineering assurance](../engineering-assurance.md#artefakty-przed-implementacją) | Uprawnienia, walidacja i izolacja według danych odbiorcy; demonstracja nie zatwierdza użycia produkcyjnego | release |

Kontrakt nie wybiera solwera, bazy ani granicy strumienia. DEC-001 dotyczy zależnych utrwalanych mas, DEC-002 utrwalanych obserwacji/odtwarzania; przykłady ich nie rozstrzygają. Brak ręcznych czasów lub okien jest brakiem wejścia do konkretnego wniosku, nie nową decyzją globalną. Kompletność opisu nie oznacza wdrożenia.
