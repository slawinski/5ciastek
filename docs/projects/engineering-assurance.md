# ASS — Engineering assurance delivery

Existing [assurance policy](../engineering-assurance.md) owns controls; [design system](../design-system.md) owns UI. Tasks below deliver bounded evidence/controls, not a seventeenth spec or a claim of installed CI/compliance. [Common task/evidence contract](README.md#task-contract). P0 before actual accounts/data, P1 before actual event recording, P2 before the particular high-risk use, not mandatory giant release buckets.

## Source-control-ownership

| Historical source | Existing owner / bounded delivery |
|---|---|
| #20 NFR-01–07 / risk matrix / proportionality / DoD | [Artifacts](../engineering-assurance.md#artefakty-przed-implementacją), [levels](../engineering-assurance.md#poziomy-wdrożenia), [nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki); TASK-ASS-001 and the scoped tasks below |
| #21 SEC-01–05 / AC-01–06 / API surfaces/session/secrets | [Feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji); TASK-ASS-002 |
| #22 REL-01–06 / AC-01–07 / AC-CORR-01–02 | [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki), [feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji); TASK-ASS-003/004; REC-REQ-001 and EVT-REQ-002 own domain outcomes |
| #23 LAW-01–05 / AC-01–05 / worker/time/AI/camera controls | [Legal register](../engineering-assurance.md#rejestr-decyzji-prawnych), [feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji); TASK-ASS-005/008 |
| #24 GATE-01–05 / AC-01–06 / AC-ENFORCE-01–02 | [Release criteria](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania); TASK-ASS-006 |
| #25 UI-01–05 / AC-01–06 | [Component rules](../design-system.md#3-zasady-budowy-i-rozwijania-biblioteki), [UI criteria](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui); [TASK-REC-007](recipes.md#task-rec-007) and each changed-screen proof |

## Data-boundaries

Source #2 is delivered incrementally, not a global company schema gate. Recipe/ingredient/publication/scaling data belongs to TASK-REC-003/005. Resource configuration/source/unit/availability is implemented with TASK-INV-001 or TASK-OBS-004, actual occupancy only OBS. ProductionPlan/version belongs to TASK-PLN-001; ShiftPlan/WorkSession/anonymous LaborSegment to TASK-WRK-001/004 and TASK-OBS-001. Ingredient lots/stock/sale/loss/stockout belong to TASK-OPS-001/003, historical prices/costs to TASK-OPS-002, B2B identity to TASK-B2B-001/002. Their stable identifiers, units, event/entry timestamps, version and provenance are required consumer data contracts, not mandated tables/endpoints. TASK-ASS-007 demonstrates the chosen batch lineage when its sources exist. Architecture/ADR and behavior-preserving UI migration stay TASK-REC-001/002. The workforce guide follows these canonical owners; approved plan storage belongs to PLN, not recipe scaling.

### TASK-ASS-001

**Actor/goal/flow:** implementer and owner select one bounded feature, classify data/owners/actors/trust, review threats and risk, map requirement → threat → test/evidence → owner, and choose proportionate P0/P1/P2 controls before coding. Adapt regression baseline, recovery, destructive-operation safety, change history and dependency provenance practices, not wholesale infrastructure. **Coverage:** #20 proportionality/workstreams/NFR-01–07/DoD; #2 process/data/API/observability planning. Inputs: selected capability/task; exclusions: ISO/OWASP certification/full HA/global schema. Mapa procesu obejmuje przygotowanie, fermentację, dzielenie, formowanie, chłodzenie, wypiek, pakowanie, dostawę, sprzedaż i stratę.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [Policy artifacts](../engineering-assurance.md#artefakty-przed-implementacją) | Data class, owners, read/write/approve rights, trust/validation, error/retry/partial success, persistence recovery, legal reviewer | start |
| release-gate | [Policy release](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Reviewed matrix/risks/owner/date, exceptions and applicability, not certification | release |

**State:** not-started. **Readiness:** proces ma zastosowanie już teraz; implementacja wybranej funkcji nie została zinwentaryzowana. **Decision gates:** brak poza rzeczywistymi decyzjami wybranej domeny. **Proof:** feature-specific matrix and executable P0 work, P1 failure and P2 camera/food/AI boundaries; źródła prawa mają stan potwierdzone, do analizy albo nie dotyczy, bez pozornej deklaracji zgodności. Evidence: none.

### TASK-ASS-002

**Actor/goal/flow:** administrator, redaktor, piekarz i osoba niezalogowana sprawdzają ścieżki API edycji, publikacji, wycofania publikacji, historii i prywatnego odczytu jednej receptury; uprawniona operacja kończy się powodzeniem, a odmowy nie można obejść przez UI lub serwer. **Coverage:** #21 TODO1–9, SEC-01–05, AC-01–06; #20 NFR-01/03/06. Inputs: threat model with users/assets/attackers/flows/entry points/risks/controls and actor matrix. Test every available REST/GraphQL/server action/Local API surface, including Local API access override with explicit server actor authorization (`overrideAccess: false` with user context or equivalent tested mechanism). Sessions/cookies/CSRF, input sizes/server validation and login rate limits must fit chosen operations; secrets outside repo/log/frontend; sensitive personal logs prohibited. Select applicable ASVS, security update/vulnerability response; not full pentest/multitenant IAM/certification.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-001](recipes.md#task-rec-001), [Feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji) | Chosen trust/API boundary, matrix can precede code | start |
| release-gate | [REC-REQ-006](../specs/recipes.md#rec-req-006) | Real endpoints must exist for actual denial evidence, not whole catalog as start blocker | release |

**State:** not-started. **Readiness:** praca nad macierzą i zagrożeniami może się rozpocząć; rzeczywiste testy API czekają na działające punkty końcowe. **Decision gates:** brak wymyślonych decyzji; zakres macierzy dostępu podlega polityce. **Proof:** osoba niezalogowana nie tworzy, nie edytuje i nie publikuje; piekarz tylko do odczytu widzi publikację, nie prywatny szkic ani panel edycji. Direct API deny; Local API no bypass; bad token/no session/wrong role no leak; threat owner/open risks/date; all actual surfaces and input/session/secrets checks. Evidence: none.

### TASK-ASS-003

**Actor/goal/flow:** recovery owner backs up one recipe dataset/media, tests controlled migration on a copy, injects failure, restores to separate nonpublic isolated DB and checks frozen versions/relationships. **Coverage:** #22 P0/REL-01–03/06, AC-01–04/07; #24 GATE-04/05 and migration-isolation AC. Include DB/files scope/owner/frequency, RPO/RTO after operational analysis not invented SLA, backup before migration/rollback, test-production separation; destructive reset/migration refuses production/unknown/unconfirmed target. Logs omit secrets/sensitive data. UI never success before server confirms.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki) | Full frozen values not only ingredient IDs; procedures may be prepared before delivery | start |
| release-gate | [TASK-REC-003](recipes.md#task-rec-003) | Actual dataset/DB/media needed for restore proof, not a reciprocal implementation edge | release |

**State:** not-started. **Readiness:** polityka znana, analiza operacyjna i rzeczywista próba odtworzenia niezweryfikowane. **Decision gates:** DEC-001 tylko dla zależnej reprezentacji masy. **Proof:** v1 pozostaje niezmienna po edycji szkicu lub źródła; odtworzenie zachowuje receptury, składniki, relacje, historię i pliki. Production/ambiguous reset refuses before mutation; write failure visible; isolated migration failure leaves other DB untouched; restore result owner/date/code SHA, dump success alone insufficient. Evidence: none.

### TASK-ASS-004

**Actor/goal/flow:** operator na dwóch urządzeniach rejestruje ograniczony przebieg partii, doświadcza przekroczenia czasu oczekiwania, utraty sieci lub restartu podczas trwającej fermentacji, bezpiecznie ponawia zapis albo korzysta z udokumentowanej procedury ręcznej i widzi jedną spójną historię; korektor wprowadza zmianę z powodem albo otrzymuje atomową odmowę z konfliktem zależności. **Coverage:** #22 P1/REL-04–05/AC-05–06/AC-CORR-01–02; #20 NFR-02/04; #24 P1. Domain acceptance owned by EVT, not repeated here. Include server-clock/correction semantics while retaining occurredAt≠recordedAt, error monitoring, no unbounded audit retention or false success; no multi-region/100%uptime promise.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-001](production-recording.md#task-obs-001), [TASK-OBS-002](production-recording.md#task-obs-002) | Actual event/correction paths for authoritative fault demonstration; procedures earlier | demonstration |
| contract-input | [EVT-REQ-002](../specs/production-records.md#evt-req-002), [EVT-REQ-008](../specs/production-records.md#evt-req-008) | Atomic correction/idempotency/concurrency | start |
| release-gate | [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki) | Recovery/failure/manual-procedure evidence before actual recorder release | release |

**State:** blocked. **Decision gate:** DEC-002 semantyka trwałego strumienia; DEC-001 tylko dla poprawianych mas. **Readiness:** awarie określone, kontrakty trwałego zapisu nierozstrzygnięte. **Proof:** ten sam start działa raz, dwa urządzenia nie tworzą sprzecznego stanu, późny wpis zachowuje dwa czasy; korekta 30 min×2→20 min/40 osobominut daje tę samą historię na karcie i mapie. Konflikt z późniejszym transferem, odcinkiem lub zasobem jest atomowo odrzucony; utrata sieci i restart nie tworzą fikcyjnych potwierdzeń ani nie pozwalają pomijać już istniejących zależności. Dowody: brak.

### TASK-ASS-005

**Actor/goal/flow:** odpowiedzialna osoba oceniająca dane i prawo inwentaryzuje pola i odbiorców jednego rzeczywistego wdrożenia, określa cel, podstawę prawną, minimum danych, dostęp, retencję, zabezpieczenia, informowanie osób i obsługę ich żądań, sprawdza uprawniony eksport, usunięcie i anonimizację bez bezrefleksyjnego usuwania zapisów wymaganych prawem oraz zapisuje stan przeglądu, dowód i datę. **Coverage:** #23 P0/LAW-01–05/AC-01–03; zastosowanie zasad do grafików, indywidualnego czasu i dokumentów kadrowych oraz właściwe źródła reguł odpoczynku i czasu pracy; #20 NFR-06. Uwzględnić administratorów i podmioty przetwarzające, wymagane umowy, konta, logi, audyt i zdarzenia; wystarczają minimalne liczby osób, chyba że tożsamości są uzasadnione. Historia techniczna nie oznacza wieczystej retencji danych osobowych. Wersja reguły lub dokumentu jest identyfikowalna, gdy wymaga tego audyt. Przegląd ponawia się przy nowych danych, urządzeniu lub odbiorcy, w tym AI. Nie jest to opinia prawna ani certyfikat; bez wymyślonej retencji lub uniwersalnej normy pracy.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [Legal register](../engineering-assurance.md#rejestr-decyzji-prawnych), [WRK-REQ-020](../specs/workforce.md#wrk-req-020) | Źródło, zakres, zastosowanie, odpowiedzialny, środek, dowód, status i data przeglądu | start |
| release-gate | [Nonnegotiable](../engineering-assurance.md#nieprzekraczalne-warunki) | Bez zbierania danych osobowych przed przeglądem; cel, minimum i prawa zweryfikowane dla wybranego wdrożenia | release |

**State:** not-started. **Readiness:** nadal potrzebne pola, wdrożenie i kompetentna osoba oceniająca. **Decision gates:** kwalifikacje prawne i warunki rzeczywistego użycia podlegają istniejącej polityce, nie ustawieniom domyślnym całego produktu. **Proof:** każde początkowe pole osobowe ma podstawę, dostęp i retencję; wskazane anonimowe alternatywy, bez zbierania tożsamości pracowników na potrzeby hipotetycznego ML. Formalnej obecności nie wywodzi się z sesji operacyjnych lub LaborSegment; rzeczywiste testy żądań osoby, eksportu i usunięcia respektują prawne granice retencji. Dowody: brak.

### TASK-ASS-006

**Actor/goal/flow:** release owner runs repeatable target-stack install-from-lockfile/lint/types/unit/build/smoke in isolated targets, records SHA/environment/date/scope/results/omissions, activates main ruleset/protection with concrete required checks and demonstrates ordinary merge is blocked by a failing check on current SHA, without merging test PR. **Coverage:** #24 TODO/P0/P1/GATE-01–05/AC-01–06/AC-ENFORCE-01–02, #20 NFR-05. Review CI token permissions, dependency/lock provenance, secrets/known-vulnerability scans and proportionate response (not every warning an automatic blocker); sanitized reports/no actual customer-worker data; immutable previous failures/omissions and owner/justification/review-date deviations. Release checklist: restore/migration/smoke/rollback/decision owner. No heavyweight copied capsule/hash-ledger framework.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-001](recipes.md#task-rec-001), [Policy release](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Stage-specific commands/check names, scopes/threats before actual activation | start |
| release-gate | [TASK-ASS-003](#task-ass-003), [TASK-ASS-002](#task-ass-002) | Real-data release needs restore/access evidence; synthetic docs/PoC not proof | release |
| release-gate | [Policy release](../engineering-assurance.md#kryteria-dopuszczenia-zmiany-do-wydania) | Actual checks + repo permissions/plan/ruleset activation required for enforcement; lack of activation blocks this control | release |

**State:** not-started. **Readiness:** dowody poleceń, sprawdzeń, zestawu reguł i uprawnień niezweryfikowane, bez deklaracji zainstalowanej bramki. **Decision gates:** brak wymyślonej decyzji domenowej; możliwość aktywacji jest rzeczywistym warunkiem kwalifikacji przyszłego wydania. **Proof:** failed type/test PR normal merge denied, fixed checks bound currentSHA; ruleset ID/config/bypass/exceptions and attempt report; logowanie, odmowa, publikacja, historia, skalowanie i walidacja; regresje domenowe obejmują fizyczne zwroty, zamrożony skład zakwasu, korektę, brak podwójnego liczenia pracy, DST i aktualność źródła zgodnie ze zmienianym zakresem. Deterministic isolated fixture, truthful live/sim/no stale motion; SCN rozróżnia ocenę operacyjną, finansową i braki weryfikacji. Skipped/no-result≠pass; executable checks not markdown-only where testable. Evidence: none.

### TASK-ASS-007

**Actor/goal/flow:** operator lub analityk śledzi jedną rzeczywistą partię od partii surowca i dostawcy przez niezmienną recepturę i skalowanie, zatwierdzony plan i niezależną zmianę, zapisane operacje, zasób i stratę, gotowy wyrób i sprzedaż do kosztu z możliwym do prześledzenia pochodzeniem; wskazuje jedno źródło każdego faktu i luki kompletności. **Coverage:** #2 entities/process map/API/observability/KPI/DoD/AC-DOM-01; #23 identyfikowalność, gdy użyto do tego celu. This is later integration proof, not a global data-model-first gate or another source-of-truth engine. API/data contracts and minimal error observability must be documented alongside each selected producer. POS/accounting/sensor adapters prefer existing integrations; source-specific offline/manual/recovery behavior is planned at its actual boundary, not a new blanket offline application mandate.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-OBS-003](production-recording.md#task-obs-003), [TASK-OPS-002](operational-balances.md#task-ops-002), [TASK-OPS-003](operational-balances.md#task-ops-003), [TASK-PLN-001](production-planning.md#task-pln-001), [TASK-WRK-001](workforce.md#task-wrk-001) | Tylko pełna demonstracja pochodzenia jednej partii; rozpoczęcie zadań źródłowych niezależne | demonstration |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001), [WRK-REQ-001](../specs/workforce.md#wrk-req-001), [STK-REQ-004](../specs/stock-inventory.md#stk-req-004), [ECO-REQ-003](../specs/economics-investment.md#eco-req-003) | Stable IDs/units/times/versions/prices/provenance, plan≠actual≠scenario, geometry not facts | start |
| optional-adapter | [B2B-REQ-007](../specs/b2b-orders.md#b2b-req-007), [QLT-REQ-005](../specs/quality-monitoring.md#qlt-req-005) | Powiązania zamówienia lub urządzenia tylko wtedy, gdy ujęte w wybranym przykładzie | demonstration |

**State:** not-started. **Readiness:** kontrakty źródłowe znane, połączone rzeczywiste fakty niezinwentaryzowane. **Decision gates:** DEC-001/002 na rzeczywistych granicach przechowywania i odtwarzania. **Proof:** powiązania surowca, pracy, kosztu i wyrobu jednej partii oraz miara kompletności i poprawności; plan→skalowanie→zmiana→wykonanie mają po jednym właścicielu, bez cyklicznego rozpoczęcia #7/#11/#29. Braki są widoczne; versioned contract/API and scoped error logs, ADR reference; kalkulator skalowania nie tworzy automatycznie planu. Dowody: brak.

### TASK-ASS-008

**Actor/goal/flow:** osoba odpowiedzialna za ocenę bezpieczeństwa żywności, prywatności lub AI wybiera jedno zastosowanie wysokiego ryzyka, mapuje je na rzeczywistą procedurę zakładu i źródła prawa, zapisuje odpowiedzialnego człowieka, wersję, zatwierdzenie, retencję i dowody, sprawdza awarię i ręczne postępowanie zastępcze oraz dopuszcza albo odrzuca to konkretne użycie. **Coverage:** #20 P2/NFR-07/DoD; #23 HACCP/traceability/worker-camera/AI/LAW-03–05/AC-04–05; #10 kontrole procedury, sieci, kalibracji i próby ręcznej; #12 ograniczone ujawnienie danych AI. Ocenić cel kamery, konieczność, proporcjonalność, informowanie, dostęp, retencję i DPIA, gdy ma zastosowanie; identyfikacji ani oceny pracowników nigdy nie włącza się tylko dlatego, że są technicznie możliwe. Same liczby osób wystarczają tam, gdzie tożsamość jest zbędna. Aplikacja operacyjna nie jest wymaganą prawem procedurą zakładu; oszacowanie czujnika lub AI nie jest zatwierdzonym wynikiem HACCP, automatyzacja nie może decydować o ocenie pracownika lub bezpieczeństwie żywności. Nowe urządzenie, dane lub odbiorca wymagają przeglądu. Osobna ocena wartości dla opcjonalnego CV; nie certyfikacja.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [Legal register](../engineering-assurance.md#rejestr-decyzji-prawnych), [Feature controls](../engineering-assurance.md#kontrole-zależne-od-funkcji) | Rzeczywista procedura i zastosowanie oraz wyznaczona odpowiedzialna osoba oceniająca w domenie | start |
| release-gate | [QLT-REQ-006](../specs/quality-monitoring.md#qlt-req-006), [QLT-REQ-007](../specs/quality-monitoring.md#qlt-req-007) | Tylko wybrane użycie dotyczące żywności lub urządzenia wymaga swojego rzeczywistego raportu i prób awarii, nie każdego innego modułu P2 | release |
| release-gate | [AST-REQ-005](../specs/owner-assistant.md#ast-req-005), [AST-REQ-006](../specs/owner-assistant.md#ast-req-006) | Tylko wybrane rzeczywiste ujawnienie AI wymaga przefiltrowanej i zredagowanej treści oraz zgody na przetwarzanie | release |

**State:** not-started. **Readiness:** procedury, osoba zatwierdzająca i profile wejść dla konkretnego wdrożenia nadal wymagają ustalenia, bez wymyślonej uniwersalnej polityki. **Decision gates:** rzeczywisty przegląd prawny i proceduralny, nie nowa globalna DEC produktu. **Proof:** użycie kamery zablokowane do potwierdzenia działań prawnych i organizacyjnych; wskazana wersja procedury lub dokumentu i ścieżka zatwierdzenia przez człowieka, dowody prób sieci, błędnego odczytu, kalibracji i postępowania ręcznego. Nieudana redakcja AI blokuje wysyłkę; samo zaliczenie techniczne nigdy nie oznacza zgodności ani zatwierdzenia bezpieczeństwa. Dowody: brak.
