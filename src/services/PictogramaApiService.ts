import { config } from '../config/config';
import { apiClient } from '../utils/apiClient';
const BASE_URL = `${config.API_URL}/api/pictogramas`;

export interface Pictograma {
  id: number;               // SERIAL en BD
  nombre: string;
  imagen_url?: string | null;   // columna 'imagen_url' en BD
  categoria_id?: number | null;
  activo?: boolean;         // default true en BD
  icono?: string | null;
  usos?: number;            // default 0 en BD
}

export const PictogramaApiService = {
  async getAll(): Promise<Pictograma[]> {
    const res = await apiClient.get(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener pictogramas');
    return res.json();
  },

  async getById(id: number): Promise<Pictograma> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Pictograma no encontrado');
    return res.json();
  },

  async create(pictograma: Omit<Pictograma, 'id'>): Promise<Pictograma> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pictograma),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al crear pictograma:', errorText);
      throw new Error('Error al crear pictograma');
    }

    const data = await res.json();
    console.log('✅ [APP] Pictograma creado:', data);
    return data;
  },

  async update(id: number, pictograma: Partial<Pictograma>): Promise<Pictograma> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pictograma),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al actualizar pictograma:', errorText);
      throw new Error('Error al actualizar pictograma');
    }

    const data = await res.json();
    console.log('✅ [APP] Pictograma actualizado:', data);
    return data;
  },

  async remove(id: number): Promise<{ mensaje: string; pictograma: Pictograma }> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar pictograma');
    return res.json();
  },

  // (Opcional) Utilidades comunes al dominio:
  async getByCategoria(categoriaId: number): Promise<Pictograma[]> {
    const res = await fetch(`${BASE_URL}?categoria_id=${categoriaId}`);
    if (!res.ok) throw new Error('Error al filtrar pictogramas por categoría');
    return res.json();
  },
};

export default PictogramaApiService;