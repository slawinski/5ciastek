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
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ title, results, onLearnMoreClick }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>{title}</h4>
        <Button onClick={onLearnMoreClick} className={styles.learnMoreBtn} aria-label="Learn more about results">
          ?
        </Button>
      </div>

      <div className={styles.mainResult}>
        <div className={styles.resultLabel}>Total Fermentation</div>
        <div className={styles.mainValue}>{results.totalFermentationTime}</div>
        <div className={styles.decimalValue}>{results.totalFermentationTimeDecimal} hours</div>
      </div>

      <div className={styles.secondaryResults}>
        <div className={styles.secondaryResult}>
          <div className={styles.resultLabel}>Bulk Time</div>
          <div className={styles.secondaryValue}>{results.bulkFermentationTime}</div>
          <div className={styles.decimalValue}>{results.bulkFermentationTimeDecimal}h</div>
        </div>
        <div className={styles.secondaryResult}>
          <div className={styles.resultLabel}>Proofing Time</div>
          <div className={styles.secondaryValue}>{results.proofingTime}</div>
          <div className={styles.decimalValue}>{results.proofingTimeDecimal}h</div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
