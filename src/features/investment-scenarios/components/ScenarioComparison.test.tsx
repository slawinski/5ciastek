// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ScenarioComparison } from './ScenarioComparison';
import ScenarioWorkspace from './ScenarioWorkspace';
import type { PinnedRun } from '../comparison';
import { weeklyFixture } from '../reference';
import { evaluateScenarioV2 } from '../evaluate-v2';
import { freezeRecipe } from '@/features/recipes/publication';
const actions = vi.hoisted(() => ({ list: vi.fn(), prepare: vi.fn(), save: vi.fn(), load: vi.fn() }));
vi.mock('../comparison.actions', () => ({ listComparisonOptionsAction: actions.list, prepareComparisonAction: actions.prepare, saveComparisonAction: actions.save, loadComparisonAction: actions.load }));
vi.mock('../scenario.actions', () => ({ loadWorkspaceAction: vi.fn(async () => ({ ok: true, scenarios: [], publications: [], revision: null, run: null, revisions: [] })), saveScenarioAction: vi.fn(), runScenarioAction: vi.fn() }));
function run(id: number): PinnedRun {
  const input = weeklyFixture();
  const publications = input.products.map(product => ({ productId: product.id, publicationId: product.publicationId, versionKey: `${product.id}:1`, snapshot: freezeRecipe({ name: product.id, yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) }));
  const saved = { input, publications };
  return { runId: id, revisionId: id, revisionNumber: 1, scenarioKey: `variant-${id}`, fingerprint: 'a'.repeat(64), engineVersion: 'investment-scenario/2', body: { input: saved, output: evaluateScenarioV2(saved) } };
}
beforeEach(() => {
  vi.resetAllMocks(); actions.list.mockResolvedValue({ ok: true, revisions: [1, 2].map(id => ({ id, number: 1, scenarioKey: `variant-${id}`, name: `Wariant ${id}` })), comparisons: [] });
  actions.prepare.mockImplementation(async ({ revisionId }) => ({ ok: true, run: run(revisionId) }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('recomputes two distinct saved revisions before selection and retries an unconfirmed save unchanged', async () => {
  actions.save.mockRejectedValueOnce(new Error('lost confirmation')).mockResolvedValueOnce({ ok: true, comparisonKey: 'saved-pair' });
  render(<ScenarioComparison revisionId={1} />);
  await screen.findByRole('option', { name: /Wariant 1/ });
  fireEvent.click(screen.getByRole('button', { name: 'Przelicz i dodaj do porównania' }));
  await screen.findByText(/Wybrano: variant-1/);
  fireEvent.change(screen.getByLabelText('Zapisana wersja do porównania'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Przelicz i dodaj do porównania' }));
  await screen.findByText(/Wybrano: variant-2/);
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz niezmienne porównanie' }));
  await screen.findByRole('alert');
  expect(screen.queryByRole('link', { name: 'Otwórz zapisane porównanie' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz niezmienne porównanie' }));
  await screen.findByRole('link', { name: 'Otwórz zapisane porównanie' });
  expect(actions.save.mock.calls[0][0]).toEqual(actions.save.mock.calls[1][0]);
  expect(actions.save.mock.calls[0][0].runIds).toEqual([1, 2]);
});
it('clears a pinned comparison on logout and ignores its late read', async () => {
  let finish: (data: { ok: true; comparison: { comparisonKey: string; runs: PinnedRun[] } }) => void = () => {};
  actions.load.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')));
  render(<ScenarioComparison comparisonKey="pinned" />);
  fireEvent.click(screen.getByRole('button', { name: 'Wyloguj i usuń dane z widoku' }));
  await act(async () => finish({ ok: true, comparison: { comparisonKey: 'pinned', runs: [run(1), run(2)] } }));
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Brak dostępu.'));
  expect(screen.queryByRole('heading', { name: /Różnice wejść/ })).toBeNull();
});
it('does not select an unconfirmed run and keeps its request identity for retry', async () => {
  actions.prepare.mockRejectedValueOnce(new Error('lost confirmation')).mockResolvedValueOnce({ ok: true, run: run(1) });
  render(<ScenarioComparison revisionId={1} />);
  await screen.findByRole('option', { name: /Wariant 1/ });
  fireEvent.click(screen.getByRole('button', { name: 'Przelicz i dodaj do porównania' }));
  await screen.findByRole('alert');
  expect(screen.queryByText(/Wybrano:/)).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Przelicz i dodaj do porównania' }));
  await screen.findByText(/Wybrano: variant-1/);
  expect(actions.prepare.mock.calls[0][0]).toEqual(actions.prepare.mock.calls[1][0]);
});
it('workspace logout clears both selected variants and ignores a late comparison save', async () => {
  let finish: (value: { ok: true; comparisonKey: string }) => void = () => {};
  actions.save.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')));
  render(<ScenarioWorkspace scenarioKey={null} />);
  await screen.findByRole('option', { name: /Wariant 1/ });
  fireEvent.click(screen.getByRole('button', { name: 'Przelicz i dodaj do porównania' }));
  await screen.findByText(/Wybrano: variant-1/);
  fireEvent.change(screen.getByLabelText('Zapisana wersja do porównania'), { target: { value: '2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Przelicz i dodaj do porównania' }));
  await screen.findByText(/Wybrano: variant-2/);
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz niezmienne porównanie' }));
  fireEvent.click(screen.getByRole('button', { name: 'Wyloguj i usuń dane z widoku' }));
  expect(screen.queryByRole('region', { name: 'Porównania zapisanych wariantów' })).toBeNull();
  await act(async () => finish({ ok: true, comparisonKey: 'late-save' }));
  expect(screen.queryByRole('link', { name: 'Otwórz zapisane porównanie' })).toBeNull();
  expect(screen.queryByText(/Wybrano:/)).toBeNull();
});
