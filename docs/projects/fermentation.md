# FER — Obserwacje i prognoza fermentacji

Owner [FER](../specs/fermentation.md). [Task/evidence contract](README.md#task-contract). Ręczne okna PRC nie wymagają tego projektu.

### TASK-FER-001

**Cel/przepływ:** piekarz zapisuje kontekst partii, temperature/time bulk/proof/retard, opcjonalne pH/kwasowość/wilgotność/aktywność startera, ocenę/wynik/zdjęcie i ponownie odczytuje historię. **Coverage:** FER-REQ-001–004, FER-REQ-009 / FER-AC-001–003, FER-AC-007 (history/access). Inputs: REC version, flour/hydration/inoculum/salt with bases, dough vs device temperature, starter history/time/source; brak opcjonalnego pomiaru nie blocker. Bez gotowości modelu/HACCP approval.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001), [EVT-REQ-002](../specs/production-records.md#evt-req-002) | Historyczny skład i correction provenance, ręczne sourced obserwacje dopuszczone | start |
| release-gate | [FER-REQ-004](../specs/fermentation.md#fer-req-004), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Real own batch context/judgment dla calibration claim i ochrona zdjęć | release |

**State:** not-started. **Decision gate:** DEC-002 tylko shared persistent observation stream, DEC-001 dependent mass. **Readiness:** skala judgment/ready endpoint musi pochodzić od piekarza/procedury jako qualified input, nie uniwersalna DEC. **Proof:**history survives recipe edit;20%unknown basis flagged;dough24/25 vsdevice4°C,overnight/lost readings visible,pH missing allowed;1→1,8l=0,8;missing assessment niegood;denied edit/history. Evidence: brak.

### TASK-FER-002

**Cel/przepływ:** kalibrator buduje prosty rule/kinetic temperature-time baseline na własnych partiach, wersjonuje, prognozuje okno kontroli/uncertainty i porównuje nowe partie z doświadczonym piekarzem oraz wypiekiem. **Coverage:** FER-REQ-005–009 / FER-AC-004–007. Inputs: jawne assumptions/context/baseline parameters/uncertainty and supplied alarm rule; quality defects/stability/sensor cost. Nie nowy microbiological model, automatyczna ready/safety decision lub wymyślony próg temperatury/błędu/history length.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-FER-001](#task-fer-001) | Wersjonowane własne batch observations | demonstration |
| optional-adapter | [OPT-REQ-004](../specs/optimization.md#opt-req-004) | Późniejsze użycie prognozy, nie reverse blocker | demonstration |
| release-gate | [FER-REQ-008](../specs/fermentation.md#fer-req-008), [TASK-ASS-008](engineering-assurance.md#task-ass-008) | New-batch baker validation i stosowna procedura realnego quality use | release |

**State:** not-started. **Decision gates:** metoda/baseline i kryterium oceny w bounded planie; profile/calibration/judgment to qualified inputs, nie nowa product-wide DEC. **Readiness:** outcome specified, empiryczne dane i plan brak. **Proof:**P1–10calibration≠P11validation;12:00vs12:20error20;uncertainty/missing context warning;4→9°C supplied alarm nie safety decision;v2 nie overwrites old assessed prediction;defects/stability/cost missing not0. Evidence: brak.
