import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, SupportText } from '../../styles/auth';
import { ActionButtonText, MenuActionButton } from '../../styles/buttons';
import { LogoutActionButton, SupportGroupListContainer } from '../../styles/supportGroup';
import { useUser } from '../../contexts/UserContext';
import { SupportGroupHeaderContainer } from '../../styles/supportGroup';
import SupportGroupCard from '../../components/SupportGroupCard';

type SupportGroupMenuScreenNavProp = StackNavigationProp<RootStackParamList, 'SupportGroupMenu'>;

const SupportGroupMenuScreen = (): React.JSX.Element => {
  const navigation = useNavigation<SupportGroupMenuScreenNavProp>();
  const { user } = useUser();

  const mockGroups = [
    { id: 1, name: 'Juan', date: '23/08/2024' },
    { id: 2, name: 'Maria', date: '21/06/2024' },
    { id: 3, name: 'Eusebio', date: '16/12/2023' },
  ];

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'RoleSelection' }],
    });
  };

  const handleJoinGroup = () => {
    // Acción para unirse a un grupo
  };

  const handleCreateGroup = () => {
    // Acción para crear un grupo nuevo
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

        <SupportGroupListContainer>
          {mockGroups.map(group => (
            <SupportGroupCard key={group.id} group={group} />
          ))}
        </SupportGroupListContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupMenuScreen;
