import React from 'react';
import styles from './History.module.css';

interface BakeHistoryCardProps {
  date: string;
  name: string;
  score: number;
  hydration: number;
  temp: number;
}

export const BakeHistoryCard: React.FC<BakeHistoryCardProps> = ({ date, name, score, hydration, temp }) => {
  return (
    <div className={styles.historyCard}>
      <div className={styles.cardHeader}>
        <span className={styles.date}>{date}</span>
        <span className={styles.score}>★ {score}/10</span>
      </div>
      <h4 className={styles.bakeName}>{name}</h4>
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Hydration</span>
          <span className={styles.statValue}>{hydration}%</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Temp</span>
          <span className={styles.statValue}>{temp}°C</span>
        </div>
      </div>
    </div>
  );
};
