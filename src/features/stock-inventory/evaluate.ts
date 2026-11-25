import type { Lot, Movement } from './schema';
import type { ProcessResult } from '../process-execution/evaluate';
import type { Qualification } from '../investment-scenarios/values';
import { convertQuantity, quantityText, quantityUnits } from './quantity';
import { fixed } from '../economics-investment/money';

export interface StockResult {
  lots: { id: string; itemId: string; physical: string | null; saleable: string | null; unit: string | null; sourceParts: string[]; preparationContext: string }[];
  sales: Record<string, string>; readyPieces: Record<string, string>;
  unmet: { movementId: string; quantity: string; reason: string }[];
  movements: Movement[]; qualifications: Qualification[];
}
export function evaluateStock(lots: Lot[], movements: Movement[], process: ProcessResult): StockResult {
  const unique = new Map<string, Movement>();
  for (const movement of movements) {
    const prior = unique.get(movement.id);
    if (prior && JSON.stringify(prior) !== JSON.stringify(movement)) throw new Error('Sprzeczna tożsamość ruchu.');
    unique.set(movement.id, movement);
  }
  const balances = new Map(lots.map(lot => [lot.id, { lot, physical: lot.quantity ? quantityUnits(lot.quantity.value) : null, saleable: lot.quantity && lot.admitted === true && lot.admissionSource && lot.expiresAt ? quantityUnits(lot.quantity.value) : 0n, parts: [...lot.sourceParts] }]));
  const result: StockResult = { lots: [], sales: {}, readyPieces: {}, unmet: [], movements: [], qualifications: [] };
  const readiness = (lot: Lot) => {
    if (!lot.readyOperationId) return Date.parse(lot.availableAt);
    const operation = process.operations.find(operation => operation.id === lot.readyOperationId);
    return operation?.end ? Math.max(Date.parse(lot.availableAt), Date.parse(operation.end)) : null;
  };
  for (const lot of lots) {
    const ready = readiness(lot);
    if (lot.quantity === null || lot.admitted === null || !lot.expiresAt || !lot.admissionSource || ready === null) result.qualifications.push({ domain: 'materials', identity: lot.id, reason: 'Brak stanu, gotowości, przydatności lub dopuszczenia.' });
    const operation = process.operations.find(operation => operation.id === lot.readyOperationId);
    if (lot.productId && lot.quantity?.unit === 'piece' && ready !== null && ready <= Date.parse(process.interval.end) && lot.admitted && lot.admissionSource && lot.expiresAt && Date.parse(lot.expiresAt) > Math.max(ready, Date.parse(process.interval.start)) && !operation?.deadlineMissed && (!operation || ready <= Date.parse(operation.readyBy))) {
      result.readyPieces[lot.productId] = quantityText(quantityUnits(result.readyPieces[lot.productId] ?? '0') + quantityUnits(lot.quantity.value));
    }
  }
  for (const movement of [...unique.values()].sort((a, b) => Date.parse(a.at) - Date.parse(b.at) || a.id.localeCompare(b.id))) {
    const balance = balances.get(movement.lotId);
    if (!balance) throw new Error('Nieznana partia.');
    const { lot } = balance; const requested = quantityUnits(movement.quantity.value);
    if (requested <= 0n) throw new Error('Ilość ruchu musi być dodatnia.');
    const fail = (quantity: bigint, reason: string) => result.unmet.push({ movementId: movement.id, quantity: quantityText(quantity), reason });
    if (movement.kind === 'refund') { result.movements.push(movement); continue; }
    if (balance.physical === null || !lot.quantity) { fail(requested, 'Brak stanu lub konwersji jednostki.'); continue; }
    const convert = (quantity: bigint) => {
      const exact = convertQuantity(quantityText(quantity), movement.quantity.unit, lot.quantity!.unit, movement.conversion);
      if (lot.quantity!.unit === 'piece' && exact.numerator % exact.denominator !== 0n) throw new Error('Konwersja nie daje całych sztuk.');
      return quantityUnits(fixed(exact, 3));
    };
    let amount: bigint;
    try { amount = convert(requested); } catch { fail(requested, 'Brak zgodnej, źródłowej konwersji jednostek.'); continue; }
    if (amount === 0n) { fail(requested, 'Ilość po konwersji jest poniżej precyzji masy.'); continue; }
    if (movement.kind === 'sale' && movement.quantity.unit !== 'piece') { fail(requested, 'Sprzedaż do ekonomii wymaga sztuk i jawnej konwersji partii masowej.'); continue; }
    if (movement.kind === 'delivery' || movement.kind === 'return') {
      balance.physical += amount;
      if (movement.admitted && lot.admissionSource && lot.expiresAt) balance.saleable += amount;
      result.movements.push(movement); continue;
    }
    const ready = readiness(lot);
    if (ready === null || Date.parse(movement.at) < ready) { fail(requested, 'Ruch poprzedza gotowość partii.'); continue; }
    if (movement.kind === 'sale' || movement.kind === 'consume' || movement.kind === 'carry') {
      if (ready === null || Date.parse(movement.at) < ready || !lot.expiresAt || Date.parse(movement.at) >= Date.parse(lot.expiresAt)) { fail(requested, 'Brak gotowości lub dopuszczenia w terminie.'); continue; }
    }
    const available = ['sale', 'consume', 'carry'].includes(movement.kind) ? balance.saleable : balance.physical;
    if (amount > available && movement.kind !== 'sale') { fail(requested, 'Wydanie przekracza stan; ruch odrzucony.'); continue; }
    const supported = amount > available ? (requested * available / amount / 1000n) * 1000n : requested;
    const applied = amount > available ? convert(supported) : amount;
    if (supported < requested) fail(requested - supported, 'Niezrealizowana sprzedaż ponad dostępny stan.');
    const target = movement.targetLotId ? balances.get(movement.targetLotId) : null;
    if (movement.kind === 'transfer' && (!target || target.physical === null || target.lot.itemId !== lot.itemId || target.lot.quantity?.unit !== lot.quantity.unit)) { fail(requested, 'Brak docelowej partii tego samego składnika/produktu lub zgodnej jednostki.'); continue; }
    const transferredSaleable = applied > balance.saleable ? balance.saleable : applied;
    balance.physical -= applied;
    if (movement.kind === 'waste' || movement.kind === 'loss') {
      const inadmissible = balance.physical + applied - balance.saleable;
      balance.saleable -= applied > inadmissible ? applied - inadmissible : 0n;
    } else balance.saleable -= applied > balance.saleable ? balance.saleable : applied;
    if (target && target.physical !== null) { target.physical += applied; target.saleable += target.lot.admitted ? transferredSaleable : 0n; target.parts = [...new Set([...target.parts, ...balance.parts])]; }
    if (movement.kind === 'sale') {
      const product = lot.productId ?? lot.itemId;
      result.sales[product] = quantityText(quantityUnits(result.sales[product] ?? '0') + supported);
    }
    result.movements.push(movement);
  }
  result.lots = [...balances.values()].map(({ lot, physical, saleable, parts }) => ({ id: lot.id, itemId: lot.itemId, physical: physical === null ? null : quantityText(physical), saleable: physical === null ? null : quantityText(saleable), unit: lot.quantity?.unit ?? null, sourceParts: parts, preparationContext: lot.preparationContext }));
  return result;
}
