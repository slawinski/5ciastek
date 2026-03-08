import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import styles from "./index.module.css";
import layoutStyles from "@/components/PageLayout/PageLayout.module.css";
import { InputField } from "@/components/InputField";
import { formatTime } from "@/utils/time.utils";
import { fermentationQueryOptions } from "@/features/fermentation/calculateFermentationTimes.server";
import { bakingTipsQueryOptions } from "@/features/fermentation/getBakingTips.server";
import LearnMoreModal from "@/features/fermentation/components/LearnMoreModal";
import ResultsPanel from "@/features/fermentation/components/ResultsPanel";
import { fermentationSchema } from "@/features/fermentation/fermentation";
import { useDebounce } from "@/hooks/useDebounce";
import { PageLayout } from "@/components/PageLayout";

export const Route = createFileRoute("/")({
  component: FermentationCalculator,
  loader: async ({ context: { queryClient } }) => {
    // Prefetch both tips and default fermentation results
    await Promise.all([
      queryClient.ensureQueryData(bakingTipsQueryOptions),
      queryClient.ensureQueryData(fermentationQueryOptions({ temperature: 23, hydration: "75" })),
    ]);
  },
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

  // Use TanStack Query for baking tips
  const { data: bakingTips = [], isPending: isLoadingTips } = useQuery(bakingTipsQueryOptions);

  // Parse and validate inputs for the query
  const queryData = useMemo(() => {
    const parsedTemperature = debouncedTemperature === '' ? undefined : parseFloat(debouncedTemperature);
    const validationResult = fermentationSchema.safeParse({ temperature: parsedTemperature, hydration: String(hydration) });

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      return null;
    }

    setErrors(null);
    return { temperature: parsedTemperature as number, hydration: String(hydration) };
  }, [debouncedTemperature, hydration]);

  // Use TanStack Query for fermentation results
  const { data: fermentationResults, isPending: isCalculating } = useQuery({
    ...fermentationQueryOptions(queryData || { temperature: 0, hydration: "0" }),
    enabled: !!queryData,
  });

  // Format results for display
  const results = useMemo(() => {
    if (!fermentationResults) {
      return {
        bulkFermentationTime: "",
        proofingTime: "",
        totalFermentationTime: "",
        bulkFermentationTimeDecimal: 0,
        proofingTimeDecimal: 0,
        totalFermentationTimeDecimal: 0,
      };
    }
    
    // ... (rest of formatting logic)

    const { bulkTime, proofTime, totalTime } = fermentationResults;
    return {
      bulkFermentationTime: formatTime(bulkTime),
      proofingTime: proofTime ? formatTime(proofTime) : "",
      totalFermentationTime: formatTime(totalTime),
      bulkFermentationTimeDecimal: parseFloat(bulkTime.toFixed(2)),
      proofingTimeDecimal: proofTime ? parseFloat(proofTime.toFixed(2)) : 0,
      totalFermentationTimeDecimal: parseFloat(totalTime.toFixed(2)),
    };
  }, [fermentationResults]);

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemperature(e.target.value);
  };

  const handleHydrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHydration(Number(e.target.value));
  };

  const toggleModal = () => setShowModal(!showModal);

  return (
    <PageLayout title="Fermentation Calculator">
      <div className={styles.calculatorGrid}>
        <div className={layoutStyles.card}>
          <h3 className={styles.cardHeader}>Settings</h3>
          <div className={styles.inputsWrapper}>
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
            <div className={styles.radioSection}>
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
          </div>
        </div>

        <div className={layoutStyles.card}>
          <ResultsPanel 
            title="Results" 
            results={results} 
            onLearnMoreClick={toggleModal} 
            isLoading={isCalculating}
          />
        </div>
        
        <div className={`${layoutStyles.card} ${styles.proTipsCard}`}>
          <h4 className={styles.proTipsTitle}>Baking Pro Tips</h4>
          <ul className={styles.proTipsList}>
            {isLoadingTips ? (
              [1, 2, 3].map((i) => (
                <li key={i} className={styles.skeletonItem}>
                  <div className={styles.skeletonLine} style={{ width: '40%', marginBottom: '4px' }}></div>
                  <div className={styles.skeletonLine}></div>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                </li>
              ))
            ) : (
              bakingTips.map((tip, index) => (
                <li key={index}>
                  <strong>{tip.title}:</strong> {tip.content}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <LearnMoreModal isOpen={showModal} onClose={toggleModal} />
    </PageLayout>
  );
}
