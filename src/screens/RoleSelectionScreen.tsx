import React from 'react'
import { ActivityIndicator, SafeAreaView, ScrollView } from 'react-native'
import TapTalkTrademark from '../components/TapTalkTrademark'
import { useNavigation } from '@react-navigation/native';
import { ScreenView, TextView, TitleText } from '../styles/common';
import { AssistedUserRoleButton, StyledContextualView } from '../styles/auth';
import { ButtonText, LinkButton } from '../styles/buttons';
import { Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCategories } from '../contexts/CategoriesContext';

type RoleSelectionScreenNavProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

function RoleSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<RoleSelectionScreenNavProp>()
  const { categories, loading, error } = useCategories();

  const handleClickRoleAssistedUser = () => {
    navigation.navigate('Link')
  };

  const handleClickRoleSupportGroup = () => {
    navigation.navigate('Login')
  };

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <TapTalkTrademark fontSize='44px' />

          <StyledContextualView>
            <TextView>
              <TitleText>Para el usuario bajo cuidado</TitleText>
            </TextView>
            <AssistedUserRoleButton onPress={handleClickRoleAssistedUser}>
              <ButtonText>Usuario asistido</ButtonText>
            </AssistedUserRoleButton>
          </StyledContextualView>

          <StyledContextualView>
            <TextView>
              <TitleText>Para miembros del grupo de ayuda o terapia</TitleText>
            </TextView>
            <LinkButton onPress={handleClickRoleSupportGroup}>
              <ButtonText>Grupo de apoyo</ButtonText>
            </LinkButton>
          </StyledContextualView>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RoleSelectionScreen;