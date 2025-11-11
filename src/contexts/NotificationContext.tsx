import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { useSupportGroup } from './SupportGroupContext';
import { INotification } from '../types/Notification';
import { NotificationApiService } from '../services/NotificationApiService';

interface NotificationContextType {
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  deleteAllNotifications: () => Promise<void>;
  deleteResolvedNotifications: () => Promise<void>;
  fromSnapshot: React.MutableRefObject<boolean>;
  fetchNotifications: () => Promise<void>;
  getPendingNotificationCount: (grupoId: number) => Promise<number>;
  getPendingNotificationCounts: (grupoIds: number[]) => Promise<Record<number, number>>;
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
      const allNotifications = await NotificationApiService.getAll();
      const groupNotifications = allNotifications.filter(n => n.grupo_id === supportGroup.id);
      console.log(`📩 Notificaciones descargadas para el grupo "${supportGroup.id}"`);
      setNotifications(groupNotifications);
    } catch (error) {
      console.error("🚫 Error al obtener notificaciones:", error);
    }
  };

  useEffect(() => {
    if (!supportGroup?.id) return;
    fetchNotifications();
    // TODO: Implementar polling o websocket para actualizaciones en tiempo real
  }, [supportGroup?.id]);

  const deleteAllNotifications = async () => {
    fromSnapshot.current = false;
    if (!supportGroup) return;
    try {
      const groupNotifications = notifications.filter(n => n.grupo_id === supportGroup.id);
      await Promise.all(groupNotifications.map(n => NotificationApiService.remove(n.id)));
      console.log("✅ Todas las notificaciones eliminadas.");
      setNotifications([]);
    } catch (error) {
      console.error("🚫 Error al eliminar notificaciones:", error);
    }
  };

  const deleteResolvedNotifications = async () => {
    fromSnapshot.current = false;
    if (!supportGroup) return;
    try {
      const resolvedNotifications = notifications.filter(
        n => n.grupo_id === supportGroup.id && n.fecha_resuelta !== null
      );
      await Promise.all(resolvedNotifications.map(n => NotificationApiService.remove(n.id)));
      console.log("✅ Notificaciones resueltas eliminadas.");
      setNotifications(prev => prev.filter(n => !resolvedNotifications.some(rn => rn.id === n.id)));
    } catch (error) {
      console.error("🚫 Error al eliminar notificaciones resueltas:", error);
    }
  };

  const getPendingNotificationCount = async (grupoId: number): Promise<number> => {
    try {
      const allNotifications = await NotificationApiService.getAll();
      return allNotifications.filter(n => n.grupo_id === grupoId && n.fecha_resuelta === null).length;
    } catch (error) {
      console.error("🚫 Error al obtener count de notificaciones:", error);
      return 0;
    }
  };

  const getPendingNotificationCounts = async (grupoIds: number[]): Promise<Record<number, number>> => {
    const counts: Record<number, number> = {};
    try {
      const allNotifications = await NotificationApiService.getAll();
      grupoIds.forEach(grupoId => {
        counts[grupoId] = allNotifications.filter(
          n => n.grupo_id === grupoId && n.fecha_resuelta === null
        ).length;
      });
    } catch (error) {
      console.error("🚫 Error al obtener counts de notificaciones:", error);
    }
    return counts;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      setNotifications,
      deleteAllNotifications,
      deleteResolvedNotifications,
      fromSnapshot,
      fetchNotifications,
      getPendingNotificationCount,
      getPendingNotificationCounts
    }}>
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
