import { at, missing, scenarioFixture, sourced } from './investment-scenarios';
import { upgradeScenario } from '@/features/investment-scenarios/upgrade';
import { freezeRecipe } from '@/features/recipes/publication';
import type { SavedInputV2 } from '@/features/investment-scenarios/schema-v2';

export function monthlyFixture(): SavedInputV2 {
  const input = upgradeScenario(scenarioFixture());
  input.products = [input.products[0]]; input.batches = [{ ...input.batches[0], target: 100 }];
  input.operations = input.operations.filter(row => row.productId === 'A');
  input.operations.forEach(row => { row.context.batch.value = '100'; row.demands.forEach(demand => { if (demand.unit === 'piece') demand.amount = sourced('100', 'piece'); }); });
  input.resources[2].capacity = sourced('100', 'piece');
  input.lots = [{ ...input.lots[0], quantity: { value: '100', unit: 'piece' } }]; input.movements = [{ ...input.movements[0], quantity: { value: '100', unit: 'piece' } }];
  input.windows = input.windows.filter(row => row.batchId === 'batch:A');
  input.lots.push({ id: 'flour', itemId: '1', location: 'magazyn', kind: 'material', quantity: { value: '2000000', unit: 'g' }, evidence: sourced('2000000', 'g'), availableAt: at('00:00'), expiresAt: '2026-12-01T00:00:00+01:00', admitted: true, admissionSource: 'Test', sourceParts: ['source'], preparationContext: 'Otwarcie' });
  input.month = { period: '2026-11', taxBasis: 'gross', calendar: Array.from({ length: 22 }, (_, i) => ({ date: `2026-11-${String(i + 1).padStart(2, '0')}`, productionProfile: '2026-11-25', salesProfile: '2026-11-25', evidence: sourced('1', 'day', '2026-11') })),
    openingLots: [{ ...input.lots[1], availableAt: '2026-11-01T00:00:00+01:00' }], preparations: [],
    fixedCosts: [{ id: 'rent', expenseId: 'rent', category: 'rent', amount: sourced('4000', 'PLN', '2026-11') }, { id: 'seller-month', expenseId: 'seller-month', category: 'seller', amount: sourced('4000', 'PLN', '2026-11') }],
    cashEntries: [{ id: 'receipts', expenseId: 'receipts', kind: 'receipt', amount: sourced('40000', 'PLN', '2026-11'), includedExpenseIds: [] },
      { id: 'operating', expenseId: 'operating', kind: 'payment', amount: sourced('30000', 'PLN', '2026-11'), includedExpenseIds: ['product:A', 'rent', 'seller-month'] }],
    ownerCharges: sourced('2000', 'PLN', '2026-11'), ownerIncome: sourced('6000', 'PLN', '2026-11'), ownerEconomicValue: missing('PLN'),
  };
  const { batchId: _preparationBatch, ...preparationOperation } = input.operations[0];
  void _preparationBatch;
  input.month.preparations.push({ id: 'replacement', expenseId: 'product:A', itemId: '1', quantity: { value: '1100000', unit: 'g' }, readyAt: '2026-11-30T00:00:00+01:00', expiresAt: '2027-01-01T00:00:00+01:00', admitted: true, evidence: sourced('1100000', 'g', '2026-11'), materialCost: sourced('22000', 'PLN', '2026-11'), laborRate: sourced('0', 'PLN/person-hour', '2026-11'),
    operations: [{ ...preparationOperation, readyBy: '2026-11-30T00:00:00+01:00', requestedStart: '2026-11-29T23:59:00+01:00', duration: sourced('0', 'min'), demands: [] }], resources: [], coveredMovementIds: ['recipe:batch:A:1:flour'],
  });
  return { input, publications: [{ productId: 'A', publicationId: 1, versionKey: 'A:1', snapshot: freezeRecipe({ name: 'A', yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) }] };
}
