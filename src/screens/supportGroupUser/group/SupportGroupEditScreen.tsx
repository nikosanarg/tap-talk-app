import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, Alert, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StyledAuthTextInput, StyledContextualView, SupportText } from '../../../styles/auth';
import { HeaderBoldTitle, SupportGroupListContainer } from '../../../styles/supportGroup';
import { ActionButtonText, DangerActionButton, MenuActionButton } from '../../../styles/buttons';
import Header from '../../../components/header/Header';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useSupportGroup } from '../../../contexts/SupportGroupContext';
import AssistCard from '../../../components/AssistCard';
import { useNotifications } from '../../../contexts/NotificationContext';

type SupportGroupEditScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupEdit'>;

const SupportGroupEditScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupEditScreenNavProp>();
  const { supportGroup, setSupportGroup, deleteGroupById, updateGroupName, removeGroupMember } = useSupportGroup();
  const { deleteAllNotifications } = useNotifications();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [groupName, setGroupName] = useState(supportGroup?.nombre_paciente || '');

  console.log('🔍 [EDIT] supportGroup:', JSON.stringify(supportGroup, null, 2));
  console.log('🔍 [EDIT] supportGroup.miembros:', supportGroup?.miembros);
  console.log('🔍 [EDIT] miembros length:', supportGroup?.miembros?.length);

  const handleRemoveMember = async (memberId: string) => {
    try {
      if (supportGroup?.id) {
        await removeGroupMember(supportGroup.id, memberId)
        setSupportGroup(prevGroup => ({
          ...prevGroup!,
          miembros: prevGroup?.miembros?.filter(m => m.id !== memberId) || []
        }));

        console.log(`🚮 Miembro ${memberId} eliminado del grupo.`);
      }
    } catch (error) {
      console.error("🚫 Error al eliminar el miembro:", error);
      setErrorMessage("Error al eliminar el miembro.");
    }
  };

  const handleSaveGroupName = async () => {
    if (!supportGroup) {
      console.log("🚫 No hay un Grupo de apoyo almacenado en la caché:", supportGroup);
      return
    }
    if (!groupName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }
    try {
      await updateGroupName(supportGroup?.id, groupName);
      setSupportGroup(prevGroup => ({
        ...prevGroup!,
        nombre_paciente: groupName
      }));
      Alert.alert("Éxito", "El nombre del usuario asistido ha sido actualizado.");
      console.log(`✅ Nombre del asistido actualizado a: ${groupName}`);
    } catch (error) {
      console.error("🚫 Error al actualizar el nombre del usuario asistido:", error);
      setErrorMessage("Error al actualizar el nombre del usuario asistido.");
    }
  };
  const handleDeleteGroup = async () => {
    if (!supportGroup?.id) return;
    try {
      await deleteAllNotifications();
      await deleteGroupById(supportGroup.id);

      Alert.alert("Grupo eliminado", `El grupo de ${supportGroup.nombre_paciente} ha sido eliminado.`);
      console.log(`🚮 Grupo ${supportGroup.id} eliminado.`);
      setSupportGroup(null);
      navigation.navigate('SupportGroupMenu');
    } catch (error) {
      console.error("🚫 Error al eliminar el grupo:", error);
      setErrorMessage("Error al eliminar el grupo.");
    }
  };

  const confirmDeleteGroup = () => {
    const memberCount = supportGroup?.miembros?.length || 0;
    const hasMultipleMembers = memberCount > 1;
    
    const title = hasMultipleMembers 
      ? "⚠️ Grupo con múltiples miembros" 
      : "Confirmar eliminación";
    
    const message = hasMultipleMembers
      ? `Este grupo tiene ${memberCount} miembros. Si lo eliminas, todos los miembros perderán acceso al grupo de ${supportGroup?.nombre_paciente}.\n\n¿Estás seguro de que deseas continuar? Esta acción es permanente e irreversible.`
      : `¿Estás seguro de que deseas eliminar el grupo de ${supportGroup?.nombre_paciente}? Esta acción es permanente e irreversible.`;
    
    Alert.alert(
      title,
      message,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: handleDeleteGroup },
      ]
    );
  };

  const handleGoToHome = () => {
    navigation.navigate('SupportGroupHome');
  };

  return (
    <SafeAreaView>
      <Header />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HeaderBoldTitle>Configuración de grupo</HeaderBoldTitle>

        <StyledContextualView>
          <SupportText style={{ fontSize: 18, marginVertical: 16 }}>Nombre del usuario asistido</SupportText>
          <StyledAuthTextInput
            placeholder="Nuevo nombre"
            placeholderTextColor="#88B"
            value={groupName}
            onChangeText={setGroupName}
          />
          <MenuActionButton onPress={handleSaveGroupName}>
            <ActionButtonText>Guardar nombre</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>

        <SupportText style={{ fontSize: 18, marginVertical: 16 }}>Miembros del grupo</SupportText>

        <SupportGroupListContainer>
            {supportGroup?.miembros && supportGroup.miembros.length > 0 ? (
            supportGroup.miembros.map(member => (
              <AssistCard 
              key={member.id}
              member={member} 
              pendingCount={member.pendingCount || 0} 
              callback={() => handleRemoveMember(member.id)} 
              />
            ))
            ) : (
            <Text style={{ color: 'red', textAlign: 'center' }}>No hay miembros en el grupo.</Text>
            )}
        </SupportGroupListContainer>

        <StyledContextualView>
          <DangerActionButton onPress={confirmDeleteGroup}>
            <ActionButtonText>Eliminar grupo</ActionButtonText>
          </DangerActionButton>
          <MenuActionButton onPress={handleGoToHome}>
            <ActionButtonText>Ir al menú</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupEditScreen;
