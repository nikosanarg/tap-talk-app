export interface IFirestoreUser {
  uid: string
  email: string | null
  nombre: string | null
  authProvider: string
  rol?: 'support' | 'assisted'
  activo?: boolean
  fechaCreacion?: Date
  grupoIDs?: string[]
  pictogramasFavoritos?: string[]
}