// @vitest-environment jsdom
import { StrictMode, type PropsWithChildren } from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import Catalog from './Catalog';
import { freezeRecipe } from '../publication';

vi.mock('@/components/PageLayout', () => ({ PageLayout: ({ children }: PropsWithChildren) => <main>{children}</main> }));

interface PendingRequest {
  url: string;
  signal?: AbortSignal | null;
  resolve: (response: Response) => void;
  reject: (reason: Error) => void;
}
function requests() {
  const pending: PendingRequest[] = [];
  vi.stubGlobal('fetch', vi.fn((input: RequestInfo | URL, options?: RequestInit) => new Promise<Response>((resolve, reject) => {
    // Deliberately ignore abort: generation checks must also guard queued completions.
    pending.push({ url: String(input), signal: options?.signal, resolve, reject });
  })));
  return pending;
}
const publication = (id: number, name: string) => ({ id, recipe: id, version: 1, snapshot: freezeRecipe({ name, standalone: true, yield: 1, description: name, process: [{ instruction: 'Test' }], ingredients: [{ mass: '1', ingredient: { id: 1, name: 'Mąka', kind: 'flour', flourType: 'A' } }] }) });
const json = (data: object, status = 200) => new Response(JSON.stringify(data), { status });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it.each(['401', '403', 'network rejection', 'malformed JSON', 'stale success'])('ignores an old %s completion after successful login and catalog selection', async completion => {
  const pending = requests();
  render(<StrictMode><Catalog /></StrictMode>);
  expect(pending).toHaveLength(2);
  await act(async () => pending[1].resolve(json({}, 403)));
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'baker@example.invalid' } });
  fireEvent.change(screen.getByLabelText('Hasło'), { target: { value: 'synthetic-password' } });
  fireEvent.submit(screen.getByRole('button', { name: 'Zaloguj się' }).closest('form')!);
  expect(pending[2].url).toBe('/api/users/login');
  await act(async () => pending[2].resolve(json({})));
  expect(pending).toHaveLength(4);
  await act(async () => pending[3].resolve(json({ docs: [publication(2, 'Fresh bread')] })));
  fireEvent.click(screen.getByRole('button', { name: 'Fresh bread · v1' }));
  expect(screen.getByRole('article', { name: 'Szczegóły receptury' })).toBeTruthy();
  await act(async () => {
    if (completion === 'network rejection') pending[0].reject(new Error('delayed failure'));
    else if (completion === 'malformed JSON') pending[0].resolve(new Response('invalid json'));
    else if (completion === 'stale success') pending[0].resolve(json({ docs: [publication(1, 'Old bread')] }));
    else pending[0].resolve(json({}, Number(completion)));
  });
  expect(screen.getByRole('region', { name: 'Katalog publikacji' })).toBeTruthy();
  expect(screen.getByRole('article', { name: 'Szczegóły receptury' }).textContent).toContain('Fresh bread');
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.queryByText('Zaloguj się do katalogu')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Old bread · v1' })).toBeNull();
  expect(pending[0].signal?.aborted).toBe(true);
});

it('aborts and invalidates pending body parsing and login on effect cleanup', async () => {
  const pending = requests();
  const mounted = render(<Catalog />);
  let finishBody!: (body: object) => void;
  const body = new Promise<object>(resolve => { finishBody = resolve; });
  const response = json({});
  vi.spyOn(response, 'json').mockReturnValue(body);
  await act(async () => pending[0].resolve(response));
  expect(response.json).toHaveBeenCalledOnce();
  mounted.unmount();
  expect(pending[0].signal?.aborted).toBe(true);
  await act(async () => finishBody({ docs: [publication(1, 'Obsolete')] }));
  expect(screen.queryByRole('main')).toBeNull();

  const loginView = render(<Catalog />);
  await act(async () => pending[1].resolve(json({}, 403)));
  fireEvent.submit(screen.getByRole('button', { name: 'Zaloguj się' }).closest('form')!);
  loginView.unmount();
  expect(pending[2].signal?.aborted).toBe(true);
  await act(async () => pending[2].resolve(json({})));
  expect(pending).toHaveLength(3); // An obsolete login must not start a new load.
});

it('ignores a superseded response body even when fetch finished before the next request', async () => {
  const pending = requests();
  render(<Catalog />);
  await act(async () => pending[0].resolve(json({}, 403)));
  const form = screen.getByRole('button', { name: 'Zaloguj się' }).closest('form')!;
  fireEvent.submit(form);
  let finishBody!: (body: object) => void;
  const body = new Promise<object>(resolve => { finishBody = resolve; });
  const response = json({});
  vi.spyOn(response, 'json').mockReturnValue(body);
  // A second submit queued before React commits the loading state supersedes
  // the already-received response while its JSON body is still pending.
  await act(async () => {
    pending[1].resolve(json({}));
    await Promise.resolve();
    pending[2].resolve(response);
    await Promise.resolve();
    expect(response.json).toHaveBeenCalledOnce();
    fireEvent.submit(form);
  });
  expect(pending[3].url).toBe('/api/users/login');
  await act(async () => pending[3].resolve(json({})));
  await act(async () => pending[4].resolve(json({ docs: [publication(2, 'Fresh bread')] })));
  fireEvent.click(screen.getByRole('button', { name: 'Fresh bread · v1' }));
  await act(async () => finishBody({ docs: [publication(1, 'Obsolete body')] }));
  expect(screen.getByRole('article', { name: 'Szczegóły receptury' }).textContent).toContain('Fresh bread');
  expect(screen.queryByRole('button', { name: 'Obsolete body · v1' })).toBeNull();
  expect(pending[2].signal?.aborted).toBe(true);
});
