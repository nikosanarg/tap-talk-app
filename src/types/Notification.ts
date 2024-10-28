import { Timestamp } from "@react-native-firebase/firestore";

export interface INotification {
  id: string;
  categoria: string;
  grupoId: string;
  titulo: string;
  mensaje: string;
  resuelta: boolean;
  miembroResolutor: string | null;
  fechaCreacion: Timestamp;
  fechaResuelta: Timestamp | null;
}
