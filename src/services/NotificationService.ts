import messaging from '@react-native-firebase/messaging'

export const NotificationService = {
  // Solicitar permisos para recibir notificaciones
  requestPermission: async (): Promise<boolean> => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    return enabled
  },

  // Manejar la recepción de notificaciones
  onNotificationReceived: (callback: (message: any) => void) => {
    return messaging().onMessage(async (remoteMessage) => {
      callback(remoteMessage)
    })
  },

  // Opcional: Suscribirse a notificaciones en segundo plano
  onNotificationOpenedApp: (callback: (message: any) => void) => {
    return messaging().onNotificationOpenedApp((remoteMessage) => {
      callback(remoteMessage)
    })
  },
}
