import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import ReturnButton from '../../components/ReturnButton';
import { generateRandomCode } from '../../utils/generateRandomCode';

type CreateGroupScreenNavProp = StackNavigationProp<RootStackParamList, 'CreateGroup'>;

function CreateGroupScreen(): React.JSX.Element {
  const navigation = useNavigation<CreateGroupScreenNavProp>();
  const { user } = useUser();
  const [assistedUserName, setAssistedUserName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateGroup = async () => {
    if (!user) {
      console.log(`🚫 No existe un User en el Context al momento de Crear un Grupo de apoyo`);
      setErrorMessage('🚫 Se perdió la información del usuario actual');
      navigation.reset({
        index: 0,
        routes: [{ name: 'RoleSelection' }],
      });
      return
    }

    console.log(user)
    console.log(`🟣 Iniciando Creación de Grupo: assistedUser=${assistedUserName} | creadorId=${user.uid}`);
  
    try {
      const groupRef = await firestore().collection('Grupos').add({
        activo: true,
        codigoInvitacion: generateRandomCode(16),
        creadorId: user.uid,
        fechaCreacion: firestore.FieldValue.serverTimestamp(),
        miembros: [user.uid],
        nombreAsistido: assistedUserName,
        pictogramasPersonalizados: [],
      });
  
      console.log(`✅ Grupo creado exitosamente. ID: ${groupRef.id}`);
      navigation.navigate('SupportGroupMenu');
    } catch (error) {
      console.error('🚫 Error al crear el grupo: ', error);
    }
  };
  

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <ScreenView>
          <SupportTextAuthContainer>
            <SupportText>Grupo de apoyo</SupportText>
            <SupportText>Por haberlo creado, serás también el primer miembro</SupportText>
          </SupportTextAuthContainer>
          
          <StyledAuthTextInput
            placeholder="Nombre del usuario asistido"
            value={assistedUserName}
            onChangeText={setAssistedUserName}
          />
          
          <StyledContextualView>
            <StyledAuthButton onPress={handleCreateGroup}>
              <ButtonSupportText>Confirmar grupo</ButtonSupportText>
            </StyledAuthButton>
            {errorMessage ? <Text style={{ color: 'red' }}>{errorMessage}</Text> : null}
          </StyledContextualView>

          <ReturnButton screenName="SupportGroupMenu" />
        </ScreenView>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateGroupScreen;
