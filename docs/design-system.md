# KoPieC OS — design system i biblioteka komponentów

**Status:** obowiązująca wytyczna projektu. Punktem odniesienia jest interfejs 5ciastek na gałęzi `main` w chwili rozpoczęcia migracji. Dokument określa kierunek, nie twierdzi, że powstała już kompletna biblioteka komponentów.

## 1. Kierunek wizualny

**KoPieC OS musi zachować istniejący charakter 5ciastek: web brutalism / neo-brutalism.** Nie wprowadzać nowego motywu z powodu migracji do Next.js, integracji Payload ani instalacji biblioteki komponentów.

Źródła istniejącego stylu:
- [src/styles.css](../src/styles.css) — zmienne kolorów, typografia, obramowania, cienie, podstawowe klasy.
- [src/components/PageLayout/PageLayout.module.css](../src/components/PageLayout/PageLayout.module.css) — układ strony, tytuły i karty.
- Istniejące komponenty i ich CSS Modules stanowią wzorce dla nowych komponentów.

Przed migracją zachować zrzuty referencyjne aktualnych ekranów mobilnych i desktopowych. Porównać je po migracji. Nie wymaga się ślepego kopiowania błędów UX lub dostępności.

## 2. Zastane tokeny (stan początkowy)

**Kolory — `src/styles.css`:**

| Token | Wartość |
| --- | --- |
| `--color-black` | `#000000` |
| `--color-white` | `#ffffff` |
| `--color-pink` | `#ff90e8` |
| `--color-yellow` | `#ffd338` |
| `--color-green` | `#05ff00` |
| `--color-grey-soft` | `#f0f0f0` |
| `--border-width` | `3px` |
| `--shadow-offset` | `6px` |
| `--font-mono` | Roboto Mono, monospace |
| `--font-sans` | Inter, system sans-serif |

**Charakterystyczne reguły:**
- Widoczne czarne obramowania, kontrastowe tła i cienie bez rozmycia (offset shadow).
- Mocne nagłówki o kroju monospace, dużym ciężarze i często wielkich literach.
- Proste geometryczne powierzchnie. Nie zastępować stylu przypadkowymi gradientami, subtelnymi cieniami, glassmorphism lub domyślnym wyglądem gotowego UI kitu.
- Widoczne, zrozumiałe stany interakcji. Nie opierać znaczenia wyłącznie na kolorze.
- Reużywać tokeny zamiast kopiować wartości do nowych komponentów. Ewentualne zmiany tokenów wprowadzać świadomie, z opisem wpływu na istniejące ekrany.

## 3. Zasady budowy i rozwijania biblioteki

**Biblioteka komponentów KoPieC OS musi powstawać stopniowo na podstawie istniejących komponentów 5ciastek.**

1. Przed dodaniem komponentu sprawdź, czy istnieje odpowiedni wzorzec. W pierwszej kolejności rozbuduj istniejący komponent.
2. Zdefiniuj lub wykorzystaj współdzielone tokeny kolorów, obramowań, typografii, odstępów i stanów. Zmiany wprowadź w jednym miejscu.
3. Komponent ogólny dodaj do współdzielonej biblioteki. Komponent specyficzny dla jednej funkcji pozostaw przy tej funkcji, dopóki nie pojawi się realna potrzeba ponownego użycia.
4. Stosuj React, TypeScript i CSS Modules zgodnie z istniejącą strukturą. Next.js i Payload nie wymagają zmiany tych zasad.
5. Jeśli korzystasz z gotowej biblioteki zachowań (np. headless primitives), dostosuj jej wizualną warstwę do tokenów KoPieC OS. Nie importuj domyślnego stylu sprzecznego z projektem.
6. Każdy komponent musi mieć opis API, stanów, wariantów oraz przykład zastosowania. Dla wspólnych komponentów utrzymuj prosty katalog przykładów lub Storybook, jeśli skala to uzasadni.
7. Nowe komponenty muszą obsługiwać: stan normalny, focus, disabled, loading, błąd oraz pusty stan — jeżeli dany stan dotyczy komponentu.
8. Stosuj semantyczne elementy HTML. Zapewnij obsługę klawiatury, widoczny focus i odpowiedni kontrast. Motyw nie może blokować dostępności.
9. Dostosuj układ i wielkość powierzchni dotykowych do użycia w piekarni na telefonie i tablecie. Nie zmieniaj tego wymogu w dekoracyjny efekt.
10. Weryfikuj zmianę w widoku mobilnym i desktopowym, również w trybie wysokiego powiększenia. Zapewnij czytelny tekst oraz obsługę `prefers-reduced-motion`, gdy występują animacje.

## 4. Początkowy katalog komponentów

**Ponownie wykorzystać lub ujednolicić istniejące:** `PageLayout`, `InputField`, nagłówki, karty i podstawowe wzorce nawigacji.

**Dodawać, gdy wymaga tego funkcja:** `Button`, `Select`, `NumberInput`, `Tabs` / `SegmentedControl`, `StatusBadge`, `Alert`, `Dialog`, `DataTable`, `EmptyState`, `LoadingState`, `Confirmation` i odpowiednie elementy formularzy.

**Komponenty domenowe** (np. `RecipeIngredientsTable`, `BatchActivityControl`, `WorkerCountSelector`) wykorzystują elementy współdzielone, ale nie stają się częścią biblioteki ogólnej wyłącznie dlatego, że są renderowane w więcej niż jednym miejscu.

To lista kandydatów, nie polecenie budowy wszystkich komponentów w MVP-0.

## 5. Granica między KoPieC OS i Payload CMS

- **KoPieC OS**: interfejs dla piekarzy, produkcji i operacji. Obowiązuje design system opisany w tym dokumencie.
- **Payload Admin**: narzędzie administracyjne do zarządzania treścią i konfiguracją. Może używać własnego interfejsu. Nie trzeba stylizować każdej części panelu Payload na web brutalism w MVP-0.
- Jeśli w przyszłości funkcja administracyjna trafi do KoPieC OS, jej interfejs musi korzystać z biblioteki KoPieC OS.

## 6. Kryteria akceptacji dla prac nad UI

- [ ] Zmiana używa istniejących tokenów i komponentów albo dokumentuje powód wprowadzenia nowego.
- [ ] Nowy współdzielony komponent jest wizualnie zgodny z web brutalism 5ciastek.
- [ ] Komponent obsługuje wymagane stany, semantykę i interakcje klawiatury.
- [ ] Widok jest poprawny na telefonie i desktopie. Przy zadaniach produkcyjnych sprawdzić także tablet.
- [ ] Test lub porównanie wizualne wykrywa niezamierzone odstępstwa od stylu.
- [ ] Migracja Next.js nie powoduje nieuzgodnionej zmiany palety, typografii, obramowań ani stylu kart i przycisków.

## Stable control interface

### ui-design

This document remains the UI policy owner. Preserve the existing brutalist tokens, typography, borders, hard shadows and CSS Modules above. Inventory existing screens/components and capture mobile/desktop references before migration; compare actual changed screens afterwards without perpetuating known accessibility defects. Reuse or extend existing patterns before adding components. Keep generic primitives shared and feature-specific components with their feature; document APIs, states, variants and examples incrementally. Candidate components are not a mandate to build the entire catalog or install Storybook.

Current maintenance retains the [current stack](index.md#current-stack-and-applicability). Future architecture/migration belong to [TASK-REC-001](projects/recipes.md#task-rec-001) and [TASK-REC-002](projects/recipes.md#task-rec-002); neither library adoption nor migration authorizes an arbitrary reskin. Native Payload Admin may retain its own UI under section 5's exception; an administrative feature moved into KoPieC OS follows this design system. Shared UI delivery belongs to [TASK-REC-007](projects/recipes.md#task-rec-007), not a new policy owner.

### ui-accessibility

For each affected component/screen, verify semantic HTML, keyboard operation, visible focus, contrast, descriptive accessible names and usable touch targets. Check phone, production tablet and desktop, including high zoom. Preserve readable text and information when motion is stopped or `prefers-reduced-motion` is active. Meaning must not depend on color or motion alone. Map controls and their alternative accessible list must expose the same states and quantities ([MAP-REQ-010](specs/flow-map-demo.md#map-req-010)).

Provide normal, focus, disabled, loading, empty, error and permission-denied states wherever applicable; distinguish failed retrieval from an empty result and an unconfirmed write from success. Business/UI text is Polish. Verification must exercise actual changed screens and interactions; a documentation screenshot, component list or approved specification is not accessibility or visual-regression evidence. The existing acceptance checklist above still applies.

Historical provenance: #25 and the UI clauses of #15/#16/#17/#19/#31/#32/#41 are mapped in [policy coverage](migrations/spec-library/coverage.md#policy-handoff). Canonical capability specs own feature behavior; project task sections alone own delivery state.
