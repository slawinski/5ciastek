import type { SavedInputV2 } from '../investment-scenarios/schema-v2';
import type { ProcessResult } from '../process-execution/evaluate';
import type { Movement, Lot } from './schema';
import { evaluateStock } from './evaluate';
import { scaleRecipe } from '../recipes/scaling';
import { quantityText, quantityUnits } from './quantity';
import { known, type Qualification } from '../investment-scenarios/values';

export function stockAt(lots: Lot[], movements: Movement[], process: ProcessResult, at: string) {
  const instant = Date.parse(at);
  const snapshotLots = lots.map(lot => {
    const ready = lot.readyOperationId ? process.operations.find(operation => operation.id === lot.readyOperationId)?.end : lot.availableAt;
    return !ready || Date.parse(ready) > instant || Date.parse(lot.availableAt) > instant ? { ...lot, quantity: lot.quantity ? { ...lot.quantity, value: '0' } : null } : lot;
  });
  return evaluateStock(snapshotLots, movements.filter(movement => Date.parse(movement.at) < instant && movement.kind !== 'carry'), { ...process, interval: { start: at, end: at } });
}

export function recipeCoverage(saved: SavedInputV2, process: ProcessResult) {
  const { input } = saved; const movements: Movement[] = []; const qualifications: Qualification[] = [];
  const coverage: { batchId: string; status: 'verified' | 'unverified'; ingredientId: number; required: string; fromWip: string; allocated: string; missing: string; at: string | null }[] = [];
  const requirements = input.batches.map(batch => {
    const publication = saved.publications.find(row => row.productId === batch.productId);
    if (!publication) throw new Error('Brak zamrożonej publikacji produktu.');
    const scaled = scaleRecipe(publication.snapshot, batch.target);
    const operationIds = new Set(input.operations.filter(operation => operation.batchId === batch.id).map(operation => operation.id));
    const first = process.operations.filter(operation => operationIds.has(operation.id) && operation.start).sort((a, b) => Date.parse(a.start!) - Date.parse(b.start!))[0];
    const at = first?.start ? new Date(Math.max(Date.parse(first.start), Date.parse(input.interval.start))).toISOString() : null;
    return { batch, publication, scaled, at };
  }).sort((a, b) => (a.at ? Date.parse(a.at) : Infinity) - (b.at ? Date.parse(b.at) : Infinity) || a.batch.id.localeCompare(b.batch.id));
  for (const { batch, scaled, publication, at } of requirements) {
    for (const ingredient of scaled.ingredients) {
      const required = quantityUnits(ingredient.grams);
      const wip = input.openingWip.filter(row => row.batchId === batch.id);
      let embodied = 0n; let complete = at !== null;
      for (const source of wip) {
        const supplied = source.coverage.find(row => row.ingredientId === ingredient.ingredientId);
        if (!supplied || supplied.quantity.unit !== 'g' || known(supplied.evidence) === null || known(source.evidence) === null) complete = false;
        else embodied += quantityUnits(supplied.quantity.value);
      }
      if (embodied > required) throw new Error('Pokrycie WIP przekracza recepturę partii.');
      let remaining = required - embodied; let allocated = 0n;
      if (at) {
        const state = stockAt(input.lots, [...input.movements, ...movements], process, new Date(Date.parse(at) + 1).toISOString());
        const candidates = input.lots.filter(lot => lot.kind === 'material' && lot.itemId === String(ingredient.ingredientId) && lot.quantity?.unit === 'g' && Date.parse(lot.availableAt) <= Date.parse(at))
          .sort((a, b) => (a.expiresAt ? Date.parse(a.expiresAt) : Infinity) - (b.expiresAt ? Date.parse(b.expiresAt) : Infinity) || a.id.localeCompare(b.id));
        for (const lot of candidates) {
          if (remaining === 0n) break;
          const available = quantityUnits(state.lots.find(row => row.id === lot.id)?.saleable ?? '0');
          const amount = remaining < available ? remaining : available;
          if (amount <= 0n) continue;
          movements.push({ id: `recipe:${batch.id}:${ingredient.ingredientId}:${lot.id}`, lotId: lot.id, at, kind: 'consume', quantity: { value: quantityText(amount), unit: 'g' }, admitted: true,
            evidence: { status: 'estimated', value: quantityText(amount), unit: 'g', source: `Publikacja ${publication.versionKey}; partia ${batch.id}; źródło ${lot.id}`, date: at.slice(0, 10), version: publication.versionKey, period: input.period, context: 'Pozostałe zapotrzebowanie po rozliczeniu wejściowego WIP.' }, reason: 'Źródłowe zużycie recepturowe FEFO.' });
          allocated += amount; remaining -= amount;
        }
      }
      const status = complete && remaining === 0n ? 'verified' : 'unverified';
      coverage.push({ batchId: batch.id, status, ingredientId: ingredient.ingredientId, required: quantityText(required), fromWip: quantityText(embodied), allocated: quantityText(allocated), missing: quantityText(remaining), at });
      if (status === 'unverified') qualifications.push({ domain: 'materials', identity: batch.id, reason: `Niepotwierdzone pokrycie składnika ${ingredient.ingredientId}; brak ${quantityText(remaining)} g lub źródła WIP/czasu.` });
    }
  }
  return { movements, qualifications, coverage, recipeRequirements: requirements.map(({ batch, publication, scaled }) => ({ batchId: batch.id, productId: batch.productId, publicationId: publication.publicationId, versionKey: publication.versionKey, scaled })) };
}

export function evaluateWeeklyStock(saved: SavedInputV2, process: ProcessResult) {
  const { input } = saved; const allocated = recipeCoverage(saved, process);
  const unsupported = new Set(allocated.coverage.filter(row => row.status !== 'verified').map(row => row.batchId));
  const lots = input.lots.map(lot => lot.batchId && unsupported.has(lot.batchId) ? { ...lot, admitted: false } : lot);
  const movements = [...input.movements.filter(movement => movement.kind !== 'carry'), ...allocated.movements];
  const result = evaluateStock(lots, movements, process);
  const opening = stockAt(lots, [], process, input.interval.start).lots;
  const closing = stockAt(lots, movements, process, input.interval.end).lots;
  for (const carry of input.movements.filter(movement => movement.kind === 'carry')) {
    const state = stockAt(lots, movements, process, new Date(Date.parse(carry.at) + 1).toISOString());
    const balance = state.lots.find(lot => lot.id === carry.lotId);
    if (!balance?.saleable || quantityUnits(balance.saleable) < quantityUnits(carry.quantity.value) || balance.unit !== carry.quantity.unit) result.unmet.push({ movementId: carry.id, quantity: carry.quantity.value, reason: 'Brak dopuszczonej ilości do przeniesienia.' });
    else result.movements.push(carry);
  }
  result.qualifications.push(...allocated.qualifications, ...result.unmet.map(row => ({ domain: 'materials' as const, identity: row.movementId, reason: `${row.reason} Brak: ${row.quantity}.` })));
  return { ...result, lots: closing, boundaries: { opening, closing }, coverage: allocated.coverage,
    openingDepletion: opening.map(lot => ({ lotId: lot.id, itemId: lot.itemId, unit: lot.unit, opening: lot.physical, closing: closing.find(row => row.id === lot.id)?.physical ?? null, sourceParts: lot.sourceParts })),
    recipeRequirements: allocated.recipeRequirements,
  };
}
