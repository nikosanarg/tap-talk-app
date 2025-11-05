export type NotificationEstado = 'PENDIENTE' | 'RESUELTA' | 'BORRADA';
export type NotificationType = 'PICTOGRAMA' | 'AYUDA';

export interface INotification {
  id: number;                    // SERIAL PRIMARY KEY
  activo: boolean;               // BOOLEAN NOT NULL DEFAULT TRUE
  grupo_id: number;              // INTEGER NOT NULL (FK to grupo)
  pictograma_id: number;         // INTEGER NOT NULL (FK to pictograma)
  contenido: string;             // VARCHAR(255) NOT NULL
  estado: NotificationEstado;    // VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE'
  fecha_hora: Date;              // TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  tipo: NotificationType;        // VARCHAR(50) NOT NULL DEFAULT 'PICTOGRAMA'
}
