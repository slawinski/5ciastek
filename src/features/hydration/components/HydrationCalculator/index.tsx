import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { InputField } from "@/components/InputField";
import { useDebounce } from "@/hooks/useDebounce";
import { hydrationSchema } from "../../hydration";
import { hydrationQueryOptions } from "../../calculateHydration.server";
import ResultsPanel from "../ResultsPanel";
import styles from "./HydrationCalculator.module.css";
import layoutStyles from "@/components/PageLayout/PageLayout.module.css";

const HydrationCalculator: React.FC = () => {
  const [flourWeight, setFlourWeight] = useState<string>("500");
  const [desiredHydration, setDesiredHydration] = useState<string>("70");

  const debouncedFlourWeight = useDebounce(flourWeight, 500);
  const debouncedDesiredHydration = useDebounce(desiredHydration, 500);

  const [errors, setErrors] = useState<{
    flourWeight?: string[];
    desiredHydration?: string[];
  } | null>(null);

  const queryData = useMemo(() => {
    const fw = parseFloat(debouncedFlourWeight);
    const dh = parseFloat(debouncedDesiredHydration);

    const validationResult = hydrationSchema.safeParse({ 
      flourWeight: fw, 
      desiredHydration: dh 
    });

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      return null;
    }

    setErrors(null);
    return { flourWeight: fw, desiredHydration: dh };
  }, [debouncedFlourWeight, debouncedDesiredHydration]);

  const { data: hydrationResults, isPending: isCalculating } = useQuery({
    ...hydrationQueryOptions(queryData || { flourWeight: 0, desiredHydration: 0 }),
    enabled: !!queryData,
  });

  const handleFlourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlourWeight(e.target.value);
  };

  const handleHydrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesiredHydration(e.target.value);
  };

  return (
    <div className={styles.calculatorGrid}>
      <div className={layoutStyles.card}>
        <h3 className={styles.cardHeader}>Dough Specs</h3>
        <div className={styles.inputsWrapper}>
          <InputField
            label="Total Flour (excluding starter) (g)"
            value={flourWeight}
            onChange={handleFlourChange}
            type="number"
            id="flourWeight"
            name="flourWeight"
          />
          {errors?.flourWeight && (
            <p className={styles.error}>{errors.flourWeight[0]}</p>
          )}

          <InputField
            label="Desired Hydration (%)"
            value={desiredHydration}
            onChange={handleHydrationChange}
            type="number"
            id="desiredHydration"
            name="desiredHydration"
          />
          {errors?.desiredHydration && (
            <p className={styles.error}>{errors.desiredHydration[0]}</p>
          )}

          <div className={styles.infoBox}>
            <p><strong>Starter:</strong> 20% of flour weight (1:1 ratio)</p>
          </div>
        </div>
      </div>

      <div className={layoutStyles.card}>
        <ResultsPanel 
          title="Recipe Results" 
          results={hydrationResults || null} 
          isLoading={isCalculating}
        />
      </div>
    </div>
  );
};

export default HydrationCalculator;
