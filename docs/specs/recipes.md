# Recipes

## Purpose-and-scope

Piekarz ma odczytać zatwierdzoną recepturę i ilości potrzebne dla wybranej liczby sztuk. Uprawniony redaktor tworzy i publikuje receptury; administrator zarządza dostępem. Samo zalogowanie nie nadaje prawa edycji. Odbiorca API otrzymuje tylko dane dostępne dla jego uprawnień.

MVP-0 obejmuje surowce, samodzielne warianty, szkic, publikację, historię, katalog i deterministyczne skalowanie. Nie obejmuje wykonania partii, magazynu, cen, prognozy popytu, zapisu planu ani przeliczania czasu fermentacji. Późniejsze rozszerzenia wspólnego ciasta i zaawansowanej hydracji pozostają osobnym zakresem REC-REQ-013; nie są warunkiem MVP-0. Uzysk rzeczywisty i straty są obserwacjami [EVT-REQ-012](production-records.md#evt-req-012), nie automatyczną zmianą receptury.

## Actors-data-and-authority

Surowiec ma stabilny identyfikator, nazwę i klasyfikację potrzebną do obliczeń, w szczególności mąka, woda, sól, zakwas/zaczyn lub dodatek. Receptura ma tożsamość, nazwę, opcjonalny kod, wersję, status, pełną listę surowców z bazowymi masami w g, dodatni całkowity uzysk w sztukach oraz opis produktu i uporządkowane etapy procesu. Instrukcje etapów, notatki i podane orientacyjne czasy/temperatury służą odczytowi; nie są pomiarem wykonania ani modelem fermentacji. Zdjęcia są opcjonalne, nie bramkują katalogu.

Wyjścia to zatwierdzona wersja, lista i szczegóły katalogu, eksport zachowujący masy/jednostki/relacje oraz obliczone masy w g/kg, procenty piekarskie i podsumowanie uzysku. Kilogram oznacza 1000 g. Masa porcji dotyczy ciasta, nie masy wypieczonego bochenka. Dla zakwasu potrzebny jest wkład mąki i wody oraz rodzaje wniesionej mąki; brak składników kompozycji pozostaje brakiem, nie zerem.

Źródłem wartości historycznych jest opublikowana wersja, nie bieżący rekord surowca. [Archiwum](../migrations/spec-library/source-baseline.json) zachowuje historyczne #3/#14/#15/#17 i komentarze; nie jest bieżącą specyfikacją. [Rejestr](README.md) ustala granice właścicieli.

## Lifecycle-and-invariants

Redaktor zapisuje i edytuje szkic, następnie jawnie publikuje zatwierdzoną wersję. Dalsza edycja szkicu nie zmienia wcześniejszej publikacji. Odczyt historyczny wskazuje konkretną wersję; katalog nie zastępuje jej nieopublikowanymi zmianami. Niekompletny wariant może pozostać szkicem, lecz nie może przejść do publikacji ani skalowania. Odczyt, filtr i przeliczenie nie są poleceniami zapisu. Nieudany zapis lub publikacja nie daje potwierdzenia zatwierdzenia.

## Requirements

### REC-REQ-001

Przy publikacji system musi zamrozić pełne masy, uzysk i wartości kompozycji używane do obliczeń: klasyfikację składników, wkład mąki/wody zakwasu oraz podział rodzajów mąki. Stabilne powiązanie z surowcem pozostaje zachowane. Zmiana bieżącego surowca lub szkicu nie może zmieniać odczytu ani obliczeń wcześniejszej publikacji. Nowa publikacja jawnie przyjmuje nowe wartości. Wersjonowane odwołanie albo utrwalenie wartości są dopuszczalne; ta specyfikacja nie wybiera mechaniki przechowywania.

### REC-REQ-002

Dla kompletnej opublikowanej receptury system musi wyliczać masę bazową jako sumę bazowych mas składników, a masę porcji jako tę sumę podzieloną przez dodatni całkowity uzysk N. Dla docelowego T każdą masę wylicza z bazy przez T/N; masę partii sumuje przed zaokrągleniem prezentacji. Kolejne wybory zawsze korzystają z bazy, nie z ostatniego wyniku. Pomocnicza masa porcji nie zastępuje N i nie może po cichu zmieniać składników. Publikacja sprzecznych wartości wymaga odmowy zgodności według wspólnej precyzji, nadal otwartej w DEC-001.

### REC-REQ-003

Uprawniony redaktor musi móc utworzyć recepturę z co najmniej jednym surowcem, zapisać szkic i opublikować zatwierdzoną wersję. System musi odrzucać nieliczbowe, zerowe i ujemne masy pozycji; masy zapisuje w g. Publikacja i skalowanie wymagają pełnych dodatnich mas oraz dodatniego całkowitego uzysku. Błąd wskazuje brakujące lub niepoprawne dane i nie publikuje sprzecznej wersji.

### REC-REQ-004

W MVP-0 każdy publikowany lub skalowany wariant musi być pełną samodzielną recepturą. Opcjonalny odnośnik do bazy jest informacyjny: nie dodaje jej mas, nie dziedziczy składników i nie uruchamia scalania. System musi odmówić publikacji i skalowania wariantu zawierającego tylko dodatki, wskazując niekompletność zamiast prezentować go jako pełną recepturę.

### REC-REQ-005

System musi zachować tożsamość i powiązania surowca po zmianie jego nazwy. Nowa nazwa nie tworzy nowego surowca ani nie zrywa istniejącej relacji w recepturze.

### REC-REQ-006

System musi sprawdzać uprawnienia zapisu/edycji po stronie obsługującej API, nie tylko w formularzu. Nieuprawniony zapis otrzymuje odmowę bez zmiany receptury. API katalogu musi udostępniać uprawnionemu odbiorcy opublikowane wersje, bez prywatnych danych ani nieopublikowanych zmian niedostępnych temu odbiorcy. Edycja pozostaje w panelu administracyjnym, nie w katalogu roboczym.

### REC-REQ-007

Po otwarciu katalogu zalogowany użytkownik musi widzieć dostępne opublikowane receptury z nazwą i opcjonalnym kodem. Filtr nazwy zawęża listę; brak dopasowań daje pusty stan, nie błąd aplikacji. Szczegóły muszą wskazywać opublikowaną wersję, opis, pełne masy w g, sumę bazową i etapy w zapisanej kolejności. Nieudane pobranie musi mieć czytelny komunikat i możliwość ponowienia, a nie udawać pusty katalog lub aktualny poprawny wynik.

### REC-REQ-008

Piekarz musi móc wybrać 10, 15, 20 lub 30 sztuk i tryb g, kg albo procentów piekarskich. Podsumowanie musi podawać T, masę porcji ciasta, masę partii i wybraną jednostkę. Kalkulator przyjmuje T jako parametr niezależnie od jego źródła i liczy deterministycznie, bez AI. Dowolne dodatnie całkowite T w formularzu jest opcjonalnym rozszerzeniem, nie warunkiem presetów. Niepoprawny uzysk lub niepełne masy powodują zrozumiały błąd bez dzielenia przez zero.

### REC-REQ-009

Przy obliczaniu procentów system musi używać całej mąki, także wniesionej w zakwasie/zaczynie, z podziałem na jej rodzaje. Procent składnika to jego masa / całkowita masa mąki × 100%; suma udziałów rodzajów mąki wynosi 100% i nie zależy od T. Hydracja jest pochodną całej wody i mąki, z uwzględnieniem wkładu zakwasu; sam procent dodatku zakwasu nie określa hydracji. Masa gotowego zakwasu jest liczona raz w masie partii; jego wewnętrzne składniki nie stają się dodatkowymi porcjami do odważenia.

### REC-REQ-010

W trybie procentów system musi obok procentu każdego składnika pokazać rzeczywistą przeskalowaną masę. Nagłówek musi oddzielnie pokazać całkowitą mąkę w kg i masę całego ciasta. Każdy rodzaj mąki ma osobny udział i masę w kg. Małe dodatki mogą mieć masę w g. Widok musi rozróżniać „mąka łącznie” od surowców do odważenia, bez drugiej pozycji ważenia mąki zawartej w gotowym zakwasie.

### REC-REQ-011

Gdy brakuje kompozycji zakwasu, klasyfikacji lub danych pozwalających ustalić poprawną podstawę mąki, system musi nazwać braki i nie przedstawiać sumy mąki, procentów ani hydracji jako dokładnych. Znane masy do odważenia nadal można pokazać. Brak danych nie jest zerowym wkładem i nie uzasadnia użycia bieżącego surowca zamiast historii.

### REC-REQ-012

Zmiana T, jednostki lub trybu procentów nie może zapisywać receptury, publikować wersji, tworzyć partii ani zatwierdzać planu. Wynik jest wejściem dla [PLN-REQ-001](production-plans.md#pln-req-001), nie zapisanym planem. Odbiorca prognozy może później dostarczyć T bez zmiany formuły i bez prawa zmiany historycznej bazy.

### REC-REQ-013

W późniejszym rozszerzeniu redaktor musi móc opisać warianty produktów wywodzące się ze wspólnego ciasta oraz zaawansowane założenia hydracji, wskazując wspólną bazę i różnice. Odbiorca musi móc odtworzyć pełny skład wariantu i pochodzenie użytych wartości bez zmiany wcześniejszej publikacji. System nie może przedstawiać dodatków jako całego ciasta ani domyślać niepodanej kompozycji. Wybór sposobu kompozycji, zakresu „zaawansowanych” reguł hydracji i rozliczenia uzysku wspólnego ciasta nie został w źródle rozstrzygnięty: przed implementacją tego rozszerzenia potrzebne są konkretne decyzje domenowe. Nie ogranicza to samodzielnych wariantów MVP-0 ani odczytu obserwowanego uzysku przez EVT-REQ-012.

### REC-REQ-014

Uprawniony odbiorca eksportu musi otrzymać receptury testowego zestawu bez utraty mas, jednostek i relacji surowców. Eksport jest odczytem i nie może zmieniać receptury ani jej historii; format pliku nie został narzucony.

### REC-REQ-015

Uprawniony redaktor musi móc znaleźć recepturę po nazwie w narzędziu edycji i odczytać jej wcześniej opublikowaną wersję. Wynik musi wskazywać wersję; odczyt historii nie zastępuje jej bieżącym szkicem.

## Acceptance

### REC-AC-001

Sprawdza REC-REQ-002, REC-REQ-003. Administrator zapisuje 500 g, 350 g i 10 g: suma wynosi 860 g. Próby zapisania 0 g, -1 g i wartości nieliczbowej wskazują błędną pozycję i nie zapisują niepoprawnej masy. Publikacja z N=0, N=-1, N=1,5 lub brakiem N jest odrzucona.

### REC-AC-002

Sprawdza REC-REQ-002, REC-REQ-003. Dla 4000 g i N=5 system pokazuje 800 g ciasta na porcję. Jednoczesne pomocnicze wejście 750 g powoduje odmowę publikacji z błędem zgodności; składniki pozostają 4000 g. Przykład nie wybiera tolerancji ani precyzji DEC-001.

### REC-AC-003

Sprawdza REC-REQ-001, REC-REQ-003, REC-REQ-006. Redaktor zapisuje szkic i publikuje v1. API katalogu zwraca v1. Redaktor zmienia masy szkicu v2; katalog nadal zwraca v1, a odczyt historyczny v1 zachowuje masy i uzysk. Nieudana publikacja v2 nie zmienia tego wyniku.

### REC-AC-004

Sprawdza REC-REQ-001, REC-REQ-009, REC-REQ-010. Po publikacji v1 z 1 kg zakwasu o hydracji 100% administrator zmienia w surowcu hydrację, klasyfikację i rodzaj mąki. Odczyt i skalowanie v1 zachowują wkład 0,5 kg mąki/0,5 kg wody, wcześniejszy rodzaj mąki, masy i procenty. Dopiero jawna publikacja v2 może przyjąć nową kompozycję.

### REC-AC-005

Sprawdza REC-REQ-004. Pełny wariant z 500 g mąki i 350 g wody oraz odnośnikiem do bazy o masie 4000 g daje 850 g, nie 4850 g. Wariant oznaczony jako zawierający jedynie 100 g dodatków do tej bazy pozostaje niekompletnym szkicem; publikacja i skalowanie zwracają błąd niekompletności.

### REC-AC-006

Sprawdza REC-REQ-005, REC-REQ-014, REC-REQ-015. Redaktor znajduje „Chleb wiejski” po nazwie; zmiana nazwy powiązanego surowca nie zmienia jego ID ani relacji w recepturze. Eksport zestawu z masami 500 g/350 g zachowuje obie wartości, g i te same relacje; wcześniejszą publikację można nadal odczytać.

### REC-AC-007

Sprawdza REC-REQ-006. Użytkownik bez prawa edycji wysyła zapis bezpośrednio przez API: dostaje odmowę, szkic i publikacja są niezmienione. Użytkownik bez prawa odczytu prywatnej receptury nie otrzymuje jej danych przez listę ani szczegóły API.

### REC-AC-008

Sprawdza REC-REQ-001, REC-REQ-007. Przy trzech dostępnych publikacjach i jednym szkicu katalog pokazuje trzy pozycje. Istniejąca nazwa zwraca właściwą pozycję; nieistniejąca daje pusty stan. Szczegóły pełnej receptury 500 g/350 g pokazują 850 g, opis, wersję i etapy w zapisanej kolejności, bez zmian szkicu.

### REC-AC-009

Sprawdza REC-REQ-007. Przy błędzie pobrania API użytkownik widzi błąd, nie „brak receptur”. Po ponowieniu i skutecznym pobraniu widzi zatwierdzone dane. Niepotwierdzone dane nie są przedstawione jako nowa poprawna wersja.

### REC-AC-010

Sprawdza REC-REQ-002, REC-REQ-008. Dla bazy N=5 i mas 2000/1560/40/400 g wybór 10 daje 4000/3120/80/800 g i 8 kg ciasta; 15 daje 6000/4680/120/1200 g i 12 kg; 20 daje 8000/6240/160/1600 g i 16 kg; 30 daje 12000/9360/240/2400 g i 24 kg. Podsumowanie każdego wyboru pokazuje 800 g na porcję i wybrane T. Dla 10 sztuk woda to 3120 g albo 3,12 kg.

### REC-AC-011

Sprawdza REC-REQ-002, REC-REQ-008, REC-REQ-009, REC-REQ-012. Dla bazy z REC-AC-010 procenty wynoszą 100/78/2/20% dla każdego presetu. Zmiana 10 → 30 → 10 przywraca identyczne masy i procenty; numer wersji i zapis bazy się nie zmieniają. Nie powstaje plan ani partia. Podanie T=20 przez innego odbiorcę tej samej logiki daje ten sam wynik co preset 20.

### REC-AC-012

Sprawdza REC-REQ-009, REC-REQ-010. Dla 20 sztuk po 800 g, 8 kg mąki i udziału pszenna/żytnia 80/20% nagłówek pokazuje 8 kg mąki oraz 16 kg ciasta. Wiersze pokazują 80% i 6,4 kg pszennej oraz 20% i 1,6 kg żytniej; inne składniki mają jednocześnie procent i masę.

### REC-AC-013

Sprawdza REC-REQ-009, REC-REQ-010. Dla 2 kg mąki dodanej osobno i 1 kg zakwasu o hydracji 100% widok pokazuje 2,5 kg mąki łącznie, a do odważenia 2 kg mąki i 1 kg zakwasu. Wewnętrzne 0,5 kg mąki nie tworzy dodatkowej pozycji ważenia ani nie zwiększa ponownie masy partii. Zakwas wnosi również 0,5 kg wody do obliczenia hydracji.

### REC-AC-014

Sprawdza REC-REQ-003, REC-REQ-008, REC-REQ-011. Brak kompozycji 1 kg zakwasu daje komunikat o brakującym wkładzie mąki/wody, bez dokładnej sumy mąki, procentów i hydracji; znane 1 kg do odważenia pozostaje widoczne. Brak N lub pełnych dodatnich mas uniemożliwia skalowanie, a 750 g porcji nie zastępuje N.

### REC-AC-015

Sprawdza REC-REQ-001, REC-REQ-013. Dla późniejszego wariantu z deklarowaną wspólną bazą i dodatkiem redaktor odczytuje pełny skład oraz pochodzenie bazy i dodatku po ponownym otwarciu. Gdy nie określono sposobu kompozycji albo wkładu mąki/wody, system nie przedstawia niekompletnego wariantu jako pełnego ani dokładnej hydracji. Dotychczasowa publikacja samodzielnego wariantu pozostaje niezmieniona. Dowód implementacji tego scenariusza wymaga uprzedniego uzgodnienia wskazanych decyzji rozszerzenia.

## Examples

### REC-EX-001

REC-REQ-002/REC-REQ-008 i REC-AC-010 ustalają przykład: 4000 g / 5 szt. = 800 g; mnożniki 2/3/4/6 dają 8/12/16/24 kg. REC-REQ-009/REC-REQ-010 i REC-AC-013 pokazują, że 1 kg zakwasu 100% wnosi 0,5 kg mąki raz. Są to liczby ilustracyjne, nie wybór trwałej precyzji.

## Dependencies-and-readiness

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | REC-REQ-001 | Katalog i kalkulator korzystają z konkretnej publikacji, nie z bieżącego surowca | start |
| implementation-prerequisite | REC-REQ-003, REC-REQ-006 | Działający zapis/publikacja i dostęp API przed demonstracją katalogu na trwałych danych | demonstration |
| implementation-prerequisite | REC-REQ-007 | Działający katalog przed integracją kontrolek skalowania w katalogu; sama funkcja licząca może być badana osobno | demonstration |
| contract-input | PLN-REQ-001 | Granica zapisu/zatwierdzenia planu; nie blokuje kalkulatora | start |
| optional-adapter | EVT-REQ-012 | Późniejszy odczyt rzeczywistego uzysku i strat, bez zmiany historii | demonstration |
| release-gate | REC-REQ-006 | Kontrole dostępu i ochrony danych według engineering assurance przed danymi rzeczywistymi | release |

DEC-001 pozostaje otwarta: blokuje wybór trwałej reprezentacji mas i walidacji zgodności przy publikacji (REC-REQ-001–003), a następnie zależne utrwalane obliczenia REC-REQ-008–011. Nie blokuje dokumentacji, układu katalogu ani demonstracji dokładnych liczb. Właściciel repozytorium musi wskazać decydenta domenowego; przykłady nie ustalają tolerancji, liczby miejsc ani algorytmu.

Docelowa architektura historycznego #13 i migracja #16 poprzedzają zależne dostarczenie MVP-0: przyszłe zadania zachowują wymaganie wspólnego projektu Next.js/Payload, prawdziwej bazy i zatwierdzonej wersji przez API/Local API. Nie jest to polecenie zmiany obecnego stosu w tej migracji dokumentacji ani wybór wersji/bazy. Dokładne lokalne zadania architektury nadaje integrator, nie ten plik.

[Design system](../design-system.md) jest właścicielem brutalistycznych tokenów, wspólnych komponentów i dostępności katalogu/kalkulatora; nie tworzy się lokalnego motywu. [Engineering assurance](../engineering-assurance.md) zachowuje kontrole dostępu, retencji, wersjonowania, backup/migracji i testu odtworzenia przed rzeczywistymi danymi. Przyszły dowód musi objąć walidację, uprawnienia, listę/pusty stan/szczegóły/błędy API i wszystkie presety. Wygenerowanie panelu ani zatwierdzenie tej specyfikacji nie dowodzi wykonania tych kontroli. REC-REQ-013 wymaga osobnych decyzji rozszerzenia; nie wolno przez nie blokować MVP-0 ani przywracać łańcucha „pełny recorder przed scenariuszem inwestycyjnym”.
