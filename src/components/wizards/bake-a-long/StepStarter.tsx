import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/InputField';
import { BakeAlongEvent } from '@/machines/bakeAlongMachine';
import styles from './Wizard.module.css';

interface StepStarterProps {
  levainRatio: string | null;
  ambientTemp: number | null;
  levainFlourType: string | null;
  send: (event: BakeAlongEvent) => void;
}

const RATIOS = ["1:1:1", "1:2:2"];
const FLOUR_TYPES = ["Bread Flour", "Whole Wheat", "Rye"];

export const StepStarter: React.FC<StepStarterProps> = ({ levainRatio, ambientTemp, levainFlourType, send }) => {
  const [localRatio, setLocalRatio] = useState(levainRatio ?? '1:2:2');
  const [localTemp, setLocalTemp] = useState(ambientTemp?.toString() ?? '21');
  const [localFlourType, setLocalFlourType] = useState(levainFlourType ?? 'Bread Flour');

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
      <h2 className={styles.stepTitle}>Levain Preparation</h2>
      
      <div className={styles.group}>
        <InputField
          label="Ambient Temperature (°C)"
          type="number"
          id="ambient-temp"
          name="ambient-temp"
          value={localTemp}
          onChange={(e) => setLocalTemp(e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Feeding Ratio</span>
        <div className={styles.radioList}>
          {RATIOS.map(ratio => (
            <label key={ratio} className={styles.radioOption}>
              <input
                type="radio"
                name="levainRatio"
                value={ratio}
                checked={localRatio === ratio}
                onChange={() => setLocalRatio(ratio)}
                className={styles.radioInput}
              />
              <span>{ratio}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Flour Type</span>
        <div className={styles.radioList}>
          {FLOUR_TYPES.map(flourType => (
            <label key={flourType} className={styles.radioOption}>
              <input
                type="radio"
                name="levainFlourType"
                value={flourType}
                checked={localFlourType === flourType}
                onChange={() => setLocalFlourType(flourType)}
                className={styles.radioInput}
              />
              <span>{flourType}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
