import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IFirestoreSupportGroup } from '../types/SupportGroup';

interface SupportGroupContextType {
  supportGroup: IFirestoreSupportGroup | null;
  setSupportGroup: React.Dispatch<React.SetStateAction<IFirestoreSupportGroup | null>>;
}

const SupportGroupContext = createContext<SupportGroupContextType | undefined>(undefined);

export const SupportGroupProvider = ({ children }: { children: ReactNode }) => {
  const [supportGroup, setSupportGroup] = useState<IFirestoreSupportGroup | null>(null);

  return (
    <SupportGroupContext.Provider value={{ supportGroup, setSupportGroup }}>
      {children}
    </SupportGroupContext.Provider>
  );
};

export const useSupportGroup = () => {
  const context = useContext(SupportGroupContext);
  if (!context) {
    throw new Error('useSupportGroup must be used within a SupportGroupProvider');
  }
  return context;
};
