import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./index.module.css"; // Updated import for CSS Modules
import { InputField } from "@/components/InputField";
import { formatTime, calculateFermentationTimes } from "@/utils/fermentationUtils";

export const Route = createFileRoute("/")({
  component: FermentationCalculator,
});

function FermentationCalculator() {
  const [temperature, setTemperature] = useState(23);
  const [hydration, setHydration] = useState(75);
  const [results, setResults] = useState({
    bulkFermentationTime: "",
    proofingTime: "",
    totalFermentationTime: "",
    bulkFermentationTimeDecimal: 0,
    proofingTimeDecimal: 0,
    totalFermentationTimeDecimal: 0,
  });

  useEffect(() => {
    const { bulkTime, proofTime, totalTime } = calculateFermentationTimes(temperature, hydration);

    setResults({
      bulkFermentationTime: formatTime(bulkTime),
      proofingTime: formatTime(proofTime),
      totalFermentationTime: formatTime(totalTime),
      bulkFermentationTimeDecimal: parseFloat(bulkTime.toFixed(2)),
      proofingTimeDecimal: parseFloat(proofTime.toFixed(2)),
      totalFermentationTimeDecimal: parseFloat(totalTime.toFixed(2)),
    });
  }, [temperature, hydration]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(Number(e.target.value));
  };

  const handleHydrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHydration(Number(e.target.value));
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Fermentation Calculator</h3>
      <InputField
        label="Dough Temperature (°C)"
        value={temperature}
        onChange={handleTemperatureChange}
        type="number"
        id="temperature"
      />
      <div>
        <label>Hydration</label>
        <div className={styles["radio-group"]}>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              value="75"
              checked={hydration === 75}
              onChange={handleHydrationChange}
              className={styles["radio-input"]}
            />
            75%
          </label>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              value="80"
              checked={hydration === 80}
              onChange={handleHydrationChange}
              className={styles["radio-input"]}
            />
            80%
          </label>
        </div>
      </div>
      <div className={styles.results}>
        <h4 className={styles.h4}>Results:</h4>
        <div>
          <p className={styles.resultsRow}>
            <span>Bulk Fermentation Time: </span>
            <span>
              {results.bulkFermentationTime} (
              {results.bulkFermentationTimeDecimal} hours)
            </span>
          </p>
          <p className={styles.resultsRow}>
            <span>Proofing Time: </span>
            <span>
              {results.proofingTime} ({results.proofingTimeDecimal} hours)
            </span>
          </p>
          <p className={styles.resultsRow}>
            <span>Total Time: </span>
            <span>
              {results.totalFermentationTime} (
              {results.totalFermentationTimeDecimal} hours)
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
