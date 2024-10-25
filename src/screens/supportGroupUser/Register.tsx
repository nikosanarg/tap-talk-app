import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ButtonsAuthContainer, ButtonSupportText, LinkRegisterButton } from '../../styles/auth';
import { ScreenView, ReturnButton, ReturnText } from '../../styles/common';
import auth from '@react-native-firebase/auth';
import { SupportTexAuthContainer, SupportText } from '../../styles/support';

type RegisterScreenNavProp = StackNavigationProp<RootStackParamList, 'Register'>;

function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<RegisterScreenNavProp>();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (passwordInput !== confirmPassword) {
      console.log(`🚫 Registro: Las contraseñas no coinciden`);
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }
    try {
      await auth().createUserWithEmailAndPassword(emailInput, passwordInput);
      console.log(`✅ Registro: Éxito | ${emailInput} | ${passwordInput}`);
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(`🚫 Registro: Error | ${emailInput} >> ${JSON.stringify(error)}`);
      setErrorMessage(error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
        <SupportTexAuthContainer>
            <SupportText>Usá tu correo electrónico y una contraseña</SupportText>
          </SupportTexAuthContainer>
          <ButtonsAuthContainer>
            <TextInput
              placeholder="Correo electrónico"
              value={emailInput}
              onChangeText={setEmailInput}
              keyboardType="email-address"
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <TextInput
              placeholder="Contraseña"
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <TextInput
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
            />
            <LinkRegisterButton onPress={handleRegister}>
              <ButtonSupportText>Registrarse</ButtonSupportText>
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

export default RegisterScreen;
