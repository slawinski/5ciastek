import { BakeAlongEvent } from '@/machines/bakeAlongMachine';
import { SchedulePhase } from '@/utils/schedule.utils';

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

export const GeneratedSchedule: React.FC<GeneratedScheduleProps> = ({ schedule, send }) => {
  return (
    <div>
      <h2>Your Baking Schedule</h2>
      {schedule.length === 0 ? (
        <p>No schedule could be generated. Please check your inputs.</p>
      ) : (
        <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}>
          {schedule.map((phase, index) => (
            <div key={index} style={{ marginBottom: '10px', borderBottom: '1px dashed #eee', paddingBottom: '5px' }}>
              <strong>{phase.label}</strong>
              <p style={{ margin: '0', fontSize: '0.9em', color: '#555' }}>
                {formatDateTime(phase.start)} - {formatDateTime(phase.end)}
              </p>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => send({ type: 'RESET' })} style={{ marginTop: '20px' }}>Start Over</button>
    </div>
  );
};