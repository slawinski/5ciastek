---
name: "KoPieC OS — zadanie implementacyjne"
about: "Specyfikacja jednej testowalnej zmiany systemu, oparta na zasadach kontrolowanego języka"
title: "[KoPieC OS] "
---

<!-- Przed implementacją: docs/specification-style.md oraz docs/engineering-assurance.md. -->
<!-- Jedno Issue = jedno testowalne zachowanie. Epiki i roadmapa nie wymagają tej szczegółowości. -->

## Powiązany epik
<!-- Wpisz numer Issue, np. #4. -->

## Cel
<!-- Jedno zdanie: jaki rezultat biznesowy daje zmiana? -->

## Pojęcia i dane wejściowe
<!-- Zdefiniuj ważne terminy, jednostki, źródło danych i warunki początkowe. -->

## Wymagania
<!--
Pisz krótkie, niezależne wymagania.
Każde rozpoczynaj od REQ-xx.
Stosuj „System musi...” albo „System nie może...”.
Podaj warunek i oczekiwany rezultat; unikaj ogólnych sformułowań.
-->
- **REQ-01:**
- **REQ-02:**

## UI i design system (jeśli zadanie dotyczy interfejsu)
<!-- Obowiązujący web brutalism 5ciastek: docs/design-system.md i Issue #25. -->
- **Ponowne użycie:** jaki istniejący komponent lub token wykorzystuje zadanie?
- **Nowy komponent:** dlaczego jest potrzebny i gdzie będzie współdzielony?
- **Zgodność stylu:** jak zweryfikowano kolory, obramowania, typografię, cienie i stany?
- **Dostępność i ekrany:** telefon, desktop, w razie potrzeby tablet; klawiatura, focus, kontrast i czytelność.

## Bezpieczeństwo, niezawodność i zgodność
<!-- Krótkie odpowiedzi są wystarczające. Jeśli punkt nie dotyczy funkcji, napisz "nie dotyczy" i dlaczego. -->
- **Dane i prywatność:** klasa danych, cel zbierania, okres przechowywania i osoba odpowiedzialna.
- **Dostęp:** kto może czytać, zmieniać i zatwierdzać; gdzie serwer sprawdza uprawnienia.
- **Integralność:** co stanie się przy nieudanym zapisie, ponowieniu żądania i dwóch urządzeniach.
- **Odzyskiwanie:** wymagany backup, migracja lub procedura przywrócenia, jeśli zadanie zmienia trwałe dane.
- **Wymogi prawne/branżowe:** źródło przepisu lub decyzja "do analizy"; zatwierdzenie odpowiedzialnej osoby przy funkcji wysokiego ryzyka.
- **Dowód:** testy i wynik CI, które potwierdzą kontrole; powiązane Issues #20–#24.

## Kryteria akceptacji
<!-- Każdy punkt ma zawierać konkretne wejście/zdarzenie i wynik, który da się sprawdzić. -->
- [ ] **AC-01:**
- [ ] **AC-02:**
- [ ] **AC-03 (przypadek błędny lub graniczny):**

## Poza zakresem
<!-- Zapisz, czego zadanie nie obejmuje. -->

## Zależności i ograniczenia
<!-- Istniejące funkcje, uprawnienia, sposób testowania, ewentualna migracja danych. -->

## Warunki wydania
- [ ] Uprawnienia i błędne wejścia są zweryfikowane lub uzasadniono brak potrzeby.
- [ ] Testy przypadków błędnych i granicznych przeszły.
- [ ] Zmiana nie pogorszyła odzyskiwania danych ani historii operacji.
- [ ] Wymagana ocena prawna i operacyjna została wykonana lub wdrożenie jest zablokowane.
- [ ] Wynik kontroli jest powiązany z wersją kodu. Pominięte kontrole są jawne.

## Notatki techniczne (opcjonalnie)
<!-- Propozycje implementacji; wyraźnie oddziel je od obowiązkowych wymagań. -->
