import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IFirestoreSupportMember } from '../types/SupportGroup';
import { Grupo, GrupoApiService, BASE_URL } from '../services/GrupoApiService';
import { AuxiliarApiService, Auxiliar } from '../services/AuxiliarApiService';

interface SupportGroupContextType {
  supportGroup: Grupo | null;
  fetchGroupByCode: (groupCode: string) => Promise<Grupo | null>;

  setSupportGroup: React.Dispatch<React.SetStateAction<Grupo | null>>;
  deleteGroupById: (groupId: string) => Promise<void>;
  updateGroupName: (groupId: string, newName: string) => Promise<void>;
  removeGroupMember: (groupId: string, memberId: string) => Promise<void>;
}

const SupportGroupContext = createContext<SupportGroupContextType | undefined>(undefined);

export const SupportGroupProvider = ({ children }: { children: ReactNode }) => {
  const [supportGroup, setSupportGroup] = useState<Grupo | null>(null);

  const fetchGroupByCode = async (groupCode: string): Promise<Grupo | null> => {
    try {
      const groups = await GrupoApiService.getAll();
      const group = groups.find(g => g.codigo_vinculacion === groupCode);
      
      if (!group) {
        console.log("🌵 No se encontró el grupo.");
        return null;
      }

      setSupportGroup(group);
      return group;
    } catch (error) {
      console.error(`🚫 Error al buscar el grupo con el código ${groupCode}:`, error);
      throw new Error('Error al obtener el grupo. Por favor, inténtelo de nuevo.');
    }
  };



  const deleteGroupById = async (groupId: string): Promise<void> => {
    try {
      console.warn('deleteGroupById no está implementado en la API');
      console.log(`🚮 Intento de eliminar Grupo ${groupId}`);
      if (supportGroup?.id === groupId) {
        setSupportGroup(null);
      }
    } catch (error: any) {
      console.error("🚫 Error al eliminar el grupo:", error);
      throw new Error(error.message || "Error al intentar eliminar el grupo de apoyo.");
    }
  };

  const updateGroupName = async (groupId: string, newName: string): Promise<void> => {
    try {
      await GrupoApiService.update(groupId, { nombre_paciente: newName });
      console.log(`✅ Nombre del paciente actualizado a: ${newName}`);
    } catch (error) {
      console.error("🚫 Error al actualizar el nombre del paciente:", error);
      throw new Error("Error al actualizar el nombre del paciente.");
    }
  };

  const removeGroupMember = async (groupId: string, memberId: string): Promise<void> => {
    try {
      const res = await fetch(`${BASE_URL}/${groupId}/auxiliares/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('� Error al eliminar miembro:', errorText);
        throw new Error('No se pudo eliminar el miembro del grupo');
      }

      console.log(`✅ Miembro ${memberId} eliminado del grupo ${groupId}`);
    } catch (error) {
      console.error("🚫 Error al eliminar el miembro:", error);
      throw new Error("Error al eliminar el miembro del grupo.");
    }
  };

  return (
    <SupportGroupContext.Provider
      value={{
        supportGroup,
        fetchGroupByCode,

        setSupportGroup,
        deleteGroupById,
        updateGroupName,
        removeGroupMember,
      }}
    >
      {children}
    </SupportGroupContext.Provider>
  );
};

export const useSupportGroup = () => {
  const context = useContext(SupportGroupContext);
  if (!context) {
    throw new Error('useSupportGroup must be used within a SupportGroupProvider');
  }
  return context;
};
