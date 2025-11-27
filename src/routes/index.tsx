import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import styles from "./index.module.css"; // Updated import for CSS Modules
import { InputField } from "@/components/InputField";
import { formatTime } from "@/utils/time.utils";
import { calculateFermentationTimesServer } from "@/routes/api/fermentation";
import LearnMoreModal from "@/components/LearnMoreModal";
import ResultsPanel from "@/components/ResultsPanel"; // Import the new ResultsPanel component
import { fermentationSchema } from "@/schemas/fermentation";
import { useDebounce } from "@/hooks/useDebounce";

export const Route = createFileRoute("/")({
  component: FermentationCalculator,
});

function FermentationCalculator() {
  const [temperature, setTemperature] = useState<string>('23');
  const debouncedTemperature = useDebounce(temperature, 500); // 500ms delay

  const [hydration, setHydration] = useState(75);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
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
    // Parse the debounced temperature string for validation and calculations
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

  const toggleModal = () => setShowModal(!showModal); // Function to toggle modal

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
      {errors?.temperature && (
        <p className={styles.error}>{errors.temperature[0]}</p>
      )}
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
        {errors?.hydration && (
          <p className={styles.error}>{errors.hydration[0]}</p>
        )}
      </div>
      <ResultsPanel title="Results:" results={results} onLearnMoreClick={toggleModal} />
      <LearnMoreModal isOpen={showModal} onClose={toggleModal} />
    </div>
  );
}