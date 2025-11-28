import { createFileRoute } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import { bakeAlongMachine } from "@/machines/bakeAlongMachine";
import { StepSchedule } from "@/components/wizards/bake-a-long/StepSchedule";
import { StepDough } from "@/components/wizards/bake-a-long/StepDough";
import { StepStarter } from "@/components/wizards/bake-a-long/StepStarter";
import { StepReview } from "@/components/wizards/bake-a-long/StepReview";
import { GeneratedSchedule } from "@/components/wizards/bake-a-long/GeneratedSchedule";
import { WizardBreadcrumbs } from "@/components/wizards/bake-a-long/WizardBreadcrumbs"; // New Import
import styles from '../../components/wizards/bake-a-long/BakeAlongWizard.module.css';

export const Route = createFileRoute("/bake-a-long/")({
  component: BakeAlongWizard,
});

function BakeAlongWizard() {
  const [state, send] = useMachine(bakeAlongMachine);

  const renderStep = () => {
    if (state.matches("scheduling")) {
      return <StepSchedule send={send} readyTime={state.context.readyTime} />;
    }
    if (state.matches("dough")) {
      return (
        <StepDough
          send={send}
          doughTemp={state.context.doughTemp}
          hydration={state.context.hydration}
        />
      );
    }
    if (state.matches("starter")) {
      return (
        <StepStarter
          send={send}
          levainRatio={state.context.levainRatio}
          ambientTemp={state.context.ambientTemp}
        />
      );
    }
    if (state.matches("review")) {
      return <StepReview context={state.context} />;
    }
    if (state.matches("generated")) {
      return (
        <GeneratedSchedule
          schedule={state.context.schedule || []}
          send={send}
        />
      );
    }
    return null;
  };

  return (
    <>
      <WizardBreadcrumbs currentState={state.value as string} /> {/* Render Breadcrumbs outside */}
      <div className={styles.wizardContainer}>
        <h1 className={styles.wizardHeader}>Bake-a-long Wizard</h1>
        
        <div className={styles.stepContainer}>
          {renderStep()}
        </div>

        <div className={styles.navigation}>
          {/* Using a placeholder for the left side to keep "Next" on the right */}
          <div>
            {state.matches("dough") ||
            state.matches("starter") ||
            state.matches("review") ? (
              <button
                className={styles.navButton}
                onClick={() => send({ type: "BACK" })}
              >
                Back
              </button>
            ) : (
              <div>&nbsp;</div>
            )}
          </div>

          <div>
            {state.matches("scheduling") ||
            state.matches("dough") ||
            state.matches("starter") ? (
              <button
                className={styles.navButton}
                onClick={() => send({ type: "NEXT" })}
              >
                Next
              </button>
            ) : null}

            {state.matches("review") && (
              <button
                className={`${styles.navButton} ${styles.generate}`}
                onClick={() => send({ type: "GENERATE" })}
              >
                Generate Schedule
              </button>
            )}

            {state.matches("generated") && (
              <button
                className={`${styles.navButton} ${styles.reset}`}
                onClick={() => send({ type: "RESET" })}
              >
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
