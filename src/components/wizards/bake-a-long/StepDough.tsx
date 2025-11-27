import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/InputField';
import styles from '@/routes/index.module.css'; // Reusing styles
import { BakeAlongEvent } from '@/machines/bakeAlongMachine';

interface StepDoughProps {
  doughTemp: number | null;
  hydration: number | null;
  send: (event: BakeAlongEvent) => void;
}

export const StepDough: React.FC<StepDoughProps> = ({ doughTemp, hydration, send }) => {
  // Use local state to manage the form inputs
  const [localTemp, setLocalTemp] = useState(doughTemp?.toString() ?? '23');
  const [localHydration, setLocalHydration] = useState(hydration ?? 75);

  // This effect synchronizes local state with the parent machine's context
  useEffect(() => {
    const tempAsNumber = localTemp === '' ? null : parseFloat(localTemp);
    // Only send update if there's an actual change
    if (tempAsNumber !== doughTemp || localHydration !== hydration) {
      send({
        type: 'UPDATE_DOUGH',
        doughTemp: tempAsNumber,
        hydration: localHydration,
      });
    }
  }, [localTemp, localHydration, doughTemp, hydration, send]);

  return (
    <div>
      <h2>Step 2: What are you making?</h2>
      <InputField
        label="Dough Temperature (°C)"
        type="number"
        id="dough-temp"
        value={localTemp}
        onChange={(e) => setLocalTemp(e.target.value)}
      />
      <div>
        <label>Hydration</label>
        <div className={styles["radio-group"]}>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              value="75"
              checked={localHydration === 75}
              onChange={() => setLocalHydration(75)}
              className={styles["radio-input"]}
            />
            75%
          </label>
          <label className={styles["radio-label"]}>
            <input
              type="radio"
              value="80"
              checked={localHydration === 80}
              onChange={() => setLocalHydration(80)}
              className={styles["radio-input"]}
            />
            80%
          </label>
        </div>
      </div>
    </div>
  );
};