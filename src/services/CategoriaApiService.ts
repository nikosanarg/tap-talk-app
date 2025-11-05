import { config } from '../config/config';
const BASE_URL = `${config.API_URL}/api/categorias`;

export interface Categoria {
  id: string;          // alfanumérico de Supabase
  nombre: string;       // obligatorio
  imagen?: string;      // opcional
  color?: string;       // default "000000"
}

export const CategoriaApiService = {
  async getAll(): Promise<Categoria[]> {
    const session = await fetch(`${config.API_URL}/api/auth/session`);
    const sessionData = await session.json();

    if (!sessionData.success || !sessionData.session?.access_token) {
      throw new Error('Usuario no autenticado api service');
    }

    const res = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${sessionData.session.access_token}`
      }
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Usuario no autenticado api service - 401');
      }
      throw new Error('Error al obtener categorías');
    }
    
    return res.json();
  },

  async getById(id: string): Promise<Categoria> {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Categoría no encontrada');
    return res.json();
  },

  async create(categoria: Categoria): Promise<Categoria> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al crear categoría:', errorText);
      throw new Error('Error al crear categoría');
    }

    const data = await res.json();
    console.log('✅ [APP] Categoría creada:', data);
    return data;
  },

  async update(id: string, categoria: Partial<Categoria>): Promise<Categoria> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoria),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al actualizar categoría:', errorText);
      throw new Error('Error al actualizar categoría');
    }

    return res.json();
  },

  async remove(id: number): Promise<{ mensaje: string; categoria: Categoria }> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al eliminar categoría:', errorText);
      throw new Error('Error al eliminar categoría');
    }

    return res.json();
  },
};

export default CategoriaApiService;