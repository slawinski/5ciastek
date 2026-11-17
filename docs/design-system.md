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

Powiązane Issues: [#1 — roadmapa](https://github.com/slawinski/5ciastek/issues/1), [#16 — migracja](https://github.com/slawinski/5ciastek/issues/16), [#15 — katalog receptur](https://github.com/slawinski/5ciastek/issues/15), [#19 — interfejs produkcyjny](https://github.com/slawinski/5ciastek/issues/19).
