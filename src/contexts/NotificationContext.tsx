import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useSupportGroup } from './SupportGroupContext';
import { INotification } from '../types/Notification';

interface NotificationContextType {
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  fetchNotifications: () => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const { supportGroup } = useSupportGroup();
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    if (supportGroup?.id) {
      fetchNotifications();
    }
  }, [supportGroup]);

  const fetchNotifications = async () => {
    if (!supportGroup) {
      console.log("🚫 No hay un Grupo de apoyo almacenado en la caché:", supportGroup);
      return
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
        
      console.log(`📩 Notificaciones para el Grupo "${supportGroup.id}" (${fetchedNotifications.length})`);
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.log("🚫 Error al obtener notificaciones:", error);
    }
  };
  

  const deleteAllNotifications = async () => {
    if (!supportGroup) return;
    
    try {
      const notificationsCollection = firestore()
        .collection('Notificaciones')
        .where('grupoId', '==', supportGroup.id);

      const notificationsSnapshot = await notificationsCollection.get();
      notificationsSnapshot.forEach(doc => doc.ref.delete());
      
      setNotifications([]);
      console.log("✅ Notificaciones eliminadas exitosamente para el grupo", supportGroup.id);
    } catch (error) {
      console.error("🚫 Error al eliminar notificaciones:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, fetchNotifications, deleteAllNotifications }}>
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
