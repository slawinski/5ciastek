import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/InputField';
import { BakeAlongEvent } from '@/machines/bakeAlongMachine';
import styles from './Wizard.module.css';

interface StepScheduleProps {
  readyTime: Date | null;
  send: (event: BakeAlongEvent) => void;
}

// Helper to format date to YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Helper to format time to HH:MM
const formatTime = (date: Date) => {
  return date.toTimeString().split(' ')[0].substring(0, 5);
};

export const StepSchedule: React.FC<StepScheduleProps> = ({ readyTime, send }) => {
  // Get today's date and a default time (e.g., 9 AM) for initial state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  
  const initialDate = readyTime ? formatDate(readyTime) : formatDate(tomorrow);
  const initialTime = readyTime ? formatTime(readyTime) : '09:00';

  const [dateStr, setDateStr] = useState(initialDate);
  const [timeStr, setTimeStr] = useState(initialTime);

  useEffect(() => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Months are 0-indexed in JS Date
    const newReadyTime = new Date(year, month - 1, day, hours, minutes);

    if (newReadyTime.getTime() !== readyTime?.getTime()) {
      send({ type: 'UPDATE_SCHEDULE', readyTime: newReadyTime });
    }
  }, [dateStr, timeStr, readyTime, send]);

  return (
    <div>
      <h2 className={styles.stepTitle}>When do you want your bread ready?</h2>
      <div className={styles.group}>
        <InputField
          label="Bake Day"
          type="date"
          id="bake-day"
          name="bake-day"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
        />
        <InputField
          label="Ready Time"
          type="time"
          id="bake-time"
          name="bake-time"
          value={timeStr}
          onChange={(e) => setTimeStr(e.target.value)}
        />
      </div>
    </div>
  );
};
