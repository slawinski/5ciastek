import { savedInputV2Schema, type SavedInputV2 } from './schema-v2';
import { economicInput } from './versioned';
import { evaluateWeek } from '../process-execution/week';
import { evaluateWeeklyStock } from '../stock-inventory/recipe-coverage';
import { evaluateEconomics } from '../economics-investment/evaluate';
import { decimal, divide, money } from '../economics-investment/money';
import { evaluateMonth } from '../economics-investment/month';
import { evaluateInvestment } from '../economics-investment/investment';

export const ENGINE_V2 = 'investment-scenario/2' as const;
export function evaluateScenarioV2(raw: SavedInputV2) {
  const saved = savedInputV2Schema.parse(raw); const { input } = saved;
  const process = evaluateWeek(input);
  const { recipeRequirements, ...stock } = evaluateWeeklyStock(saved, process);
  const economics = evaluateEconomics(economicInput(saved), stock, process);
  economics.contributionPerBatch = economics.contribution === null ? null : money(divide(decimal(economics.contribution), decimal(String(input.batches.length))));
  const monthly = evaluateMonth(saved, process, stock, economics);
  const investment = evaluateInvestment(input.investment, monthly);
  economics.qualifications = economics.qualifications.filter(row => row.identity !== 'payback');
  return { engineVersion: ENGINE_V2, process, stock, economics,
    recipeRequirements, monthly, investment,
  };
}
