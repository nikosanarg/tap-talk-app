export interface IPictogram {
  id: string;
  nombre: string;
  imagenUrl: string;
  fechaCreacion: any;
  usos: number;
  activo: boolean;
}

export interface PictogramsProps {
  Comida: IPictogram[]
  Gente: IPictogram[]
  Acciones: IPictogram[]
  Salud: IPictogram[]
}