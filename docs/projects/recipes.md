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

**State:** done (synthetic implementation evidence, 2026-11-24). **Readiness:** [ADR-001](../architecture/mvp-zero.md) przyjęty w ramach autonomicznego upoważnienia użytkownika. Native Admin create/read, odmowa 403, zgodne wersje, build/start i późniejsza publikacja mają [dowody](../verification/mvp-zero.md). Rzeczywiste konta/dane nadal wymagają P0.

### TASK-REC-002

**Cel/przepływ:** użytkownik przechodzi przez przeniesione trasy i zachowane obliczenia, nawigację i stany błędów; migracja Next.js App Router zachowuje uzgodnione zachowanie i brutalistyczny motyw.

**Coverage:** historyczne #16 REQ-01–08, AC-01–08, AC-MIG-01; #2 rozdział odpowiedzialności; #25 UI-01–05. Przed zmianą macierz każdej trasy/funkcji: `/`, `/hydration`, `/bake-a-long`, `/bake-history`, `/profile`, kalkulacje serwerowe, puste stany/nawigacja → zachować/przenieść/scalić/wycofać → powód i wynik przed/po. Domyślnie zachować; wycofanie/zmiana znaczenia wymaga jawnej zgody właściciela. Bake Along zinwentaryzować przed workforce; harmonogram domowy nie dowodzi wykonalności produkcji.

**Inputs/exclusions:** zatwierdzony ADR, referencje UI i macierz. Routing/layout/metadane/static, SSR/loadery/query context/devtools oraz `createFileRoute` zastąpić tylko tam, gdzie potrzebne. Przygotować `(app)`/`(payload)`, `/admin`/`/api` bez kolizji, zgodne stabilne wersje, build/start/test/deploy; usunąć tylko nieużywane zależności po migracji. Bez kasowania/modyfikacji trwałych danych bez osobnego planu, kolekcji CMS, POS/AI i redesignu; dostępność/UX zmieniać jawnie. Plan rollback na błąd build/deploy.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-001](#task-rec-001) | Zatwierdzony ADR zgodnego stosu | start |
| contract-input | [TASK-REC-007](#task-rec-007) | Inwentaryzacja i zrzuty powstają w tej migracji przed zmianą widoków, nie drugi wielki sprint | start |
| release-gate | [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | Izolacja, rollback, build i dowody zachowanych funkcji | release |

**State:** implemented, verification in progress. **Readiness:** ADR i macierz powstały przed migracją; wszystkie pięć tras zachowano, bez wycofania funkcji. Pełny build/start, testy kalkulatorów/wizarda i mobile/desktop smoke mają [dowody](../verification/mvp-zero.md); końcowy przegląd i bramka przeglądarki pozostają w toku.

### TASK-REC-003

**Cel/przepływ:** uprawniony redaktor tworzy pełną recepturę, publikuje v1, zmienia surowiec/szkic i odczytuje niezmienną v1 przez API oraz eksport testowego zestawu.

**Coverage:** REC-REQ-001–006, REC-REQ-009, REC-REQ-011, REC-REQ-014–015; REC-AC-001–007, REC-AC-014 (wejścia/publikacja). Wejścia: stabilne surowce, dodatnie masy w g, dodatnie całkowite N, pełny skład i klasyfikacja zakwasu albo jawny brak, opis i proces; prawa redakcji, publikacji, odczytu i eksportu. Samodzielny wariant, nie dziedziczenie; bez cen, magazynu, partii i planu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-002](#task-rec-002) | Docelowa aplikacja i realna DB/API | start |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [REC-REQ-002](../specs/recipes.md#rec-req-002) | Zamrożone wartości i zgodność publikacji | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003), [TASK-ASS-005](engineering-assurance.md#task-ass-005), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | P0: wszystkie API, prywatność, restore i release | release |

**State:** implemented, verification in progress. **Decision gate:** [DEC-001](../decisions.md#dec-001) zatwierdzona przez użytkownika. **Proof:** rzeczywista izolowana SQLite, pełna publikacja i historia, walidacja, role/odmowy, eksport, atomowa awaria, konkurencja i odtworzenie mają [dowody](../verification/mvp-zero.md). Końcowy przegląd i bramka przeglądarki pozostają w toku; P0 rzeczywistych danych nie jest zatwierdzone.

### TASK-REC-004

**Cel/przepływ:** piekarz otwiera listę publikacji, szuka nazwy, odczytuje wersję/skład/proces, rozpoznaje pusty wynik i ponawia nieudane pobranie. Edycja pozostaje w adminie.

**Coverage:** REC-REQ-001, REC-REQ-004, REC-REQ-006–007; REC-AC-003–005, REC-AC-007–009. Wejścia: tożsamość, uprawnienia i autoryzowane publikacje; bez edycji, kolejnego motywu, sortowania czy paginacji narzuconych bez źródła.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-003](#task-rec-003) | Publikacja/API przed połączoną demonstracją na trwałych danych | demonstration |
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001) | Fixture listy może powstać wcześniej | start |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-REC-007](#task-rec-007) | Odmowa prywatnego odczytu, spójne UI | release |

**State:** implemented, verification in progress. **Proof:** połączony katalog `/recipes`, trzy syntetyczne publikacje i odizolowany szkic, filtr/pusty stan, wersja/proces, błąd API i skuteczne ponowienie mają [dowody](../verification/mvp-zero.md). Końcowy przegląd i bramka przeglądarki pozostają w toku.

### TASK-REC-005

**Cel/przepływ:** piekarz z katalogu wybiera 10/15/20/30 szt., g/kg/% i odczytuje jednocześnie masy/procenty; niczego nie zapisuje.

**Coverage:** REC-REQ-001–002, REC-REQ-004, REC-REQ-008–012; REC-AC-002, REC-AC-004–005, REC-AC-010–014. Wejścia: pełna historyczna baza, N i T, wkład zakwasu i rodzaje mąki. Dowolne T w formularzu jest opcjonalne; bez AI, zapisu planu, prognozy, strat czy czasu fermentacji.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-REC-004](#task-rec-004) | Kontrolki w działającym katalogu; nie izolowana arytmetyka | demonstration |
| optional-adapter | [DEM-REQ-007](../specs/demand.md#dem-req-007), [PLN-REQ-001](../specs/production-plans.md#pln-req-001) | Późniejsze T i odbiorca planu | demonstration |
| release-gate | [TASK-REC-007](#task-rec-007), [TASK-ASS-006](engineering-assurance.md#task-ass-006) | UI i testy presetów bez mutacji | release |

**State:** implemented, verification in progress. **Decision gate:** zatwierdzona DEC-001 jest wdrożona. **Proof:** presety 8/12/16/24 kg, 10→30→10, g/kg/%, podział mąki, zakwas liczony raz i jawny brak kompozycji są sprawdzone jednostkowo i w połączonej przeglądarce; [dowody](../verification/mvp-zero.md). Końcowy przegląd i bramka przeglądarki pozostają w toku.

### TASK-REC-006

**Cel/przepływ:** redaktor i wyznaczony decydent opracowują dwuproduktowy przykład wspólnego ciasta, rozstrzygają kompozycję, zaawansowaną hydrację i uzysk oraz zapisują dokładne następne AC. To ograniczona analiza rozpoznawcza, nie gotowa implementacja rozszerzenia.

**Coverage:** REC-REQ-013 / REC-AC-015; granice REC-REQ-001, REC-REQ-011. Wejścia: pełna baza, dodatki i produkty oraz skład mąka/woda. Wyłączenia: automatyczne dziedziczenie przed decyzją, prognostyczny FER, wybór schematu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [REC-REQ-009](../specs/recipes.md#rec-req-009), [EVT-REQ-012](../specs/production-records.md#evt-req-012) | Pełny skład, historia i obserwowany uzysk | start |
| release-gate | [DEC-003](../decisions.md#dec-003) | Przyjęte reguły i konkretne AC przed następną implementacją, nie przed analizą rozpoznawczą lub MVP-0 | release |

**State:** not-started. **Readiness:** analiza rozpoznawcza może się rozpocząć; zakres następnego zadania produktowego zostanie ograniczony po decyzji, nie jest ono obecnie przedstawiane jako gotowe do rozpoczęcia. **Proof:** zaakceptowany dwuproduktowy przykład, pełne wejścia, wyjścia i jednostki, publikacja i odtworzenie, brak podwójnego naliczenia masy, jawne braki i niezmienna v1; wskazana osoba i artefakt decyzji. Dowody: brak.

### TASK-REC-007

**Cel/przepływ:** użytkownik migrowanego formularza i katalogu otrzymuje te same tokeny/komponenty oraz dostępne stany; autor porównuje referencje przed/po.

**Coverage:** historyczne #25 TODO1–9, UI-01–05, AC-01–06; #16 UI. Właściciel: [design system](../design-system.md#3-zasady-budowy-i-rozwijania-biblioteki), [UI acceptance](../design-system.md#6-kryteria-akceptacji-dla-prac-nad-ui). Inwentaryzacja PageLayout/InputField/nagłówków/kart/nawigacji i `src/styles.css`; wspólne tokeny i React/TS/CSS Modules. Nowe Button/Select/statusy/formy tylko według realnej potrzeby; API/warianty/stany i przykład, nie cały pakiet npm ani kosztowny Storybook bez uzasadnienia. Komponent feature pozostaje przy feature, ogólny jest współdzielony. Payload Admin może zachować natywny wygląd.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-002](#task-rec-002) | Referencje/inwentaryzacja przed zmianą w migracji; porównanie na jej widokach, nie cykl blockerów | demonstration |
| optional-adapter | [TASK-OBS-001](production-recording.md#task-obs-001), [TASK-MAP-001](flow-map.md#task-map-001) | Późniejsze komponenty ekranu produkcji i mapy dostarczają własne dowody zgodności | demonstration |

**State:** implemented, verification in progress. **Readiness:** zachowane tokeny/CSS Modules i istniejące PageLayout/InputField/Button; nowy katalog pozostaje komponentem feature. Referencje przed/po oraz telefon/tablet/desktop są w [dowodach](../verification/mvp-zero.md). Końcowa kontrola dostępności i porównanie wizualne pozostają w toku; natywny Admin korzysta z dozwolonego wyjątku.

**Dowody uzupełniające TASK-REC-002/003/004/005, 2026-11-25:** [Wybrane poprawki przeglądu](../verification/mvp-zero.md#selected-review-fixes--2026-11-25) obejmują ponowienie błędnego klucza kalkulatora, odmowę nieobsługiwanej publikacji zbiorczej przed zapisem, sumę udziałów mąki 100%, migracje/odtworzenie i autoryzowany produkcyjny HTTP smoke. Dodatkowo sprawdzono ignorowanie nieaktualnych odpowiedzi katalogu, wyczyszczenie opcjonalnej masy porcji oraz trwałość zapisu po konkurencji i rzeczywistej awarii COMMIT, także niezależnym połączeniem i procesem po odtworzeniu. Cel migracji jest dekodowany i kanonizowany przed kontrolą backupu, a test awarii potwierdza wykonanie DDL przed zamierzonym błędem. Stany zadań pozostają „verification in progress”; końcowy przegląd/przeglądarka/CI i P0 rzeczywistych danych nie są zatwierdzone.

**Dowody poprawek przeglądarki, 2026-11-25:** [Reprodukcja i ponowna kontrola F1–F5](../verification/mvp-zero-browser.md#correction-recheck--2026-11-25) obejmuje wywołania kalkulatorów poza renderem, stałą kolejność hooków pomocy, wygenerowaną mapę importów Admin oraz fokus/Escape i ograniczony ruch nawigacji. [Końcowa kontrola siedmiu tras](../verification/mvp-zero-browser.md#final-browser-closure--2026-11-25) na tym samym poprawionym źródle zakończyła się PASS, bez nieoczekiwanych błędów konsoli i strony; zachowuje jawne pominięcia oraz wcześniejsze dowody publikacji, historii i odzyskiwania, bez ponowienia każdej kombinacji przepływu i szerokości. Dane są syntetyczne; nie jest to zatwierdzenie P0. Stany TASK-REC-002/003/004/005/007 pozostają „verification in progress”; publikacja gałęzi i CI należą do nadrzędnego procesu.

### TASK-REC-008

**Cel/przepływ (późniejsze rozszerzenie):** redaktor na zaakceptowanym przykładzie wspólnej bazy i dwóch produktów zapisuje różnice, publikuje i ponownie odczytuje pełne składy/pochodzenie oraz uzgodnione zaawansowane założenia hydracji i uzysku. Wcześniejsza samodzielna publikacja pozostaje niezmienna.

**Coverage:** REC-REQ-013 / REC-AC-015; REC-REQ-001, REC-REQ-004, REC-REQ-009, REC-REQ-011 jako wiążące granice kompletności, historii i braków. Wejścia: pełna baza, jawne różnice i wkład mąki, wody i rodzajów mąki, przyjęta reguła kompozycji, hydracji i uzysku oraz jej konkretne AC. Wyłączenia: narzucenie dziedziczenia lub alokacji przed decyzją, prognostyczny FER, zmiana MVP-0 lub automatyczna zmiana rzeczywistego uzysku.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [TASK-REC-006](#task-rec-006) | Zaakceptowany wynik analizy rozpoznawczej i doprecyzowane AC, nie fikcyjny implementacyjny poprzednik decyzji | start |
| implementation-prerequisite | [TASK-REC-003](#task-rec-003) | Działająca publikacja/historyczny odczyt przed połączonym demo rozszerzenia | demonstration |
| release-gate | [TASK-ASS-002](engineering-assurance.md#task-ass-002), [TASK-ASS-003](engineering-assurance.md#task-ass-003) | Autoryzacja, historia, walidacja i restore rozszerzonych publikacji | release |

**State:** blocked. **Decision gates:** [DEC-003](../decisions.md#dec-003) przed implementacją kompozycji, hydracji i uzysku; DEC-001 oddzielnie przy utrwalanych masach. **Readiness:** źródłowy rezultat zachowany, brakujące reguły i dokładne AC nie pozwalają deklarować gotowości funkcji do rozpoczęcia implementacji; analiza rozpoznawcza może ruszyć bez tej implementacji. **Proof:** zaakceptowany dwuproduktowy przykład odtworzony po publikacji i ponownym otwarciu, pełny skład i pochodzenie bez podwójnego naliczenia masy; brak kompozycji daje niekompletność zamiast dokładnej hydracji, historyczna v1 i odmowa uprawnień pozostają poprawne. Dowody: brak.
