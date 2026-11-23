# KoPieC OS — zasady pisania wymagań

## Zastosowanie

- **Specyfikacja zdolności:** utrzymuj reguły u jednego właściciela wskazanego w [rejestrze specyfikacji](specs/README.md#capability-registry). Łącz lub dziel materiał według zdolności i wspólnych kontraktów, nie granic dawnych Issue. Każda zdolność, także z późniejszego etapu, musi spełniać ten sam poziom kompletności i sprawdzalności analizy biznesowej.
- **Plan produktu:** opisuj cele, zakres, MVP, KPI i powiązania prostym językiem. `docs/product-plan.md` jest jedynym przeglądem portfela; odsyła do projektów, ale nie powiela zmiennego stanu zadań.
- **Zadanie implementacyjne:** zapisz je w pliku projektu w `docs/projects/`, zgodnie z [konwencjami zadań](specs/README.md#project-and-task-conventions). Opisz jeden spójny, ograniczony przepływ od wejścia do wyniku, który można niezależnie zademonstrować, a nie samą warstwę techniczną. Zadanie może obejmować kilka atomowych wymagań; liczba czasowników nie wyznacza jego granicy. Nie twórz osobnego pliku dla każdego zadania ani drugiego rejestru na GitHubie.
- **Instrukcja pracy / procedura:** zapisz kroki w kolejności wykonywania; dla każdej czynności podaj wykonawcę i wynik.

Stosuj zasady *inspirowane* ASD-STE100. ASD-STE100 dotyczy kontrolowanego języka angielskiego. Dokument w języku polskim nie może zostać uznany za formalnie zgodny ze standardem.

## Język i źródła reguł

- Specyfikacje biznesowe, kryteria akceptacji, przykłady i tekst interfejsu aplikacji zapisuj po polsku. Nowe wytyczne inżynierskie i identyfikatory zapisuj po angielsku; nie tłumacz identyfikatorów ani nazw w kodzie. Ten polski poradnik opisuje redagowanie treści biznesowej; techniczny rejestr i konwencje są w [specs/README.md](specs/README.md).
- Utrzymuj jeden [słownik dwujęzyczny](domain/glossary.md): polskie definicje z angielskimi nazwami pojęć, bez równoległych tłumaczeń wymagań. [Przykłady referencyjne](reference-examples.md) i [otwarte decyzje](decisions.md) odsyłają do właściciela reguły i nie zastępują jego wymagań.
- Kanoniczne specyfikacje w repozytorium określają zachowanie. Pliki projektów/zadań w repozytorium są jedynym rejestrem realizacji. GitHub Issue, jego stan i komentarze są źródłem historycznym, nie aktualnym kontraktem ani dowodem ukończenia. Nie synchronizuj dwóch rejestrów. [Archiwum źródeł](migrations/spec-library/source-baseline.json) jest historyczne i nienormatywne.
- Wspólna reguła ma jednego właściciela; konsumenci wskazują jego identyfikator zamiast kopiować regułę. Rejestr ustala 16 prefiksów, pliki oraz zastrzeżone wspólne ID. Przykład nie zmienia kryterium akceptacji, propozycja nie staje się obowiązkiem, a opcjonalna sugestia nie staje się warunkiem startu.
- Używaj `PREFIX-REQ-NNN`, `PREFIX-AC-NNN`, `PREFIX-EX-NNN` i jawnych nagłówków ASCII, np. `### REC-REQ-001`. Numeruj rosnąco w obrębie prefiksu i rodzaju; nie zmieniaj ani nie używaj ponownie ID. Po wycofaniu lub podziale pozostaw odsyłacz do następców. Dawne `#17 AC-01` służy wyłącznie identyfikacji źródła w mapowaniu, nie odwołaniu do nowego kontraktu.
- Decyzje mają ID `DEC-NNN` w `docs/decisions.md`. `DEC-001` (utrwalana precyzja/zaokrąglanie masy) i `DEC-002` (tożsamość, kolejność i odtwarzanie strumienia) pozostają otwarte. Nie rozstrzygaj ich przykładem, formatowaniem UI ani izolowanym fixture. Blokują tylko zależną pracę na wskazanej granicy; właściciel repozytorium musi jeszcze wskazać decydenta domenowego.
- [Indeks dokumentacji](index.md) opisuje aktualny stos; nie traktuj starszych odwołań do Issue jako przywrócenia ich nadrzędności. [Design system](design-system.md) i [engineering assurance](engineering-assurance.md) zachowują zakresy zasad. Zastępuj powtarzany tekst odsyłaczem dopiero po rozliczeniu każdego istotnego obowiązku; opis kontroli nie dowodzi jej zainstalowania, wykonania ani certyfikacji.

## Znaczenie powiązań

W sekcji zależności podaj typ, lokalny docelowy ID, zakres, warunek i fazę: `start`, `demonstration` albo `release`. Ten sam cel może pełnić kilka ról, jeżeli ich zakresy są jawne. Odwołanie historyczne do Issue nie zastępuje lokalnego celu.

| Typ | Znaczenie |
|---|---|
| **Rodzic (parent)** | Określa zakres funkcji nadrzędnej; nie oznacza, że wszystkie jej dzieci muszą być gotowe przed rozpoczęciem zadania. |
| **Kontrakt wejściowy (contract-input)** | Uzgodnione dane lub interfejs, z którym zadanie musi być zgodne; sam kontrakt nie wymaga gotowej implementacji dostawcy. |
| **Warunek implementacyjny (implementation-prerequisite)** | Zaimplementowane zachowanie niezbędne dla wskazanego wycinka; podaj fazę i warunki blokady. |
| **Adapter opcjonalny (optional-adapter)** | Rozszerza wycinek o integrację; nie blokuje jego samodzielnej demonstracji bez tej integracji. |
| **Warunek wydania (release-gate)** | Ogranicza użycie na określonych danych lub etapie wydania; demonstracja syntetyczna nie dowodzi spełnienia tego warunku. |

Oddziel warunki rozpoczęcia, demonstracji i wydania. Tylko rzeczywiste warunki implementacyjne tworzą blokujący graf zadań; decyzje są odrębnymi bramkami, nie sztucznymi zadaniami poprzedzającymi. Nie zamieniaj opcjonalnych integracji w cykliczne warunki rozpoczęcia ani nie usuwaj obowiązków integracyjnych rodzica.

## Zasady dla specyfikacji implementacyjnej

1. **Jeden wymóg = jedno zachowanie.** Nie łącz niezależnych funkcji spójnikami „i” lub „oraz”.
2. **Określ wykonawcę i działanie.** Stosuj „System musi…” do wymagań obowiązkowych, „System nie może…” do zakazów. Unikaj „należy”, „w miarę możliwości”, „odpowiednio”, „intuicyjnie”.
3. **Podaj warunek i rezultat.** Powiedz, kiedy działanie ma wystąpić, jakie dane system ma przyjąć i co ma zwrócić albo zapisać.
4. **Zdefiniuj jednostki i granice.** Podawaj konkretne wartości, strefę czasową, format danych, przyjęte reguły zaokrąglania i zachowanie dla wartości zerowych, jeśli są istotne. Jeżeli reguła nie została przyjęta, wskaż otwartą decyzję zamiast wymyślać odpowiedź.
5. **Używaj jednego terminu dla jednego pojęcia.** Np. „SKU”, „partia ciasta”, „wsad pieca” i „brak produktu” oznaczają różne rzeczy. Nie zamieniaj terminów bez definicji.
6. **Oddziel wymaganie od rozwiązania technicznego.** „System musi zapisać czas…” to wymaganie. Baza danych, event bus czy framework są propozycją implementacji, jeśli nie stanowią świadomego ograniczenia architektonicznego.
7. **Zapisz osobne kryteria akceptacji.** Weryfikuj przypadek poprawny, błąd, granicę oraz uprawnienia — jeśli dotyczą zadania. Każde AC wskazuje dokładne ID sprawdzanych wymagań, konkretny stan/wejście, działanie i obserwowalny wynik. Każdy przykład wskazuje swoje REQ/AC; liczby ilustracyjne nie ustanawiają parametrów domeny. „Działa poprawnie” nie jest kryterium.
8. **Podaj, co nie należy do zadania.** Zapobiega to rozbudowie zakresu podczas implementacji.
9. **Zdefiniuj źródło prawdy.** Zapisz, skąd pochodzą wejściowe dane i gdzie widoczny jest wynik.
10. **Nie zmieniaj po cichu znaczenia istniejących danych.** Migracja, wersje receptur i historyczne ceny wymagają jawnych reguł.
11. **Opisz pełny kontrakt zdolności.** Przed regułami podaj aktorów, zakres, wejścia/wyjścia i jednostki, źródła danych, cykl życia, przejścia i niezmienniki. Uwzględnij istotne uprawnienia, nieprawidłowe wejścia, brak/nieaktualność danych, ponowienia, konflikty i wyniki błędów. Gdy pole rzeczywiście nie dotyczy zdolności, podaj krótkie uzasadnienie, nie wypełniacz. Późniejszy etap nie uzasadnia niższej jakości.

## Zadania i dowody realizacji

- Zadanie ma stabilny ID `TASK-PROJECT-NNN` i jawny nagłówek ASCII, np. `### TASK-INV-001`. Klucze projektów określa rejestr. Przeniesienie zadania nie zmienia ID; w poprzednim miejscu pozostaw przekierowanie.
- Zapisz cel/aktora, ograniczony przepływ, pokrywane kanoniczne REQ/AC, wejścia, wyłączenia, typowane zależności, bramki decyzyjne, stan implementacji, osobną ocenę gotowości oraz odsyłacze do dowodów.
- Stan implementacji to `not-started`, `in-progress`, `blocked` albo `done`. Początkowo użyj `not-started`, chyba że dowody z repozytorium wskazują inaczej. Niezweryfikowany spis implementacji nie dowodzi braku wszystkich funkcji. `blocked` wskazuje rzeczywistą niespełnioną zależność/decyzję. `done` wymaga identyfikacji artefaktu/PR/commitu, wyników właściwych sprawdzeń i daty.
- Gotowość specyfikacji opisuje kompletność kontraktu i otwarte decyzje. Osobno opisz spełnione i niespełnione warunki startu, demonstracji i wydania zadania. Gotowa specyfikacja może dotyczyć zablokowanego zadania; demonstracja syntetyczna nie jest zgodą na wydanie na rzeczywistych danych. Zatwierdzenie dokumentu nie oznacza `done` implementacji.
- W kanonicznych zależnościach i mapowaniu stosuj stabilne, kwalifikowane ID, nie tymczasowe etykiety robocze. Stan zadań pozostaje wyłącznie w sekcjach zadań w plikach projektów.

## Zachowanie źródeł podczas migracji

Przy audycie migracji stosuj [protokół pokrycia źródeł](specs/README.md#source-coverage-protocol) i [rejestr migracji](migrations/spec-library/coverage.md), nie dawny przydział jednostek autorskich jako bieżący proces pracy. Klucz źródła identyfikuje Issue, treść główną lub tożsamość komentarza, ścieżkę nagłówków, wystąpienie i numer elementu/akapitu, dawne ID, krótki cytat oraz hash treści. Sam numer Issue, lista ID lub nazwa pliku nie wystarcza.

Rozlicz także cele, listy prac, zależności, reguły bez numerów, kontrole, MVP/KPI/DoD i pełne komentarze. Każdy blok ma dokładny cel kanoniczny albo jawne uzasadnienie zachowania, podziału, scalenia, zastąpienia lub nienormatywności, z rolą źródła i wynikiem przeglądu. Wspólne bloki zachowaj raz u właściciela. Stare opisy z komentarzy porównaj pod kątem nadal istotnych obowiązków; nie przywracaj ich automatycznie jako bieżących instrukcji. Nowe zatwierdzone zmiany mapuj jako zmiany, nie jako rzekomą dawną treść Issue.

## Przykład redakcyjny — sprzedaż i braki

Poniższy przykład ilustruje atomowe warunki i wyniki, nie ustanawia kontraktu SAL, nie przydziela jego ID ani nie jest kopią normatywnej specyfikacji. Kanoniczne reguły to [SAL-REQ-004](specs/sales-returns.md#sal-req-004) i [SAL-AC-003](specs/sales-returns.md#sal-ac-003); historycznym punktem wyjścia jest #4.

### Zbyt ogólnie

> Obsłużyć braki produktów na półce i rejestrować ich czas.

### Precyzyjniej — zadanie implementacyjne

**Cel:** zapisać czas rozpoczęcia braku produktu.

**Słownik:**
- *Brak produktu* — stan dostępny do sprzedaży równy 0 szt.
- *Czas braku* — czas rozpoczęcia aktualnego okresu niedostępności.
- *SKU* — identyfikator produktu używany w systemie sprzedaży.

**Wymagania:**
- **Reguła A:** Gdy stan dostępny SKU zmieni się z wartości większej od 0 na 0, system musi zapisać datę i godzinę rozpoczęcia braku produktu.
- **Reguła B:** System musi powiązać zapis braku z właściwym SKU.
- **Reguła C:** Jeżeli stan SKU wynosi 0 i nie zmienił się, system nie może tworzyć kolejnego zapisu rozpoczęcia tego samego braku.

**Kryteria akceptacji:**
- **Sprawdzenie A (reguły A, B):** Dla SKU A stan zmienia się z 1 na 0 o 08:15. Po przetworzeniu zmiany powstaje jeden zapis braku SKU A z czasem 08:15.
- **Sprawdzenie B (reguła C):** Dla SKU A stan pozostaje równy 0. Po ponownym odczycie tego samego stanu drugi zapis braku nie powstaje.
- **Sprawdzenie C (warunek reguły A):** Dla SKU B stan zmienia się z 2 na 1. Po przetworzeniu zmiany nie powstaje zapis braku.

**Poza zakresem:** prognoza popytu i wyznaczanie wielkości produkcji.

> Przykład zakłada wiarygodny sygnał stanu magazynowego. W prawdziwym zadaniu trzeba jeszcze ustalić źródło zdarzeń i reguły korekty stanu; nie należy dopowiadać ich na podstawie tego przykładu.

## Kontrola jakości przed implementacją

- [ ] Każdy wymagany rezultat można sprawdzić testem lub obserwacją.
- [ ] Wszystkie użyte terminy mają znane znaczenie.
- [ ] Warunki błędne i graniczne są określone, jeżeli mają znaczenie.
- [ ] Nie ma sprzecznych wymagań lub zależności.
- [ ] Ustalono dane wejściowe, źródło prawdy i uprawnienia.
- [ ] Zadanie jest wystarczająco małe do wykonania i przetestowania niezależnie.
- [ ] AC wskazują dokładne REQ, a przykłady wskazują swoje REQ/AC; odsyłacze mają stabilne, kwalifikowane ID.
- [ ] Każdy istotny blok źródła i każda kontrola mają rozliczone pokrycie lub uzasadnioną dyspozycję; wspólne reguły nie mają konkurujących właścicieli.
- [ ] Otwarte decyzje i gotowość start/demo/release są odrębne od stanu implementacji; żaden stan Issue ani akceptacja dokumentacji nie zastępuje dowodów wykonania.
