import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IFirestoreUser } from '../types/User'

interface UserContextType {
  user: IFirestoreUser | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
