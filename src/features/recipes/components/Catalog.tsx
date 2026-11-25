'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { PageLayout } from '@/components/PageLayout';
import { InputField } from '@/components/InputField';
import Button from '@/components/Button';
import { snapshotSchema } from '../schema';
import { scaleRecipe } from '../scaling';
import styles from './Catalog.module.css';

const publicationSchema = z.object({ id: z.number(), recipe: z.number(), version: z.number().int().positive(), snapshot: snapshotSchema });
const responseSchema = z.object({ docs: z.array(publicationSchema) });
type Publication = z.infer<typeof publicationSchema>;
type Unit = 'g' | 'kg' | '%';
const formatters = {
  g: new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 3 }),
  kg: new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 6 }),
};
const number = (value: string, unit: 'g' | 'kg' = 'g') => formatters[unit].format(Number(value) / (unit === 'kg' ? 1000 : 1));

export default function Catalog() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'login'>('loading');
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState<Unit>('g');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const generation = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);
  const beginRequest = useCallback(() => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const current = ++generation.current;
    return { signal: controller.signal, isCurrent: () => generation.current === current && !controller.signal.aborted };
  }, []);
  const load = useCallback(async () => {
    const request = beginRequest();
    setState('loading');
    try {
      const response = await fetch('/api/publications?limit=0&depth=0&sort=-createdAt', { cache: 'no-store', signal: request.signal });
      if (!request.isCurrent()) return;
      if (response.status === 401 || response.status === 403) { setState('login'); return; }
      if (!response.ok) throw new Error('Błąd pobrania');
      const body = await response.json();
      if (!request.isCurrent()) return;
      const { docs } = responseSchema.parse(body);
      setPublications(docs);
      setSelected(previous => request.isCurrent() && !docs.some(doc => doc.id === previous) ? null : previous);
      setState('ready');
    } catch { if (request.isCurrent()) setState('error'); }
  }, [beginRequest]);
  useEffect(() => {
    void load();
    return () => { generation.current++; activeRequest.current?.abort(); };
  }, [load]);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request = beginRequest();
    setLoggingIn(true); setLoginError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/users/login', { method: 'POST', signal: request.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.get('email'), password: form.get('password') }) });
      if (!request.isCurrent()) return;
      if (!response.ok) throw new Error();
      setLoggingIn(false);
      await load();
    } catch { if (request.isCurrent()) setLoginError('Logowanie nie powiodło się. Sprawdź dane i spróbuj ponownie.'); }
    finally { if (request.isCurrent()) setLoggingIn(false); }
  }
  const latest = new Map<number, Publication>();
  for (const publication of publications) if (!latest.has(publication.recipe) || latest.get(publication.recipe)!.version < publication.version) latest.set(publication.recipe, publication);
  const matching = [...latest.values()].filter(doc => doc.snapshot.name.toLocaleLowerCase('pl').includes(search.toLocaleLowerCase('pl')));
  const active = publications.find(doc => doc.id === selected);
  const result = active ? scaleRecipe(active.snapshot, target) : null;
  return <PageLayout title="Receptury">
    {state === 'loading' && <p role="status">Pobieranie opublikowanych receptur…</p>}
    {state === 'error' && <section role="alert"><h2>Nie udało się pobrać receptur</h2><p>Nie potwierdzono aktualnych danych.</p><Button onClick={() => void load()}>Spróbuj ponownie</Button></section>}
    {state === 'login' && <form className={styles.panel} onSubmit={login}>
      <h2>Zaloguj się do katalogu</h2><p>Katalog jest dostępny dla uprawnionych użytkowników.</p>
      <InputField id="recipe-email" name="email" type="email" label="E-mail" required autoComplete="username" />
      <InputField id="recipe-password" name="password" type="password" label="Hasło" required autoComplete="current-password" />
      {loginError && <p role="alert">{loginError}</p>}
      <Button type="submit" disabled={loggingIn}>{loggingIn ? 'Logowanie…' : 'Zaloguj się'}</Button>
    </form>}
    {state === 'ready' && <div className={styles.grid}>
      <section className={styles.panel} aria-label="Katalog publikacji">
        <InputField id="recipe-search" name="search" label="Szukaj po nazwie" value={search} onChange={event => setSearch(event.target.value)} type="search" />
        {matching.length === 0 && <p role="status">Brak pasujących opublikowanych receptur.</p>}
        <ul className={styles.list}>{matching.map(doc => <li key={doc.id}><Button onClick={() => setSelected(doc.id)} aria-pressed={active?.recipe === doc.recipe}>{doc.snapshot.name}{doc.snapshot.code ? ` · ${doc.snapshot.code}` : ''} · v{doc.version}</Button></li>)}</ul>
        <a href="/api/publications?limit=0&depth=0" download="receptury.json">Eksport dostępnych publikacji (JSON)</a>
        <p><a href="/admin">Panel redakcyjny</a></p>
      </section>
      {!active && <section className={styles.panel}><p>Wybierz recepturę, aby odczytać skład i proces.</p></section>}
      {active && result && <article className={styles.panel} aria-label="Szczegóły receptury">
        <h2>{active.snapshot.name} · v{active.version}</h2>
        <label htmlFor="recipe-version">Opublikowana wersja</label>
        <select id="recipe-version" value={active.id} onChange={event => setSelected(Number(event.target.value))}>{publications.filter(doc => doc.recipe === active.recipe).map(doc => <option key={doc.id} value={doc.id}>v{doc.version}</option>)}</select>
        <p>{active.snapshot.description}</p>
        <p>Baza: {active.snapshot.yield} szt. · {number(active.snapshot.totalGrams)} g ciasta</p>
        <fieldset><legend>Docelowy uzysk</legend><div className={styles.controls}>{[10, 15, 20, 30].map(count => <Button key={count} aria-pressed={target === count} onClick={() => setTarget(count)}>{count} szt.</Button>)}</div></fieldset>
        <fieldset><legend>Jednostka i widok</legend><div className={styles.controls}>{(['g', 'kg', '%'] as const).map(value => <Button key={value} aria-pressed={unit === value} onClick={() => setUnit(value)}>{value === '%' ? '% piekarskie' : value}</Button>)}</div></fieldset>
        <section aria-live="polite"><h3>{target} szt. · {number(result.totalGrams, 'kg')} kg ciasta</h3><p>Porcja ciasta: {number(result.portionGrams)} g · widok: {unit}</p></section>
        {result.missing.length > 0 && <section role="status"><h3>Niepełne dane kompozycji</h3><ul>{result.missing.map(item => <li key={item}>{item}</li>)}</ul><p>Procenty, mąka łącznie i hydracja nie są potwierdzone. Znane masy do odważenia pozostają widoczne.</p></section>}
        {unit === '%' && result.flourGrams && <section><h3>Mąka łącznie: {number(result.flourGrams, 'kg')} kg</h3><p>Hydracja: {result.hydration}%</p><ul>{result.flours.map(flour => <li key={flour.name}>{flour.name}: {flour.percent}% · {number(flour.grams, 'kg')} kg</li>)}</ul><p>Podział analityczny obejmuje mąkę w zakwasie. Nie jest dodatkową listą ważenia.</p></section>}
        <h3>Składniki do odważenia</h3><div className={styles.table}><table><thead><tr><th scope="col">Surowiec</th><th scope="col">Baza (g)</th>{unit === '%' && <th scope="col">%</th>}<th scope="col">Masa dla {target} szt.</th></tr></thead><tbody>{result.ingredients.map((row, index) => <tr key={`${row.ingredientId}-${index}`}><th scope="row">{row.name}</th><td>{number(row.mass)}</td>{unit === '%' && <td>{row.percent === null ? 'Brak danych' : `${row.percent}%`}</td>}<td>{number(row.grams, unit === 'g' ? 'g' : 'kg')} {unit === 'g' ? 'g' : 'kg'}</td></tr>)}</tbody></table></div>
        <h3>Proces</h3><ol>{active.snapshot.process.map((step, index) => <li key={index}>{step.instruction}</li>)}</ol>
        <p>Przeliczenie nie zapisuje receptury, planu ani partii.</p>
      </article>}
    </div>}
  </PageLayout>;
}
