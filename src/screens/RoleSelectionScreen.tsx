import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import TapTalkTrademark from '../components/TapTalkTrademark'
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ButtonText, LinkButton, ScreenView, TextView, TitleText } from '../styles/common';

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
          <TapTalkTrademark fontSize='44px'/>
          
          <TextView>
            <TitleText>Selecciona tu perfil</TitleText>
            <TitleText>Usuario asistido: Para el usuario bajo cuidado</TitleText>
            <TitleText>Grupo de apoyo: Para miembros del grupo de ayuda o terapia</TitleText>
          </TextView>

          <LinkButton onPress={handleClickRoleAssistedUser}>
            <ButtonText>Usuario asistido</ButtonText>
          </LinkButton>
          <LinkButton onPress={handleClickRoleSupportGroup}>
            <ButtonText>Grupo de apoyo</ButtonText>
          </LinkButton>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RoleSelectionScreen
