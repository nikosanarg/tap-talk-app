export interface FirestoreUser {
  uid: string
  email: string | null
  nombre: string | null
  authProvider: string
  rol?: 'apoyo' | 'asistido'
  activo?: boolean
  fechaCreacion?: Date
  grupoIDs?: string[]
  pictogramasFavoritos?: string[]
}