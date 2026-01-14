export interface ISupabaseUser {
  // El id de la tabla auxiliar (SERIAL) no lo usamos en el front
  user_id: string;        // UUID del usuario en auth.users
  email: string;          // VARCHAR(150) NOT NULL UNIQUE
  nombre: string;         // VARCHAR(100) NOT NULL
  activo: boolean;        // BOOLEAN NOT NULL DEFAULT TRUE
  fechaCreacion: string;  // TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
}
