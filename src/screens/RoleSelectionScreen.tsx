import React from 'react'
import { SafeAreaView, ScrollView, Text } from 'react-native'
import TapTalkTrademark from '../components/TapTalkTrademark'
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

type RoleSelectionScreenNavProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

function RoleSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<RoleSelectionScreenNavProp>()

  const handleClickRoleAssistedUser = () => {
    navigation.navigate('AssistedUserInit')
  }

  const handleClickRoleSupportGroup = () => {
    navigation.navigate('SupportGroupUserInit')
  }

  const ScreenView = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 16px;
    margin-top: 80px;
  `

  const TextView = styled.View`
    margin: 70px 0;
    width: 90%;
  `

  const TitleText = styled.Text`
    font-size: 28px;
    color: #65558F;
    margin-bottom: 16px;
    text-align: center;
  `

  const LinkButton = styled.TouchableOpacity`
    background-color: #65558F;
    border-radius: 40px;
    padding: 15px 30px;
    margin-bottom: 20px;
    align-items: center;
    justify-content: center;
    width: 80%;
  `

  const ButtonText = styled.Text`
    color: white;
    font-size: 28px;
    text-align: center;
  `

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
          <LinkButton onPress={handleClickRoleAssistedUser}><ButtonText>Usuario asistido</ButtonText></LinkButton>
          <LinkButton onPress={handleClickRoleSupportGroup}><ButtonText>Grupo de apoyo</ButtonText></LinkButton>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RoleSelectionScreen
