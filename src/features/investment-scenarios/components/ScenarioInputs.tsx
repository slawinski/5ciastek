'use client';
import { InputField } from '@/components/InputField';
import Button from '@/components/Button';
import { useState } from 'react';
import { scenarioFixture } from '../reference';
import styles from './ScenarioWorkspace.module.css';

export type FormValue = string | number | boolean | null | FormValue[] | { [key: string]: FormValue };
export type PublicationOption = { id: number; name: string; versionKey: string };
const labels: Record<string, string> = {
  name: 'Nazwa', period: 'Okres (wspólny identyfikator)', interval: 'Badany przedział', start: 'Początek z offsetem', end: 'Koniec z offsetem', zone: 'Strefa czasowa',
  products: 'Produkty i publikacje', operations: 'Kolejność i pomiary procesu', resources: 'Ludzie i urządzenia', lots: 'Partie i stany', movements: 'Ruchy, sprzedaż i straty', finance: 'Założenia finansowe',
  id: 'Identyfikator', publicationId: 'Opublikowana wersja receptury', target: 'Produkcja (szt.)', price: 'Cena sprzedaży', unitCost: 'Pełny koszt zmienny / wyprodukowaną sztukę', lossPercent: 'Strata (%)', readyOperationId: 'Operacja gotowości',
  status: 'Podstawa', value: 'Wartość', unit: 'Jednostka', source: 'Źródło', date: 'Data źródła', version: 'Wersja źródła', context: 'Kontekst zastosowania', reason: 'Powód / brak', observationRef: 'Identyfikator oryginalnego pomiaru',
  productId: 'Produkt', step: 'Indeks etapu publikacji (od 0)', kind: 'Rodzaj', requestedStart: 'Żądany początek z offsetem', readyBy: 'Termin gotowości z offsetem', priority: 'Priorytet kolejności', duration: 'Czas (min)',
  predecessors: 'Poprzedniki — identyfikatory operacji', phase: 'Nadrzędny etap pasywny', offsetMinutes: 'Przesunięcie (min)', demands: 'Równoczesne zapotrzebowanie zasobów', resourceId: 'Zasób', amount: 'Wymagana ilość / obsada', waitWindow: 'Maksymalne oczekiwanie (min)',
  observationContext: 'Oryginalny kontekst pomiaru', batch: 'Skala partii', staff: 'Obsada (osoby)', machine: 'Urządzenie', conditions: 'Warunki', capacity: 'Pojemność / liczba osób', availability: 'Przedziały dostępności', daysPerWeek: 'Dostępność — dni w tygodniu', hoursPerDay: 'Dostępność — godzin dziennie', cost: 'Koszt roli / urządzenia',
  itemId: 'Produkt / historyczny identyfikator składnika', location: 'Lokalizacja', quantity: 'Ilość', evidence: 'Pochodzenie ilości', availableAt: 'Dostępne od (z offsetem)', expiresAt: 'Przydatne do (z offsetem)', admitted: 'Dopuszczenie', admissionSource: 'Podstawa dopuszczenia', sourceParts: 'Pochodzenie części', preparationContext: 'Kontekst przygotowania / otwarcia',
  lotId: 'Partia źródłowa', targetLotId: 'Partia docelowa (transfer)', at: 'Chwila ruchu z offsetem', costs: 'Pozycje kosztowe', expenseId: 'Tożsamość wydatku (bez podwójnego kosztu)', category: 'Kategoria kosztu', basis: 'Podstawa wyniku', method: 'Metoda kosztu', ingredientId: 'Historyczny składnik', rate: 'Stawka', taxBasis: 'Podstawa brutto / netto', allocations: 'Alokacja jednej puli', share: 'Udział (suma 1)', requiredSales: 'Warunkowo wymagana sprzedaż', budget: 'Budżet okresu z celem właściciela', mix: 'Miks sprzedanych sztuk', soldPieces: 'Sztuki w pakiecie miksu', cashReceipts: 'Wpływy pieniężne', cashPayments: 'Wydatki pieniężne', ownerCharges: 'Obciążenia właściciela', ownerValue: 'Ekonomiczna wartość pracy właściciela', bottleneckMinutes: 'Minuty wskazanego wąskiego gardła',
  conversion: 'Jawna konwersja jednostek', from: 'Podstawa źródłowa', to: 'Ilość docelowa dla podstawy',
};
const enums: Record<string, [string, string][]> = {
  taxBasis: [['gross', 'Brutto'], ['net', 'Netto']],
  unit: [['piece', 'szt.'], ['g', 'g'], ['kg', 'kg'], ['person', 'osoby'], ['min', 'min'], ['PLN', 'PLN'], ['PLN/piece', 'PLN/szt.'], ['%', '%']],
  basis: [['product', 'Koszt wyrobu'], ['variable', 'Pozostały zmienny'], ['fixed', 'Stały'], ['disclosure', 'Ujawnienie bez potrącenia']],
  method: [['full-unit', 'Pełny koszt jednostkowy'], ['component', 'Składnik kosztu'], ['pool', 'Jedna wspólna pula']],
  category: [['ingredient', 'Surowiec'], ['packaging', 'Opakowanie'], ['batch', 'Partia'], ['energy', 'Energia'], ['equipment', 'Urządzenie'], ['labor', 'Praca'], ['rent', 'Najem'], ['fixed', 'Pozostałe stałe'], ['owner-value', 'Wartość pracy właściciela']],
};
const templates = JSON.parse(JSON.stringify(scenarioFixture())) as { [key: string]: FormValue };
const templateFor = (key: string): FormValue => {
  if (key === 'predecessors' || key === 'sourceParts') return '';
  if (key === 'mix') return { productId: 'A', soldPieces: 1, price: templates.products instanceof Array ? (templates.products[0] as { [key: string]: FormValue }).price : null, unitCost: (templates.products as { [key: string]: FormValue }[])[0].unitCost, lossPercent: (templates.products as { [key: string]: FormValue }[])[0].lossPercent };
  if (key === 'allocations') return { productId: 'A', share: '1' };
  const search = (value: FormValue): FormValue | undefined => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (Array.isArray(value[key]) && value[key].length) return value[key][0];
      for (const child of Object.values(value)) { const found = search(child); if (found !== undefined) return found; }
    }
    if (Array.isArray(value)) for (const child of value) { const found = search(child); if (found !== undefined) return found; }
    return undefined;
  };
  return structuredClone(search(templates) ?? '');
};
function ValueEditor({ value, onChange, path, label, publications, revealPath }: { value: FormValue; onChange: (value: FormValue) => void; path: string; label: string; publications: PublicationOption[]; revealPath: string }) {
  const [expanded, setExpanded] = useState(path.split('.').length < 2);
  const open = expanded || revealPath.startsWith(`${path}.`);
  const key = path.split('.').at(-1)!;
  const kindOptions: [string, string][] = path.includes('.operations.') ? [['active', 'Aktywny'], ['passive', 'Pasywny'], ['auxiliary', 'Pomocniczy']] : path.includes('.resources.') ? [['role', 'Rola'], ['equipment', 'Urządzenie']] : path.includes('.lots.') ? [['material', 'Surowiec'], ['wip', 'Produkcja w toku'], ['finished', 'Gotowy wyrób']] : [['delivery', 'Dostawa'], ['consume', 'Zużycie'], ['loss', 'Strata'], ['sale', 'Sprzedaż'], ['carry', 'Przeniesienie'], ['waste', 'Odpad'], ['return', 'Zwrot fizyczny'], ['refund', 'Refund bez ruchu'], ['transfer', 'Transfer']];
  if (Array.isArray(value)) return <fieldset id={`input-${path}`}><legend>{label}</legend>{value.map((row, index) => <div className={styles.row} key={index}>
    <ValueEditor value={row} onChange={next => onChange(value.map((item, i) => i === index ? next : item))} path={`${path}.${index}`} label={`${label} ${index + 1}`} publications={publications} revealPath={revealPath} />
    <Button type="button" onClick={() => onChange(value.filter((_, i) => i !== index))}>Usuń {label.toLocaleLowerCase('pl')} {index + 1}</Button>
  </div>)}<Button type="button" onClick={() => { const next = templateFor(key); if (next && typeof next === 'object' && !Array.isArray(next) && 'id' in next) next.id = crypto.randomUUID(); onChange([...value, next]); }}>Dodaj: {label.toLocaleLowerCase('pl')}</Button></fieldset>;
  if (value !== null && typeof value === 'object') {
    if ('status' in value) return <fieldset id={`input-${path}`}><legend>{label}</legend><label htmlFor={`input-${path}-status`}>Podstawa</label><select id={`input-${path}-status`} value={String(value.status)} onChange={event => {
      const status = event.target.value;
      onChange(status === 'missing' ? { status, unit: value.unit, reason: 'Brak danych' } : { unit: value.unit, value: '0', source: '', date: '2026-11-25', version: '1', period: 'day', context: '', ...(value.status === 'missing' ? {} : value), status });
    }}><option value="missing">Brak danych</option><option value="estimated">Estymacja</option><option value="measured">Pomiar</option></select>
      <div className={styles.fields}>{Object.entries(value).filter(([field]) => field !== 'status').map(([field, item]) => <ValueEditor key={field} value={item} onChange={next => onChange({ ...value, [field]: next })} path={`${path}.${field}`} label={labels[field] ?? field} publications={publications} revealPath={revealPath} />)}</div>
      {value.status !== 'missing' && !('observationRef' in value) && <Button type="button" onClick={() => onChange({ ...value, observationRef: '' })}>Wskaż oryginalny pomiar</Button>}
    </fieldset>;
    return <details id={`input-${path}`} open={open} onToggle={event => setExpanded(event.currentTarget.open)} className={styles.group}><summary>{label}</summary>{open && <><div className={styles.fields}>{Object.entries(value).filter(([field]) => field !== 'schemaVersion' && (field !== 'targetLotId' || value.kind === 'transfer')).map(([field, item]) => <ValueEditor key={field} value={item} onChange={next => {
      const updated = { ...value, [field]: next };
      if (field === 'kind' && 'lotId' in value) delete updated.targetLotId;
      onChange(updated);
    }} path={`${path}.${field}`} label={labels[field] ?? field} publications={publications} revealPath={revealPath} />)}</div>
      {'predecessors' in value && !('phase' in value) && <Button type="button" onClick={() => onChange({ ...value, phase: { id: '', offsetMinutes: '0' } })}>Dodaj zależność od początku etapu pasywnego</Button>}
      {'predecessors' in value && !('observationContext' in value) && <Button type="button" onClick={() => onChange({ ...value, observationContext: structuredClone(value.context) })}>Dodaj oryginalny kontekst pomiaru</Button>}
      {'lotId' in value && value.kind === 'transfer' && !('targetLotId' in value) && <Button type="button" onClick={() => onChange({ ...value, targetLotId: '' })}>Dodaj docelową partię transferu</Button>}
      {('resourceId' in value || 'lotId' in value) && !('conversion' in value) && <Button type="button" onClick={() => onChange({ ...value, conversion: { from: { value: '1', unit: 'piece' }, to: { value: '500', unit: 'g' }, evidence: { status: 'estimated', value: '500', unit: 'g/piece', source: '', date: '2026-11-25', version: '1', period: 'day', context: '' } } })}>Dodaj źródłową konwersję masy i sztuk</Button>}
      {key === 'quantity' && path.includes('.lots.') && <Button type="button" onClick={() => onChange(null)}>Oznacz nieznany stan początkowy</Button>}
      {['phase', 'observationContext', 'targetLotId', 'conversion'].filter(field => field in value && (field !== 'targetLotId' || value.kind === 'transfer')).map(field => <Button key={field} type="button" onClick={() => onChange(Object.fromEntries(Object.entries(value).filter(([key]) => key !== field)))}>Usuń: {labels[field]}</Button>)}
    </>}</details>;
  }
  if (key === 'quantity' && value === null) return <section><p>{label}: brak danych</p><Button type="button" onClick={() => onChange({ value: '0', unit: 'g' })}>Wprowadź znany stan początkowy</Button></section>;
  if (key === 'publicationId') return <label className={styles.selectLabel} htmlFor={`input-${path}`}>{label}<select id={`input-${path}`} value={String(value)} onChange={event => onChange(Number(event.target.value))}>{publications.map(publication => <option key={publication.id} value={publication.id}>{publication.name} · {publication.versionKey}</option>)}</select></label>;
  const options = key === 'kind' ? kindOptions : enums[key];
  if (options) return <label className={styles.selectLabel} htmlFor={`input-${path}`}>{label}<select id={`input-${path}`} value={String(value)} onChange={event => onChange(event.target.value)}>{!options.some(([option]) => option === value) && <option value={String(value)}>{String(value)}</option>}{options.map(([option, name]) => <option key={option} value={option}>{name}</option>)}</select></label>;
  if (typeof value === 'boolean' || key === 'admitted') return <label className={styles.selectLabel} htmlFor={`input-${path}`}>{label}<select id={`input-${path}`} value={value === null ? 'missing' : String(value)} onChange={event => onChange(event.target.value === 'missing' ? null : event.target.value === 'true')}><option value="missing">Brak danych</option><option value="true">Tak</option><option value="false">Nie</option></select></label>;
  return <InputField id={`input-${path}`} name={path} label={label} value={value === null ? '' : value} type={typeof value === 'number' ? 'number' : 'text'} onChange={event => onChange(typeof value === 'number' ? Number(event.target.value) : event.target.value || (value === null ? null : ''))} />;
}
export function ScenarioInputs({ value, onChange, publications, revealPath = '' }: { value: FormValue; onChange: (value: FormValue) => void; publications: PublicationOption[]; revealPath?: string }) {
  return <ValueEditor value={value} onChange={onChange} publications={publications} revealPath={revealPath} path="input" label="Parametry wariantu" />;
}
