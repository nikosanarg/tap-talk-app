import { config } from '../config/config';
import { apiClient } from '../utils/apiClient';
const BASE_URL = `${config.API_URL}/api/notificaciones`;

export interface Notification {
  id: number;                           // SERIAL en BD
  pictograma_id: number;
  titulo: string;
  categoria: string;
  fecha_creacion: string;               // timestamp en BD
  grupo_id: number;
  fecha_resuelta?: string | null;       // timestamp nullable en BD
  miembro_resolutor?: string | null;    // VARCHAR nullable en BD
}

export const NotificationApiService = {
  async getAll(): Promise<Notification[]> {
    const res = await apiClient.get(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener notificaciones');
    return res.json();
  },

  async getById(id: number): Promise<Notification> {
    const res = await apiClient.get(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Notificación no encontrada');
    return res.json();
  },

  async create(notification: Omit<Notification, 'id'>): Promise<Notification> {
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

  async update(id: number, notification: Partial<Notification>): Promise<Notification> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    if (!res.ok) throw new Error('Error al actualizar notificación');
    return res.json();
  },

  async remove(id: number): Promise<{ mensaje: string; notificacion: Notification }> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar notificación');
    return res.json();
  },
};

export default NotificationApiService;