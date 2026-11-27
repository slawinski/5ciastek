import { expect, it } from 'vitest';
import { sourced, missing } from '@/tests/fixtures/investment-scenarios';
import { monthlyFixture } from '@/tests/fixtures/investment-month';
import { evaluateScenarioV2 } from '../investment-scenarios/evaluate-v2';
import { reportV2Schema, versionedSavedInputSchema, versionedRunBodySchema } from '../investment-scenarios/versioned';
import { evaluateInvestment } from './investment';

const outlay = () => ({ equipment: sourced('80000', 'PLN', 'opening'), premises: sourced('20000', 'PLN', 'opening'), deposit: sourced('10000', 'PLN', 'opening'), initialStock: sourced('10000', 'PLN', 'opening') });
const qualified = (value: string, unit = 'PLN') => ({ status: 'qualified' as const, value, unit, period: '2026-11', basis: 'Po dochodzie właściciela', reasons: [] });
const month = () => ({ period: '2026-11', recurringCash: qualified('2000.00'), repeatability: qualified('0', 'qualification') });

it('totals the four sourced categories and divides qualified post-owner cash exactly', () => {
  const result = evaluateInvestment(outlay(), month());
  expect(result.outlay).toMatchObject({ status: 'qualified', value: '120000.00', unit: 'PLN', period: 'opening' });
  expect(result.payback).toMatchObject({ status: 'calculated', months: '60.00' });
  expect(result.categories.deposit).toEqual(outlay().deposit);
  const fractional = outlay(); fractional.equipment = sourced('80000.005', 'PLN', 'opening'); fractional.premises = sourced('20000.005', 'PLN', 'opening');
  expect(evaluateInvestment(fractional, month()).outlay.value).toBe('120000.01');
});

it.each(['0.00', '-3000.00'])('reports no finite payback for qualified cash %s', value => {
  expect(evaluateInvestment(outlay(), { ...month(), recurringCash: qualified(value) }).payback).toMatchObject({ status: 'no-finite-payback', months: null });
});

it('keeps missing outlay, charges and repeatability distinct from known nonpositive cash', () => {
  const incomplete = outlay(); incomplete.deposit = missing('PLN');
  expect(evaluateInvestment(incomplete, month()).payback).toMatchObject({ status: 'unverified', months: null });
  const unknownCash = { ...month(), recurringCash: { ...qualified('0'), status: 'unverified' as const, value: null, reasons: ['Brak składek'] } };
  expect(evaluateInvestment(outlay(), unknownCash).payback.reasons).toContain('Brak składek');
  const unknownRepeatability = { ...month(), repeatability: { ...qualified('0', 'qualification'), status: 'unverified' as const, reasons: ['Brak odtworzenia'] } };
  expect(evaluateInvestment(outlay(), unknownRepeatability).payback).toMatchObject({ status: 'unverified', months: null });
  expect(evaluateInvestment(outlay(), null).payback.status).toBe('unverified');
});

it('requires consistent outlay periods and matching monthly PLN cash and repeatability', () => {
  const inconsistent = outlay(); inconsistent.deposit = sourced('10000', 'PLN', 'other');
  expect(evaluateInvestment(inconsistent, month()).outlay.status).toBe('unverified');
  expect(evaluateInvestment(outlay(), { ...month(), recurringCash: qualified('2000', 'EUR') }).payback.status).toBe('unverified');
  expect(evaluateInvestment(outlay(), { ...month(), repeatability: { ...month().repeatability, period: '2026-12' } }).payback.status).toBe('unverified');
});

it('connects saved input to a versioned report without changing month cash or counting initial stock again', () => {
  const saved = monthlyFixture(); const { input } = saved; input.investment = outlay();
  const result = evaluateScenarioV2(saved);
  expect(result.investment.outlay.value).toBe('120000.00');
  expect(result.investment.payback).toMatchObject({ status: 'calculated', months: '60.00' });
  expect(result.monthly?.recurringCash.value).toBe('2000.00');
  expect(versionedRunBodySchema.parse(JSON.parse(JSON.stringify({ input: saved, output: result })))).toEqual({ input: saved, output: result });
  expect(result.economics.qualifications.some(row => row.identity === 'payback')).toBe(false);
  expect(reportV2Schema.parse(JSON.parse(JSON.stringify(result))).investment).toEqual(result.investment);
  const { investment: _investment, ...historical } = result; void _investment;
  expect(reportV2Schema.safeParse(historical).success).toBe(true);
  const cash = month(); const before = structuredClone(cash);
  evaluateInvestment(input.investment, cash);
  expect(cash).toEqual(before);
  input.investment.initialStock = sourced('20000', 'PLN', 'opening');
  const increasedStock = evaluateScenarioV2(saved);
  expect(increasedStock.monthly).toEqual(result.monthly);
  expect(increasedStock.investment.payback).toMatchObject({ status: 'calculated', months: '65.00' });
});

it.each([
  ['35000', 'no-finite-payback'], ['38000', 'no-finite-payback'], ['40000', 'calculated'],
])('qualifies %s receipts through the real monthly expense bridge', (receipts, status) => {
  const saved = monthlyFixture(); saved.input.investment = outlay();
  saved.input.month!.cashEntries[0].amount = sourced(receipts, 'PLN', '2026-11');
  const result = evaluateScenarioV2(saved);
  expect(result.investment.payback.status).toBe(status);
});

it('retains concrete missing-deposit, missing-charge and missing-replenishment reasons through the pipeline', () => {
  const saved = monthlyFixture(); saved.input.investment = outlay();
  saved.input.investment.deposit = missing('PLN', 'Brak oferty kaucji');
  expect(evaluateScenarioV2(saved).investment.payback.reasons).toContain('Kaucja: Brak oferty kaucji');
  saved.input.investment = outlay(); saved.input.month!.ownerCharges = missing('PLN');
  let result = evaluateScenarioV2(saved);
  expect(result.investment.payback.status).toBe('unverified');
  expect(result.investment.payback.reasons.join()).toContain('Obciążenia właściciela');
  saved.input.month!.ownerCharges = sourced('2000', 'PLN', '2026-11'); saved.input.month!.preparations = [];
  result = evaluateScenarioV2(saved);
  expect(result.investment.payback.status).toBe('unverified');
  expect(result.investment.payback.reasons.join()).toContain('zapas');
});

it('keeps the existing PLN input guard at the saved boundary', () => {
  const saved = monthlyFixture(); saved.input.investment = outlay();
  saved.input.investment.deposit = sourced('10000', 'EUR', 'opening');
  expect(versionedSavedInputSchema.safeParse(saved).success).toBe(false);
});
