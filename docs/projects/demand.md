# DEM — Popyt i rekomendacje

Owner [DEM](../specs/demand.md). [Common task/evidence contract](README.md#task-contract). Niezależny projekt po danych, nie bramka wymaganej sprzedaży INV. Wybory metod/wejść zakwalifikowano w [decision classification](../decisions.md#request-classification); specowe prośby o rejestrację nie oznaczają automatycznie nowych globalnych blokad.

### TASK-DEM-001

**Cel/przepływ:** analityk ładuje hourly SKU sales/stockout/features z pochodzeniem i momentem dostępności i odczytuje audytowalną serię censored/noncensored/braki. **Coverage:** DEM-REQ-001 / DEM-AC-001. Inputs: daty/strefa, stable SKU i source fields; bez wyboru forecast modelu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [SAL-REQ-001](../specs/sales-returns.md#sal-req-001), [SAL-REQ-004](../specs/sales-returns.md#sal-req-004), [STK-REQ-002](../specs/stock-inventory.md#stk-req-002) | Sprzedaż/stockout i fizyczne zwroty nie pełny popyt | start |
| implementation-prerequisite | [TASK-OPS-001](operational-balances.md#task-ops-001) | Rzeczywista seria do actual-data release, lub zgodne niezależne rzeczywiste źródło | release |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Minimalizacja/access/source qualification | release |

**State:** not-started. **Readiness:** contract specified; source mapping/period qualification w planie, actual data niezweryfikowane. **Decision gates:** brak nowej DEC. **Proof:**20sales/120min unavailable ≠ demand20/zero lost sales;missing weather missing;invalid period/access filtering/source error. Evidence: brak.

### TASK-DEM-002

**Cel/przepływ:** planista wybiera historię, czyta daily recommendation/uncertainty/partie/godziny, zapisuje uzasadnioną korektę i porównuje oryginał/korektę z actual sales/waste/stockout. **Coverage:** DEM-REQ-002, DEM-REQ-006, DEM-REQ-008, DEM-REQ-010 / DEM-AC-002, DEM-AC-006 (propozycja), DEM-AC-007. Bez automatycznej zmiany planu/grafiku i bez ML performance claim.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-DEM-001](#task-dem-001) | Qualified series | demonstration |
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [ECO-REQ-011](../specs/economics-investment.md#eco-req-011) | Cost labels/source basis, missing cost ogranicza tylko ekonomię | demonstration |
| release-gate | [DEM-REQ-005](../specs/demand.md#dem-req-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Prawdziwe dane before empirical claims, dowody/privacy/UI | release |

**State:** not-started. **Readiness:** metoda mean/median, porównywalność dni/adequacy/uncertainty muszą być jawnie wybrane i odtwarzalne w bounded planie; źródło nie nakazuje jednego uniwersalnego progu. **Decision gates:** brak nowej DEC. **Proof:**median10/14/18=14 z listą dni; no comparable history → no basis nie0;30→34 z powodem i actual31/3/0, oryginał zachowany; denied override; niepotwierdzone godziny nazwane propozycją. Evidence: brak.

### TASK-DEM-003

**Cel/przepływ:** planista przekazuje datowaną positive integer propozycję do skalowania i jawnie przyjmuje ilości/terminy do szkicu PLN. Manual dated proposal może być wejściem bez pełnego predyktora. **Coverage:** DEM-REQ-007, DEM-REQ-009 / DEM-AC-006 (scaling), DEM-AC-008.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-005](recipes.md#task-rec-005), [TASK-PLN-001](production-planning.md#task-pln-001) | Real scaling/draft handoff, nie samo liczenie baseline | demonstration |
| optional-adapter | [WRK-REQ-017](../specs/workforce.md#wrk-req-017) | Staffing feedback, nie blocker | demonstration |
| release-gate | [DEM-REQ-009](../specs/demand.md#dem-req-009) | Human choice/permission/no auto publish | release |

**State:** not-started. **Decision gate:** DEC-001 tylko persisted scaling boundary. **Readiness:** contract known, providers unverified. **Proof:**30 uses REC once;0 no batch;2,5/missing mapping error;accept draft only;denied user no change, shifts/confirmed B2B unchanged. Evidence: brak.

### TASK-DEM-004

**Cel/przepływ:** analityk porównuje baseline/kandydata w walk-forward i osobnym teście, koszt odpadów/unavailability i noncensored error; pozostawia baseline bez wykazanej przewagi na danych produkcyjnych. **Coverage:** DEM-REQ-003–005 / DEM-AC-003–005. Inputs: training/test boundaries, history/feature availability, jawny objective/cost basis i zasady qualification, nie wymyślone minimum history/MAE/wagi. Dodatkowe statystyczne/ML modele tylko warunkowo.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-DEM-001](#task-dem-001) | Wiarygodna seria i dostępność cech | demonstration |
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [ECO-REQ-011](../specs/economics-investment.md#eco-req-011) | Jawne koszty strat/niedostępności | start |
| release-gate | [DEM-REQ-005](../specs/demand.md#dem-req-005) | Production evaluation i declared criterion przed modelem/accuracy claim | release |

**State:** not-started. **Readiness:** outcome fixed; evaluation rule/method/basis musi być zapisana przed pomiarem i zweryfikowana przez odbiorcę, nie uniwersalna global DEC. **Decision gates:** brak nowej. **Proof:**no future weather/sales/parameter leakage;held-out test oddzielony;16 vs10PLN z kwalifikacją lost sales;lower MAE bez cost advantage nie wybiera ML, absent source/cost not0. Evidence: brak.
