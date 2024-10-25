import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ReturnButton, ReturnText, ScreenView } from '../../styles/common';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ButtonsAuthContainer, ButtonSupportText, LinkLoginButton, LinkRegisterButton } from '../../styles/auth';
import { SupportTexAuthContainer, SupportText } from '../../styles/support';
import auth from '@react-native-firebase/auth';

type LoginScreenNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavProp>();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginFirebase = async () => {
    try {
      await auth().signInWithEmailAndPassword(emailInput, passwordInput);
      console.log(`✅ Login: Éxito | ${emailInput} | ${passwordInput}`);
      navigation.navigate('SupportGroupMenu');
    } catch (error: any) {
      console.log(`🚫 Login: Error | ${emailInput} >> ${JSON.stringify(error)}`);
      setErrorMessage(error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTexAuthContainer>
            <SupportText>Autenticate con tu correo electrónico y contraseña</SupportText>
          </SupportTexAuthContainer>

          <ButtonsAuthContainer>
            <TextInput
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <TextInput
              value={passwordInput}
              onChangeText={setPasswordInput}
              placeholder="Contraseña"
              secureTextEntry
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <LinkLoginButton onPress={handleLoginFirebase}>
              <ButtonSupportText>Iniciar sesión</ButtonSupportText>
            </LinkLoginButton>
            <LinkRegisterButton onPress={handleGoToRegisterScreen}>
              <ButtonSupportText>No tengo cuenta</ButtonSupportText>
            </LinkRegisterButton>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          </ButtonsAuthContainer>

          <ReturnButton onPress={handleGoBack}>
            <ReturnText>Volver</ReturnText>
          </ReturnButton>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginScreen;
