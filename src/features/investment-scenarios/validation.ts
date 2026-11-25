const messages: Record<string, string> = {
  invalid_type: 'Nieprawidłowy typ danych. Sprawdź wartość i jednostkę.',
  too_small: 'Wartość jest zbyt mała lub pole jest puste.',
  too_big: 'Wartość przekracza dopuszczalny zakres.',
  invalid_format: 'Podaj poprawny format wartości, daty lub czasu z offsetem.',
  invalid_value: 'Wybierz jedną z dopuszczalnych wartości.',
  invalid_union: 'Uzupełnij dane zgodnie z wybraną podstawą.',
  unrecognized_keys: 'Polecenie zawiera niedozwolone pola.',
};
export const validationMessage = (issue: { code: string; message: string }) => issue.code === 'custom' ? issue.message : messages[issue.code] ?? 'Nieprawidłowe dane. Sprawdź wskazane pole.';
