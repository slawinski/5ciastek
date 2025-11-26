import React from "react";
import styles from "./ResultsPanel.module.css";
import Button from "@/components/Button"; // Assuming Button is used inside

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
    <div className={styles.results}>
      <h4 className={styles.h4}>
        <span>{title}</span>
        <Button onClick={onLearnMoreClick} className={styles['learn-more-button']}>
          ?
        </Button>
      </h4>
      <div>
        <p className={styles['results-row']}>
          <span>Bulk Time: </span>
          <span>
            {results.bulkFermentationTime} (
            {results.bulkFermentationTimeDecimal} hours)
          </span>
        </p>
        <p className={styles['results-row']}>
          <span>Proofing Time: </span>
          <span>
            {results.proofingTime} ({results.proofingTimeDecimal} hours)
          </span>
        </p>
        <p className={styles['results-row']}>
          <span>Total Time: </span>
          <span>
            {results.totalFermentationTime} (
            {results.totalFermentationTimeDecimal} hours)
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResultsPanel;
