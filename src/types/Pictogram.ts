export interface IPictogram {
  id: string;
  nombre: string;
  icono?: string;
  imagenUrl?: string;
  fechaCreacion?: any;
  usos: number;
  activo: boolean;
}

export interface PictogramsProps {
  Basicas: IPictogram[]
  Emociones: IPictogram[]
  Social: IPictogram[]
  Actividades: IPictogram[]
  Preferencias: IPictogram[]
  Ayuda: IPictogram[]
}