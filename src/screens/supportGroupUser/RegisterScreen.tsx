import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import auth from '@react-native-firebase/auth';
import ReturnButton from '../../components/ReturnButton';
import firestore from '@react-native-firebase/firestore';

type RegisterScreenNavProp = StackNavigationProp<RootStackParamList, 'Register'>;

function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<RegisterScreenNavProp>();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (passwordInput !== confirmPassword) {
      console.log(`🚫 Registro: Las contraseñas no coinciden`);
      setErrorMessage('🚫 Las contraseñas no coinciden');
      return;
    }
    if (usernameInput.length < 4) {
      console.log(`🚫 Registro: username debe tener más de 4 letras`);
      setErrorMessage('🚫 Registro: El nombre debe tener más de 4 letras');
      return;
    }
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(emailInput, passwordInput);
      const user = userCredential.user;
      await firestore()
        .collection('Usuarios')
        .doc(user.uid)
        .set({
          email: user.email,
          nombre: usernameInput,
          rol: 'support',
          activo: true,
          fechaCreacion: firestore.FieldValue.serverTimestamp(),
          authProvider: 'Default'
        });
      console.log('✅ Registro y guardado en Firestore exitoso');
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(`🚫 Registro: Error | ${emailInput} >> ${JSON.stringify(error)}`);
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTextAuthContainer>
            <SupportText>Usá tu correo electrónico y una contraseña</SupportText>
          </SupportTextAuthContainer>
          <StyledAuthTextInput
            placeholder="Tu nombre"
            value={usernameInput}
            onChangeText={setUsernameInput}
          />
          <StyledAuthTextInput
            placeholder="Correo electrónico"
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
          />
          <StyledAuthTextInput
            placeholder="Contraseña"
            value={passwordInput}
            onChangeText={setPasswordInput}
            secureTextEntry
          />
          <StyledAuthTextInput
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <StyledContextualView>
            <StyledAuthButton onPress={handleRegister}>
              <ButtonSupportText>Registrarse</ButtonSupportText>
            </StyledAuthButton>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          </StyledContextualView>

          <ReturnButton screenName="Login" />
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RegisterScreen;
