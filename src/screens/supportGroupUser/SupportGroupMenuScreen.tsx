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
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/header/Header';
import { useSupportGroup } from '../../contexts/SupportGroupContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { GrupoApiService, Grupo } from '../../services/GrupoApiService';

type SupportGroupMenuScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupMenu'>;

const SupportGroupMenuScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupMenuScreenNavProp>();
  const { user } = useUser();
  const { supportGroup, setSupportGroup } = useSupportGroup()
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('recentFirst');
  const { getPendingNotificationCounts } = useNotifications();

  const [pendingCounts, setPendingCounts] = useState<Record<number, number>>({});

  const fetchGroups = async () => {
    console.log("🔄 Fetching groups for user:", user);
    if (!user?.user_id) {
      console.log("🚫 Error: Usuario no autenticado screen");
      setErrorMessage("Error: Usuario no autenticado screen.");
      return;
    }

    try {
      console.log("🔍 Obteniendo grupos para el auxiliar con ID:", user.user_id);
      const fetchedGroups = await GrupoApiService.getByAuxiliar(user.user_id);
console.log("🔍 Grupos obtenidos:", fetchedGroups.map(g => g.nombre_paciente));
      const sortedGroups = sortGroups(fetchedGroups, sortOption);
      console.log("🔍 Grupos ordenados:", sortedGroups.map(g => g.nombre_paciente));
      setGroups(sortedGroups);
      console.log("🎭 Grupos obtenidos correctamente y ordenados:", sortedGroups.map(sg => sg.nombre_paciente));
    } catch (error) {
      console.error("🚫 Error al obtener los grupos:", error);
      setErrorMessage("Error al cargar los grupos.");
    }
  };

  const sortGroups = (groups: Grupo[], option: string) => {
    switch (option) {
      case 'nameAZ':
        return groups.sort((a, b) => a.nombre_paciente.localeCompare(b.nombre_paciente));
      case 'nameZA':
        return groups.sort((a, b) => b.nombre_paciente.localeCompare(a.nombre_paciente));
      case 'recentFirst':
        return groups.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());
      case 'oldestFirst':
        return groups.sort((a, b) => new Date(a.fecha_creacion).getTime() - new Date(b.fecha_creacion).getTime());
      default:
        return groups;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadGroupsAndCounts = async () => {
        await fetchGroups(); // actualiza `groups`
      };
      loadGroupsAndCounts();
    }, [user?.user_id, sortOption])
  );
  
  useEffect(() => {
    const loadCounts = async () => {
      const groupIds = groups.map(g => g.id);
      const counts = await getPendingNotificationCounts(groupIds);
      setPendingCounts(counts);
    };
    if (groups.length > 0) loadCounts();
  }, [groups]);
  
  const handleJoinGroup = () => {
    navigation.navigate('JoinGroup');
  };

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroup');
  };

  const handleClickGroup = async (group: Grupo) => {
    console.log(`🟢 Navegando a la Home del Grupo "${group.id}" (${group.nombre_paciente})`);
    try {
      // Cargar el grupo completo con sus miembros
      const fullGroup = await GrupoApiService.getById(group.id);
      console.log(`🔍 Grupo completo cargado con ${fullGroup.miembros?.length || 0} miembros`);
      setSupportGroup(fullGroup);
      navigation.navigate('SupportGroupHome');
    } catch (error) {
      console.error('🚫 Error al cargar el grupo completo:', error);
      setErrorMessage('Error al cargar los detalles del grupo');
    }
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
            style={{ width: '70%', height: '18%', backgroundColor: '#d7d4d0', color: '#243396' }}
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
              <AssistCard group={group} callback={() => handleClickGroup(group)} key={group.id} pendingCount={pendingCounts[group.id] || 0}/>
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
