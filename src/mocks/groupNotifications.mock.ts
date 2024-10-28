import { INotification } from "../types/Notification";
import { Timestamp } from "@react-native-firebase/firestore";

export const groupNotificationsMock: Array<INotification> = [
  {
    id: '1',
    categoria: 'A',
    titulo: 'Desayuno',
    grupoId: 'XE2atLh950J4XlBf0biv',
    resuelta: false,
    miembroResolutor: null,
    mensaje: 'Es hora del desayuno.',
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setMinutes(new Date().getMinutes() - 5))), // hace 5 minutos
    fechaResuelta: null,
  },
  {
    id: '2',
    categoria: 'S',
    titulo: 'Medicamento',
    grupoId: 'XE2atLh950J4XlBf0biv',
    resuelta: true,
    miembroResolutor: 'John Doe',
    mensaje: 'Recordatorio de tomar el medicamento.',
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 2))), // hace 2 horas
    fechaResuelta: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 30))), // hace 1.5 horas
  },
  {
    id: '3',
    categoria: 'S',
    titulo: 'Abrazo',
    grupoId: 'XE2atLh950J4XlBf0biv',
    resuelta: false,
    miembroResolutor: null,
    mensaje: 'Recordatorio de dar un abrazo.',
    fechaCreacion: Timestamp.fromDate(new Date(new Date().setHours(new Date().getHours() - 9))), // hace 9 horas
    fechaResuelta: null,
  },
];
