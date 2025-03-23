import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import { Platform, Alert } from 'react-native';

export const NotificationService = {
  initialize: async () => {
    const CHANNEL_ID = 'taptalk_alertas';

    PushNotification.createChannel(
      {
        channelId: CHANNEL_ID,
        channelName: 'Alertas TapTalk',
        importance: 4,
      },
      (created) => console.log(`🟢 Canal ${created ? 'creado' : 'ya existente'}`)
    );

    const showLocalNotification = (title: string, message: string) => {
      PushNotification.localNotification({
        channelId: CHANNEL_ID,
        title: title || 'Notificación',
        message: message || 'Tienes una notificación que atender en tu Grupo de Apoyo',
        importance: 'max',
        priority: 'high',
        vibrate: true,
        playSound: true,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_notification',
      });
    };

    const token = await messaging().getToken();
    console.log('📱 Token FCM:', token);

    PushNotification.configure({
      onNotification: (notification) => {
        console.log('📬 Notificación recibida por el sistema:', notification);
      },
    });

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await messaging().requestPermission();
      if (
        granted !== messaging.AuthorizationStatus.AUTHORIZED &&
        granted !== messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('🔴 Notificaciones no autorizadas por el usuario');
      }
    }

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

    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        console.log('🔴 Permiso de notificaciones denegado en iOS');
      }
    }

    // Foreground
    messaging().onMessage(async (remoteMessage) => {
      console.log('📩 Foreground:', remoteMessage);
      const title = remoteMessage.notification?.title || '';
      const message = remoteMessage.notification?.body || '';
      showLocalNotification(title, message);
    });

    // Background
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('📩 Background:', remoteMessage);
      const title = remoteMessage.notification?.title || '';
      const message = remoteMessage.notification?.body || '';
      showLocalNotification(title, message);
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
