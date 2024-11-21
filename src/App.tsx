import React, { useEffect } from 'react';
import { LogBox, Platform, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './contexts/UserContext';
import AppNavigator from './navigation/AppNavigator';
import { SupportGroupProvider } from './contexts/SupportGroupContext';
import { NotificationsProvider } from './contexts/NotificationContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

LogBox.ignoreAllLogs();

function App(): React.JSX.Element {
  useEffect(() => {
    const setupNotifications = async () => {
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('📩 Notificación recibida en segundo plano:', remoteMessage);
        PushNotification.localNotification({
          channelId: 'default',
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body || '',
        });
      });

      const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        console.log('📩 Notificación recibida en primer plano:', remoteMessage);
        PushNotification.localNotification({
          channelId: 'default',
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body || '',
        });
      });

      if (Platform.OS === 'android') {
        PushNotification.createChannel({
          channelId: 'default',
          channelName: 'Canal predeterminado',
          importance: 4,
        },
        (created: any) => console.log(`🟢 Canal de notificaciones ${created ? 'creado' : 'ya existente'}`),
        );
      }

      return unsubscribe;
    };

    setupNotifications();
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
