import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Platform, Alert } from 'react-native';

export const NotificationService = {
  initialize: async () => {
    const token = await messaging().getToken();
    console.log('📱 Token FCM:', token);

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await messaging().requestPermission();
      if (
        granted !== messaging.AuthorizationStatus.AUTHORIZED &&
        granted !== messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('🔴 Notificaciones no autorizadas por el usuario');
      }
    }

    // Canal de Android
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'default',
          channelName: 'Canal predeterminado',
          importance: 4,
        },
        (created) => console.log(`🟢 Canal ${created ? 'creado' : 'ya existente'}`)
      );
    }

    // Permisos iOS
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        console.log('🔴 Permiso de notificaciones denegado');
      }
    }

    // Foreground
    messaging().onMessage(async (remoteMessage) => {
      console.log('📩 Foreground:', remoteMessage);
      const data = remoteMessage.data as { [key: string]: string };
      PushNotification.localNotification({
        channelId: 'default',
        title: data?.title || 'Notificación',
        message: data?.body || 'Tienes una notificación que atender en tu Grupo de Apoyo',
      });
    });

    // Background
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('📩 Background:', remoteMessage);
      const data = remoteMessage.data as { [key: string]: string };
      PushNotification.localNotification({
        channelId: 'default',
        title: data?.title || 'Notificación',
        message: data?.body || 'Tienes una notificación que atender en tu Grupo de Apoyo',
      });
    });

    // From quit
    const initial = await messaging().getInitialNotification();
    if (initial) {
      console.log('📩 Desde cerrada:', initial);
      Alert.alert(
        initial.notification?.title || 'Notificación',
        initial.notification?.body || 'Tienes una notificación que atender en tu Grupo de Apoyo'
      );
    }
  }
};
