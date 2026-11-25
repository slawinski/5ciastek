import type { SavedInput } from '../investment-scenarios/schema';
import { known, type Qualification } from '../investment-scenarios/values';
import type { StockResult } from '../stock-inventory/evaluate';
import type { ProcessResult } from '../process-execution/evaluate';
import { add, ceil, compare, decimal, divide, money, ratio, subtract, times } from './money';
import { requiredSales } from './required-sales';

export function evaluateEconomics(saved: SavedInput, stock: StockResult, process: ProcessResult) {
  const { input } = saved; const finance = input.finance;
  const qualifications: Qualification[] = [];
  const qualify = (identity: string, reason: string) => qualifications.push({ domain: 'finance', identity, reason });
  let revenue = ratio(0n); let productCost = ratio(0n); let otherVariable = ratio(0n); let fixedCost = ratio(0n);
  let revenueComplete = true; let productComplete = true; let variableComplete = true;
  let fixedComplete = finance.costs.some(row => row.basis === 'fixed') && finance.period === input.period;
  if (!fixedComplete) qualify('fixedCosts', 'Brak jawnej podstawy kosztów stałych badanego okresu. Brak nie oznacza zera.');
  for (const product of input.products) {
    const price = known(product.price); const cost = known(product.unitCost);
    if (price === null) { revenueComplete = false; qualify(product.id, 'Brak ceny sprzedaży.'); }
    else revenue = add(revenue, times(decimal(stock.sales[product.id] ?? '0'), decimal(price)));
    const components = finance.costs.some(row => row.productId === product.id && row.basis === 'product');
    if (cost === null && !components) { productComplete = false; qualify(product.id, 'Brak pełnego kosztu zmiennego lub składników.'); }
    if (cost !== null && components) throw new Error('Pełny koszt produktu i składniki dublują ten sam wydatek.');
    if (cost !== null) productCost = add(productCost, times(decimal(String(product.target)), decimal(cost)));
  }
  const costRows = finance.costs.map(row => {
    const quantity = known(row.quantity); const rate = known(row.rate);
    const matching = row.taxBasis === finance.taxBasis && row.period === finance.period && finance.period === input.period;
    if (!matching) qualify(row.id, 'Niezgodna podstawa brutto/netto lub okres kosztu; wymagane uzgodnienie.');
    const divisor = row.quantity.unit === 'g' && row.rate.unit === 'PLN/kg' ? decimal('1000') : row.quantity.unit === 'person-min' && row.rate.unit === 'PLN/person-hour' ? decimal('60') : decimal('1');
    const amount = quantity === null || rate === null || !matching ? null : divide(times(decimal(quantity), decimal(rate)), divisor);
    if (row.ingredientId && !saved.publications.some(publication => publication.snapshot.ingredients.some(ingredient => ingredient.ingredientId === row.ingredientId))) throw new Error('Koszt nie wskazuje historycznego składnika publikacji.');
    if (amount === null) {
      qualify(row.id, 'Brak ilości, stawki lub uzgodnionej podstawy kosztu.');
      if (row.basis === 'product') productComplete = false;
      if (row.basis === 'variable') variableComplete = false;
      if (row.basis === 'fixed') fixedComplete = false;
    } else {
      if (row.basis === 'product') productCost = add(productCost, amount);
      if (row.basis === 'variable') otherVariable = add(otherVariable, amount);
      if (row.basis === 'fixed') fixedCost = add(fixedCost, amount);
    }
    const allocationSum = row.allocations.reduce((sum, allocation) => add(sum, decimal(allocation.share)), ratio(0n));
    if (row.method === 'pool' && row.basis !== 'fixed' && compare(allocationSum, decimal('1')) !== 0n) qualify(row.id, 'Nieuzgodniona alokacja wspólnej pracy; znany koszt puli liczony raz.');
    return { id: row.id, expenseId: row.expenseId, category: row.category, basis: row.basis, amount: amount ? money(amount) : null,
      allocations: row.allocations.map(allocation => ({ productId: allocation.productId, quantity: quantity === null ? null : money(times(decimal(quantity), decimal(allocation.share))), amount: amount ? money(times(amount, decimal(allocation.share))) : null })) };
  });
  const variableCost = add(productCost, otherVariable); const contribution = subtract(revenue, variableCost);
  const contributionComplete = revenueComplete && productComplete && variableComplete;
  const operational = subtract(contribution, fixedCost);
  const receipts = known(finance.cashReceipts); const payments = known(finance.cashPayments);
  const required = requiredSales(finance.requiredSales);
  const comparison: Record<string, { ready: string | null; required: string; deficit: string | null }> = {};
  for (const [productId, sold] of Object.entries(required.sold)) {
    const aligned = finance.requiredSales.period === input.period && finance.requiredSales.budget.status !== 'missing' && finance.requiredSales.budget.period === input.period;
    const ready = aligned ? stock.readyPieces[productId] ?? null : null;
    if (!aligned) qualify(productId, 'Okres wymaganej sprzedaży i zdolności nie jest zgodny.');
    const difference = ready === null ? null : subtract(decimal(sold), decimal(ready));
    comparison[productId] = { ready, required: sold, deficit: difference === null ? null : difference.numerator > 0n ? ceil(difference).toString() : '0' };
  }
  const laborMinutes = Object.values(process.laborMinutes).reduce((sum, minutes) => sum + minutes, 0);
  const bottleneck = known(finance.bottleneckMinutes);
  if (!laborMinutes) qualify('laborRatio', 'Brak dodatniego mianownika osobogodzin.');
  if (bottleneck === null || decimal(bottleneck).numerator === 0n) qualify('bottleneckRatio', 'Brak dodatniego mianownika minut wąskiego gardła.');
  qualify('ownerNet', 'Cel 6 000 PLN netto miesięcznie niezweryfikowany: brak kwalifikacji miesiąca i uzgodnionych obciążeń właściciela.');
  qualify('payback', 'Zwrot niezweryfikowany: brak kwalifikowanej powtarzalnej miesięcznej nadwyżki i nakładu.');
  if (known(finance.ownerValue) === null) qualify('ownerValue', 'Brak ekonomicznej wartości pracy właściciela; nie oznacza darmowej pracy.');
  return { rounding: 'PLN 0.01 half-away-from-zero', taxBasis: finance.taxBasis, period: input.period,
    revenue: revenueComplete ? money(revenue) : null, knownRevenue: money(revenue), productCost: productComplete ? money(productCost) : null,
    grossMargin: revenueComplete && productComplete ? money(subtract(revenue, productCost)) : null,
    variableCost: productComplete && variableComplete ? money(variableCost) : null,
    contribution: revenueComplete && productComplete && variableComplete ? money(contribution) : null, knownContribution: money(contribution),
    fixedCost: fixedComplete ? money(fixedCost) : null, operatingRemainder: revenueComplete && productComplete && variableComplete && fixedComplete ? money(operational) : null,
    cashSurplus: receipts !== null && payments !== null ? money(subtract(decimal(receipts), decimal(payments))) : null,
    ownerEconomicValue: known(finance.ownerValue), actualTimeCost: null, employmentCost: null,
    contributionPerPiece: contributionComplete && Object.values(stock.sales).some(value => value !== '0') ? money(divide(contribution, Object.values(stock.sales).reduce((sum, value) => add(sum, decimal(value)), ratio(0n)))) : null,
    contributionPerBatch: contributionComplete && input.products.length ? money(divide(contribution, decimal(String(input.products.length)))) : null,
    contributionPerPersonHour: contributionComplete && laborMinutes ? money(divide(contribution, divide(decimal(String(laborMinutes)), decimal('60')))) : null,
    contributionPerBottleneckMinute: contributionComplete && bottleneck !== null && decimal(bottleneck).numerator > 0n ? money(divide(contribution, decimal(bottleneck))) : null,
    requiredSales: required, comparison, costs: costRows, qualifications,
  };
}
