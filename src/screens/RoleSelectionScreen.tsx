import React, { useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text } from 'react-native';
import TapTalkTrademark from '../components/TapTalkTrademark';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenView, TextView, TitleText } from '../styles/common';
import { AssistedUserRoleButton, StyledContextualView } from '../styles/auth';
import { ButtonText, LinkButton } from '../styles/buttons';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCategories } from '../contexts/CategoriesContext';
import { useSupportGroup } from '../contexts/SupportGroupContext';
import { IFirestoreSupportGroup } from '../types/SupportGroup';

type RoleSelectionScreenNavProp = StackNavigationProp<RootStackParamList, 'RoleSelection'>;

function RoleSelectionScreen(): React.JSX.Element {
  const navigation = useNavigation<RoleSelectionScreenNavProp>();
  const { initCategoriesAndPictograms, loading, error } = useCategories();
  
  const { setSupportGroup } = useSupportGroup();

  useEffect(() => {
    const checkGroupId = async () => {
      const groupId = await AsyncStorage.getItem('groupId');
      if (groupId) {
        console.log(`🟢 Autenticación automática para el usuario asistido con groupId: ${groupId}`);
        const groupDoc = await firestore().collection('Grupos').doc(groupId).get();
        if (groupDoc.exists && groupDoc.data()) {
          const data = groupDoc.data();
          const groupData: IFirestoreSupportGroup = {
            id: groupId,
            activo: data?.activo,
            codigoInvitacion: data?.codigoInvitacion,
            creadorId: data?.creadorId,
            fechaCreacion: data?.fechaCreacion,
            miembros: data?.miembros,
            nombreAsistido: data?.nombreAsistido
          }
          setSupportGroup(groupData);
          await initCategoriesAndPictograms();
          navigation.navigate('Categories');
        } else {
          console.error('🚫 Error: el grupo ya no existe');
          await AsyncStorage.removeItem('groupId');
        }
      }
    };
    checkGroupId();
  }, [navigation]);

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
