import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, Alert, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../contexts/UserContext';
import { StyledAuthTextInput, StyledContextualView, SupportText } from '../../../styles/auth';
import { HeaderBoldTitle, SupportGroupListContainer } from '../../../styles/supportGroup';
import { ActionButtonText, DangerActionButton, MenuActionButton } from '../../../styles/buttons';
import Header from '../../../components/header/Header';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { useSupportGroup } from '../../../contexts/SupportGroupContext';
import firestore from '@react-native-firebase/firestore';
import AssistCard from '../../../components/AssistCard';

type SupportGroupEditScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupEdit'>;

const SupportGroupEditScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupEditScreenNavProp>();
  const { user } = useUser();
  const { supportGroup, setSupportGroup } = useSupportGroup();
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

      const usersSnapshot = await firestore()
        .collection('Usuarios')
        .where(firestore.FieldPath.documentId(), 'in', supportGroup.miembros)
        .get();

      const fetchedMembers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Array<{ id: string; nombre: string }>;

      console.log("Miembros obtenidos:", fetchedMembers);
      setMembers(fetchedMembers);
    } catch (error) {
      setErrorMessage("Hubo un problema buscando los miembros del grupo");
      console.error("🚫 Error al obtener los miembros:", error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      if (supportGroup?.id) {
        await firestore()
          .collection('Grupos')
          .doc(supportGroup.id)
          .update({
            miembros: firestore.FieldValue.arrayRemove(memberId)
          });

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
    if (!groupName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío.");
      return;
    }

    try {
      await firestore()
        .collection('Grupos')
        .doc(supportGroup?.id)
        .update({
          nombreAsistido: groupName
        });

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
      const notificationsSnapshot = await firestore()
        .collection('Notificaciones')
        .where('grupoId', '==', supportGroup.id)
        .get();

      const batch = firestore().batch();
      notificationsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      await firestore()
        .collection('Grupos')
        .doc(supportGroup.id)
        .delete();

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
