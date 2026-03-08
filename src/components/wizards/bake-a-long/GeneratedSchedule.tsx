import { BakeAlongEvent } from '@/machines/bakeAlongMachine';
import { SchedulePhase } from '@/utils/schedule.utils';
import React from 'react';

interface GeneratedScheduleProps {
  schedule: SchedulePhase[];
  send: (event: BakeAlongEvent) => void;
}

// Helper to format Date for display
const formatDateTime = (date: Date) => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const GeneratedSchedule: React.FC<GeneratedScheduleProps> = ({ schedule }) => {
  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Your Baking Schedule</h2>
      {schedule.length === 0 ? (
        <p>No schedule could be generated. Please check your inputs.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {schedule.map((phase, index) => (
            <div 
              key={index} 
              style={{ 
                padding: '16px', 
                border: '2px solid black', 
                backgroundColor: 'white',
                boxShadow: '4px 4px 0px black'
              }}
            >
              <strong style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{phase.label}</strong>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.9em', fontWeight: 600 }}>
                {formatDateTime(phase.start)} <br/> 
                <span style={{ color: '#666' }}>to</span> {formatDateTime(phase.end)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
