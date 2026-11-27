'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import { loadComparisonAction, listComparisonOptionsAction, prepareComparisonAction, saveComparisonAction } from '../comparison.actions';
import { projectComparison, type PinnedRun } from '../comparison';
import { ScenarioReport } from './ScenarioReport';
import styles from './ScenarioWorkspace.module.css';

type Options = Extract<Awaited<ReturnType<typeof listComparisonOptionsAction>>, { ok: true }>;
type Initial = Awaited<ReturnType<typeof loadComparisonAction>>;
const emptyOptions: Options = { ok: true, revisions: [], comparisons: [] };
const changes = { added: 'Dodano', removed: 'Usunięto', changed: 'Zmieniono', provenance: 'Zmiana wyłącznie źródła lub kontekstu' };
const pathLabels: Record<string, string> = { products: 'Produkty', price: 'Cena', unitCost: 'Koszt jednostkowy', lossPercent: 'Straty', resources: 'Zasoby', capacity: 'Pojemność / obsada', availability: 'Dostępność', hoursPerDay: 'Godziny dziennie', daysPerWeek: 'Dni w tygodniu', operations: 'Operacje', duration: 'Czas', batches: 'Partie', target: 'Ilość', finance: 'Finanse', costs: 'Koszty', rate: 'Stawka', month: 'Miesiąc', investment: 'Nakład', publications: 'Publikacje', lots: 'Zapasy', movements: 'Ruchy', name: 'Nazwa', period: 'Okres', input: 'Wejścia' };

/** Selection mode lives inside the protected workspace; pinned mode owns its logout. */
export function ScenarioComparison({ comparisonKey, revisionId, initial, onDenied }: { comparisonKey?: string; revisionId?: number; initial?: Initial; onDenied?: () => void }) {
  const [options, setOptions] = useState(emptyOptions);
  const [selectedRevision, setSelectedRevision] = useState(revisionId ?? 0);
  const [runs, setRuns] = useState<PinnedRun[]>([]);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [status, setStatus] = useState('Pobieranie porównań…');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const [denied, setDenied] = useState(false);
  const generation = useRef(0); const logoutPending = useRef(false); const initialData = useRef(initial);
  const runCommand = useRef<{ revisionId: number; requestKey: string } | null>(null);
  const saveCommand = useRef<{ comparisonKey: string; requestKey: string; runIds: number[] } | null>(null);
  const clear = useCallback(() => { generation.current++; setRuns([]); setOptions(emptyOptions); setSavedKey(null); runCommand.current = null; saveCommand.current = null; }, []);
  const fail = useCallback((result: { category: string; message: string }) => {
    setError(result.message);
    if (result.category === 'denied') { clear(); setBusy(false); setDenied(true); setStatus('Brak dostępu.'); onDenied?.(); }
    else setStatus('Nie potwierdzono operacji.');
  }, [clear, onDenied]);
  const load = useCallback(async () => {
    if (logoutPending.current) return;
    const request = ++generation.current; setBusy(true); setError('');
    try {
      if (comparisonKey) {
        const preloaded = initialData.current; initialData.current = undefined;
        const result = preloaded ?? await loadComparisonAction(comparisonKey);
        if (request !== generation.current) return;
        if (!result.ok) { fail(result); return; }
        setRuns(result.comparison.runs); setSavedKey(result.comparison.comparisonKey); setStatus('Odczytano dokładnie zapisane przebiegi.');
      } else {
        const result = await listComparisonOptionsAction();
        if (request !== generation.current) return;
        if (!result.ok) { fail(result); return; }
        setOptions(result); setSelectedRevision(revisionId ?? result.revisions[0]?.id ?? 0); setStatus('Wybierz zapisane wersje i przelicz każdą przed dodaniem.');
      }
      setDenied(false);
    } catch { if (request === generation.current) fail({ category: 'source', message: 'Nie potwierdzono odczytu porównania.' }); }
    finally { if (request === generation.current) setBusy(false); }
  }, [comparisonKey, revisionId, fail]);
  useEffect(() => { void load(); return () => { generation.current++; }; }, [load]);
  async function select() {
    if (!selectedRevision || busy) return;
    if (runCommand.current?.revisionId !== selectedRevision) runCommand.current = { revisionId: selectedRevision, requestKey: crypto.randomUUID() };
    const request = ++generation.current; setBusy(true); setError(''); setStatus('Przeliczanie i oczekiwanie na potwierdzenie przebiegu…');
    try {
      const result = await prepareComparisonAction(runCommand.current);
      if (request !== generation.current) return;
      if (!result.ok) { fail(result); return; }
      setRuns(previous => [...previous.filter(run => run.scenarioKey !== result.run.scenarioKey), result.run]);
      saveCommand.current = null; setSavedKey(null); runCommand.current = null; setStatus('Przebieg potwierdzony i wybrany.');
    } catch { if (request === generation.current) fail({ category: 'persistence', message: 'Nie potwierdzono przebiegu. Ponów przeliczenie z tym samym kluczem.' }); }
    finally { if (request === generation.current) setBusy(false); }
  }
  async function save() {
    if (runs.length < 2 || busy) return;
    saveCommand.current ??= { comparisonKey: crypto.randomUUID(), requestKey: crypto.randomUUID(), runIds: runs.map(run => run.runId) };
    const request = ++generation.current; setBusy(true); setError(''); setStatus('Zapisywanie porównania — oczekiwanie na potwierdzenie…');
    try {
      const result = await saveComparisonAction(saveCommand.current);
      if (request !== generation.current) return;
      if (!result.ok) { fail(result); return; }
      setSavedKey(result.comparisonKey); setStatus('Porównanie zapisane.');
    } catch { if (request === generation.current) fail({ category: 'persistence', message: 'Nie potwierdzono zapisu porównania. Zachowano wybór i klucz ponowienia.' }); }
    finally { if (request === generation.current) setBusy(false); }
  }
  async function logout() {
    if (logoutPending.current) return;
    logoutPending.current = true; clear(); setDenied(true); setError(''); setStatus('Wylogowywanie…');
    try {
      const response = await fetch('/api/users/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Unconfirmed logout');
      clear(); setStatus('Brak dostępu.');
    } catch { clear(); setStatus('Brak dostępu.'); setError('Dane usunięto z widoku, ale serwer nie potwierdził wylogowania. Ponów w panelu konta.'); }
    finally { logoutPending.current = false; setBusy(false); }
  }
  return <section className={styles.workspace} aria-label="Porównania zapisanych wariantów">
    <h2>Porównanie wariantów MVP-2</h2>
    <p role={comparisonKey ? 'status' : undefined} aria-live="polite">{status}</p>
    {error && <p role="alert">{error}</p>}
    {denied ? <p><Link href="/recipes">Zaloguj się kontem właściciela</Link></p> : <>
      {!comparisonKey && <>
        <p>Każdy wybór tworzy potwierdzony przebieg wspólnego silnika. Braki danych nie wykluczają wariantu. Kolejność wyboru zostaje zapisana; pierwszy wariant jest podstawą różnic.</p>
        <label className={styles.selectLabel} htmlFor="comparison-revision">Zapisana wersja do porównania<select id="comparison-revision" disabled={busy} value={selectedRevision} onChange={event => { setSelectedRevision(Number(event.target.value)); runCommand.current = null; }}>{!options.revisions.length && <option value={0}>Brak zapisanych wersji MVP-2</option>}{options.revisions.map(row => <option key={row.id} value={row.id}>{row.name} · wersja {row.number} · {row.scenarioKey}</option>)}</select></label>
        <div className={styles.commands}><Button disabled={busy || !selectedRevision} onClick={() => void select()}>Przelicz i dodaj do porównania</Button><Button disabled={busy} onClick={() => void load()}>Odśwież zapisane wersje</Button></div>
        <ol>{runs.map(run => <li key={run.scenarioKey}>Wybrano: {run.scenarioKey} · wersja {run.revisionNumber} · przebieg {run.runId} <Button disabled={busy} onClick={() => { setRuns(previous => previous.filter(row => row.runId !== run.runId)); saveCommand.current = null; setSavedKey(null); }}>Usuń z porównania: {run.scenarioKey}</Button></li>)}</ol>
        <Button disabled={busy || runs.length < 2 || !!savedKey} onClick={() => void save()}>Zapisz niezmienne porównanie</Button>
        {runs.length < 2 && <p>Potrzebne są co najmniej dwa różne zapisane warianty.</p>}
        <nav aria-label="Zapisane porównania"><ul>{options.comparisons.map(row => <li key={row.key}><Link href={`/investment-scenarios/comparisons/${row.key}`}>Porównanie z {new Date(row.createdAt).toLocaleString('pl-PL')}</Link></li>)}</ul></nav>
      </>}
      {savedKey && <p><Link href={`/investment-scenarios/comparisons/${savedKey}`}>Otwórz zapisane porównanie</Link> · To niezmienny wybór, nie najnowsze wersje wariantów.</p>}
      {runs.length >= 2 && <ComparisonProjection runs={runs} />}
    </>}
    {comparisonKey && <><Button disabled={busy || logoutPending.current} onClick={() => void load()}>Ponów odczyt porównania</Button><Button onClick={() => void logout()}>Wyloguj i usuń dane z widoku</Button></>}
  </section>;
}
function ComparisonProjection({ runs }: { runs: PinnedRun[] }) {
  const projection = projectComparison(runs);
  return <>
    <h3>Wyniki i odrębne kwalifikacje</h3><p>Nie odejmujemy różnych okresów, jednostek ani podstaw. Brak danych nie oznacza zera. Różnica liczbowa, gdy uprawniona, oznacza drugi wariant minus pierwszy.</p>
    <div className={styles.comparisonGrid}>{projection.variants.map(run => <section className={styles.report} key={run.runId}><h4>{run.body.input.input.name}</h4><p>Wariant {run.scenarioKey} · wersja {run.revisionNumber} (ID {run.revisionId}) · przebieg {run.runId} · {run.engineVersion}</p><p className={styles.fingerprint}>Podpis wejść: {run.fingerprint}</p><ul>{run.labor.map(role => <li key={role.id}>{role.name}: wymagane (znany nakład) {role.requiredHours} h / dostępne {role.availableHours ?? 'brak danych'} h. Nakład i dostępność są odrębne.</li>)}</ul><ComparisonQualifications run={run} /></section>)}</div>
    <dl className={styles.totals}>{projection.metrics.map(row => <div key={row.id}><dt>{row.label}</dt><dd>{row.values.map((value, index) => <p key={index}>{runs[index].scenarioKey}: {value.value ?? 'brak danych'} {value.unit} · {value.period} · {value.basis} · {value.qualified ? 'wartość wyznaczona' : 'niezweryfikowane'}</p>)}{row.comparable ? row.delta !== null ? `Różnica: ${row.delta} ${row.values[0].unit}` : 'Wspólna podstawa; wartości pokazano osobno.' : 'Nieporównywalne liczbowo — różna podstawa lub brak kwalifikacji.'}</dd></div>)}</dl>
    <h3>Różnice wejść i źródeł</h3>{!projection.differences.length && <p>Brak różnic w zapisanych wejściach i źródłach.</p>}
    <ul className={styles.differences}>{projection.differences.map(row => <li key={row.path}><strong>{changes[row.kind]} · {row.path.split('.').map(part => pathLabels[part.replace(/\[.*\]/, '')] ?? part).join(' / ')}</strong><code className={styles.fingerprint}>{row.path}</code><dl>{row.values.map((value, index) => <div key={index}><dt>{runs[index].scenarioKey}</dt><dd className={styles.snapshot}>{evidenceText(value)}</dd></div>)}</dl></li>)}</ul>
    {runs.map(run => <details key={run.runId}><summary>Pełny zapisany raport: {run.scenarioKey} · przebieg {run.runId}</summary><ScenarioReport report={run.body.output} input={run.body.input} revisionNumber={run.revisionNumber} runId={run.runId} changed={false} unsaved={false} inputHref={`/investment-scenarios/${encodeURIComponent(run.scenarioKey)}`} /></details>)}
  </>;
}
function ComparisonQualifications({ run }: { run: PinnedRun }) {
  const report = run.body.output;
  const domains = { people: 'Ludzie', machines: 'Urządzenia', technology: 'Technologia', materials: 'Materiały', finance: 'Finanse' };
  const reasons = [...report.process.qualifications, ...report.stock.qualifications, ...report.economics.qualifications];
  return <>
    {Object.entries(domains).map(([domain, label]) => <section key={domain}><h5>{label}</h5>{reasons.some(row => row.domain === domain) ? <ul>{reasons.filter(row => row.domain === domain).map((row, index) => <li key={index}>{row.identity}: {row.reason}</li>)}</ul> : <p>Sprawdzono wyłącznie podane ograniczenia.</p>}</section>)}
    {report.monthly ? <ul>{(['repeatability', 'ownerNet', 'recurringCash'] as const).map(key => <li key={key}>{report.monthly![key].basis}: {report.monthly![key].status === 'qualified' ? 'zakwalifikowano' : 'niezweryfikowane'}. {report.monthly![key].reasons.join(' ')}</li>)}</ul> : <p>Brak kwalifikacji miesiąca.</p>}
    <p>Prosty zwrot: {report.investment?.payback.status === 'calculated' ? `${report.investment.payback.months} miesięcy` : report.investment?.payback.status === 'no-finite-payback' ? 'brak skończonego zwrotu' : 'niezweryfikowany'}. {report.investment?.payback.reasons.join(' ')}</p>
  </>;
}
function evidenceText(value: ReturnType<typeof projectComparison>['differences'][number]['values'][number]): string {
  if (value === null) return 'Brak pozycji / brak danych';
  if (value && typeof value === 'object' && !Array.isArray(value) && 'status' in value && 'unit' in value) {
    if (value.status === 'missing') return `Brak danych (${value.unit}) — ${value.reason}`;
    return `${value.value} ${value.unit} · ${value.status === 'measured' ? 'pomiar' : 'estymacja'} · źródło: ${value.source} · data: ${value.date} · wersja: ${value.version} · okres: ${value.period} · kontekst: ${value.context}${value.observationRef ? ` · obserwacja: ${value.observationRef}` : ''}`;
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}
