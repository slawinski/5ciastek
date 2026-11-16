# KoPieC OS — zasady pisania wymagań

## Zastosowanie

- **Roadmapa i epiki:** opisz cel biznesowy, zakres, MVP, KPI i zależności prostym językiem. Nie dziel ich na drobne wymagania tylko po to, aby zachować formę.
- **Zadanie implementacyjne:** użyj szablonu [Zadanie implementacyjne](../.github/ISSUE_TEMPLATE/implementation.md). Opisz jedno niezależnie weryfikowalne zachowanie systemu.
- **Instrukcja pracy / procedura:** zapisz kroki w kolejności wykonywania; dla każdej czynności podaj wykonawcę i wynik.

Stosuj zasady *inspirowane* ASD-STE100. ASD-STE100 dotyczy kontrolowanego języka angielskiego. Dokument w języku polskim nie może zostać uznany za formalnie zgodny ze standardem.

## Zasady dla specyfikacji implementacyjnej

1. **Jeden wymóg = jedno zachowanie.** Nie łącz niezależnych funkcji spójnikami „i” lub „oraz”.
2. **Określ wykonawcę i działanie.** Stosuj „System musi…” do wymagań obowiązkowych, „System nie może…” do zakazów. Unikaj „należy”, „w miarę możliwości”, „odpowiednio”, „intuicyjnie”.
3. **Podaj warunek i rezultat.** Powiedz, kiedy działanie ma wystąpić, jakie dane system ma przyjąć i co ma zwrócić albo zapisać.
4. **Zdefiniuj jednostki i granice.** Podawaj konkretne wartości, strefę czasową, format danych, zaokrąglanie i zachowanie dla wartości zerowych, jeśli są istotne.
5. **Używaj jednego terminu dla jednego pojęcia.** Np. „SKU”, „partia ciasta”, „wsad pieca” i „brak produktu” oznaczają różne rzeczy. Nie zamieniaj terminów bez definicji.
6. **Oddziel wymaganie od rozwiązania technicznego.** „System musi zapisać czas…” to wymaganie. Baza danych, event bus czy framework są propozycją implementacji, jeśli nie stanowią świadomego ograniczenia architektonicznego.
7. **Zapisz osobne kryteria akceptacji.** Weryfikuj przypadek poprawny, błąd, granicę oraz uprawnienia — jeśli dotyczą zadania. Każdy test musi mieć wejście i oczekiwany wynik.
8. **Podaj, co nie należy do zadania.** Zapobiega to rozbudowie zakresu podczas implementacji.
9. **Zdefiniuj źródło prawdy.** Zapisz, skąd pochodzą wejściowe dane i gdzie widoczny jest wynik.
10. **Nie zmieniaj po cichu znaczenia istniejących danych.** Migracja, wersje receptur i historyczne ceny wymagają jawnych reguł.

## Przykład — epik sprzedaży i braków (#4)

### Zbyt ogólnie

> Obsłużyć braki produktów na półce i rejestrować ich czas.

### Precyzyjniej — zadanie implementacyjne

**Cel:** zapisać czas rozpoczęcia braku produktu.

**Słownik:**
- *Brak produktu* — stan dostępny do sprzedaży równy 0 szt.
- *Czas braku* — czas rozpoczęcia aktualnego okresu niedostępności.
- *SKU* — identyfikator produktu używany w systemie sprzedaży.

**Wymagania:**
- **REQ-01:** Gdy stan dostępny SKU zmieni się z wartości większej od 0 na 0, system musi zapisać datę i godzinę rozpoczęcia braku produktu.
- **REQ-02:** System musi powiązać zapis braku z właściwym SKU.
- **REQ-03:** Jeżeli stan SKU wynosi 0 i nie zmienił się, system nie może tworzyć kolejnego zapisu rozpoczęcia tego samego braku.

**Kryteria akceptacji:**
- [ ] **AC-01:** Dla SKU A stan zmienia się z 1 na 0. Powstaje jeden zapis braku z czasem tego zdarzenia.
- [ ] **AC-02:** Dla SKU A stan pozostaje równy 0. Drugi zapis braku nie powstaje.
- [ ] **AC-03:** Dla SKU B stan zmienia się z 2 na 1. Nie powstaje zapis braku.

**Poza zakresem:** prognoza popytu i wyznaczanie wielkości produkcji.

> Przykład zakłada wiarygodny sygnał stanu magazynowego. W prawdziwym zadaniu trzeba jeszcze ustalić źródło zdarzeń i reguły korekty stanu; nie należy dopowiadać ich na podstawie tego przykładu.

## Kontrola jakości przed implementacją

- [ ] Każdy wymagany rezultat można sprawdzić testem lub obserwacją.
- [ ] Wszystkie użyte terminy mają znane znaczenie.
- [ ] Warunki błędne i graniczne są określone, jeżeli mają znaczenie.
- [ ] Nie ma sprzecznych wymagań lub zależności.
- [ ] Ustalono dane wejściowe, źródło prawdy i uprawnienia.
- [ ] Zadanie jest wystarczająco małe do wykonania i przetestowania niezależnie.
