import React from "react";
import styles from "./ResultsPanel.module.css";
import Button from "@/components/Button";

interface ResultsPanelProps {
  title: string;
  results: {
    bulkFermentationTime: string;
    proofingTime: string;
    totalFermentationTime: string;
    bulkFermentationTimeDecimal: number;
    proofingTimeDecimal: number;
    totalFermentationTimeDecimal: number;
  };
  onLearnMoreClick: () => void;
  isLoading?: boolean;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ title, results, onLearnMoreClick, isLoading = false }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <Button onClick={onLearnMoreClick} className={styles.learnMoreBtn} aria-label="Learn more about results">
          ?
        </Button>
      </div>

      <div className={styles.mainResult}>
        {isLoading ? (
          <div className={styles.skeletonBox}>
            <div className={styles.resultLabel}>Calculating...</div>
            <div className={styles.skeletonValue} style={{ width: '60%', height: '3rem' }}></div>
            <div className={styles.skeletonText} style={{ width: '40%' }}></div>
          </div>
        ) : (
          <>
            <div className={styles.resultLabel}>Bulk Fermentation</div>
            <div className={styles.mainValue}>{results.bulkFermentationTime || "--:--"}</div>
            <div className={styles.decimalValue}>{results.bulkFermentationTimeDecimal} hours</div>
          </>
        )}
      </div>

      <div className={styles.secondaryResults}>
        <div className={styles.secondaryResult}>
          {isLoading ? (
            <div className={styles.skeletonBox} style={{ alignItems: 'flex-start' }}>
               <div className={styles.resultLabel}>Proofing</div>
               <div className={styles.skeletonValueSmall}></div>
            </div>
          ) : (
            <>
              <div className={styles.resultLabel}>Proofing Time</div>
              <div className={styles.secondaryValue}>{results.proofingTime || "--:--"}</div>
              <div className={styles.decimalValue}>{results.proofingTimeDecimal}h</div>
            </>
          )}
        </div>
        <div className={styles.secondaryResult}>
          {isLoading ? (
             <div className={styles.skeletonBox} style={{ alignItems: 'flex-start' }}>
               <div className={styles.resultLabel}>Total</div>
               <div className={styles.skeletonValueSmall}></div>
             </div>
          ) : (
            <>
              <div className={styles.resultLabel}>Total Time</div>
              <div className={styles.secondaryValue}>{results.totalFermentationTime || "--:--"}</div>
              <div className={styles.decimalValue}>{results.totalFermentationTimeDecimal}h</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
