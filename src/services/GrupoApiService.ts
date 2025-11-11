import { config } from '../config/config';
import { apiClient } from '../utils/apiClient';

export const BASE_URL = `${config.API_URL}/api/grupos`;

interface Miembro {
  id: string;
  nombre: string;
  pendingCount?: number;
}

export interface AuxiliarGrupo {
  id: string;
  user_id: string;
  grupo_id: number;
  es_administrador: boolean;
  fecha_vinculacion: string;
  nombre?: string; // Agregado del JOIN con auxiliar
}

export interface Grupo {
  id: number;                    // SERIAL PRIMARY KEY en la base de datos
  codigo_vinculacion: string;    // VARCHAR(16) NOT NULL UNIQUE
  nombre_paciente: string;       // VARCHAR(100) NOT NULL
  creador_id: string;            // VARCHAR(100) (UUID) REFERENCES auxiliar(user_id)
  fecha_creacion: string;        // TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  activo?: boolean;              // BOOLEAN NOT NULL DEFAULT TRUE
  es_administrador?: boolean;    // Del JOIN con auxiliar_grupo
  es_creador?: boolean;          // Del JOIN con auxiliar_grupo
  fecha_vinculacion?: string;    // Del JOIN con auxiliar_grupo
  miembros?: Miembro[];
}

export const GrupoApiService = {
  async getAll(): Promise<Grupo[]> {
    const res = await apiClient.get(BASE_URL);
    if (!res.ok) throw new Error('Error al obtener grupos');
    return res.json();
  },

  async getById(id: number): Promise<Grupo> {
    const res = await apiClient.get(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Grupo no encontrado');
    return res.json();
  },

  async getByAuxiliar(auxiliarId: string): Promise<Grupo[]> {
    const res = await fetch(`${config.API_URL}/api/auxiliares-grupos/${auxiliarId}/grupos`);
    if (!res.ok) throw new Error('Error al obtener grupos del auxiliar');
    return res.json();
  },

  async create(grupo: Omit<Grupo, 'id'>): Promise<Grupo> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grupo),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al crear grupo:', errorText);
      throw new Error('Error al crear grupo');
    }

    const data = await res.json();
    console.log('✅ [APP] Grupo creado:', data);
    return data;
  },

  async update(id: number, grupo: Partial<Grupo>): Promise<Grupo> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grupo),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al actualizar grupo:', errorText);
      throw new Error('Error al actualizar grupo');
    }

    return res.json();
  },

  async getByCodigo(codigoVinculacion: string): Promise<Grupo | null> {
    const res = await fetch(`${BASE_URL}/codigo/${codigoVinculacion}`);
    
    if (res.status === 404) {
      return null; // Grupo no encontrado
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [APP] Error al buscar grupo por código:', errorText);
      throw new Error('Error al buscar grupo');
    }

    return res.json();
  },
};