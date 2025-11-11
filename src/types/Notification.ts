export interface INotification {
  id: number;                        // SERIAL PRIMARY KEY
  pictograma_id: number;             // INTEGER NOT NULL (FK to pictograma)
  titulo: string;                    // VARCHAR(255) NOT NULL
  categoria: string;                 // VARCHAR(100) NOT NULL
  fecha_creacion: string;            // TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  grupo_id: number;                  // INTEGER NOT NULL (FK to grupo)
  fecha_resuelta?: string | null;    // TIMESTAMP - nullable
  miembro_resolutor?: string | null; // VARCHAR(255) - nullable
}
