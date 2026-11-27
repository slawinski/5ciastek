import { PageLayout } from '@/components/PageLayout';
import { ScenarioComparison } from '@/features/investment-scenarios/components/ScenarioComparison';
import { loadComparisonAction } from '@/features/investment-scenarios/comparison.actions';
import styles from '@/features/investment-scenarios/components/ScenarioWorkspace.module.css';
export const dynamic = 'force-dynamic';
export default async function ComparisonPage({ params }: { params: Promise<{ comparisonKey: string }> }) {
  const { comparisonKey } = await params;
  return <PageLayout title="Zapisane porównanie"><div className={styles.workspace}><ScenarioComparison key={comparisonKey} comparisonKey={comparisonKey} initial={await loadComparisonAction(comparisonKey)} /></div></PageLayout>;
}
