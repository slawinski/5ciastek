import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import { InputField } from "@/components/InputField";
import { formatTime } from "@/utils/time.utils";
import { calculateFermentationTimesServer } from "@/features/fermentation/calculateFermentationTimes.server";
import LearnMoreModal from "@/features/fermentation/components/LearnMoreModal";
import ResultsPanel from "@/features/fermentation/components/ResultsPanel";
import { fermentationSchema } from "@/features/fermentation/fermentation";
import { useDebounce } from "@/hooks/useDebounce";

export const Route = createFileRoute("/")({
  component: FermentationCalculator,
});

function FermentationCalculator() {
  const [temperature, setTemperature] = useState<string>('23');
  const debouncedTemperature = useDebounce(temperature, 500);

  const [hydration, setHydration] = useState(75);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{
    temperature?: string[];
    hydration?: string[];
  } | null>(null);
  const [results, setResults] = useState({
    bulkFermentationTime: "",
    proofingTime: "",
    totalFermentationTime: "",
    bulkFermentationTimeDecimal: 0,
    proofingTimeDecimal: 0,
    totalFermentationTimeDecimal: 0,
  });

  useEffect(() => {
    const parsedTemperature = debouncedTemperature === '' ? undefined : parseFloat(debouncedTemperature);

    const validationResult = fermentationSchema.safeParse({ temperature: parsedTemperature, hydration: String(hydration) });

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      setResults({
        bulkFermentationTime: "",
        proofingTime: "",
        totalFermentationTime: "",
        bulkFermentationTimeDecimal: 0,
        proofingTimeDecimal: 0,
        totalFermentationTimeDecimal: 0,
      });
      return;
    } else {
      setErrors(null);
    }

    async function fetchFermentationTimes() {
      const { bulkTime, proofTime, totalTime } =
        await calculateFermentationTimesServer({
          data: { temperature: parsedTemperature as number, hydration: String(hydration) },
        });

      setResults({
        bulkFermentationTime: formatTime(bulkTime),
        proofingTime: formatTime(proofTime),
        totalFermentationTime: formatTime(totalTime),
        bulkFermentationTimeDecimal: parseFloat(bulkTime.toFixed(2)),
        proofingTimeDecimal: parseFloat(proofTime.toFixed(2)),
        totalFermentationTimeDecimal: parseFloat(totalTime.toFixed(2)),
      });
    }
    fetchFermentationTimes();
  }, [debouncedTemperature, hydration]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(e.target.value);
  };

  const handleHydrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHydration(Number(e.target.value));
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <div className={styles.container}>
      <h3 className={styles.h3}>Fermentation Calculator</h3>
      <InputField
        label="Dough Temperature (°C)"
        value={temperature}
        onChange={handleTemperatureChange}
        type="number"
        id="temperature"
        name="temperature"
      />
      {errors?.temperature && (
        <p className={styles.error}>{errors.temperature[0]}</p>
      )}
      <div>
        <label className={styles.label}>Hydration</label>
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
        {errors?.hydration && (
          <p className={styles.error}>{errors.hydration[0]}</p>
        )}
      </div>
      <ResultsPanel title="Results:" results={results} onLearnMoreClick={toggleModal} />
      <LearnMoreModal isOpen={showModal} onClose={toggleModal} />
    </div>
  );
}
