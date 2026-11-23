# B2B — Zamówienie do wydania

Owner [B2B](../specs/b2b-orders.md). [Common task/evidence contract](README.md#task-contract). Ręczna weryfikacja nie czeka na pełną automatyczną ocenę zdolności.

### TASK-B2B-001

**Cel/przepływ:** operator przyjmuje formularz/e-mail do szkicu, weryfikuje warunki, uprawniony potwierdza; missing capacity nazwane unverified z udokumentowaną decyzją człowieka. **Coverage:** B2B-REQ-001–005, B2B-REQ-010 / B2B-AC-001–004 (manual), B2B-AC-008. Inputs: source/order/customer/contact, SKU/unit/quantity/date/timezone, contract price basis/MOQ/validity; values pochodzą z umowy, nie defaults. Opcjonalne AI tylko proponuje pola. Bez solvera lub auto redukcji confirmed orders.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [STK-REQ-001](../specs/stock-inventory.md#stk-req-001) | SKU i jawne jednostki | start |
| optional-adapter | [OPT-REQ-001](../specs/optimization.md#opt-req-001), [WRK-REQ-003](../specs/workforce.md#wrk-req-003), [STK-REQ-006](../specs/stock-inventory.md#stk-req-006), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Selected capacity/AI input, nie blockers manual | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [B2B-REQ-010](../specs/b2b-orders.md#b2b-req-010) | Customer/contract permissions, retention/source minimization | release |

**State:** not-started. **Decision gates:** [DEC-004](../decisions.md#dec-004) tylko automatyczne rozpoznawanie duplikatu między kanałami, nie ręczny szkic/weryfikacja; lifecycle partial nie bramka tego tasku. **Readiness:** źródłowy contract wybierany w planie, normatywne walidacje znane. **Proof:**contract8PLNnet/MOQ20,10szt/7PLN/unknownSKU fails,30correct passes;draft≠confirmation;missing capacity manual unverified;confirmed50 unchanged gdy new30>remaining20;denied/timeouts no success. Evidence: brak.

### TASK-B2B-002

**Cel/przepływ:** operator przegląda duplicate/change/cancel history, re-weryfikuje zmienione zlecenie, przekazuje wersję do PLN, rejestruje produkcję/kompletację/wydanie i odczytuje dokument/eksport z rzeczywistymi ilościami. **Coverage:** B2B-REQ-003, B2B-REQ-006–008 / B2B-AC-003 (PLN), B2B-AC-005–006. Inputs: agreed duplicate identity, postconfirmation/postdispatch/partial closure choices; document formats zatwierdzone dla konkretnego odbiorcy. Bez własnej księgowości, kasowania zobowiązań lub fikcyjnego stock movement.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-B2B-001](#task-b2b-001), [TASK-PLN-001](production-planning.md#task-pln-001) | Działające potwierdzenie i actual draft handoff | demonstration |
| contract-input | [STK-REQ-001](../specs/stock-inventory.md#stk-req-001), [STK-REQ-002](../specs/stock-inventory.md#stk-req-002) | Dispatch/source physical vs commercial semantics | start |
| release-gate | [B2B-REQ-010](../specs/b2b-orders.md#b2b-req-010), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Rights/history/export/data limits | release |

**State:** blocked. **Decision gates:** DEC-004 przy trwałej cross-channel duplicate identity, [DEC-005](../decisions.md#dec-005) przy zmianach po produkcji/wydaniu i częściowym zamknięciu. **Readiness:** ordinary history/reverification/delta outcomes known; unknown transitions nie implementować arbitralnie. **Proof:**sameK/123 wskazuje existing, independent30szt retained;30→35new verification z old acceptance;cancel not deletion;30ordered/28dispatch/2difference visible, pick/dispatch/invoice export uses actual28/version, no auto closure. Evidence: brak.

### TASK-B2B-003

**Cel/przepływ:** verifier uruchamia rozdzielone workforce/production/material checks; właściciel czyta per-client margin/late/handling/error/channel report. **Coverage:** B2B-REQ-004–005, B2B-REQ-009 / B2B-AC-003–004, B2B-AC-007. Inputs: dated scope/version każdego źródła, margin z ECO i actual transaction/dispatch times; handling start/end/error registry z bounded planu, nie nowa global DEC.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-B2B-001](#task-b2b-001) | Existing order/verification before connected demo | demonstration |
| implementation-prerequisite | [TASK-OPT-001](optimization.md#task-opt-001), [TASK-WRK-001](workforce.md#task-wrk-001), [TASK-OPS-003](operational-balances.md#task-ops-003) | Tylko pełne automatyczne odpowiednie sprawdzenia w release | release |
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [SAL-REQ-001](../specs/sales-returns.md#sal-req-001) | Qualified historic cost/commerce sources mogą być dostarczone ręcznie | start |
| optional-adapter | [WRK-REQ-017](../specs/workforce.md#wrk-req-017) | Recommendations nie bramka | demonstration |

**State:** not-started. **Decision gates:** DEC-002 tylko persistent actual adapter; brak nowej metric DEC. **Readiness:** actual sources potrzebne do claims, fixtures wcześniej. **Proof:**each source date/status,changed date invalidates check;240−150=90PLN ECO basis,06:00→06:15late15;missing costs/time nie0/on-time;handling/errors/channel margin qualified. Evidence: brak.
