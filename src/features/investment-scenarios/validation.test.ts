import { expect, it } from 'vitest';
import { validationMessage } from './validation';

it('renders schema failures in Polish while preserving domain-specific explanations', () => {
  expect(validationMessage({ code: 'too_small', message: 'Too small: expected number to be >0' })).toBe('Wartość jest zbyt mała lub pole jest puste.');
  expect(validationMessage({ code: 'custom', message: 'Pomiar innej skali wymaga jawnej estymacji.' })).toBe('Pomiar innej skali wymaga jawnej estymacji.');
});
