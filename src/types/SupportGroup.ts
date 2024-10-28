import { Timestamp } from "@react-native-firebase/firestore";

export interface IFirestoreSupportGroup {
  id: string;
  activo: boolean;
  codigoInvitacion: string[16];
  creadorId: string;
  fechaCreacion: Timestamp;
  miembros: string[];
  nombreAsistido: string;
  pictogramasPersonalizados?: string[];
}

export interface IFirestoreSupportMember {
  id: string
  nombre: string | null
  fechaCreacion?: Timestamp
}