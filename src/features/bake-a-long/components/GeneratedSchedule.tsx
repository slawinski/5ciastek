import { SchedulePhase } from '@/utils/schedule.utils';
import React from 'react';
import { useBakeAlong } from '../context';
import styles from './BakeAlongWizard.module.css';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const GeneratedSchedule: React.FC = () => {
  const { state } = useBakeAlong();
  const schedule = (state.context.schedule || []) as SchedulePhase[];

  return (
    <div className={styles.generatedSchedule}>
      <h2 style={{ 
        fontFamily: 'var(--font-mono)', 
        fontSize: '1.25rem', 
        fontWeight: 900, 
        textTransform: 'uppercase',
        marginBottom: '24px',
        borderBottom: '2px solid black',
        paddingBottom: '4px'
      }}>
        Baking Timeline
      </h2>

      {schedule.length === 0 ? (
        <p>No schedule could be generated. Please check your inputs.</p>
      ) : (
        <div className={styles.calendarView}>
          {schedule.map((phase, index) => {
            const isFirstOfDate = index === 0 || 
              formatDate(new Date(schedule[index-1].start)) !== formatDate(new Date(phase.start));

            return (
              <React.Fragment key={index}>
                {isFirstOfDate && (
                  <div style={{ 
                    backgroundColor: 'var(--color-black)', 
                    color: 'var(--color-white)', 
                    padding: '4px 12px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {formatDate(new Date(phase.start))}
                  </div>
                )}
                <div className={styles.timeSlot}>
                  <div className={styles.timeLabel}>
                    {formatTime(new Date(phase.start))}
                  </div>
                  <div className={`${styles.phaseBlock} ${index % 2 === 0 ? styles.phaseBlockPrimary : styles.phaseBlockSecondary}`}>
                    <span className={styles.phaseLabel}>{phase.label}</span>
                    <span className={styles.phaseTime}>
                      {formatTime(new Date(phase.start))} - {formatTime(new Date(phase.end))}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
