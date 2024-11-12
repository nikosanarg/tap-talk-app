import { FieldValue, Timestamp } from "@react-native-firebase/firestore";

export interface INotification {
  id?: string;
  grupoId: string;
  pictogramaId: string;
  titulo: string;
  miembroResolutor: string | null;
  fechaCreacion: Timestamp | FieldValue;
  fechaResuelta: Timestamp | FieldValue | null;
}
