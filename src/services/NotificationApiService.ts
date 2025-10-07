//const BASE_URL = 'http://10.0.2.2:3000/api/notificaciones';
const BASE_URL = 'http://192.168.1.37:3000/api/notificaciones';  //ESTO FUE POR USAR EL CELULAR DE EMULADOR

export interface Notification {
  id: number;
  pictograma_id: number;
  titulo: string;
  categoria: string;
  fecha_creacion: string;
  grupo_id: number;
  fecha_resuelta: string | null;
  miembro_resolutor: string | null;
}

export const NotificationApiService = {
  async getAll(): Promise<Notification[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener notificaciones');
    return res.json();
  },

  async getById(id: string): Promise<Notification> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Notificación no encontrada');
    return res.json();
  },

  async create(notification: Notification): Promise<Notification> {
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

  async update(id: string, notification: Notification): Promise<Notification> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notification),
    });
    if (!res.ok) throw new Error('Error al actualizar notificación');
    return res.json();
  },

  async remove(id: string): Promise<{ mensaje: string; notificacion: Notification }> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar notificación');
    return res.json();
  },
};

export default NotificationApiService;