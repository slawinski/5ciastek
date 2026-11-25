// @vitest-environment jsdom
import { Component, Suspense, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import ErrorPage from '@/app/(app)/error';
import FermentationCalculator from '@/features/fermentation/FermentationCalculator';
import HydrationCalculator from '@/features/hydration/components/HydrationCalculator';

let dispatchAction = () => {};
vi.mock('@/features/fermentation/fermentation.actions', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/fermentation/fermentation.actions')>();
  return { calculateFermentationTimesServer: (...args: Parameters<typeof original.calculateFermentationTimesServer>) => {
    dispatchAction();
    return original.calculateFermentationTimesServer(...args);
  } };
});
vi.mock('@/features/hydration/hydration.actions', async importOriginal => {
  const original = await importOriginal<typeof import('@/features/hydration/hydration.actions')>();
  return { calculateHydrationServer: (...args: Parameters<typeof original.calculateHydrationServer>) => {
    dispatchAction();
    return original.calculateHydrationServer(...args);
  } };
});

class Boundary extends Component<{ children: ReactNode; reset: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <ErrorPage reset={this.props.reset} /> : this.props.children; }
}
afterEach(() => { cleanup(); dispatchAction = () => {}; vi.restoreAllMocks(); });

it.each(['fermentation', 'hydration'])('dispatches uncached %s server actions after render, not during results render', async feature => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  client.setQueryData(['bakingTips'], []);
  function Router() {
    const [dispatches, setDispatches] = useState(0);
    dispatchAction = () => setDispatches(count => count + 1);
    return <QueryClientProvider client={client}><output>{dispatches}</output>{feature === 'fermentation' ? <FermentationCalculator /> : <HydrationCalculator />}</QueryClientProvider>;
  }
  render(<Router />);
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe('1'));
  expect(errors.mock.calls).toEqual([]);
  client.clear();
});

it.each(['fermentation', 'hydration'])('retries the same failed %s key after route reset remounts the default input', async feature => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: Infinity } } });
  let healthy = false, calls = 0, route = 0;
  const queryFn = async () => { calls++; if (!healthy) throw new Error('offline'); return 'recovered'; };
  await client.prefetchQuery({ queryKey: [feature, 24], queryFn });
  client.setQueryData([feature, 23], 'default');
  function Result({ input }: { input: number }) {
    const { data } = useQuery({ queryKey: [feature, input], queryFn, throwOnError: true });
    return <p>{data}</p>;
  }
  let input = 24;
  const view = () => <QueryClientProvider client={client}><Boundary key={route} reset={() => { route++; input = 23; rendered.rerender(view()); }}><Suspense fallback="loading"><Result input={input} /></Suspense></Boundary></QueryClientProvider>;
  const rendered = render(view());
  await screen.findByRole('button', { name: 'Spróbuj ponownie' });
  healthy = true;
  fireEvent.click(screen.getByRole('button', { name: 'Spróbuj ponownie' }));
  await screen.findByText('default');
  expect(client.getQueryData([feature, 23])).toBe('default');
  input = 24;
  rendered.rerender(view());
  await waitFor(() => expect(screen.getByText('recovered')).toBeTruthy());
  expect(calls).toBe(2);
  client.clear();
});
