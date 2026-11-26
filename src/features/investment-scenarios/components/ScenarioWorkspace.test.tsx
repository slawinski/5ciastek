// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import ScenarioWorkspace from './ScenarioWorkspace';
import { scenarioFixture } from '../reference';
import { evaluateScenario } from '../evaluate';
import { freezeRecipe } from '@/features/recipes/publication';
import { ScenarioInputs } from './ScenarioInputs';

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

it('reopens the first of two revisions saved on the creation route using the confirmed scenario key', async () => {
  actions.load.mockResolvedValueOnce({ ...data, scenarios: [], revision: null, run: null });
  actions.save.mockResolvedValueOnce({ ok: true, revision: data.revision }).mockResolvedValueOnce({ ok: true, revision: { ...data.revision, id: 2, number: 2 } });
  render(<ScenarioWorkspace scenarioKey={null} />);
  fireEvent.click(await screen.findByRole('button', { name: 'Utwórz wariant odniesienia' }));
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz nową wersję' }));
  await screen.findByRole('option', { name: 'Wersja 1' });
  fireEvent.change(screen.getAllByLabelText('Nazwa')[0], { target: { value: 'Wersja 2' } });
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz nową wersję' }));
  await screen.findByRole('option', { name: 'Wersja 2' });
  fireEvent.change(screen.getByLabelText('Otwórz zapisaną wersję (zastępuje niezapisany formularz)'), { target: { value: '1' } });
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  expect(actions.load).toHaveBeenNthCalledWith(1, null, null);
  expect(actions.load).toHaveBeenLastCalledWith(actions.save.mock.calls[0][0].scenarioKey, 1);
  expect((screen.getAllByLabelText('Nazwa')[0] as HTMLInputElement).value).toBe(input.name);
});

it('blocks retry during logout and ignores a late history response after logout succeeds', async () => {
  let finishLogout: (value: Response) => void = () => {};
  let finishLoad: (value: typeof data) => void = () => {};
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(resolve => { finishLogout = resolve; })));
  actions.load.mockImplementationOnce(() => new Promise(resolve => { finishLoad = resolve; })).mockResolvedValueOnce(data);
  const view = render(<ScenarioWorkspace scenarioKey="old" />);
  view.rerender(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.click(screen.getByRole('button', { name: 'Wyloguj i usuń dane z widoku' }));
  expect(screen.getByRole('status').textContent).toBe('Wylogowywanie — oczekiwanie na potwierdzenie…');
  const retry = screen.queryByRole('button', { name: 'Ponów odczyt' });
  if (retry) fireEvent.click(retry);
  view.rerender(<ScenarioWorkspace scenarioKey="next" />);
  expect(actions.load).toHaveBeenCalledTimes(2);
  await act(async () => finishLogout(new Response('{}')));
  await act(async () => finishLoad(data));
  expect(screen.getByRole('status').textContent).toBe('Brak dostępu.');
  expect(screen.queryByRole('article', { name: 'Raport zapisanego przebiegu' })).toBeNull();
  expect(screen.queryAllByLabelText('Nazwa')).toHaveLength(0);
  expect(screen.queryByRole('navigation', { name: 'Zapisane warianty' })).toBeNull();
});

it('keeps data cleared on unconfirmed logout and permits read recovery after it settles', async () => {
  let rejectLogout: (reason: Error) => void = () => {};
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((_, reject) => { rejectLogout = reject; })));
  render(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.click(screen.getByRole('button', { name: 'Wyloguj i usuń dane z widoku' }));
  expect(screen.queryByRole('button', { name: 'Ponów odczyt' })).toBeNull();
  await act(async () => rejectLogout(new Error('Connection lost')));
  await screen.findByText(/serwer nie potwierdził wylogowania/);
  expect(screen.queryByRole('article', { name: 'Raport zapisanego przebiegu' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Ponów odczyt' }));
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  expect(actions.load).toHaveBeenCalledTimes(2);
});

it('retries lost save and run confirmations with identical request identities', async () => {
  actions.save.mockRejectedValueOnce(new Error('Save committed, response lost')).mockResolvedValueOnce({ ok: true, revision: { ...data.revision, id: 2, number: 2 } });
  actions.run.mockRejectedValueOnce(new Error('Run committed, response lost')).mockResolvedValueOnce({ ok: true, run: { ...data.run, id: 2 } });
  render(<ScenarioWorkspace scenarioKey="test" />);
  await screen.findByRole('heading', { name: 'Raport · wersja 1 · przebieg 1' });
  fireEvent.change(screen.getAllByLabelText('Nazwa')[0], { target: { value: 'Ponawiany zapis' } });
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz nową wersję' }));
  await screen.findByText('Nie otrzymano potwierdzenia. Ponów zapis z tym samym kluczem.');
  fireEvent.click(screen.getByRole('button', { name: 'Zapisz nową wersję' }));
  await screen.findByRole('button', { name: 'Uruchom zapisaną wersję 2' });
  expect(actions.save.mock.calls[1][0]).toEqual(actions.save.mock.calls[0][0]);
  expect(actions.save.mock.calls[0][0].requestKey).toEqual(expect.any(String));
  fireEvent.click(screen.getByRole('button', { name: 'Uruchom zapisaną wersję 2' }));
  await screen.findByText('Nie potwierdzono przebiegu. Ponów operację.');
  fireEvent.click(screen.getByRole('button', { name: 'Uruchom zapisaną wersję 2' }));
  await screen.findByRole('heading', { name: 'Raport · wersja 2 · przebieg 2' });
  expect(actions.run.mock.calls[1][0]).toEqual(actions.run.mock.calls[0][0]);
  expect(actions.run.mock.calls[0][0]).toMatchObject({ revisionId: 2, requestKey: expect.any(String) });
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Przebieg zapisany.'));
});

it('only edits transfer targets for transfers and removes the target on kind changes', () => {
  const onChange = vi.fn();
  const props = { onChange, publications: [], revealPath: 'input.movements.0.kind' };
  const value = { movements: [{ lotId: 'lot-A', kind: 'transfer', targetLotId: 'lot-B' }] };
  const view = render(<ScenarioInputs {...props} value={value} />);
  expect((screen.getByLabelText('Partia docelowa (transfer)') as HTMLInputElement).value).toBe('lot-B');
  fireEvent.change(screen.getByLabelText('Rodzaj'), { target: { value: 'sale' } });
  expect(onChange).toHaveBeenLastCalledWith({ movements: [{ lotId: 'lot-A', kind: 'sale' }] });
  view.rerender(<ScenarioInputs {...props} value={{ movements: [{ ...value.movements[0], kind: 'sale' }] }} />);
  expect(screen.queryByLabelText('Partia docelowa (transfer)')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Dodaj docelową partię transferu' })).toBeNull();
  expect(screen.queryByRole('button', { name: 'Usuń: Partia docelowa (transfer)' })).toBeNull();
  view.rerender(<ScenarioInputs {...props} value={{ movements: [{ lotId: 'lot-A', kind: 'transfer' }] }} />);
  fireEvent.click(screen.getByRole('button', { name: 'Dodaj docelową partię transferu' }));
  expect(onChange).toHaveBeenLastCalledWith({ movements: [{ lotId: 'lot-A', kind: 'transfer', targetLotId: '' }] });
});
