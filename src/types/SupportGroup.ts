export interface IFirestoreSupportMember {
  id: string;
  nombre: string;
}

// Esta interfaz ya no se usa, usar Grupo de GrupoApiService en su lugar
// La mantenemos por compatibilidad mientras se completa la migración
export interface IFirestoreSupportGroup {
  id: string;
  activo: boolean;
  codigo_vinculacion: string;
  creador_id: string;
  fecha_creacion: string;
  miembros?: string[];
  nombre_paciente: string;
  pictogramasPersonalizados?: string[];
}