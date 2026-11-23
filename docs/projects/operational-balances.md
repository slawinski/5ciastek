# OPS — Bilans i ekonomia rzeczywistej działalności

Owners [SAL](../specs/sales-returns.md), [STK](../specs/stock-inventory.md), [ECO](../specs/economics-investment.md). [Task/evidence contract](README.md#task-contract). Żaden cały projekt OPS nie jest bramką manual INV.

### TASK-OPS-001

**Cel/przepływ:** operator mapuje stabilne SKU, importuje jedno źródło API/webhook albo CSV dla lokalizacji/tygodnia, rozpoznaje accepted/duplicate/error/conflict; osobno zapisuje refund/physical return/waste/stockout i czyta daily/hourly/weekly completeness. Bounded przepływ obejmuje użyty movement acceptance, nie oczekiwanie na cały magazyn.

**Coverage:** SAL-REQ-001–008 / SAL-AC-001–006; STK-REQ-001–004, STK-REQ-014, STK-REQ-016 / STK-AC-001–003, STK-AC-009, STK-AC-011. Inputs: source transaction identity/gross-net semantics, timezone/location/szt/PLN/channel, opening/actual production/movements/trade hours. Nie zgadywać dekompozycji netto, utraconego popytu ani customer identity.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [STK-REQ-001](../specs/stock-inventory.md#stk-req-001), [SAL-REQ-002](../specs/sales-returns.md#sal-req-002), [REC-REQ-001](../specs/recipes.md#rec-req-001) | Selected source identity and shared balance acceptance implemented in flow | start |
| optional-adapter | [EVT-REQ-011](../specs/production-records.md#evt-req-011), [B2B-REQ-008](../specs/b2b-orders.md#b2b-req-008) | Actual source tylko jeśli wybrany, ręczne kompatybilne fakty dozwolone | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Minimalizacja/permissions, source-error/retry evidence | release |

**State:** not-started. **Decision gates:** DEC-001 dla persisted mass, DEC-002 tylko event adapter. **Readiness:** wybrać źródło/tożsamość/konwersje przed implementation; kontrakt known. **Proof:**10+20−15=15; return2 →physical17/saleable15, waste →15 raz, refund bez ruchu; duplicate raz;2hstockout;80%complete days gaps visible; denied/error not success. Evidence: brak.

### TASK-OPS-002

**Cel/przepływ:** właściciel prześledza koszt rzeczywistego SKU: historical recipe/prices, ilości/sprzedaż/pracę i podział, packaging/energy, marże/fixed/cash oraz porównanie z księgowością i plan/actual workforce tej samej podstawy/okresu.

**Coverage:** ECO-REQ-001, ECO-REQ-003–006, ECO-REQ-011, ECO-REQ-017–018 / ECO-AC-001–003, ECO-AC-006, ECO-AC-013–015. Inputs: historyczne dostawy, stawki/metoda energii, reconciled allocation/accounting. Praca właściciela nie free; economic value nie automatyczna cash wage. Bez własnej księgowości/payroll.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPS-001](#task-ops-001) | Actual quantities/commerce dla wybranego SKU, lub niezależnie dostarczone zgodne źródło rzeczywiste; nie wszystkie OPS/OBS | demonstration |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [ECO-REQ-001](../specs/economics-investment.md#eco-req-001), [WRK-REQ-001](../specs/workforce.md#wrk-req-001) | Historyczne wartości i brak podwójnej pracy | start |
| optional-adapter | [EVT-REQ-006](../specs/production-records.md#evt-req-006), [WRK-REQ-012](../specs/workforce.md#wrk-req-012) | Actual operation/attendance tylko użyte w selected costing | demonstration |
| release-gate | [ECO-REQ-017](../specs/economics-investment.md#eco-req-017) | Wrażliwe ceny/raport, no false success | release |

**State:** not-started. **Decision gates:** DEC-001/002 wyłącznie dependent persisted integrations. **Readiness:** exactness wymaga sources/allocation/same-period basis. **Proof:**30min50/50=15+15/30PLN przy60PLN/h nie drugi WorkSession cost; historical40PLN,2estimated vs3measuredkWh;140gross/100contribution/50fixed/cash independently;accounting difference100;planned300 vsactual360=+60,owner5h×60=300value nie wage/free. Evidence: brak.

### TASK-OPS-003

**Cel/przepływ:** magazynier przyjmuje lot, zapisuje użycie/stratę/transfer, wybiera FEFO usable i śledzi źródła/stany; właściciel czyta krótką przydatność/shortage/stock value/writeoff/purchasing effort.

**Coverage:** STK-REQ-001–006, STK-REQ-013–016 / STK-AC-001–005, STK-AC-009–011. Inputs: lot/ingredient/location/expiry/price, movement identity/time, explicit unit conversion, usable state i alert threshold. Brak threshold nie usuwa znanej expiry. Bez solvera/forecast/MRP jako start blockers.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [STK-REQ-004](../specs/stock-inventory.md#stk-req-004) | Receptury, tożsamość ruchu i jednostki | start |
| optional-adapter | [EVT-REQ-011](../specs/production-records.md#evt-req-011) | Recorder nie obowiązkowe źródło przyjęć magazynowych | demonstration |
| release-gate | [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | History/migration/recovery/access | release |

**State:** blocked. **Decision gate:** DEC-001 trwała masa/zgodność; DEC-002 tylko zależne events. **Readiness:** fixture możliwy, persistent mass granica open. **Proof:**20−19,5−0,5=0/excess rejected;12+8 identity/merge origins,kg≠piece;FEFO5A+1B excludes expiredC;missing price/time KPI nie0;source/retry/conflict failures. Evidence: brak.

### TASK-OPS-004

**Cel/przepływ:** właściciel wybiera approved P/version, wylicza MRP z recipe/usable stock, yield/waste/safety/MOQ/lead time, porównuje oferty, widzi delta po nowej approved version i jawnie akceptuje zakup z historią, bez automatycznej wysyłki/receipt.

**Coverage:** STK-REQ-009–016 / STK-AC-007–009, STK-AC-011. Inputs: stock/source versions, supplier dated offers/constraints, required dates and safety/yield assumptions. Draft/forecast nie approved plan.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPS-003](#task-ops-003), [TASK-PLN-001](production-planning.md#task-pln-001) | Usable stock i approved plan; ręczny plan wystarcza | demonstration |
| optional-adapter | [WRK-REQ-018](../specs/workforce.md#wrk-req-018), [OPT-REQ-010](../specs/optimization.md#opt-req-010) | Przekazują zatwierdzoną tożsamość, nie automatyczne zakupy | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [STK-REQ-014](../specs/stock-inventory.md#stk-req-014) | Uprawniona akceptacja i integralność | release |

**State:** not-started. **Decision gates:** DEC-001 przy persisted quantity; supplier values runtime. **Readiness:** contract known, numeric data/providers absent. **Proof:**v1=10kg unchanged draft,v2approved15 delta+5;15−4+1=12need,5kgmultiple→15order,lead3days vsneed2 fails;price history, denied approve, approval ≠ receipt/dispatch. Evidence: brak.

### TASK-OPS-005

**Cel/przepływ:** właściciel wybiera actual transaction period i produkty, śledzi koszyki/costs/discounts, czyta joint contribution z ujawnioną hipotezą przyciągania, nie wnioskiem przyczynowym z korelacji.

**Coverage:** ECO-REQ-015, ECO-REQ-017 / ECO-AC-011, ECO-AC-013. Inputs: basket identity i real source period, bez konieczności customer identity.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OPS-001](#task-ops-001), [TASK-OPS-002](#task-ops-002) | Transakcje z koszykiem i śledzalne koszty | demonstration |
| contract-input | [SAL-REQ-001](../specs/sales-returns.md#sal-req-001), [ECO-REQ-006](../specs/economics-investment.md#eco-req-006) | Jednostki/źródła/marża | start |
| release-gate | [ECO-REQ-017](../specs/economics-investment.md#eco-req-017) | Ochrona rzeczywistych raportów | release |

**State:** not-started. **Decision gates:** brak nowej. **Readiness:** actual basket input needed; contract specified. **Proof:**4/10A+B i line contribution nie4additional customers;missing cost/source≠0;denied access. Evidence: brak.
