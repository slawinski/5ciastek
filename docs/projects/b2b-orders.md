# B2B — Zamówienie do wydania

Owner [B2B](../specs/b2b-orders.md). [Common task/evidence contract](README.md#task-contract). Ręczna weryfikacja nie czeka na pełną automatyczną ocenę zdolności.

### TASK-B2B-001

**Cel/przepływ:** operator przyjmuje formularz lub e-mail do szkicu, weryfikuje warunki, a uprawniona osoba potwierdza zamówienie; brak danych o zdolności oznacza wykonalność niezweryfikowaną, z udokumentowaną decyzją człowieka. **Coverage:** B2B-REQ-001–005, B2B-REQ-010 / B2B-AC-001–004 (obsługa ręczna), B2B-AC-008. Wejścia: źródło, zamówienie, kontrahent i kontakt, SKU, jednostka, ilość, data i strefa czasu, kontraktowa podstawa ceny, MOQ i okres obowiązywania; wartości pochodzą z umowy, nie z ustawień domyślnych. Opcjonalne AI tylko proponuje pola. Bez solvera lub automatycznej redukcji potwierdzonych zamówień.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [STK-REQ-001](../specs/stock-inventory.md#stk-req-001) | SKU i jawne jednostki | start |
| optional-adapter | [OPT-REQ-001](../specs/optimization.md#opt-req-001), [WRK-REQ-003](../specs/workforce.md#wrk-req-003), [STK-REQ-006](../specs/stock-inventory.md#stk-req-006), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Wybrane dane o zdolności lub dane wejściowe AI, nie warunki blokujące obsługę ręczną | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [B2B-REQ-010](../specs/b2b-orders.md#b2b-req-010) | Uprawnienia do danych kontrahenta i umowy, retencja i minimalizacja danych źródłowych | release |

**State:** not-started. **Decision gates:** [DEC-004](../decisions.md#dec-004) dotyczy tylko automatycznego rozpoznawania duplikatu między kanałami, nie ręcznego szkicu lub weryfikacji; cykl obsługi częściowego wydania nie jest bramką tego zadania. **Readiness:** umowa źródłowa wybierana w planie, normatywne walidacje znane. **Proof:** dla umowy 8 PLN netto i MOQ 20, pozycja 10 szt. za 7 PLN z nieznanym SKU nie przechodzi walidacji, a poprawne 30 przechodzi. Szkic nie oznacza potwierdzenia; przy braku zdolności ręczna decyzja zachowuje oznaczenie niezweryfikowanej wykonalności. Potwierdzone 50 pozostaje bez zmian, gdy nowe 30 przekracza pozostałe 20; odmowa lub przekroczenie czasu oczekiwania nie oznaczają sukcesu. Dowody: brak.

### TASK-B2B-002

**Cel/przepływ:** operator przegląda historię duplikatów, zmian i anulacji, ponownie weryfikuje zmienione zlecenie, przekazuje wersję do PLN, rejestruje produkcję, kompletację i wydanie oraz odczytuje dokument lub eksport z rzeczywistymi ilościami. **Coverage:** B2B-REQ-003, B2B-REQ-006–008 / B2B-AC-003 (PLN), B2B-AC-005–006. Wejścia: uzgodniona tożsamość duplikatu, wybory dotyczące zmian po potwierdzeniu i wydaniu oraz częściowego zamknięcia; formaty dokumentów zatwierdzone dla konkretnego odbiorcy. Bez własnej księgowości, kasowania zobowiązań lub fikcyjnego ruchu magazynowego.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-B2B-001](#task-b2b-001), [TASK-PLN-001](production-planning.md#task-pln-001) | Działające potwierdzenie i rzeczywiste przekazanie do szkicu | demonstration |
| contract-input | [STK-REQ-001](../specs/stock-inventory.md#stk-req-001), [STK-REQ-002](../specs/stock-inventory.md#stk-req-002) | Wydanie i źródło z rozróżnieniem znaczenia fizycznego i handlowego | start |
| release-gate | [B2B-REQ-010](../specs/b2b-orders.md#b2b-req-010), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Uprawnienia, historia, eksport i ograniczenie zakresu danych | release |

**State:** blocked. **Decision gates:** DEC-004 przy trwałej tożsamości duplikatu między kanałami, [DEC-005](../decisions.md#dec-005) przy zmianach po produkcji lub wydaniu i częściowym zamknięciu. **Readiness:** wyniki zwykłej historii, ponownej weryfikacji i różnic są znane; nieznanych przejść nie implementować arbitralnie. **Proof:** to samo K/123 wskazuje istniejący zapis, niezależne zamówienie 30 szt. pozostaje zachowane; 30→35 wymaga nowej weryfikacji z zachowaniem starej akceptacji. Anulacja nie usuwa zamówienia; 30 zamówionych, 28 wydanych i 2 różnicy pozostają widoczne. Kompletacja, wydanie i eksport do fakturowania uwzględniają rzeczywiste 28 oraz wersję, bez automatycznego zamknięcia. Dowody: brak.

### TASK-B2B-003

**Cel/przepływ:** osoba weryfikująca uruchamia oddzielne sprawdzenia ludzi, produkcji i materiałów; właściciel odczytuje raport marży i terminowości per klient oraz czasu obsługi, pomyłek i wyników kanału. **Coverage:** B2B-REQ-004–005, B2B-REQ-009 / B2B-AC-003–004, B2B-AC-007. Wejścia: zakres, data i wersja każdego źródła, marża z ECO oraz rzeczywiste czasy transakcji i wydania; początek i koniec obsługi oraz rejestr pomyłek pochodzą z ograniczonego planu zadania, nie z nowej globalnej DEC.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-B2B-001](#task-b2b-001) | Istniejące zamówienie i weryfikacja przed połączoną demonstracją | demonstration |
| implementation-prerequisite | [TASK-OPT-001](optimization.md#task-opt-001), [TASK-WRK-001](workforce.md#task-wrk-001), [TASK-OPS-003](operational-balances.md#task-ops-003) | Tylko pełne automatyczne sprawdzenia odpowiednich zakresów przy wydaniu | release |
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [SAL-REQ-001](../specs/sales-returns.md#sal-req-001) | Historyczne źródła kosztów i handlu z określoną kwalifikacją mogą być dostarczone ręcznie | start |
| optional-adapter | [WRK-REQ-017](../specs/workforce.md#wrk-req-017) | Rekomendacje nie są bramką | demonstration |

**State:** not-started. **Decision gates:** DEC-002 tylko dla trwałego adaptera rzeczywistych danych; brak nowej DEC dotyczącej metryk. **Readiness:** rzeczywiste źródła są potrzebne do potwierdzenia wyników, wcześniej możliwe dane testowe. **Proof:** każde źródło ma datę i stan; zmiana terminu unieważnia sprawdzenie. 240−150=90 PLN według podstawy ECO, 06:00→06:15 daje spóźnienie 15; brak kosztów lub czasu nie oznacza 0 ani wykonania na czas. Czas obsługi, pomyłki i marża kanału zachowują kwalifikację. Dowody: brak.
