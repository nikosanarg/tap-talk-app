import { INotification } from "../types/Notification";
import { Timestamp } from "@react-native-firebase/firestore";

export const groupNotificationsMock: Array<INotification> = [
  {
    id: '1',
    categoria: 'Comida',
    titulo: 'Desayuno',
    pictogramaId: 'string',
    grupoId: 'string',
    miembroResolutor: null,
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setMinutes(new Date().getMinutes() - 5))), // hace 5 minutos
    fechaResuelta: null,
  },
  {
    id: '2',
    categoria: 'Salud',
    titulo: 'Medicamento',
    pictogramaId: 'string',
    grupoId: 'string',
    miembroResolutor: 'string',
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 2))), // hace 2 horas
    fechaResuelta: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 30))), // hace 1.5 horas
  },
  {
    id: '3',
    categoria: 'Gente',
    titulo: 'Abrazo',
    pictogramaId: 'string',
    grupoId: 'string',
    miembroResolutor: null,
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 9))), // hace 9 horas
    fechaResuelta: null,
  },
  {
    id: '4',
    categoria: 'Acciones',
    titulo: 'Abrazo',
    pictogramaId: 'string',
    grupoId: 'string',
    miembroResolutor: null,
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 12))), // hace 12 horas
    fechaResuelta: null,
  },
];
