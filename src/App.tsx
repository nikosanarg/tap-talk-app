import React, { useEffect } from 'react';
import { LogBox, Platform, SafeAreaView, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './contexts/UserContext';
import AppNavigator from './navigation/AppNavigator';
import { SupportGroupProvider } from './contexts/SupportGroupContext';
import { NotificationsProvider } from './contexts/NotificationContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { NotificationService } from './services/NotificationService';

LogBox.ignoreAllLogs();

function App(): React.JSX.Element {
  useEffect(() => {
    const setupNotifications = async () => {
      // Obtener token del dispositivo
      const token = await messaging().getToken();
      console.log('📱 Token FCM:', token);

      // Manejar notificaciones en primer plano
      const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        console.log('📩 Notificación recibida en primer plano:', remoteMessage);
        PushNotification.localNotification({
          channelId: 'default',
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body || '',
        });
      });

      // Manejar notificaciones en segundo plano
      messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log('📩 Notificación recibida en segundo plano:', remoteMessage);
        PushNotification.localNotification({
          channelId: 'default',
          title: remoteMessage.notification?.title,
          message: remoteMessage.notification?.body || '',
        });
      });

      // Manejar notificación cuando la app está cerrada
      messaging()
        .getInitialNotification()
        .then((remoteMessage) => {
          if (remoteMessage) {
            console.log('📩 Notificación recibida con la app cerrada:', remoteMessage);
            Alert.alert(remoteMessage.notification?.title || 'Notificación', remoteMessage.notification?.body || '');
          }
        });

      // Crear canal de notificación en Android
      if (Platform.OS === 'android') {
        PushNotification.createChannel(
          {
            channelId: 'default',
            channelName: 'Canal predeterminado',
            importance: 4,
          },
          (created) => console.log(`🟢 Canal de notificaciones ${created ? 'creado' : 'ya existente'}`)
        );
      }

      // Solicitar permisos en iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('🔴 Permiso de notificaciones denegado');
        }
      }

      return unsubscribeForeground;
    };

    setupNotifications();
  }, []);

  useEffect(() => {
    const initializeNotifications = async () => {
      await NotificationService.requestPermission();
      const token = await NotificationService.getToken();
      
      if (token) {
        console.log("✅ Token de Firebase obtenido correctamente.");
      } else {
        console.log("❌ No se pudo obtener el token.");
      }
  
      NotificationService.setBackgroundMessageHandler();
    };
  
    initializeNotifications();
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
