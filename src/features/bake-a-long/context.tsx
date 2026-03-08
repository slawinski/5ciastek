import { createContext, useContext, ReactNode } from 'react';
import { useMachine } from '@xstate/react';
import { bakeAlongMachine } from './bakeAlongMachine';

interface BakeAlongContextType {
  state: any; // Type accurately if needed, but 'any' from useMachine is common for rapid dev
  send: (event: any) => void;
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
