import ScenarioWorkspace from '@/features/investment-scenarios/components/ScenarioWorkspace';
import { loadWorkspaceAction } from '@/features/investment-scenarios/scenario.actions';
export const dynamic = 'force-dynamic';
export default async function InvestmentScenariosPage() { return <ScenarioWorkspace scenarioKey={null} initial={await loadWorkspaceAction(null)} />; }
