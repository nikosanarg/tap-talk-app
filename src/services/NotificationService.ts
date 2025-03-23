import messaging from '@react-native-firebase/messaging';

export const NotificationService = {
  // Solicitar permisos para recibir notificaciones
  requestPermission: async (): Promise<boolean> => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  },

  // Obtener el token FCM del dispositivo
  getToken: async (): Promise<string | null> => {
    try {
      const token = await messaging().getToken();
      console.log("📱 Token FCM:", token);
      return token;
    } catch (error) {
      console.error("❌ Error obteniendo el token:", error);
      return null;
    }
  },

  // Manejar la recepción de notificaciones en primer plano
  onNotificationReceived: (callback: (message: any) => void) => {
    return messaging().onMessage(async (remoteMessage) => {
      console.log("📩 Notificación en primer plano:", remoteMessage);
      callback(remoteMessage);
    });
  },

  // Manejar la apertura de la app desde una notificación
  onNotificationOpenedApp: (callback: (message: any) => void) => {
    return messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log("📩 Notificación abrió la app:", remoteMessage);
      callback(remoteMessage);
    });
  },

  // Manejar notificaciones en segundo plano
  setBackgroundMessageHandler: () => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("📩 Notificación en segundo plano:", remoteMessage);
    });
  }
};
