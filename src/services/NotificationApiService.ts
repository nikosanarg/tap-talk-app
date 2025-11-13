import { config } from '../config/config';
import { apiClient } from '../utils/apiClient';
import { INotification } from '../types/Notification';
const BASE_URL = `${config.API_URL}/api/notificaciones`;

export const NotificationApiService = {
  async getAll(): Promise<INotification[]> {
    const res = await apiClient.get(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener notificaciones');
    return res.json();
  },

  async getById(id: number): Promise<INotification> {
    const res = await apiClient.get(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Notificación no encontrada');
    return res.json();
  },

  async create(notification: Omit<INotification, 'id'>): Promise<INotification> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al crear notificación:', errorText);
      throw new Error('Error al crear notificación');
    }

    const data = await res.json();
    console.log('✅ [APP] Notificación creada:', data);

    return data;
  },

  async update(id: number, notification: Partial<INotification>): Promise<INotification> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    if (!res.ok) throw new Error('Error al actualizar notificación');
    return res.json();
  },

  async remove(id: number): Promise<{ mensaje: string; notificacion: INotification }> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar notificación');
    return res.json();
  },
};

export default NotificationApiService;