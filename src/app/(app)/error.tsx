'use client';
import Button from '@/components/Button';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section role="alert"><h2>Nie udało się pobrać danych</h2><p>Wynik nie został potwierdzony.</p><Button onClick={reset}>Spróbuj ponownie</Button></section>;
}
