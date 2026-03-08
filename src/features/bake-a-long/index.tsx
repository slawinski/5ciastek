import React from "react";
import Button from "@/components/Button";
import { StepSchedule } from "./components/StepSchedule";
import { StepDough } from "./components/StepDough";
import { StepStarter } from "./components/StepStarter";
import { GeneratedSchedule } from "./components/GeneratedSchedule";
import { WizardBreadcrumbs } from "./components/WizardBreadcrumbs";
import { BakeAlongProvider, useBakeAlong } from "./context";
import styles from "./components/BakeAlongWizard.module.css";

const BakeAlongWizardContent = () => {
  const { state, send } = useBakeAlong();

  const renderStep = () => {
    if (state.matches("scheduling")) return <StepSchedule />;
    if (state.matches("dough")) return <StepDough />;
    if (state.matches("starter")) return <StepStarter />;
    if (state.matches("generated")) return <GeneratedSchedule />;
    return null;
  };

  return (
    <div className={styles.wizardContainer}>
      <h1 className={styles.wizardHeader}>Bake-a-long</h1>
      <WizardBreadcrumbs />

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
};

export const BakeAlongWizard = () => (
  <BakeAlongProvider>
    <BakeAlongWizardContent />
  </BakeAlongProvider>
);
