import { Timestamp } from "@react-native-firebase/firestore"

export interface IFirestoreUser {
  uid: string
  email: string | null
  nombre: string | null
  authProvider: string
  rol?: 'support' | 'assisted'
  activo?: boolean
  fechaCreacion?: Timestamp
  grupoIDs?: string[]
  pictogramasFavoritos?: string[]
}
