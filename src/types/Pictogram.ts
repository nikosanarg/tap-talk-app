export interface IPictogram {
  id: string;
  nombre: string;
  icono: string | null;
}

export interface PictogramsProps {
  Comida: IPictogram[]
  Gente: IPictogram[]
  Acciones: IPictogram[]
  Salud: IPictogram[]
}