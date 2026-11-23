# AST — Asystent właściciela

## Purpose-and-scope

Właściciel przegląda dzienne wyniki i zadaje pytania o sprzedaż, odpady i rentowność. Uprawniona osoba ocenia propozycje zmian; analityk sprawdza pochodzenie liczb. Pierwszy przyrost to dashboard tylko do odczytu i trzy uzgodnione pytania operacyjne z tych kategorii, nie samodzielny agent zarządzający firmą. Dokładne brzmienie pytań wymaga wyboru użytkownika; przykłady AC ustalają dowód danych, nie zgadują jego pytań.

Wspólna logika kosztów, inwestycji, wzrostu i porównania wariantów należy do ECO/SCN. Późniejszy zakres zachowuje scenariusze: dodatkowa osoba, zmiana, miesiarka, retarder, piec, drugi sklep i zwiększenie B2B; CAPEX/OPEX, cash flow, próg rentowności, niepewność oraz wariant pesymistyczny/bazowy/optymistyczny. AST pyta o nie i prezentuje ich źródła, nie buduje drugiego rachunku. Szerszy cash flow działającej firmy nie staje się warunkiem podstawowej oceny przed otwarciem.

## Inputs-and-outputs

Dashboard pobiera sprzedaż w sztukach/PLN, straty w jednostkach i PLN, czas stockout, marżę kontrybucyjną PLN z podstawą ECO, roboczogodziny/nadgodziny WRK i wykorzystanie urządzeń OPT/EVT. Każdy wynik ma datę/zakres/strefę, moment aktualności, źródło, podstawę i ograniczenia. Brakujące dane nie oznaczają zera. Odpowiedź ma treść, cytowane dane, zakres dat i założenia oraz sprawdzalny wynik funkcji/obliczenia. Wyniki planowane, rzeczywiste i hipotetyczne pozostają rozróżnialne.

Zapytanie do dostawcy AI jest osobnym ujawnieniem danych: wyłącznie uprawniony i zminimalizowany zakres po redakcji danych wrażliwych. Kontakty B2B, dane pracowników i warunki handlowe nie stają się publiczne przez prawo do użycia asystenta. Wynik finansowy pochodzi ze sprawdzalnych funkcji, zapytań lub solvera, nie z szacunku wygenerowanego przez LLM; SQL jest przykładem sprawdzalnego obliczenia, nie obowiązkiem implementacji w tym dokumencie.

## Lifecycle-and-invariants

Wybór dat/zakresu → sprawdzenie dostępu → pobranie/obliczenie → kwalifikacja braków → redakcja przed AI → odpowiedź z cytatami → opcjonalna propozycja działania → odrębna akceptacja człowieka w module właściciela. Odpowiedź nie zapisuje cennika, zamówienia ani harmonogramu. Zmienione dane wymagają nowej datowanej odpowiedzi, nie cichej poprawki historycznego uzasadnienia. Brak źródła, odmowa dostępu lub awaria dostawcy nie uprawniają do wymyślenia liczb; istniejący dashboard nie wymaga dostępności AI.

## Requirements

### AST-REQ-001
System musi udostępnić dashboard dzienny tylko do odczytu ze sprzedażą, stratami, stockout, marżą kontrybucyjną, roboczogodzinami, nadgodzinami i wykorzystaniem sprzętu, wskazując daty, aktualność i brakujące źródła dla każdej miary. Ograniczony dashboard nie może wymagać wszystkich późniejszych modułów naraz.

### AST-REQ-002
System musi odpowiadać językiem naturalnym na trzy uzgodnione pytania operacyjne z kategorii sprzedaż, odpady i rentowność, podając źródła liczb, zakres dat i założenia. Gdy pytanie jest niejednoznaczne co do okresu/miary lub brak danych, musi wskazać potrzebne doprecyzowanie albo ograniczenie, nie udzielić pozornie pełnej odpowiedzi.

### AST-REQ-003
System musi oprzeć liczby i wnioski obliczeniowe na sprawdzalnych funkcjach, zapytaniach lub solverach właścicieli danych i pokazać ich podstawę. LLM może objaśnić wynik, ale jego szacunek nie może zostać przedstawiony jako wynik finansowy. Brak kosztu nie może zostać zastąpiony zerem dla obliczenia rentowności.

### AST-REQ-004
System musi umożliwić prześledzenie prezentowanej liczby do źródła, wersji/okresu i założeń, rozróżniając wykonanie, plan i scenariusz. Przy źródłach o różnej aktualności musi ujawnić różnicę; niedostępne źródło nie może zostać zastąpione nieoznaczonym tekstem LLM.

### AST-REQ-005
Przed pobraniem i prezentacją system musi przefiltrować dane według uprawnień pytającego, również w agregatach i cytatach. Odmowa dostępu musi obowiązywać także wtedy, gdy użytkownik zażąda danych przez pytanie lub eksport, a nie bezpośredni ekran.

### AST-REQ-006
Przed wysłaniem zapytania do dostawcy AI system musi zredagować dane wrażliwe i ograniczyć ujawnienie zgodnie z istniejącą polityką ochrony danych. Nie może wysłać surowych danych tylko dlatego, że model o nie poprosi; niepotwierdzona redakcja lub niedozwolony zakres musi zatrzymać ujawnienie, pozostawiając możliwy do odczytu wynik lokalny z kwalifikacją braku odpowiedzi AI.

### AST-REQ-007
System nie może zmieniać cenników, zamówień ani harmonogramów na podstawie samej odpowiedzi/rekomendacji. Późniejsze przekazanie propozycji do modułu właściciela musi wymagać jawnej akceptacji uprawnionego człowieka i pokazać dokładny zakres zmiany; asystent nie omija walidacji tego modułu.

### AST-REQ-008
Przy pytaniu o rozwój system musi korzystać z zapisanych wariantów [SCN-REQ-001](scenarios-comparison.md#scn-req-001) i rachunku [ECO-REQ-001](economics-investment.md#eco-req-001)/[ECO-REQ-002](economics-investment.md#eco-req-002), pokazując założenia, ograniczenia wykonalności i pochodzenie CAPEX/OPEX, cash flow, progu rentowności i niepewności. Musi umożliwić prześledzenie i porównanie co najmniej dwóch wykonalnych wariantów rozwoju, gdy właściciele SCN/ECO dostarczą kwalifikowane wyniki. Nie może nazwać niezweryfikowanego wariantu wykonalnym ani ustanowić nowego modelu finansowego w AST.

### AST-REQ-009
Osoba oceniająca przyrost musi otrzymać rzeczywiście zmierzone godziny odzyskane przez właściciela w miesiącu względem porównywalnej pracy bez asystenta, koszty utrzymania AI, koszt zapytania i ocenę poprawności odpowiedzi. Trafność scenariuszy musi odwoływać się do późniejszych wyników i założeń SCN/ECO; brak danych porównawczych nie może być przedstawiony jako udowodniona oszczędność lub trafność.

## Acceptance-criteria

### AST-AC-001
Dotyczy [AST-REQ-001](#ast-req-001), [AST-REQ-004](#ast-req-004). Dla 20 czerwca dostępne są 100 sprzedanych szt., 10 odpadów, 60 min stockout i 12 roboczogodzin. Dashboard pokazuje te dane ze źródłami. Brak kosztów oznacza brak marży; brak zdarzeń urządzenia oznacza brak rzeczywistego wykorzystania, nie 0%. Brak DEM/B2B i niedostępność AI nie blokują tych istniejących miar.

### AST-AC-002
Dotyczy [AST-REQ-002](#ast-req-002), [AST-REQ-003](#ast-req-003), [AST-REQ-004](#ast-req-004). Dla trzech wybranych przez właściciela pytań testowych z kategorii sprzedaż, odpady, rentowność przygotowano źródła z tego samego okresu: przychód 1000 PLN, odpady 10 szt. wycenione na 20 PLN i wkład kontrybucyjny 400 PLN wyliczony przez ECO według jawnej podstawy. Odpowiedzi cytują właściwe rekordy/raporty, daty i założenia oraz zgadzają się z wynikami funkcji. Nie zmieniają 400 na wymyśloną przez LLM wartość. To dane testowe, nie narzucona treść pytań.

### AST-AC-003
Dotyczy [AST-REQ-002](#ast-req-002), [AST-REQ-003](#ast-req-003). Pytanie o rentowność nie określa okresu, a koszty są niedostępne. System prosi o okres i ujawnia brak podstaw kosztowych; nie odpowiada „zysk 1000 PLN” na podstawie samego przychodu. Błąd źródła kosztu pozostaje widoczny także przy dostępnej odpowiedzi tekstowej AI.

### AST-AC-004
Dotyczy [AST-REQ-004](#ast-req-004). Raport sprzedaży jest aktualny do 12:00, koszty do poprzedniego dnia, a 75% wykorzystania pieca pochodzi z planu. Odpowiedź pokazuje trzy podstawy i nazywa 75% planem, nie wykonaniem. Odsyłacz do źródła umożliwia uprawnionej osobie prześledzenie liczby; brak dostępu nie jest obchodzony przez cytat.

### AST-AC-005
Dotyczy [AST-REQ-005](#ast-req-005), [AST-REQ-006](#ast-req-006). Użytkownik bez dostępu do płac i kontaktów K prosi o ich dołączenie do odpowiedzi i zapytania AI. System odmawia ujawnienia tych danych także w cytatach/agregatach ujawniających szczegóły. Przechwycony w teście dozwolony payload do dostawcy nie zawiera zastrzeżonych płac, kontaktów ani danych wrażliwych objętych redakcją. Nieudana redakcja zatrzymuje wysyłkę zamiast przekazać surową treść.

### AST-AC-006
Dotyczy [AST-REQ-007](#ast-req-007). Asystent proponuje podwyżkę ceny A z 8 do 9 PLN i przesunięcie zlecenia. Po samej odpowiedzi cena, zamówienie i harmonogram są niezmienione. Późniejszy handoff pokazuje te różnice; bez akceptacji uprawnionego człowieka i walidacji właściciela zmiana nie następuje. Pierwszy przyrost tylko do odczytu nie ma obowiązku wykonywania tego handoffu.

### AST-AC-007
Dotyczy [AST-REQ-008](#ast-req-008). SCN/ECO dostarczają dwa wykonalne warianty: dodatkowa osoba i dodatkowa miesiarka, z wersjami danych CAPEX/OPEX, cash flow i przedziałami oraz scenariuszami pesymistycznym/bazowym/optymistycznym. AST pokazuje oba, ich podstawy i ograniczenia. Trzeci wariant drugiego sklepu bez sprawdzonej zdolności jest oznaczony jako niezweryfikowany, a nie zaliczony do dwóch wykonalnych. Nie wymaga to uruchomienia tego szerszego zakresu przed oceną otwarcia.

### AST-AC-008
Dotyczy [AST-REQ-009](#ast-req-009). Porównywalne czynności zajmowały 12 h/miesiąc, a z asystentem 8 h, przy koszcie utrzymania 120 PLN/miesiąc. Raport pokazuje zaobserwowane 4 h i 120 PLN, metodę porównania oraz koszt pojedynczego zapytania z rzeczywistych danych. Bez pomiaru 12 h pokazuje brak potwierdzonej oszczędności. Prognozy rozwoju bez późniejszego wyniku nie dostają oceny „trafne”.

## Dependencies-and-decisions

| Typ | Cel lokalny | Zakres i warunek | Faza |
|---|---|---|---|
| contract-input | [ECO-REQ-001](economics-investment.md#eco-req-001), [WRK-REQ-001](workforce.md#wrk-req-001), [EVT-REQ-001](production-records.md#evt-req-001), [STK-REQ-002](stock-inventory.md#stk-req-002) | Źródła miar z rozróżnieniem kosztów, pracy i fizycznych ilości; nie wszystkie implementacje naraz | start |
| implementation-prerequisite | AST-REQ-001/003 | Sprawdzalne wyniki i źródła tylko dla prezentowanych miar/pytania; ograniczony dashboard może powstać wcześniej | demonstration |
| optional-adapter | [DEM-REQ-006](demand.md#dem-req-006), [OPT-REQ-007](optimization.md#opt-req-007), [B2B-REQ-009](b2b-orders.md#b2b-req-009) | Pełniejszy asystent konsumuje dostępne prognozy, obciążenia i wyniki B2B; brak nie blokuje bazowego dashboardu | demonstration |
| implementation-prerequisite | SCN-REQ-001, ECO-REQ-002 | Tylko rzeczywiste porównanie rozwoju/cash flow, nie odpowiedzi o istniejącej sprzedaży | demonstration |
| release-gate | [assurance](../engineering-assurance.md#artefakty-przed-implementacją), AST-REQ-005/006 | Uprawnienia, minimalizacja/redakcja i ocena przekazania danych do dostawcy AI przed rzeczywistym ujawnieniem | release |

Właściciel wybiera dokładne trzy pytania i definicję oczekiwanej odpowiedzi. Plan zadania określa kryterium poprawności odpowiedzi i porównywalny pomiar odzyskanego czasu. Zgodnie z [klasyfikacją wyborów i warunków użycia](../decisions.md#request-classification) są to wybory planowania i warunki oceny efektów, nie nowe globalne decyzje blokujące produkt. Przed rzeczywistym przekazaniem danych do AI wymagają zatwierdzenia zakres danych, klasy redakcji, dostawca, warunki przetwarzania i retencja według istniejącej polityki.

Horyzont, terminy przepływów pieniężnych i założenia niepewności należą do planu obliczeń oraz danych ECO/SCN, nie do odpowiedzi LLM. [DEC-002](../decisions.md#dec-002) obowiązuje wyłącznie przy integracji zależnej od trwałego strumienia obserwacji. Nie przyjęto progu oszczędności, nowej polityki podatkowej ani autonomicznego wykonywania zmian.
