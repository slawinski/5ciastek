import React from "react";
import styles from "./BakeAlongWizard.module.css";

interface WizardBreadcrumbsProps {
  currentState: string;
}

const steps = [
  { id: "scheduling", name: "Schedule" },
  { id: "dough", name: "Dough" },
  { id: "starter", name: "Starter" },
  { id: "review", name: "Review" },
  { id: "generated", name: "Generated" },
];

export const WizardBreadcrumbs: React.FC<WizardBreadcrumbsProps> = ({
  currentState,
}) => {
  // Find the index of the current step to mark previous steps as completed
  const currentStepIndex = steps.findIndex((step) => step.id === currentState);

  return (
    <nav className={styles.breadcrumbs}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`${styles.crumb} ${
              index === currentStepIndex ? styles.activeCrumb : ""
            } ${index < currentStepIndex ? styles.completedCrumb : ""}`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className={styles.crumbSeparator} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
