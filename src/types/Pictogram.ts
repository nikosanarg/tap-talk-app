export interface IPictogram {
  id: number;                    // SERIAL PRIMARY KEY
  nombre: string;                // VARCHAR(100) NOT NULL
  imagen_url?: string | null;    // VARCHAR(255) - nullable (nombre en BD: 'imagen_url')
  categoria_id?: number | null;  // INTEGER - nullable (FK to categoria)
  activo?: boolean;              // BOOLEAN DEFAULT TRUE
  icono?: string | null;         // VARCHAR(100) - nullable
  usos?: number;                 // INTEGER DEFAULT 0
}

export interface PictogramsProps {
  Basicas: IPictogram[]
  Emociones: IPictogram[]
  Social: IPictogram[]
  Actividades: IPictogram[]
  Preferencias: IPictogram[]
  Ayuda: IPictogram[]
}