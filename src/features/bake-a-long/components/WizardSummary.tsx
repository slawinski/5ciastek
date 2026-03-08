import React from 'react';
import { useBakeAlong } from '../context';
import styles from './BakeAlongWizard.module.css';

export const WizardSummary: React.FC = () => {
  const { state } = useBakeAlong();
  const { context } = state;

  const formatDateTime = (date: Date | null) => {
    if (!date) return "---";
    return date.toLocaleString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.summarySidebar}>
      <h3 className={styles.summaryTitle}>Batch Summary</h3>
      
      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Ready By</div>
        <div className={styles.summaryValue}>{formatDateTime(context.readyTime)}</div>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Hydration</div>
        <div className={styles.summaryValue}>{context.hydration ? `${context.hydration}%` : "---"}</div>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Dough Temp</div>
        <div className={styles.summaryValue}>{context.doughTemp ? `${context.doughTemp}°C` : "---"}</div>
      </div>

      <div className={styles.summarySection}>
        <div className={styles.summaryLabel}>Starter Ratio</div>
        <div className={styles.summaryValue}>{context.levainRatio || "---"}</div>
      </div>

      <div className={styles.summaryStatus}>
        <div className={styles.statusDot} style={{ 
          backgroundColor: context.readyTime && context.hydration && context.doughTemp ? 'var(--color-green)' : '#ddd' 
        }} />
        <span>{state.value.toString().toUpperCase()}</span>
      </div>
    </div>
  );
};
