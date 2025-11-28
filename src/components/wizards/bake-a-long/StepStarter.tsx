import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/InputField';
import styles from '@/routes/index.module.css'; // Reusing styles
import { BakeAlongEvent } from '@/machines/bakeAlongMachine';

interface StepStarterProps {
  levainRatio: string | null;
  ambientTemp: number | null;
  send: (event: BakeAlongEvent) => void;
}

const RATIOS = ["1:1:1", "1:2:2"];

export const StepStarter: React.FC<StepStarterProps> = ({ levainRatio, ambientTemp, send }) => {
  // Use local state to manage the form inputs
  const [localRatio, setLocalRatio] = useState(levainRatio ?? '1:2:2');
  const [localTemp, setLocalTemp] = useState(ambientTemp?.toString() ?? '21');

  // This effect synchronizes local state with the parent machine's context
  useEffect(() => {
    const tempAsNumber = localTemp === '' ? null : parseFloat(localTemp);
    if (localRatio !== levainRatio || tempAsNumber !== ambientTemp) {
      send({
        type: 'UPDATE_STARTER',
        levainRatio: localRatio,
        ambientTemp: tempAsNumber,
      });
    }
  }, [localRatio, localTemp, levainRatio, ambientTemp, send]);

  return (
    <div>
      <h2>Step 3: Preparing your levain.</h2>
      <InputField
        label="Ambient Temperature (°C)"
        type="number"
        id="ambient-temp"
        value={localTemp}
        onChange={(e) => setLocalTemp(e.target.value)}
      />
      <div>
        <label>Starter Feeding Ratio</label>
        <div className={styles["radio-group"]}>
          {RATIOS.map(ratio => (
            <label key={ratio} className={styles["radio-label"]}>
              <input
                type="radio"
                value={ratio}
                checked={localRatio === ratio}
                onChange={() => setLocalRatio(ratio)}
                className={styles["radio-input"]}
              />
              {ratio}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};