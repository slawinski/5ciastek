# FER — Obserwacje i prognoza fermentacji

Owner [FER](../specs/fermentation.md). [Task/evidence contract](README.md#task-contract). Ręczne okna PRC nie wymagają tego projektu.

### TASK-FER-001

**Cel/przepływ:** piekarz zapisuje kontekst partii, temperaturę i czas fermentacji w masie, rozrostu i chłodzenia, opcjonalne pH, kwasowość, wilgotność i aktywność zakwasu, ocenę, wynik i zdjęcie oraz ponownie odczytuje historię. **Coverage:** FER-REQ-001–004, FER-REQ-009 / FER-AC-001–003, FER-AC-007 (historia i dostęp). Wejścia: wersja REC, mąka, hydracja, udział zakwasu i sól z podstawami odniesienia, rozróżnienie temperatury ciasta i urządzenia, historia zakwasu, czas i źródło; brak opcjonalnego pomiaru nie blokuje przepływu. Bez deklarowania gotowości modelu lub zatwierdzenia HACCP.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001), [EVT-REQ-002](../specs/production-records.md#evt-req-002) | Historyczny skład i pochodzenie korekt; dopuszczone ręczne obserwacje ze źródłem | start |
| release-gate | [FER-REQ-004](../specs/fermentation.md#fer-req-004), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Rzeczywisty kontekst i ocena własnych partii przed deklaracją kalibracji oraz ochrona zdjęć | release |

**State:** not-started. **Decision gate:** DEC-002 tylko dla wspólnego trwałego strumienia obserwacji, DEC-001 dla zależnych mas. **Readiness:** skala oceny i punkt stwierdzenia gotowości muszą pochodzić od piekarza lub z procedury jako wejście z określoną kwalifikacją, nie uniwersalna DEC. **Proof:** historia pozostaje niezmienna po edycji receptury; 20% bez znanej podstawy jest oznaczone jako niejednoznaczne. Temperatury ciasta 24/25 i urządzenia 4°C są rozróżnione, noc i luki pomiarów widoczne, brak pH dozwolony; 1→1,8 l daje przyrost 0,8. Brak oceny nie oznacza wyniku dobrego; sprawdzić odmowę edycji i dostępu do historii. Dowody: brak.

### TASK-FER-002

**Cel/przepływ:** osoba kalibrująca buduje prosty model bazowy regułowy lub kinetyczny temperatura–czas na własnych partiach, wersjonuje go, prognozuje okno kontroli i niepewność oraz porównuje nowe partie z oceną doświadczonego piekarza i rzeczywistym wypiekiem. **Coverage:** FER-REQ-005–009 / FER-AC-004–007. Wejścia: jawne założenia, kontekst, parametry modelu bazowego, niepewność i dostarczona reguła alarmowa; wady wypieków, stabilność jakości i koszt czujników. Bez nowego modelu mikrobiologicznego, automatycznej decyzji o gotowości lub bezpieczeństwie ani wymyślonego progu temperatury, błędu lub długości historii.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-FER-001](#task-fer-001) | Wersjonowane obserwacje własnych partii | demonstration |
| optional-adapter | [OPT-REQ-004](../specs/optimization.md#opt-req-004) | Późniejsze użycie prognozy, nie zależność blokująca w przeciwnym kierunku | demonstration |
| release-gate | [FER-REQ-008](../specs/fermentation.md#fer-req-008), [TASK-ASS-008](engineering-assurance.md#task-ass-008) | Weryfikacja piekarza na nowych partiach i stosowna procedura rzeczywistego użycia do kontroli jakości | release |

**State:** not-started. **Decision gates:** metoda, model bazowy i kryterium oceny należą do ograniczonego planu zadania; profile, kalibracja i ocena to wejścia z określoną kwalifikacją, nie nowa DEC dla całego produktu. **Readiness:** rezultat określony, brak danych empirycznych i planu. **Proof:** P1–10 użyte do kalibracji nie są P11 używaną do walidacji; 12:00 wobec 12:20 daje błąd 20. Niepewność i brak kontekstu dają ostrzeżenie; 4→9°C uruchamia dostarczoną regułę alarmową, nie decyzję bezpieczeństwa. Wersja v2 nie nadpisuje starej ocenionej prognozy; brak danych o wadach, stabilności lub koszcie nie oznacza 0. Dowody: brak.
