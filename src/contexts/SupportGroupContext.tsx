import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IFirestoreSupportGroup, IFirestoreSupportMember } from '../types/SupportGroup';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface SupportGroupContextType {
  supportGroup: IFirestoreSupportGroup | null;
  fetchGroupByCode: (groupCode: string) => Promise<IFirestoreSupportGroup | null>;
  fetchGroupMembers: (memberIds: string[]) => Promise<FirebaseFirestoreTypes.QuerySnapshot>;
  setSupportGroup: React.Dispatch<React.SetStateAction<IFirestoreSupportGroup | null>>;
  deleteGroupById: (groupId: string) => Promise<void>;
  updateGroupName: (groupId: string, newName: string) => Promise<void>;
  removeGroupMember: (groupId: string, memberId: string) => Promise<void>;
}

const SupportGroupContext = createContext<SupportGroupContextType | undefined>(undefined);

export const SupportGroupProvider = ({ children }: { children: ReactNode }) => {
  const [supportGroup, setSupportGroup] = useState<IFirestoreSupportGroup | null>(null);

  const fetchGroupByCode = async (groupCode: string): Promise<IFirestoreSupportGroup | null> => {
    try {
      const snapshot = await firestore()
        .collection('Grupos')
        .where('codigoInvitacion', '==', groupCode)
        .get();

      if (snapshot.empty) {
        console.log("🌵 No se encontró el grupo.");
        return null;
      }
      const doc = snapshot.docs[0];
      const groupData = doc.data() as Omit<IFirestoreSupportGroup, 'id'>;
      const groupWithId: IFirestoreSupportGroup = { id: doc.id, ...groupData };

      setSupportGroup(groupWithId);
      return groupWithId;
    } catch (error) {
      console.error(`🚫 Error al buscar el grupo con el código ${groupCode}:`, error);
      throw new Error('Error al obtener el grupo. Por favor, inténtelo de nuevo.');
    }
  };

  const fetchGroupMembers = async (memberIds: string[]): Promise<FirebaseFirestoreTypes.QuerySnapshot> => {
    if (!memberIds || memberIds.length === 0) {
      console.log("🌵 No hay miembros en el grupo.");
      return Promise.resolve({} as FirebaseFirestoreTypes.QuerySnapshot);
    }
    try {
      return await firestore()
        .collection('Usuarios')
        .where(firestore.FieldPath.documentId(), 'in', memberIds)
        .get();
    } catch (error) {
      console.error("🚫 Error al obtener los miembros:", error);
      throw new Error("Hubo un problema buscando los miembros del grupo.");
    }
  };

  const deleteGroupById = async (groupId: string): Promise<void> => {
    try {
      await firestore().collection('Grupos').doc(groupId).delete();
      console.log(`🚮 Grupo ${groupId} eliminado.`);
    } catch (error) {
      console.error("🚫 Error al eliminar el grupo:", error);
      throw new Error("Error al intentar eliminar el grupo de apoyo.");
    }
  };

  const updateGroupName = async (groupId: string, newName: string): Promise<void> => {
    try {
      await firestore().collection('Grupos').doc(groupId).update({ nombreAsistido: newName });
      console.log(`✅ Nombre del asistido actualizado a: ${newName}`);
    } catch (error) {
      console.error("🚫 Error al actualizar el nombre del usuario asistido:", error);
      throw new Error("Error al actualizar el nombre del usuario asistido.");
    }
  };

  const removeGroupMember = async (groupId: string, memberId: string): Promise<void> => {
    try {
      await firestore().collection('Grupos').doc(groupId).update({
        miembros: firestore.FieldValue.arrayRemove(memberId),
      });
      console.log(`🚮 Miembro ${memberId} eliminado del grupo ${groupId}.`);
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
        fetchGroupMembers,
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
