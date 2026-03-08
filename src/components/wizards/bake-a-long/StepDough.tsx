import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/InputField';
import { BakeAlongEvent } from '@/machines/bakeAlongMachine';
import styles from './Wizard.module.css';

interface StepDoughProps {
  doughTemp: number | null;
  hydration: number | null;
  autolyseType: 'autolyse' | 'fermentolyse' | null;
  send: (event: BakeAlongEvent) => void;
}

export const StepDough: React.FC<StepDoughProps> = ({ doughTemp, hydration, autolyseType, send }) => {
  const [localTemp, setLocalTemp] = useState(doughTemp?.toString() ?? '23');
  const [localHydration, setLocalHydration] = useState(hydration ?? 75);
  const [localAutolyseType, setLocalAutolyseType] = useState(autolyseType ?? 'autolyse');

  useEffect(() => {
    const tempAsNumber = localTemp === '' ? null : parseFloat(localTemp);
    if (tempAsNumber !== doughTemp || localHydration !== hydration || localAutolyseType !== autolyseType) {
      send({
        type: 'UPDATE_DOUGH',
        doughTemp: tempAsNumber,
        hydration: localHydration,
        autolyseType: localAutolyseType,
      });
    }
  }, [localTemp, localHydration, localAutolyseType, doughTemp, hydration, autolyseType, send]);

  return (
    <div>
      <h2 className={styles.stepTitle}>Dough Parameters</h2>
      
      <div className={styles.group}>
        <InputField
          label="Dough Temperature (°C)"
          type="number"
          id="dough-temp"
          name="dough-temp"
          value={localTemp}
          onChange={(e) => setLocalTemp(e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Hydration</span>
        <div className={styles.radioList}>
          {[75, 80].map((h) => (
            <label key={h} className={styles.radioOption}>
              <input
                type="radio"
                name="hydration"
                value={h}
                checked={localHydration === h}
                onChange={() => setLocalHydration(h)}
                className={styles.radioInput}
              />
              <span>{h}%</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.label}>Autolyse Type</span>
        <div className={styles.radioList}>
          {['autolyse', 'fermentolyse'].map((type) => (
            <label key={type} className={styles.radioOption}>
              <input
                type="radio"
                name="autolyseType"
                value={type}
                checked={localAutolyseType === type}
                onChange={() => setLocalAutolyseType(type as any)}
                className={styles.radioInput}
              />
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
