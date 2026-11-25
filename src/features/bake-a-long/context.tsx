import { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { bakeAlongMachine } from './bakeAlongMachine';
import type { ActorRefFrom, SnapshotFrom } from 'xstate';

interface BakeAlongContextType {
  state: SnapshotFrom<typeof bakeAlongMachine>;
  send: ActorRefFrom<typeof bakeAlongMachine>['send'];
}

const BakeAlongContext = createContext<BakeAlongContextType | null>(null);

export const BakeAlongProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, send] = useMachine(bakeAlongMachine);

  return (
    <BakeAlongContext.Provider value={{ state, send }}>
      {children}
    </BakeAlongContext.Provider>
  );
};

export const useBakeAlong = () => {
  const context = useContext(BakeAlongContext);
  if (!context) {
    throw new Error('useBakeAlong must be used within a BakeAlongProvider');
  }
  return context;
};
