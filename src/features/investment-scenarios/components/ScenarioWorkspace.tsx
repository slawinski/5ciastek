'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMachine } from '@xstate/react';
import Link from 'next/link';
import { PageLayout } from '@/components/PageLayout';
import Button from '@/components/Button';
import { scenarioMachine } from '../scenarioMachine';
import { loadWorkspaceAction, saveScenarioAction, runScenarioAction } from '../scenario.actions';
import { scenarioFixture } from '../reference';
import { scenarioSchema, type SavedInput } from '../schema';
import { ScenarioInputs, type FormValue, type PublicationOption } from './ScenarioInputs';
import { ScenarioReport } from './ScenarioReport';
import type { ScenarioReport as Report } from '../evaluate';
import styles from './ScenarioWorkspace.module.css';
import { validationMessage } from '../validation';

type WorkspaceData = Extract<Awaited<ReturnType<typeof loadWorkspaceAction>>, { ok: true }>;
const messages: Record<string, string> = { loading: 'Pobieranie danych…', empty: 'Brak zapisanej wersji.', draft: 'Nowy wariant — niezapisany.', changed: 'Niezapisane zmiany. Raport nadal dotyczy poprzedniej wersji.', saving: 'Zapisywanie — oczekiwanie na potwierdzenie…', saved: 'Wersja zapisana. Możesz uruchomić ocenę.', running: 'Obliczanie i zapisywanie przebiegu…', result: 'Przebieg zapisany.', loggingOut: 'Wylogowywanie — oczekiwanie na potwierdzenie…', denied: 'Brak dostępu.', error: 'Nie potwierdzono odczytu danych.' };
export default function ScenarioWorkspace({ scenarioKey, initial }: { scenarioKey: string | null; initial?: Awaited<ReturnType<typeof loadWorkspaceAction>> }) {
  const [state, send] = useMachine(scenarioMachine);
  const [draft, setDraft] = useState<FormValue>(null);
  const [revision, setRevision] = useState<WorkspaceData['revision']>(null);
  const [run, setRun] = useState<{ id: number; report: Report; revisionNumber: number; input: SavedInput } | null>(null);
  const [publications, setPublications] = useState<PublicationOption[]>([]);
  const [scenarios, setScenarios] = useState<WorkspaceData['scenarios']>([]);
  const [revisions, setRevisions] = useState<WorkspaceData['revisions']>([]);
  const [error, setError] = useState('');
  const [revealPath, setRevealPath] = useState('');
  const [fields, setFields] = useState<{ path: string; message: string }[]>([]);
  const key = useRef(scenarioKey ?? crypto.randomUUID());
  const generation = useRef(0); const saveKey = useRef<string | null>(null); const runKey = useRef<string | null>(null);
  const initialData = useRef(initial);
  const logoutPending = useRef(false);
  const current = String(state.value); const busy = ['loading', 'saving', 'running'].includes(current);
  const clear = useCallback(() => { generation.current++; setDraft(null); setRevision(null); setRun(null); setPublications([]); setScenarios([]); setRevisions([]); saveKey.current = null; runKey.current = null; }, []);
  const fail = useCallback((result: { category: string; message: string; fields: { path: string; message: string }[] }) => {
    setError(result.message); setFields(result.fields);
    if (result.category === 'denied') { clear(); send({ type: 'DENIED' }); } else send({ type: 'FAILED' });
  }, [clear, send]);
  const load = useCallback(async (revisionId: number | null = null) => {
    if (logoutPending.current) return;
    const request = ++generation.current; send({ type: 'LOAD' }); setError('');
    try {
      const preloaded = initialData.current; initialData.current = undefined;
      const data = preloaded ?? await loadWorkspaceAction(revisionId === null ? scenarioKey : key.current, revisionId);
      if (generation.current !== request) return;
      if (!data.ok) { fail(data); return; }
      setPublications(data.publications); setScenarios(data.scenarios); setRevisions(data.revisions ?? []); setRevision(data.revision); setRun(data.run);
      saveKey.current = null; runKey.current = null;
      setDraft(data.revision ? JSON.parse(JSON.stringify(data.revision.saved.input)) : null);
      send({ type: data.revision ? 'LOADED' : 'EMPTY' });
    } catch { if (request === generation.current) fail({ category: 'source', message: 'Błąd połączenia. Nie potwierdzono odczytu.', fields: [] }); }
  }, [scenarioKey, send, fail]);
  useEffect(() => { void load(); return () => { generation.current++; }; }, [load]);
  function edit(value: FormValue) { setDraft(value); setFields([]); setError(''); saveKey.current = null; send({ type: 'EDIT' }); }
  async function save() {
    const parsed = scenarioSchema.safeParse(draft);
    if (!parsed.success) { setError('Popraw wskazane dane. Nie zapisano nowej wersji.'); setFields(parsed.error.issues.map(issue => ({ path: `input.${issue.path.join('.')}`, message: validationMessage(issue) }))); return; }
    saveKey.current ??= crypto.randomUUID(); const request = ++generation.current; send({ type: 'SAVE' }); setError('');
    try {
      const result = await saveScenarioAction({ scenarioKey: key.current, requestKey: saveKey.current, expectedRevision: revision?.number ?? 0, input: parsed.data });
      if (request !== generation.current) return;
      if (!result.ok) { fail(result); return; }
      setRevision(result.revision);
      setRevisions(previous => [{ id: result.revision.id, number: result.revision.number }, ...previous.filter(revision => revision.id !== result.revision.id)]);
      setScenarios(previous => [{ key: key.current, name: result.revision.saved.input.name }, ...previous.filter(scenario => scenario.key !== key.current)]);
      runKey.current = null; saveKey.current = null; send({ type: 'SAVED' });
    } catch { if (request === generation.current) fail({ category: 'persistence', message: 'Nie otrzymano potwierdzenia. Ponów zapis z tym samym kluczem.', fields: [] }); }
  }
  async function evaluate() {
    if (!revision) return;
    runKey.current ??= crypto.randomUUID(); const request = ++generation.current; send({ type: 'RUN' }); setError('');
    try {
      const result = await runScenarioAction({ revisionId: revision.id, requestKey: runKey.current });
      if (request !== generation.current) return;
      if (!result.ok) { fail(result); return; }
      setRun({ ...result.run, revisionNumber: revision.number }); send({ type: 'RESULT' });
    } catch { if (request === generation.current) fail({ category: 'persistence', message: 'Nie potwierdzono przebiegu. Ponów operację.', fields: [] }); }
  }
  function focusField(path: string) {
    setRevealPath(path);
    requestAnimationFrame(() => {
    const element = document.getElementById(`input-${path}`);
    if (!element) return;
    let ancestor: HTMLElement | null = element;
    while (ancestor) { if (ancestor instanceof HTMLDetailsElement) ancestor.open = true; ancestor = ancestor.parentElement; }
    element.scrollIntoView({ block: 'center' }); element.focus();
    });
  }
  async function logout() {
    if (logoutPending.current) return;
    logoutPending.current = true;
    clear(); send({ type: 'LOGOUT' }); setError('');
    try {
      const response = await fetch('/api/users/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Unconfirmed logout');
      clear(); send({ type: 'LOGGED_OUT' });
    } catch {
      clear(); setError('Dane usunięto z widoku, ale serwer nie potwierdził wylogowania. Sprawdź połączenie i ponów wylogowanie w panelu konta.'); send({ type: 'LOGOUT_FAILED' });
    } finally { logoutPending.current = false; }
  }
  return <PageLayout title="Scenariusze inwestycyjne"><div className={styles.workspace}>
    <p>Hipotetyczny wariant przed najmem i zakupem wyposażenia. Wynik dnia nie potwierdza popytu, miesięcznego dochodu ani zwrotu.</p>
    <p role="status" aria-live="polite">{messages[current]}</p>
    {error && <section role="alert"><p>{error}</p><ul>{fields.map((field, index) => <li key={index}><a href={`#input-${field.path}`} onClick={event => { event.preventDefault(); focusField(field.path); }}>{field.path}: {field.message}</a></li>)}</ul></section>}
    {['denied', 'error'].includes(current) && <><p><Link href="/recipes">Zaloguj się w katalogu receptur</Link>, następnie <Link href="/investment-scenarios">wróć do scenariuszy</Link>.</p><Button onClick={() => void load()}>Ponów odczyt</Button></>}
    {!['denied', 'loading', 'loggingOut', 'error'].includes(current) && <>
      <nav aria-label="Zapisane warianty"><h3>Zapisane warianty</h3>{!scenarios.length && <p>Nie zapisano jeszcze żadnego wariantu.</p>}<ul>{scenarios.map(scenario => <li key={scenario.key}><Link href={`/investment-scenarios/${encodeURIComponent(scenario.key)}`}>{scenario.name}</Link></li>)}</ul></nav>
      {!draft && <section><h3>Nowy wariant</h3><p>Szablon A20/B12 zawiera wyraźnie oznaczone założenia syntetyczne. Zastąp je własnymi źródłami i wybierz właściwe publikacje.</p><Button disabled={publications.length === 0} onClick={() => edit(scenarioFixture(publications[0].id, (publications[1] ?? publications[0]).id) as FormValue)}>Utwórz wariant odniesienia</Button>{!publications.length && <p>Brak dostępnych publikacji. Najpierw opublikuj recepturę w panelu redakcyjnym.</p>}</section>}
      {draft && <><div className={styles.commands}><Button disabled={busy || !['draft', 'changed'].includes(current)} onClick={() => void save()}>Zapisz nową wersję</Button><Button disabled={busy || !['saved', 'result'].includes(current)} onClick={() => void evaluate()}>Uruchom zapisaną wersję {revision?.number}</Button></div>
        {revisions.length > 0 && <label htmlFor="scenario-revision">Otwórz zapisaną wersję (zastępuje niezapisany formularz)<select id="scenario-revision" disabled={busy} value={revision?.id ?? ''} onChange={event => void load(Number(event.target.value))}>{revisions.map(revision => <option key={revision.id} value={revision.id}>Wersja {revision.number}</option>)}</select></label>}
        {revision && <p>Potwierdzona wersja {revision.number} · <Link href={`/investment-scenarios/${encodeURIComponent(key.current)}`}>Otwórz zapisany wariant</Link> · podpis <code className={styles.fingerprint}>{revision.fingerprint}</code></p>}
        <form id="scenario-inputs" onSubmit={event => { event.preventDefault(); void save(); }}><fieldset disabled={busy}><legend>Źródłowe parametry</legend><ScenarioInputs value={draft} onChange={edit} publications={publications} revealPath={revealPath} /></fieldset></form>
      </>}
      {run && <ScenarioReport report={run.report} input={run.input} runId={run.id} revisionNumber={run.revisionNumber} unsaved={['changed', 'draft', 'saving'].includes(current)} changed={['changed', 'draft', 'saving'].includes(current) || revision?.number !== run.revisionNumber} />}
      <Button onClick={() => void logout()}>Wyloguj i usuń dane z widoku</Button>
    </>}
  </div></PageLayout>;
}
