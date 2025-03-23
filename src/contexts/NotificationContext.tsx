import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSupportGroup } from './SupportGroupContext';
import { INotification } from '../types/Notification';

interface NotificationContextType {
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  deleteAllNotifications: () => Promise<void>;
  deleteResolvedNotifications: () => Promise<void>;
  fromSnapshot: React.MutableRefObject<boolean>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { supportGroup } = useSupportGroup();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const fromSnapshot = useRef(false);

  const fetchNotifications = async () => {
    if (!supportGroup) {
      console.log("🚫 No hay un Grupo de apoyo almacenado en la caché:", supportGroup);
      return;
    }
    try {
      const notificationsSnapshot = await firestore()
        .collection('Notificaciones')
        .where('grupoId', '==', supportGroup.id)
        .orderBy('fechaCreacion', 'desc')
        .get();

      const fetchedNotifications = notificationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as INotification[];

      console.log(`📩 Notificaciones descargadas para el grupo "${supportGroup.id}"`);
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error("🚫 Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    if (!supportGroup?.id) return;

    fetchNotifications(); // ✅ Carga inicial

    const unsubscribe = firestore()
      .collection('Notificaciones')
      .where('grupoId', '==', supportGroup.id)
      .orderBy('fechaCreacion', 'desc')
      .onSnapshot(snapshot => {
        fromSnapshot.current = true; // 🔥 Cambios en vivo vienen del snapshot
        const fetchedNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as INotification[];

        console.log(`🔔 Notificaciones actualizadas para el grupo "${supportGroup.id}"`);
        setNotifications(fetchedNotifications);
      }, error => {
        console.error("🚫 Error en la suscripción de notificaciones:", error);
      });

    return () => unsubscribe();
  }, [supportGroup?.id]);

  const deleteAllNotifications = async () => {
    fromSnapshot.current = false;
    if (!supportGroup) return;
    try {
      const notificationsSnapshot = await firestore()
        .collection('Notificaciones')
        .where('grupoId', '==', supportGroup.id)
        .get();

      const batch = firestore().batch();
      notificationsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("✅ Todas las notificaciones eliminadas.");
    } catch (error) {
      console.error("🚫 Error al eliminar notificaciones:", error);
    }
  };

  const deleteResolvedNotifications = async () => {
    fromSnapshot.current = false;
    if (!supportGroup) return;
    try {
      const notificationsSnapshot = await firestore()
        .collection('Notificaciones')
        .where('grupoId', '==', supportGroup.id)
        .where('fechaResuelta', '!=', null)
        .get();

      const batch = firestore().batch();
      notificationsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("✅ Notificaciones resueltas eliminadas.");
    } catch (error) {
      console.error("🚫 Error al eliminar notificaciones resueltas:", error);
    }
  };
  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, deleteAllNotifications, deleteResolvedNotifications, fromSnapshot, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
