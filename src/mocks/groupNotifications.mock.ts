import { INotification } from "../types/Notification";

export const groupNotificationsMock: Array<INotification> = [
  {
    id: 1,
    categoria: 'Comida',
    titulo: 'Desayuno',
    pictograma_id: 1,
    grupo_id: 1,
    miembro_resolutor: null,
    fecha_creacion: new Date(new Date().setMinutes(new Date().getMinutes() - 5)).toISOString(), // hace 5 minutos
    fecha_resuelta: null,
  },
  {
    id: 2,
    categoria: 'Salud',
    titulo: 'Medicamento',
    pictograma_id: 2,
    grupo_id: 1,
    miembro_resolutor: 'user-uuid-123',
    fecha_creacion: new Date(new Date().setHours(new Date().getHours() - 2)).toISOString(), // hace 2 horas
    fecha_resuelta: new Date(new Date().setHours(new Date().getHours() - 1, new Date().getMinutes() - 30)).toISOString(), // hace 1.5 horas
  },
  {
    id: 3,
    categoria: 'Gente',
    titulo: 'Abrazo',
    pictograma_id: 3,
    grupo_id: 1,
    miembro_resolutor: null,
    fecha_creacion: new Date(new Date().setHours(new Date().getHours() - 9)).toISOString(), // hace 9 horas
    fecha_resuelta: null,
  },
  {
    id: 4,
    categoria: 'Acciones',
    titulo: 'Abrazo',
    pictograma_id: 4,
    grupo_id: 1,
    miembro_resolutor: null,
    fecha_creacion: new Date(new Date().setHours(new Date().getHours() - 12)).toISOString(), // hace 12 horas
    fecha_resuelta: null,
  },
];
