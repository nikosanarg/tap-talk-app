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
  const { supportGroup, setSupportGroup, fetchGroupMembers, deleteGroupById, updateGroupName, removeGroupMember } = useSupportGroup();
  const { deleteAllNotifications } = useNotifications();
  const [members, setMembers] = useState<Array<{ id: string; nombre: string }>>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [groupName, setGroupName] = useState(supportGroup?.nombreAsistido || '');

  useEffect(() => {
    fetchMembers();
  }, [supportGroup?.miembros]);

  const fetchMembers = async () => {
    try {
      if (!supportGroup?.miembros || supportGroup.miembros.length === 0) {
        setMembers([]);
        setErrorMessage("No hay miembros en el grupo.");
        return;
      }
      const usersSnapshot = await fetchGroupMembers(supportGroup.miembros);
      const fetchedMembers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre || '',
      }));
      setMembers(fetchedMembers);
    } catch (error) {
      setErrorMessage("Hubo un problema buscando los miembros del grupo");
      console.error("🚫 Error al obtener los miembros:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      if (supportGroup?.id) {
        await removeGroupMember(supportGroup.id, memberId)
        setSupportGroup(prevGroup => ({
          ...prevGroup!,
          miembros: prevGroup!.miembros.filter(id => id !== memberId)
        }));
        setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
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
        nombreAsistido: groupName
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

      Alert.alert("Grupo eliminado", `El grupo de ${supportGroup.nombreAsistido} ha sido eliminado.`);
      console.log(`🚮 Grupo ${supportGroup.id} eliminado.`);
      setSupportGroup(null);
      navigation.navigate('SupportGroupMenu');
    } catch (error) {
      console.error("🚫 Error al eliminar el grupo:", error);
      setErrorMessage("Error al eliminar el grupo.");
    }
  };

  const confirmDeleteGroup = () => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el grupo de ${supportGroup?.nombreAsistido}? Esta acción es permanente e irreversible.`,
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
          {members.length > 0 ? (
            members.map(member => (
              <AssistCard member={member} callback={() => handleRemoveMember(member.id)} key={member.id} />
            ))
          ) : (
            <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
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
