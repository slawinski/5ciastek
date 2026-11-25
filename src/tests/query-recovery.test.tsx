// @vitest-environment jsdom
import { Component, Suspense, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useSuspenseQuery } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import ErrorPage from '@/app/(app)/error';

class Boundary extends Component<{ children: ReactNode; reset: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <ErrorPage reset={this.props.reset} /> : this.props.children; }
}
afterEach(cleanup);

it.each(['fermentation', 'hydration'])('retries the same failed %s suspense key after route reset remounts the default input', async feature => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity, staleTime: Infinity } } });
  let healthy = false, calls = 0, route = 0;
  const queryFn = async () => { calls++; if (!healthy) throw new Error('offline'); return 'recovered'; };
  await client.prefetchQuery({ queryKey: [feature, 24], queryFn });
  client.setQueryData([feature, 23], 'default');
  function Result({ input }: { input: number }) {
    const { data } = useSuspenseQuery({ queryKey: [feature, input], queryFn });
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
