import React from "react";
import styles from "./ResultsPanel.module.css";

interface ResultsPanelProps {
  title: string;
  results: {
    waterToAdd: number;
    starterWeight: number;
    totalFlour: number;
    totalWater: number;
  } | null;
  isLoading?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ title, results, isLoading = false }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
      </div>

      <div className={styles.mainResult}>
        {isLoading ? (
          <div className={styles.skeletonBox}>
            <div className={styles.resultLabel}>Calculating...</div>
            <div className={styles.skeletonValue} style={{ width: '60%', height: '3rem' }}></div>
          </div>
        ) : (
          <>
            <div className={styles.resultLabel}>Water to Add</div>
            <div className={styles.mainValue}>{results ? `${results.waterToAdd.toFixed(0)}g` : "--"}</div>
          </>
        )}
      </div>

      <div className={styles.secondaryResults}>
        <div className={styles.secondaryResult}>
          {isLoading ? (
            <div className={styles.skeletonBox} style={{ alignItems: 'flex-start' }}>
               <div className={styles.resultLabel}>Starter</div>
               <div className={styles.skeletonValueSmall}></div>
            </div>
          ) : (
            <>
              <div className={styles.resultLabel}>Starter Weight</div>
              <div className={styles.secondaryValue}>{results ? `${results.starterWeight.toFixed(0)}g` : "--"}</div>
            </>
          )}
        </div>
        <div className={styles.secondaryResult}>
          {isLoading ? (
             <div className={styles.skeletonBox} style={{ alignItems: 'flex-start' }}>
               <div className={styles.resultLabel}>Total Flour</div>
               <div className={styles.skeletonValueSmall}></div>
             </div>
          ) : (
            <>
              <div className={styles.resultLabel}>Total Flour</div>
              <div className={styles.secondaryValue}>{results ? `${results.totalFlour.toFixed(0)}g` : "--"}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
