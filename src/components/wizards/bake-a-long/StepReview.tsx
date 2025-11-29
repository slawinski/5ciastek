import { BakeAlongContext } from '@/machines/bakeAlongMachine';

interface StepReviewProps {
  context: BakeAlongContext;
}

// Helper to format Date for display
const formatDateTime = (date: Date | null) => {
  if (!date) return "N/A";
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const StepReview: React.FC<StepReviewProps> = ({ context }) => {
  return (
    <div>
      <h2>Step 4: Review Your Selections</h2>
      <div>
        <h3>Schedule</h3>
        <p><strong>Ready Time:</strong> {formatDateTime(context.readyTime)}</p>
      </div>
      <div>
        <h3>Dough Parameters</h3>
        <p><strong>Dough Temperature:</strong> {context.doughTemp ?? 'N/A'} °C</p>
        <p><strong>Hydration:</strong> {context.hydration ?? 'N/A'} %</p>
        <p><strong>Autolyse Type:</strong> {context.autolyseType ?? 'N/A'}</p>
      </div>
      <div>
        <h3>Starter Details</h3>
        <p><strong>Levain Ratio:</strong> {context.levainRatio ?? 'N/A'}</p>
        <p><strong>Ambient Temperature:</strong> {context.ambientTemp ?? 'N/A'} °C</p>
      </div>
    </div>
  );
};