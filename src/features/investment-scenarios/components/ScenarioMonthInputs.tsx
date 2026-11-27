'use client';
import Button from '@/components/Button';
import { missing } from '../reference';
import { ScenarioInputs, type FormValue, type PublicationOption } from './ScenarioInputs';

export function ScenarioMonthInputs({ value, onChange, publications, revealPath }: { value: FormValue; onChange: (value: FormValue) => void; publications: PublicationOption[]; revealPath: string }) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const month = value.month;
  return <section aria-labelledby="month-heading"><h3 id="month-heading">Miesiąc i odtworzenie zapasu</h3>
    <p>Wskaż każdą datę i wzorzec produkcji lub sprzedaży z badanego tygodnia. Stan otwarcia liczymy raz; odtworzenie wymaga ilości, pracy, zasobów i źródeł. Brak danych pozostawia zależne wnioski niezweryfikowane.</p>
    {month === null ? <Button type="button" onClick={() => onChange({ ...value, month: {
      period: String(value.interval && typeof value.interval === 'object' && !Array.isArray(value.interval) ? value.interval.start : '').slice(0, 7), taxBasis: 'gross', calendar: [], openingLots: [], preparations: [], fixedCosts: [], cashEntries: [], ownerCharges: missing('PLN'), ownerIncome: missing('PLN'), ownerEconomicValue: missing('PLN'),
    } })}>Dodaj ocenę miesiąca</Button> : <><ScenarioInputs value={month} onChange={next => onChange({ ...value, month: next })} path="input.month" label="Kalendarz i uzgodnienie miesiąca" publications={publications} revealPath={revealPath} /><Button type="button" onClick={() => onChange({ ...value, month: null })}>Usuń ocenę miesiąca z formularza</Button></>}
  </section>;
}
