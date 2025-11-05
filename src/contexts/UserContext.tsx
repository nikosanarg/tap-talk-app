import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ISupabaseUser } from '../types/User';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService } from '../services/AuthService';

interface UserContextType {
  user: ISupabaseUser | null;
  setUser: React.Dispatch<React.SetStateAction<ISupabaseUser | null>>;
  handleLogout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ISupabaseUser | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Verificar sesión al iniciar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logoutUser();
      setUser(null);
      await AsyncStorage.removeItem('groupId');
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};