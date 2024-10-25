import React from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, SupportText, SupportTextAuthContainer } from '../../styles/auth';
import { ActionButtonText, GroupActionButton, LogoutActionButton, MenuActionButton } from '../../styles/buttons';
import { GroupCard, GroupSubtitle, GroupTextContainer, GroupTitle } from '../../styles/assistCard';
import { useUser } from '../../contexts/UserContext';

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
          <SupportTextAuthContainer>
            <SupportText>{`¡Hola${user?.nombre ? `, ${user.nombre}` : ''}!`}</SupportText>
          </SupportTextAuthContainer>
          <LogoutActionButton onPress={handleLogout}>
            <ActionButtonText>Cerrar sesión</ActionButtonText>
          </LogoutActionButton>
        </StyledContextualView>

        {mockGroups.map(group => (
          <GroupCard key={group.id}>
            <GroupTextContainer>
              <GroupTitle>Asistiendo a {group.name}</GroupTitle>
              <GroupSubtitle>desde {group.date}</GroupSubtitle>
            </GroupTextContainer>
            <GroupActionButton>
              <ActionButtonText>➡️</ActionButtonText>
            </GroupActionButton>
          </GroupCard>
        ))}
        <StyledContextualView>
          <MenuActionButton onPress={handleJoinGroup}>
            <ActionButtonText>Unirse a un grupo existente</ActionButtonText>
          </MenuActionButton>
          <MenuActionButton onPress={handleCreateGroup}>
            <ActionButtonText>Crear nuevo grupo</ActionButtonText>
          </MenuActionButton>
        </StyledContextualView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportGroupMenuScreen;
