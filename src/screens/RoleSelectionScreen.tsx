import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text } from 'react-native';
import TapTalkTrademark from '../components/TapTalkTrademark';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenView, TextView, TitleText } from '../styles/common';
import { AssistedUserRoleButton, StyledContextualView } from '../styles/auth';
import { ButtonText, LinkButton } from '../styles/buttons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCategories } from '../contexts/CategoriesContext';
import { useSupportGroup } from '../contexts/SupportGroupContext';
import { useBackendIp } from '../contexts/BackendIpContext';
import { GrupoApiService } from '../services/GrupoApiService';

type RoleSelectionScreenNavProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

function RoleSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<RoleSelectionScreenNavProp>();
  const { initCategoriesAndPictograms, loading, error } = useCategories();
  const { setSupportGroup } = useSupportGroup();
  const { backendIp } = useBackendIp();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || !backendIp || loading) return;
    const checkGroupId = async () => {
      const groupId = await AsyncStorage.getItem('groupId');
      if (groupId) {
        try {
          const group = await GrupoApiService.getById(parseInt(groupId));
          if (group) {
            setSupportGroup(group);
            const initStatus = await initCategoriesAndPictograms();

            if (initStatus) {
              navigation.navigate('Categories');
            } else {
              console.warn("La IP del backend aún no está disponible.");
            }
            setInitialized(true);
          } else {
            console.error('🚫 Error: el grupo ya no existe');
            await AsyncStorage.removeItem('groupId');
          }
        } catch (error: any) {
          console.error('🚫 Error al obtener el grupo:', error);
          
          // Si es error de autenticación, limpiar datos y permitir selección de rol
          if (error.message === 'UNAUTHORIZED') {
            console.log('🔄 Sesión expirada, limpiando datos locales');
            await AsyncStorage.removeItem('groupId');
            setInitialized(true); // Permitir que se muestre la pantalla de selección de rol
          } else {
            await AsyncStorage.removeItem('groupId');
          }
        }
      } else {
        // No hay groupId guardado, mostrar pantalla de selección
        setInitialized(true);
      }
    };
    checkGroupId();
  }, [navigation, backendIp, initCategoriesAndPictograms, setSupportGroup, initialized]);

  const handleClickRoleAssistedUser = () => {
    navigation.navigate('Link');
  };

  const handleClickRoleSupportGroup = () => {
    navigation.navigate('Login');
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
          <TapTalkTrademark fontSize='44px' />

          <StyledContextualView>
            <TextView>
              <TitleText>Para el usuario bajo cuidado</TitleText>
            </TextView>
            <AssistedUserRoleButton onPress={handleClickRoleAssistedUser}>
              <ButtonText>Usuario asistido</ButtonText>
            </AssistedUserRoleButton>
          </StyledContextualView>

          <StyledContextualView>
            <TextView>
              <TitleText>Para miembros del grupo de ayuda o terapia</TitleText>
            </TextView>
            <LinkButton onPress={handleClickRoleSupportGroup}>
              <ButtonText>Grupo de apoyo</ButtonText>
            </LinkButton>
          </StyledContextualView>
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default RoleSelectionScreen;
