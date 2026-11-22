# QLT — Jakość, urządzenia i dokumentacja

## Purpose-and-scope

Operator zapisuje odczyty i czynności, osoba odpowiedzialna wykonuje działania korygujące, a uprawniona osoba odpowiedzialna za bezpieczeństwo żywności przegląda raport i zatwierdza decyzje. Zakres rozpoczyna się od jednego krytycznego urządzenia wybranego z analizy zagrożeń: log temperatur, alarmów i działań korygujących, bez AI w krytycznej ścieżce. Chłodnia, retarder i inne urządzenia są monitorowane tam, gdzie uzasadnia to analiza. Moduł ani symulator inwestycji nie certyfikuje zakładu.

## Inputs-and-outputs

Urządzenie/czujnik, czas ze strefą, temperatura °C, pochodzenie i jakość pomiaru, stan połączenia/czujnika/kalibracji; zakresy i reguły alarmowania muszą pochodzić z rzeczywistej procedury, nie z przykładu. Dziennik obejmuje przegląd, czyszczenie, naprawę, awarię, działanie korygujące, datę, odpowiedzialną osobę i dowód. Powiązanie partia/produkt pochodzi z EVT/REC. Raport zawiera przebieg, alarmy, braki, czynności, decyzję człowieka i odwołanie do właściwej wersji procedury. Czas wykrycia mierzy się względem znanego początku odchylenia, straty w jednostkach i PLN z podstawą kosztu.

## Lifecycle-and-invariants

Konfiguracja względem procedury → odczyty → alarm/usterka → potwierdzenie przez człowieka → działanie korygujące → przegląd i decyzja. Potwierdzenie odebrania alarmu nie oznacza usunięcia przyczyny ani zatwierdzenia produktu. Kalibracja i ręczny odczyt mają własne pochodzenie; nie zastępują po cichu historii czujnika. Ponowienie dostarczenia tego samego pomiaru nie może tworzyć pozornej dodatkowej kontroli. Przy niedostępności stosuje się ustaloną procedurę ręczną, bez deklarowania automatycznego zaliczenia.

## Requirements

### QLT-REQ-001
System musi rejestrować temperatury jednego wybranego krytycznego urządzenia wraz z czasem, źródłem i stanem wiarygodności. Zakres monitorowania musi wskazać uzasadnienie z analizy zagrożeń i stosowaną procedurę; brak tego mapowania nie może być przedstawiony jako zatwierdzona kontrola HACCP.

### QLT-REQ-002
System musi rozróżnić alarm wartości poza dostarczonym zakresem, awarii czujnika, utraty połączenia oraz nieważnego pomiaru/kalibracji. Brak lub błędny odczyt nie może wyglądać jak temperatura w normie. Alarm musi wskazywać urządzenie, czas, przyczynę i stan obsługi.

### QLT-REQ-003
Uprawniony operator musi móc zapisać przeglądy, czyszczenie, naprawy i awarie z odpowiedzialną osobą i czasem. System musi zachować ich historię oraz wskazać, których dowodów lub potwierdzeń brakuje.

### QLT-REQ-004
Uprawniona osoba musi móc powiązać działanie korygujące z alarmem/awarią, odpowiedzialnym człowiekiem, czasem, wynikiem i dowodem. System nie może uznać samego odczytania alarmu za wykonanie działania lub zatwierdzenie jakości partii.

### QLT-REQ-005
System musi powiązać kontrolę temperatury i obserwację jakości wypieku z właściwą partią i produktem. Przy nieznanym powiązaniu musi pokazać brak identyfikowalności, a nie przypisać pomiar arbitralnie do ostatniej partii.

### QLT-REQ-006
System musi udostępnić odpowiedzialnej osobie raport odczytów, alarmów, braków i działań z powiązaniem partii oraz procedury. Decyzja o jakości/bezpieczeństwie wymaga jawnego zatwierdzenia człowieka według rzeczywistej procedury zakładu i oceny stosownych wymagań prawnych. Odczyt, AI lub komplet pól raportu nie stanowią takiego zatwierdzenia.

### QLT-REQ-007
Przed dopuszczeniem rzeczywistego monitoringu muszą istnieć dowody testów awarii sieci, błędnych pomiarów, kalibracji, alarmów i procedur ręcznych. Raport oceny musi ujawnić czas wykrywania odchyleń, incydenty utraty danych, straty z awarii i kompletność dokumentacji bez arbitralnego progu sukcesu.

### QLT-REQ-008
System musi ograniczyć zapis czynności i zatwierdzenie decyzji do właściwych uprawnień oraz zachować tożsamość zatwierdzającego. Awaria zapisu nie może zwrócić potwierdzenia działania; powtórzone dostarczenie tego samego źródłowego pomiaru nie może go policzyć jako nowej kontroli.

### QLT-REQ-009
Opcjonalna analiza obrazu może porównywać kolor skórki, rozmiar, kształt i nacięcia dopiero po wykazaniu wartości i odrębnej ocenie prawnej/prywatności właściwej zakresowi. Nie może wejść do krytycznej ścieżki alarmowania ani zastąpić decyzji człowieka. Identyfikacja/ocena pracowników z kamer nie jest domyślnym zakresem tej funkcji.

## Acceptance-criteria

### QLT-AC-001
Dotyczy [QLT-REQ-001](#qlt-req-001). Dla urządzenia R1 wybranego w analizie zapisano pomiar 4°C o 08:00 z czujnika S1 i procedurę P v2. Widok zachowuje te dane. Gdy brakuje P, pokazuje brak mapowania procedury, nie pieczęć „HACCP zatwierdzone”.

### QLT-AC-002
Dotyczy [QLT-REQ-002](#qlt-req-002). W przykładzie procedura dostarcza zakres 2–6°C. Odczyt 9°C daje alarm zakresu, brak połączenia daje alarm połączenia, awaria S1 alarm czujnika, a nieważna kalibracja oznacza niewiarygodność pomiaru. Żaden z trzech ostatnich stanów nie pokazuje zielonego „4°C w normie” na podstawie ostatniego odczytu. Te liczby nie ustalają zakresu bezpieczeństwa.

### QLT-AC-003
Dotyczy [QLT-REQ-003](#qlt-req-003), [QLT-REQ-004](#qlt-req-004). Operator zapisuje czyszczenie R1 o 09:00, naprawę o 10:00 oraz wykonawcę; działanie przy alarmie A1 wskazuje wynik i dowód. Samo „odebrano A1” o 08:05 pozostawia działanie i decyzję produktu niewykonane. Brak dowodu naprawy jest widoczny, nie uzupełniony automatycznie.

### QLT-AC-004
Dotyczy [QLT-REQ-005](#qlt-req-005), [QLT-REQ-006](#qlt-req-006). Raport dla P1/SKU A łączy temperaturę, ocenę wypieku i działanie A1 z procedurą P v2. Uprawniona osoba zapisuje własną decyzję z datą. Raport bez powiązania partii pokazuje brak identyfikowalności; sam odczyt nie nadaje partii statusu zatwierdzonej kontroli HACCP.

### QLT-AC-005
Dotyczy [QLT-REQ-007](#qlt-req-007). Podczas próby sieć znika 08:00–08:20, czujnik dostarcza błędny pomiar, a kalibracja jest nieważna. Dowód opisuje rozpoznane stany, alarmy, lukę danych i wykonany odczyt ręczny zgodnie z procedurą; nie twierdzi, że odzyskano nieistniejące pomiary. Odchylenie znane od 08:00 i wykryte o 08:03 daje 3 min wykrycia. Brak dowodu próby pozostawia warunek wydania niespełniony.

### QLT-AC-006
Dotyczy [QLT-REQ-008](#qlt-req-008). Operator bez uprawnienia zatwierdzania nie zatwierdza decyzji bezpieczeństwa. Timeout zapisu działania nie jest potwierdzeniem sukcesu. Ponowne przyjęcie identycznego pomiaru S1/08:00 pozostawia jeden pomiar, nie dwie kontrole; korekta zachowuje pochodzenie.

### QLT-AC-007
Dotyczy [QLT-REQ-009](#qlt-req-009). Przy wyłączonej kamerze nadal działają log i alarmy R1. Propozycja CV wykrywająca inne nacięcie ma wynik pomocniczy; bez odrębnego przeglądu wartości/prawa/prywatności nie jest wdrażana. Nawet po przeglądzie nie zatwierdza produktu ani nie ocenia pracownika.

## Dependencies-and-decisions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [REC-REQ-001](recipes.md#rec-req-001), [EVT-REQ-001](production-records.md#evt-req-001) | Tożsamość produktu/partii; nie globalny model firmy przed logiem urządzenia | start |
| implementation-prerequisite | QLT-REQ-001/002 | Wybrane rzeczywiste urządzenie i źródło pomiarów do próby urządzenia; fixture nie dowodzi niezawodności czujnika | demonstration |
| release-gate | [assurance: HACCP/traceability](../engineering-assurance.md#kontrole-zależne-od-funkcji), QLT-REQ-006/007 | Faktyczna procedura, ocena prawna i zatwierdzenie odpowiedzialnej osoby, dowody alarmów/awarii, stosowne kontrole #20–#24 | release |
| optional-adapter | QLT-REQ-009 | Wizyjna analiza jakości z odrębnymi bramkami, nie zależność logu | demonstration |
| release-gate | [assurance: privacy](../engineering-assurance.md#nieprzekraczalne-warunki) | Minimalizacja danych osób, retencja i konieczność/proporcjonalność kamer przed wdrożeniem | release |

U7 musi uzyskać decyzję osoby domenowej: które urządzenie i procedura są krytyczne, zakresy/czas reakcji alarmów i odbiorca, reguły ważności kalibracji i ręcznego zastępstwa, sposób zamknięcia alarmu/działania i uprawnienia zatwierdzenia. To brakujące decyzje zakładowe, nie pretekst do wymyślenia progów lub deklaracji prawnej. Dokument importuje istniejącą politykę, nie dowodzi zainstalowania kontroli ani zgodności.
