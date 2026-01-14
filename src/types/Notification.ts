export interface INotification {
  id: number;                        // SERIAL PRIMARY KEY
  pictograma_id: number;             // INTEGER NOT NULL (FK to pictograma)
  grupo_id: number;                  // INTEGER NOT NULL (FK to grupo)
  contenido: string;                 // VARCHAR(255) NOT NULL
  tipo: string;                      // VARCHAR(50) NOT NULL DEFAULT 'PICTOGRAMA'
  estado: string;                    // VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE'
  fecha_hora: string;                // TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  activo?: boolean;                  // BOOLEAN NOT NULL DEFAULT TRUE
  
  // Campos calculados/extras para compatibilidad con UI
  titulo?: string;                   // Derivado de contenido para UI
  categoria?: string;                // Derivado para UI
  fecha_creacion?: string;           // Alias de fecha_hora
  fecha_resuelta?: string | null;    // Derivado de estado
}
