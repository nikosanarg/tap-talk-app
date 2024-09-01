import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FirestoreUser } from '../types/User'

interface UserContextType {
  user: FirestoreUser | null;
  setUser: React.Dispatch<React.SetStateAction<FirestoreUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirestoreUser | null>(null);

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
