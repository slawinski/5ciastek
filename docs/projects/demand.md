# DEM — Popyt i rekomendacje

Owner [DEM](../specs/demand.md). [Common task/evidence contract](README.md#task-contract). Niezależny projekt po uzyskaniu danych, nie bramka wyliczenia wymaganej sprzedaży INV. Wybory metod i wejść zakwalifikowano w [klasyfikacji decyzji](../decisions.md#request-classification); prośby o rejestrację zawarte w specyfikacji nie oznaczają automatycznie nowych globalnych blokad.

### TASK-DEM-001

**Cel/przepływ:** analityk wczytuje godzinowe dane sprzedaży, niedostępności i cech według SKU, z pochodzeniem i momentem dostępności danych. Odczytuje szereg umożliwiający audyt, z rozróżnieniem okresów ocenzurowanych, nieocenzurowanych i braków. **Coverage:** DEM-REQ-001 / DEM-AC-001. Wejścia: daty i strefa czasu, stabilne SKU i pola źródłowe; bez wyboru modelu prognozy.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [SAL-REQ-001](../specs/sales-returns.md#sal-req-001), [SAL-REQ-004](../specs/sales-returns.md#sal-req-004), [STK-REQ-002](../specs/stock-inventory.md#stk-req-002) | Sprzedaż, niedostępność i fizyczne zwroty nie określają pełnego popytu | start |
| implementation-prerequisite | [TASK-OPS-001](operational-balances.md#task-ops-001) | Rzeczywisty szereg do wydania na rzeczywistych danych albo zgodne, niezależne źródło rzeczywistych danych | release |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Minimalizacja danych, dostęp i kwalifikacja źródła | release |

**State:** not-started. **Readiness:** kontrakt określony; mapowanie źródła i kwalifikacja okresów należą do planu, rzeczywiste dane są niezweryfikowane. **Decision gates:** brak nowej DEC. **Proof:** 20 sprzedanych sztuk i 120 min niedostępności nie oznaczają popytu 20 ani zerowej utraconej sprzedaży; brak pogody pozostaje brakiem. Sprawdzić niepoprawny okres, filtrowanie według uprawnień i błąd źródła. Dowody: brak.

### TASK-DEM-002

**Cel/przepływ:** planista wybiera historię, odczytuje dzienną rekomendację, niepewność, partie i godziny, zapisuje uzasadnioną korektę i porównuje oryginał oraz korektę z rzeczywistą sprzedażą, odpadami i niedostępnością. **Coverage:** DEM-REQ-002, DEM-REQ-006, DEM-REQ-008, DEM-REQ-010 / DEM-AC-002, DEM-AC-006 (propozycja), DEM-AC-007. Bez automatycznej zmiany planu lub grafiku i bez deklarowania skuteczności ML.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-DEM-001](#task-dem-001) | Szereg z określoną kwalifikacją danych | demonstration |
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [ECO-REQ-011](../specs/economics-investment.md#eco-req-011) | Oznaczenia kosztów i podstawa źródłowa; brak kosztu ogranicza tylko ocenę ekonomiczną | demonstration |
| release-gate | [DEM-REQ-005](../specs/demand.md#dem-req-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Rzeczywiste dane przed twierdzeniami empirycznymi; dowody, prywatność i UI | release |

**State:** not-started. **Readiness:** metoda średniej albo mediany, porównywalność dni, adekwatność danych i niepewność muszą być jawnie wybrane i odtwarzalne w ograniczonym planie zadania; źródło nie nakazuje jednego uniwersalnego progu. **Decision gates:** brak nowej DEC. **Proof:** mediana 10/14/18=14 z listą dni; brak porównywalnej historii daje brak podstaw, nie 0. Korekta 30→34 zachowuje powód, rzeczywisty wynik 31/3/0 i oryginał; sprawdzić odmowę nieuprawnionej korekty. Niepotwierdzone godziny są nazwane propozycją. Dowody: brak.

### TASK-DEM-003

**Cel/przepływ:** planista przekazuje datowaną propozycję dodatniej całkowitej liczby sztuk do skalowania i jawnie przyjmuje ilości oraz terminy do szkicu PLN. Ręczna datowana propozycja może być wejściem bez pełnego modelu prognostycznego. **Coverage:** DEM-REQ-007, DEM-REQ-009 / DEM-AC-006 (skalowanie), DEM-AC-008.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-005](recipes.md#task-rec-005), [TASK-PLN-001](production-planning.md#task-pln-001) | Działające przekazanie do skalowania i szkicu, nie samo liczenie wyniku metody bazowej | demonstration |
| optional-adapter | [WRK-REQ-017](../specs/workforce.md#wrk-req-017) | Informacja zwrotna o obsadzie, nie warunek blokujący | demonstration |
| release-gate | [DEM-REQ-009](../specs/demand.md#dem-req-009) | Wybór człowieka, uprawnienia i brak automatycznej publikacji | release |

**State:** not-started. **Decision gate:** DEC-001 tylko na granicy utrwalanego skalowania. **Readiness:** kontrakt znany, dostawcy danych niezweryfikowani. **Proof:** 30 korzysta ze skalowania REC raz; 0 nie tworzy partii; 2,5 lub brak mapowania daje błąd. Przyjęcie dotyczy tylko szkicu; odmowa użytkownikowi nie zmienia danych, grafiki i potwierdzone B2B pozostają bez zmian. Dowody: brak.

### TASK-DEM-004

**Cel/przepływ:** analityk porównuje metodę bazową i kandydata w ocenie kroczącej oraz osobnym teście, uwzględniając koszt odpadów i niedostępności oraz błąd dla okresów nieocenzurowanych; pozostawia metodę bazową, jeżeli nie wykazano przewagi na danych produkcyjnych. **Coverage:** DEM-REQ-003–005 / DEM-AC-003–005. Wejścia: granice zbiorów uczącego i testowego, historia i dostępność cech, jawny cel, podstawa kosztów i zasady kwalifikacji, nie wymyślone minimum historii, MAE ani wagi. Dodatkowe modele statystyczne lub ML są dopuszczalne tylko warunkowo.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-DEM-001](#task-dem-001) | Wiarygodna seria i dostępność cech | demonstration |
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [ECO-REQ-011](../specs/economics-investment.md#eco-req-011) | Jawne koszty strat/niedostępności | start |
| release-gate | [DEM-REQ-005](../specs/demand.md#dem-req-005) | Ocena na danych produkcyjnych i zadeklarowane kryterium przed zastosowaniem modelu lub deklaracją trafności | release |

**State:** not-started. **Readiness:** rezultat określony; reguła, metoda i podstawa oceny muszą być zapisane przed pomiarem i zweryfikowane przez odbiorcę, nie stanowią uniwersalnej globalnej DEC. **Decision gates:** brak nowej. **Proof:** brak przecieku przyszłej pogody lub sprzedaży do uczenia i doboru parametrów; odłożony test pozostaje oddzielony. Porównanie 16 wobec 10 PLN zachowuje kwalifikację utraconej sprzedaży; niższy MAE bez przewagi kosztowej nie wybiera ML, brak źródła lub kosztu nie oznacza 0. Dowody: brak.
