import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, SupportText } from '../../styles/auth';
import { ActionButtonText, MenuActionButton } from '../../styles/buttons';
import { SupportGroupListContainer } from '../../styles/supportGroup';
import { useUser } from '../../contexts/UserContext';
import AssistCard from '../../components/AssistCard';
import firestore from '@react-native-firebase/firestore';
import { IFirestoreSupportGroup } from '../../types/SupportGroup';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/header/Header';
import { useSupportGroup } from '../../contexts/SupportGroupContext';

type SupportGroupMenuScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupMenu'>;

const SupportGroupMenuScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupMenuScreenNavProp>();
  const { user } = useUser();
  const { supportGroup, setSupportGroup } = useSupportGroup()
  const [groups, setGroups] = useState<IFirestoreSupportGroup[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('recentFirst');

  const fetchGroups = async () => {
    if (!user?.uid) {
      console.log("🚫 Error: Usuario no autenticado");
      setErrorMessage("Error: Usuario no autenticado.");
      return;
    }

    try {
      const querySnapshot = await firestore()
        .collection('Grupos')
        .where('miembros', 'array-contains', user.uid)
        .get();

      const fetchedGroups: IFirestoreSupportGroup[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as IFirestoreSupportGroup[];

      const sortedGroups = sortGroups(fetchedGroups, sortOption);
      setGroups(sortedGroups);
      console.log("🎭 Grupos obtenidos correctamente y ordenados:", sortedGroups.map(sg => sg.nombreAsistido));
    } catch (error) {
      console.error("🚫 Error al obtener los grupos:", error);
      setErrorMessage("Error al cargar los grupos.");
    }
  };

  const sortGroups = (groups: IFirestoreSupportGroup[], option: string) => {
    switch (option) {
      case 'nameAZ':
        return groups.sort((a, b) => a.nombreAsistido.localeCompare(b.nombreAsistido));
      case 'nameZA':
        return groups.sort((a, b) => b.nombreAsistido.localeCompare(a.nombreAsistido));
      case 'recentFirst':
        return groups.sort((a, b) => (b.fechaCreacion?.seconds || 0) - (a.fechaCreacion?.seconds || 0));
      case 'oldestFirst':
        return groups.sort((a, b) => (a.fechaCreacion?.seconds || 0) - (b.fechaCreacion?.seconds || 0));
      default:
        return groups;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [user?.uid, sortOption])
  );
  
  const handleJoinGroup = () => {
    navigation.navigate('JoinGroup');
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleClickGroup = (group: IFirestoreSupportGroup) => {
    console.log(`🟢 Navegando a la Home del Grupo "${group.id}" (${group.nombreAsistido})`);
    setSupportGroup(group)
    navigation.navigate('SupportGroupHome');
  };

  return (
    <SafeAreaView>
      <Header />

      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <StyledContextualView>
          <MenuActionButton onPress={handleJoinGroup}>
            <ActionButtonText>Unirse a un grupo existente</ActionButtonText>
          </MenuActionButton>
          <MenuActionButton onPress={handleCreateGroup}>
            <ActionButtonText>Crear nuevo grupo</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>

        <StyledContextualView>
          <Picker
            selectedValue={sortOption}
            onValueChange={(value) => setSortOption(value)}
            style={{ width: '80%', backgroundColor: '#e7e4e0', borderRadius: 10 }}
          >
            <Picker.Item label="Más recientes primero" value="recentFirst" />
            <Picker.Item label="Más antiguos primero" value="oldestFirst" />
            <Picker.Item label="Ordenar por nombre (A→Z)" value="nameAZ" />
            <Picker.Item label="Ordenar por nombre (Z→A)" value="nameZA" />
          </Picker>
        </StyledContextualView>

        {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}

        <SupportGroupListContainer>
          {groups.length > 0 ? (
            groups.map(group => (
              <AssistCard group={group} callback={() => handleClickGroup(group)} key={group.id} />
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
