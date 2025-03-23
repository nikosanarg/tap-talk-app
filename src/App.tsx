import React, { useEffect } from 'react';
import { LogBox, Platform, SafeAreaView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './contexts/UserContext';
import AppNavigator from './navigation/AppNavigator';
import { SupportGroupProvider } from './contexts/SupportGroupContext';
import { NotificationsProvider } from './contexts/NotificationContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { NotificationService } from './services/NotificationService';

LogBox.ignoreAllLogs();

function App(): React.JSX.Element {
  useEffect(() => {
    NotificationService.initialize();
  }, []);

  return (
    <NavigationContainer>
      <UserProvider>
        <SupportGroupProvider>
          <NotificationsProvider>
            <CategoriesProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <AppNavigator />
              </SafeAreaView>
            </CategoriesProvider>
          </NotificationsProvider>
        </SupportGroupProvider>
      </UserProvider>
    </NavigationContainer>
  );
}

export default App;
