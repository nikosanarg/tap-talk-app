import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { 
  StyledContextualView, 
  ButtonSupportText, 
  StyledAuthButton, 
  StyledAuthTextInput, 
  SupportTextAuthContainer, 
  SupportText 
} from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { AuthService } from '../../services/AuthService';
import { AuxiliarApiService } from '../../services/AuxiliarApiService';

type RegisterScreenNavProp = StackNavigationProp<RootStackParamList, 'Register'>;

function RegisterScreen(): React.JSX.Element {
  const navigation = useNavigation<RegisterScreenNavProp>();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    console.log(`➡️ Registro: Intentando registrar usuario con email: ${emailInput}`);
    
    // Validaciones locales
    if (passwordInput !== confirmPassword) {
      console.log(`🚫 Registro: Las contraseñas no coinciden`);
      setErrorMessage('🚫 Las contraseñas no coinciden');
      return;
    }
    if (usernameInput.length < 4) {
      console.log(`🚫 Registro: username debe tener más de 4 letras`);
      setErrorMessage('🚫 El nombre debe tener más de 4 letras');
      return;
    }
    if (emailInput.length < 4) {
      console.log(`🚫 Registro: email debe tener más de 4 letras`);
      setErrorMessage('🚫 El email debe tener más de 4 letras');
      return;
    }

    try {
      // Registro usando el servicio de autenticación
      console.log(`➡️ Registro: Creando usuario con email: ${emailInput}`);
      await AuthService.registerUser(emailInput, passwordInput, usernameInput);

      console.log('✅ Registro exitoso');
      
      console.log('✅ Registro en API exitoso');
      navigation.navigate('Login');
    } catch (error: any) {
      console.log(`🚫 Registro: Error | ${emailInput} >> ${JSON.stringify(error)}`);
      setErrorMessage(error.message || 'Error durante el registro');
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
            placeholderTextColor="#88B"
            value={usernameInput}
            onChangeText={setUsernameInput}
          />
          <StyledAuthTextInput
            placeholder="Correo electrónico"
            placeholderTextColor="#88B"
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
          />
          <StyledAuthTextInput
            placeholder="Contraseña"
            placeholderTextColor="#88B"
            value={passwordInput}
            onChangeText={setPasswordInput}
            secureTextEntry
          />
          <StyledAuthTextInput
            placeholder="Confirmar contraseña"
            placeholderTextColor="#88B"
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