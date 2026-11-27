// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { useState } from 'react';
import { weeklyFixture } from '../reference';
import { ScenarioWeekInputs } from './ScenarioWeekInputs';
import { ScenarioInvestmentInputs } from './ScenarioInvestmentInputs';
import type { FormValue } from './ScenarioInputs';
import { monthlyFixture } from '@/tests/fixtures/investment-month';
import { sourced, missing } from '../reference';
import { evaluateScenarioV2 } from '../evaluate-v2';
import { ScenarioReport } from './ScenarioReport';
afterEach(cleanup);

it('edits sourced initial outlay in the same draft, retaining unknown categories and the rest of the week', () => {
  let current: FormValue = null;
  function Editor() { const [value, setValue] = useState<FormValue>(weeklyFixture()); current = value; return <ScenarioInvestmentInputs value={value} onChange={setValue} publications={[]} revealPath="input.investment.equipment" />; }
  render(<Editor />);
  const equipment = screen.getByRole('group', { name: 'Wyposażenie' });
  fireEvent.change(within(equipment).getByLabelText('Podstawa'), { target: { value: 'estimated' } });
  fireEvent.change(within(equipment).getByLabelText('Wartość'), { target: { value: '80000' } });
  fireEvent.change(within(equipment).getByLabelText('Źródło'), { target: { value: 'Oferta pieca' } });
  expect(JSON.stringify(current)).toContain('Oferta pieca');
  expect(JSON.stringify(current)).toContain('"deposit":{"status":"missing"');
  expect(JSON.stringify(current)).toContain('"batches":');
});

it('shows a single investment editor in the connected weekly form', () => {
  render(<ScenarioWeekInputs value={weeklyFixture()} onChange={() => {}} publications={[]} revealPath="input.investment.equipment" />);
  expect(screen.getAllByRole('group', { name: 'Wyposażenie' })).toHaveLength(1);
  expect(screen.getByRole('heading', { name: 'Nakład i prosty zwrot' })).toBeTruthy();
});

it.each([
  ['40000', false, '60.00 miesięcy'],
  ['38000', false, 'Brak skończonego zwrotu'],
  ['35000', false, 'Brak skończonego zwrotu'],
  ['40000', true, 'Zwrot niezweryfikowany'],
])('displays qualified payback and sourced gaps for %s receipts (missing deposit: %s)', (receipts, missingDeposit, expected) => {
  const saved = monthlyFixture();
  saved.input.investment = { equipment: sourced('80000', 'PLN', 'opening'), premises: sourced('20000', 'PLN', 'opening'), deposit: missingDeposit ? missing('PLN', 'Brak oferty kaucji') : sourced('10000', 'PLN', 'opening'), initialStock: sourced('10000', 'PLN', 'opening') };
  saved.input.month!.cashEntries[0].amount = sourced(receipts, 'PLN', '2026-11');
  const report = evaluateScenarioV2(saved);
  render(<ScenarioReport input={saved} report={report} revisionNumber={1} runId={1} changed={false} unsaved={false} />);
  const investment = screen.getByRole('region', { name: 'Nakład i prosty zwrot' });
  expect(within(investment).getByText(expected)).toBeTruthy();
  expect(within(investment).getByText(/Okres miesięcznej podstawy: 2026-11/)).toBeTruthy();
  expect(within(investment).getAllByText(/Syntetyczny przykład/).length).toBeGreaterThan(0);
  if (missingDeposit) expect(within(investment).getByText(/Brak danych — Brak oferty kaucji/)).toBeTruthy();
});
