'use client';
import { ScenarioInputs, type FormValue, type PublicationOption } from './ScenarioInputs';

export function ScenarioInvestmentInputs({ value, onChange, publications, revealPath }: { value: FormValue; onChange: (value: FormValue) => void; publications: PublicationOption[]; revealPath: string }) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.schemaVersion !== 2) return null;
  return <section aria-labelledby="investment-heading"><h3 id="investment-heading">Nakład i prosty zwrot</h3>
    <p>Wpisz cztery kwoty w PLN ze źródłami i wspólnym okresem nakładu. Nieznana kaucja lub zapas nie są zerem. Zapas początkowy i kaucja nie stają się automatycznie kosztami miesiąca; późniejsze uzupełnienie rozlicz oddzielnie w uzgodnieniu gotówki.</p>
    <p>Prosty zwrot wymaga zakwalifikowanej powtarzalności i miesięcznej nadwyżki po rezerwie dochodu właściciela.</p>
    <ScenarioInputs value={value.investment} onChange={investment => onChange({ ...value, investment })} path="input.investment" label="Nakład początkowy" publications={publications} revealPath={revealPath} />
  </section>;
}
