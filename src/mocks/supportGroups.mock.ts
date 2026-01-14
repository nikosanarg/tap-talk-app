import { Grupo } from "../services/GrupoApiService";

export const mockGroups: Array<Grupo> = [
  {  
    id: 1,
    activo: true,
    codigo_vinculacion: '1111222233334444',
    creador_id: 'pOn74xLZ4ifA8baHRXFYaxhHEXZ2',
    fecha_creacion: '2024-10-26T12:15:44.293Z',
    nombre_paciente: 'Juan',
  },
  {  
    id: 2,
    activo: true,
    codigo_vinculacion: '0000000000000002',
    creador_id: 'pOn74xLZ4ifA8baHRXFYaxhHEXZ2',
    fecha_creacion: '2024-10-26T12:15:44.293Z',
    nombre_paciente: 'Maria No tocar',
  },
  {  
    id: 3,
    activo: true,
    codigo_vinculacion: '0000000000000003',
    creador_id: 'pOn74xLZ4ifA8baHRXFYaxhHEXZ2',
    fecha_creacion: '2024-10-26T12:15:44.293Z',
    nombre_paciente: 'Eusebio No tocar',
  },
];