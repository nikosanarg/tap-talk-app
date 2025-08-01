const BASE_URL = 'http://10.0.2.2:3000/api/auxiliares';

export interface Auxiliar {
  id?: string;
  activo: boolean;
  auth_provider?: string | null;
  fecha_creacion: string;
  email: string;
  nombre: string;
}

export const AuxiliarApiService = {
  async getAll(): Promise<Auxiliar[]> {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener auxiliares');
    return res.json();
  },

  async getById(id: string): Promise<Auxiliar> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Auxiliar no encontrado');
    return res.json();
  },

  async create(auxiliar: Auxiliar): Promise<Auxiliar> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auxiliar),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al crear auxiliar:', errorText);

      throw new Error('Error al crear auxiliar');
    }

    const data = await res.json();
    console.log('✅ [APP] Auxiliar creado:', data);

    return data;
  },

  async update(id: string, auxiliar: Auxiliar): Promise<Auxiliar> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(auxiliar),
    });
    if (!res.ok) throw new Error('Error al actualizar auxiliar');
    return res.json();
  },

  async remove(id: string): Promise<{ mensaje: string; auxiliar: Auxiliar }> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar auxiliar');
    return res.json();
  },
};

export default AuxiliarApiService;
