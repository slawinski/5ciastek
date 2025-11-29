import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/InputField';
import styles from '@/routes/index.module.css'; // Reusing styles
import { BakeAlongEvent } from '@/machines/bakeAlongMachine';

interface StepStarterProps {
  levainRatio: string | null;
  ambientTemp: number | null;
  levainFlourType: string | null; // Add levainFlourType prop
  send: (event: BakeAlongEvent) => void;
}

const RATIOS = ["1:1:1", "1:2:2"];
const FLOUR_TYPES = ["Bread Flour", "Whole Wheat", "Rye"];

export const StepStarter: React.FC<StepStarterProps> = ({ levainRatio, ambientTemp, levainFlourType, send }) => {
  // Use local state to manage the form inputs
  const [localRatio, setLocalRatio] = useState(levainRatio ?? '1:2:2');
  const [localTemp, setLocalTemp] = useState(ambientTemp?.toString() ?? '21');
  const [localFlourType, setLocalFlourType] = useState(levainFlourType ?? 'Bread Flour');

  // This effect synchronizes local state with the parent machine's context
  useEffect(() => {
    const tempAsNumber = localTemp === '' ? null : parseFloat(localTemp);
    if (localRatio !== levainRatio || tempAsNumber !== ambientTemp || localFlourType !== levainFlourType) {
      send({
        type: 'UPDATE_STARTER',
        levainRatio: localRatio,
        ambientTemp: tempAsNumber,
        levainFlourType: localFlourType,
      });
    }
  }, [localRatio, localTemp, localFlourType, levainRatio, ambientTemp, levainFlourType, send]);

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

      <div>
        <label>Levain Flour Type</label>
        <div className={styles["radio-group"]}>
          {FLOUR_TYPES.map(flourType => (
            <label key={flourType} className={styles["radio-label"]}>
              <input
                type="radio"
                value={flourType}
                checked={localFlourType === flourType}
                onChange={() => setLocalFlourType(flourType)}
                className={styles["radio-input"]}
              />
              {flourType}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};