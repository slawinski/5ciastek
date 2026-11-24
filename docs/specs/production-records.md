# Production records

## Purpose-and-scope

Piekarz rejestruje fakty konkretnej partii bez nadmiernej pracy administracyjnej. Uprawniony operator zapisuje zdarzenia; osoba z prawem korekty poprawia błędny wpis z powodem. Odbiorcy tylko do odczytu korzystają z tej samej zatwierdzonej historii i projekcji. Liczba osób nie wymaga imiennego wskazywania pracowników. Dostęp do tożsamości, jeśli jest potrzebna, podlega celowi przetwarzania i uprawnieniom.

Zakres obejmuje ręczne partie, etapy, operacje, odcinki obsady, kontekst pomiarów, transfery/straty, fakty zajęcia zasobów, korekty i odtworzenie projekcji. Rozwój jest przyrostowy: cykl aktywności z minimalną kartą, korekty obsługiwanych faktów, następnie ilości i zasoby z rozszerzoną walidacją zależności. Pełny recorder nie jest warunkiem scenariusza inwestycyjnego z ręcznie dostarczonymi, opisanymi pomiarami.

Poza zakresem są automatyczna detekcja maszyn, kamery, gesty, identyfikacja osób, sterowanie urządzeniami, automatyczny pomiar temperatury, solver CAPP, płace i formalna ewidencja czasu. Adaptery machine/sensor/vision można rozważyć dopiero po weryfikacji ręcznego śledzenia i osobnej ocenie akceptacji/deduplikacji; nie przejmują automatycznie roli źródła prawdy ani nie usuwają ręcznej korekty.

## Actors-data-and-authority

Partia ma stabilne ID, konkretną niezmienną publikację receptury, planowaną masę w g/kg i/lub liczbę sztuk, status, autora i czasy utworzenia. Powiązanie z zatwierdzoną wersją planu jest jawne, jeśli występuje. Zatwierdzenie planu nie tworzy wykonania.

ActivityRun wskazuje partię, kind=phase albo task, rodzaj/nazwę, stan, start, koniec i ewentualną notatkę. Etap jest okresem technologicznym (np. autoliza/bulk/garowanie/retarding), operacja konkretną czynnością, także wewnątrz etapu. Obsługiwane czynności obejmują mieszanie, autolizę, fermentację, składanie, dzielenie, ważenie, formowanie, garowanie, chłodzenie, wypiek, chłodzenie po wypieku, pakowanie i mycie. Nieplanowaną czynność można nazwać ręcznie.

Wejścia ilościowe mają kg albo szt. i jawne dane konwersji, gdy potrzebne. Transfer wskazuje stabilne węzły źródła/celu i partię/część; strata miejsce i powód; zajęcie stabilny resourceId i ilość/pojemność z jednostką, gdy znana. Czasy są jednoznacznymi znacznikami czasu; prezentacja jest w lokalnej strefie urządzenia/zakładu. Raport rozdziela minuty/godziny procesu i osobominuty/osobogodziny pracy. Dane mierzone, estymowane i brakujące nie są zamienne.

Zdarzenia zatwierdzone są źródłem projekcji, nie animacja, plan, timer ekranu ani symulacja. [PRC-REQ-001](process-execution.md#prc-req-001) jest właścicielem wspólnej semantyki procesu i czasu; [PRC-REQ-002](process-execution.md#prc-req-002) ograniczeń ról/zasobów; [PRC-REQ-003](process-execution.md#prc-req-003) zadanych okien użyteczności. [STK-REQ-001](stock-inventory.md#stk-req-001) jest właścicielem bilansu i konwersji, [ECO-REQ-001](economics-investment.md#eco-req-001) alokacji pracy/kosztów, a [WRK-REQ-001](workforce.md#wrk-req-001) rozdzielenia ewidencji. EVT przyjmuje fakty i koryguje historię, nie ustanawia konkurencyjnych praw magazynu ani kosztów.

## Lifecycle-and-invariants

Utworzenie partii nie rozpoczyna automatycznie aktywności. Aktywność przechodzi z nierozpoczętej do trwającej, następnie zakończonej; stop bez startu i koniec przed początkiem są błędami. Etap pasywny może trwać równolegle z aktywną operacją. Zmiana obsady zamyka poprzedni odcinek i otwiera następny bez nakładania w obrębie tej samej operacji. Partie, części i zasoby nie mieszają tożsamości; procesy mogą przechodzić przez północ i trwać wiele dni.

Polecenie może zostać przyjęte albo odrzucone; niepotwierdzony zapis nie jest wykonaniem. Korekta tworzy audytowalną zmianę z oczekiwaną wersją historii, nie kasuje pierwotnego wpisu. Wszystkie istniejące zależności podlegają walidacji. Potwierdzona obserwacja odstępstwa od planowanego ograniczenia pozostaje obserwacją: reguła hipotetycznej wykonalności nie uprawnia do usunięcia faktu. Odmowa nowego przydziału przekraczającego znaną pojemność nie może udawać, że wcześniej zaobserwowane odstępstwo nigdy nie wystąpiło.

## Requirements

### EVT-REQ-001

Każde zatwierdzone zdarzenie musi mieć wersjonowaną kopertę: schemaVersion, eventId, typ, batchId i activityRunId gdy dotyczą typu, occurredAt, recordedAt, jednoznaczną kolejność/sequence w obrębie strumienia, source, actorId dla rzeczywistego zapisu oraz payload. occurredAt oznacza czas zajścia, recordedAt czas zapisu; późny wpis nie zmienia czasu zajścia. Produkcja nie wymaga scenarioId. Typy kontraktu to batch_created, activity_started, activity_completed, worker_count_changed, quantity_moved, loss_recorded, resource_reserved, resource_released, event_corrected. „Start/stop/correct” są poleceniami, nie drugim formatem zdarzeń. DEC-002 nadal określa otwartą granicę tożsamości, kolejności i odtwarzania strumienia; koperta nie wybiera partycji globalnej ani per partia.

### EVT-REQ-002

Uprawniona korekta musi wskazywać eventId, oczekiwaną wersję, autora, powód i wartość przed/po. System musi zweryfikować cały skorygowany przebieg i wszystkie istniejące zależności (odcinki obsady, przejścia, transfery, straty, zajęcia/zwolnienia), następnie atomowo przyjąć korektę i przeliczyć projekcje albo odrzucić ją z identyfikatorem/opisem konfliktu bez częściowych skutków. Starsza oczekiwana wersja nie może nadpisać nowszej. Oryginał i korekta pozostają w historii; system nie przesuwa po cichu innych faktów, nie kasuje historii ani nie zmienia zatwierdzonego grafiku. Jawne powiązane poprawki wymagają korekty, nie automatycznej naprawy.

### EVT-REQ-003

Uprawniony piekarz musi móc utworzyć partię z opublikowanej wersji [REC-REQ-001](recipes.md#rec-req-001) i ilości obliczonych według [REC-REQ-002](recipes.md#rec-req-002). System zapisuje tę tożsamość oraz planowane sztuki/masę; edycja bieżącej receptury nie przepina partii na nową wersję. Jeżeli partia realizuje plan, użytkownik jawnie wskazuje jego wersję zgodnie z PLN-REQ-001; sam kalkulator ani akceptacja planu nie generuje zdarzeń wykonania.

### EVT-REQ-004

Operator musi móc zapisać start i koniec wskazanego etapu/operacji oraz zakończyć etap i rozpocząć kolejny jednym logicznym poleceniem o wspólnym czasie granicznym. Oba zdarzenia przejścia są przyjmowane atomowo albo żadne. Operacja wewnątrz pasywnego etapu nie kończy tego etapu. System odrzuca stop bez startu i ujemny czas, nie blokując niezależnej partii. Czas trwania i rozdział aktywnego/pasywnego/pomocniczego czasu są interpretowane według PRC-REQ-001, nie według wyglądu osi czasu.

### EVT-REQ-005

Przy operacji system musi zapisać workerCount i okres obowiązywania. Zmiana liczby osób zamyka poprzedni LaborSegment i otwiera następny w tej samej chwili; odcinki jednej operacji nie nakładają się i nie przeliczają historii. Liczba jest całkowita i nieujemna; 0 na odcinku pasywnym oznacza brak stałej obsługi, nie zakaz osobnej czynności aktywnej. Podsumowanie podaje czas operacji i sumę czas_odcinka × workerCount, zgodnie z PRC-REQ-001. Cała fermentacja nie staje się roboczogodzinami piekarza.

### EVT-REQ-006

System musi prezentować workerCount jako zadeklarowaną obsadę operacji, nie dowód unikalnych osób w zakładzie. Równoległych anonimowych odcinków różnych operacji nie deduplikuje się automatycznie. Dokładne rozliczenie współdzielonej pracy wymaga wejścia alokacji zgodnego z ECO-REQ-001; bez niego wynik jest zadeklarowanym, nieuzgodnionym nakładem. WorkSession ani ShiftPlan nie są dodatkowymi odcinkami tej samej pracy ani automatycznym skutkiem zapisu produkcyjnego.

### EVT-REQ-007

System musi przyjmować rzeczywiste zapisy tylko od uprawnionego źródła/autora; pierwszy ręczny wycinek używa manual. Simulation korzysta z tej samej semantyki i osobnej przestrzeni identyfikatorów/scenarioId, nigdy z produkcyjnego rejestru zapisu. Uprawnienia muszą być sprawdzane po stronie serwera; odmowa nie zmienia stanu. Tożsamości pracowników są opcjonalne i dostępne wyłącznie przy uzasadnionym celu i uprawnieniach, bez domniemanej identyfikacji kamerą.

### EVT-REQ-008

Przy ponowieniu polecenia system nie może powielać aktywności ani skutków faktu o tym samym eventId. Równoczesne polecenia z urządzeń muszą być rozstrzygane względem aktualnego stanu, bez bezwarunkowego nadpisania i bez częściowego przejścia. Zapis dla partii B nie zmienia A; współdzielony zasób nadal wymaga wspólnej kontroli. Błąd walidacji, uprawnień, źródła, zapisu lub konflikt musi być widoczny i nie może otrzymać potwierdzenia sukcesu. Szczegóły trwałego porządku pozostają bramką DEC-002.

### EVT-REQ-009

Odbiorca karty i mapy musi otrzymywać wersjonowaną projekcję zatwierdzonej historii z identyfikatorami, źródłem, czasami i kolejnością. Odczyt/odświeżenie musi odtworzyć stan bez ponownego wykonania transferów. Równoważne manual i simulation po normalizacji identyfikatorów oraz metadanych źródła/czasu zapisu muszą dać te same stany, ilości i osobominuty. Odczyt nie zmienia danych. Wiek ostatniego zdarzenia nie jest dowodem utraty aktualności źródła; błąd źródła musi być odróżniony od braku nowych zdarzeń. Transport nie jest tu narzucony.

### EVT-REQ-010

Operator musi móc zapisać i ponownie odczytać kontekst obserwacji: wersję receptury, wielkość partii, wyposażenie, obsadę, pochodzenie i warunki obserwacji oraz kwalifikację pomiar/estymacja/brak. Aktywny, pasywny i pomocniczy czas pozostają oddzielone według PRC-REQ-001. Brak kontekstu jest jawny. Przeniesienie wyniku na inną skalę, obsadę lub maszynę jest estymacją; nie nadpisuje oryginalnego pomiaru i nie otrzymuje etykiety nowego pomiaru.

### EVT-REQ-011

Uprawniony operator musi móc potwierdzić transfer lub stratę konkretnej partii/części w kopercie EVT-REQ-001. Transfer zapisuje fromNodeId, toNodeId, ilość, jednostkę, relacje podziału/łączenia; strata ilość, jednostkę, miejsce i powód. Przyjęcie korzysta z STK-REQ-001: błędna ilość, przekroczenie znanego stanu lub nieznana konwersja nie stają się zaakceptowanym ruchem. Nieznany stan wymaga jawnego uzupełnienia, nie fikcyjnego zera. Podział na wsady zachowuje tożsamości części, łączenie wszystkie źródła. Start/stop ani animacja nie tworzą transferu. Brak producenta tych faktów oznacza brak danych o ilościach, nie 0.

### EVT-REQ-012

W rozszerzeniu obserwacji operator musi móc zapisać rzeczywiste sztuki przed i po wypieku oraz resztkę ciasta, odpad przy dzieleniu, błąd formowania i odpad po wypieku z ilością, jednostką, miejscem i przyczyną. Raport musi zestawiać planowaną masę/liczbę sztuk z rzeczywistym uzyskiem i stratami, zachowując bazę receptury. Bilans/konwersje podlegają STK-REQ-001; brak pomiaru lub konwersji pozostawia porównanie niezweryfikowane w tej jednostce zamiast domyślnego zera. Resztka nie jest automatycznie odpadem ani gotowym produktem zdatnym do sprzedaży; użyteczność zapasu należy do STK-REQ-002.

### EVT-REQ-013

Uprawniony operator musi móc potwierdzić zajęcie i zwolnienie zasobu dla aktywności/partii, wskazując resourceId, czas i ilość z jednostką, gdy modelowana jest pojemność. `resource_reserved` oznacza tu faktycznie potwierdzone zajęcie, nie plan CAPP. Przy równoczesnych nowych przydziałach system musi sprawdzać znaną pojemność według PRC-REQ-002 w tej samej jednostce; nieznana pojemność daje niezweryfikowane ograniczenie, nie gwarancję dostępności. Zwolnienie dotyczy właściwego zajęcia/zasobu i jest idempotentne. Plan, konfiguracja pojemności i start wypieku nie dowodzą zajęcia; bez potwierdzenia projekcja pokazuje brak danych o pracy urządzenia, nie pozorną telemetrię.

### EVT-REQ-014

Na telefonie i tablecie piekarz musi móc wybrać partię z listy i obsłużyć jej kartę bez przechodzenia do panelu administracyjnego. Karta pokazuje nazwę/wersję receptury, planowane sztuki/masę, status, bieżący etap, czas od startu, aktywne operacje, oś historii oraz osobno czasy i nakład pracy. Każda akcja wskazuje partię. Duże akcje Start/Zakończ/przejście etapu, operacja zagnieżdżona i zmiana obsady mają tekstowe stany „trwa”, „zakończono”, „brak danych” i błąd, nie tylko kolor/ruch. Domyślna obsada czynności aktywnej to 1; można ją zmienić podczas pracy. Timer wylicza czas ze startu bez cyklicznego zapisywania czasu do bazy. Nieplanowany etap wymaga podania nazwy.

### EVT-REQ-015

Karta musi udostępniać minimalny formularz transferu/straty, zajęcia/zwolnienia oraz uprawnionej korekty dopiero z działającą obsługą danego faktu. Formularze zbierają dane EVT-REQ-011/013/002; korekta wymaga powodu. Do tego czasu karta aktywności może działać samodzielnie, ale ilości/zajętość pozostają brakiem danych. Niepotwierdzona akcja ani błąd zapisu nie mogą zmieniać prezentacji na potwierdzony ruch, rozpoczęcie/zakończenie czy zajęcie. Konflikt korekty jest czytelny, bez częściowego sukcesu.

### EVT-REQ-016

Dla zarejestrowanej zmiany analityk musi móc porównać planowaną i rzeczywistą wydajność oraz wskazać trzy najdłuższe czynności na podstawie zapisanych czasów. Wynik musi rozdzielać czas procesu i nakład osób oraz ujawniać braki wpisów i nieuzgodnioną alokację. Weryfikacja użyteczności obejmuje czas uzupełnienia danych na partię, odsetek brakujących wpisów i rzeczywiste roboczogodziny na 100 sztuk; nie wolno przedstawiać ich jako zmierzonych KPI bez danych. Brak rzeczywistego uzysku nie jest zerowym mianownikiem do wyliczenia wydajności.

## Acceptance

### EVT-AC-001

Sprawdza EVT-REQ-001, EVT-REQ-003, EVT-REQ-007. Piekarz tworzy A z publikacji v1, 20 sztuk i jawną wersją planu, jeśli ją realizuje. Odczyt zachowuje v1 mimo edycji receptury. Zdarzenie, które zaszło 08:00 i zapisano 08:05, zachowuje oba czasy, schemaVersion, eventId, source=manual, autora i kolejność strumienia; nie wymaga scenarioId. Samo zatwierdzenie planu nie utworzyło A ani startu.

### EVT-AC-002

Sprawdza EVT-REQ-004, EVT-REQ-005. Autoliza A 08:00–08:45 daje 45 min procesu i przy obsadzie 0 brak stałej pracy. Polecenie o 08:45 kończy ją i rozpoczyna bulk z tym samym czasem. Składanie 09:30–09:35 przez jedną osobę daje 5 osobominut; bulk nadal trwa do 11:30. Awaria połowy przejścia nie pozostawia tylko jednego zdarzenia.

### EVT-AC-003

Sprawdza EVT-REQ-004, EVT-REQ-008. Stop nieistniejącej aktywności albo koniec 07:59 przy starcie 08:00 jest odrzucony bez zmiany projekcji. Powtórzony start oraz jednoczesny stop z dwóch urządzeń nie tworzą dwóch aktywności ani dwóch skutków zakończenia; przegrany konflikt nie nadpisuje aktualnego stanu.

### EVT-AC-004

Sprawdza EVT-REQ-005. Formowanie 11:40–12:10 z 2 osobami daje 30 min i 60 osobominut (1 osobogodzinę). Wariant 10 min × 1 + 20 min × 2 daje 50 osobominut, z dwoma przylegającymi, nienakładającymi się odcinkami. Zmiana obsady nie zmienia pierwszych 10 min. Ujemna lub ułamkowa liczba osób nie tworzy odcinka.

### EVT-AC-005

Sprawdza EVT-REQ-006. Dwie równoległe anonimowe deklaracje po 1 osobie są pokazane jako zadeklarowana obsada operacji, nie dowód obecności dwóch unikalnych osób. Bez podziału wspólnej pracy raport oznacza nakład jako nieuzgodniony; WorkSession nie jest dodany jako kolejna praca. Dostarczony podział 30 min jednej osoby 50/50 jest przekazany do ECO-REQ-001 jako 15+15, nie 30+30 osobominut.

### EVT-AC-006

Sprawdza EVT-REQ-007, EVT-REQ-008. Użytkownik bez prawa zapisu lub korekty wysyła polecenie przez API: otrzymuje odmowę, historia i projekcja się nie zmieniają. Próba zapisu simulation do rejestru produkcyjnego jest odrzucona. Zapis liczby osób bez ich identyfikatorów pozostaje dozwolony; brak dostępu do tożsamości nie ujawnia ich odbiorcy.

### EVT-AC-007

Sprawdza EVT-REQ-004, EVT-REQ-008, EVT-REQ-014. Jednocześnie A fermentuje, B jest formowana; wybór B i jej stop nie zmienia zegara ani historii A. Proces rozpoczęty poprzedniego dnia o 23:00 i zakończony o 01:00 następnego dnia w tej samej strefie bez zmiany offsetu ma 120 min, nie czas ujemny. Karta pokazuje właściwą partię przy każdej akcji.

### EVT-AC-008

Sprawdza EVT-REQ-001, EVT-REQ-009. Dwa równoważne zbiory manual/simulation po wskazanej normalizacji dają tę samą projekcję stanów, ilości i osobominut. Ponowne otwarcie/odświeżenie nie wykonuje transferu drugi raz. Projekcja zachowuje wersję, identyfikatory, źródło, czasy i kolejność; izolowany przykład nie rozstrzyga DEC-002. Błąd źródła jest pokazany jako błąd, natomiast trwający czterogodzinny proces bez nowych zdarzeń sam w sobie nie dowodzi awarii źródła.

### EVT-AC-009

Sprawdza EVT-REQ-010. Po zapisaniu i ponownym otwarciu pomiaru widać v1, 20 sztuk, maszynę M, 2 osoby i pochodzenie/warunki; brak temperatury/wyposażenia lub innego kontekstu jest oznaczony jako brak. Przeliczenie czasu na inną maszynę lub jedną osobę jest estymacją, nie zmienia pomiaru ani nie udaje nowego pomiaru. Aktywne, pasywne i pomocnicze czasy są odrębne.

### EVT-AC-010

Sprawdza EVT-REQ-008, EVT-REQ-011, EVT-REQ-015; konsumuje STK-REQ-001. Dla znanych 20 kg operator zapisuje stratę 0,5 kg z miejscem/powodem i transfer 19,5 kg: stan wynosi 0 kg. Kolejny transfer 1 kg, ilość 0/-1 oraz próba ruchu z nieznanego stanu bez uzupełnienia nie są przyjęte. Ponowienie eventId nie odejmuje masy drugi raz. Formularz i historia pokazują źródło/cel, ilość, jednostkę i powód straty.

### EVT-AC-011

Sprawdza EVT-REQ-011; konsumuje STK-REQ-001. Podział 20 sztuk na wsady 12 i 8 zachowuje identyfikatory i pochodzenie obu; aktualizacja A nie przesuwa B. Łączenie dwóch źródeł zachowuje oba ID. Próba potraktowania 1 kg jako 1 sztuki bez konwersji jest odrzucona, bez częściowego przeliczenia.

### EVT-AC-012

Sprawdza EVT-REQ-011, EVT-REQ-013, EVT-REQ-015. Sam start wypieku nie daje transferu ani aktywnej maszyny. Dopiero potwierdzony ruch 12 sztuk jest dostępny odbiorcy jako ruch właściwej części bez zmiany drugiej partii. Nieudany zapis zajęcia pieca daje błąd, nie potwierdzenie pracy urządzenia. Przy niewdrożonym zapisie ilości/zajętości karta podaje brak danych, nie 0.

### EVT-AC-013

Sprawdza EVT-REQ-008, EVT-REQ-013; konsumuje PRC-REQ-002. Dla pieca 20 sztuk dwa równoczesne nowe przydziały po 12 sztuk nie są oba zatwierdzone. Zwolnienie zaakceptowanych 12 dotyczy tylko tego pieca; ponowienie nie zwalnia ponownie. Dla nieznanej pojemności wynik mówi „ograniczenie niezweryfikowane”, nie „bezpiecznie dostępny”. Sam plan lub konfiguracja pojemności nie zmienia stanu rzeczywistego zajęcia.

### EVT-AC-014

Sprawdza EVT-REQ-002, EVT-REQ-015. Uprawniony korektor zmienia koniec formowania z 12:10 na 12:00 przy starcie 11:40 i 2 osobach, podając powód oraz aktualną oczekiwaną wersję. Po akceptacji wszystkie odbiory pokazują 20 min/40 osobominut z tej samej zatwierdzonej historii; audyt pokazuje stare i nowe wartości, autora i powód. Brak powodu lub prawa korekty nie zmienia danych.

### EVT-AC-015

Sprawdza EVT-REQ-002, EVT-REQ-008. Korekta końca przed początek lub istniejący zależny segment jest odrzucona bez częściowej zmiany. Zmniejszenie ilości unieważniające późniejszy transfer daje konflikt z ID zależnego faktu; bilans i mapa zachowują poprzednią wersję. Równoczesna korekta ze starszą oczekiwaną wersją nie nadpisuje nowszej. Żaden przypadek nie przesuwa automatycznie transferu, zasobu ani grafiku.

### EVT-AC-016

Sprawdza EVT-REQ-014, EVT-REQ-015. Na telefonie i tablecie piekarz wybiera A, uruchamia autolizę, przechodzi do bulk, rejestruje składanie, uruchamia formowanie z 2 osobami i kończy po 30 min. Widzi oś czasu, 30 min/60 osobominut i tekstowe stany, bez panelu administracyjnego. Obsada startowa aktywnej operacji wynosi 1 przed zmianą. Może nazwać nieplanowany etap; bez nazwy nie zapisuje bezimiennego faktu. Timer postępuje ze startu bez kolejnych zapisów czasu. Błąd zapisu pozostawia akcję niepotwierdzoną.

### EVT-AC-017

Sprawdza EVT-REQ-012. Dla planu 20 sztuk operator zapisuje 20 sztuk przed wypiekiem, 19 po oraz 1 sztukę odpadu po wypieku z przyczyną. Raport pokazuje plan/wykonanie i stratę, nie zmienia uzysku receptury. Osobno zapisane resztka ciasta 0,2 kg, odpad dzielenia 0,1 kg i błąd formowania 1 sztuki zachowują rodzaj, miejsce, jednostkę i przyczynę; bez konwersji nie są sumowane do jednej liczby sztuk. Brak pomiaru po wypieku oznacza brak wyniku, nie 0 sztuk; resztka nie staje się automatycznie odpadem/zapasem sprzedażnym.

### EVT-AC-018

Sprawdza EVT-REQ-016. Dla zmiany z czynnościami aktywnymi 30/20/10/5 min i potwierdzonym uzyskiem 100 sztuk raport wskazuje trzy najdłuższe 30/20/10 min, oddzielając czas pasywny. Przy 60 osobominutach uzgodnionej pracy pokazuje 1 osobogodzinę/100 sztuk. Jeżeli 2 z 10 oczekiwanych wpisów nie mają danych, wskaźnik braków wynosi 20%; brak czasu uzupełnienia pozostaje brakiem, nie KPI 0. Bez rzeczywistego uzysku nie podaje dokładnej wydajności na 100 sztuk.

### EVT-AC-019

Sprawdza EVT-REQ-002, EVT-REQ-013; konsumuje PRC-REQ-002. Piec o znanej pojemności 20 sztuk ma zatwierdzone zajęcie A: 12 sztuk 10:00–10:30 oraz B: 12 sztuk od 10:30. Korekta zwolnienia A na 10:40 unieważnia zależny przydział B. System odrzuca korektę z identyfikatorem konfliktu, zachowuje poprzednie zajęcia i projekcję, nie przesuwa sam B. Potwierdzonej obserwacji odstępstwa od planu nie usuwa się tylko dlatego, że hipotetyczny harmonogram uznałby ją za niewykonalną.

## Examples

### EVT-EX-001

EVT-REQ-004, EVT-REQ-005, EVT-AC-002 i EVT-AC-004: 45 min autolizy nie oznacza 45 min pracy; 5 min składania daje 5 osobominut bez zamknięcia bulk, a 10×1 + 20×2 daje 50 osobominut. EVT-REQ-002 i EVT-AC-014: korekta 30 min × 2 na 20 min × 2 daje 40 osobominut, bez usunięcia poprzedniej wartości. Liczby nie ustanawiają norm technologicznych ani czasu dla innej maszyny/obsady.

## Dependencies-and-readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | REC-REQ-001, REC-REQ-002 | Niezmienna receptura i planowane ilości partii; nie cały katalog/epik | start |
| contract-input | PRC-REQ-001, WRK-REQ-001, ECO-REQ-001 | Wspólne czasy, rozdział ewidencji i uzgodnienie nakładu; nie pełny payroll | start |
| contract-input | STK-REQ-001, STK-REQ-002 | Bilans/konwersje i kwalifikacja resztki dla ilości/strat; nie pełny magazyn | start |
| contract-input | PRC-REQ-002, PRC-REQ-003 | Zasoby/ograniczenia i zadane okna, bez domyślnej wykonalności | start |
| contract-input | PLN-REQ-001 | Wersja planu, tylko gdy partia go realizuje | start |
| implementation-prerequisite | EVT-REQ-004, EVT-REQ-005, EVT-REQ-008 | Zapis aktywności przed demonstracją trwałej karty i korekty czasu | demonstration |
| implementation-prerequisite | EVT-REQ-011 | Działający zapis ruchu przed formularzem i rzeczywistymi ilościami live, nie przed demo fixture | demonstration |
| implementation-prerequisite | EVT-REQ-013 | Działające zajęcie/zwolnienie przed rzeczywistą zajętością live, nie przed kartą aktywności | demonstration |
| implementation-prerequisite | EVT-REQ-002 | Korekta istniejących faktów waliduje każdą ich zależność; ilości/zasoby dopiero wraz z ich producentami | demonstration |
| optional-adapter | EVT-REQ-009 | Odbiorcy mapy/demo używają wspólnej projekcji; ich renderer nie blokuje ręcznego zapisu | demonstration |
| release-gate | EVT-REQ-007, EVT-REQ-008, EVT-REQ-002 | Uprawnienia, idempotencja, współbieżność i korekty na danych trwałych; kontrole P1 według engineering assurance | release |

DEC-002 pozostaje otwarta na granicy trwałej koperty, sekwencji, współbieżności i odtworzenia EVT-REQ-001/002/004/008/009/011/013. Izolowany wersjonowany fixture pozwala pokazać kontrakt, ale nie zamyka decyzji ani nie dowodzi gotowości live. DEC-001 dotyczy utrwalanych mas, ich zgodności i zależnych korekt EVT-REQ-003/011/012/002, nie prostego przykładu 20−19,5−0,5. Decydentów domenowych musi jeszcze wskazać właściciel repozytorium.

Przed wydaniem na rzeczywistych danych obowiązuje [engineering assurance](../engineering-assurance.md): autoryzacja serwerowa, minimalizacja danych pracowników i weryfikacja celu powiązania imiennego, walidacja, historia, backup, migracje, retencja i odtworzenie, testy błędu źródła/zapisu, awarii i odmowy dostępu. Wyniki przyszłych testów muszą wskazywać artefakt/SHA i sprawdzane AC; syntetycznych danych nie zapisuje się jako produkcyjnych. Nie ustanawia się nowych okresów retencji, bezterminowego audytu ani deklaracji prawnej zgodności. [Design system](../design-system.md) jest właścicielem komponentów, klawiatury, widocznego focusu i czytelności na telefonie/tablecie bez samego koloru/animacji. Szybki zapis nie wymaga Gantta. Opis kontroli, dokumentacja i stan historycznego Issue nie są dowodem implementacji ani zgody na wydanie.
