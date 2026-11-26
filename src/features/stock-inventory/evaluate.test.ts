import { describe, it, expect } from 'vitest';
import { evaluateStock } from './evaluate';
import { movementSchema, type Lot } from './schema';
import { scenarioFixture, at, sourced } from '@/tests/fixtures/investment-scenarios';
import { evaluateProcess } from '../process-execution/evaluate';

describe('isolated time-dependent stock', () => {
  it.each(['06:40', '07:00'])('does not revive source stock transferred at %s after its 06:45 expiry', transferAt => {
    const input = scenarioFixture(); const source = { ...input.lots[0], expiresAt: at('06:45') };
    const target = { ...source, id: 'target', expiresAt: at('23:00'), quantity: { value: '0', unit: 'piece' as const } };
    const transfer = { ...input.movements[0], id: 'transfer', kind: 'transfer' as const, targetLotId: target.id, at: at(transferAt) };
    const sale = { ...input.movements[0], lotId: target.id, at: at('07:01') };
    const result = evaluateStock([source, target], [transfer, sale], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A ?? '0').toBe('0');
    expect(result.unmet).toEqual([expect.objectContaining({ movementId: sale.id, quantity: '20' })]);
    expect(result.lots[1]).toMatchObject({ physical: '20', saleable: '0' });
  });
  it('depletes stock once even when repeated sales retain their own lot as target', () => {
    const input = scenarioFixture();
    const sale = { ...input.movements[0], targetLotId: input.lots[0].id };
    const result = evaluateStock(input.lots, [sale, { ...sale, id: 'second-sale' }], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A).toBe('20');
    expect(result.lots[0]).toMatchObject({ physical: '0', saleable: '0' });
    expect(result.unmet).toEqual([expect.objectContaining({ movementId: 'second-sale', quantity: '20' })]);
  });
  it('requires a distinct transfer destination and forbids targets on all other movement kinds', () => {
    const input = scenarioFixture(); const movement = input.movements[0];
    for (const kind of ['delivery', 'consume', 'loss', 'sale', 'carry', 'waste', 'return', 'refund'] as const) {
      const result = movementSchema.safeParse({ ...movement, kind, targetLotId: 'target' });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues[0].path).toEqual(['targetLotId']);
    }
    expect(movementSchema.safeParse({ ...movement, kind: 'transfer' }).success).toBe(false);
    expect(movementSchema.safeParse({ ...movement, kind: 'transfer', targetLotId: movement.lotId }).success).toBe(false);
    expect(movementSchema.safeParse({ ...movement, kind: 'transfer', targetLotId: 'target' }).success).toBe(true);
  });
  it('issues merged portions FEFO and preserves remaining provenance through a second transfer', () => {
    const input = scenarioFixture(); const process = evaluateProcess(input.operations, input.resources, input.interval);
    const source = { ...input.lots[0], expiresAt: at('07:30') };
    const target = { ...source, id: 'target', expiresAt: at('23:00'), quantity: { value: '8', unit: 'piece' as const }, sourceParts: ['fresh'] };
    const next = { ...target, id: 'next', quantity: { value: '0', unit: 'piece' as const }, sourceParts: ['next-opening'] };
    const transfer = { ...input.movements[0], id: 'transfer', kind: 'transfer' as const, targetLotId: target.id, quantity: { value: '12', unit: 'piece' as const } };
    const firstSale = { ...input.movements[0], id: 'first-sale', lotId: target.id, at: at('07:01'), quantity: { value: '2', unit: 'piece' as const } };
    const secondTransfer = { ...transfer, id: 'second-transfer', lotId: target.id, targetLotId: next.id, at: at('07:02'), quantity: { value: '18', unit: 'piece' as const } };
    const laterSale = { ...input.movements[0], id: 'later-sale', lotId: next.id, at: at('07:30'), quantity: { value: '18', unit: 'piece' as const } };
    const result = evaluateStock([source, target, next], [transfer, firstSale, secondTransfer, laterSale], process);
    expect(result.sales.A).toBe('10');
    expect(result.unmet).toEqual([expect.objectContaining({ movementId: laterSale.id, quantity: '10' })]);
    expect(result.lots).toMatchObject([{ physical: '8', saleable: '0' }, { physical: '0', saleable: '0' }, { physical: '10', saleable: '0', sourceParts: ['next-opening', 'A', 'fresh'] }]);
  });
  it.each(['expiry', 'admission', 'admissionSource'] as const)('keeps unknown source %s unverified at the destination', missing => {
    const input = scenarioFixture(); const source = { ...input.lots[0] };
    if (missing === 'expiry') source.expiresAt = null;
    if (missing === 'admission') source.admitted = null;
    if (missing === 'admissionSource') source.admissionSource = null;
    const target = { ...input.lots[0], id: 'target', quantity: { value: '0', unit: 'piece' as const } };
    const transfer = { ...input.movements[0], id: 'transfer', kind: 'transfer' as const, targetLotId: target.id };
    const sale = { ...input.movements[0], lotId: target.id, at: at('07:01') };
    const result = evaluateStock([source, target], [transfer, sale], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A ?? '0').toBe('0');
    expect(result.lots[1]).toMatchObject({ physical: '20', saleable: '0' });
    expect(result.qualifications).toEqual(expect.arrayContaining([expect.objectContaining({ domain: 'materials', identity: source.id }), expect.objectContaining({ domain: 'materials', identity: target.id })]));
  });
  it('keeps fresh destination stock usable when merged with expiry-unknown source stock', () => {
    const input = scenarioFixture(); const source = { ...input.lots[0], expiresAt: null };
    const target = { ...input.lots[0], id: 'target', quantity: { value: '8', unit: 'piece' as const }, sourceParts: ['fresh'] };
    const transfer = { ...input.movements[0], id: 'transfer', kind: 'transfer' as const, targetLotId: target.id };
    const sale = { ...input.movements[0], lotId: target.id, at: at('07:01'), quantity: { value: '28', unit: 'piece' as const } };
    const result = evaluateStock([source, target], [transfer, sale], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A).toBe('8');
    expect(result.unmet).toEqual([expect.objectContaining({ movementId: sale.id, quantity: '20' })]);
    expect(result.lots[1]).toMatchObject({ physical: '20', saleable: '0' });
    expect(result.qualifications).toEqual(expect.arrayContaining([expect.objectContaining({ identity: target.id })]));
  });
  it.each(['consume', 'carry'] as const)('does not let transferred expired portions satisfy %s', kind => {
    const input = scenarioFixture(); const source = { ...input.lots[0], expiresAt: at('06:45') };
    const target = { ...input.lots[0], id: 'target', quantity: { value: '0', unit: 'piece' as const } };
    const transfer = { ...input.movements[0], id: 'transfer', kind: 'transfer' as const, targetLotId: target.id };
    const issue = { ...input.movements[0], kind, lotId: target.id, at: at('07:01') };
    const result = evaluateStock([source, target], [transfer, issue], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots[1]).toMatchObject({ physical: '20', saleable: '0' });
    expect(result.unmet).toEqual([expect.objectContaining({ movementId: issue.id, quantity: '20' })]);
  });
  it.each(['expiry', 'admission', 'admissionSource'] as const)('also retains destination %s restrictions through onward transfers', restriction => {
    const input = scenarioFixture(); const source = input.lots[0];
    const target = { ...source, id: 'target', quantity: { value: '0', unit: 'piece' as const } };
    if (restriction === 'expiry') target.expiresAt = at('07:01');
    if (restriction === 'admission') target.admitted = false;
    if (restriction === 'admissionSource') target.admissionSource = null;
    const next = { ...source, id: 'next', quantity: { value: '0', unit: 'piece' as const } };
    const transfer = { ...input.movements[0], id: 'transfer', kind: 'transfer' as const, targetLotId: target.id };
    const onward = { ...transfer, id: 'onward', lotId: target.id, targetLotId: next.id, at: at('07:02') };
    const sale = { ...input.movements[0], lotId: next.id, at: at('07:03') };
    const result = evaluateStock([source, target, next], [transfer, onward, sale], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A ?? '0').toBe('0');
    expect(result.lots[2]).toMatchObject({ physical: '20', saleable: '0' });
  });
  it.each(['missing', 'self', 'unknown', 'item', 'unit', 'quantity'] as const)('rejects %s transfer destinations without changing either balance', invalid => {
    const input = scenarioFixture(); const source = input.lots[0];
    const target: Lot = { ...source, id: 'target', quantity: { value: '0', unit: 'piece' } };
    if (invalid === 'item') target.itemId = 'other';
    if (invalid === 'unit') target.quantity = { value: '0', unit: 'g' };
    if (invalid === 'quantity') target.quantity = null;
    const transfer = { ...input.movements[0], kind: 'transfer' as const, targetLotId: invalid === 'missing' ? undefined : invalid === 'self' ? source.id : invalid === 'unknown' ? 'absent' : target.id };
    const result = evaluateStock([source, target], [transfer], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots[0].physical).toBe('20');
    expect(result.lots[1].physical).toBe(invalid === 'quantity' ? null : '0');
    expect(result.unmet).toEqual([expect.objectContaining({ movementId: transfer.id, quantity: '20' })]);
    expect(result.movements).toEqual([]);
  });
  it.each(['consume', 'loss', 'sale', 'carry', 'waste'] as const)('never credits another lot for a %s with a retained target', kind => {
    const input = scenarioFixture(); const source = input.lots[0];
    const target = { ...source, id: 'target', quantity: { value: '0', unit: 'piece' as const } };
    const movement = { ...input.movements[0], kind, targetLotId: target.id };
    const result = evaluateStock([source, target], [movement], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots).toMatchObject([{ physical: '0' }, { physical: '0' }]);
  });
  it('does not sell before readiness, and reports supported sales only', () => {
    const input = scenarioFixture(); input.movements[0].at = at('05:00');
    const result = evaluateStock(input.lots, input.movements, evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.sales.A ?? '0').toBe('0'); expect(result.unmet[0].quantity).toBe('20');
    expect(result.sales.B).toBe('12');
  });
  it('counts identical movements once and rejects conflicting identities', () => {
    const input = scenarioFixture(); input.movements.push(structuredClone(input.movements[0]));
    const process = evaluateProcess(input.operations, input.resources, input.interval);
    expect(evaluateStock(input.lots, input.movements, process).sales.A).toBe('20');
    input.movements[2].quantity.value = '1';
    expect(() => evaluateStock(input.lots, input.movements, process)).toThrow(/tożsamość/);
  });
  it('preserves zero, unknown opening and atomic over-issue in exact grams', () => {
    const input = scenarioFixture(); const lot = { ...input.lots[0], kind: 'material' as const, quantity: { value: '20000', unit: 'g' as const }, readyOperationId: undefined };
    const movement = { ...input.movements[0], kind: 'consume' as const, quantity: { value: '19500', unit: 'g' as const } };
    const loss = { ...movement, id: 'loss', at: at('07:01'), kind: 'loss' as const, quantity: { value: '500', unit: 'g' as const }, reason: 'Rozlanie' };
    const over = { ...movement, id: 'over', at: at('07:02'), quantity: { value: '1000', unit: 'g' as const } };
    const process = evaluateProcess(input.operations, input.resources, input.interval);
    const result = evaluateStock([lot], [movement, loss, over], process);
    expect(result.lots[0].physical).toBe('0'); expect(result.unmet[0].quantity).toBe('1000');
    expect(evaluateStock([{ ...lot, quantity: null }], [movement], process).lots[0].physical).toBeNull();
  });
  it('keeps inadmissible returns physical and refunds quantity-neutral', () => {
    const input = scenarioFixture();
    const returned = { ...input.movements[0], id: 'return', kind: 'return' as const, admitted: false, quantity: { value: '2', unit: 'piece' as const } };
    const result = evaluateStock(input.lots, [returned, { ...returned, id: 'refund', kind: 'refund' }], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots[0]).toMatchObject({ physical: '22', saleable: '20' });
  });
  it('does not turn excess, expired or inadmissible quantities into revenue', () => {
    const input = scenarioFixture(); input.movements[0].quantity.value = '30';
    const process = evaluateProcess(input.operations, input.resources, input.interval);
    const result = evaluateStock(input.lots, input.movements, process);
    expect(result.sales.A).toBe('20'); expect(result.unmet[0].quantity).toBe('10');
    input.lots[0].expiresAt = at('06:00');
    expect(evaluateStock(input.lots, input.movements, process).sales.A).toBeUndefined();
    expect(evaluateStock(input.lots, input.movements, process).readyPieces.A).toBeUndefined();
  });
  it('conserves transferred parts without admitting non-saleable source stock', () => {
    const input = scenarioFixture();
    const source = { ...input.lots[0], admitted: false };
    const target = { ...input.lots[0], id: 'target', quantity: { value: '0', unit: 'piece' as const }, sourceParts: ['target-opening'] };
    const transfer = { ...input.movements[0], kind: 'transfer' as const, targetLotId: 'target', quantity: { value: '12', unit: 'piece' as const } };
    const result = evaluateStock([source, target], [transfer], evaluateProcess(input.operations, input.resources, input.interval));
    expect(result.lots[0].physical).toBe('8');
    expect(result.lots[1]).toMatchObject({ physical: '12', saleable: '0', sourceParts: ['target-opening', 'A'] });
  });
  it('uses an entered yield conversion without selling mass as pieces', () => {
    const input = scenarioFixture(); const process = evaluateProcess(input.operations, input.resources, input.interval);
    const lot = { ...input.lots[0], quantity: { value: '1000', unit: 'g' as const } };
    const sale = { ...input.movements[0], quantity: { value: '12', unit: 'piece' as const }, conversion: { from: { value: '1', unit: 'piece' as const }, to: { value: '100', unit: 'g' as const }, evidence: sourced('100', 'g/piece') } };
    const result = evaluateStock([lot], [sale], process);
    expect(result.sales.A).toBe('10'); expect(result.unmet[0].quantity).toBe('2'); expect(result.lots[0].physical).toBe('0');
  });
});
