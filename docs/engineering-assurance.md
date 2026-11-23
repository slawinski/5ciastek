# KoPieC OS — engineering assurance policy

**Status:** wymagania projektowe do wdrożenia. Ten dokument nie potwierdza, że kontrole już działają.

## Cel

KoPieC OS ma być odporny na błędne dane, pomyłki użytkownika, błędy oprogramowania i typowe zagrożenia bezpieczeństwa. Ma umożliwiać bezpieczne przywrócenie pracy po awarii. Ma wspierać dokumentację zakładu, ale nie może samodzielnie deklarować zgodności z prawem lub bezpieczeństwa żywności.

Każdy moduł musi mieć określony poziom ryzyka i dowody weryfikacji. **Hardening jest przekrojowy. Nie jest osobnym modułem końcowym.**

### Wzorzec

Z repozytorium [the-sies-files](https://github.com/slawinski/the-sies-files) adaptujemy:
- testy regresji z ustaloną wersją kodu;
- izolację baz testowych i odmowę operacji na nieznanym celu;
- kontrolowane migracje i weryfikację przywracania danych;
- historię zdarzeń, jawne korekty i weryfikację niespójnych stanów;
- dowody wyników testów oraz kontrolę zależności i pochodzenia źródeł.

Nie kopiujemy skomplikowanych mechanizmów w całości. Koszt kontroli musi być proporcjonalny do ryzyka.

## Poziomy wdrożenia

| Poziom | Kiedy wymagany | Minimum |
|---|---|---|
| **P0** | Przed użyciem rzeczywistych kont i danych, także w MVP-0 | Kontrola dostępu, walidacja serwera, wersje receptur, backup i test restore, izolowane testy, CI, podstawowy model zagrożeń, ocena danych osobowych |
| **P1** | Przed użyciem rzeczywistych zdarzeń produkcyjnych, także ręcznych | Idempotencja, spójność transakcji, współbieżność, audyt korekt, obsługa timeout i restartu, udokumentowana procedura przy niedostępności systemu |
| **P2** | Przed właściwym zastosowaniem o wyższym ryzyku | Analiza regulacyjna i branżowa, testy urządzeń i alarmów, kontrola dostępu do danych wrażliwych, legalna podstawa monitoringu, ocena skutków dla ochrony danych gdy wymagana, świadoma akceptacja ryzyka |

**P0, P1, P2 nie są certyfikatami ani oceną prawną.** Są poziomami kontroli wewnątrz projektu.

These levels follow actual data and risk, not release names. Investment-first MVP-1 does not automatically trigger production-event P1 merely because it is called MVP-1. Actual accounts/data still require P0; actual production-event use additionally requires P1; applicable high-risk use requires P2. An isolated synthetic proof of concept establishes none of those release approvals.

## Nieprzekraczalne warunki

1. Nie wdrażaj funkcji, jeżeli można bez autoryzacji zmienić jej krytyczne dane.
2. Nie uruchamiaj skryptu czyszczącego bazę, jeżeli cel operacji nie jest jawnie ustalony i uprawniony.
3. Nie uznawaj backupu za sprawdzony bez wykonania testu restore do izolowanego celu.
4. Nie potwierdzaj użytkownikowi powodzenia, jeżeli serwer nie potwierdził zapisu.
5. Nie przechowuj sekretów, haseł i tokenów w repozytorium ani w publicznych raportach.
6. Nie uznawaj pominiętego testu za zaliczony.
7. Nie uznawaj decyzji AI ani odczytu czujnika za zatwierdzony zapis HACCP bez ustalonej procedury.
8. Nie uruchamiaj identyfikacji ani oceny pracowników na podstawie kamer bez osobnej oceny prawa i prywatności.
9. Nie utożsamiaj historii technicznej z obowiązkiem bezterminowego przechowywania danych osobowych. Retencja wymaga osobnej decyzji.

## Kontrole zależne od funkcji

| Funkcja | Zagrożenie | Kontrola | Dowód |
|---|---|---|---|
| Receptury i Payload | Nieautoryzowana edycja, ujawnienie szkicu, nadpisanie zatwierdzonej wersji | RBAC, walidacja serwera, wersjonowanie, test wszystkich dostępnych ścieżek API | Testy uprawnień i historii wersji; #21 |
| Next.js + Local API | Przypadkowe pominięcie kontroli dostępu przez `overrideAccess` | Jawna kontrola aktora; dla operacji użytkownika stosuj `overrideAccess: false` z kontekstem użytkownika **albo** równoważny, przetestowany mechanizm serwerowy | Test odmowy dostępu; #21 |
| Receptury i pliki | Utrata informacji po awarii lub migracji | Backup, migracje na kopii, restore drill, plan cofnięcia | Raport testu restore; #22 |
| Rejestracja partii | Duplikaty, konflikt współbieżny, niespójny czas | Idempotencja, atomowe przejścia, audyt korekt | Testy przy timeout i dwóch urządzeniach; #22 |
| Praca ludzi | Nadmierne gromadzenie danych osobowych | Minimalizacja, role, retencja, ocena celu | Rejestr przetwarzania i decyzja; #23 |
| HACCP / traceability | Błędne poleganie na aplikacji jako dowodzie zgodności | Mapowanie na rzeczywistą procedurę zakładu, zatwierdzenie i identyfikowalność | Zatwierdzona procedura i test raportu; #23 |
| Monitoring wizyjny | Naruszenie praw pracowników i prywatności | Odrębny przegląd prawa, konieczności i proporcjonalności **przed** wdrożeniem | Decyzja prawna i ocena ryzyka; #23 |
| Release | Regresja, wyciek sekretów, niezbadane zmiany | Automatyczne testy, raport z SHA, skan zależności, przegląd odstępstw | Raport CI/release; #24 |

## Artefakty przed implementacją

Każde zadanie implementacyjne musi podać:
- klasę danych: publiczne, wewnętrzne, osobowe lub wrażliwe biznesowo;
- uprawnienia do odczytu, zapisu i zatwierdzenia;
- granicę zaufania i sposób walidacji;
- zachowanie przy błędzie, ponowieniu oraz częściowym sukcesie;
- sposób migracji lub odzyskania danych, jeżeli zadanie zmienia stan trwały;
- wymagane testy, dowody i ryzyka nieweryfikowane;
- odpowiedzialnego za decyzję oraz status oceny prawnej, jeżeli jest potrzebna.

Use small, testable, prefix-qualified `PREFIX-REQ-NNN` and `PREFIX-AC-NNN` references from the canonical owner ([specification style](specification-style.md)). Historical issue-local IDs in the retained tables identify provenance only, not continuing issue authority.

## Kryteria dopuszczenia zmiany do wydania

- [ ] Funkcja i jej zakres są opisane.
- [ ] Właściciel przejrzał zagrożenia i wymagania prawne dla funkcji.
- [ ] Testy funkcjonalne, uprawnień i istotnych błędów przeszły.
- [ ] Zmieniono dokumentację modelu danych i migracji, jeśli potrzeba.
- [ ] Backup/restore został zweryfikowany przed uruchomieniem na rzeczywistych danych i zgodnie z harmonogramem później.
- [ ] CI zapisało identyfikator kodu, wyniki kontroli i pominięte testy.
- [ ] Każde odstępstwo ma właściciela, uzasadnienie i termin ponownego przeglądu.
- [ ] Przy zmianie regulowanej lub wysokiego ryzyka potwierdzono decyzję osoby odpowiedzialnej za tę dziedzinę.

## Rejestr decyzji prawnych

Nie oznaczaj przepisów jako spełnionych na podstawie samej implementacji. Dla każdej istotnej normy zapisuj: `źródło`, `zakres`, `zastosowanie`, `odpowiedzialny`, `środek`, `dowód`, `status (do zbadania / dotyczy / nie dotyczy / zweryfikowane)` i `data przeglądu`.

### Ramy odniesienia
- [RODO — rozporządzenie 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679).
- [UODO — monitoring pracowników](https://uodo.gov.pl/pl/701/4470).
- [Rozporządzenie 852/2004 — zasady HACCP](https://eur-lex.europa.eu/eli/reg/2004/852).
- [Rozporządzenie 178/2002, art. 18 — traceability](https://eur-lex.europa.eu/eli/reg/2002/178).
- [OWASP ASVS](https://asvs.owasp.org/) oraz [NIST SSDF SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final).
- [Payload Local API — access control](https://payloadcms.com/docs/local-api/access-control).

**Dokument nie zastępuje opinii prawnej, przeglądu bezpieczeństwa ani zatwierdzenia procedur HACCP.**

## Stable control interface

These anchors refine the retained policy above. [Source-control coverage](migrations/spec-library/coverage.md#policy-handoff) records the individual source obligations; [ASS delivery tasks](projects/engineering-assurance.md) own implementation state. Neither the table above nor these sections claims installed controls, successful tests, enforced release rules, legal compliance or food safety.

### ass-risk

For each bounded task, record data classes and owners, actors and read/write/approval rights, trust and validation boundaries, persistence and recovery scope, failure/retry/partial-success behavior, legal applicability and the responsible decision-maker. The threat model identifies users, assets, attackers, data flows and entry points, with an owner, open risks and review date. Link each material risk to its threat, required control, test or other observable evidence, and accountable owner. Include API and process boundaries and the observability needed to investigate failure without disclosing secrets or unnecessary personal data. Scale control cost to risk; hardening is cross-cutting, not a final module. Apply P0/P1/P2 at the actual-use boundaries above, not as certification.

### ass-access

Enforce authorization on the server for every available API path, not only UI controls: REST, GraphQL if exposed, server actions and Local API. Document and test the actor/role/resource/action matrix, including direct requests, cross-resource access, private drafts and version history; cover editing, publication, unpublishing and version reads separately. Unauthenticated users cannot create/edit/publish; a read-only baker sees authorized publications, not private drafts or editing tools. Invalid tokens, missing sessions and wrong roles must deny without leakage. Authentication alone does not grant editing or approval rights. For target-stack Payload Local API user operations, use `overrideAccess: false` with user context or an equivalent tested server authorization mechanism; privileged internal calls require an explicit actor/trust boundary. This applies when that architecture is implemented, not as an instruction to migrate current maintenance.

Protect sessions and cookies, apply CSRF protection where relevant, server-side schema validation and input-size limits, and login/request limits appropriate to the threat model. Keep secrets, passwords and tokens outside source control, logs, frontend payloads and public reports; error logs must omit sensitive personal data. Select applicable ASVS controls without claiming certification. Document security-update and vulnerability response: assess dependency vulnerabilities promptly, remediate proportionally, and record any accepted deviation with owner, justification and review date. Denied reads disclose no protected data; denied writes leave state unchanged. Employee identities and private history require their own justified access scope.

### ass-integrity

Validate inputs at the server and confirm success only after the authoritative write succeeds. A logical transition is atomic: accept all its required effects or reject without partial state. Retries/idempotency and concurrent writes must preserve domain identity, avoid duplicates and prevent stale overwrites. Make validation, permission, source, network and persistence failures visible rather than reporting success or silently substituting zero.

Keep time of occurrence distinct from time of recording; late input and clock disagreement must not silently rewrite the former. Authorized corrections require author, reason, expected version and before/after history within the applicable retention policy. Validate the entire corrected sequence and every already-existing dependent fact, including worker segments, transitions, transfers, losses and resource assignments/releases. Atomically rebuild dependent projections or reject with an identified conflict; do not quietly move or repair dependent facts or published shifts. A correction in the activity-only increment does not wait for future quantity/resource producers, but must validate those dependencies once they exist. Record and test timeout, interrupted connection, restart and concurrent-device behavior; document the manual operating procedure during unavailability. Persistent mass and stream choices remain subject to [DEC-001](decisions.md#dec-001) and [DEC-002](decisions.md#dec-002).

### ass-recovery

Preserve complete published historical values, not merely links whose current values can change. For persistent data define the backup scope (database, media and required configuration), responsible owner and frequency. Set RPO/RTO only after analysis of acceptable data loss and recovery time. A backup is not verified until an actual restore succeeds to an isolated, nonpublic target with readback of the relevant historical values and relationships.

Keep test and production environments separate. Destructive tests, reset/cleanup scripts and test migrations must refuse production, unknown, ambiguous or unconfirmed targets before mutation; require an explicitly identified and confirmed test target, with no default database reset. Test migrations on a copy and verify that injected failure cannot damage another database. For a production schema change, separately authorize its target, take the required backup and define rollback; this is not permission to aim test/reset commands at production. Verify readback/recovery before real-data use and on the subsequent agreed schedule, recording owner, result, date and source version. A successful dump alone is not restore evidence. Never turn an unconfirmed write or failed restore into a success claim. Retention and removal obligations still apply to backups and retained history; recovery is not permission to retain personal data forever.

### ass-privacy

Before processing personal data, inventory accounts, logs, audit history and potentially person-linked events. For every personal field record purpose, legal basis, minimum necessary fields, access roles, safeguards, retention and the responsible controller/processor. Assess processor agreements, information obligations and handling of data-subject requests, including access/export, correction and deletion/anonymization or a documented lawful reason for retention. Do not blindly delete records legally required to be kept or invent a universal retention period. Technical audit history is not a basis for indefinite storage.

Keep workforce, customer and business-contact data limited to their actual purpose. Anonymous operation counts and investment scenarios do not require employee identities; speculative future ML is not a reason to collect them. Identify which information can remain anonymous. Permission-filter individual records and exports; aggregates must not expose identities through unrestricted underlying data. Reassess on each new data category, device or recipient, including camera use or external AI processing, before actual collection/disclosure.

### ass-legal

Maintain the legal decision register above: source, scope, applicability, responsible person, measure, evidence, status and review date. Code or a documentation example cannot establish compliance. Assess workforce rules against the actual relationship, time-work system and applicable exceptions: schedule publication and notice, rest, breaks, working-time limits and night work. Formal records additionally require qualification of overtime, days off, absences, required fields and documentation storage. Do not automatically impose employee norms on an owner; a typical month-long schedule or week's notice is not a universal rule without checking applicability and exceptions.

The default workforce path is operational records/export to an external HR system. Labeling an export as formal employment records requires separate completed legal and technical verification ([WRK-REQ-015](specs/workforce.md#wrk-req-015), [WRK-REQ-020](specs/workforce.md#wrk-req-020)). Camera-based identification or evaluation, AI processing, a new recipient and regulated/high-risk use require their own prior assessment, including necessity, proportionality and a data-protection impact assessment when required. Unresolved applicability remains an explicit actual-use gate with an accountable domain approver, not a fabricated legal norm.

### ass-release-evidence

Do not release a changed feature when its required basic tests, security controls or evidence have failed or remain missing. Apply the actual-use boundaries and proportionate scope above, with explicit reviewed deviations rather than silent waivers.

Define repeatable commands and explicitly isolated test targets. Target-stack delivery requires installation from the lockfile, lint, type checking, unit tests, build and smoke checks; these are future delivery requirements, not scripts claimed installed by this document. CI for PRs and the main branch must fail on critical test, type, build and applicable basic security failures. Characterize existing behavior before migration and retain relevant domain regressions, permission denials, invalid/boundary input, source/write failures and retry/concurrency checks. Trace canonical REQ/AC → test or other check → log → actual result. Attach artifact/commit SHA, date, environment versions, commands, results, failures and omitted/skipped checks; preserve failure history rather than presenting only a later green run. A skipped check or one returning no result is not passed. Testable product behavior requires executable evidence, not Markdown alone; prose-only work uses document checks, not invented product-test success.

Scope regressions to the changed feature: login/denial, recipe publication/history/scaling/validation; stock opening/physical returns; frozen starter composition; atomic corrections; no double-counted labor; DST; source freshness; deterministic fixtures and synthetic isolation; truthful LIVE/SYMULACJA and readable states without motion; separate scenario feasibility, finances and unverified inputs. CI/release evidence must include dependency/lockfile provenance, known-vulnerability and secret scans, least-privilege CI token permissions and sanitized logs/artifacts without credentials or actual customer/worker personal data. Respond promptly to vulnerability findings after applicability/risk assessment; not every warning is an automatic blocker. Record each deviation's owner, justification and review date. Verify backup/restore, migration, postdeployment smoke and rollback/repair evidence where applicable, with an identified release decision owner. Before regulated/high-risk release obtain the responsible domain person's decision. A synthetic demonstration does not replace actual legal, device, operational or recovery evidence.

### ass-release-enforcement

Release enforcement requires an activated rule on `main`, concrete required-check names and the configuration/ruleset identity, verified against the current commit SHA. Establish that an ordinary merge with a failing required check is blocked, and review bypass actors/permissions and authorized exceptions. Green CI by itself is not evidence that merging is constrained. If activation is unavailable under repository permissions or service capabilities, report the enforcement control as blocked; do not call an inactive configuration enforced. Verification does not require merging an experimental test PR. Record actual configuration and denial evidence before claiming enforcement; this documentation does not activate repository rules.

### ass-food-safety

Map records and reports to the actual plant's procedure and version, traceable batch and responsible human approver. When used for traceability, identify raw-material lots and suppliers, dough batches and products and provide a report reconstructing their relationships. Identify the documentation/rule version applicable at the time of a record when needed for audit. Agree the supported control points, corrective actions and documents with the plant's food-safety responsible person; the supporting application is not the plant operator's legally required procedure. Traceability supports investigation but does not automatically establish food-safety compliance. An AI decision, fermentation forecast or sensor reading is not an approved HACCP record without the established procedure and human approval. Automation cannot independently decide food safety or employee appraisal.

Before actual device/alarm or procedure use, retain evidence for network interruption, erroneous readings, calibration and a manual operating trial, with procedure-linked batch reporting and corrective actions. Assess the specific plant's HACCP/traceability and legal obligations rather than borrowing certification from software. [QLT](specs/quality-monitoring.md) and [FER](specs/fermentation.md) consume this policy; measured forecast quality is not an autonomous safety decision.

### ass-ai-disclosure

Permission-filter source records, citations and aggregates before answering or disclosing information. Redact sensitive/personal data before external egress; failed redaction blocks sending, not merely a warning after disclosure. Approve the selected provider's processing, recipient and retention terms and the applicable privacy/legal basis before real disclosure. Choosing a provider does not satisfy those gates.

The assistant does not autonomously mutate domain data. Show the exact proposed change and require an authorized human's approval before handing it to the owning domain flow; ordinary plan, purchasing, B2B and shift approval controls still apply. Keep source references and verifiable calculations; do not grant broader rights because the interface is natural language. See [AST](specs/owner-assistant.md) and the contact-data boundary in [B2B-REQ-010](specs/b2b-orders.md#b2b-req-010).
