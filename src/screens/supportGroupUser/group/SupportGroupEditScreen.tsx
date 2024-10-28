import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../contexts/UserContext';
import { StyledContextualView, SupportText } from '../../../styles/auth';
import { HeaderBoldTitle, SupportGroupListContainer } from '../../../styles/supportGroup';
import { ActionButtonText, MenuActionButton } from '../../../styles/buttons';
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

  const handleGoToHome = () => {
    navigation.navigate('SupportGroupHome');
  };

  return (
    <SafeAreaView>
      <Header user={user} handleLogout={() => navigation.reset({ index: 0, routes: [{ name: 'RoleSelection' }] })} />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <HeaderBoldTitle>Configuración de grupo</HeaderBoldTitle>

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
          <MenuActionButton onPress={handleGoToHome}>
            <ActionButtonText>Ir al menú</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupEditScreen;
