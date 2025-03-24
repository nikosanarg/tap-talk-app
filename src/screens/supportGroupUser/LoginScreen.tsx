import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput } from 'react-native';
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
import messaging from '@react-native-firebase/messaging';
import { useCategories } from '../../contexts/CategoriesContext';

type LoginScreenNavProp = StackNavigationProp<RootStackParamList, 'Login'>;

function LoginScreen(): React.JSX.Element {
  const navigation = useNavigation<LoginScreenNavProp>();
  const { setUser } = useUser();
  const { initCategoriesAndPictograms, loading, error } = useCategories();

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

  const requestNotificationPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('🟢 Permiso para notificaciones otorgado:', authStatus);
    } else {
      console.warn('⚠️ Permiso para notificaciones denegado');
    }
  };

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
      await initCategoriesAndPictograms();

      const deviceToken = await messaging().getToken();
      console.log('📲 Device token obtenido:', deviceToken);
      await firestore().collection('Usuarios').doc(authenticatedUser.user.uid).update({
        deviceToken,
      });
      console.log('✅ Token del dispositivo registrado en Firestore');
      requestNotificationPermission();

      navigation.navigate('SupportGroupMenu');
    } catch (error: any) {
      console.log(`🚫 Login: Error | ${emailInput}`, error);
      setErrorMessage('🚫 ' + error.message);
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

  if (error) {
    return (
      <SafeAreaView>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
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
