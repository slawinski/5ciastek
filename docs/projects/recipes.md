# REC — Receptury i docelowa architektura

Rezultat MVP-0 i późniejsze niezależne rozszerzenie. Reguły: [REC](../specs/recipes.md); forma i wspólne dowody: [task contract](README.md#task-contract).

### TASK-REC-001

**Cel/przepływ:** administrator otwiera testowy Payload Admin, dodaje Recipes, a frontend odczytuje publikację autoryzowanym interfejsem. Ograniczony spike kończy się zatwierdzonym ADR, nie migracją aplikacji.

**Coverage:** historyczne #13 AC-01–05 oraz #2 wybór architektury; engineering task, bez nowej domeny. Jeden projekt Next.js App Router + natywny stabilny Payload: frontend/admin/API. Bez uzasadnionego odstępstwa nie wybierać beta adaptera TanStack. Bezpośrednio przed implementacją sprawdzić wspierane Next/Payload/React/TS/Node/adapter DB, `@payloadcms/next`, `withPayload`, grupy tras i `/admin`; wybrać PostgreSQL albo SQLite z uzasadnieniem uruchomienia/backup/migracji. To zachowane wymagania przyszłego spike, nie instrukcja zmiany obecnego stosu.

**Inputs/exclusions:** środowisko docelowe i zgodne zależności; bez pełnego modelu receptur, katalogu, migracji tras, produkcji/AI. ADR obejmuje deployment, media, DB, ograniczenia i ryzyka, granice Next/Payload/Local API, auth/trust, backup/restore i P0.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-ASS-001](engineering-assurance.md#task-ass-001) | Macierz zagrożeń/aktorów do ADR, bez całego assurance jako start blocker | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | P0 przed rzeczywistymi kontami/danymi; syntetyczny PoC nie potwierdza bramek | release |

**State:** not-started. **Readiness:** zakres spike określony; plan techniczny/środowisko i zatwierdzenie ADR jeszcze bez dowodu. **Decision gates:** brak wyboru domenowego; wersje/DB/deployment to rezultat spike. **Proof:** admin dodaje testową recepturę, frontend czyta publikację, nieuprawniony zapis odrzucony, build/start na zapisanych wersjach; ADR z bazą, deploymentem, zagrożeniami i dowodami. Evidence: brak.

### TASK-REC-002

**Cel/przepływ:** użytkownik przechodzi przez przeniesione trasy i zachowane obliczenia, nawigację i stany błędów; migracja Next.js App Router zachowuje uzgodnione zachowanie i brutalistyczny motyw.

**Coverage:** historyczne #16 REQ-01–08, AC-01–08, AC-MIG-01; #2 rozdział odpowiedzialności; #25 UI-01–05. Przed zmianą macierz każdej trasy/funkcji: `/`, `/hydration`, `/bake-a-long`, `/bake-history`, `/profile`, kalkulacje serwerowe, puste stany/nawigacja → zachować/przenieść/scalić/wycofać → powód i wynik przed/po. Domyślnie zachować; wycofanie/zmiana znaczenia wymaga jawnej zgody właściciela. Bake Along zinwentaryzować przed workforce; harmonogram domowy nie dowodzi wykonalności produkcji.

**Inputs/exclusions:** zatwierdzony ADR, referencje UI i macierz. Routing/layout/metadane/static, SSR/loadery/query context/devtools oraz `createFileRoute` zastąpić tylko tam, gdzie potrzebne. Przygotować `(app)`/`(payload)`, `/admin`/`/api` bez kolizji, zgodne stabilne wersje, build/start/test/deploy; usunąć tylko nieużywane zależności po migracji. Bez kasowania/modyfikacji trwałych danych bez osobnego planu, kolekcji CMS, POS/AI i redesignu; dostępność/UX zmieniać jawnie. Plan rollback na błąd build/deploy.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-001](#task-rec-001) | Zatwierdzony ADR zgodnego stosu | start |
| contract-input | [TASK-REC-007](#task-rec-007) | Inwentaryzacja i zrzuty powstają w tej migracji przed zmianą widoków, nie drugi wielki sprint | start |
| release-gate | [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Izolacja, rollback, build i dowody zachowanych funkcji | release |

**State:** not-started. **Readiness:** macierz i ADR wymagają dowodów przed migracją; decyzje o wycofaniu tylko per funkcja. **Proof:** produkcyjny build/start, `/` bez 500, brak nieobsłużonej hydratacji/nawigacji, test zachowanego zachowania i load failure każdej pozycji macierzy, mobile/desktop przed/po, tokeny/CSS Modules i bezkolizyjny admin. Evidence: brak.

### TASK-REC-003

**Cel/przepływ:** uprawniony redaktor tworzy pełną recepturę, publikuje v1, zmienia surowiec/szkic i odczytuje niezmienną v1 przez API oraz eksport testowego zestawu.

**Coverage:** REC-REQ-001–006, REC-REQ-009, REC-REQ-011, REC-REQ-014–015; REC-AC-001–007, REC-AC-014 (wejścia/publikacja). Inputs: stabilne surowce, dodatnie masy g, N całkowite dodatnie, pełny skład/klasyfikacja zakwasu albo jawny brak, opis/proces; prawo redakcji/publikacji/odczytu/eksportu. Samodzielny wariant, nie dziedziczenie; bez cen/magazynu/partii/planu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-002](#task-rec-002) | Docelowa aplikacja i realna DB/API | start |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [REC-REQ-002](../specs/recipes.md#rec-req-002) | Zamrożone wartości i zgodność publikacji | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | P0: wszystkie API, prywatność, restore i release | release |

**State:** blocked. **Decision gate:** [DEC-001](../decisions.md#dec-001), start trwałej reprezentacji/walidacji publikacji. **Readiness:** kontrakt podstawowy określony; dokładny fixture/UI możliwy, ale nie rozstrzyga precyzji. **Proof:** 500+350+10=860; 4000/5=800 kontra 750; odrzucenie 0/ujemnych/N ułamkowego/dodatków-only; v1 zachowuje kompozycję po edycji i v2; wyszukiwanie redaktora, eksport relacji/mas i odmowy API, awarie publikacji/restore. Evidence: brak.

### TASK-REC-004

**Cel/przepływ:** piekarz otwiera listę publikacji, szuka nazwy, odczytuje wersję/skład/proces, rozpoznaje pusty wynik i ponawia nieudane pobranie. Edycja pozostaje w adminie.

**Coverage:** REC-REQ-001, REC-REQ-004, REC-REQ-006–007; REC-AC-003–005, REC-AC-007–009. Inputs: tożsamość/uprawnienia i autoryzowane publikacje; bez edycji/kolejnego motywu/sortowania czy paginacji narzuconych bez źródła.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-003](#task-rec-003) | Publikacja/API przed połączoną demonstracją na trwałych danych | demonstration |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001) | Fixture listy może powstać wcześniej | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-REC-007](#task-rec-007) | Odmowa prywatnego odczytu, spójne UI | release |

**State:** not-started. **Decision gates:** DEC-001 tylko w odziedziczonej publikacji, nie formatowaniu listy. **Readiness:** contract/fixture dostępny; integracja wymaga dowodu publikacji. **Proof:** 3 publikacje + szkic → 3 dostępne; wyszukiwanie trafione/puste; 500/350 g = 850, kolejność i historyczny skład; API error ≠ pusty katalog, retry odzyskuje, klawiatura/mobile/desktop. Evidence: brak.

### TASK-REC-005

**Cel/przepływ:** piekarz z katalogu wybiera 10/15/20/30 szt., g/kg/% i odczytuje jednocześnie masy/procenty; niczego nie zapisuje.

**Coverage:** REC-REQ-001–002, REC-REQ-004, REC-REQ-008–012; REC-AC-002, REC-AC-004–005, REC-AC-010–014. Inputs: pełna historyczna baza/N/T, wkład zakwasu i rodzaje mąki. Dowolne T w formularzu opcjonalne; bez AI, zapisu planu, prognozy, strat czy czasu fermentacji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-004](#task-rec-004) | Kontrolki w działającym katalogu; nie izolowana arytmetyka | demonstration |
| optional-adapter | [DEM-REQ-007](../specs/demand.md#dem-req-007), [PLN-REQ-001](../specs/production-plans.md#pln-req-001) | Późniejsze T i odbiorca planu | demonstration |
| release-gate | [TASK-REC-007](#task-rec-007), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | UI i testy presetów bez mutacji | release |

**State:** not-started. **Decision gate:** DEC-001 przed zależnymi ogólnymi/trwałymi obliczeniami, nie dokładnym oracle. **Readiness:** formuła/presety znane; integracja publikacji i precyzja niepotwierdzone. **Proof:** REC-AC-010 pełne masy i 8/12/16/24 kg; 3120 g = 3,12 kg; 10→30→10; 100/78/2/20%; 8 kg mąki 6,4/1,6; 1 kg zakwasu 100% wnosi 0,5 kg mąki raz, nie drugą pozycję ważenia; brak kompozycji nie daje dokładnych %. Evidence: brak.

### TASK-REC-006

**Cel/przepływ:** redaktor i wyznaczony decydent opracowują dwuproduktowy przykład wspólnego ciasta, rozstrzygają kompozycję, zaawansowaną hydrację i uzysk oraz zapisują dokładne następne AC. To bounded discovery, nie gotowa implementacja rozszerzenia.

**Coverage:** REC-REQ-013 / REC-AC-015; granice REC-REQ-001, REC-REQ-011. Inputs: pełna baza, dodatki/produkty i skład mąka/woda. Exclusions: automatyczne dziedziczenie przed decyzją, predictive FER, wybór schematu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [REC-REQ-009](../specs/recipes.md#rec-req-009), [EVT-REQ-012](../specs/production-records.md#evt-req-012) | Pełny skład, historia i obserwowany uzysk | start |
| release-gate | [DEC-003](../decisions.md#dec-003) | Przyjęte reguły i konkretne AC przed następną implementacją, nie przed discovery/MVP-0 | release |

**State:** not-started. **Readiness:** discovery może zacząć; następne produktowe zadanie zostanie ograniczone po decyzji, nie udaje obecnie start-ready. **Proof:** zaakceptowany dwuproduktowy przykład, pełne wejścia/wyjścia/jednostki, publikacja/odtworzenie, brak podwójnej masy, braki i niezmienna v1; osoba/artefakt decyzji. Evidence: brak.

### TASK-REC-007

**Cel/przepływ:** użytkownik migrowanego formularza i katalogu otrzymuje te same tokeny/komponenty oraz dostępne stany; autor porównuje referencje przed/po.

**Coverage:** historyczne #25 TODO1–9, UI-01–05, AC-01–06; #16 UI. Właściciel: [design system](../design-system.md#3-zasady-budowy-i-rozwijania-biblioteki), [UI acceptance](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui). Inwentaryzacja PageLayout/InputField/nagłówków/kart/nawigacji i `src/styles.css`; wspólne tokeny i React/TS/CSS Modules. Nowe Button/Select/statusy/formy tylko według realnej potrzeby; API/warianty/stany i przykład, nie cały pakiet npm ani kosztowny Storybook bez uzasadnienia. Komponent feature pozostaje przy feature, ogólny jest współdzielony. Payload Admin może zachować natywny wygląd.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-002](#task-rec-002) | Referencje/inwentaryzacja przed zmianą w migracji; porównanie na jej widokach, nie cykl blockerów | demonstration |
| optional-adapter | [TASK-OBS-001](production-recording.md#task-obs-001), [TASK-MAP-001](flow-map.md#task-map-001) | Późniejsze komponenty ekranu produkcji i mapy dostarczają własne dowody zgodności | demonstration |

**State:** not-started. **Decision gates:** tylko jawna zgoda na zmianę tokenu/wyglądu, jeśli proponowana; brak mandatu redesignu. **Readiness:** polityka znana, referencje i implementacja wymagają dowodów. **Proof:** telefon/desktop i produkcyjny tablet, zoom, touch/tekst/kontrast, focus/disabled/loading/error/empty jeśli stosowne, klawiatura, reduced-motion i widok bez koloru/ruchu; porównanie wizualne, spójne kontrolki katalogu/produkcji przy ich integracji. Evidence: brak.

### TASK-REC-008

**Cel/przepływ (późniejsze rozszerzenie):** redaktor na zaakceptowanym przykładzie wspólnej bazy i dwóch produktów zapisuje różnice, publikuje i ponownie odczytuje pełne składy/pochodzenie oraz uzgodnione zaawansowane założenia hydracji i uzysku. Wcześniejsza samodzielna publikacja pozostaje niezmienna.

**Coverage:** REC-REQ-013 / REC-AC-015; REC-REQ-001, REC-REQ-004, REC-REQ-009, REC-REQ-011 jako wiążące granice kompletności, historii i braków. Inputs: pełna baza, jawne różnice i wkład mąki/wody/typów, przyjęta reguła kompozycji/hydracji/uzysku i jej konkretne AC. Exclusions: narzucenie dziedziczenia lub alokacji przed decyzją, predictive FER, zmiana MVP-0 lub automatyczna zmiana rzeczywistego uzysku.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-006](#task-rec-006) | Zaakceptowany wynik discovery i doprecyzowane AC, nie fikcyjny implementacyjny poprzednik decyzji | start |
| implementation-prerequisite | [TASK-REC-003](#task-rec-003) | Działająca publikacja/historyczny odczyt przed połączonym demo rozszerzenia | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003) | Autoryzacja, historia, walidacja i restore rozszerzonych publikacji | release |

**State:** blocked. **Decision gates:** [DEC-003](../decisions.md#dec-003) przed implementacją kompozycji/hydracji/uzysku; DEC-001 oddzielnie przy utrwalanych masach. **Readiness:** źródłowy outcome zachowany, brakujące reguły i dokładne AC nie pozwalają deklarować feature start-ready; discovery może ruszyć bez tej implementacji. **Proof:** zaakceptowany dwuproduktowy przykład odtworzony po publikacji/reopen, pełny skład i pochodzenie bez podwójnej masy, brak kompozycji daje niekompletność zamiast dokładnej hydracji, historyczna v1 i odmowa uprawnień pozostają poprawne. Evidence: brak.
