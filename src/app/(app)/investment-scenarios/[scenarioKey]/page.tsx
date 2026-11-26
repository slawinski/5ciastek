import ScenarioWorkspace from '@/features/investment-scenarios/components/ScenarioWorkspace';
import { loadWorkspaceAction } from '@/features/investment-scenarios/scenario.actions';
export const dynamic = 'force-dynamic';
export default async function InvestmentScenarioPage({ params }: { params: Promise<{ scenarioKey: string }> }) {
  const { scenarioKey } = await params;
  return <ScenarioWorkspace key={scenarioKey} scenarioKey={scenarioKey} initial={await loadWorkspaceAction(scenarioKey)} />;
}
