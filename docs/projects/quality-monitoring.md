# QLT — Urządzenia, alarmy i decyzja człowieka

Owner [QLT](../specs/quality-monitoring.md). [Common evidence](README.md#common-evidence). Rzeczywista procedura zakładowa i profil progów określają kwalifikację użycia, nie wymyśloną politykę globalną.

### TASK-QLT-001

**Cel/przepływ:** operator monitoruje jedno krytyczne urządzenie wybrane analizą ryzyka, rozpoznaje alarmy czujnika, sieci, kalibracji i zakresu, zapisuje przegląd, czyszczenie, naprawę lub działanie ze wskazaniem człowieka i dowodu oraz wiąże je z partią. **Coverage:** QLT-REQ-001–005, QLT-REQ-008 / QLT-AC-001–003, QLT-AC-004 (partia), QLT-AC-006. Wejścia: rzeczywiste urządzenie i źródło, znaczniki czasu, °C i jakość pomiaru, wybrana procedura i wersja, czas reakcji alarmu, odbiorca i ważność kalibracji. Bez CV/AI/CAPP i certyfikacji HACCP.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| contract-input | [REC-REQ-001](../specs/recipes.md#rec-req-001), [EVT-REQ-001](../specs/production-records.md#evt-req-001) | Tożsamość produktu i partii bez bramki pełnego schematu | start |
| release-gate | [TASK-ASS-008](engineering-assurance.md#task-ass-008), [QLT-REQ-007](../specs/quality-monitoring.md#qlt-req-007) | Dowody prób rzeczywistego urządzenia, awarii i procedury ręcznej oraz uprawnienia człowieka przed wydaniem | release |

**State:** not-started. **Decision gates:** profile urządzenia i procedury są wejściami przed demonstracją sprzętu, nie globalną DEC. **Readiness:** możliwy zestaw testowy, rzeczywisty sprzęt i procedura niezweryfikowane. **Proof:** po awarii ostatni poprawny odczyt nie daje zielonego stanu; cztery typy usterek są rozróżnione, duplikat źródłowy liczony raz, potwierdzenie odbioru alarmu nie oznacza usunięcia przyczyny. Konserwacja i działanie mają autora, czas i dowód; nieznanej partii nie zgaduje się. Odmowa zatwierdzenia lub przekroczenie czasu oczekiwania nie oznaczają sukcesu. Dowody: brak.

### TASK-QLT-002

**Cel/przepływ:** osoba odpowiedzialna za bezpieczeństwo żywności odczytuje kompletny raport powiązany z procedurą i jawnie zapisuje decyzję po próbach awarii i procedury ręcznej. **Coverage:** QLT-REQ-006–007 / QLT-AC-004 (przegląd), QLT-AC-005. Wejścia: rzeczywista zatwierdzona procedura, rola, wersja i reguły zamknięcia; bez automatycznej decyzji bezpieczeństwa na podstawie danych, AI lub kompletności raportu.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| implementation-prerequisite | [TASK-QLT-001](#task-qlt-001) | Rzeczywisty raport dziennika, alarmów i działań | demonstration |
| release-gate | [TASK-ASS-008](engineering-assurance.md#task-ass-008), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Ocena stosowania HACCP i identyfikowalności, rzeczywista procedura i zatwierdzenie człowieka; nie certyfikat | release |

**State:** not-started. **Decision gates:** istniejące kwalifikacje prawne i proceduralne oraz wyznaczona osoba zatwierdzająca w domenie, nie wymyślone progi lub globalna DEC. **Readiness:** kontrakt określony, brak dowodów procedury i prób awarii. **Proof:** awaria sieci 08:00–08:20 oraz próby błędnego odczytu, kalibracji i postępowania ręcznego; wykrycie o 08:03 od początku 08:00 daje 3 min. Raport ujawnia utratę danych, straty i kompletność dokumentacji bez fikcyjnych odzyskanych pomiarów; decyzja wskazuje osobę, wersję i datę, a brak uprawnienia skutkuje odmową zatwierdzenia. Dowody: brak.

### TASK-QLT-003

**Cel/przepływ:** osoba oceniająca opcjonalnie porównuje kolor skórki, rozmiar, kształt i nacięcia z zatwierdzoną referencją oraz odczytuje pomocnicze różnice jakości. **Coverage:** QLT-REQ-009 / QLT-AC-007. Wejścia: wybrany zakres obrazu i referencja człowieka; monitoring działa bez CV. Bez identyfikacji lub oceny pracowników i autonomicznych decyzji bezpieczeństwa.

| Type | Target | Scope / condition | Phase |
|---|---|---|---|
| optional-adapter | [QLT-REQ-009](../specs/quality-monitoring.md#qlt-req-009) | Źródło obrazu z kamery i osobny wybór zakresu | demonstration |
| release-gate | [TASK-ASS-008](engineering-assurance.md#task-ass-008), [TASK-ASS-005](engineering-assurance.md#task-ass-005) | Osobne zatwierdzenie wartości, konieczności, proporcjonalności, prywatności i podstaw prawnych przed wdrożeniem | release |

**State:** not-started. **Decision gates:** opcjonalne przyjęcie rozwiązania i przegląd prawny, nie globalna blokada innych zadań QLT. **Readiness:** wejścia dotyczące wartości, referencji i uprawnień są niezweryfikowane. **Proof:** po wyłączeniu kamery dziennik i alarmy nadal działają; pomocnicza różnica nacięcia nie oznacza zatwierdzenia. Bez odrębnego przeglądu nie ma wdrożenia; pracownicy nie są oceniani. Dowody: brak.
