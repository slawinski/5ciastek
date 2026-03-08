import { createFileRoute } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import { bakeAlongMachine } from "@/machines/bakeAlongMachine";
import Button from "@/components/Button"; // Import the reusable button
import { StepSchedule } from "@/components/wizards/bake-a-long/StepSchedule";
import { StepDough } from "@/components/wizards/bake-a-long/StepDough";
import { StepStarter } from "@/components/wizards/bake-a-long/StepStarter";
import { GeneratedSchedule } from "@/components/wizards/bake-a-long/GeneratedSchedule";
import { WizardBreadcrumbs } from "@/components/wizards/bake-a-long/WizardBreadcrumbs";
import styles from "../../components/wizards/bake-a-long/BakeAlongWizard.module.css";

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
          autolyseType={state.context.autolyseType}
        />
      );
    }
    if (state.matches("starter")) {
      return (
        <StepStarter
          send={send}
          levainRatio={state.context.levainRatio}
          ambientTemp={state.context.ambientTemp}
          levainFlourType={state.context.levainFlourType}
        />
      );
    }
    if (state.matches("generated")) {
      return (
        <GeneratedSchedule
          schedule={state.context.schedule || []}
        />
      );
    }
    return null;
  };

  return (
    <div className={styles.wizardContainer}>
      <h1 className={styles.wizardHeader}>Bake-a-long</h1>
      <WizardBreadcrumbs currentState={state.value as string} />

      <div className={styles.stepContainer}>{renderStep()}</div>

      <div className={styles.navigation}>
        <div>
          {state.matches("dough") ||
          state.matches("starter") ||
          state.matches("generated") ? (
            <Button
              className={`${styles.navButton} ${styles.back}`}
              onClick={() => send({ type: "BACK" })}
            >
              Back
            </Button>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>

        <div>
          {state.matches("scheduling") ||
          state.matches("dough") ||
          state.matches("starter") ? (
            <Button
              className={styles.navButton}
              onClick={() => send({ type: "NEXT" })}
            >
              {state.matches("starter") ? "Generate Schedule" : "Next"}
            </Button>
          ) : null}

          {state.matches("generated") && (
            <Button
              className={`${styles.navButton} ${styles.reset}`}
              onClick={() => send({ type: "RESET" })}
            >
              Start Over
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
