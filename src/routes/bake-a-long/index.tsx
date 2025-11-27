import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { useMachine } from "@xstate/react";
import { bakeAlongMachine } from "@/machines/bakeAlongMachine";
import { StepSchedule } from "@/components/wizards/bake-a-long/StepSchedule";
import { StepDough } from "@/components/wizards/bake-a-long/StepDough";
import { StepStarter } from "@/components/wizards/bake-a-long/StepStarter";
import { StepReview } from "@/components/wizards/bake-a-long/StepReview";
import { GeneratedSchedule } from "@/components/wizards/bake-a-long/GeneratedSchedule";

export const Route = createFileRoute('/bake-a-long/')({
  component: BakeAlongWizard,
});

function BakeAlongWizard() {
  const [state, send] = useMachine(bakeAlongMachine);

  const renderStep = () => {
    if (state.matches("scheduling")) {
      return <StepSchedule />;
    }
    if (state.matches("dough")) {
      return <StepDough />;
    }
    if (state.matches("starter")) {
      return <StepStarter />;
    }
    if (state.matches("review")) {
      return <StepReview />;
    }
    if (state.matches("generated")) {
      return <GeneratedSchedule />;
    }
    return null;
  };

  return (
    <div>
      <h1>Bake-a-long Wizard</h1>
      <p>Current State (for debugging): {state.value as string}</p>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px 0' }}>
        {renderStep()}
      </div>

      <div>
        {/* Buttons to navigate the wizard */}
        {state.matches('scheduling') && <button onClick={() => send({ type: 'NEXT' })}>Next</button>}
        {state.matches('dough') && (
          <>
            <button onClick={() => send({ type: 'BACK' })}>Back</button>
            <button onClick={() => send({ type: 'NEXT' })}>Next</button>
          </>
        )}
        {state.matches('starter') && (
          <>
            <button onClick={() => send({ type: 'BACK' })}>Back</button>
            <button onClick={() => send({ type: 'NEXT' })}>Next</button>
          </>
        )}
        {state.matches('review') && (
          <>
            <button onClick={() => send({ type: 'BACK' })}>Back</button>
            <button onClick={() => send({ type: 'GENERATE' })}>Generate Schedule</button>
          </>
        )}
        {state.matches('generated') && <button onClick={() => send({ type: 'RESET' })}>Start Over</button>}
      </div>
    </div>
  );
}
