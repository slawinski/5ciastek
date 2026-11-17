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
| **P0** | Przed uruchomieniem MVP-0 na rzeczywistych kontach i danych | Kontrola dostępu, walidacja serwera, wersje receptur, backup i test restore, izolowane testy, CI, podstawowy model zagrożeń, ocena danych osobowych |
| **P1** | Przed M1: ręczne zdarzenia produkcyjne | Idempotencja, spójność transakcji, współbieżność, audyt korekt, obsługa timeout i restartu, udokumentowana procedura przy niedostępności systemu |
| **P2** | Przed modułami o wyższym ryzyku | Analiza regulacyjna i branżowa, testy urządzeń i alarmów, kontrola dostępu do danych wrażliwych, legalna podstawa monitoringu, ocena skutków dla ochrony danych gdy wymagana, świadoma akceptacja ryzyka |

**P0, P1, P2 nie są certyfikatami ani oceną prawną.** Są poziomami kontroli wewnątrz projektu.

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

Wymagania podawaj jako małe, testowalne zdania `REQ-xx` i `AC-xx` (zasady w [specification-style.md](specification-style.md)).

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
