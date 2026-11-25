'use client';
import Button from '@/components/Button';
import { useQueryClient } from '@tanstack/react-query';
export default function ErrorPage({ reset }: { reset: () => void }) {
  const client = useQueryClient();
  const retry = async () => {
    await client.resetQueries({ predicate: query => query.state.status === 'error' });
    reset();
  };
  return <section role="alert"><h2>Nie udało się pobrać danych</h2><p>Wynik nie został potwierdzony.</p><Button onClick={retry}>Spróbuj ponownie</Button></section>;
}
