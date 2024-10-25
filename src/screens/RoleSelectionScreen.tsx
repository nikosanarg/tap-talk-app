import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import TapTalkTrademark from '../components/TapTalkTrademark'
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenView, TextView, TitleText } from '../styles/common';
import { AssistedUserRoleButton, StyledContextualView } from '../styles/auth';
import { ButtonText, LinkButton } from '../styles/buttons';

type RoleSelectionScreenNavProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

function RoleSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<RoleSelectionScreenNavProp>()

  const handleClickRoleAssistedUser = () => {
    navigation.navigate('AssistedUserInit')
  }

  const handleClickRoleSupportGroup = () => {
    navigation.navigate('Login')
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
  )
}

export default RoleSelectionScreen
