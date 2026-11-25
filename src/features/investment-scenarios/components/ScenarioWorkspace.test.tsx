// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ScenarioWorkspace from './ScenarioWorkspace';
import { scenarioFixture } from '../reference';
import { evaluateScenario } from '../evaluate';
import { freezeRecipe } from '@/features/recipes/publication';

const actions = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn(), run: vi.fn() }));
vi.mock('../scenario.actions', () => ({ loadWorkspaceAction: actions.load, saveScenarioAction: actions.save, runScenarioAction: actions.run }));
const input = scenarioFixture();
const saved = { input, publications: input.products.map(product => ({ productId: product.id, publicationId: product.publicationId, versionKey: `${product.id}:1`, snapshot: freezeRecipe({ name: product.id, yield: 1, standalone: true, description: 'Test', process: [{ instruction: 'Etap' }], ingredients: [{ ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'pszenna' }, mass: '500' }] }) })) };
const data = { ok: true, scenarios: [{ key: 'test', name: input.name }], publications: saved.publications.map(publication => ({ id: publication.publicationId, name: publication.productId, versionKey: publication.versionKey })), revision: { id: 1, number: 1, fingerprint: 'frozen-input', saved }, run: { id: 1, revisionNumber: 1, report: evaluateScenario(saved), input: saved } };
beforeEach(() => { vi.resetAllMocks(); actions.load.mockResolvedValue(data); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('retains the previous report and local input after a save conflict', async () => {
  render(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.change(screen.getAllByLabelText('Nazwa')[0], { target: { value: 'Zmiana niezapisana' } });
  expect(screen.getByText('Wynik dawnych wejść — formularz zawiera niezapisane zmiany. Silnik: investment-scenario/1.')).toBeTruthy();
  actions.save.mockResolvedValue({ ok: false, category: 'conflict', message: 'Konflikt wersji.', fields: [] });
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz nową wersję' }));
  await screen.findByText('Konflikt wersji.');
  expect((screen.getAllByLabelText('Nazwa')[0] as HTMLInputElement).value).toBe('Zmiana niezapisana');
  expect(screen.getByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' })).toBeTruthy();
});
it('ignores a late response after switching the variant', async () => {
  let resolveOld: (value: typeof data) => void = () => {};
  actions.load.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; })).mockResolvedValueOnce({ ...data, revision: null, run: null, scenarios: [] });
  const view = render(<ScenarioWorkspace scenarioKey="old" />);
  view.rerender(<ScenarioWorkspace scenarioKey="new" />);
  await screen.findByText('Brak zapisanej wersji.');
  await act(async () => resolveOld(data));
  expect(screen.queryByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' })).toBeNull();
});
it('supports adding a third product in the same editor', async () => {
  render(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.click(screen.getByRole('button', { name: 'Dodaj: produkty i publikacje', hidden: true }));
  expect(screen.getByText('Produkty i publikacje 3')).toBeTruthy();
});

it('updates the revision selector after confirmation without relabeling an earlier report', async () => {
  actions.load.mockResolvedValue({ ...data, revisions: [{ id: 1, number: 1 }] });
  actions.save.mockResolvedValue({ ok: true, revision: { id: 2, number: 2, fingerprint: 'new-input', saved: { ...saved, input: { ...input, name: 'Wersja 2' } } } });
  render(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.change(screen.getAllByLabelText('Nazwa')[0], { target: { value: 'Wersja 2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz nową wersję' }));
  await screen.findByRole('option', { name: 'Wersja 2' });
  expect((screen.getByLabelText('Otwórz zapisaną wersję (zastępuje niezapisany formularz)') as HTMLSelectElement).value).toBe('2');
  expect(screen.getByText('Wynik wcześniejszej zapisanej wersji — nie dotyczy bieżącej wersji formularza. Silnik: investment-scenario/1.')).toBeTruthy();
});

it('clears protected data on logout even while a run response is pending', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}')));
  const result = { ok: true, run: { id: 2, report: data.run.report, input: saved } };
  let finish: (value: typeof result) => void = () => {};
  actions.run.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  render(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.click(screen.getByRole('button', { name: 'Uruchom zapisaną wersję 1' }));
  fireEvent.click(screen.getByRole('button', { name: 'Wyloguj i usuń dane z widoku' }));
  expect(screen.queryByRole('article', { name: 'Raport zapisanego przebiegu' })).toBeNull();
  await act(async () => finish(result));
  expect(screen.queryByRole('article', { name: 'Raport zapisanego przebiegu' })).toBeNull();
});
