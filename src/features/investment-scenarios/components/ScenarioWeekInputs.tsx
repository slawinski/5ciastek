'use client';
import { useState } from 'react';
import Button from '@/components/Button';
import { scenarioV2Schema } from '../schema-v2';
import { ScenarioInputs, type FormValue, type PublicationOption } from './ScenarioInputs';
import { ScenarioMonthInputs } from './ScenarioMonthInputs';
import { ScenarioInvestmentInputs } from './ScenarioInvestmentInputs';

/** Extends the existing sourced editor; edits remain drafts until the common save receipt. */
export function ScenarioWeekInputs({ value, onChange, publications, revealPath }: { value: FormValue; onChange: (value: FormValue) => void; publications: PublicationOption[]; revealPath: string }) {
  const [selected, setSelected] = useState('');
  const parsed = scenarioV2Schema.safeParse(value);
  function addBatch() {
    if (!parsed.success) return;
    const input = structuredClone(parsed.data); const batch = input.batches.find(row => row.id === selected) ?? input.batches[0];
    const suffix = crypto.randomUUID(); const batchId = `batch:${suffix}`;
    const ids = new Map(input.operations.filter(row => row.batchId === batch.id).map(row => [row.id, `${suffix}:${row.id}`]));
    input.batches.push({ ...batch, id: batchId, readyOperationId: ids.get(batch.readyOperationId)! });
    input.operations.push(...input.operations.filter(row => row.batchId === batch.id).map(row => ({ ...row, id: ids.get(row.id)!, batchId,
      predecessors: row.predecessors.map(id => ids.get(id)!), ...(row.phase ? { phase: { ...row.phase, id: ids.get(row.phase.id)! } } : {}),
    })));
    input.lots.push(...input.lots.filter(row => row.batchId === batch.id).map(row => ({ ...row, id: `${suffix}:${row.id}`, batchId, readyOperationId: ids.get(row.readyOperationId!)! })));
    input.windows.push(...input.windows.filter(row => row.batchId === batch.id).map(row => ({ ...row, id: `${suffix}:${row.id}`, batchId, operationId: ids.get(row.operationId)!, predecessorId: ids.get(row.predecessorId)! })));
    onChange(input);
  }
  return <section aria-labelledby="week-heading"><h3 id="week-heading">Tydzień, partie i WIP</h3>
    <p>Każda partia ma własną skalę, kolejność i gotowość. Źródłowe okna sprawdzamy po kolejce. Uzupełnij daty tygodnia, dostawy i WIP; brak nie jest zerem.</p>
    {parsed.success && <label htmlFor="batch-template">Partia wzorcowa<select id="batch-template" value={selected || parsed.data.batches[0].id} onChange={event => setSelected(event.target.value)}>{parsed.data.batches.map(batch => <option key={batch.id} value={batch.id}>{batch.productId} · {batch.id}</option>)}</select></label>}
    <Button type="button" disabled={!parsed.success} onClick={addBatch}>Dodaj kolejną partię produktu</Button>
    {!parsed.success && <p>Popraw bieżące wejścia przed skopiowaniem partii. Źródłowe pola pozostają edytowalne poniżej.</p>}
     <ScenarioInputs value={value} onChange={onChange} publications={publications} revealPath={revealPath} />
     <ScenarioMonthInputs value={value} onChange={onChange} publications={publications} revealPath={revealPath} />
     <ScenarioInvestmentInputs value={value} onChange={onChange} publications={publications} revealPath={revealPath} />
  </section>;
}
