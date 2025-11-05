export interface IPictogram {
  id: number;              
  nombre: string;          
  imagen_url?: string;     
  categoria_id: number;    
  activo: boolean;         
  icono?: string;          
  usos: number;            
}

export interface PictogramsProps {
  Basicas: IPictogram[]
  Emociones: IPictogram[]
  Social: IPictogram[]
  Actividades: IPictogram[]
  Preferencias: IPictogram[]
  Ayuda: IPictogram[]
}