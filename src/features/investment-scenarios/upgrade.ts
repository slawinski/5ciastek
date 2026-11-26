import type { ScenarioInput } from './schema';
import { scenarioV2Schema, type ScenarioV2Input } from './schema-v2';
import type { Evidence } from './values';

export function upgradeScenario(original: ScenarioInput): ScenarioV2Input {
  const input = structuredClone(original);
  const missing = (unit: string): Evidence => ({ status: 'missing', unit, reason: 'Uzupełnij źródłowe dane MVP-2.' });
  return scenarioV2Schema.parse({ ...input, schemaVersion: 2,
    products: input.products.map(({ target: _target, readyOperationId: _ready, ...product }) => product),
    batches: input.products.map(product => ({ id: `batch:${product.id}`, productId: product.id, target: product.target, readyOperationId: product.readyOperationId })),
    operations: input.operations.map(operation => ({ ...operation, batchId: `batch:${operation.productId}` })),
    lots: input.lots.map(lot => ({ ...lot, ...(lot.readyOperationId ? { batchId: `batch:${lot.productId}` } : {}) })),
    openingWip: [], windows: input.operations.filter(operation => operation.predecessors.length).flatMap(operation => operation.predecessors.map(predecessorId => ({
      id: `window:${operation.id}:${predecessorId}`, batchId: `batch:${operation.productId}`, operationId: operation.id, predecessorId, useFromMinutes: '0', useUntilMinutes: operation.waitWindow,
    }))), month: null, investment: { equipment: missing('PLN'), premises: missing('PLN'), deposit: missing('PLN'), initialStock: missing('PLN') },
  });
}
