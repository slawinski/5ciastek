// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { useState } from 'react';
import { weeklyFixture } from '../reference';
import type { FormValue } from './ScenarioInputs';
import { ScenarioMonthInputs } from './ScenarioMonthInputs';
afterEach(cleanup);
it('adds a sourced editable calendar to the same draft without inventing financial values', () => {
  let current: FormValue = null;
  function Editor() { const [value, setValue] = useState<FormValue>(weeklyFixture()); current = value; return <ScenarioMonthInputs value={value} onChange={setValue} publications={[]} revealPath="input.month.calendar" />; }
  render(<Editor />);
  fireEvent.click(screen.getByRole('button', { name: 'Dodaj ocenę miesiąca' }));
  fireEvent.click(screen.getByRole('button', { name: 'Dodaj: daty produkcji i sprzedaży' }));
  expect(JSON.stringify(current)).toContain('productionProfile');
  expect(JSON.stringify(current)).toContain('"ownerIncome":{"status":"missing"');
  fireEvent.click(screen.getByRole('button', { name: 'Usuń ocenę miesiąca z formularza' }));
  expect(JSON.stringify(current)).toContain('"month":null');
});
