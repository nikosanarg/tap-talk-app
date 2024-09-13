import React from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ReturnButton, ReturnText, ScreenView } from '../../styles/common';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ButtonsAuthContainer, ButtonSupportText, LinkFacebookAuthButton, LinkGoogleAuthButton} from '../../styles/auth';
import { SupportTexAuthContainer, SupportText } from '../../styles/support';

type RoleSelectionScreenNavProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

function RoleSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<RoleSelectionScreenNavProp>()

  const handleClickAuthGoogle = () => {
    console.log('Autenticando con google')  
  }

  const handleClickAuthFacebook = () => {
    // navigation.navigate('SupportGroupUserInit')
    console.log('Autenticación con Facebook deshabilitada temporalmente')
  }
  
  const handleGoBack = () => {
    navigation.goBack()
  }

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTexAuthContainer>
            <SupportText>Elige el método de autenticación</SupportText>
            <SupportText>En caso de no estar registrado, se te pedirá hacerlo</SupportText>
          </SupportTexAuthContainer>

          <ButtonsAuthContainer>
            <LinkGoogleAuthButton onPress={handleClickAuthGoogle}>
              <ButtonSupportText>Ingresa con Google</ButtonSupportText>
            </LinkGoogleAuthButton>
            <LinkFacebookAuthButton onPress={handleClickAuthFacebook}>
              <ButtonSupportText>Ingresa con Facebook</ButtonSupportText>
            </LinkFacebookAuthButton>
          </ButtonsAuthContainer>

          <ReturnButton onPress={handleGoBack}>
            <ReturnText>Volver</ReturnText>
          </ReturnButton>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RoleSelectionScreen
