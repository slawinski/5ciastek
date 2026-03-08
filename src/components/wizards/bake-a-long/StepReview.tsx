import { BakeAlongContext } from '@/machines/bakeAlongMachine';
import React from 'react';
import styles from './Wizard.module.css';

interface StepReviewProps {
  context: BakeAlongContext;
}

// Helper to format Date for display
const formatDateTime = (date: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const StepReview: React.FC<StepReviewProps> = ({ context }) => {
  return (
    <div>
      <h2 className={styles.stepTitle}>Final Review</h2>
      
      <div className={styles.reviewGrid}>
        <div className={styles.reviewCard}>
          <h3 className={styles.reviewCardTitle}>Schedule</h3>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Ready By</span>
            <span className={styles.reviewValue}>{formatDateTime(context.readyTime)}</span>
          </div>
        </div>

        <div className={styles.reviewCard}>
          <h3 className={styles.reviewCardTitle}>Dough</h3>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Temperature</span>
            <span className={styles.reviewValue}>{context.doughTemp} °C</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Hydration</span>
            <span className={styles.reviewValue}>{context.hydration} %</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Autolyse</span>
            <span className={styles.reviewValue}>{context.autolyseType}</span>
          </div>
        </div>

        <div className={styles.reviewCard}>
          <h3 className={styles.reviewCardTitle}>Levain</h3>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Ratio</span>
            <span className={styles.reviewValue}>{context.levainRatio}</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Flour</span>
            <span className={styles.reviewValue}>{context.levainFlourType}</span>
          </div>
          <div className={styles.reviewItem}>
            <span className={styles.reviewLabel}>Ambient</span>
            <span className={styles.reviewValue}>{context.ambientTemp} °C</span>
          </div>
        </div>
      </div>
    </div>
  );
};
