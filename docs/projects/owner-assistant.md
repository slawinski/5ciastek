# AST — Asystent właściciela

Owner [AST](../specs/owner-assistant.md). [Common evidence](README.md#common-evidence). Liczby pochodzą z funkcji właścicieli, nie LLM; denied access obowiązuje również cytaty/agregaty/eksport.

### TASK-AST-001

**Cel/przepływ:** właściciel otwiera daily read-only dashboard i przechodzi po źródle/dacie/założeniu każdej dostępnej miary sales/waste/stockout/margin/labor/overtime/utilization. **Coverage:** AST-REQ-001, AST-REQ-004–005 / AST-AC-001, AST-AC-004–005 (read filter). Bez wszystkich DEM/OPT/B2B/AI jako blockerów; missing nie0.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [SAL-REQ-006](../specs/sales-returns.md#sal-req-006), [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [EVT-REQ-006](../specs/production-records.md#evt-req-006), [WRK-REQ-022](../specs/workforce.md#wrk-req-022), [OPT-REQ-007](../specs/optimization.md#opt-req-007) | Tylko prezentowane miary; compatible sourced inputs do fixture, real producer konieczny dla każdej actual claim | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Access matrix/aggregates/retention/minimization | release |

**State:** not-started. **Decision gates:** provider/access config pod existing policy, nie nowa global DEC. **Readiness:** specify selected measures/sources before implementation; real source proof absent. **Proof:**100sales/10waste/60minstockout/12h source/date;missing margin/utilization nie0;planned75% nieactual;AI down dashboard działa;denied citations no leakage. Evidence: brak.

### TASK-AST-002

**Cel/przepływ:** właściciel zadaje trzy wybrane pytania o sales/waste/profitability; otrzymuje verified-function liczby/cytaty/date/assumptions po permission filtering i redakcji przed AI, albo jawny brak/doprecyzowanie. **Coverage:** AST-REQ-002–006 / AST-AC-002–005. Inputs: exact three cases/metric/period chosen with owner, verified source functions, selected AI provider/processing/access/redaction classes. To planning/runtime/release choices, nie brakujące globalne business policy. Bez mutation/autonomous tools lub surowego wycieku na prośbę modelu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [ECO-REQ-006](../specs/economics-investment.md#eco-req-006), [SAL-REQ-006](../specs/sales-returns.md#sal-req-006) | Implementować sprawdzalne źródła wybranych pytań, nie wszystkie operacyjne epiki | demonstration |
| optional-adapter | [DEM-REQ-006](../specs/demand.md#dem-req-006), [OPT-REQ-007](../specs/optimization.md#opt-req-007), [B2B-REQ-009](../specs/b2b-orders.md#b2b-req-009) | Extended questions tylko jeśli wybrane | demonstration |
| release-gate | [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-008](engineering-assurance.md#task-ass-008), [AST-REQ-005](../specs/owner-assistant.md#ast-req-005), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Ocena ujawnienia/processing/retention i observed payload redaction przed real AI egress | release |

**State:** not-started. **Decision gates:** brak nowej DEC, owner chooses wording nie narzucane przez AC. **Readiness:** evidence data/cases/provider approvals required at scoped phase. **Proof:**3source cases1000PLN/10waste20PLN/400contribution, no hallucinated finance;unknown cost/period qualified;outbound capture denies payroll/contacts,redaction fail blocks send;source/provider failure visible, local qualified result remains. Evidence: brak.

### TASK-AST-003

**Cel/przepływ:** właściciel ogląda dokładny delta ceny/zamówienia/harmonogramu i jawnie przekazuje do autoryzowanej akceptacji właściciela domeny; sama odpowiedź nic nie zmienia. **Coverage:** AST-REQ-007 / AST-AC-006. Późniejszy handoff, nie rozszerzenie pierwszego read-only wydania.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [PLN-REQ-001](../specs/production-plans.md#pln-req-001), [B2B-REQ-003](../specs/b2b-orders.md#b2b-req-003), [ECO-REQ-017](../specs/economics-investment.md#eco-req-017) | Walidacja/rights/approval odpowiedniego właściciela, nie nowy price-policy engine | start |
| implementation-prerequisite | [TASK-PLN-001](production-planning.md#task-pln-001) | Tylko actual plan action handoff; order/price handoff wymaga własnego wybranego owner workflow, nie wszystkich naraz | demonstration |
| release-gate | [AST-REQ-007](../specs/owner-assistant.md#ast-req-007), [TASK-ASS-002](engineering-assurance.md#task-ass-002) | Exact human authorization i no bypass | release |

**State:** not-started. **Decision gates:** workflow selected per action w planie, nie global DEC. **Readiness:** owner workflow/validation evidence needed before enabling selected action. **Proof:**8→9proposal leaves prices/orders/schedule unchanged;denied approver cannot bypass;actual acceptance exactly scoped to delta. Evidence: brak.

### TASK-AST-004

**Cel/przepływ:** właściciel/analityk porównuje rzeczywistą administracyjną pracę z/bez asystenta, query/month costs i poprawność odpowiedzi w zadeklarowanym okresie. **Coverage:** AST-REQ-009 / AST-AC-008. Inputs: comparable baseline/observations/verified expected answers; bez wygenerowanych saved hours lub arbitrary ROI threshold.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [AST-REQ-009](../specs/owner-assistant.md#ast-req-009) | Preregistered comparable workload/period/cost basis w measurement planie | start |
| release-gate | [AST-REQ-009](../specs/owner-assistant.md#ast-req-009) | Empiryczne claims dopiero po actual measurements | release |

**State:** not-started. **Decision gates:** metoda comparison plan-owned, nie global DEC. **Readiness:** plan/dane pomiaru absent evidence. **Proof:**12−8=4h/month;120PLN/month osobno cost/query;missing comparator no savings claim;scenario accuracy tylko po follow-up actuals. Evidence: brak.

### TASK-AST-005

**Cel/przepływ:** właściciel pyta o zapisane qualified growth variants i śledzi cytowane liczby do SCN/ECO, porównując co najmniej dwa wykonalne warianty i trzy economic cases/uncertainty. **Coverage:** AST-REQ-008 / AST-AC-007. Bez nowego finansowego modelu AST i bez warunku pełnego asystenta dla early INV.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-INV-006](investment-scenarios.md#task-inv-006), [TASK-AST-002](#task-ast-002) | Full sourced growth answer i istniejące permission/redaction behavior | demonstration |
| contract-input | [SCN-REQ-022](../specs/scenarios-comparison.md#scn-req-022), [ECO-REQ-016](../specs/economics-investment.md#eco-req-016) | Horyzont/cash/uncertainty i siedem rodzin, nie sama izolacja | start |
| release-gate | [AST-REQ-005](../specs/owner-assistant.md#ast-req-005), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Te same access/AI egress gates co pytania | release |

**State:** not-started. **Decision gates:** brak nowej; extended question wording selected w planie. **Readiness:** shared outputs/approvals potrzebne, kontrakt znany. **Proof:**person/mixer feasible,unverified second-shop nie liczy się do2;CAPEX/OPEX/cash/break-even/uncertainty/3cases retained, citations trace verified functions, no mutation. Evidence: brak.
