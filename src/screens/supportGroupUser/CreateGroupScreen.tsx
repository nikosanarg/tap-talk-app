import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { StyledContextualView, ButtonSupportText, StyledAuthButton, StyledAuthTextInput, SupportTextAuthContainer, SupportText } from '../../styles/auth';
import { ScreenView } from '../../styles/common';
import { useUser } from '../../contexts/UserContext';
import ReturnButton from '../../components/returnButton/ReturnButton';
import { GrupoApiService } from '../../services/GrupoApiService';
import { config } from '../../config/config';

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

    if (!assistedUserName.trim()) {
      setErrorMessage('Por favor, ingresa el nombre del usuario asistido');
      return;
    }

    console.log(`🟣 Iniciando Creación de Grupo: assistedUser=${assistedUserName} | creadorId=${user.user_id}`);
  
    try {
      // Crear el grupo usando directamente el user_id (UUID)
      const nuevoGrupo = await GrupoApiService.create({
        creador_id: user.user_id, // Pasamos el UUID directamente
        nombre_paciente: assistedUserName.trim(),
        codigo_vinculacion: '', // Se genera en el backend
        fecha_creacion: new Date().toISOString()
      });
  
      console.log(`✅ Grupo creado exitosamente:`, nuevoGrupo);
      setErrorMessage('');
      navigation.navigate('SupportGroupMenu');
    } catch (error: any) {
      console.error('🚫 Error al crear el grupo: ', error);
      
      // Capturar mensaje específico del backend
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error al crear el grupo. Intenta nuevamente.');
      }
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
            placeholderTextColor="#88B"
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
