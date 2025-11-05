import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenView } from '../../styles/common';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { 
  StyledContextualView, 
  ButtonSupportText, 
  StyledAuthButton, 
  StyledAuthTextInput, 
  AuthSecondaryButton, 
  SupportTextAuthContainer, 
  SupportText 
} from '../../styles/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../contexts/UserContext';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { AuthService } from '../../services/AuthService';
import { useCategories } from '../../contexts/CategoriesContext';


type LoginScreenNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavProp>();
  const { setUser } = useUser();
  const { initCategoriesAndPictograms, loading, error: categoriesError } = useCategories();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadStoredEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('@lastEmail');
        if (storedEmail) {
          setEmailInput(storedEmail);
        }
      } catch (error) {
        console.log('🚫 Error cargando el email almacenado asíncronamente:', error);
      }
    };
    loadStoredEmail();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await AuthService.loginUser(emailInput, passwordInput);
      await AsyncStorage.setItem('@lastEmail', emailInput);
      
      setUser(user);
      console.log(`✅ Login exitoso`, JSON.stringify(user));
      await initCategoriesAndPictograms();

      navigation.navigate('SupportGroupMenu');
    } catch (error: any) {
      console.log(`🚫 Login: Error | ${emailInput}`, error);
      setErrorMessage('🚫 ' + (error.message || 'Error durante el inicio de sesión'));
    }
  };

  const handleGoToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  if (loading) {
    return (
      <SafeAreaView>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (categoriesError) {
    return (
      <SafeAreaView>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{categoriesError}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTextAuthContainer>
            <SupportText>Autenticate con tu correo electrónico y contraseña</SupportText>
          </SupportTextAuthContainer>

          <StyledAuthTextInput
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
            placeholder="Correo electrónico"
            placeholderTextColor="#88B"
          />
          <StyledAuthTextInput
            value={passwordInput}
            onChangeText={setPasswordInput}
            placeholder="Contraseña"
            placeholderTextColor="#88B"
            secureTextEntry
          />

          <StyledContextualView>
            <StyledAuthButton onPress={handleLogin}>
              <ButtonSupportText>Iniciar sesión</ButtonSupportText>
            </StyledAuthButton>
            <AuthSecondaryButton onPress={handleGoToRegisterScreen}>
              <ButtonSupportText>No tengo cuenta</ButtonSupportText>
            </AuthSecondaryButton>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          </StyledContextualView>

          <ReturnButton screenName="RoleSelection" />
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default LoginScreen;