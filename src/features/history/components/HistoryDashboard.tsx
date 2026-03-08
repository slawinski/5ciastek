import { BakeHistoryCard } from './BakeHistoryCard';
import styles from './History.module.css';
import { PageLayout } from '@/components/PageLayout';

const MOCK_HISTORY = [
  { id: 1, date: 'Mar 8, 2024', name: 'Standard Sourdough', score: 8, hydration: 75, temp: 23 },
  { id: 2, date: 'Mar 5, 2024', name: 'High Hydration Test', score: 9, hydration: 80, temp: 24 },
  { id: 3, date: 'Feb 28, 2024', name: 'Whole Wheat Loaf', score: 7, hydration: 78, temp: 22 },
  { id: 4, date: 'Feb 20, 2024', name: 'Rye & Caraway', score: 10, hydration: 75, temp: 23 },
  { id: 5, date: 'Feb 12, 2024', name: 'Rustic Boule', score: 6, hydration: 72, temp: 21 },
  { id: 6, date: 'Feb 5, 2024', name: 'Overnight Cold Proof', score: 9, hydration: 75, temp: 22 },
];

export const HistoryDashboard = () => {
  const stats = (
    <>
      <div className={styles.overviewBox}>
        <span className={styles.overviewLabel}>Total Bakes</span>
        <span className={styles.overviewValue}>42</span>
      </div>
      <div className={styles.overviewBox}>
        <span className={styles.overviewLabel}>Avg Score</span>
        <span className={styles.overviewValue}>8.2</span>
      </div>
    </>
  );

  return (
    <PageLayout title="Bake History" stats={stats}>
      <div className={styles.wipOverlay}>
        <div className={styles.wipBanner}>
          <span className={styles.wipText}>Work In Progress</span>
        </div>
        <div className={`${styles.historyGrid} ${styles.historyGridBlurred}`}>
          {MOCK_HISTORY.map(bake => (
            <BakeHistoryCard key={bake.id} {...bake} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
