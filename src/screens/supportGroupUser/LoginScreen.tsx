import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ScreenView } from '../../styles/common';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, AuthSecondaryButton, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { IFirestoreUser } from '../../types/User';

type LoginScreenNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavProp>();
  const { user, setUser } = useUser();
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

  const handleLoginFirebase = async () => {
    try {
      const authenticatedUser = await auth().signInWithEmailAndPassword(emailInput, passwordInput);
      if (!authenticatedUser) {
        console.log(`🚫 Login: Error | ${emailInput} | userCredential:`, authenticatedUser);
        setErrorMessage(`🚫 Login: Error autenticando en el servicio de Firebase `);
        return
      }
      await AsyncStorage.setItem('@lastEmail', emailInput);
      const userDocument = await firestore().collection('Usuarios').doc(authenticatedUser.user.uid).get();
      if (!userDocument.exists) {
        console.log(`🚫 Login: Error | ${emailInput} | userDocument:`, userDocument);
        setErrorMessage(`🚫 Login: Error recuperando el registro de Firestore `);
        return
      }
      const userData = userDocument.data();
      const user: IFirestoreUser = {
        uid: authenticatedUser.user.uid,
        email: userData?.email,
        nombre: userData?.nombre,
        authProvider: userData?.authProvider,
        rol: userData?.rol,
        activo: userData?.activo,
        fechaCreacion: userData?.fechaCreacion,
        grupoIDs: userData?.grupoIDs ?? [],
        pictogramasFavoritos: userData?.pictogramasFavoritos ?? []
      }
      setUser(user);
      console.log(`✅ Login exitoso`, JSON.stringify(user));
      navigation.navigate('SupportGroupMenu');
    } catch (error: any) {
      console.log(`🚫 Login: Error | ${emailInput}`, error);
      setErrorMessage('🚫 ' + error.message);
    }
  };

  const handleGoToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTextAuthContainer>
            <SupportText>Autenticate con tu correo electrónico y contraseña</SupportText>
          </SupportTextAuthContainer>

          <StyledAuthTextInput
            placeholder="Correo electrónico"
            value={emailInput}
            onChangeText={setEmailInput}
            keyboardType="email-address"
            />
          <StyledAuthTextInput
            value={passwordInput}
            onChangeText={setPasswordInput}
            placeholder="Contraseña"
            secureTextEntry
          />

          <StyledContextualView>
            <StyledAuthButton onPress={handleLoginFirebase}>
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
