import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, SupportText } from '../../styles/auth';
import { ActionButtonText, MenuActionButton } from '../../styles/buttons';
import { LogoutActionButton, SupportGroupListContainer } from '../../styles/supportGroup';
import { useUser } from '../../contexts/UserContext';
import { SupportGroupHeaderContainer } from '../../styles/supportGroup';
import SupportGroupCard from '../../components/SupportGroupCard';
import firestore from '@react-native-firebase/firestore';
import { IFirestoreSupportGroup } from '../../types/SupportGroup';

type SupportGroupMenuScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupMenu'>;

const SupportGroupMenuScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupMenuScreenNavProp>();
  const { user } = useUser();
  const [groups, setGroups] = useState<IFirestoreSupportGroup[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      console.log("🚫 Error: Usuario no autenticado");
      setErrorMessage("Error: Usuario no autenticado.");
      return;
    }

    const fetchGroups = async () => {
      try {
        console.log(`🟢 Buscando grupos para el usuario UID=${user.uid}`);
        const querySnapshot = await firestore()
          .collection('Grupos')
          .where('miembros', 'array-contains', user.uid)
          .get();

        const fetchedGroups: IFirestoreSupportGroup[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as IFirestoreSupportGroup[];

        setGroups(fetchedGroups);
        console.log("✅ Grupos obtenidos correctamente:", fetchedGroups);
      } catch (error) {
        console.error("🚫 Error al obtener los grupos:", error);
        setErrorMessage("Error al cargar los grupos.");
      }
    };

    fetchGroups();
  }, [user?.uid]);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  };

  const handleJoinGroup = () => {
    navigation.navigate('JoinGroup');
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <StyledContextualView>
          <SupportGroupHeaderContainer>
            <SupportText>{`¡Hola${user?.nombre ? `, ${user.nombre}` : ''}!`}</SupportText>
            <LogoutActionButton onPress={handleLogout}>
              <ActionButtonText>Cerrar sesión</ActionButtonText>
            </LogoutActionButton>
          </SupportGroupHeaderContainer>
        </StyledContextualView>

        <StyledContextualView>
          <MenuActionButton onPress={handleJoinGroup}>
            <ActionButtonText>Unirse a un grupo existente</ActionButtonText>
          </MenuActionButton>
          <MenuActionButton onPress={handleCreateGroup}>
            <ActionButtonText>Crear nuevo grupo</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>

        {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}

        <SupportGroupListContainer>
          {groups.length > 0 ? (
            groups.map(group => (
              <SupportGroupCard key={group.id} group={group} />
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 10 }}>No estás unido a ningún grupo.</Text>
          )}
        </SupportGroupListContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupMenuScreen;
